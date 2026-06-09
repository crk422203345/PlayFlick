<script setup lang="ts">
import { computed, ref } from 'vue'
import { Clapperboard } from 'lucide-vue-next'
import DramaCard from '@/components/DramaCard.vue'
import { allDramas, dramaCategories } from '@/data/playflick'

const activeDramaCategory = ref('猜你喜欢')

const filteredDramas = computed(() => {
  if (activeDramaCategory.value === '猜你喜欢') return allDramas
  return allDramas.filter((item) => item.type === activeDramaCategory.value)
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 max-w-3xl">
      <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3366]/16">
        <Clapperboard class="h-8 w-8 text-[#ff6f98]" />
      </div>
      <h1 class="text-4xl font-black leading-tight sm:text-6xl">短剧专区</h1>
      <p class="mt-4 text-base leading-8 text-white/64 sm:text-lg">
        从都市逆袭到甜宠古装，PlayFlick 用高密度剧情满足你的碎片化追剧时刻。
      </p>
    </div>

    <div class="scrollbar-none mb-8 flex gap-3 overflow-x-auto">
      <button
        v-for="category in dramaCategories"
        :key="category"
        class="whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition"
        :class="
          activeDramaCategory === category
            ? 'border-[#ff3366] bg-[#ff3366] text-white shadow-[0_0_22px_rgba(255,51,102,0.36)]'
            : 'border-white/10 bg-white/[0.05] text-white/60 hover:text-white'
        "
        @click="activeDramaCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <DramaCard v-for="item in filteredDramas" :key="item.title" :item="item" compact />
    </div>
  </section>
</template>
