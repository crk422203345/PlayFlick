<script setup lang="ts">
import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
} from 'vue'
import { ChevronDown, ChevronUp, Joystick } from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
import GameCard from '@/components/GameCard.vue'
import { gameApi, homeApi } from '@/api/modules'
import type { GameTypeApiItem } from '@/api/types'
import { allGames, gameCategories, type GameItem } from '@/data/playflick'
import {
  getErrorMessage,
  mapGameToContent,
  matchesQuery,
  type HotGameApiItem,
} from '@/utils/content'
import { externalLinks } from '@/utils/externalLinks'

const GAME_BATCH_SIZE = 20
const ALL_GAME_TYPE = '全部游戏'
const COLLAPSED_CATEGORY_COUNT = 12

type HotGameItem = GameItem & {
  id?: number
}

const props = withDefaults(
  defineProps<{
    searchQuery?: string
  }>(),
  {
    searchQuery: '',
  },
)

const fallbackGameTypes: GameTypeApiItem[] = gameCategories.map((name, index) => ({
  id: index,
  name,
}))
const gameTypes = ref<GameTypeApiItem[]>(fallbackGameTypes)
const activeGameType = ref(ALL_GAME_TYPE)
const isCategoryExpanded = ref(false)
const fetchedGames = ref<HotGameItem[]>([...allGames])
const visibleCount = ref(allGames.length)
const totalNumber = ref(allGames.length)
const nextPage = ref(1)
const isGameTypeLoading = ref(false)
const isInitialLoading = ref(false)
const isLoadingMore = ref(false)
const isCategoryTransitioning = ref(false)
const gameTypeError = ref('')
const gameError = ref('')
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let loadVersion = 0
let categoryTransitionId = 0

const pagedGames = computed(() => fetchedGames.value.slice(0, visibleCount.value))
const visibleGames = computed(() =>
  pagedGames.value.filter((item) => matchesQuery(props.searchQuery, item.title, item.category)),
)

const visibleGameTypes = computed(() =>
  isCategoryExpanded.value ? gameTypes.value : gameTypes.value.slice(0, COLLAPSED_CATEGORY_COUNT),
)

const hasHiddenGameTypes = computed(() => gameTypes.value.length > COLLAPSED_CATEGORY_COUNT)

const hasMoreGames = computed(() => {
  if (totalNumber.value === 0) return false
  return pagedGames.value.length < totalNumber.value
})

const footerText = computed(() => {
  if (isInitialLoading.value) return '正在加载数据...'
  if (gameError.value) return ''
  if (isLoadingMore.value) return '正在加载数据...'
  if (fetchedGames.value.length === 0) return ''
  return hasMoreGames.value ? '上滑加载更多' : '没有更多数据了'
})

const observeLoadMoreTrigger = () => {
  if (!observer || !loadMoreTrigger.value) return

  observer.disconnect()
  observer.observe(loadMoreTrigger.value)
}

const appendGames = (list: HotGameApiItem[]) => {
  const existingIds = new Set(fetchedGames.value.map((item) => item.id).filter(Boolean))
  const nextGames = list
    .map(mapGameToContent)
    .filter((item) => item.id == null || !existingIds.has(item.id))

  fetchedGames.value.push(...nextGames)
}

const fetchGameTypes = async () => {
  isGameTypeLoading.value = true
  gameTypeError.value = ''

  try {
    const res = await gameApi.getGameTypes()
    const list: GameTypeApiItem[] = Array.isArray(res?.c) ? res.c : []
    const enabledList = list.filter((item) => item?.name)

    if (enabledList.length > 0) {
      gameTypes.value = enabledList.some((item) => item.name === ALL_GAME_TYPE)
        ? enabledList
        : [{ id: '0', name: ALL_GAME_TYPE }, ...enabledList]
    }
  } catch (error) {
    gameTypes.value = fallbackGameTypes
    gameTypeError.value = getErrorMessage(error, '游戏分类加载失败，已展示常用分类')
  } finally {
    isGameTypeLoading.value = false
  }
}

const fetchGamePage = async (page: number, gameType: string, version: number, replace = false) => {
  const res = await homeApi.selectHotGames({
    gametype: gameType,
    page,
    pagecode: page,
  })

  if (version !== loadVersion) {
    return {
      listCount: 0,
      totalPage: page,
      currentPage: page,
    }
  }

  if (!res || !Array.isArray(res.lists)) {
    throw new Error('游戏接口返回格式异常')
  }

  totalNumber.value = Number(res.total_number) || 0
  const list: HotGameApiItem[] = res.lists
  if (replace) {
    fetchedGames.value = list.map(mapGameToContent)
  } else {
    appendGames(list)
  }

  const currentPage = Number(res?.now_page) || page
  nextPage.value = currentPage + 1

  return {
    listCount: list.length,
    totalPage: Number(res?.total_page) || currentPage,
    currentPage,
  }
}

const loadUntilVisibleCount = async (targetCount: number, gameType: string, version: number) => {
  while (
    version === loadVersion &&
    fetchedGames.value.length < targetCount &&
    (totalNumber.value === 0 || fetchedGames.value.length < totalNumber.value)
  ) {
    const result = await fetchGamePage(nextPage.value, gameType, version)

    if (result.listCount === 0 || result.currentPage >= result.totalPage) break
  }

  if (version === loadVersion) {
    visibleCount.value = Math.min(
      targetCount,
      fetchedGames.value.length,
      totalNumber.value || targetCount,
    )
  }
}

const fetchInitialGames = async () => {
  const version = ++loadVersion
  const gameType = activeGameType.value

  isInitialLoading.value = true
  gameError.value = ''

  try {
    totalNumber.value = 0
    nextPage.value = 1

    const firstPage = await fetchGamePage(1, gameType, version, true)
    if (
      firstPage.listCount > 0 &&
      firstPage.currentPage < firstPage.totalPage &&
      fetchedGames.value.length < GAME_BATCH_SIZE
    ) {
      await loadUntilVisibleCount(GAME_BATCH_SIZE, gameType, version)
    }

    if (version === loadVersion) {
      visibleCount.value = Math.min(GAME_BATCH_SIZE, fetchedGames.value.length)
    }
  } catch (error) {
    if (version === loadVersion) {
      gameError.value = getErrorMessage(error, '游戏数据加载失败')
      const filteredFallback =
        gameType === ALL_GAME_TYPE
          ? allGames
          : allGames.filter((item) => item.category === gameType)
      fetchedGames.value = filteredFallback.length > 0 ? filteredFallback : allGames
      visibleCount.value = fetchedGames.value.length
      totalNumber.value = fetchedGames.value.length
    }
  } finally {
    if (version === loadVersion) isInitialLoading.value = false
  }
}

const loadMoreGames = async () => {
  if (isInitialLoading.value || isLoadingMore.value) return

  if (!hasMoreGames.value) {
    visibleCount.value = Math.min(visibleCount.value, fetchedGames.value.length)
    return
  }

  isLoadingMore.value = true
  gameError.value = ''
  const version = loadVersion
  const gameType = activeGameType.value

  try {
    await loadUntilVisibleCount(pagedGames.value.length + GAME_BATCH_SIZE, gameType, version)
  } catch (error) {
    if (version === loadVersion) {
      gameError.value = getErrorMessage(error, '游戏数据加载失败')
    }
  } finally {
    if (version === loadVersion) isLoadingMore.value = false
  }
}

const selectGameType = async (gameType: string) => {
  if (activeGameType.value === gameType && !isCategoryTransitioning.value) return

  const transitionId = ++categoryTransitionId
  activeGameType.value = gameType
  isCategoryExpanded.value = false
  isCategoryTransitioning.value = true

  await fetchInitialGames()

  if (transitionId === categoryTransitionId) {
    isCategoryTransitioning.value = false
    await nextTick()
    observeLoadMoreTrigger()
  }
}

const openGameDetail = (item: HotGameItem) => {
  if (item.id == null) {
    window.location.href = externalLinks.gameHome
    return
  }
  window.location.href = externalLinks.gameDetail(item.id)
}

onMounted(async () => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) loadMoreGames()
    },
    {
      rootMargin: '260px',
    },
  )

  await Promise.all([fetchGameTypes(), fetchInitialGames()])
  await nextTick()
  observeLoadMoreTrigger()
})

onActivated(() => {
  nextTick(observeLoadMoreTrigger)
})

onDeactivated(() => {
  observer?.disconnect()
})

onBeforeUnmount(() => {
  categoryTransitionId += 1
  observer?.disconnect()
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <!-- Header Block -->
    <div class="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div class="max-w-3xl">
        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00bfa5]/16">
          <Joystick class="h-8 w-8 text-[#00e0c5]" />
        </div>
        <h1
          class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-brand-text"
        >
          小游戏专区
        </h1>
        <p class="mt-4 text-base leading-8 text-brand-text-secondary sm:text-lg">
          免下载、低等待、强反馈。把追剧后的三分钟，变成赢奖励的高光时刻。
        </p>
        <p
          v-if="searchQuery"
          class="mt-4 inline-flex rounded-lg border border-[#00bfa5]/20 bg-[#00bfa5]/8 px-3 py-2 text-sm font-semibold text-[#008f7c]"
        >
          正在搜索“{{ searchQuery }}”
        </p>
      </div>
      <div
        class="rounded-3xl border border-brand-border bg-brand-card p-5 text-sm bg-gradient-to-br from-[#00bfa5]/10 to-[#00bfa5]/2 self-start lg:self-auto"
      >
        <p class="font-black text-[#00bfa5]">当前展示 {{ visibleGames.length }} 款</p>
        <p class="mt-2 text-brand-text-secondary">共 {{ totalNumber }} 款小游戏</p>
      </div>
    </div>

    <!-- Categories Tabs -->
    <div class="mb-8 flex flex-wrap gap-3">
      <button
        v-for="category in visibleGameTypes"
        :key="category.id"
        class="min-h-10 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        :class="
          activeGameType === category.name
            ? 'border-[#00bfa5] bg-[#00bfa5] text-[#031b20] shadow-[0_0_22px_rgba(0,191,165,0.36)]'
            : 'border-brand-border bg-brand-card text-brand-text-secondary hover:text-brand-text'
        "
        :disabled="isInitialLoading || isLoadingMore || isCategoryTransitioning"
        @click="selectGameType(category.name)"
      >
        {{ category.name }}
      </button>
      <button
        v-if="hasHiddenGameTypes"
        class="flex min-h-10 items-center gap-1 rounded-full border border-brand-border bg-brand-card px-5 py-2.5 text-sm font-black text-brand-text-secondary transition hover:text-brand-text cursor-pointer"
        type="button"
        @click="isCategoryExpanded = !isCategoryExpanded"
      >
        {{ isCategoryExpanded ? '收起' : `展开 ${gameTypes.length - COLLAPSED_CATEGORY_COUNT} 个` }}
        <ChevronUp v-if="isCategoryExpanded" class="h-4 w-4" />
        <ChevronDown v-else class="h-4 w-4" />
      </button>
    </div>

    <p
      v-if="isGameTypeLoading"
      class="mb-5 text-sm font-semibold text-brand-text-secondary/70 animate-pulse"
    >
      游戏分类加载中...
    </p>
    <p v-else-if="gameTypeError" class="mb-5 text-sm font-semibold text-red-500">
      {{ gameTypeError }}
    </p>
    <div
      v-if="gameError"
      class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#00bfa5]/20 bg-[#00bfa5]/8 px-4 py-3 text-sm font-semibold text-[#008f7c]"
    >
      <span>{{ gameError }}，当前展示备用内容。</span>
      <button
        type="button"
        class="rounded-md border border-[#00bfa5]/30 bg-transparent px-3 py-1.5 font-bold text-[#008f7c] cursor-pointer"
        @click="fetchInitialGames"
      >
        重新加载
      </button>
    </div>

    <!-- Game List Section -->
    <div class="min-h-[620px]" :aria-busy="isInitialLoading || isCategoryTransitioning">
      <div
        v-if="visibleGames.length > 0"
        class="grid grid-cols-2 gap-3 transition-opacity sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        :class="{ 'opacity-55': isCategoryTransitioning }"
      >
        <GameCard
          v-for="item in visibleGames"
          :key="item.id ?? item.title"
          :item="item"
          button-text="立即畅玩"
          detailed
          @select="openGameDetail(item)"
        />
      </div>

      <EmptyState
        v-else-if="!isInitialLoading && !isLoadingMore"
        :description="
          searchQuery ? `没有找到与“${searchQuery}”相关的小游戏` : '当前游戏分类暂时没有可展示内容'
        "
        tone="green"
      />

      <div ref="loadMoreTrigger" class="mt-10 flex min-h-12 items-center justify-center">
        <p
          v-if="footerText"
          class="rounded-full border px-5 py-2.5 text-sm font-black transition-colors"
          :class="
            isInitialLoading || isLoadingMore
              ? 'border-[#00bfa5]/30 bg-[#00bfa5]/10 text-[#00bfa5]'
              : 'border-brand-border bg-brand-card text-brand-text-secondary/70'
          "
        >
          {{ footerText }}
        </p>
      </div>
    </div>
  </section>
</template>
