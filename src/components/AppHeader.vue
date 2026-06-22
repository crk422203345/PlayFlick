<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Menu, Play, Search, X } from 'lucide-vue-next'
import type { NavItem } from '@/data/playflick'
import ThemeToggle from './ThemeToggle.vue'

const props = defineProps<{
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

// Dynamic sliding active indicator
const tabLabels = ref<HTMLElement[]>([])
const indicatorStyle = ref({
  left: '0px',
  width: '0px',
  opacity: 0,
})

const updateIndicator = () => {
  const activeIndex = props.navItems.indexOf(props.activeNav)
  if (activeIndex === -1) return

  const activeEl = tabLabels.value[activeIndex]
  if (!activeEl) return

  const parentEl = activeEl.parentElement
  if (!parentEl) return

  const activeRect = activeEl.getBoundingClientRect()
  const parentRect = parentEl.getBoundingClientRect()

  const left = activeRect.left - parentRect.left
  const width = activeRect.width

  indicatorStyle.value = {
    left: `${left}px`,
    width: `${width}px`,
    opacity: 1,
  }
}

watch(() => props.activeNav, async () => {
  await nextTick()
  updateIndicator()
})

onMounted(async () => {
  await nextTick()
  updateIndicator()
  window.addEventListener('resize', updateIndicator)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIndicator)
})
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
        <div class="cir-tabs" role="tablist" aria-label="Navigation">
          <!-- Dynamic sliding indicator pill -->
          <div class="cir-tabs__indicator" :style="indicatorStyle"></div>

          <template v-for="(item, index) in navItems" :key="item">
            <input
              class="cir-tabs__r"
              type="radio"
              name="header-nav"
              :id="`nav-${index}`"
              :value="item"
              :checked="activeNav === item"
              @change="emit('change-nav', item)"
            />
            <label
              :ref="el => { if (el) tabLabels[index] = el as HTMLElement }"
              class="cir-tabs__t"
              :for="`nav-${index}`"
              role="tab"
              :aria-selected="activeNav === item"
            >
              {{ item }}
            </label>
          </template>
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
.cir-tabs {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  background: var(--card-bg-solid, #ffffff);
  border: 1px solid var(--border-color-strong, #e3e8ee);
  border-radius: 999px;
  box-shadow:
    0 1px 1px rgba(14, 17, 22, 0.04),
    0 20px 40px -24px rgba(14, 17, 22, 0.18);
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  transition: all 0.3s ease;
  z-index: 1;
}

[data-theme="dark"] .cir-tabs {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.2),
    0 20px 40px -24px rgba(0, 0, 0, 0.6);
}

.cir-tabs__indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  border-radius: 999px;
  /* Brand gradient background for light theme */
  background: linear-gradient(135deg, #ff3366 0%, #d81b4f 100%);
  box-shadow:
    0 2px 8px rgba(255, 51, 102, 0.22),
    0 8px 20px -6px rgba(255, 51, 102, 0.14);
  transition:
    left 280ms cubic-bezier(0.25, 1, 0.5, 1),
    width 280ms cubic-bezier(0.25, 1, 0.5, 1),
    opacity 200ms ease;
  z-index: 0;
  pointer-events: none;
}

[data-theme="dark"] .cir-tabs__indicator {
  /* Slightly more glowing brand gradient for dark theme */
  background: linear-gradient(135deg, #ff3366 0%, #c4224e 100%);
  box-shadow:
    0 0 14px rgba(255, 51, 102, 0.36),
    0 2px 6px rgba(255, 51, 102, 0.2);
}

.cir-tabs__r {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.cir-tabs__t {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-secondary, #5b6472);
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cir-tabs__t:hover {
  color: var(--text-color, #0e1116);
}

[data-theme="dark"] .cir-tabs__t:hover {
  color: #ffffff;
}

.cir-tabs__r:checked + .cir-tabs__t {
  color: #ffffff;
  font-weight: 600;
}

[data-theme="dark"] .cir-tabs__r:checked + .cir-tabs__t {
  color: #ffffff;
  font-weight: 600;
}

.cir-tabs__r:focus-visible + .cir-tabs__t {
  box-shadow: 0 0 0 3px rgba(255, 51, 102, 0.4);
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
