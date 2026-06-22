<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { navItems, type NavItem } from '@/data/playflick'
import AboutPage from '@/pages/AboutPage.vue'
import DramaPage from '@/pages/DramaPage.vue'
import GamesPage from '@/pages/GamesPage.vue'
import HomePage from '@/pages/HomePage.vue'
import TransitionPage from '@/pages/TransitionPage.vue'
import { useTheme } from '@/composables/useTheme'

// Initialize Theme
const { initTheme } = useTheme()
initTheme()

const PAGE_TRANSITION_DURATION = 900
const activeNav = ref<NavItem>('首页')
const isPageTransitioning = ref(true)
const isPageDataReady = ref(true)
let pageTransitionTimer: number | undefined
let pageTransitionStartedAt = 0
let pageTransitionId = 0

const needsPageReady = (item: NavItem) => item === '短剧专区' || item === '小游戏专区'

const switchNav = (item: NavItem) => {
  if (activeNav.value === item && !isPageTransitioning.value) return

  const transitionId = ++pageTransitionId
  activeNav.value = item
  isPageTransitioning.value = true
  isPageDataReady.value = !needsPageReady(item)
  pageTransitionStartedAt = Date.now()
  window.scrollTo({ top: 0, behavior: 'smooth' })
  startPageTransitionTimer(transitionId)
}

const startPageTransitionTimer = (transitionId = pageTransitionId) => {
  if (pageTransitionTimer) window.clearTimeout(pageTransitionTimer)
  pageTransitionTimer = window.setTimeout(() => {
    finishPageTransition(transitionId)
  }, PAGE_TRANSITION_DURATION)
}

const finishPageTransition = (transitionId = pageTransitionId) => {
  if (transitionId !== pageTransitionId || !isPageDataReady.value) return

  const remainingTime = PAGE_TRANSITION_DURATION - (Date.now() - pageTransitionStartedAt)

  if (remainingTime > 0) {
    if (pageTransitionTimer) window.clearTimeout(pageTransitionTimer)
    pageTransitionTimer = window.setTimeout(() => {
      finishPageTransition(transitionId)
    }, remainingTime)
    return
  }

  isPageTransitioning.value = false
}

const handlePageReady = () => {
  isPageDataReady.value = true
  finishPageTransition()
}

onMounted(() => {
  pageTransitionStartedAt = Date.now()
  startPageTransitionTimer()
})

onBeforeUnmount(() => {
  if (pageTransitionTimer) window.clearTimeout(pageTransitionTimer)
})
</script>

<template>
  <div
    class="noise-overlay min-h-screen overflow-hidden bg-brand-bg text-brand-text transition-colors duration-300"
  >
    <!-- Ambient background glow — cinematic depth -->
    <div
      class="pointer-events-none fixed inset-0 overflow-hidden"
      style="opacity: var(--glow-opacity)"
    >
      <!-- Primary rose glow -->
      <div
        class="absolute left-[-8%] top-[-12%] h-[500px] w-[500px] rounded-full bg-[#ff3366]/20 blur-[140px]"
        style="animation: glowDrift1 18s ease-in-out infinite alternate"
      ></div>
      <!-- Teal accent glow -->
      <div
        class="absolute bottom-[8%] right-[-6%] h-[420px] w-[420px] rounded-full bg-[#00bfa5]/16 blur-[130px]"
        style="animation: glowDrift2 22s ease-in-out infinite alternate"
      ></div>
      <!-- Violet midpoint -->
      <div
        class="absolute left-[32%] top-[30%] h-[280px] w-[280px] rounded-full bg-[#7c4dff]/10 blur-[110px]"
        style="animation: glowDrift3 26s ease-in-out infinite alternate"
      ></div>
    </div>

    <AppHeader :nav-items="navItems" :active-nav="activeNav" @change-nav="switchNav" />

    <main class="relative z-10">
      <TransitionPage v-slot:loading v-if="isPageTransitioning" />
      <div v-show="!isPageTransitioning">
        <HomePage
          v-if="activeNav === '首页'"
          @navigate-dramas="switchNav('短剧专区')"
          @navigate-games="switchNav('小游戏专区')"
        />
        <DramaPage v-else-if="activeNav === '短剧专区'" @page-ready="handlePageReady" />
        <GamesPage v-else-if="activeNav === '小游戏专区'" @page-ready="handlePageReady" />
        <AboutPage v-else />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style>
@keyframes glowDrift1 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 60px) scale(1.15); }
}
@keyframes glowDrift2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-50px, -40px) scale(1.1); }
}
@keyframes glowDrift3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -50px) scale(1.2); }
}
</style>
