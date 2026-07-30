import request from '@/utils/request'
import type {
  ApiEnvelope,
  ApiParams,
  ApiPayload,
  BannerApiItem,
  BannerListParams,
  ClassificationApiItem,
  ClassificationParams,
  CourseListParams,
  CoursePageData,
  GameListRequest,
  GameListResponse,
  GameTypeRequest,
  GameTypeResponse,
} from './types'

const TV_API_BASE_URL = import.meta.env.VITE_TV_API_BASE_URL || 'https://tv.bingo.vip/sqx_fast'
const GAME_API_BASE_URL = import.meta.env.VITE_GAME_API_BASE_URL || '/game-api'
const GAME_CLIENT = {
  key: import.meta.env.VITE_GAME_API_KEY || 'XC9RdtCC',
  appid: import.meta.env.VITE_GAME_APP_ID || '2',
  versionCode: 1,
}

const getGameApiUrl = (path: string) => {
  if (/^https?:\/\//.test(GAME_API_BASE_URL)) {
    return `${GAME_API_BASE_URL.replace(/\/$/, '')}${path}`
  }

  if (typeof window === 'undefined') return `https://g.bingo.vip${path}`
  return `${window.location.origin}${GAME_API_BASE_URL.replace(/\/$/, '')}${path}`
}

export const siteApi = {
  getConfig() {
    return request.get<ApiPayload>('/site/config')
  },
  getPartners(params: ApiParams = {}) {
    return request.get<ApiPayload>('/partners', { params })
  },
}

export const homeApi = {
  getHome(params: ApiParams = {}) {
    return request.get<ApiPayload>('/home', { params })
  },
  getBanners(params: ApiParams = {}) {
    return request.get<ApiPayload>('/banners', { params })
  },
  selectBannerList(params: BannerListParams = { classify: 1, languageType: 'zh' }) {
    return request.get<ApiEnvelope<BannerApiItem[]>>(`${TV_API_BASE_URL}/banner/selectBannerList`, {
      params,
      skipAuth: true,
    })
  },
  selectCourse(params: CourseListParams = { page: 1, limit: 3, languageType: 'zh' }) {
    return request.get<ApiEnvelope<CoursePageData>>(`${TV_API_BASE_URL}/app/course/selectCourse`, {
      params,
      skipAuth: true,
    })
  },
  selectHotCourseRanking(
    params: CourseListParams = {
      limit: 6,
      page: 1,
      sort: 2,
      classifyId: '',
      languageType: 'zh',
    },
  ) {
    return request.get<ApiEnvelope<CoursePageData>>(`${TV_API_BASE_URL}/app/course/selectCourse`, {
      params,
      skipAuth: true,
    })
  },
  queryClassification(params: ClassificationParams = { languageType: 'zh' }) {
    return request.get<ApiEnvelope<ClassificationApiItem[]>>(
      `${TV_API_BASE_URL}/app/courseClassification/queryClassification`,
      { params, skipAuth: true },
    )
  },
  selectHotGames(data: Partial<GameListRequest> = {}) {
    const body = {
      type: 'ios',
      edition: '',
      order: '1',
      gametype: '全部游戏',
      pagecode: 1,
      ...GAME_CLIENT,
      ...data,
    } as GameListRequest

    return request.post<GameListResponse, GameListRequest>(
      getGameApiUrl('/box/Gameindex/alltypegame'),
      body,
      { skipAuth: true },
    )
  },
  getGamePromotion(params: ApiParams = {}) {
    return request.get<ApiPayload>('/promotions/game-entry', { params })
  },
  getOperationWidgets(params: ApiParams = {}) {
    return request.get<ApiPayload>('/operation-widgets', { params })
  },
}

export const dramaApi = {
  getCategories(params: ApiParams = {}) {
    return request.get<ApiPayload>('/drama/categories', { params })
  },
  getList(params: ApiParams = {}) {
    return request.get<ApiPayload>('/dramas', { params })
  },
  getDetail(dramaId: string | number) {
    return request.get<ApiPayload>(`/dramas/${dramaId}`)
  },
  reportPlayEvent(dramaId: string | number, data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>(`/dramas/${dramaId}/play-events`, data)
  },
}

export const gameApi = {
  getGameTypes(data: Partial<GameTypeRequest> = {}) {
    const body = {
      type: 'android',
      ...GAME_CLIENT,
      ...data,
    } as GameTypeRequest

    return request.post<GameTypeResponse, GameTypeRequest>(
      getGameApiUrl('/box/game/gamestypes'),
      body,
      { skipAuth: true },
    )
  },
  getCategories(params: ApiParams = {}) {
    return request.get<ApiPayload>('/game/categories', { params })
  },
  getList(params: ApiParams = {}) {
    return request.get<ApiPayload>('/games', { params })
  },
  getDetail(gameId: string | number) {
    return request.get<ApiPayload>(`/games/${gameId}`)
  },
  enterGame(gameId: string | number, data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>(`/games/${gameId}/enter-events`, data)
  },
}

export const rankingApi = {
  getRankings(params: ApiParams = {}) {
    return request.get<ApiPayload>('/rankings', { params })
  },
}

export const categoryApi = {
  getFeaturedCategories(params: ApiParams = {}) {
    return request.get<ApiPayload>('/featured-categories', { params })
  },
}

export const searchApi = {
  search(params: ApiParams = {}) {
    return request.get<ApiPayload>('/search', { params })
  },
  getHotKeywords(params: ApiParams = {}) {
    return request.get<ApiPayload>('/search/hot-keywords', { params })
  },
}

export const authApi = {
  register(data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>('/auth/register', data)
  },
  login(data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>('/auth/login', data)
  },
}

export const userApi = {
  getProfile() {
    return request.get<ApiPayload>('/users/me')
  },
  addFavorite(data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>('/users/me/favorites', data)
  },
  removeFavorite(favoriteId: string | number) {
    return request.delete<ApiPayload>(`/users/me/favorites/${favoriteId}`)
  },
  checkIn(data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>('/users/me/check-ins', data)
  },
}

export const vipApi = {
  getBenefits(params: ApiParams = {}) {
    return request.get<ApiPayload>('/vip/benefits', { params })
  },
  createOrder(data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>('/vip/orders', data)
  },
}

export const aboutApi = {
  getAbout() {
    return request.get<ApiPayload>('/about')
  },
  submitBusinessInquiry(data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>('/business-inquiries', data)
  },
}

export const eventApi = {
  report(data: ApiPayload = {}) {
    return request.post<ApiPayload, ApiPayload>('/events', data)
  },
}
