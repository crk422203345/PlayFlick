<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text shadow-sm transition-all duration-300 hover:bg-brand-hover hover:scale-105 cursor-pointer outline-none"
    :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <transition name="fade-rotate" mode="out-in">
      <Sun v-if="isDark" class="h-[18px] w-[18px] text-yellow-400" />
      <Moon v-else class="h-[18px] w-[18px] text-slate-700" />
    </transition>
  </button>
</template>

<style scoped>
.fade-rotate-enter-active,
.fade-rotate-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.fade-rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
