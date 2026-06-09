<script setup lang="ts">
import { Play, Search } from 'lucide-vue-next'
import type { NavItem } from '@/data/playflick'

defineProps<{
  navItems: NavItem[]
  activeNav: NavItem
}>()

const emit = defineEmits<{
  'change-nav': [item: NavItem]
}>()
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d26]/72 backdrop-blur-2xl">
    <div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <button
        class="group flex shrink-0 items-center gap-3"
        aria-label="返回首页"
        @click="emit('change-nav', '首页')"
      >
        <span
          class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#ff3366] to-[#7c4dff] shadow-[0_0_32px_rgba(255,51,102,0.38)]"
        >
          <Play class="h-5 w-5 fill-white text-white" />
        </span>
        <span class="text-xl font-black tracking-normal sm:text-2xl">PlayFlick</span>
      </button>

      <nav class="hidden flex-1 justify-center lg:flex">
        <div
          class="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
        >
          <button
            v-for="item in navItems"
            :key="item"
            class="relative rounded-full px-5 py-2.5 text-sm font-semibold text-white/68 transition-all duration-300"
            :class="
              activeNav === item
                ? 'bg-white/[0.08] text-white shadow-[0_0_26px_rgba(255,51,102,0.22)]'
                : 'hover:text-white'
            "
            @click="emit('change-nav', item)"
          >
            {{ item }}
            <span
              class="absolute inset-x-5 -bottom-1 h-0.5 rounded-full bg-[#ff3366] transition-all duration-300"
              :class="activeNav === item ? 'opacity-100 shadow-[0_0_16px_#ff3366]' : 'opacity-0'"
            ></span>
          </button>
        </div>
      </nav>

      <div
        class="ml-auto hidden w-[300px] max-w-[34vw] items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-white/55 shadow-inner shadow-white/5 backdrop-blur-xl md:flex"
      >
        <Search class="h-4 w-4 text-[#ff6f98]" />
        <input
          class="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          placeholder="搜索短剧 / 小游戏"
        />
      </div>
    </div>

    <div class="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
      <button
        v-for="item in navItems"
        :key="item"
        class="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition"
        :class="
          activeNav === item
            ? 'border-[#ff3366] bg-[#ff3366]/18 text-white shadow-[0_0_18px_rgba(255,51,102,0.28)]'
            : 'border-white/10 bg-white/[0.04] text-white/60'
        "
        @click="emit('change-nav', item)"
      >
        {{ item }}
      </button>
    </div>
  </header>
</template>
