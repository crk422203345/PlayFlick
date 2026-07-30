<script setup lang="ts">
import { Play } from 'lucide-vue-next'
import type { DramaItem } from '@/data/playflick'
import SmartImage from './SmartImage.vue'

withDefaults(
  defineProps<{
    item: DramaItem
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-md shadow-brand-shadow backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-shadow hover:border-brand-border-strong"
    role="link"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <!-- Image -->
    <div class="relative aspect-[3/4] overflow-hidden">
      <SmartImage
        :src="item.image"
        :alt="item.title"
        fallback-kind="drama"
        class="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
      />

      <!-- Gradient overlay -->
      <div
        v-if="!compact"
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
      ></div>

      <!-- Category badge (non-compact) -->
      <div v-if="!compact" class="absolute left-3 top-3">
        <span
          class="inline-flex items-center rounded-lg bg-[#ff3366] px-2.5 py-1 text-[10px] font-bold text-white tracking-wide uppercase shadow-md"
        >
          {{ item.type }}
        </span>
      </div>

      <!-- Play overlay (compact) -->
      <span
        v-else
        class="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/28 group-hover:opacity-100"
        aria-hidden="true"
      >
        <span
          class="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-xl transition-transform duration-200 group-hover:scale-110"
        >
          <Play class="h-5 w-5 fill-[#ff3366] text-[#ff3366] translate-x-0.5" />
        </span>
      </span>

      <!-- Bottom gradient with title (non-compact) -->
      <div v-if="!compact" class="absolute bottom-0 left-0 right-0 p-4">
        <p class="line-clamp-2 text-[13px] font-bold leading-tight text-white/90">
          {{ item.title }}
        </p>
        <p class="mt-1.5 flex items-center gap-1 text-[11px] text-white/60">
          <Play class="h-3 w-3 fill-white/60 text-white/60" />
          {{ item.views }} 播放
        </p>
      </div>
    </div>

    <!-- Card body (compact mode only) -->
    <div v-if="compact" class="p-3">
      <h3 class="line-clamp-1 text-[13px] font-semibold leading-snug text-brand-text">
        {{ item.title }}
      </h3>
      <div class="mt-2 flex items-center justify-between gap-2">
        <span class="flex items-center gap-1 text-[11px] text-brand-text-secondary">
          <Play class="h-3 w-3 fill-[#ff6f98] text-[#ff6f98]" />
          {{ item.views }}
        </span>
        <span
          class="rounded-md bg-[#ff3366]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ff6f98] tracking-wide"
        >
          {{ item.type }}
        </span>
      </div>
    </div>
  </article>
</template>
