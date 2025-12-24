/**
 * APIエラーレスポンス
 */
export interface ApiError {
  /** エラーメッセージ */
  message: string

  /** HTTPステータスコード */
  status: number

  /** エラーコード（オプション） */
  code?: string
}

/**
 * APIエラー例外
 */
export class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiException'
  }
}

/**
 * ページネーション（将来拡張用）
 */
export interface Pagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/**
 * ページネーションレスポンス（将来拡張用）
 */
export interface PagedResponse<T> {
  content: T[]
  pagination: Pagination
}
