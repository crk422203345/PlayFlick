<script setup lang="ts">
import { computed, ref } from 'vue'
import { Joystick } from 'lucide-vue-next'
import GameCard from '@/components/GameCard.vue'
import { allGames, gameCategories } from '@/data/playflick'

const activeGameCategory = ref('全部游戏')

const filteredGames = computed(() => {
  if (activeGameCategory.value === '全部游戏') return allGames
  return allGames.filter((item) => item.category === activeGameCategory.value)
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
        <p class="font-black">今日在线 86.4 万</p>
        <p class="mt-2 text-[#9fffee]/70">礼包库存每 2 小时刷新</p>
      </div>
    </div>

    <div class="scrollbar-none mb-8 flex gap-3 overflow-x-auto">
      <button
        v-for="category in gameCategories"
        :key="category"
        class="whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition"
        :class="
          activeGameCategory === category
            ? 'border-[#00bfa5] bg-[#00bfa5] text-[#031b20] shadow-[0_0_22px_rgba(0,191,165,0.36)]'
            : 'border-white/10 bg-white/[0.05] text-white/60 hover:text-white'
        "
        @click="activeGameCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <GameCard
        v-for="item in filteredGames"
        :key="item.title"
        :item="item"
        button-text="立即畅玩"
        detailed
      />
    </div>
  </section>
</template>
