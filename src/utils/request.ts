import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig<D = any> {
    skipAuth?: boolean
  }

  interface InternalAxiosRequestConfig<D = any> {
    skipAuth?: boolean
  }
}

export interface NormalizedRequestError {
  code: number | string
  message: string
  data?: unknown
  raw: unknown
}

interface BusinessPayload {
  code: number | string
  message?: unknown
  msg?: unknown
  data?: unknown
}

const DEFAULT_TIMEOUT = 15_000
const DEFAULT_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api/v1' : '/api/v1'
const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT)

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
  timeout:
    Number.isFinite(configuredTimeout) && configuredTimeout > 0
      ? configuredTimeout
      : DEFAULT_TIMEOUT,
  withCredentials: false,
})

const readToken = () => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('playflick_token')
  } catch {
    return null
  }
}

const removeToken = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem('playflick_token')
  } catch {
    // Storage can be unavailable in hardened browser contexts.
  }
}

service.interceptors.request.use((config) => {
  const token = readToken()

  if (token && config.skipAuth !== true) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

service.interceptors.response.use(
  (response) => {
    const payload: unknown = response.data

    if (
      payload &&
      typeof payload === 'object' &&
      'code' in payload &&
      payload.code !== 0 &&
      payload.code !== '0'
    ) {
      return Promise.reject(normalizeBusinessError(payload as BusinessPayload))
    }

    return payload as AxiosResponse
  },
  (error: unknown) => Promise.reject(normalizeHttpError(error)),
)

const getString = (value: unknown) => (typeof value === 'string' ? value : undefined)

function normalizeBusinessError(payload: BusinessPayload): NormalizedRequestError {
  return {
    code: payload.code,
    message: getString(payload.message) || getString(payload.msg) || '请求失败',
    data: payload.data,
    raw: payload,
  }
}

function normalizeHttpError(error: unknown): NormalizedRequestError {
  if (!axios.isAxiosError(error)) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : '请求失败',
      raw: error,
    }
  }

  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: error.message || '网络连接异常，请稍后重试',
      raw: error,
    }
  }

  const { status, data } = error.response
  const messageMap: Record<number, string> = {
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

  if (status === 401) removeToken()

  const responseMessage =
    data && typeof data === 'object' && 'message' in data ? getString(data.message) : undefined

  return {
    code: status,
    message: responseMessage || messageMap[status] || '请求失败',
    data,
    raw: error,
  }
}

const request = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return service.get<T, T>(url, config)
  },
  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return service.post<T, T, D>(url, data, config)
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return service.delete<T, T>(url, config)
  },
}

export default request
