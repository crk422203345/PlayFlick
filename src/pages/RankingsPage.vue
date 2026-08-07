<script setup lang="ts">
import { computed, ref } from 'vue'
import { Gamepad2, Trophy } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import GameCard from '@/components/GameCard.vue'
import RankingCard from '@/components/RankingCard.vue'
import { allGames, rankings, type RankingItem } from '@/data/playflick'
import { getFallbackImage, type DramaContentItem } from '@/utils/content'
import { createDramaEntry, createGameEntry, useLibrary } from '@/composables/useLibrary'

type RankingScope = 'drama' | 'game'

const router = useRouter()
const { remember } = useLibrary()
const activeScope = ref<RankingScope>('drama')

const rankedGames = computed(() =>
  [...allGames].sort(
    (left, right) => Number.parseFloat(right.players) - Number.parseFloat(left.players),
  ),
)

const openDrama = (item: RankingItem) => {
  const drama: DramaContentItem = {
    title: item.title,
    type: item.type,
    views: item.heat,
    image: getFallbackImage(item.title, 'drama'),
  }
  const entry = remember(createDramaEntry(drama))
  router.push({ name: 'drama-detail', params: { id: entry.key } })
}

const openGame = (item: (typeof allGames)[number]) => {
  const entry = remember(createGameEntry(item))
  router.push({ name: 'game-detail', params: { id: entry.key } })
}
</script>

<template>
  <section class="border-b border-brand-border bg-brand-card/35">
    <div class="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:px-8">
      <div class="flex items-start gap-4">
        <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#ffbf47]/14">
          <Trophy class="h-6 w-6 text-[#e5a51e]" />
        </span>
        <div>
          <h1 class="text-3xl font-black text-brand-text sm:text-4xl">热门榜单</h1>
          <p class="mt-3 max-w-2xl text-base leading-7 text-brand-text-secondary">
            根据内容热度和玩家参与度整理，快速找到大家正在追、正在玩的内容。
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 inline-flex rounded-lg border border-brand-border bg-brand-card p-1">
      <button
        type="button"
        class="flex min-w-28 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition"
        :class="activeScope === 'drama' ? 'bg-[#ff3366] text-white' : 'text-brand-text-secondary'"
        @click="activeScope = 'drama'"
      >
        <Trophy class="h-4 w-4" /> 短剧榜
      </button>
      <button
        type="button"
        class="flex min-w-28 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition"
        :class="
          activeScope === 'game' ? 'bg-[#00bfa5] text-[#031b20]' : 'text-brand-text-secondary'
        "
        @click="activeScope = 'game'"
      >
        <Gamepad2 class="h-4 w-4" /> 游戏榜
      </button>
    </div>

    <div
      v-if="activeScope === 'drama'"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <RankingCard
        v-for="(item, index) in rankings"
        :key="item.title"
        :item="item"
        :rank="index + 1"
        @select="openDrama(item)"
      />
    </div>

    <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="(item, index) in rankedGames" :key="item.title" class="relative">
        <span
          class="absolute left-2 top-2 z-20 grid h-8 min-w-8 place-items-center rounded-md bg-[#071a1b]/88 px-2 text-sm font-black text-white shadow-lg"
        >
          {{ index + 1 }}
        </span>
        <GameCard :item="item" detailed button-text="查看详情" @select="openGame(item)" />
      </div>
    </div>
  </section>
</template>
