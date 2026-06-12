<script setup lang="ts">
import { ref } from 'vue'
import { Menu, Play, Search, X } from 'lucide-vue-next'
import type { NavItem } from '@/data/playflick'
import ThemeToggle from './ThemeToggle.vue'

defineProps<{
  navItems: NavItem[]
  activeNav: NavItem
}>()

const emit = defineEmits<{
  'change-nav': [item: NavItem]
}>()

const isMobileMenuOpen = ref(false)

const handleMobileNavClick = (item: NavItem) => {
  isMobileMenuOpen.value = false
  emit('change-nav', item)
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-brand-border bg-brand-header backdrop-blur-2xl transition-colors duration-300"
  >
    <div class="mx-auto flex h-[73px] max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <button
        class="group flex shrink-0 items-center gap-3 cursor-pointer border-none bg-transparent"
        aria-label="返回首页"
        @click="emit('change-nav', '首页')"
      >
        <span
          class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#ff3366] to-[#7c4dff] shadow-[0_0_32px_rgba(255,51,102,0.38)]"
        >
          <Play class="h-5 w-5 fill-white text-white" />
        </span>
        <span class="text-xl font-black tracking-normal sm:text-2xl text-brand-text">PlayFlick</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden flex-1 justify-center lg:flex">
        <div
          class="flex items-center gap-1 rounded-full border border-brand-border bg-brand-card/40 p-1 transition-colors duration-300"
        >
          <button
            v-for="item in navItems"
            :key="item"
            class="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer border-none bg-transparent"
            :class="
              activeNav === item
                ? 'bg-brand-hover text-brand-text shadow-sm'
                : 'text-brand-text-secondary hover:text-brand-text'
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

      <!-- Right Section (Search & Theme & Hamburger Menu) -->
      <div class="flex items-center gap-3">
        <!-- Search bar (Desktop) -->
        <div
          class="hidden w-[180px] xl:w-[220px] items-center gap-2 rounded-full border border-brand-border bg-brand-card/60 px-4 py-2 text-brand-text-secondary shadow-inner backdrop-blur-xl md:flex transition-all duration-300"
        >
          <Search class="h-4 w-4 text-[#ff6f98]" />
          <input
            class="w-full bg-transparent text-sm text-brand-text outline-none placeholder:text-brand-text-secondary/50 border-none"
            placeholder="搜索短剧 / 小游戏"
          />
        </div>

        <!-- Theme Switcher -->
        <ThemeToggle />

        <!-- Mobile Menu Hamburger Button -->
        <button
          class="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text cursor-pointer hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all duration-300 outline-none"
          :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <X v-if="isMobileMenuOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Navigation Drawer -->
    <transition name="slide-down">
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute top-[73px] left-0 right-0 border-b border-brand-border bg-brand-header backdrop-blur-2xl px-4 py-4 flex flex-col gap-2 shadow-2xl z-40 transition-colors duration-300"
      >
        <button
          v-for="item in navItems"
          :key="item"
          class="w-full text-left rounded-2xl px-5 py-3.5 text-base font-bold transition-all duration-300 cursor-pointer border-none bg-transparent"
          :class="
            activeNav === item
              ? 'bg-brand-primary/10 text-brand-primary shadow-[0_0_18px_rgba(255,51,102,0.15)]'
              : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-hover'
          "
          @click="handleMobileNavClick(item)"
        >
          {{ item }}
        </button>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
