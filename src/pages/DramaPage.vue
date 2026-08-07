<script setup lang="ts">
import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
} from 'vue'
import { Clapperboard } from 'lucide-vue-next'
import DramaCard from '@/components/DramaCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { homeApi } from '@/api/modules'
import type { ClassificationApiItem } from '@/api/types'
import { allDramas, type DramaItem } from '@/data/playflick'
import {
  getErrorMessage,
  mapCourseToDrama,
  matchesQuery,
  type CourseApiItem,
} from '@/utils/content'
import { externalLinks } from '@/utils/externalLinks'

interface DramaCategoryOption {
  classificationId: number
  classificationName: string
  classifyId: number
}

type DramaListItem = DramaItem & {
  courseId?: number
  courseDetailsId?: number
}

const props = withDefaults(
  defineProps<{
    searchQuery?: string
  }>(),
  {
    searchQuery: '',
  },
)

const pageSize = 20
const activeClassifyId = ref<string | number>('')
const dramaCategories = ref<DramaCategoryOption[]>([])
const dramaCategoryLoading = ref(false)
const dramaCategoryError = ref('')
const dramaList = ref<DramaListItem[]>([...allDramas])
const dramaLoading = ref(false)
const dramaError = ref('')
const isCategoryTransitioning = ref(false)
const currentPage = ref(1)
const totalCount = ref(allDramas.length)
const reachedEnd = ref(false)
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
let dramaListRequestId = 0
let categoryTransitionId = 0

const dramaClassifyIdMap = new Map([
  ['\u559c\u5267', 1],
  ['\u8a00\u60c5', 23],
  ['\u60ac\u7591', 24],
  ['\u90fd\u5e02', 25],
  ['\u5176\u4ed6', 36],
])

const fallbackDramaCategories = Array.from(dramaClassifyIdMap, ([name, id]) => ({
  classificationId: id,
  classificationName: name,
  classifyId: id,
}))

const visibleDramas = computed(() =>
  dramaList.value.filter((item) => matchesQuery(props.searchQuery, item.title, item.type)),
)

const hasMoreDramas = computed(
  () => !reachedEnd.value && (totalCount.value === 0 || dramaList.value.length < totalCount.value),
)

const observeLoadMoreTrigger = () => {
  if (!observer || !loadMoreTrigger.value) return
  observer.disconnect()
  observer.observe(loadMoreTrigger.value)
}

const fetchDramaCategories = async () => {
  dramaCategoryLoading.value = true
  dramaCategoryError.value = ''

  try {
    const res = await homeApi.queryClassification({ languageType: 'zh' })
    const list: ClassificationApiItem[] = Array.isArray(res?.data) ? res.data : []
    const categories = list
      .filter((item) => item.classificationName && dramaClassifyIdMap.has(item.classificationName))
      .map((item) => ({
        classificationId: item.classificationId,
        classificationName: item.classificationName!,
        classifyId: dramaClassifyIdMap.get(item.classificationName!)!,
      }))

    dramaCategories.value = categories.length > 0 ? categories : fallbackDramaCategories
  } catch (error) {
    dramaCategories.value = fallbackDramaCategories
    dramaCategoryError.value = getErrorMessage(error, '分类加载失败，已展示常用分类')
  } finally {
    dramaCategoryLoading.value = false
  }
}

const fetchDramaList = async (reset = false) => {
  if (!reset && dramaLoading.value) return
  if (!reset && !hasMoreDramas.value) return

  if (reset) {
    currentPage.value = 1
    totalCount.value = 0
    reachedEnd.value = false
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
    if (!data || !Array.isArray(data.list)) {
      throw new Error('短剧接口返回格式异常')
    }

    const list: CourseApiItem[] = data.list
    const enabledList = list.filter(
      (item) => item?.status !== 0 && item?.isDelete !== 1 && (item.img || item.titleImg),
    )
    const nextList = enabledList.map(mapCourseToDrama) as DramaListItem[]

    if (requestId !== dramaListRequestId) return

    totalCount.value = Number(data?.totalCount) || nextList.length
    const existingKeys = new Set(
      dramaList.value.map((item) => `${item.courseId}-${item.courseDetailsId}`),
    )
    const deduplicatedList = nextList.filter(
      (item) => !existingKeys.has(`${item.courseId}-${item.courseDetailsId}`),
    )
    dramaList.value = reset ? nextList : [...dramaList.value, ...deduplicatedList]

    const responsePage = Number(data?.currPage) || currentPage.value
    const totalPage = Number(data?.totalPage) || responsePage
    currentPage.value = responsePage + 1
    reachedEnd.value =
      list.length === 0 ||
      responsePage >= totalPage ||
      (totalCount.value > 0 && dramaList.value.length >= totalCount.value)
  } catch (error) {
    if (requestId !== dramaListRequestId) return
    dramaError.value = getErrorMessage(error, '短剧加载失败')

    if (reset) {
      const activeCategory = fallbackDramaCategories.find(
        (category) => category.classifyId === activeClassifyId.value,
      )?.classificationName
      const filteredFallback = activeCategory
        ? allDramas.filter((item) => item.type === activeCategory)
        : allDramas
      dramaList.value = filteredFallback.length > 0 ? filteredFallback : allDramas
      totalCount.value = dramaList.value.length
      reachedEnd.value = true
    }
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

  await fetchDramaList(true)

  if (transitionId === categoryTransitionId) {
    isCategoryTransitioning.value = false
    await nextTick()
    observeLoadMoreTrigger()
  }
}

const openDramaDetail = (item: DramaListItem) => {
  if (item.courseId == null || item.courseDetailsId == null) {
    window.location.href = externalLinks.tvHome
    return
  }
  window.location.href = externalLinks.dramaDetail(item.courseId, item.courseDetailsId)
}

onMounted(async () => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) fetchDramaList()
    },
    { rootMargin: '280px' },
  )

  await Promise.all([fetchDramaCategories(), fetchDramaList(true)])
  await nextTick()
  observeLoadMoreTrigger()
})

onActivated(() => {
  nextTick(observeLoadMoreTrigger)
})

onDeactivated(() => {
  observer?.disconnect()
})

onBeforeUnmount(() => {
  categoryTransitionId += 1
  observer?.disconnect()
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8 max-w-3xl">
      <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3366]/16">
        <Clapperboard class="h-8 w-8 text-[#ff6f98]" />
      </div>
      <h1
        class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-brand-text"
      >
        短剧专区
      </h1>
      <p class="mt-4 text-base leading-8 text-brand-text-secondary sm:text-lg">
        从都市逆袭到甜宠古装，PlayFlick 用高密度剧情满足你的碎片化追剧时刻。
      </p>
      <p
        v-if="searchQuery"
        class="mt-4 inline-flex rounded-lg border border-[#ff3366]/20 bg-[#ff3366]/8 px-3 py-2 text-sm font-semibold text-[#ff4d7e]"
      >
        正在搜索“{{ searchQuery }}”
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
      <span
        v-if="dramaCategoryLoading"
        class="self-center text-sm font-semibold text-brand-text-secondary animate-pulse"
      >
        分类加载中...
      </span>
      <span v-else-if="dramaCategoryError" class="self-center text-sm font-semibold text-[#ff8bad]">
        {{ dramaCategoryError }}
      </span>
    </div>

    <div
      v-if="dramaError"
      class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#ff3366]/20 bg-[#ff3366]/8 px-4 py-3 text-sm font-semibold text-[#ff4d7e]"
    >
      <span>{{ dramaError }}，当前展示备用内容。</span>
      <button
        type="button"
        class="rounded-md border border-[#ff3366]/30 bg-transparent px-3 py-1.5 font-bold text-[#ff4d7e] cursor-pointer"
        @click="fetchDramaList(true)"
      >
        重新加载
      </button>
    </div>

    <div class="min-h-[620px]" :aria-busy="dramaLoading || isCategoryTransitioning">
      <div
        v-if="visibleDramas.length > 0"
        class="grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5"
        :class="{ 'opacity-55': isCategoryTransitioning }"
      >
        <DramaCard
          v-for="item in visibleDramas"
          :key="`${item.courseId ?? 'fallback'}-${item.courseDetailsId ?? item.title}`"
          :item="item"
          compact
          @select="openDramaDetail(item)"
        />
      </div>

      <EmptyState
        v-else-if="!dramaLoading"
        :description="
          searchQuery ? `没有找到与“${searchQuery}”相关的短剧` : '当前短剧分类暂时没有可展示内容'
        "
        tone="pink"
      />

      <div
        ref="loadMoreTrigger"
        class="flex min-h-20 items-center justify-center text-sm font-semibold text-brand-text-secondary"
      >
        <span v-if="dramaLoading" class="animate-pulse">正在加载数据...</span>
        <span v-else-if="dramaList.length > 0 && !hasMoreDramas">没有更多数据了</span>
      </div>
    </div>
  </section>
</template>
