<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Joystick, RefreshCw } from 'lucide-vue-next'
import GameCard from '@/components/GameCard.vue'
import { allGames } from '@/data/playflick'
import { gameApi } from '@/api/modules'

const emit = defineEmits<{
  'page-ready': []
}>()

const activeGameCategory = ref('全部游戏')
const gameCategories = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchGameTypes = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await gameApi.getGameTypes()
    if (res && res.c && Array.isArray(res.c)) {
      gameCategories.value = res.c.map((item) => item.name)
    } else {
      gameCategories.value = ['全部游戏', '休闲益智', '动作冒险', '竞速体育', '消除合成', '策略经营']
    }
  } catch (err: any) {
    console.error('Failed to fetch game types:', err)
    error.value = err?.message || '获取游戏类型失败，已加载缓存数据'
    gameCategories.value = ['全部游戏', '休闲益智', '动作冒险', '竞速体育', '消除合成', '策略经营']
  } finally {
    loading.value = false
  }
}

const filteredGames = computed(() => {
  if (activeGameCategory.value === '全部游戏') return allGames
  return allGames.filter((item) => item.category === activeGameCategory.value)
})

onMounted(async () => {
  await fetchGameTypes()
  emit('page-ready')
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <!-- Header Block -->
    <div class="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div class="max-w-3xl">
        <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00bfa5]/16">
          <Joystick class="h-8 w-8 text-[#00e0c5]" />
        </div>
        <h1 class="text-4xl font-black leading-tight sm:text-6xl text-brand-text">小游戏专区</h1>
        <p class="mt-4 text-base leading-8 text-brand-text-secondary sm:text-lg">
          免下载、低等待、强反馈。把追剧后的三分钟，变成赢奖励的高光时刻。
        </p>
      </div>
      <div
        class="rounded-3xl border border-brand-border bg-brand-card p-5 text-sm text-[#9fffee] bg-gradient-to-br from-[#00bfa5]/20 to-[#00bfa5]/5 self-start lg:self-auto"
      >
        <p class="font-black text-[#00bfa5]">今日在线 86.4 万</p>
        <p class="mt-2 text-brand-text-secondary">礼包库存每 2 小时刷新</p>
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading && gameCategories.length === 0" class="scrollbar-none mb-8 flex gap-3 overflow-x-auto">
      <div v-for="i in 6" :key="i" class="h-11 w-24 rounded-full bg-brand-card animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error && gameCategories.length === 0" class="mb-8 p-4 rounded-3xl border border-red-500/20 bg-red-500/10 text-sm text-red-400 flex items-center justify-between">
      <span class="flex items-center gap-2">
        <span>{{ error }}</span>
      </span>
      <button 
        class="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-white rounded-full px-4 py-1.5 transition text-xs font-semibold cursor-pointer border-none" 
        @click="fetchGameTypes"
      >
        <RefreshCw class="h-3 w-3 animate-spin" />
        重试
      </button>
    </div>

    <!-- Categories Tabs -->
    <div v-else class="scrollbar-none mb-8 flex gap-3 overflow-x-auto">
      <button
        v-for="category in gameCategories"
        :key="category"
        class="whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition cursor-pointer"
        :class="
          activeGameCategory === category
            ? 'border-[#00bfa5] bg-[#00bfa5] text-[#031b20] shadow-[0_0_22px_rgba(0,191,165,0.36)]'
            : 'border-brand-border bg-brand-card text-brand-text-secondary hover:text-brand-text'
        "
        @click="activeGameCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <!-- Game List -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <GameCard
        v-for="item in filteredGames"
        :key="item.title"
        :item="item"
        button-text="立即畅玩"
        detailed
      />
    </div>
  </section>
</template>
