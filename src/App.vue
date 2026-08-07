<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { navItems, type NavItem } from '@/data/playflick'
import { useTheme } from '@/composables/useTheme'
import { navPaths } from '@/router'

const route = useRoute()
const router = useRouter()
const { initTheme } = useTheme()
initTheme()

type SearchScope = 'drama' | 'game'

const cachedPageNames = [
  'HomePage',
  'DiscoverPage',
  'DramaPage',
  'GamesPage',
  'RankingsPage',
  'LibraryPage',
]

const activeNav = computed<NavItem | null>(() => route.meta.nav ?? null)
const searchQuery = computed(() => {
  const query = route.query.q
  return typeof query === 'string' ? query.trim() : ''
})

const switchNav = (item: NavItem) => {
  router.push(navPaths[item])
}

const handleSearch = (query: string, scope: SearchScope) => {
  router.push({ name: 'discover', query: { q: query.trim(), scope } })
}

watch(
  () => [route.meta.title, searchQuery.value],
  ([title, query]) => {
    document.title = `${query ? `“${query}” - ` : ''}${title} | PlayFlick`
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="flex min-h-screen flex-col overflow-hidden bg-brand-bg text-brand-text transition-colors duration-300"
  >
    <AppHeader
      :nav-items="navItems"
      :active-nav="activeNav"
      :search-query="searchQuery"
      @change-nav="switchNav"
      @search="handleSearch"
      @open-library="router.push({ name: 'library' })"
    />

    <main class="relative z-10 flex-1">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <KeepAlive :include="cachedPageNames" :max="6">
          <component
            :is="Component"
            :key="currentRoute.meta.keepAlive ? String(currentRoute.name) : currentRoute.fullPath"
          />
        </KeepAlive>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>
