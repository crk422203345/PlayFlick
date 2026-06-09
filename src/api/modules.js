import request from '@/utils/request'

export const siteApi = {
  getConfig() {
    return request.get('/site/config')
  },
  getPartners(params = {}) {
    return request.get('/partners', { params })
  },
}

export const homeApi = {
  getHome(params = {}) {
    return request.get('/home', { params })
  },
  getBanners(params = {}) {
    return request.get('/banners', { params })
  },
  getGamePromotion(params = {}) {
    return request.get('/promotions/game-entry', { params })
  },
  getOperationWidgets(params = {}) {
    return request.get('/operation-widgets', { params })
  },
}

export const dramaApi = {
  getCategories(params = {}) {
    return request.get('/drama/categories', { params })
  },
  getList(params = {}) {
    return request.get('/dramas', { params })
  },
  getDetail(dramaId) {
    return request.get(`/dramas/${dramaId}`)
  },
  reportPlayEvent(dramaId, data = {}) {
    return request.post(`/dramas/${dramaId}/play-events`, data)
  },
}

export const gameApi = {
  getCategories(params = {}) {
    return request.get('/game/categories', { params })
  },
  getList(params = {}) {
    return request.get('/games', { params })
  },
  getDetail(gameId) {
    return request.get(`/games/${gameId}`)
  },
  enterGame(gameId, data = {}) {
    return request.post(`/games/${gameId}/enter-events`, data)
  },
}

export const rankingApi = {
  getRankings(params = {}) {
    return request.get('/rankings', { params })
  },
}

export const categoryApi = {
  getFeaturedCategories(params = {}) {
    return request.get('/featured-categories', { params })
  },
}

export const searchApi = {
  search(params = {}) {
    return request.get('/search', { params })
  },
  getHotKeywords(params = {}) {
    return request.get('/search/hot-keywords', { params })
  },
}

export const authApi = {
  register(data = {}) {
    return request.post('/auth/register', data)
  },
  login(data = {}) {
    return request.post('/auth/login', data)
  },
}

export const userApi = {
  getProfile() {
    return request.get('/users/me')
  },
  addFavorite(data = {}) {
    return request.post('/users/me/favorites', data)
  },
  removeFavorite(favoriteId) {
    return request.delete(`/users/me/favorites/${favoriteId}`)
  },
  checkIn(data = {}) {
    return request.post('/users/me/check-ins', data)
  },
}

export const vipApi = {
  getBenefits(params = {}) {
    return request.get('/vip/benefits', { params })
  },
  createOrder(data = {}) {
    return request.post('/vip/orders', data)
  },
}

export const aboutApi = {
  getAbout() {
    return request.get('/about')
  },
  submitBusinessInquiry(data = {}) {
    return request.post('/business-inquiries', data)
  },
}

export const eventApi = {
  report(data = {}) {
    return request.post('/events', data)
  },
}
