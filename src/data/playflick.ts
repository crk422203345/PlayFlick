import type { Component } from 'vue'
import {
  CalendarCheck,
  Film,
  Gift,
  Heart,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tv,
} from 'lucide-vue-next'

export type NavItem = '首页' | '短剧专区' | '小游戏专区' | '关于我们'

export interface HeroSlide {
  title: string
  desc: string
  tag: string
  views: string
  image: string
}

export interface DramaItem {
  title: string
  type: string
  views: string
  image: string
}

export interface GameItem {
  title: string
  category: string
  players: string
  image: string
}

export interface RankingItem {
  title: string
  type: string
  heat: string
}

export interface VisualCategory {
  name: string
  image: string
}

export interface OperationCard {
  title: string
  desc: string
  icon: Component
  color: string
}

export interface Partner {
  name: string
  icon: Component
}

export interface CoreValue {
  title: string
  desc: string
  icon: Component
}

export const navItems: NavItem[] = ['首页', '短剧专区', '小游戏专区', '关于我们']

export const dramaCategories = ['猜你喜欢', '都市', '甜宠', '逆袭', '复仇', '古装', '悬疑', '豪门']

export const gameCategories = [
  '全部游戏',
  '休闲益智',
  '动作冒险',
  '竞速体育',
  '消除合成',
  '策略经营',
]

export const heroSlides: HeroSlide[] = [
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

export const featuredDramas: DramaItem[] = [
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

export const allDramas: DramaItem[] = [
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

export const hotGames: GameItem[] = [
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

export const allGames: GameItem[] = [
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
  },
  {
    title: '宝石合成师',
    category: '消除合成',
    players: '26.5万',
    image:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=82',
  },
]

export const rankings: RankingItem[] = [
  { title: '闪婚后，傅总夜夜宠', type: '甜宠', heat: '4286.9万' },
  { title: '她从深渊归来', type: '复仇', heat: '3160.2万' },
  { title: '重生之我在商界封神', type: '逆袭', heat: '2897.4万' },
  { title: '夜色追凶', type: '悬疑', heat: '2218.6万' },
  { title: '皇叔请自重', type: '古装', heat: '1980.3万' },
  { title: '总裁的隐婚甜妻', type: '豪门', heat: '1762.0万' },
]

export const visualCategories: VisualCategory[] = [
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

export const operationCards: OperationCard[] = [
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

export const partners: Partner[] = [
  { name: '腾讯视频', icon: Tv },
  { name: '爱奇艺', icon: Film },
  { name: '抖音', icon: Smartphone },
  { name: 'B站', icon: Tv },
  { name: '优酷', icon: Film },
  { name: '快手', icon: Smartphone },
]

export const coreValues: CoreValue[] = [
  { title: '海量内容', desc: '短剧、小游戏与互动娱乐持续上新。', icon: Film },
  { title: '轻松娱乐', desc: '碎片时间即可沉浸，打开就能玩。', icon: Sparkles },
  { title: '安全可靠', desc: '内容审核、账号体系与支付链路全面守护。', icon: ShieldCheck },
  { title: '用户至上', desc: '以体验、反馈和陪伴感驱动产品迭代。', icon: Heart },
]
