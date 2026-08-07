<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Bookmark, Clapperboard, Gamepad2, Menu, Play, Search, X } from 'lucide-vue-next'
import type { NavItem } from '@/data/playflick'
import ThemeToggle from './ThemeToggle.vue'

const props = withDefaults(
  defineProps<{
    navItems: NavItem[]
    activeNav: NavItem | null
    searchQuery?: string
  }>(),
  {
    searchQuery: '',
  },
)

const emit = defineEmits<{
  'change-nav': [item: NavItem]
  search: [query: string, scope: 'drama' | 'game']
  'open-library': []
}>()

const headerElement = ref<HTMLElement | null>(null)
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchInput = ref(props.searchQuery)

const handleMobileNavClick = (item: NavItem) => {
  isMobileMenuOpen.value = false
  emit('change-nav', item)
}

const openLibrary = () => {
  isMobileMenuOpen.value = false
  isSearchOpen.value = false
  emit('open-library')
}

const submitSearch = (scope?: 'drama' | 'game') => {
  const query = searchInput.value.trim()
  if (!query) return

  const resolvedScope = scope ?? (props.activeNav === '小游戏专区' ? 'game' : 'drama')
  isSearchOpen.value = false
  isMobileMenuOpen.value = false
  emit('search', query, resolvedScope)
}

const handleDocumentPointerDown = (event: PointerEvent) => {
  if (!headerElement.value?.contains(event.target as Node)) {
    isSearchOpen.value = false
    isMobileMenuOpen.value = false
  }
}

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  isSearchOpen.value = false
  isMobileMenuOpen.value = false
}

const tabLabels = ref<HTMLElement[]>([])
const indicatorStyle = ref({
  left: '0px',
  width: '0px',
  opacity: 0,
})

const updateIndicator = () => {
  const activeIndex = props.activeNav == null ? -1 : props.navItems.indexOf(props.activeNav)
  if (activeIndex === -1) {
    indicatorStyle.value = { ...indicatorStyle.value, opacity: 0 }
    return
  }

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

watch(
  () => props.activeNav,
  async () => {
    isMobileMenuOpen.value = false
    await nextTick()
    updateIndicator()
  },
)

watch(
  () => props.searchQuery,
  (query) => {
    searchInput.value = query
  },
)

onMounted(async () => {
  await nextTick()
  updateIndicator()
  window.addEventListener('resize', updateIndicator)
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIndicator)
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
  <header
    ref="headerElement"
    class="sticky top-0 z-50 border-b border-brand-border bg-brand-header backdrop-blur-2xl transition-all duration-300"
  >
    <div
      class="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
    >
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
              :ref="
                (el) => {
                  if (el) tabLabels[index] = el as HTMLElement
                }
              "
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
        <!-- Search (Desktop) -->
        <div class="relative hidden xl:block">
          <form
            class="flex w-[190px] items-center gap-2 rounded-full border border-brand-border bg-brand-card/60 px-3.5 py-2 backdrop-blur-xl transition-all duration-200 hover:border-brand-border-strong focus-within:border-brand-border-strong focus-within:bg-brand-card xl:w-[220px]"
            role="search"
            @submit.prevent="submitSearch()"
            @focusin="isSearchOpen = true"
          >
            <button
              type="submit"
              class="grid shrink-0 place-items-center border-0 bg-transparent p-0 text-brand-text-tertiary"
              aria-label="提交搜索"
            >
              <Search class="h-3.5 w-3.5" />
            </button>
            <input
              v-model="searchInput"
              class="w-full border-none bg-transparent text-[13px] text-brand-text outline-none placeholder:text-brand-text-tertiary"
              placeholder="搜索短剧 / 小游戏"
              aria-label="搜索短剧或小游戏"
              @input="isSearchOpen = true"
            />
          </form>

          <div
            v-if="isSearchOpen && searchInput.trim()"
            class="absolute right-0 top-[calc(100%+10px)] w-72 overflow-hidden rounded-xl border border-brand-border bg-brand-card-solid p-2 shadow-xl shadow-brand-shadow"
          >
            <button type="button" class="search-scope-button" @click="submitSearch('drama')">
              <Clapperboard class="h-4 w-4 text-[#ff3366]" />
              <span>在短剧中搜索“{{ searchInput.trim() }}”</span>
            </button>
            <button type="button" class="search-scope-button" @click="submitSearch('game')">
              <Gamepad2 class="h-4 w-4 text-[#00bfa5]" />
              <span>在游戏中搜索“{{ searchInput.trim() }}”</span>
            </button>
          </div>
        </div>

        <!-- Compact Search (Small Desktop) -->
        <div class="relative hidden lg:block xl:hidden">
          <button
            type="button"
            class="grid h-9 w-9 place-items-center rounded-full border border-brand-border bg-brand-card text-brand-text transition hover:bg-brand-hover"
            :aria-expanded="isSearchOpen"
            aria-controls="compact-search-panel"
            aria-label="打开搜索"
            title="搜索"
            @click="isSearchOpen = !isSearchOpen"
          >
            <Search class="h-4 w-4" />
          </button>

          <div
            v-if="isSearchOpen"
            id="compact-search-panel"
            class="absolute right-0 top-[calc(100%+10px)] w-80 rounded-lg border border-brand-border bg-brand-card-solid p-3 shadow-xl shadow-brand-shadow"
          >
            <form
              class="flex items-center gap-2 rounded-md border border-brand-border bg-brand-card px-3 py-2.5"
              role="search"
              @submit.prevent="submitSearch()"
            >
              <Search class="h-4 w-4 shrink-0 text-brand-text-tertiary" />
              <input
                v-model="searchInput"
                class="w-full border-none bg-transparent text-sm text-brand-text outline-none placeholder:text-brand-text-tertiary"
                placeholder="搜索短剧 / 小游戏"
                aria-label="搜索短剧或小游戏"
              />
            </form>
            <div v-if="searchInput.trim()" class="mt-2 grid grid-cols-2 gap-2">
              <button type="button" class="mobile-search-button" @click="submitSearch('drama')">
                <Clapperboard class="h-4 w-4" /> 搜短剧
              </button>
              <button type="button" class="mobile-search-button" @click="submitSearch('game')">
                <Gamepad2 class="h-4 w-4" /> 搜游戏
              </button>
            </div>
          </div>
        </div>

        <!-- Theme Switcher -->
        <ThemeToggle />

        <button
          class="hidden h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text transition hover:bg-brand-hover md:flex"
          type="button"
          aria-label="我的片单"
          title="我的片单"
          @click="openLibrary"
        >
          <Bookmark class="h-4 w-4" />
        </button>

        <!-- Mobile Menu Hamburger Button -->
        <button
          class="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text cursor-pointer hover:bg-brand-hover transition-all duration-200 outline-none active:scale-95"
          :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-navigation"
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
        id="mobile-navigation"
        class="absolute left-0 right-0 top-[68px] z-40 flex flex-col gap-1 border-b border-brand-border bg-brand-card-solid px-4 py-3 shadow-xl lg:hidden"
      >
        <form
          class="mb-2 flex items-center gap-2 rounded-xl border border-brand-border bg-brand-card px-3 py-2.5"
          role="search"
          @submit.prevent="submitSearch()"
        >
          <Search class="h-4 w-4 shrink-0 text-brand-text-tertiary" />
          <input
            v-model="searchInput"
            class="w-full border-none bg-transparent text-sm text-brand-text outline-none placeholder:text-brand-text-tertiary"
            placeholder="搜索短剧 / 小游戏"
            aria-label="搜索短剧或小游戏"
          />
        </form>
        <div v-if="searchInput.trim()" class="mb-2 grid grid-cols-2 gap-2">
          <button type="button" class="mobile-search-button" @click="submitSearch('drama')">
            <Clapperboard class="h-4 w-4" />
            搜短剧
          </button>
          <button type="button" class="mobile-search-button" @click="submitSearch('game')">
            <Gamepad2 class="h-4 w-4" />
            搜游戏
          </button>
        </div>
        <button
          v-for="item in navItems"
          :key="item"
          class="mobile-nav-btn"
          :class="{ active: activeNav === item }"
          @click="handleMobileNavClick(item)"
        >
          {{ item }}
        </button>
        <button class="mobile-nav-btn" @click="openLibrary">我的片单</button>
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
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
  transition: all 0.3s ease;
  z-index: 1;
}

[data-theme='dark'] .cir-tabs {
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

[data-theme='dark'] .cir-tabs__indicator {
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
  transition: color 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cir-tabs__t:hover {
  color: var(--text-color, #0e1116);
}

[data-theme='dark'] .cir-tabs__t:hover {
  color: #ffffff;
}

.cir-tabs__r:checked + .cir-tabs__t {
  color: #ffffff;
  font-weight: 600;
}

[data-theme='dark'] .cir-tabs__r:checked + .cir-tabs__t {
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

[data-theme='dark'] .mobile-nav-btn {
  color: rgba(242, 242, 247, 0.65);
}

[data-theme='dark'] .mobile-nav-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.04);
}

[data-theme='dark'] .mobile-nav-btn.active {
  color: #ff4d7e;
  background: rgba(255, 51, 102, 0.12);
}

.search-scope-button,
.mobile-search-button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--text-color);
  font: inherit;
  cursor: pointer;
}

.search-scope-button {
  min-height: 42px;
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
  font-size: 13px;
}

.search-scope-button:hover,
.search-scope-button:focus-visible {
  background: var(--hover-bg);
  outline: none;
}

.search-scope-button span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-search-button {
  justify-content: center;
  min-height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color-secondary);
  font-size: 13px;
  font-weight: 700;
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
