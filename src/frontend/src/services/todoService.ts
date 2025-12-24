import { get, post, patch, del } from './apiClient'
import type { Todo, CreateTodoRequest } from '@/types'

/**
 * ToDo一覧取得
 * @param projectId 案件ID（オプション）。'none'は未分類
 */
export async function getAll(projectId?: string | null): Promise<Todo[]> {
  let endpoint = '/todos'
  if (projectId) {
    endpoint += `?projectId=${encodeURIComponent(projectId)}`
  }
  return get<Todo[]>(endpoint)
}

/**
 * ToDo詳細取得
 * @param id ToDo ID
 */
export async function getById(id: number): Promise<Todo> {
  return get<Todo>(`/todos/${id}`)
}

/**
 * ToDo作成
 * @param data 作成データ
 */
export async function create(data: CreateTodoRequest): Promise<Todo> {
  return post<Todo>('/todos', data)
}

/**
 * ToDo完了状態切替
 * @param id ToDo ID
 */
export async function toggle(id: number): Promise<Todo> {
  return patch<Todo>(`/todos/${id}/toggle`)
}

/**
 * ToDo削除
 * @param id ToDo ID
 */
export async function deleteTodo(id: number): Promise<void> {
  return del<void>(`/todos/${id}`)
}

// エイリアス
export { deleteTodo as delete }
