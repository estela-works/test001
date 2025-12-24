import { ApiException } from '@/types'

const BASE_URL = '/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

/**
 * 共通HTTPクライアント
 * Fetch APIのラッパー
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const url = `${BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorText = await response.text()
      throw new ApiException(errorText || `HTTP error ${response.status}`, response.status)
    }

    // 204 No Content の場合
    if (response.status === 204) {
      return undefined as T
    }

    // JSONレスポンスをパース
    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof ApiException) {
      throw error
    }
    // ネットワークエラー
    throw new ApiException('ネットワークエラーが発生しました', 0)
  }
}

/**
 * GETリクエスト
 */
export function get<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET' })
}

/**
 * POSTリクエスト
 */
export function post<T>(endpoint: string, body: unknown): Promise<T> {
  return apiClient<T>(endpoint, { method: 'POST', body })
}

/**
 * PUTリクエスト
 */
export function put<T>(endpoint: string, body: unknown): Promise<T> {
  return apiClient<T>(endpoint, { method: 'PUT', body })
}

/**
 * PATCHリクエスト
 */
export function patch<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiClient<T>(endpoint, { method: 'PATCH', body })
}

/**
 * DELETEリクエスト
 */
export function del<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' })
}
