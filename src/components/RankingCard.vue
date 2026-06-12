<script setup lang="ts">
import { Flame } from 'lucide-vue-next'
import type { RankingItem } from '@/data/playflick'

defineProps<{
  item: RankingItem
  rank: number
}>()
</script>

<template>
  <article
    class="relative min-h-32 overflow-visible rounded-3xl border border-brand-border bg-brand-card p-5 pl-20 shadow-xl shadow-brand-text/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#ff3366]/40 hover:shadow-2xl"
  >
    <span class="rank-number absolute left-2 top-2 text-8xl font-black leading-none">{{
      rank
    }}</span>
    <div class="relative transition-colors duration-300">
      <span class="rounded-full bg-brand-hover px-3 py-1 text-xs font-bold text-brand-text-secondary">{{
        item.type
      }}</span>
      <h3 class="mt-4 text-lg font-black text-brand-text">{{ item.title }}</h3>
      <p class="mt-3 flex items-center gap-2 text-sm text-brand-text-secondary">
        <Flame class="h-4 w-4 text-[#ff3366]" />
        {{ item.heat }} 热度
      </p>
    </div>
  </article>
</template>

<style scoped>
.rank-number {
  color: rgba(255, 51, 102, 0.12);
  text-shadow:
    0 8px 22px rgba(255, 51, 102, 0.28),
    0 1px 0 rgba(255, 255, 255, 0.2);
  -webkit-text-stroke: 1px rgba(255, 111, 152, 0.45);
}
</style>
