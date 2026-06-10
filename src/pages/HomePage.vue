<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronRight, Crown, Flame, Gamepad2, Play, Trophy } from 'lucide-vue-next'
import DramaCard from '@/components/DramaCard.vue'
import GameCard from '@/components/GameCard.vue'
import RankingCard from '@/components/RankingCard.vue'
import { homeApi } from '@/api/modules'
import {
  featuredDramas,
  operationCards,
  rankings,
} from '@/data/playflick'

const emit = defineEmits<{
  'navigate-dramas': []
  'navigate-games': []
}>()

interface BannerApiItem {
  id: number
  name?: string
  imageUrl?: string
  state?: number
  url?: string
  describes?: string | null
  languageName?: string
}

interface CourseApiItem {
  courseId: number
  courseDetailsId?: number
  title?: string
  img?: string
  titleImg?: string
  classificationName?: string
  details?: string
  goodNum?: number
  viewCounts?: number
  status?: number
  isDelete?: number
}

interface ClassificationApiItem {
  classificationId: number
  classificationName?: string
}

interface HotGameApiItem {
  id: number
  pic1?: string
  pic4?: string
  downloadnum?: string
  gamename?: string
  game_tag?: string
  typeword?: string
  gametype?: string
  gametype1?: string
  gametypes?: string[]
}

interface VisualCategoryItem {
  id?: number
  name: string
  image: string
}

type FeaturedDramaItem = (typeof featuredDramas)[number] & {
  courseId?: number
  courseDetailsId?: number
}

type HotRankingItem = (typeof rankings)[number] & {
  courseId?: number
  courseDetailsId?: number
}

interface HotGameItem {
  id?: number
  title: string
  category: string
  players: string
  image: string
}

interface BannerSlide {
  id?: number
  title: string
  desc: string
  tag: string
  views: string
  image: string
  url?: string
}

const activeHeroIndex = ref(0)
const bannerLoading = ref(false)
const bannerError = ref('')
const bannerSlides = ref<BannerSlide[]>([])
const featuredDramaLoading = ref(false)
const featuredDramaError = ref('')
const featuredDramaList = ref<FeaturedDramaItem[]>([...featuredDramas])
const visualCategoryLoading = ref(false)
const visualCategoryError = ref('')
const visualCategoryList = ref<VisualCategoryItem[]>([])
const hotRankingLoading = ref(false)
const hotRankingError = ref('')
const hotRankingList = ref<HotRankingItem[]>([...rankings])
const hotGameLoading = ref(false)
const hotGameError = ref('')
const hotGameList = ref<HotGameItem[]>([])
let heroTimer: number | undefined

const activeHero = computed(() => bannerSlides.value[activeHeroIndex.value] ?? bannerSlides.value[0])

const homeOperationCards = operationCards.map((item, index) => {
  const content = [
    {
      title: '短剧签到积分',
      desc: '每日签到领取追剧积分，解锁更多短剧福利。',
    },
    {
      title: '新剧速递',
      desc: '进入短剧专区，发现最新上线和热门推荐。',
    },
    {
      title: '游戏签到福利',
      desc: '前往游戏福利中心，每日签到领取奖励。',
    },
  ][index]

  return {
    ...item,
    ...content,
  }
})

const visualCategoryImageRules = [
  {
    keywords: ['都市', '职场', '总裁', '豪门'],
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=82',
  },
  {
    keywords: ['甜宠', '恋爱', '爱情'],
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=82',
  },
  {
    keywords: ['逆袭', '重生', '复仇'],
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&q=82',
  },
  {
    keywords: ['古装', '宫廷', '穿越'],
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=82',
  },
  {
    keywords: ['悬疑', '推理', '刑侦'],
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=82',
  },
  {
    keywords: ['萌宝', '家庭', '亲情'],
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=82',
  },
  {
    keywords: ['战神', '动作', '热血'],
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=82',
  },
  {
    keywords: ['神医', '医妃', '医'],
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=82',
  },
]

const fallbackVisualCategoryImages = [
  'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=600&q=82',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=82',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=82',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=82',
]

const getVisualCategoryImage = (name: string, index: number) => {
  const matchedRule = visualCategoryImageRules.find((rule) =>
    rule.keywords.some((keyword) => name.includes(keyword)),
  )
  return matchedRule?.image ?? fallbackVisualCategoryImages[index % fallbackVisualCategoryImages.length]!
}

const fetchBannerList = async () => {
  bannerLoading.value = true
  bannerError.value = ''

  try {
    const res = await homeApi.selectBannerList({ classify: 1, languageType: 'zh' })
    const list: BannerApiItem[] = Array.isArray(res?.data) ? res.data : []
    const enabledList = list.filter((item) => item?.state !== 0 && item?.imageUrl)

    bannerSlides.value = enabledList.map((item) => ({
      id: item.id,
      title: item.name || '精选短剧',
      desc: item.describes || '精彩短剧正在热播，立即开启沉浸式追剧体验。',
      tag: item.languageName || '简体中文',
      views: '精选推荐',
      image: item.imageUrl || '',
      url: item.url,
    }))
    activeHeroIndex.value = 0
  } catch (error) {
    bannerError.value = error instanceof Error ? error.message : '轮播图加载失败'
  } finally {
    bannerLoading.value = false
  }
}

const fetchFeaturedDramas = async () => {
  featuredDramaLoading.value = true
  featuredDramaError.value = ''

  try {
    const res = await homeApi.selectCourse({ page: 1, limit: 4, languageType: 'zh' })
    const list: CourseApiItem[] = Array.isArray(res?.data?.list) ? res.data.list : []
    const enabledList = list.filter(
      (item) => item?.status !== 0 && item?.isDelete !== 1 && (item.img || item.titleImg),
    )

    if (enabledList.length > 0) {
      featuredDramaList.value = enabledList.map((item) => ({
        courseId: item.courseId,
        courseDetailsId: item.courseDetailsId,
        title: item.title || '精选短剧',
        type: item.classificationName || '短剧',
        views: formatCount(item.goodNum ?? item.viewCounts ?? 0),
        image: item.img || item.titleImg || '',
      }))
    }
  } catch (error) {
    featuredDramaError.value = error instanceof Error ? error.message : '短剧推荐加载失败'
  } finally {
    featuredDramaLoading.value = false
  }
}

const formatCount = (value: number) => {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`
  return `${value}`
}

const fetchVisualCategories = async () => {
  visualCategoryLoading.value = true
  visualCategoryError.value = ''

  try {
    const res = await homeApi.queryClassification({ languageType: 'zh' })
    const list: ClassificationApiItem[] = Array.isArray(res?.data) ? res.data : []

    visualCategoryList.value = list.map((item, index) => ({
      id: item.classificationId,
      name: item.classificationName || '其他',
      image: getVisualCategoryImage(item.classificationName || '其他', index),
    }))
  } catch (error) {
    visualCategoryError.value = error instanceof Error ? error.message : '精选分类加载失败'
  } finally {
    visualCategoryLoading.value = false
  }
}

const fetchHotRankings = async () => {
  hotRankingLoading.value = true
  hotRankingError.value = ''

  try {
    const res = await homeApi.selectHotCourseRanking({
      limit: 6,
      page: 1,
      sort: 2,
      classifyId: '',
      languageType: 'zh',
    })
    const list: CourseApiItem[] = Array.isArray(res?.data?.list) ? res.data.list : []
    const enabledList = list.filter((item) => item?.status !== 0 && item?.isDelete !== 1)

    if (enabledList.length > 0) {
      hotRankingList.value = enabledList.slice(0, 6).map((item) => ({
        courseId: item.courseId,
        courseDetailsId: item.courseDetailsId,
        title: item.title || '热门短剧',
        type: item.classificationName || '短剧',
        heat: formatCount(item.goodNum ?? item.viewCounts ?? 0),
      }))
    }
  } catch (error) {
    hotRankingError.value = error instanceof Error ? error.message : '今日热播榜加载失败'
  } finally {
    hotRankingLoading.value = false
  }
}

const fetchHotGames = async () => {
  hotGameLoading.value = true
  hotGameError.value = ''

  try {
    const res = await homeApi.selectHotGames({
      type: 'ios',
      edition: '',
      order: '1',
      gametype: '全部游戏',
      pagecode: 2,
      key: 'XC9RdtCC',
      appid: '2',
      versionCode: 1,
    })
    const list: HotGameApiItem[] = Array.isArray(res?.lists) ? res.lists : []

    hotGameList.value = list.slice(0, 4).map((item) => ({
      id: item.id,
      title: item.gamename || '热门小游戏',
      category: item.typeword || item.gametype || item.gametypes?.join(' / ') || '小游戏',
      players: formatCount(Number(item.downloadnum) || 0),
      image: item.pic4 || item.pic1 || '',
    }))
  } catch (error) {
    hotGameError.value = error instanceof Error ? error.message : '热门小游戏加载失败'
  } finally {
    hotGameLoading.value = false
  }
}

const openVipPage = () => {
  window.location.href = 'https://tv.bingo.vip/#/pages/login/loginPhone?index=2'
}

const openTvHome = () => {
  window.location.href = 'https://tv.bingo.vip/#/'
}

const openDramaDetail = (item: FeaturedDramaItem) => {
  if (item.courseId == null || item.courseDetailsId == null) return
  window.location.href = `https://tv.bingo.vip/#/me/detail/detail?id=${item.courseId}&courseDetailsId=${item.courseDetailsId}`
}

const openGameDetail = (item: HotGameItem) => {
  if (item.id == null) return
  window.location.href = `https://g.bingo.vip/#/gamedetails/content?gid=${item.id}&edition=0&key=XC9RdtCC`
}

const openRankingDetail = (item: HotRankingItem) => {
  if (item.courseId == null || item.courseDetailsId == null) return
  window.location.href = `https://tv.bingo.vip/#/me/detail/detail?id=${item.courseId}&courseDetailsId=${item.courseDetailsId}`
}

const openDramaCheckIn = () => {
  window.location.href = 'https://tv.bingo.vip/#/pages/chasingDrama/chasingDrama'
}

const openGameWelfare = () => {
  window.location.href = 'https://g.bingo.vip/#/welfare?key=XC9RdtCC'
}

const handleOperationCardClick = (index: number) => {
  if (index === 0) {
    openDramaCheckIn()
    return
  }

  if (index === 1) {
    emit('navigate-dramas')
    return
  }

  if (index === 2) {
    openGameWelfare()
  }
}

onMounted(() => {
  fetchBannerList()
  fetchFeaturedDramas()
  fetchVisualCategories()
  fetchHotRankings()
  fetchHotGames()
  heroTimer = window.setInterval(() => {
    if (bannerSlides.value.length === 0) return
    activeHeroIndex.value = (activeHeroIndex.value + 1) % bannerSlides.value.length
  }, 4200)
})

onBeforeUnmount(() => {
  if (heroTimer) window.clearInterval(heroTimer)
})
</script>

<template>
  <section class="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1.55fr_0.85fr] lg:px-8 lg:py-10">
    <article
      class="group relative min-h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30">
      <img v-if="activeHero" :src="activeHero.image" :alt="activeHero.title"
        class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div
        class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,32,0.94)_0%,rgba(8,10,32,0.6)_48%,rgba(8,10,32,0.2)_100%)]">
      </div>
      <div v-if="activeHero" class="relative flex h-full min-h-[430px] max-w-2xl flex-col justify-end p-6 sm:p-10">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <span
            class="rounded-full bg-[#ff3366] px-3 py-1 text-xs font-black text-white shadow-[0_0_20px_rgba(255,51,102,0.5)]">
            {{ activeHero.tag }}
          </span>
          <span v-if="bannerLoading" class="text-xs font-semibold text-white/52">加载轮播中...</span>
          <span v-else-if="bannerError" class="text-xs font-semibold text-[#ff8bad]">{{
            bannerError
          }}</span>
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
            @click="openTvHome"
          >
            <Play class="h-4 w-4 fill-white" />
            立即观看
          </button>
          <!-- <button
            class="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white/82 backdrop-blur-md transition hover:border-white/30 hover:text-white"
          >
            加入片单
          </button> -->
        </div>
        <div class="mt-8 flex gap-2">
          <button v-for="(_, index) in bannerSlides" :key="index" class="h-2.5 rounded-full transition-all duration-300"
            :class="activeHeroIndex === index
              ? 'w-9 bg-[#ff3366] shadow-[0_0_14px_#ff3366]'
              : 'w-2.5 bg-white/35'
              " :aria-label="`切换到第 ${index + 1} 张 Banner`" @click="activeHeroIndex = index"></button>
        </div>
      </div>
      <div v-else class="relative flex h-full min-h-[430px] max-w-2xl flex-col justify-end p-6 sm:p-10">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <span class="text-xs font-semibold text-white/52">
            {{ bannerLoading ? '轮播图加载中...' : bannerError || '暂无轮播图' }}
          </span>
        </div>
        <h1 class="max-w-xl text-4xl font-black leading-tight tracking-normal sm:text-6xl">
          PlayFlick
        </h1>
      </div>
    </article>

    <article
      class="relative min-h-[360px] overflow-hidden rounded-[28px] border border-[#00bfa5]/30 bg-[#071f2e]/70 p-6 shadow-[0_0_45px_rgba(0,191,165,0.16)] backdrop-blur-md sm:p-8 lg:min-h-full">
      <img src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=86" alt="小游戏宣传"
        class="absolute inset-0 h-full w-full object-cover opacity-54" />
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,31,0.22),rgba(5,12,31,0.9))]"></div>
      <div class="relative flex h-full min-h-[320px] flex-col justify-between">
        <div class="flex justify-end">
          <span
            class="rounded-full border border-[#00bfa5]/40 bg-[#00bfa5]/15 px-3 py-1 text-xs font-black text-[#8fffee]">
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
            @click="emit('navigate-games')">
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
        <p v-if="featuredDramaLoading" class="mt-2 text-sm font-semibold text-white/45">
          短剧推荐加载中...
        </p>
        <p v-else-if="featuredDramaError" class="mt-2 text-sm font-semibold text-[#ff8bad]">
          {{ featuredDramaError }}
        </p>
        <h2 class="mt-2 text-2xl font-black sm:text-4xl">短剧推荐</h2>
      </div>
      <button class="hidden items-center gap-1 text-sm font-bold text-white/60 transition hover:text-white sm:flex"
        @click="emit('navigate-dramas')">
        查看全部
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <DramaCard
        v-for="item in featuredDramaList"
        :key="item.title"
        :item="item"
        class="cursor-pointer"
        @click="openDramaDetail(item)"
      />
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <p class="text-sm font-bold text-[#00e0c5]">GAME HOTSPOT</p>
        <h2 class="mt-2 text-2xl font-black sm:text-4xl">热门小游戏</h2>
        <p v-if="hotGameLoading" class="mt-2 text-sm font-semibold text-white/45">
          热门小游戏加载中...
        </p>
        <p v-else-if="hotGameError" class="mt-2 text-sm font-semibold text-[#ff8bad]">
          {{ hotGameError }}
        </p>
      </div>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <GameCard
        v-for="item in hotGameList"
        :key="item.title"
        :item="item"
        class="cursor-pointer"
        @click="openGameDetail(item)"
      />
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div
      class="relative overflow-hidden rounded-[28px] border border-[#ffcf70]/25 bg-[linear-gradient(110deg,#2b1b40_0%,#6f244d_44%,#b8872b_100%)] p-6 shadow-[0_0_60px_rgba(255,51,102,0.18)] sm:p-9">
      <div class="absolute right-8 top-[-40px] h-32 w-32 rounded-full border border-[#ffd37a]/30"></div>
      <div class="absolute bottom-[-55px] right-28 h-40 w-40 rounded-full bg-[#ff3366]/24 blur-3xl"></div>
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
          @click="openVipPage">
          立即开通 VIP
        </button>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="mb-7 flex flex-wrap items-center gap-3">
      <Trophy class="h-8 w-8 text-[#ffbf47]" />
      <h2 class="text-2xl font-black sm:text-4xl">今日热播榜</h2>
      <span v-if="hotRankingLoading" class="text-sm font-semibold text-white/45">榜单加载中...</span>
      <span v-else-if="hotRankingError" class="text-sm font-semibold text-[#ff8bad]">{{
        hotRankingError
      }}</span>
    </div>
    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <RankingCard
        v-for="(item, index) in hotRankingList"
        :key="`${item.title}-${index}`"
        :item="item"
        :rank="index + 1"
        class="cursor-pointer"
        @click="openRankingDetail(item)"
      />
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="mb-7">
      <h2 class="text-2xl font-black sm:text-4xl">精选分类</h2>
      <p v-if="visualCategoryLoading" class="mt-2 text-sm font-semibold text-white/45">
        精选分类加载中...
      </p>
      <p v-else-if="visualCategoryError" class="mt-2 text-sm font-semibold text-[#ff8bad]">
        {{ visualCategoryError }}
      </p>
    </div>
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      <button v-for="item in visualCategoryList" :key="item.id ?? item.name"
        class="group relative aspect-[3/5] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        @click="openTvHome">
        <img :src="item.image" :alt="item.name"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#07091f] via-[#07091f]/10 to-transparent"></div>
        <span class="absolute inset-x-0 bottom-5 text-center text-xl font-black">{{
          item.name
        }}</span>
      </button>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
    <div class="grid gap-5 md:grid-cols-3">
      <article
        v-for="(item, index) in homeOperationCards"
        :key="item.title"
        class="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        @click="handleOperationCardClick(index)"
      >
        <div :class="item.color" class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br shadow-lg">
          <component :is="item.icon" class="h-7 w-7 text-white" />
        </div>
        <h3 class="text-xl font-black">{{ item.title }}</h3>
        <p class="mt-3 text-sm leading-7 text-white/62">{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>
