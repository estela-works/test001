import { get, post, del } from './apiClient'
import type { Project, CreateProjectRequest, ProjectStats } from '@/types'

/**
 * 案件一覧取得
 */
export async function getAll(): Promise<Project[]> {
  return get<Project[]>('/projects')
}

/**
 * 案件詳細取得
 * @param id 案件ID
 */
export async function getById(id: number): Promise<Project> {
  return get<Project>(`/projects/${id}`)
}

/**
 * 案件作成
 * @param data 作成データ
 */
export async function create(data: CreateProjectRequest): Promise<Project> {
  return post<Project>('/projects', data)
}

/**
 * 案件削除
 * @param id 案件ID
 */
export async function deleteProject(id: number): Promise<void> {
  return del<void>(`/projects/${id}`)
}

/**
 * 案件統計取得
 * @param id 案件ID
 */
export async function getStats(id: number): Promise<ProjectStats> {
  return get<ProjectStats>(`/projects/${id}/stats`)
}

/**
 * 未分類チケット統計取得
 */
export async function getNoProjectStats(): Promise<ProjectStats> {
  const todos = await get<{ completed: boolean }[]>('/todos?projectId=none')
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const progressRate = total > 0 ? Math.round((completed / total) * 100) : 0
  return { total, completed, progressRate }
}

// エイリアス
export { deleteProject as delete }
