<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Clapperboard } from 'lucide-vue-next'
import DramaCard from '@/components/DramaCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { homeApi } from '@/api/modules'
import type { DramaItem } from '@/data/playflick'
import TransitionPage from '@/pages/TransitionPage.vue'

interface ClassificationApiItem {
  classificationId: number
  classificationName?: string
}

interface DramaCategoryOption {
  classificationId: number
  classificationName: string
  classifyId: number
}

interface CourseApiItem {
  courseId: number
  courseDetailsId?: number
  title?: string
  img?: string
  titleImg?: string
  classificationName?: string
  goodNum?: number
  viewCounts?: number
  status?: number
  isDelete?: number
}

type DramaListItem = DramaItem & {
  courseId: number
  courseDetailsId?: number
}

const emit = defineEmits<{
  'page-ready': []
}>()

const pageSize = 20
const CATEGORY_TRANSITION_DURATION = 700
const activeClassifyId = ref<string | number>('')
const dramaCategories = ref<DramaCategoryOption[]>([])
const dramaCategoryLoading = ref(false)
const dramaCategoryError = ref('')
const dramaList = ref<DramaListItem[]>([])
const dramaLoading = ref(false)
const dramaError = ref('')
const isCategoryTransitioning = ref(false)
const currentPage = ref(1)
const totalCount = ref(0)
let dramaListRequestId = 0
let categoryTransitionId = 0

const dramaClassifyIdMap = new Map([
  ['\u559c\u5267', 1],
  ['\u8a00\u60c5', 23],
  ['\u60ac\u7591', 24],
  ['\u90fd\u5e02', 25],
  ['\u5176\u4ed6', 36],
])

const formatCount = (value: number) => {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`
  return `${value}`
}

const hasMoreDramas = () => totalCount.value === 0 || dramaList.value.length < totalCount.value

const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration)
  })

const fetchDramaCategories = async () => {
  dramaCategoryLoading.value = true
  dramaCategoryError.value = ''

  try {
    const res = await homeApi.queryClassification({ languageType: 'zh' })
    const list: ClassificationApiItem[] = Array.isArray(res?.data) ? res.data : []
    dramaCategories.value = list
      .filter((item) => item.classificationName && dramaClassifyIdMap.has(item.classificationName))
      .map((item) => ({
        classificationId: item.classificationId,
        classificationName: item.classificationName!,
        classifyId: dramaClassifyIdMap.get(item.classificationName!)!,
      }))
  } catch (error) {
    dramaCategoryError.value = error instanceof Error ? error.message : '分类加载失败'
  } finally {
    dramaCategoryLoading.value = false
  }
}

const fetchDramaList = async (reset = false) => {
  if (!reset && dramaLoading.value) return
  if (!reset && !hasMoreDramas()) return

  if (reset) {
    currentPage.value = 1
    totalCount.value = 0
    dramaList.value = []
  }

  const requestId = ++dramaListRequestId
  dramaLoading.value = true
  dramaError.value = ''

  try {
    const res = await homeApi.selectHotCourseRanking({
      limit: pageSize,
      page: currentPage.value,
      sort: 2,
      classifyId: activeClassifyId.value,
      languageType: 'zh',
    })
    const data = res?.data
    const list: CourseApiItem[] = Array.isArray(data?.list) ? data.list : []
    const enabledList = list.filter(
      (item) => item?.status !== 0 && item?.isDelete !== 1 && (item.img || item.titleImg),
    )
    const nextList = enabledList.map((item) => ({
      courseId: item.courseId,
      courseDetailsId: item.courseDetailsId,
      title: item.title || '精选短剧',
      type: item.classificationName || '短剧',
      views: formatCount(item.goodNum ?? item.viewCounts ?? 0),
      image: item.img || item.titleImg || '',
    }))

    if (requestId !== dramaListRequestId) return

    totalCount.value = Number(data?.totalCount) || nextList.length
    dramaList.value = reset ? nextList : [...dramaList.value, ...nextList]
    currentPage.value = (Number(data?.currPage) || currentPage.value) + 1
  } catch (error) {
    if (requestId !== dramaListRequestId) return
    dramaError.value = error instanceof Error ? error.message : '短剧加载失败'
  } finally {
    if (requestId === dramaListRequestId) {
      dramaLoading.value = false
    }
  }
}

const selectDramaCategory = async (classifyId: string | number) => {
  if (activeClassifyId.value === classifyId && !isCategoryTransitioning.value) return

  const transitionId = ++categoryTransitionId
  activeClassifyId.value = classifyId
  isCategoryTransitioning.value = true

  await Promise.all([wait(CATEGORY_TRANSITION_DURATION), fetchDramaList(true)])

  if (transitionId === categoryTransitionId) {
    isCategoryTransitioning.value = false
  }
}

const handleScroll = () => {
  const scrollElement = document.documentElement
  const distanceToBottom = scrollElement.scrollHeight - window.scrollY - window.innerHeight

  if (distanceToBottom <= 160) {
    fetchDramaList()
  }
}

const openDramaDetail = (item: DramaListItem) => {
  if (item.courseId == null || item.courseDetailsId == null) return
  window.location.href = `https://tv.bingo.vip/#/me/detail/detail?id=${item.courseId}&courseDetailsId=${item.courseDetailsId}`
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  await Promise.all([fetchDramaCategories(), fetchDramaList(true)])
  emit('page-ready')
})

onBeforeUnmount(() => {
  categoryTransitionId += 1
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 max-w-3xl">
      <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3366]/16">
        <Clapperboard class="h-8 w-8 text-[#ff6f98]" />
      </div>
      <h1 class="text-4xl font-black leading-tight sm:text-6xl text-brand-text">短剧专区</h1>
      <p class="mt-4 text-base leading-8 text-brand-text-secondary sm:text-lg">
        从都市逆袭到甜宠古装，PlayFlick 用高密度剧情满足你的碎片化追剧时刻。
      </p>
    </div>

    <div class="scrollbar-none mb-8 flex gap-3 overflow-x-auto">
      <button
        class="whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition cursor-pointer"
        :class="
          activeClassifyId === ''
            ? 'border-[#ff3366] bg-[#ff3366] text-white shadow-[0_0_22px_rgba(255,51,102,0.36)]'
            : 'border-brand-border bg-brand-card text-brand-text-secondary hover:text-brand-text'
        "
        :disabled="isCategoryTransitioning || dramaLoading"
        @click="selectDramaCategory('')"
      >
        全部
      </button>
      <button
        v-for="category in dramaCategories"
        :key="category.classificationId"
        class="whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition cursor-pointer"
        :class="
          activeClassifyId === category.classifyId
            ? 'border-[#ff3366] bg-[#ff3366] text-white shadow-[0_0_22px_rgba(255,51,102,0.36)]'
            : 'border-brand-border bg-brand-card text-brand-text-secondary hover:text-brand-text'
        "
        :disabled="isCategoryTransitioning || dramaLoading"
        @click="selectDramaCategory(category.classifyId)"
      >
        {{ category.classificationName }}
      </button>
      <span v-if="dramaCategoryLoading" class="self-center text-sm font-semibold text-brand-text-secondary animate-pulse">
        分类加载中...
      </span>
      <span v-else-if="dramaCategoryError" class="self-center text-sm font-semibold text-[#ff8bad]">
        {{ dramaCategoryError }}
      </span>
    </div>

    <p v-if="dramaError" class="mb-5 text-sm font-semibold text-[#ff8bad]">
      {{ dramaError }}
    </p>

    <div class="min-h-[620px]">
      <TransitionPage v-slot:loading v-if="isCategoryTransitioning" compact />
      <template v-else>
        <div v-if="dramaList.length > 0" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <DramaCard
            v-for="item in dramaList"
            :key="`${item.courseId}-${item.courseDetailsId ?? item.title}`"
            :item="item"
            class="cursor-pointer"
            compact
            @click="openDramaDetail(item)"
          />
        </div>

        <EmptyState
          v-else-if="!dramaLoading"
          description="当前短剧分类暂时没有可展示内容"
          tone="pink"
        />

        <div class="py-8 text-center text-sm font-semibold text-brand-text-secondary">
          <span v-if="dramaLoading" class="animate-pulse">正在加载数据...</span>
          <span v-else-if="dramaList.length > 0 && totalCount > 0 && dramaList.length >= totalCount"
            >没有更多数据了</span
          >
        </div>
      </template>
    </div>
  </section>
</template>
