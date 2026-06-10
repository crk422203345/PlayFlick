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
  <div class="flex min-h-[360px] flex-col items-center justify-center text-center">
    <div
      class="grid h-20 w-20 place-items-center rounded-3xl border"
      :class="
        tone === 'pink'
          ? 'border-[#ff3366]/25 bg-[#ff3366]/10 text-[#ff8bad]'
          : 'border-[#00bfa5]/25 bg-[#00bfa5]/10 text-[#9fffee]'
      "
    >
      <Inbox class="h-10 w-10" />
    </div>
    <h3 class="mt-5 text-2xl font-black text-white">{{ title }}</h3>
    <p class="mt-2 max-w-sm text-sm leading-6 text-white/52">{{ description }}</p>
  </div>
</template>
