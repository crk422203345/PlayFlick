<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Compass, Search, Sparkles } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import DramaCard from '@/components/DramaCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import GameCard from '@/components/GameCard.vue'
import { homeApi, searchApi } from '@/api/modules'
import { allDramas, allGames } from '@/data/playflick'
import {
  mapCourseToDrama,
  mapGameToContent,
  matchesQuery,
  type CourseApiItem,
  type DramaContentItem,
  type GameContentItem,
  type HotGameApiItem,
} from '@/utils/content'
import {
  createDramaEntry,
  createGameEntry,
  getLibraryRoute,
  useLibrary,
} from '@/composables/useLibrary'

type DiscoverScope = 'all' | 'drama' | 'game'

const route = useRoute()
const router = useRouter()
const { remember, rememberMany } = useLibrary()
const dramas = ref<DramaContentItem[]>([...allDramas])
const games = ref<GameContentItem[]>([...allGames])
const loading = ref(false)
const usingCuratedFallback = ref(false)
let loadRequestId = 0

const query = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
const scope = computed<DiscoverScope>(() => {
  const value = route.query.scope
  return value === 'drama' || value === 'game' ? value : 'all'
})

const filteredDramas = computed(() =>
  dramas.value.filter((item) => matchesQuery(query.value, item.title, item.type)),
)
const filteredGames = computed(() =>
  games.value.filter((item) => matchesQuery(query.value, item.title, item.category)),
)
const resultCount = computed(
  () =>
    (scope.value === 'game' ? 0 : filteredDramas.value.length) +
    (scope.value === 'drama' ? 0 : filteredGames.value.length),
)

const hotKeywords = ['都市', '甜宠', '悬疑', '逆袭', '消除', '策略', '冒险']
const getTitleKey = (item: { title: string }) => item.title.trim().toLocaleLowerCase('zh-CN')

interface DiscoveryContent {
  dramas: DramaContentItem[]
  games: GameContentItem[]
}

const mergeByKey = <T,>(items: T[], getKey: (item: T) => string) => {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = getKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const loadCuratedContent = async () => {
  let nextDramas: DramaContentItem[] = [...allDramas]
  let nextGames: GameContentItem[] = [...allGames]
  const [dramaResult, gameResult] = await Promise.allSettled([
    homeApi.selectCourse({ page: 1, limit: 40, languageType: 'zh' }),
    homeApi.selectHotGames({ gametype: '全部游戏', pagecode: 1 }),
  ])

  if (dramaResult.status === 'fulfilled') {
    const list: CourseApiItem[] = Array.isArray(dramaResult.value?.data?.list)
      ? dramaResult.value.data.list
      : []
    const mapped = list
      .filter((item) => item.status !== 0 && item.isDelete !== 1)
      .map(mapCourseToDrama)
    nextDramas = mergeByKey([...mapped, ...allDramas], getTitleKey)
  }

  if (gameResult.status === 'fulfilled') {
    const list: HotGameApiItem[] = Array.isArray(gameResult.value?.lists)
      ? gameResult.value.lists
      : []
    const mapped = list.map(mapGameToContent)
    nextGames = mergeByKey([...mapped, ...allGames], getTitleKey)
  }

  return { dramas: nextDramas, games: nextGames } satisfies DiscoveryContent
}

const loadSearchContent = async () => {
  const response = await searchApi.search({ q: query.value, scope: scope.value })
  if (
    !response?.data ||
    !Array.isArray(response.data.dramas) ||
    !Array.isArray(response.data.games)
  ) {
    throw new Error('搜索接口返回格式异常')
  }

  const remoteDramas = response.data.dramas.map(mapCourseToDrama)
  const remoteGames = response.data.games.map(mapGameToContent)
  const localDramas = allDramas.filter((item) => matchesQuery(query.value, item.title, item.type))
  const localGames = allGames.filter((item) => matchesQuery(query.value, item.title, item.category))

  return {
    dramas: mergeByKey([...remoteDramas, ...localDramas], getTitleKey),
    games: mergeByKey([...remoteGames, ...localGames], getTitleKey),
  } satisfies DiscoveryContent
}

const loadDiscoveryContent = async () => {
  const requestId = ++loadRequestId
  loading.value = true
  usingCuratedFallback.value = false

  try {
    let content: DiscoveryContent
    let nextUsingCuratedFallback = false
    if (query.value) {
      try {
        content = await loadSearchContent()
      } catch {
        nextUsingCuratedFallback = true
        content = await loadCuratedContent()
      }
    } else {
      content = await loadCuratedContent()
    }

    if (requestId !== loadRequestId) return
    usingCuratedFallback.value = nextUsingCuratedFallback
    dramas.value = content.dramas
    games.value = content.games
    rememberMany([...dramas.value.map(createDramaEntry), ...games.value.map(createGameEntry)])
  } finally {
    if (requestId === loadRequestId) loading.value = false
  }
}

const setScope = (nextScope: DiscoverScope) => {
  router.push({
    name: 'discover',
    query: {
      ...(query.value ? { q: query.value } : {}),
      ...(nextScope === 'all' ? {} : { scope: nextScope }),
    },
  })
}

const searchKeyword = (keyword: string) => {
  router.push({ name: 'discover', query: { q: keyword } })
}

const openDrama = (item: DramaContentItem) => {
  const entry = remember(createDramaEntry(item))
  router.push(getLibraryRoute(entry))
}

const openGame = (item: GameContentItem) => {
  const entry = remember(createGameEntry(item))
  router.push(getLibraryRoute(entry))
}

watch(
  () => route.fullPath,
  () => {
    if (route.name === 'discover') loadDiscoveryContent()
  },
  { immediate: true },
)
</script>

<template>
  <section class="border-b border-brand-border bg-brand-card/35">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div class="flex max-w-3xl items-start gap-4">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#7c4dff]/12">
          <Compass class="h-6 w-6 text-[#8b66ff]" />
        </span>
        <div>
          <h1 class="text-3xl font-black text-brand-text sm:text-4xl">发现</h1>
          <p class="mt-3 text-base leading-7 text-brand-text-secondary">
            在短剧与小游戏之间自由探索，找到适合此刻的下一段精彩。
          </p>
        </div>
      </div>

      <div v-if="query" class="mt-8 flex flex-wrap items-center gap-3">
        <Search class="h-5 w-5 text-brand-text-secondary" />
        <p class="text-lg font-bold text-brand-text">
          “{{ query }}”
          <span class="text-sm text-brand-text-secondary">{{ resultCount }} 个结果</span>
        </p>
      </div>
      <div v-else class="mt-8 flex flex-wrap items-center gap-2">
        <span class="mr-2 flex items-center gap-1 text-sm font-bold text-brand-text-secondary">
          <Sparkles class="h-4 w-4 text-[#ffbf47]" /> 热门探索
        </span>
        <button
          v-for="keyword in hotKeywords"
          :key="keyword"
          type="button"
          class="rounded-full border border-brand-border bg-brand-card px-3 py-1.5 text-sm font-semibold text-brand-text-secondary transition hover:border-brand-border-strong hover:text-brand-text"
          @click="searchKeyword(keyword)"
        >
          {{ keyword }}
        </button>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
    <div class="mb-8 inline-flex rounded-lg border border-brand-border bg-brand-card p-1">
      <button
        v-for="option in [
          { value: 'all', label: '全部' },
          { value: 'drama', label: '短剧' },
          { value: 'game', label: '小游戏' },
        ] as const"
        :key="option.value"
        type="button"
        class="min-w-20 rounded-md px-4 py-2 text-sm font-bold transition"
        :class="
          scope === option.value
            ? 'bg-brand-text text-brand-bg'
            : 'text-brand-text-secondary hover:text-brand-text'
        "
        @click="setScope(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="loading" class="mb-6 text-sm font-semibold text-brand-text-secondary animate-pulse">
      正在汇集最新内容...
    </div>
    <p
      v-else-if="usingCuratedFallback && query"
      class="mb-6 rounded-md border border-[#ffbf47]/25 bg-[#ffbf47]/8 px-3 py-2 text-sm font-semibold text-brand-text-secondary"
    >
      搜索服务暂不可用，当前展示精选内容中的匹配结果。
    </p>

    <div v-if="scope !== 'game' && filteredDramas.length > 0" class="mb-12">
      <div class="mb-5 flex items-center justify-between gap-4">
        <h2 class="text-2xl font-black text-brand-text">短剧</h2>
        <span class="text-sm font-semibold text-brand-text-secondary"
          >{{ filteredDramas.length }} 部</span
        >
      </div>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <DramaCard
          v-for="item in filteredDramas"
          :key="createDramaEntry(item).key"
          :item="item"
          compact
          @select="openDrama(item)"
        />
      </div>
    </div>

    <div v-if="scope !== 'drama' && filteredGames.length > 0">
      <div class="mb-5 flex items-center justify-between gap-4">
        <h2 class="text-2xl font-black text-brand-text">小游戏</h2>
        <span class="text-sm font-semibold text-brand-text-secondary"
          >{{ filteredGames.length }} 款</span
        >
      </div>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <GameCard
          v-for="item in filteredGames"
          :key="createGameEntry(item).key"
          :item="item"
          detailed
          button-text="查看详情"
          @select="openGame(item)"
        />
      </div>
    </div>

    <EmptyState
      v-if="!loading && resultCount === 0"
      :description="
        query
          ? usingCuratedFallback
            ? `精选内容中暂未找到与“${query}”相关的结果`
            : `没有找到与“${query}”相关的内容`
          : '暂时没有可展示内容'
      "
      tone="purple"
    />
  </section>
</template>
