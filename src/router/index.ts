import { createRouter, createWebHashHistory } from 'vue-router'
import type { NavItem } from '@/data/playflick'
import HomePage from '@/pages/HomePage.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    nav?: NavItem
    keepAlive?: boolean
  }
}

export const navPaths: Record<NavItem, string> = {
  首页: '/',
  发现: '/discover',
  短剧专区: '/dramas',
  小游戏专区: '/games',
  榜单: '/rankings',
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: '首页', nav: '首页', keepAlive: true },
    },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('@/pages/DiscoverPage.vue'),
      meta: { title: '发现', nav: '发现', keepAlive: true },
    },
    {
      path: '/dramas',
      name: 'dramas',
      component: () => import('@/pages/DramaPage.vue'),
      meta: { title: '短剧专区', nav: '短剧专区', keepAlive: true },
    },
    {
      path: '/dramas/:id',
      name: 'drama-detail',
      component: () => import('@/pages/DramaDetailPage.vue'),
      meta: { title: '短剧详情', nav: '短剧专区' },
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('@/pages/GamesPage.vue'),
      meta: { title: '小游戏专区', nav: '小游戏专区', keepAlive: true },
    },
    {
      path: '/games/:id',
      name: 'game-detail',
      component: () => import('@/pages/GameDetailPage.vue'),
      meta: { title: '游戏详情', nav: '小游戏专区' },
    },
    {
      path: '/rankings',
      name: 'rankings',
      component: () => import('@/pages/RankingsPage.vue'),
      meta: { title: '热门榜单', nav: '榜单', keepAlive: true },
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('@/pages/LibraryPage.vue'),
      meta: { title: '我的片单', keepAlive: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/AboutPage.vue'),
      meta: { title: '关于我们' },
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('@/pages/BusinessPage.vue'),
      meta: { title: '商务合作' },
    },
    {
      path: '/legal/:document(terms|privacy|content|legal)',
      name: 'legal',
      component: () => import('@/pages/LegalPage.vue'),
      meta: { title: '平台规则' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: '页面未找到' },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})
