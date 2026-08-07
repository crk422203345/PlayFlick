<script setup lang="ts">
import { computed, watch } from 'vue'
import { ArrowLeft, Heart, Play } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import DramaCard from '@/components/DramaCard.vue'
import SmartImage from '@/components/SmartImage.vue'
import { allDramas, type DramaItem } from '@/data/playflick'
import {
  createDramaEntry,
  createEntryFromRoute,
  getLibraryRoute,
  useLibrary,
  type LibraryEntry,
} from '@/composables/useLibrary'
import { externalLinks } from '@/utils/externalLinks'

const route = useRoute()
const router = useRouter()
const library = useLibrary()
const fallbackEntries = allDramas.map(createDramaEntry)

const entry = computed<LibraryEntry | undefined>(() => {
  const key = String(route.params.id || '')
  return (
    library.findEntry('drama', key) ??
    fallbackEntries.find((item) => item.key === key) ??
    createEntryFromRoute('drama', key, route.query)
  )
})

const isFavorite = computed(() => (entry.value ? library.isFavorite(entry.value) : false))
const relatedDramas = computed(() => {
  if (!entry.value) return allDramas.slice(0, 5)
  const sameCategory = allDramas.filter(
    (item) => item.title !== entry.value?.title && item.type === entry.value?.category,
  )
  const others = allDramas.filter(
    (item) => item.title !== entry.value?.title && item.type !== entry.value?.category,
  )
  return [...sameCategory, ...others].slice(0, 5)
})

const openExternal = () => {
  if (!entry.value) return
  window.location.href =
    entry.value.primaryId != null && entry.value.secondaryId != null
      ? externalLinks.dramaDetail(entry.value.primaryId, entry.value.secondaryId)
      : externalLinks.tvHome
}

const toggleFavorite = () => {
  if (entry.value) library.toggleFavorite(entry.value)
}

const openRelated = (item: DramaItem) => {
  const nextEntry = library.remember(createDramaEntry(item))
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
        fallback-kind="hero"
        loading="eager"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,25,0.96)_0%,rgba(8,10,25,0.76)_48%,rgba(8,10,25,0.25)_100%)]"
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
        <span class="mb-4 w-fit rounded-md bg-[#ff3366] px-3 py-1 text-xs font-black text-white">
          {{ entry.category }}
        </span>
        <h1 class="max-w-3xl text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          {{ entry.title }}
        </h1>
        <p class="mt-4 text-base font-semibold text-white/72">{{ entry.metric }} 播放</p>
        <div class="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full bg-[#ff3366] px-6 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(255,51,102,0.4)]"
            @click="openExternal"
          >
            <Play class="h-4 w-4 fill-white" /> 立即观看
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-6 py-3 text-sm font-black text-white backdrop-blur"
            :aria-pressed="isFavorite"
            @click="toggleFavorite"
          >
            <Heart class="h-4 w-4" :class="{ 'fill-[#ff6f98] text-[#ff6f98]': isFavorite }" />
            {{ isFavorite ? '已收藏' : '加入片单' }}
          </button>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <h2 class="text-2xl font-black text-brand-text">内容简介</h2>
        <p class="mt-4 text-base leading-8 text-brand-text-secondary">
          这是一部{{
            entry.category
          }}题材微短剧，以紧凑节奏和连续反转推进故事。点击观看可前往内容平台查看完整剧集与最新更新。
        </p>
      </div>

      <div class="mt-12">
        <h2 class="mb-6 text-2xl font-black text-brand-text">相关推荐</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <DramaCard
            v-for="item in relatedDramas"
            :key="item.title"
            :item="item"
            compact
            @select="openRelated(item)"
          />
        </div>
      </div>
    </section>
  </template>

  <section v-else class="mx-auto max-w-3xl px-4 py-24 text-center">
    <h1 class="text-3xl font-black text-brand-text">没有找到这部短剧</h1>
    <button
      class="mt-6 rounded-full bg-[#ff3366] px-6 py-3 font-bold text-white"
      @click="router.push('/dramas')"
    >
      返回短剧专区
    </button>
  </section>
</template>
