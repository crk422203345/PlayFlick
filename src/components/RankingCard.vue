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
    class="rank-card group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card p-6 shadow-md shadow-brand-shadow backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-border-strong hover:shadow-lg"
  >
    <!-- Rank number backdrop -->
    <span
      class="rank-number pointer-events-none absolute left-4 top-2.5 select-none font-black leading-none"
      :class="rank <= 3 ? 'text-[88px]' : 'text-[80px]'"
    >{{ rank }}</span>

    <!-- Gold shimmer for top 3 -->
    <div
      v-if="rank <= 3"
      class="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full opacity-30 blur-2xl"
      :class="rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-slate-400' : 'bg-amber-600'"
    ></div>

    <div class="relative pl-16">
      <!-- Type badge -->
      <span
        class="inline-flex items-center rounded-lg border border-brand-border px-2.5 py-0.5 text-[10px] font-semibold text-brand-text-secondary tracking-wide uppercase"
      >{{ item.type }}</span>

      <!-- Title -->
      <h3 class="mt-3 line-clamp-1 text-[15px] font-bold leading-snug text-brand-text group-hover:text-brand-primary transition-colors duration-200">
        {{ item.title }}
      </h3>

      <!-- Heat -->
      <p class="mt-2.5 flex items-center gap-1.5 text-[12px] text-brand-text-secondary">
        <Flame class="h-3.5 w-3.5 text-[#ff6f98]" />
        <span>{{ item.heat }}</span>
        <span class="text-brand-text-tertiary">热度</span>
      </p>
    </div>
  </article>
</template>

<style scoped>
.rank-number {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--border-color-strong);
  transition: -webkit-text-stroke-color 0.3s ease;
}

.rank-card:hover .rank-number {
  -webkit-text-stroke-color: rgba(255, 51, 102, 0.22);
}

/* Gold / Silver / Bronze for top 3 */
.rank-card:nth-child(1) .rank-number {
  -webkit-text-stroke-color: rgba(234, 179, 8, 0.3);
}
.rank-card:nth-child(2) .rank-number {
  -webkit-text-stroke-color: rgba(148, 163, 184, 0.3);
}
.rank-card:nth-child(3) .rank-number {
  -webkit-text-stroke-color: rgba(180, 120, 60, 0.3);
}
</style>
