import { allDramas, allGames, heroSlides, type DramaItem, type GameItem } from '@/data/playflick'
import type { CourseApiItem, HotGameApiItem } from '@/api/types'

export type { CourseApiItem, HotGameApiItem } from '@/api/types'

export type DramaContentItem = DramaItem & {
  courseId?: number
  courseDetailsId?: number
}

export type GameContentItem = GameItem & {
  id?: number
}

const fallbackImages = {
  hero: heroSlides.map((item) => item.image),
  drama: [2, 4, 5, 7, 8, 9, 11].map((index) => allDramas[index]!.image),
  game: allGames.map((item) => item.image),
}

const hashText = (value: string) => {
  let hash = 0
  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }
  return hash
}

export const getFallbackImage = (seed: string, kind: keyof typeof fallbackImages = 'drama') => {
  const images = fallbackImages[kind]
  return images[hashText(seed) % images.length]!
}

export const formatCompactCount = (value: number | string | null | undefined) => {
  const count = Number(value) || 0
  if (count >= 100_000_000) return `${(count / 100_000_000).toFixed(1)}亿`
  if (count >= 10_000) return `${(count / 10_000).toFixed(1)}万`
  return new Intl.NumberFormat('zh-CN').format(count)
}

export const mapCourseToDrama = (item: CourseApiItem, fallbackIndex = 0): DramaContentItem => ({
  courseId: item.courseId,
  courseDetailsId: item.courseDetailsId,
  title: item.title || '精选短剧',
  type: item.classificationName || '短剧',
  views: formatCompactCount(item.goodNum ?? item.viewCounts),
  image: item.img || item.titleImg || allDramas[fallbackIndex % allDramas.length]!.image,
})

export const mapGameToContent = (item: HotGameApiItem, fallbackIndex = 0): GameContentItem => ({
  id: item.id,
  title: item.gamename || '热门小游戏',
  category: item.typeword || item.gametype || item.gametypes?.join(' / ') || '小游戏',
  players: formatCompactCount(item.downloadnum),
  image: item.pic4 || item.pic1 || allGames[fallbackIndex % allGames.length]!.image,
})

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  return fallback
}

export const matchesQuery = (query: string, ...values: Array<string | undefined>) => {
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN')
  if (!normalizedQuery) return true
  return values.some((value) => value?.toLocaleLowerCase('zh-CN').includes(normalizedQuery))
}
