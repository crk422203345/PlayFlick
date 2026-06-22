<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
import type { GameItem } from '@/data/playflick'

withDefaults(
  defineProps<{
    item: GameItem
    buttonText?: string
    detailed?: boolean
  }>(),
  {
    buttonText: '进入游戏',
    detailed: false,
  },
)
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-md shadow-brand-shadow backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-shadow hover:border-brand-border-strong"
  >
    <!-- Game image -->
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="item.image"
        :alt="item.title"
        class="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.06]"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
      ></div>

      <!-- Category badge -->
      <span
        class="absolute left-3 top-3 inline-flex items-center rounded-lg bg-[#00bfa5] px-2.5 py-1 text-[10px] font-bold text-[#02231e] tracking-wide uppercase shadow-md"
      >
        {{ item.category }}
      </span>

      <!-- Live players chip -->
      <div
        v-if="detailed"
        class="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 backdrop-blur-sm"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-[#00e0c5] shadow-[0_0_6px_#00e0c5]"></span>
        <span class="text-[10px] font-semibold text-white/90">{{ item.players }}</span>
      </div>
    </div>

    <!-- Card body -->
    <div :class="detailed ? 'p-4' : 'p-3'" class="transition-colors duration-300">
      <h3 class="line-clamp-1 text-[14px] font-semibold leading-snug text-brand-text">{{ item.title }}</h3>

      <p v-if="!detailed" class="mt-1.5 text-[11px] text-brand-text-secondary">{{ item.players }} 人在玩</p>

      <!-- ⚡ 扫光 CTA 按钮 (来自 Uiverse.io by Ali-Tahmazi99 · 主题适配版) -->
      <button
        :class="detailed ? 'mt-3.5' : 'mt-2.5'"
        class="game-sweep-btn w-full"
      >
        <span class="btn-inner">
          <Zap v-if="detailed" class="btn-icon" />
          {{ buttonText }}
        </span>
      </button>
    </div>
  </article>
</template>

<style scoped>
/* ============================================================
   扫光按钮 — 来自 Uiverse.io by Ali-Tahmazi99
   颜色体系: 青绿 (teal) 适配 PlayFlick 游戏主题
   深色模式: 青绿边框 + 深色底 → 鼠标悬浮扫入青绿渐变
   浅色模式: 深茶绿边框 + 白底 → 鼠标悬浮扫入深茶绿渐变
============================================================ */

.game-sweep-btn {
  display: inline-block;
  height: 40px;
  border-radius: 10px;
  /* 深色主题默认颜色 */
  border: 1.5px solid #00bfa5;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease, all 0.5s ease-in;
  z-index: 1;
  cursor: pointer;
  background: transparent;
  font-family: inherit;
}

.game-sweep-btn::before,
.game-sweep-btn::after {
  content: '';
  position: absolute;
  top: 0;
  width: 0;
  height: 100%;
  transform: skew(15deg);
  transition: all 0.5s;
  z-index: -1;
}

/* 深色主题 sweep 颜色 */
.game-sweep-btn::before {
  left: -10px;
  background: #007a6b;
}

.game-sweep-btn::after {
  right: -10px;
  background: #00bfa5;
}

.game-sweep-btn:hover::before,
.game-sweep-btn:hover::after {
  width: 58%;
}

.game-sweep-btn:hover .btn-inner {
  color: #ffffff;
  transition: color 0.3s;
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 100%;
  /* 深色主题文字默认 */
  color: #00e0c5;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: color 0.3s ease-in;
}

.btn-icon {
  width: 13px;
  height: 13px;
  fill: currentColor;
  flex-shrink: 0;
}
</style>

<!-- 全局非 scoped 块处理浅色主题覆盖 (需要穿透 data-theme) -->
<style>
/* 浅色主题下游戏按钮颜色覆盖 */
:root:not([data-theme="dark"]) .game-sweep-btn {
  border-color: #00897b !important;
}

:root:not([data-theme="dark"]) .game-sweep-btn::before {
  background: #004d40 !important;
}

:root:not([data-theme="dark"]) .game-sweep-btn::after {
  background: #00897b !important;
}

:root:not([data-theme="dark"]) .game-sweep-btn .btn-inner {
  color: #00695c !important;
}

:root:not([data-theme="dark"]) .game-sweep-btn:hover .btn-inner {
  color: #ffffff !important;
}
</style>
