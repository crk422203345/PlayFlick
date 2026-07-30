<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getFallbackImage } from '@/utils/content'

const props = withDefaults(
  defineProps<{
    src?: string
    alt: string
    fallbackKind?: 'hero' | 'drama' | 'game'
    loading?: 'eager' | 'lazy'
  }>(),
  {
    src: '',
    fallbackKind: 'drama',
    loading: 'lazy',
  },
)

const attemptedFallback = ref(false)
const fallbackSource = computed(() => getFallbackImage(props.alt, props.fallbackKind))
const needsImmediateFallback = (source: string) =>
  source.includes('playlet001.oss-accelerate.aliyuncs.com')
const getInitialSource = (source: string) =>
  !source || needsImmediateFallback(source) ? fallbackSource.value : source
const resolvedSource = ref(getInitialSource(props.src))
let fallbackTimer: number | undefined

const clearFallbackTimer = () => {
  if (fallbackTimer) window.clearTimeout(fallbackTimer)
  fallbackTimer = undefined
}

const useFallback = () => {
  clearFallbackTimer()
  if (attemptedFallback.value) return
  attemptedFallback.value = true
  resolvedSource.value = fallbackSource.value
}

const scheduleFallback = () => {
  clearFallbackTimer()
  if (resolvedSource.value === fallbackSource.value) return
  fallbackTimer = window.setTimeout(useFallback, 6000)
}

watch(
  () => props.src,
  (source) => {
    attemptedFallback.value = false
    resolvedSource.value = getInitialSource(source)
    scheduleFallback()
  },
)

onMounted(scheduleFallback)
onBeforeUnmount(clearFallbackTimer)
</script>

<template>
  <img
    class="text-transparent"
    :src="resolvedSource || fallbackSource"
    :alt="alt"
    :loading="loading"
    decoding="async"
    @load="clearFallbackTimer"
    @error="useFallback"
  />
</template>
