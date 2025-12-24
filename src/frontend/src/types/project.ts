/**
 * 案件エンティティ
 * APIレスポンスの型
 */
export interface Project {
  /** 案件ID */
  id: number

  /** 案件名 */
  name: string

  /** 説明（オプション） */
  description: string | null

  /** 作成日時（ISO8601形式） */
  createdAt: string
}

/**
 * 案件作成リクエスト
 */
export interface CreateProjectRequest {
  /** 案件名（必須） */
  name: string

  /** 説明 */
  description?: string
}

/**
 * 案件統計
 */
export interface ProjectStats {
  /** チケット総数 */
  total: number

  /** 完了数 */
  completed: number

  /** 進捗率（0-100） */
  progressRate: number
}

/**
 * 案件（表示用拡張）
 * 未分類案件を含む
 */
export interface ProjectWithStats extends Project {
  stats: ProjectStats
}

/**
 * 特殊案件ID
 */
export const NO_PROJECT_ID = 'none' as const
export type SpecialProjectId = typeof NO_PROJECT_ID
