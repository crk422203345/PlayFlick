<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronDown, ChevronUp, Joystick } from 'lucide-vue-next'
import GameCard from '@/components/GameCard.vue'
import { gameApi, homeApi } from '@/api/modules'
import type { GameItem } from '@/data/playflick'

const GAME_BATCH_SIZE = 20
const ALL_GAME_TYPE = '全部游戏'
const COLLAPSED_CATEGORY_COUNT = 12

interface HotGameApiItem {
  id: number
  pic1?: string
  pic4?: string
  downloadnum?: string
  gamename?: string
  game_tag?: string
  typeword?: string
  gametype?: string
  gametype1?: string
  gametype2?: string
  gametypes?: string[]
}

interface GameTypeApiItem {
  id: string | number
  name: string
}

type HotGameItem = GameItem & {
  id?: number
}

const gameTypes = ref<GameTypeApiItem[]>([{ id: '0', name: ALL_GAME_TYPE }])
const activeGameType = ref(ALL_GAME_TYPE)
const isCategoryExpanded = ref(false)
const fetchedGames = ref<HotGameItem[]>([])
const visibleCount = ref(GAME_BATCH_SIZE)
const totalNumber = ref(0)
const nextPage = ref(1)
const isGameTypeLoading = ref(false)
const isInitialLoading = ref(false)
const isLoadingMore = ref(false)
const gameTypeError = ref('')
const gameError = ref('')
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let loadVersion = 0

const visibleGames = computed(() => fetchedGames.value.slice(0, visibleCount.value))

const visibleGameTypes = computed(() =>
  isCategoryExpanded.value ? gameTypes.value : gameTypes.value.slice(0, COLLAPSED_CATEGORY_COUNT),
)

const hasHiddenGameTypes = computed(() => gameTypes.value.length > COLLAPSED_CATEGORY_COUNT)

const hasMoreGames = computed(() => {
  if (totalNumber.value === 0) return false
  return visibleGames.value.length < totalNumber.value
})

const footerText = computed(() => {
  if (isInitialLoading.value) return '正在加载数据...'
  if (gameError.value) return gameError.value
  if (isLoadingMore.value) return '正在加载数据...'
  if (fetchedGames.value.length === 0) return '暂无游戏数据'
  return hasMoreGames.value ? '上滑加载更多' : '没有更多数据了'
})

const formatCount = (value: number) => {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`
  return `${value}`
}

const mapGameItem = (item: HotGameApiItem): HotGameItem => ({
  id: item.id,
  title: item.gamename || '热门小游戏',
  category: item.typeword || item.gametype || item.gametypes?.join(' / ') || '小游戏',
  players: formatCount(Number(item.downloadnum) || 0),
  image: item.pic4 || item.pic1 || '',
})

const appendGames = (list: HotGameApiItem[]) => {
  const existingIds = new Set(fetchedGames.value.map((item) => item.id).filter(Boolean))
  const nextGames = list
    .map(mapGameItem)
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

    gameTypes.value = enabledList.some((item) => item.name === ALL_GAME_TYPE)
      ? enabledList
      : [{ id: '0', name: ALL_GAME_TYPE }, ...enabledList]
  } catch (error) {
    gameTypeError.value = error instanceof Error ? error.message : '游戏分类加载失败'
  } finally {
    isGameTypeLoading.value = false
  }
}

const fetchGamePage = async (page: number, gameType: string, version: number) => {
  const res = await homeApi.selectHotGames({
    type: 'ios',
    edition: '',
    order: '1',
    gametype: gameType,
    page,
    pagecode: page,
    key: 'XC9RdtCC',
    appid: '2',
    versionCode: 1,
  })

  if (version !== loadVersion) {
    return {
      listCount: 0,
      totalPage: page,
      currentPage: page,
    }
  }

  totalNumber.value = Number(res?.total_number) || 0
  const list: HotGameApiItem[] = Array.isArray(res?.lists) ? res.lists : []
  appendGames(list)

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
    fetchedGames.value = []
    visibleCount.value = GAME_BATCH_SIZE
    totalNumber.value = 0
    nextPage.value = 1
    await loadUntilVisibleCount(GAME_BATCH_SIZE, gameType, version)
  } catch (error) {
    if (version === loadVersion) {
      gameError.value = error instanceof Error ? error.message : '游戏数据加载失败'
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
    await loadUntilVisibleCount(visibleGames.value.length + GAME_BATCH_SIZE, gameType, version)
  } catch (error) {
    if (version === loadVersion) {
      gameError.value = error instanceof Error ? error.message : '游戏数据加载失败'
    }
  } finally {
    if (version === loadVersion) isLoadingMore.value = false
  }
}

const selectGameType = (gameType: string) => {
  if (activeGameType.value === gameType) return

  activeGameType.value = gameType
  isCategoryExpanded.value = false
  fetchInitialGames()
}

const openGameDetail = (item: HotGameItem) => {
  if (item.id == null) return
  window.location.href = `https://g.bingo.vip/#/gamedetails/content?gid=${item.id}&edition=0&key=XC9RdtCC`
}

onMounted(() => {
  fetchGameTypes()
  fetchInitialGames()

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) loadMoreGames()
    },
    {
      rootMargin: '260px',
    },
  )

  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div class="max-w-3xl">
        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00bfa5]/16">
          <Joystick class="h-8 w-8 text-[#00e0c5]" />
        </div>
        <h1 class="text-4xl font-black leading-tight sm:text-6xl">小游戏专区</h1>
        <p class="mt-4 text-base leading-8 text-white/64 sm:text-lg">
          免下载、低等待、强反馈。把追剧后的三分钟，变成赢奖励的高光时刻。
        </p>
      </div>
      <div
        class="rounded-3xl border border-[#00bfa5]/25 bg-[#00bfa5]/10 p-5 text-sm text-[#9fffee]"
      >
        <p class="font-black">当前展示 {{ visibleGames.length }} 款</p>
        <p class="mt-2 text-[#9fffee]/70">共 {{ totalNumber }} 款小游戏</p>
      </div>
    </div>

    <div class="mb-8 flex flex-wrap gap-3">
      <button
        v-for="category in visibleGameTypes"
        :key="category.id"
        class="min-h-10 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60"
        :class="
          activeGameType === category.name
            ? 'border-[#00bfa5] bg-[#00bfa5] text-[#031b20] shadow-[0_0_22px_rgba(0,191,165,0.36)]'
            : 'border-white/10 bg-white/[0.05] text-white/60 hover:text-white'
        "
        :disabled="isInitialLoading || isLoadingMore"
        @click="selectGameType(category.name)"
      >
        {{ category.name }}
      </button>
      <button
        v-if="hasHiddenGameTypes"
        class="flex min-h-10 items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-black text-white/70 transition hover:text-white"
        type="button"
        @click="isCategoryExpanded = !isCategoryExpanded"
      >
        {{ isCategoryExpanded ? '收起' : `展开 ${gameTypes.length - COLLAPSED_CATEGORY_COUNT} 个` }}
        <ChevronUp v-if="isCategoryExpanded" class="h-4 w-4" />
        <ChevronDown v-else class="h-4 w-4" />
      </button>
    </div>

    <p v-if="isGameTypeLoading" class="mb-5 text-sm font-semibold text-white/45">
      游戏分类加载中...
    </p>
    <p v-else-if="gameTypeError" class="mb-5 text-sm font-semibold text-[#ff8bad]">
      {{ gameTypeError }}
    </p>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <GameCard
        v-for="item in visibleGames"
        :key="item.id ?? item.title"
        :item="item"
        button-text="立即畅玩"
        class="cursor-pointer"
        detailed
        @click="openGameDetail(item)"
      />
    </div>

    <div ref="loadMoreTrigger" class="mt-10 flex min-h-12 items-center justify-center">
      <p
        class="rounded-full border px-5 py-2.5 text-sm font-black"
        :class="
          gameError
            ? 'border-[#ff8bad]/30 bg-[#ff8bad]/10 text-[#ff8bad]'
            : isInitialLoading || isLoadingMore
              ? 'border-[#00bfa5]/30 bg-[#00bfa5]/10 text-[#9fffee]'
              : 'border-white/10 bg-white/[0.05] text-white/52'
        "
      >
        {{ footerText }}
      </p>
    </div>
  </section>
</template>
