import { computed, ref } from 'vue'
import type { LocationQuery, RouteLocationRaw } from 'vue-router'
import type { DramaContentItem, GameContentItem } from '@/utils/content'

export type LibraryKind = 'drama' | 'game'

export interface LibraryEntry {
  key: string
  kind: LibraryKind
  title: string
  category: string
  metric: string
  image: string
  primaryId?: number
  secondaryId?: number
}

export interface LibraryRecord extends LibraryEntry {
  updatedAt: number
}

const FAVORITES_KEY = 'playflick_favorites'
const HISTORY_KEY = 'playflick_history'
const CATALOG_KEY = 'playflick_catalog'
const MAX_HISTORY = 40
const MAX_CATALOG = 120

const isLibraryEntry = (value: unknown): value is LibraryEntry => {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<LibraryEntry>
  return (
    typeof entry.key === 'string' &&
    (entry.kind === 'drama' || entry.kind === 'game') &&
    typeof entry.title === 'string' &&
    typeof entry.category === 'string' &&
    typeof entry.metric === 'string' &&
    typeof entry.image === 'string' &&
    (entry.primaryId == null || typeof entry.primaryId === 'number') &&
    (entry.secondaryId == null || typeof entry.secondaryId === 'number')
  )
}

const isLibraryRecord = (value: unknown): value is LibraryRecord =>
  isLibraryEntry(value) &&
  'updatedAt' in value &&
  typeof (value as Partial<LibraryRecord>).updatedAt === 'number'

const readRecords = <T>(key: string, isValid: (value: unknown) => value is T): T[] => {
  if (typeof window === 'undefined') return []

  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(parsed) ? parsed.filter(isValid) : []
  } catch {
    return []
  }
}

const favorites = ref<LibraryRecord[]>(readRecords(FAVORITES_KEY, isLibraryRecord))
const history = ref<LibraryRecord[]>(readRecords(HISTORY_KEY, isLibraryRecord))
const catalog = ref<LibraryEntry[]>(readRecords(CATALOG_KEY, isLibraryEntry))

const persist = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Library features remain usable for the current session when storage is blocked.
  }
}

const hashTitle = (value: string) => {
  let hash = 0
  for (const character of value.trim().toLocaleLowerCase('zh-CN')) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  }
  return hash.toString(36)
}

export const createDramaEntry = (item: DramaContentItem): LibraryEntry => ({
  key: item.courseId != null ? `course-${item.courseId}` : `title-${hashTitle(item.title)}`,
  kind: 'drama',
  title: item.title,
  category: item.type,
  metric: item.views,
  image: item.image,
  primaryId: item.courseId,
  secondaryId: item.courseDetailsId,
})

export const createGameEntry = (item: GameContentItem): LibraryEntry => ({
  key: item.id != null ? `game-${item.id}` : `title-${hashTitle(item.title)}`,
  kind: 'game',
  title: item.title,
  category: item.category,
  metric: item.players,
  image: item.image,
  primaryId: item.id,
})

const readQueryValue = (query: LocationQuery, key: string) => {
  const value = query[key]
  return typeof value === 'string' ? value : undefined
}

const readQueryNumber = (query: LocationQuery, key: string) => {
  const value = Number(readQueryValue(query, key))
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

export const createEntryFromRoute = (
  kind: LibraryKind,
  key: string,
  query: LocationQuery,
): LibraryEntry | undefined => {
  const title = readQueryValue(query, 'title')
  const category = readQueryValue(query, 'category')
  const metric = readQueryValue(query, 'metric')
  const image = readQueryValue(query, 'image')
  if (!title || !category || !metric || !image) return undefined

  return {
    key,
    kind,
    title,
    category,
    metric,
    image,
    primaryId: readQueryNumber(query, 'primaryId'),
    secondaryId: readQueryNumber(query, 'secondaryId'),
  }
}

export const getLibraryRoute = (entry: LibraryEntry): RouteLocationRaw => ({
  name: entry.kind === 'drama' ? 'drama-detail' : 'game-detail',
  params: { id: entry.key },
  query: {
    title: entry.title,
    category: entry.category,
    metric: entry.metric,
    image: entry.image,
    ...(entry.primaryId == null ? {} : { primaryId: String(entry.primaryId) }),
    ...(entry.secondaryId == null ? {} : { secondaryId: String(entry.secondaryId) }),
  },
})

const withUpdatedRecord = (records: LibraryRecord[], entry: LibraryEntry) => [
  { ...entry, updatedAt: Date.now() },
  ...records.filter((item) => !(item.kind === entry.kind && item.key === entry.key)),
]

export function useLibrary() {
  const remember = (entry: LibraryEntry) => {
    catalog.value = [
      entry,
      ...catalog.value.filter((item) => !(item.kind === entry.kind && item.key === entry.key)),
    ].slice(0, MAX_CATALOG)
    persist(CATALOG_KEY, catalog.value)
    return entry
  }

  const rememberMany = (entries: LibraryEntry[]) => {
    const nextCatalog = [...catalog.value]
    for (const entry of entries) {
      const existingIndex = nextCatalog.findIndex(
        (item) => item.kind === entry.kind && item.key === entry.key,
      )
      if (existingIndex >= 0) nextCatalog.splice(existingIndex, 1)
      nextCatalog.unshift(entry)
    }
    catalog.value = nextCatalog.slice(0, MAX_CATALOG)
    persist(CATALOG_KEY, catalog.value)
  }

  const recordView = (entry: LibraryEntry) => {
    remember(entry)
    history.value = withUpdatedRecord(history.value, entry).slice(0, MAX_HISTORY)
    persist(HISTORY_KEY, history.value)
  }

  const toggleFavorite = (entry: LibraryEntry) => {
    remember(entry)
    const exists = favorites.value.some(
      (item) => item.kind === entry.kind && item.key === entry.key,
    )

    favorites.value = exists
      ? favorites.value.filter((item) => !(item.kind === entry.kind && item.key === entry.key))
      : withUpdatedRecord(favorites.value, entry)
    persist(FAVORITES_KEY, favorites.value)
    return !exists
  }

  const removeFavorite = (entry: LibraryEntry) => {
    favorites.value = favorites.value.filter(
      (item) => !(item.kind === entry.kind && item.key === entry.key),
    )
    persist(FAVORITES_KEY, favorites.value)
  }

  const clearHistory = () => {
    history.value = []
    persist(HISTORY_KEY, history.value)
  }

  const findEntry = (kind: LibraryKind, key: string) =>
    catalog.value.find((item) => item.kind === kind && item.key === key) ??
    favorites.value.find((item) => item.kind === kind && item.key === key) ??
    history.value.find((item) => item.kind === kind && item.key === key)

  const isFavorite = (entry: LibraryEntry) =>
    favorites.value.some((item) => item.kind === entry.kind && item.key === entry.key)

  return {
    favorites: computed(() => favorites.value),
    history: computed(() => history.value),
    catalog: computed(() => catalog.value),
    remember,
    rememberMany,
    recordView,
    toggleFavorite,
    removeFavorite,
    clearHistory,
    findEntry,
    isFavorite,
  }
}
