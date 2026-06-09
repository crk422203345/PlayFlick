<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronRight, Crown, Flame, Gamepad2, Play, Trophy } from 'lucide-vue-next'
import DramaCard from '@/components/DramaCard.vue'
import GameCard from '@/components/GameCard.vue'
import RankingCard from '@/components/RankingCard.vue'
import {
  featuredDramas,
  heroSlides,
  hotGames,
  operationCards,
  rankings,
  visualCategories,
} from '@/data/playflick'

const emit = defineEmits<{
  'navigate-dramas': []
  'navigate-games': []
}>()

const activeHeroIndex = ref(0)
let heroTimer: number | undefined

const activeHero = computed(() => heroSlides[activeHeroIndex.value] ?? heroSlides[0]!)

onMounted(() => {
  heroTimer = window.setInterval(() => {
    activeHeroIndex.value = (activeHeroIndex.value + 1) % heroSlides.length
  }, 4200)
})

onBeforeUnmount(() => {
  if (heroTimer) window.clearInterval(heroTimer)
})
</script>

<template>
  <section
    class="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1.55fr_0.85fr] lg:px-8 lg:py-10"
  >
    <article
      class="group relative min-h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30"
    >
      <img
        :src="activeHero.image"
        :alt="activeHero.title"
        class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,32,0.94)_0%,rgba(8,10,32,0.6)_48%,rgba(8,10,32,0.2)_100%)]"
      ></div>
      <div class="relative flex h-full min-h-[430px] max-w-2xl flex-col justify-end p-6 sm:p-10">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <span
            class="rounded-full bg-[#ff3366] px-3 py-1 text-xs font-black text-white shadow-[0_0_20px_rgba(255,51,102,0.5)]"
          >
            {{ activeHero.tag }}
          </span>
          <span class="flex items-center gap-1 text-sm font-semibold text-white/72">
            <Flame class="h-4 w-4 text-[#ffbf47]" />
            {{ activeHero.views }}
          </span>
        </div>
        <h1 class="max-w-xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">
          {{ activeHero.title }}
        </h1>
        <p class="mt-4 max-w-lg text-base leading-8 text-white/72 sm:text-lg">
          {{ activeHero.desc }}
        </p>
        <div class="mt-7 flex flex-wrap items-center gap-3">
          <button
            class="flex items-center gap-2 rounded-full bg-[#ff3366] px-6 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(255,51,102,0.38)] transition hover:-translate-y-1"
          >
            <Play class="h-4 w-4 fill-white" />
            立即观看
          </button>
          <button
            class="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white/82 backdrop-blur-md transition hover:border-white/30 hover:text-white"
          >
            加入片单
          </button>
        </div>
        <div class="mt-8 flex gap-2">
          <button
            v-for="(_, index) in heroSlides"
            :key="index"
            class="h-2.5 rounded-full transition-all duration-300"
            :class="
              activeHeroIndex === index
                ? 'w-9 bg-[#ff3366] shadow-[0_0_14px_#ff3366]'
                : 'w-2.5 bg-white/35'
            "
            :aria-label="`切换到第 ${index + 1} 张 Banner`"
            @click="activeHeroIndex = index"
          ></button>
        </div>
      </div>
    </article>

    <article
      class="relative min-h-[360px] overflow-hidden rounded-[28px] border border-[#00bfa5]/30 bg-[#071f2e]/70 p-6 shadow-[0_0_45px_rgba(0,191,165,0.16)] backdrop-blur-md sm:p-8 lg:min-h-full"
    >
      <img
        src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=86"
        alt="小游戏宣传"
        class="absolute inset-0 h-full w-full object-cover opacity-54"
      />
      <div
        class="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,31,0.22),rgba(5,12,31,0.9))]"
      ></div>
      <div class="relative flex h-full min-h-[320px] flex-col justify-between">
        <div class="flex justify-end">
          <span
            class="rounded-full border border-[#00bfa5]/40 bg-[#00bfa5]/15 px-3 py-1 text-xs font-black text-[#8fffee]"
          >
            今日礼包已刷新
          </span>
        </div>
        <div>
          <Gamepad2 class="mb-5 h-12 w-12 text-[#00e0c5]" />
          <h2 class="text-3xl font-black leading-tight sm:text-4xl">小游戏宇宙<br />一键开玩</h2>
          <p class="mt-4 max-w-sm text-sm leading-7 text-white/72">
            消除、竞速、塔防、冒险随时切换，低门槛高爽感，追剧间隙也能赢奖励。
          </p>
          <button
            class="mt-7 flex items-center gap-2 rounded-full bg-[#00bfa5] px-6 py-3 text-sm font-black text-[#031b20] shadow-[0_0_30px_rgba(0,191,165,0.42)] transition hover:-translate-y-1 hover:bg-[#12d8be]"
            @click="emit('navigate-games')"
          >
            进入游戏大厅
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <p class="text-sm font-bold text-[#ff6f98]">DRAMA PICKS</p>
        <h2 class="mt-2 text-2xl font-black sm:text-4xl">短剧推荐</h2>
      </div>
      <button
        class="hidden items-center gap-1 text-sm font-bold text-white/60 transition hover:text-white sm:flex"
        @click="emit('navigate-dramas')"
      >
        查看全部
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <DramaCard v-for="item in featuredDramas" :key="item.title" :item="item" />
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <p class="text-sm font-bold text-[#00e0c5]">GAME HOTSPOT</p>
        <h2 class="mt-2 text-2xl font-black sm:text-4xl">热门小游戏</h2>
      </div>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <GameCard v-for="item in hotGames" :key="item.title" :item="item" />
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div
      class="relative overflow-hidden rounded-[28px] border border-[#ffcf70]/25 bg-[linear-gradient(110deg,#2b1b40_0%,#6f244d_44%,#b8872b_100%)] p-6 shadow-[0_0_60px_rgba(255,51,102,0.18)] sm:p-9"
    >
      <div
        class="absolute right-8 top-[-40px] h-32 w-32 rounded-full border border-[#ffd37a]/30"
      ></div>
      <div
        class="absolute bottom-[-55px] right-28 h-40 w-40 rounded-full bg-[#ff3366]/24 blur-3xl"
      ></div>
      <div class="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div class="flex gap-4">
          <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#ffcf70]/18">
            <Crown class="h-8 w-8 text-[#ffd37a]" />
          </div>
          <div>
            <h2 class="text-2xl font-black sm:text-4xl">开通会员 尊享特权</h2>
            <p class="mt-3 max-w-2xl text-sm leading-7 text-white/76 sm:text-base">
              解锁短剧抢先看、无广告播放、专属游戏礼包、会员身份标识与高清沉浸体验。
            </p>
          </div>
        </div>
        <button
          class="rounded-full bg-white px-7 py-3 text-sm font-black text-[#5a1838] shadow-xl transition hover:-translate-y-1"
        >
          立即开通 VIP
        </button>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="mb-7 flex items-center gap-3">
      <Trophy class="h-8 w-8 text-[#ffbf47]" />
      <h2 class="text-2xl font-black sm:text-4xl">今日热播榜</h2>
    </div>
    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <RankingCard
        v-for="(item, index) in rankings"
        :key="item.title"
        :item="item"
        :rank="index + 1"
      />
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <h2 class="mb-7 text-2xl font-black sm:text-4xl">精选分类</h2>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      <button
        v-for="item in visualCategories"
        :key="item.name"
        class="group relative aspect-[3/5] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <img
          :src="item.image"
          :alt="item.name"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#07091f] via-[#07091f]/10 to-transparent"
        ></div>
        <span class="absolute inset-x-0 bottom-5 text-center text-xl font-black">{{
          item.name
        }}</span>
      </button>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="grid gap-5 md:grid-cols-3">
      <article
        v-for="item in operationCards"
        :key="item.title"
        class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div
          :class="item.color"
          class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br shadow-lg"
        >
          <component :is="item.icon" class="h-7 w-7 text-white" />
        </div>
        <h3 class="text-xl font-black">{{ item.title }}</h3>
        <p class="mt-3 text-sm leading-7 text-white/62">{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>
