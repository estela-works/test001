import { get, post, del } from './apiClient'
import type { User } from '@/types'

/**
 * ユーザー一覧取得
 */
export async function getAll(): Promise<User[]> {
  return get<User[]>('/users')
}

/**
 * ユーザー作成
 * @param name ユーザー名
 */
export async function create(name: string): Promise<User> {
  return post<User>('/users', { name })
}

/**
 * ユーザー削除
 * @param id ユーザーID
 */
export async function deleteUser(id: number): Promise<void> {
  return del<void>(`/users/${id}`)
}

// エイリアス
export { deleteUser as delete }
