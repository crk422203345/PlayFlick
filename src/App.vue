<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  CalendarCheck,
  ChevronRight,
  Clapperboard,
  Crown,
  Film,
  Flame,
  Gamepad2,
  Gem,
  Gift,
  Heart,
  Joystick,
  LockKeyhole,
  Play,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  Users,
  Zap,
} from 'lucide-vue-next'

type NavItem = '首页' | '短剧专区' | '小游戏专区' | '关于我们'

const navItems: NavItem[] = ['首页', '短剧专区', '小游戏专区', '关于我们']
const activeNav = ref<NavItem>('首页')
const activeDramaCategory = ref('猜你喜欢')
const activeGameCategory = ref('全部游戏')
const activeHeroIndex = ref(0)
let heroTimer: number | undefined

const dramaCategories = ['猜你喜欢', '都市', '甜宠', '逆袭', '复仇', '古装', '悬疑', '豪门']
const gameCategories = ['全部游戏', '休闲益智', '动作冒险', '竞速体育', '消除合成', '策略经营']

const heroSlides = [
  {
    title: '闪婚后，傅总夜夜宠',
    desc: '亿万豪门甜宠短剧限免热播，3 分钟一集，高能反转不停。',
    tag: '全网独播',
    views: '4286.9万热度',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1300&q=86',
  },
  {
    title: '她从深渊归来',
    desc: '复仇女主强势回归，爽感节奏拉满，今晚追到停不下来。',
    tag: '热播冠军',
    views: '3160.2万热度',
    image:
      'https://images.unsplash.com/photo-1518735493882-7c789f7c8933?auto=format&fit=crop&w=1300&q=86',
  },
  {
    title: '皇叔请自重',
    desc: '古风权谋与命定爱恋交织，沉浸式开启掌心追剧体验。',
    tag: '会员抢先看',
    views: '2897.4万热度',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1300&q=86',
  },
]

const featuredDramas = [
  {
    title: '错嫁千金',
    type: '甜宠',
    views: '128.6万',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '重生之我在商界封神',
    type: '逆袭',
    views: '96.3万',
    image:
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '夫人她不装了',
    type: '都市',
    views: '203.8万',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '长安雪未央',
    type: '古装',
    views: '76.5万',
    image:
      'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=700&q=82',
  },
]

const allDramas = [
  ...featuredDramas,
  {
    title: '离婚后我成了顶流',
    type: '都市',
    views: '241.1万',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '被退婚后大小姐杀疯了',
    type: '复仇',
    views: '188.2万',
    image:
      'https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '替嫁医妃不好惹',
    type: '古装',
    views: '154.8万',
    image:
      'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '总裁的隐婚甜妻',
    type: '甜宠',
    views: '219.9万',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '夜色追凶',
    type: '悬疑',
    views: '87.4万',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '豪门协议到期了',
    type: '豪门',
    views: '176.7万',
    image:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '小职员逆袭记',
    type: '逆袭',
    views: '132.0万',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=82',
  },
  {
    title: '玫瑰陷阱',
    type: '复仇',
    views: '109.5万',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=82',
  },
]

const hotGames = [
  {
    title: '霓虹方块消消乐',
    category: '消除合成',
    players: '32.8万',
    image:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=82',
  },
  {
    title: '极速漂移派对',
    category: '竞速体育',
    players: '18.4万',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=82',
  },
  {
    title: '糖果岛大冒险',
    category: '休闲益智',
    players: '27.6万',
    image:
      'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=82',
  },
  {
    title: '星际塔防计划',
    category: '策略经营',
    players: '12.9万',
    image:
      'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&w=800&q=82',
  },
]

const allGames = [
  ...hotGames,
  {
    title: '像素勇者远征',
    category: '动作冒险',
    players: '22.1万',
    image:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=82',
  },
  {
    title: '开心农场物语',
    category: '策略经营',
    players: '15.7万',
    image:
      'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=82',
  },
  {
    title: '海岛连连看',
    category: '休闲益智',
    players: '44.2万',
    image:
      'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=82',
  },
  {
    title: '街头扣篮王',
    category: '竞速体育',
    players: '19.8万',
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=82',
  },
  {
    title: '机甲突围战',
    category: '动作冒险',
    players: '11.6万',
    image:
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=82',
  }
]

const rankings = [
  { title: '闪婚后，傅总夜夜宠', type: '甜宠', heat: '4286.9万' },
  { title: '她从深渊归来', type: '复仇', heat: '3160.2万' },
  { title: '重生之我在商界封神', type: '逆袭', heat: '2897.4万' },
  { title: '夜色追凶', type: '悬疑', heat: '2218.6万' },
  { title: '皇叔请自重', type: '古装', heat: '1980.3万' },
  { title: '总裁的隐婚甜妻', type: '豪门', heat: '1762.0万' },
]

const visualCategories = [
  {
    name: '都市',
    image:
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=82',
  },
  {
    name: '甜宠',
    image:
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=82',
  },
  {
    name: '逆袭',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=82',
  },
  {
    name: '复仇',
    image:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&q=82',
  },
  {
    name: '古装',
    image:
      'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=82',
  },
  {
    name: '悬疑',
    image:
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=82',
  },
  {
    name: '豪门',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=82',
  },
  {
    name: '萌宝',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=82',
  },
]

const operationCards = [
  {
    title: '每日签到',
    desc: '连续签到领会员天数与游戏金币',
    icon: CalendarCheck,
    color: 'from-[#ff3366] to-[#ff9a3d]',
  },
  {
    title: '新剧速递',
    desc: '订阅更新提醒，首集上线即时推送',
    icon: Rocket,
    color: 'from-[#7c4dff] to-[#00bfa5]',
  },
  {
    title: '游戏礼包',
    desc: '每日解锁限定皮肤、道具与抽奖券',
    icon: Gift,
    color: 'from-[#00bfa5] to-[#6ee7ff]',
  },
]

const partners = ['腾讯视频', '爱奇艺', '抖音', 'B站', '优酷', '快手']

const coreValues = [
  { title: '海量内容', desc: '短剧、小游戏与互动娱乐持续上新。', icon: Film },
  { title: '轻松娱乐', desc: '碎片时间即可沉浸，打开就能玩。', icon: Sparkles },
  { title: '安全可靠', desc: '内容审核、账号体系与支付链路全面守护。', icon: ShieldCheck },
  { title: '用户至上', desc: '以体验、反馈和陪伴感驱动产品迭代。', icon: Heart },
]

const filteredDramas = computed(() => {
  if (activeDramaCategory.value === '猜你喜欢') return allDramas
  return allDramas.filter((item) => item.type === activeDramaCategory.value)
})

const filteredGames = computed(() => {
  if (activeGameCategory.value === '全部游戏') return allGames
  return allGames.filter((item) => item.category === activeGameCategory.value)
})

const activeHero = computed(() => heroSlides[activeHeroIndex.value] ?? heroSlides[0]!)

const switchNav = (item: NavItem) => {
  activeNav.value = item
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
  <div class="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0b0d26_0%,#10133a_46%,#0e1138_100%)] text-white">
    <div class="pointer-events-none fixed inset-0 opacity-70">
      <div class="absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-[#ff3366]/18 blur-[120px]"></div>
      <div class="absolute bottom-[12%] right-[-8%] h-[360px] w-[360px] rounded-full bg-[#00bfa5]/14 blur-[110px]">
      </div>
      <div class="absolute left-[35%] top-[28%] h-64 w-64 rounded-full bg-[#6d5dfc]/10 blur-[100px]"></div>
    </div>

    <header class="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d26]/72 backdrop-blur-2xl">
      <div class="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button class="group flex shrink-0 items-center gap-3" @click="switchNav('首页')" aria-label="返回首页">
          <span
            class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#ff3366] to-[#7c4dff] shadow-[0_0_32px_rgba(255,51,102,0.38)]">
            <Play class="h-5 w-5 fill-white text-white" />
          </span>
          <span class="text-xl font-black tracking-normal sm:text-2xl">PlayFlick</span>
        </button>

        <nav class="hidden flex-1 justify-center lg:flex">
          <div class="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
            <button v-for="item in navItems" :key="item"
              class="relative rounded-full px-5 py-2.5 text-sm font-semibold text-white/68 transition-all duration-300"
              :class="activeNav === item
                ? 'bg-white/[0.08] text-white shadow-[0_0_26px_rgba(255,51,102,0.22)]'
                : 'hover:text-white'
                " @click="switchNav(item)">
              {{ item }}
              <span class="absolute inset-x-5 -bottom-1 h-0.5 rounded-full bg-[#ff3366] transition-all duration-300"
                :class="activeNav === item ? 'opacity-100 shadow-[0_0_16px_#ff3366]' : 'opacity-0'"></span>
            </button>
          </div>
        </nav>

        <div
          class="ml-auto hidden min-w-[220px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-white/55 shadow-inner shadow-white/5 backdrop-blur-xl md:flex">
          <Search class="h-4 w-4 text-[#ff6f98]" />
          <input class="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            placeholder="搜索短剧 / 小游戏" />
        </div>

        <button
          class="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:text-white sm:flex">
          <UserRound class="h-4 w-4" />
          登录
        </button>
        <button
          class="rounded-full bg-[#ff3366] px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_28px_rgba(255,51,102,0.42)] transition hover:-translate-y-0.5 hover:bg-[#ff4777] sm:px-5">
          注册
        </button>
      </div>

      <div class="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
        <button v-for="item in navItems" :key="item"
          class="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition" :class="activeNav === item
            ? 'border-[#ff3366] bg-[#ff3366]/18 text-white shadow-[0_0_18px_rgba(255,51,102,0.28)]'
            : 'border-white/10 bg-white/[0.04] text-white/60'
            " @click="switchNav(item)">
          {{ item }}
        </button>
      </div>
    </header>

    <main class="relative z-10">
      <template v-if="activeNav === '首页'">
        <section class="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[1.55fr_0.85fr] lg:px-8 lg:py-10">
          <article
            class="group relative min-h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30">
            <img :src="activeHero.image" :alt="activeHero.title"
              class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div
              class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,32,0.94)_0%,rgba(8,10,32,0.6)_48%,rgba(8,10,32,0.2)_100%)]">
            </div>
            <div class="relative flex h-full min-h-[430px] max-w-2xl flex-col justify-end p-6 sm:p-10">
              <div class="mb-4 flex flex-wrap items-center gap-3">
                <span
                  class="rounded-full bg-[#ff3366] px-3 py-1 text-xs font-black text-white shadow-[0_0_20px_rgba(255,51,102,0.5)]">
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
                  class="flex items-center gap-2 rounded-full bg-[#ff3366] px-6 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(255,51,102,0.38)] transition hover:-translate-y-1">
                  <Play class="h-4 w-4 fill-white" />
                  立即观看
                </button>
                <button
                  class="rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-bold text-white/82 backdrop-blur-md transition hover:border-white/30 hover:text-white">
                  加入片单
                </button>
              </div>
              <div class="mt-8 flex gap-2">
                <button v-for="(_, index) in heroSlides" :key="index"
                  class="h-2.5 rounded-full transition-all duration-300" :class="activeHeroIndex === index
                    ? 'w-9 bg-[#ff3366] shadow-[0_0_14px_#ff3366]'
                    : 'w-2.5 bg-white/35'
                    " :aria-label="`切换到第 ${index + 1} 张 Banner`" @click="activeHeroIndex = index"></button>
              </div>
            </div>
          </article>

          <article
            class="relative min-h-[360px] overflow-hidden rounded-[28px] border border-[#00bfa5]/30 bg-[#071f2e]/70 p-6 shadow-[0_0_45px_rgba(0,191,165,0.16)] backdrop-blur-md sm:p-8 lg:min-h-full">
            <img src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=900&q=86"
              alt="小游戏宣传" class="absolute inset-0 h-full w-full object-cover opacity-54" />
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
                <h2 class="text-3xl font-black leading-tight sm:text-4xl">
                  小游戏宇宙<br />一键开玩
                </h2>
                <p class="mt-4 max-w-sm text-sm leading-7 text-white/72">
                  消除、竞速、塔防、冒险随时切换，低门槛高爽感，追剧间隙也能赢奖励。
                </p>
                <button
                  class="mt-7 flex items-center gap-2 rounded-full bg-[#00bfa5] px-6 py-3 text-sm font-black text-[#031b20] shadow-[0_0_30px_rgba(0,191,165,0.42)] transition hover:-translate-y-1 hover:bg-[#12d8be]">
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
              class="hidden items-center gap-1 text-sm font-bold text-white/60 transition hover:text-white sm:flex">
              查看全部
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="item in featuredDramas" :key="item.title"
              class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3366]/15">
              <div class="relative aspect-[3/4] overflow-hidden">
                <img :src="item.image" :alt="item.title"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#07091f] via-transparent to-transparent"></div>
                <span class="absolute left-4 top-4 rounded-full bg-[#ff3366]/90 px-3 py-1 text-xs font-black">{{
                  item.type }}</span>
              </div>
              <div class="p-4">
                <h3 class="line-clamp-1 text-lg font-black">{{ item.title }}</h3>
                <p class="mt-2 flex items-center gap-1 text-sm text-white/58">
                  <Play class="h-3.5 w-3.5 fill-[#ff6f98] text-[#ff6f98]" />
                  {{ item.views }} 播放
                </p>
              </div>
            </article>
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
            <article v-for="item in hotGames" :key="item.title"
              class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00bfa5]/15">
              <div class="relative aspect-[4/3] overflow-hidden">
                <img :src="item.image" :alt="item.title"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#071f2e] via-transparent to-transparent"></div>
                <span
                  class="absolute left-4 top-4 rounded-full bg-[#00bfa5]/90 px-3 py-1 text-xs font-black text-[#041b20]">{{
                    item.category }}</span>
              </div>
              <div class="p-4">
                <h3 class="line-clamp-1 text-lg font-black">{{ item.title }}</h3>
                <p class="mt-2 text-sm text-white/58">{{ item.players }} 人在玩</p>
                <button
                  class="mt-4 w-full rounded-2xl bg-[#00bfa5] py-3 text-sm font-black text-[#031b20] transition hover:bg-[#13ddc1]">
                  进入游戏
                </button>
              </div>
            </article>
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
                class="rounded-full bg-white px-7 py-3 text-sm font-black text-[#5a1838] shadow-xl transition hover:-translate-y-1">
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
            <article v-for="(item, index) in rankings" :key="item.title"
              class="relative min-h-32 overflow-visible rounded-3xl border border-white/10 bg-white/[0.06] p-5 pl-20 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#ff3366]/40 hover:shadow-2xl">
              <span class="rank-number absolute left-2 top-2 text-8xl font-black leading-none">{{
                index + 1
              }}</span>
              <div class="relative">
                <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/60">{{
                  item.type
                }}</span>
                <h3 class="mt-4 text-lg font-black">{{ item.title }}</h3>
                <p class="mt-3 flex items-center gap-2 text-sm text-white/60">
                  <Flame class="h-4 w-4 text-[#ff3366]" />
                  {{ item.heat }} 热度
                </p>
              </div>
            </article>
          </div>
        </section>

        <section class="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <h2 class="mb-7 text-2xl font-black sm:text-4xl">精选分类</h2>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            <button v-for="item in visualCategories" :key="item.name"
              class="group relative aspect-[3/5] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
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
            <article v-for="item in operationCards" :key="item.title"
              class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div :class="item.color"
                class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br shadow-lg">
                <component :is="item.icon" class="h-7 w-7 text-white" />
              </div>
              <h3 class="text-xl font-black">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-white/62">{{ item.desc }}</p>
            </article>
          </div>
        </section>

        <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div class="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
            <p class="text-center text-sm font-bold text-white/48">合作伙伴</p>
            <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div v-for="partner in partners" :key="partner"
                class="grid h-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-black text-white/68">
                {{ partner }}
              </div>
            </div>
          </div>
        </section>
      </template>

      <template v-else-if="activeNav === '短剧专区'">
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
            <button v-for="category in dramaCategories" :key="category"
              class="whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition" :class="activeDramaCategory === category
                ? 'border-[#ff3366] bg-[#ff3366] text-white shadow-[0_0_22px_rgba(255,51,102,0.36)]'
                : 'border-white/10 bg-white/[0.05] text-white/60 hover:text-white'
                " @click="activeDramaCategory = category">
              {{ category }}
            </button>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <article v-for="item in filteredDramas" :key="item.title"
              class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff3366]/15">
              <div class="relative aspect-[3/4] overflow-hidden">
                <img :src="item.image" :alt="item.title"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <button
                  class="absolute inset-0 grid place-items-center bg-[#07091f]/0 opacity-0 transition group-hover:bg-[#07091f]/30 group-hover:opacity-100">
                  <span
                    class="grid h-14 w-14 place-items-center rounded-full bg-[#ff3366] shadow-[0_0_28px_rgba(255,51,102,0.45)]">
                    <Play class="h-6 w-6 fill-white text-white" />
                  </span>
                </button>
              </div>
              <div class="p-4">
                <h3 class="line-clamp-1 text-base font-black">{{ item.title }}</h3>
                <div class="mt-3 flex items-center justify-between gap-3">
                  <span class="flex items-center gap-1 text-xs text-white/56">
                    <Play class="h-3.5 w-3.5 fill-[#ff6f98] text-[#ff6f98]" />
                    {{ item.views }}
                  </span>
                  <span class="rounded-full bg-[#ff3366]/15 px-2.5 py-1 text-xs font-bold text-[#ff8bad]">
                    {{ item.type }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="activeNav === '小游戏专区'">
        <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div class="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div class="max-w-3xl">
              <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00bfa5]/16">
                <Joystick class="h-8 w-8 text-[#00e0c5]" />
              </div>
              <h1 class="text-4xl font-black leading-tight sm:text-6xl">小游戏专区</h1>
              <p class="mt-4 text-base leading-8 text-white/64 sm:text-lg">
                免下载、低等待、强反馈。把追剧后的三分钟，变成赢奖励的高光时刻。
              </p>
            </div>
            <div class="rounded-3xl border border-[#00bfa5]/25 bg-[#00bfa5]/10 p-5 text-sm text-[#9fffee]">
              <p class="font-black">今日在线 86.4 万</p>
              <p class="mt-2 text-[#9fffee]/70">礼包库存每 2 小时刷新</p>
            </div>
          </div>

          <div class="scrollbar-none mb-8 flex gap-3 overflow-x-auto">
            <button v-for="category in gameCategories" :key="category"
              class="whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-black transition" :class="activeGameCategory === category
                ? 'border-[#00bfa5] bg-[#00bfa5] text-[#031b20] shadow-[0_0_22px_rgba(0,191,165,0.36)]'
                : 'border-white/10 bg-white/[0.05] text-white/60 hover:text-white'
                " @click="activeGameCategory = category">
              {{ category }}
            </button>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <article v-for="item in filteredGames" :key="item.title"
              class="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#00bfa5]/15">
              <div class="relative aspect-[4/3] overflow-hidden">
                <img :src="item.image" :alt="item.title"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#061821] via-transparent to-transparent"></div>
                <span
                  class="absolute left-4 top-4 rounded-full bg-[#00bfa5]/90 px-3 py-1 text-xs font-black text-[#031b20]">
                  {{ item.category }}
                </span>
              </div>
              <div class="p-5">
                <h3 class="text-lg font-black">{{ item.title }}</h3>
                <p class="mt-2 flex items-center gap-2 text-sm text-white/58">
                  <Users class="h-4 w-4 text-[#00e0c5]" />
                  {{ item.players }} 玩家在线
                </p>
                <button
                  class="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00bfa5] py-3 text-sm font-black text-[#031b20] transition hover:-translate-y-0.5 hover:bg-[#13ddc1]">
                  <Zap class="h-4 w-4 fill-[#031b20]" />
                  立即畅玩
                </button>
              </div>
            </article>
          </div>
        </section>
      </template>

      <template v-else>
        <section
          class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff3366]/16">
              <Gem class="h-8 w-8 text-[#ff6f98]" />
            </div>
            <h1 class="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              让每一次打开，都有好剧与好玩相遇
            </h1>
            <p class="mt-6 max-w-2xl text-base leading-8 text-white/66 sm:text-lg">
              PlayFlick
              是面向新一代线上娱乐用户的综合平台，把中国微短剧的高能叙事与休闲小游戏的即时反馈融合在一起。我们相信娱乐应该轻巧、可靠、漂亮，并且随时能带来一点点惊喜。
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <button
                class="rounded-full bg-[#ff3366] px-6 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(255,51,102,0.38)]">
                了解品牌故事
              </button>
              <button
                class="rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-sm font-black text-white/72">
                商务合作
              </button>
            </div>
          </div>

          <div class="relative min-h-[430px]">
            <div class="brand-orbit absolute inset-8 rounded-full border border-white/10"></div>
            <div
              class="absolute left-2 top-2 rounded-[32px] border border-[#ff3366]/25 bg-[#ff3366]/12 p-5 shadow-[0_0_45px_rgba(255,51,102,0.18)] backdrop-blur-md">
              <Clapperboard class="h-10 w-10 text-[#ff6f98]" />
              <p class="mt-3 text-sm font-black">微短剧引擎</p>
            </div>
            <div
              class="absolute -right-2 top-28 rounded-[32px] border border-[#00bfa5]/25 bg-[#00bfa5]/12 p-5 shadow-[0_0_45px_rgba(0,191,165,0.18)] backdrop-blur-md">
              <Gamepad2 class="h-10 w-10 text-[#00e0c5]" />
              <p class="mt-3 text-sm font-black">游戏大厅</p>
            </div>
            <div
              class="absolute -bottom-2 left-1/2 w-[50%] -translate-x-1/2 rounded-[24px] border border-white/10 bg-white/[0.08] p-3 shadow-2xl shadow-black/35 backdrop-blur-xl">
              <div
                class="relative mx-auto aspect-square max-w-[160px] rounded-[20px] bg-[radial-gradient(circle_at_35%_25%,#ff6f98_0%,#7c4dff_38%,#00bfa5_100%)] p-3 shadow-[0_30px_100px_rgba(124,77,255,0.25)]">
                <div
                  class="grid h-full w-full place-items-center rounded-[16px] border border-white/20 bg-[#080b2c]/70">
                  <div class="text-center">
                    <div class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white text-[#ff3366]">
                      <Play class="h-5 w-5 fill-[#ff3366]" />
                    </div>
                    <p class="mt-3 text-lg font-black">PlayFlick</p>
                    <p class="mt-1 text-[10px] text-white/56">Drama + Game</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article v-for="item in coreValues" :key="item.title"
              class="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.08]">
                <component :is="item.icon" class="h-7 w-7 text-[#ff6f98]" />
              </div>
              <h3 class="text-xl font-black">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-white/62">{{ item.desc }}</p>
            </article>
          </div>
        </section>
      </template>
    </main>

    <footer class="relative z-10 border-t border-white/10 bg-[#080a21]/72">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/48 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 PlayFlick Entertainment. All Rights Reserved.</p>
        <div class="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#" class="transition hover:text-white">用户协议</a>
          <a href="#" class="transition hover:text-white">隐私政策</a>
          <a href="#" class="transition hover:text-white">内容规范</a>
          <a href="#" class="transition hover:text-white">法律声明</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.rank-number {
  color: rgba(255, 51, 102, 0.12);
  text-shadow:
    0 8px 22px rgba(255, 51, 102, 0.28),
    0 1px 0 rgba(255, 255, 255, 0.2);
  -webkit-text-stroke: 1px rgba(255, 111, 152, 0.45);
}

.brand-orbit {
  animation: orbitPulse 5s ease-in-out infinite;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
