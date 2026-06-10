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
    class="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0b0d26_0%,#10133a_46%,#0e1138_100%)] text-white"
  >
    <div class="pointer-events-none fixed inset-0 opacity-70">
      <div
        class="absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-[#ff3366]/18 blur-[120px]"
      ></div>
      <div
        class="absolute bottom-[12%] right-[-8%] h-[360px] w-[360px] rounded-full bg-[#00bfa5]/14 blur-[110px]"
      ></div>
      <div
        class="absolute left-[35%] top-[28%] h-64 w-64 rounded-full bg-[#6d5dfc]/10 blur-[100px]"
      ></div>
    </div>

    <AppHeader :nav-items="navItems" :active-nav="activeNav" @change-nav="switchNav" />

    <main class="relative z-10">
      <TransitionPage v-if="isPageTransitioning" />
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
