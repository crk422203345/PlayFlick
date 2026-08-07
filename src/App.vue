<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { navItems, type NavItem } from '@/data/playflick'
import HomePage from '@/pages/HomePage.vue'
import { useTheme } from '@/composables/useTheme'

const { initTheme } = useTheme()
initTheme()

const AboutPage = defineAsyncComponent(() => import('@/pages/AboutPage.vue'))
const DramaPage = defineAsyncComponent(() => import('@/pages/DramaPage.vue'))
const GamesPage = defineAsyncComponent(() => import('@/pages/GamesPage.vue'))

type SearchScope = 'drama' | 'game'

const pathByNav: Record<NavItem, string> = {
  首页: '/',
  短剧专区: '/dramas',
  小游戏专区: '/games',
  关于我们: '/about',
}

const navByPath = Object.fromEntries(
  Object.entries(pathByNav).map(([nav, path]) => [path, nav]),
) as Record<string, NavItem>

const readRoute = () => {
  const [path = '/', queryString = ''] = (window.location.hash.slice(1) || '/').split('?')
  return {
    nav: navByPath[path] ?? '首页',
    query: new URLSearchParams(queryString).get('q')?.trim() ?? '',
  }
}

const initialRoute = readRoute()
const activeNav = ref<NavItem>(initialRoute.nav)
const searchQuery = ref(initialRoute.query)

const getRouteHash = (item: NavItem, query = '') => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  const queryString = params.toString()
  return `#${pathByNav[item]}${queryString ? `?${queryString}` : ''}`
}

const applyRoute = (item: NavItem, query = '', replace = false, scroll = true) => {
  const normalizedQuery = query.trim()
  const hash = getRouteHash(item, normalizedQuery)

  if (window.location.hash !== hash) {
    window.history[replace ? 'replaceState' : 'pushState'](null, '', hash)
  }

  activeNav.value = item
  searchQuery.value = normalizedQuery

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

const switchNav = (item: NavItem) => {
  applyRoute(item)
}

const handleSearch = (query: string, scope: SearchScope) => {
  applyRoute(scope === 'game' ? '小游戏专区' : '短剧专区', query)
}

const syncRouteFromLocation = () => {
  const route = readRoute()
  activeNav.value = route.nav
  searchQuery.value = route.query
  window.scrollTo({ top: 0, behavior: 'auto' })
}

watch(
  [activeNav, searchQuery],
  ([item, query]) => {
    const queryTitle = query ? `“${query}” - ` : ''
    document.title = `${queryTitle}${item} | PlayFlick`
  },
  { immediate: true },
)

onMounted(() => {
  applyRoute(activeNav.value, searchQuery.value, true, false)
  window.addEventListener('popstate', syncRouteFromLocation)
  window.addEventListener('hashchange', syncRouteFromLocation)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncRouteFromLocation)
  window.removeEventListener('hashchange', syncRouteFromLocation)
})
</script>

<template>
  <div
    class="min-h-screen overflow-hidden bg-brand-bg text-brand-text transition-colors duration-300"
  >
    <AppHeader
      :nav-items="navItems"
      :active-nav="activeNav"
      :search-query="searchQuery"
      @change-nav="switchNav"
      @search="handleSearch"
    />

    <main class="relative z-10">
      <KeepAlive :max="4">
        <HomePage
          v-if="activeNav === '首页'"
          @navigate-dramas="switchNav('短剧专区')"
          @navigate-games="switchNav('小游戏专区')"
        />
        <DramaPage v-else-if="activeNav === '短剧专区'" :search-query="searchQuery" />
        <GamesPage v-else-if="activeNav === '小游戏专区'" :search-query="searchQuery" />
        <AboutPage v-else />
      </KeepAlive>
    </main>

    <AppFooter />
  </div>
</template>
