type QueryValue = string | number

const normalizeBaseUrl = (value: string) => value.replace(/\/$/, '')

const TV_APP_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_TV_APP_URL || 'https://tv.bingo.vip')
const GAME_APP_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_GAME_APP_URL || 'https://g.bingo.vip',
)
const GAME_APP_KEY = import.meta.env.VITE_GAME_API_KEY || 'XC9RdtCC'

const buildHashUrl = (baseUrl: string, path = '/', params: Record<string, QueryValue> = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString()

  return `${baseUrl}/#${path}${query ? `?${query}` : ''}`
}

export const externalLinks = {
  tvHome: buildHashUrl(TV_APP_BASE_URL),
  tvVip: buildHashUrl(TV_APP_BASE_URL, '/pages/login/loginPhone', { index: 2 }),
  dramaCheckIn: buildHashUrl(TV_APP_BASE_URL, '/pages/chasingDrama/chasingDrama'),
  gameHome: buildHashUrl(GAME_APP_BASE_URL),
  gameWelfare: buildHashUrl(GAME_APP_BASE_URL, '/welfare', { key: GAME_APP_KEY }),
  dramaDetail(courseId: number, courseDetailsId: number) {
    return buildHashUrl(TV_APP_BASE_URL, '/me/detail/detail', { id: courseId, courseDetailsId })
  },
  gameDetail(gameId: number) {
    return buildHashUrl(GAME_APP_BASE_URL, '/gamedetails/content', {
      gid: gameId,
      edition: 0,
      key: GAME_APP_KEY,
    })
  },
}
