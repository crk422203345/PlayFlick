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
    class="sticky top-0 z-50 border-b border-brand-border bg-brand-header backdrop-blur-2xl transition-all duration-300"
  >
    <div class="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <button
        class="group flex shrink-0 items-center gap-2.5 cursor-pointer border-none bg-transparent"
        aria-label="返回首页"
        @click="emit('change-nav', '首页')"
      >
        <span
          class="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff3366] to-[#c4224e] shadow-[0_2px_14px_rgba(255,51,102,0.42)] transition-all duration-200 group-hover:shadow-[0_4px_20px_rgba(255,51,102,0.56)] group-hover:scale-105"
        >
          <Play class="h-4 w-4 fill-white text-white translate-x-0.5" />
        </span>
        <span class="text-[17px] font-bold tracking-tight text-brand-text">PlayFlick</span>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden flex-1 justify-center lg:flex">
        <div class="nav-container">
          <button
            v-for="item in navItems"
            :key="item"
            class="nav-btn"
            :class="{ active: activeNav === item }"
            @click="emit('change-nav', item)"
          >
            {{ item }}
            <!-- Active indicator line -->
            <span
              v-if="activeNav === item"
              class="indicator-line"
            ></span>
          </button>
        </div>
      </nav>

      <!-- Right Section -->
      <div class="flex items-center gap-2">
        <!-- Search bar (Desktop) -->
        <div
          class="hidden w-[180px] xl:w-[210px] items-center gap-2 rounded-full border border-brand-border bg-brand-card/60 px-3.5 py-2 backdrop-blur-xl md:flex transition-all duration-200 hover:border-brand-border-strong focus-within:border-brand-border-strong focus-within:bg-brand-card"
        >
          <Search class="h-3.5 w-3.5 shrink-0 text-brand-text-tertiary" />
          <input
            class="w-full bg-transparent text-[13px] text-brand-text outline-none placeholder:text-brand-text-tertiary border-none"
            placeholder="搜索短剧 / 小游戏"
          />
        </div>

        <!-- Theme Switcher -->
        <ThemeToggle />

        <!-- Mobile Menu Hamburger Button -->
        <button
          class="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text cursor-pointer hover:bg-brand-hover transition-all duration-200 outline-none active:scale-95"
          :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <component :is="isMobileMenuOpen ? X : Menu" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Navigation Drawer -->
    <transition name="slide-down">
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute top-[68px] left-0 right-0 border-b border-brand-border bg-brand-header backdrop-blur-2xl px-4 py-3 flex flex-col gap-1 shadow-lg z-40"
      >
        <button
          v-for="item in navItems"
          :key="item"
          class="mobile-nav-btn"
          :class="{ active: activeNav === item }"
          @click="handleMobileNavClick(item)"
        >
          {{ item }}
        </button>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.nav-container {
  display: flex;
  align-items: center;
  gap: 2px;
  border-radius: 9999px;
  padding: 3px;
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color-strong);
  transition: all 0.3s ease;
}

.nav-btn {
  position: relative;
  border-radius: 9999px;
  padding: 6px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  background: transparent;
}

.nav-btn:hover {
  color: var(--text-color);
  background: var(--hover-bg);
}

.nav-btn.active {
  color: var(--text-color);
  background: var(--card-bg-solid);
  font-weight: 600;
  box-shadow: 0 2px 8px var(--shadow-color);
}

/* Specific styles for dark theme to make it POP */
[data-theme="dark"] .nav-container {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .nav-btn {
  color: rgba(242, 242, 247, 0.55);
}

[data-theme="dark"] .nav-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .nav-btn.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12); /* Brighter glass pill */
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.08), /* Inner border glow */
    0 4px 12px rgba(0, 0, 0, 0.4);       /* Drop shadow */
}

/* Indicator line */
.indicator-line {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: 12px;
  border-radius: 9999px;
  background-color: var(--primary-color);
  box-shadow: 0 1px 6px var(--primary-color);
  transition: all 0.3s ease;
}

[data-theme="dark"] .indicator-line {
  background-color: #ff3366;
  box-shadow: 0 0 8px #ff3366, 0 0 2px #ff3366;
}

/* Mobile Nav Styles */
.mobile-nav-btn {
  width: 100%;
  text-align: left;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  background: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.mobile-nav-btn:hover {
  color: var(--text-color);
  background: var(--hover-bg);
}

.mobile-nav-btn.active {
  color: var(--primary-color);
  background: rgba(255, 51, 102, 0.08);
  font-weight: 600;
}

[data-theme="dark"] .mobile-nav-btn {
  color: rgba(242, 242, 247, 0.65);
}

[data-theme="dark"] .mobile-nav-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.04);
}

[data-theme="dark"] .mobile-nav-btn.active {
  color: #ff4d7e; /* Brighter pink for readability on dark bg */
  background: rgba(255, 51, 102, 0.12);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
