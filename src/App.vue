<script setup lang="ts">
import { ref } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { navItems, type NavItem } from '@/data/playflick'
import AboutPage from '@/pages/AboutPage.vue'
import DramaPage from '@/pages/DramaPage.vue'
import GamesPage from '@/pages/GamesPage.vue'
import HomePage from '@/pages/HomePage.vue'

const activeNav = ref<NavItem>('首页')

const switchNav = (item: NavItem) => {
  activeNav.value = item
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
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
      <HomePage
        v-if="activeNav === '首页'"
        @navigate-dramas="switchNav('短剧专区')"
        @navigate-games="switchNav('小游戏专区')"
      />
      <DramaPage v-else-if="activeNav === '短剧专区'" />
      <GamesPage v-else-if="activeNav === '小游戏专区'" />
      <AboutPage v-else />
    </main>

    <AppFooter />
  </div>
</template>
