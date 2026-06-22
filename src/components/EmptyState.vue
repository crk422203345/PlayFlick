<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    tone?: 'pink' | 'green'
  }>(),
  {
    title: '暂无数据',
    description: '当前分类暂时没有可展示内容',
    tone: 'green',
  },
)
</script>

<template>
  <div class="flex min-h-[360px] flex-col items-center justify-center text-center px-4">
    <div
      class="grid h-18 w-18 place-items-center rounded-2xl border"
      :class="
        tone === 'pink'
          ? 'border-[#ff3366]/20 bg-[#ff3366]/8 text-[#ff8bad]'
          : 'border-[#00bfa5]/20 bg-[#00bfa5]/8 text-[#00bfa5]'
      "
    >
      <Inbox class="h-9 w-9" />
    </div>
    <h3 class="mt-4 text-xl font-bold text-brand-text">{{ title }}</h3>
    <p class="mt-2 max-w-xs text-sm leading-6 text-brand-text-secondary">{{ description }}</p>
  </div>
</template>
