export type ApiParams = Record<string, unknown>
export type ApiPayload = Record<string, unknown>

export interface ApiEnvelope<T> {
  code: number
  msg: string
  data: T
}

export interface BannerApiItem {
  id: number
  name?: string
  imageUrl?: string
  state?: number
  classify?: number
  url?: string
  describes?: string | null
  languageType?: string
  languageName?: string
}

export interface CourseApiItem {
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

export interface CoursePageData {
  totalCount: number
  pageSize: number
  totalPage: number
  currPage: number
  list: CourseApiItem[]
}

export interface ClassificationApiItem {
  classificationId: number
  classificationName?: string
}

export interface HotGameApiItem {
  id: number
  pic1?: string
  pic4?: string
  downloadnum?: string
  gamename?: string
  game_tag?: string
  typeword?: string
  gametype?: string
  gametype1?: string
  gametype2?: string
  gametypes?: string[]
}

export interface GameListResponse {
  lists: HotGameApiItem[]
  now_page: number
  total_number: number
  total_page: number
}

export interface GameTypeApiItem {
  id: string | number
  name: string
}

export interface GameTypeResponse {
  a?: string
  b?: string
  c: GameTypeApiItem[]
}

export interface BannerListParams {
  classify?: number
  languageType?: string
}

export interface CourseListParams {
  page?: number
  limit?: number
  sort?: number
  classifyId?: string | number
  languageType?: string
}

export interface ClassificationParams {
  languageType?: string
}

export interface GameListRequest {
  type: string
  edition: string
  order: string
  gametype: string
  page?: number
  pagecode: number
  key: string
  appid: string
  versionCode: number
}

export interface GameTypeRequest {
  type: string
  key: string
  appid: string
  versionCode: number
}

export interface UnifiedSearchData {
  dramas: CourseApiItem[]
  games: HotGameApiItem[]
}
