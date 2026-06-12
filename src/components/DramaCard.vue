<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import type { DramaItem } from '@/data/playflick'

withDefaults(
  defineProps<{
    item: DramaItem
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)
</script>

<template>
  <article
    class="group overflow-hidden rounded-3xl border border-brand-border bg-brand-card shadow-xl shadow-brand-text/5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3366]/15"
  >
    <div class="relative aspect-[3/4] overflow-hidden">
      <img
        :src="item.image"
        :alt="item.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div
        v-if="!compact"
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      ></div>
      <span
        v-if="!compact"
        class="absolute left-4 top-4 rounded-full bg-[#ff3366] px-3 py-1 text-xs font-black text-white"
      >
        {{ item.type }}
      </span>
      <button
        v-else
        class="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100 border-none cursor-pointer"
      >
        <span
          class="grid h-14 w-14 place-items-center rounded-full bg-[#ff3366] shadow-[0_0_28px_rgba(255,51,102,0.45)]"
        >
          <Play class="h-6 w-6 fill-white text-white" />
        </span>
      </button>
    </div>
    <div class="p-4 transition-colors duration-300">
      <h3 :class="compact ? 'text-base' : 'text-lg'" class="line-clamp-1 font-black text-brand-text">
        {{ item.title }}
      </h3>
      <div v-if="compact" class="mt-3 flex items-center justify-between gap-3">
        <span class="flex items-center gap-1 text-xs text-brand-text-secondary">
          <Play class="h-3.5 w-3.5 fill-[#ff6f98] text-[#ff6f98]" />
          {{ item.views }}
        </span>
        <span class="rounded-full bg-[#ff3366]/15 px-2.5 py-1 text-xs font-bold text-[#ff8bad]">
          {{ item.type }}
        </span>
      </div>
      <p v-else class="mt-2 flex items-center gap-1 text-sm text-brand-text-secondary">
        <Play class="h-3.5 w-3.5 fill-[#ff6f98] text-[#ff6f98]" />
        {{ item.views }} 播放
      </p>
    </div>
  </article>
</template>
