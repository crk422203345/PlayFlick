<script setup lang="ts">
import { Clapperboard, Gamepad2, Gem, Play } from 'lucide-vue-next'
import { coreValues } from '@/data/playflick'
</script>

<template>
  <section
    class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8 lg:py-16"
  >
    <div>
      <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3366]/16">
        <Gem class="h-8 w-8 text-[#ff6f98]" />
      </div>
      <h1 class="max-w-3xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-brand-text">
        让每一次打开，都有好剧与好玩相遇
      </h1>
      <p class="mt-6 max-w-2xl text-base leading-8 text-brand-text-secondary sm:text-lg">
        PlayFlick
        是面向新一代线上娱乐用户的综合平台，把中国微短剧的高能叙事与休闲小游戏的即时反馈融合在一起。我们相信娱乐应该轻巧、可靠、漂亮，并且随时能带来一点点惊喜。
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <button
          class="rounded-full bg-[#ff3366] px-6 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(255,51,102,0.38)] border-none cursor-pointer"
        >
          了解品牌故事
        </button>
        <button
          class="rounded-full border border-brand-border bg-brand-card px-6 py-3 text-sm font-black text-brand-text-secondary hover:text-brand-text hover:bg-brand-hover cursor-pointer"
        >
          商务合作
        </button>
      </div>
    </div>

    <!-- Orbit Animation -->
    <div class="relative min-h-[400px] sm:min-h-[430px]">
      <div class="brand-orbit absolute inset-6 sm:inset-8 rounded-full border border-brand-border"></div>
      <div
        class="absolute left-1 sm:left-2 top-2 rounded-[24px] sm:rounded-[32px] border border-[#ff3366]/25 bg-[#ff3366]/12 p-3.5 sm:p-5 shadow-[0_0_45px_rgba(255,51,102,0.18)] backdrop-blur-md text-brand-text"
      >
        <Clapperboard class="h-8 w-8 sm:h-10 sm:w-10 text-[#ff6f98]" />
        <p class="mt-2 sm:mt-3 text-xs sm:text-sm font-black text-brand-text">微短剧引擎</p>
      </div>
      <div
        class="absolute right-1 sm:-right-2 top-24 sm:top-28 rounded-[24px] sm:rounded-[32px] border border-[#00bfa5]/25 bg-[#00bfa5]/12 p-3.5 sm:p-5 shadow-[0_0_45px_rgba(0,191,165,0.18)] backdrop-blur-md text-brand-text"
      >
        <Gamepad2 class="h-8 w-8 sm:h-10 sm:w-10 text-[#00e0c5]" />
        <p class="mt-2 sm:mt-3 text-xs sm:text-sm font-black text-brand-text">游戏大厅</p>
      </div>
      <div
        class="absolute -bottom-2 left-1/2 w-[55%] sm:w-[50%] -translate-x-1/2 rounded-[20px] sm:rounded-[24px] border border-brand-border bg-brand-card/80 p-2.5 sm:p-3 shadow-2xl shadow-brand-text/5 backdrop-blur-xl"
      >
        <div
          class="relative mx-auto aspect-square max-w-[130px] sm:max-w-[160px] rounded-[16px] sm:rounded-[20px] bg-[radial-gradient(circle_at_35%_25%,#ff6f98_0%,#7c4dff_38%,#00bfa5_100%)] p-2.5 sm:p-3 shadow-[0_30px_100px_rgba(124,77,255,0.25)]"
        >
          <div
            class="grid h-full w-full place-items-center rounded-[12px] sm:rounded-[16px] border border-white/20 bg-[#080b2c]/70 text-white"
          >
            <div class="text-center">
              <div
                class="mx-auto grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl bg-white text-[#ff3366]"
              >
                <Play class="h-4 w-4 sm:h-5 sm:w-5 fill-[#ff3366]" />
              </div>
              <p class="mt-2 sm:mt-3 text-base sm:text-lg font-black text-white">PlayFlick</p>
              <p class="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-white/56">Drama + Game</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Core Values -->
  <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="item in coreValues"
        :key="item.title"
        class="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-xl shadow-brand-text/5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-brand-hover">
          <component :is="item.icon" class="h-7 w-7 text-[#ff6f98]" />
        </div>
        <h3 class="text-xl font-black text-brand-text">{{ item.title }}</h3>
        <p class="mt-3 text-sm leading-7 text-brand-text-secondary">{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.brand-orbit {
  animation: orbitPulse 5s ease-in-out infinite;
}

@keyframes orbitPulse {
  0%,
  100% {
    transform: scale(0.96) rotate(0deg);
    opacity: 0.52;
  }

  50% {
    transform: scale(1.04) rotate(8deg);
    opacity: 0.9;
  }
}
</style>
