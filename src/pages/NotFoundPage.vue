<script setup lang="ts">
import { Compass, Home, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section
    class="mx-auto flex min-h-[680px] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center"
  >
    <span class="text-7xl font-black text-brand-border-strong sm:text-9xl">404</span>
    <h1 class="mt-6 text-3xl font-black text-brand-text sm:text-4xl">这个页面没有上映</h1>
    <p class="mt-4 max-w-lg text-base leading-7 text-brand-text-secondary">
      地址可能已失效，也可能是内容暂时下线。可以回到首页，或者继续发现热门内容。
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        class="flex items-center gap-2 rounded-full bg-brand-text px-6 py-3 text-sm font-black text-brand-bg"
        @click="router.push('/')"
      >
        <Home class="h-4 w-4" /> 返回首页
      </button>
      <button
        type="button"
        class="flex items-center gap-2 rounded-full border border-brand-border bg-brand-card px-6 py-3 text-sm font-black text-brand-text"
        @click="router.push('/discover')"
      >
        <Compass class="h-4 w-4" /> 前往发现
      </button>
      <button
        type="button"
        class="flex items-center gap-2 rounded-full border border-brand-border bg-brand-card px-6 py-3 text-sm font-black text-brand-text"
        @click="router.push({ name: 'discover', query: { q: '热门' } })"
      >
        <Search class="h-4 w-4" /> 搜索内容
      </button>
    </div>
  </section>
</template>
