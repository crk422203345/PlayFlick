<script setup lang="ts">
import { computed, watch } from 'vue'
import { ArrowLeft, Bookmark, Gamepad2, Zap } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import GameCard from '@/components/GameCard.vue'
import SmartImage from '@/components/SmartImage.vue'
import { allGames, type GameItem } from '@/data/playflick'
import {
  createEntryFromRoute,
  createGameEntry,
  getLibraryRoute,
  useLibrary,
  type LibraryEntry,
} from '@/composables/useLibrary'
import { externalLinks } from '@/utils/externalLinks'

const route = useRoute()
const router = useRouter()
const library = useLibrary()
const fallbackEntries = allGames.map(createGameEntry)

const entry = computed<LibraryEntry | undefined>(() => {
  const key = String(route.params.id || '')
  return (
    library.findEntry('game', key) ??
    fallbackEntries.find((item) => item.key === key) ??
    createEntryFromRoute('game', key, route.query)
  )
})

const isFavorite = computed(() => (entry.value ? library.isFavorite(entry.value) : false))
const relatedGames = computed(() => {
  if (!entry.value) return allGames.slice(0, 4)
  const sameCategory = allGames.filter(
    (item) => item.title !== entry.value?.title && item.category === entry.value?.category,
  )
  const others = allGames.filter(
    (item) => item.title !== entry.value?.title && item.category !== entry.value?.category,
  )
  return [...sameCategory, ...others].slice(0, 4)
})

const openExternal = () => {
  if (!entry.value) return
  window.location.href =
    entry.value.primaryId != null
      ? externalLinks.gameDetail(entry.value.primaryId)
      : externalLinks.gameHome
}

const toggleFavorite = () => {
  if (entry.value) library.toggleFavorite(entry.value)
}

const openRelated = (item: GameItem) => {
  const nextEntry = library.remember(createGameEntry(item))
  router.push(getLibraryRoute(nextEntry))
}

watch(
  () => entry.value?.key,
  () => {
    if (entry.value) library.recordView(entry.value)
  },
  { immediate: true },
)
</script>

<template>
  <template v-if="entry">
    <section class="relative min-h-[500px] overflow-hidden border-b border-brand-border">
      <SmartImage
        :src="entry.image"
        :alt="entry.title"
        fallback-kind="game"
        loading="eager"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,20,24,0.97)_0%,rgba(3,20,24,0.78)_48%,rgba(3,20,24,0.28)_100%)]"
      ></div>
      <div
        class="relative mx-auto flex min-h-[500px] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 lg:px-8"
      >
        <button
          type="button"
          class="mb-auto flex w-fit items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white"
          @click="router.back()"
        >
          <ArrowLeft class="h-4 w-4" /> 返回
        </button>
        <div
          class="mb-4 flex w-fit items-center gap-2 rounded-md bg-[#00bfa5] px-3 py-1 text-xs font-black text-[#031b20]"
        >
          <Gamepad2 class="h-3.5 w-3.5" /> {{ entry.category }}
        </div>
        <h1 class="max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          {{ entry.title }}
        </h1>
        <p class="mt-4 text-base font-semibold text-white/72">{{ entry.metric }} 人正在玩</p>
        <div class="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full bg-[#00bfa5] px-6 py-3 text-sm font-black text-[#031b20] shadow-[0_0_28px_rgba(0,191,165,0.42)]"
            @click="openExternal"
          >
            <Zap class="h-4 w-4 fill-current" /> 开始游戏
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-6 py-3 text-sm font-black text-white backdrop-blur"
            :aria-pressed="isFavorite"
            @click="toggleFavorite"
          >
            <Bookmark class="h-4 w-4" :class="{ 'fill-[#00e0c5] text-[#00e0c5]': isFavorite }" />
            {{ isFavorite ? '已收藏' : '收藏游戏' }}
          </button>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <h2 class="text-2xl font-black text-brand-text">游戏介绍</h2>
        <p class="mt-4 text-base leading-8 text-brand-text-secondary">
          {{ entry.title }}是一款{{
            entry.category
          }}小游戏，无需下载即可开始体验。进入游戏后可查看完整玩法、活动奖励和最新版本信息。
        </p>
      </div>

      <div class="mt-12">
        <h2 class="mb-6 text-2xl font-black text-brand-text">你可能还喜欢</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <GameCard
            v-for="item in relatedGames"
            :key="item.title"
            :item="item"
            detailed
            button-text="查看详情"
            @select="openRelated(item)"
          />
        </div>
      </div>
    </section>
  </template>

  <section v-else class="mx-auto max-w-3xl px-4 py-24 text-center">
    <h1 class="text-3xl font-black text-brand-text">没有找到这款游戏</h1>
    <button
      class="mt-6 rounded-full bg-[#00bfa5] px-6 py-3 font-bold text-[#031b20]"
      @click="router.push('/games')"
    >
      返回小游戏专区
    </button>
  </section>
</template>
