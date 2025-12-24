/**
 * ユーザーエンティティ
 * APIレスポンスの型
 */
export interface User {
  /** ユーザーID */
  id: number

  /** ユーザー名 */
  name: string

  /** 作成日時（ISO8601形式） */
  createdAt: string
}

/**
 * ユーザー作成リクエスト
 */
export interface CreateUserRequest {
  /** ユーザー名（必須） */
  name: string
}
