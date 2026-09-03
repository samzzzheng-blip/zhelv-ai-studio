const TOKEN_KEY = 'zlzc.access_token'

export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

export class ApiError extends Error {
  constructor(message: string, public readonly code = 500) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  anonymous?: boolean
}

function createUrl(path: string, query?: RequestOptions['query']) {
  const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
  const url = new URL(`${base}${path}`, window.location.origin)
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  })
  return url.toString()
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, anonymous, headers, ...init } = options
  const token = getToken()
  let response: Response
  try {
    response = await fetch(createUrl(path, query), {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(!anonymous && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('无法连接后端服务，请确认 Spring Boot 已在 8080 端口启动。', 0)
  }

  const payload = await response.json().catch(() => null) as (ApiResponse & Record<string, unknown>) | null
  const code = Number(payload?.code ?? response.status)
  if (response.status === 401 || code === 401) {
    clearToken()
    window.dispatchEvent(new CustomEvent('zlzc:auth-expired'))
  }
  if (!response.ok || code !== 200) {
    throw new ApiError(String(payload?.msg || `请求失败（${response.status}）`), code)
  }
  return payload as T
}
