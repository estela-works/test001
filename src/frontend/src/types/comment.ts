/**
 * コメント型定義
 * APIレスポンスの型
 */
export interface Comment {
  /** コメントID */
  id: number

  /** ToDoID */
  todoId: number

  /** 投稿者のユーザーID（削除されている場合はnull） */
  userId: number | null

  /** 投稿者名（削除されている場合はnull） */
  userName: string | null

  /** コメント内容 */
  content: string

  /** 投稿日時（ISO8601形式） */
  createdAt: string
}

/**
 * コメント作成リクエスト
 */
export interface CreateCommentRequest {
  /** 投稿者のユーザーID */
  userId: number

  /** コメント内容 */
  content: string
}

/**
 * コメント一覧レスポンス
 */
export type CommentListResponse = Comment[]

/**
 * コメント作成レスポンス
 */
export type CreateCommentResponse = Comment

/**
 * コメント削除レスポンス（204 No Content）
 */
export type DeleteCommentResponse = void

/**
 * APIエラーメッセージ定数
 */
export const COMMENT_ERROR_MESSAGES = {
  FETCH_FAILED: 'コメントの取得に失敗しました',
  CREATE_FAILED: 'コメントの投稿に失敗しました',
  DELETE_FAILED: 'コメントの削除に失敗しました',
  VALIDATION_ERROR: '入力内容に誤りがあります',
  TODO_NOT_FOUND: 'チケットが見つかりません',
  NOT_FOUND: 'コメントが見つかりません',
  NETWORK_ERROR: '通信エラーが発生しました'
} as const

/**
 * コメント関連の定数
 */
export const COMMENT_CONSTANTS = {
  /** コメント最大文字数 */
  MAX_CONTENT_LENGTH: 2000,

  /** コメント最小文字数 */
  MIN_CONTENT_LENGTH: 1,

  /** コメントプレースホルダー */
  CONTENT_PLACEHOLDER: 'コメントを入力してください（最大2000文字）',

  /** 投稿者プレースホルダー */
  USER_PLACEHOLDER: '投稿者を選択してください'
} as const

/**
 * コメント作成リクエストのバリデーション
 * @param request - バリデーション対象のリクエスト
 * @returns バリデーションエラーのマップ
 */
export function validateCreateCommentRequest(
  request: Partial<CreateCommentRequest>
): { [key: string]: string } {
  const errors: { [key: string]: string } = {}

  if (!request.userId) {
    errors.userId = '投稿者を選択してください'
  }

  if (!request.content || request.content.trim() === '') {
    errors.content = 'コメントを入力してください（最大2000文字）'
  } else if (request.content.length > COMMENT_CONSTANTS.MAX_CONTENT_LENGTH) {
    errors.content = `コメントは${COMMENT_CONSTANTS.MAX_CONTENT_LENGTH}文字以内で入力してください`
  }

  return errors
}

/**
 * Comment型のタイプガード
 * @param value - チェック対象の値
 * @returns Comment型かどうか
 */
export function isComment(value: unknown): value is Comment {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  return (
    typeof obj.id === 'number' &&
    typeof obj.todoId === 'number' &&
    (obj.userId === null || typeof obj.userId === 'number') &&
    (obj.userName === null || typeof obj.userName === 'string') &&
    typeof obj.content === 'string' &&
    typeof obj.createdAt === 'string'
  )
}

/**
 * CommentListResponse型のタイプガード
 * @param value - チェック対象の値
 * @returns CommentListResponse型かどうか
 */
export function isCommentList(value: unknown): value is CommentListResponse {
  return Array.isArray(value) && value.every(isComment)
}
