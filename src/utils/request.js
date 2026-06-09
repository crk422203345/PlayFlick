import axios from 'axios'

const DEFAULT_TIMEOUT = 15000
const DEFAULT_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api/v1' : '/api/v1'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || DEFAULT_TIMEOUT,
  withCredentials: false,
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('playflick_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  (response) => {
    const payload = response.data

    if (payload && typeof payload === 'object' && 'code' in payload && payload.code !== 0) {
      return Promise.reject(normalizeBusinessError(payload))
    }

    return payload
  },
  (error) => Promise.reject(normalizeHttpError(error)),
)

function normalizeBusinessError(payload) {
  return {
    code: payload.code,
    message: payload.message || '请求失败',
    data: payload.data,
    raw: payload,
  }
}

function normalizeHttpError(error) {
  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message || '网络连接异常，请稍后重试',
      raw: error,
    }
  }

  const { status, data } = error.response
  const messageMap = {
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '当前账号无权限访问',
    404: '请求资源不存在',
    408: '请求超时，请稍后重试',
    429: '请求过于频繁，请稍后再试',
    500: '服务器异常，请稍后重试',
    502: '网关异常，请稍后重试',
    503: '服务暂不可用，请稍后重试',
    504: '网关超时，请稍后重试',
  }

  if (status === 401) {
    localStorage.removeItem('playflick_token')
  }

  return {
    code: status,
    message: data?.message || messageMap[status] || '请求失败',
    data,
    raw: error,
  }
}

export default service
