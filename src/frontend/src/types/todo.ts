/**
 * ToDoエンティティ
 * APIレスポンスの型
 */
export interface Todo {
  /** ToDo ID */
  id: number

  /** タイトル */
  title: string

  /** 説明（オプション） */
  description: string | null

  /** 完了フラグ */
  completed: boolean

  /** 開始日（YYYY-MM-DD形式） */
  startDate: string | null

  /** 終了日（YYYY-MM-DD形式） */
  dueDate: string | null

  /** 案件ID（null = 未分類） */
  projectId: number | null

  /** 担当者ID（null = 未割当） */
  assigneeId: number | null

  /** 担当者名（結合済み） */
  assigneeName: string | null

  /** 作成日時（ISO8601形式） */
  createdAt: string
}

/**
 * ToDo作成リクエスト
 */
export interface CreateTodoRequest {
  /** タイトル（必須） */
  title: string

  /** 説明 */
  description?: string

  /** 開始日 */
  startDate?: string | null

  /** 終了日 */
  dueDate?: string | null

  /** 案件ID */
  projectId?: number | null

  /** 担当者ID */
  assigneeId?: number | null
}

/**
 * ToDo更新リクエスト
 */
export interface UpdateTodoRequest {
  /** タイトル */
  title?: string

  /** 説明 */
  description?: string

  /** 完了フラグ */
  completed?: boolean

  /** 開始日 */
  startDate?: string | null

  /** 終了日 */
  dueDate?: string | null

  /** 担当者ID */
  assigneeId?: number | null
}

/**
 * ToDoフィルタ種別
 */
export type TodoFilter = 'all' | 'pending' | 'completed'

/**
 * ToDo統計
 */
export interface TodoStats {
  /** 総数 */
  total: number

  /** 完了数 */
  completed: number

  /** 未完了数 */
  pending: number
}
