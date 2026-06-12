<script setup lang="ts">
import { Users, Zap } from 'lucide-vue-next'
import type { GameItem } from '@/data/playflick'

withDefaults(
  defineProps<{
    item: GameItem
    buttonText?: string
    detailed?: boolean
  }>(),
  {
    buttonText: '进入游戏',
    detailed: false,
  },
)
</script>

<template>
  <article
    class="group overflow-hidden rounded-3xl border border-brand-border bg-brand-card shadow-xl shadow-brand-text/5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00bfa5]/15"
  >
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="item.image"
        :alt="item.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
      ></div>
      <span
        class="absolute left-4 top-4 rounded-full bg-[#00bfa5]/90 px-3 py-1 text-xs font-black text-[#031b20]"
      >
        {{ item.category }}
      </span>
    </div>
    <div :class="detailed ? 'p-5' : 'p-4'" class="transition-colors duration-300">
      <h3 class="line-clamp-1 text-lg font-black text-brand-text">{{ item.title }}</h3>
      <p v-if="detailed" class="mt-2 flex items-center gap-2 text-sm text-brand-text-secondary">
        <Users class="h-4 w-4 text-[#00e0c5]" />
        {{ item.players }} 玩家在线
      </p>
      <p v-else class="mt-2 text-sm text-brand-text-secondary">{{ item.players }} 人在玩</p>
      <button
        :class="detailed ? 'mt-5 flex items-center justify-center gap-2' : 'mt-4'"
        class="w-full rounded-2xl bg-[#00bfa5] py-3 text-sm font-black text-[#031b20] transition hover:-translate-y-0.5 hover:bg-[#13ddc1] border-none cursor-pointer"
      >
        <Zap v-if="detailed" class="h-4 w-4 fill-[#031b20]" />
        {{ buttonText }}
      </button>
    </div>
  </article>
</template>
