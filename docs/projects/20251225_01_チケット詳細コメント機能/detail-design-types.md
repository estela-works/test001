# 型定義詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

コメント機能に関連するTypeScript型定義の詳細を定義する。APIレスポンス、リクエスト、内部データ構造の型を網羅する。

### 1.2 ファイル構成

```
src/frontend/src/types/
├── comment.ts     # コメント関連型（新規）
├── todo.ts        # ToDo関連型（既存）
├── user.ts        # ユーザー関連型（既存）
├── api.ts         # API共通型（既存）
└── index.ts       # エクスポート集約（更新）
```

---

## 2. コメント型定義（新規）

### 2.1 ファイル

`src/frontend/src/types/comment.ts`

### 2.2 型定義

```typescript
/**
 * コメントエンティティ
 * APIレスポンスの型
 */
export interface Comment {
  /** コメントID */
  id: number

  /** 紐づくToDoのID */
  todoId: number

  /** 投稿者のユーザーID（null = ユーザー削除済み） */
  userId: number | null

  /** 投稿者名（結合済み、null = ユーザー削除済み） */
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
  /** 投稿者のユーザーID（必須） */
  userId: number

  /** コメント内容（必須、最大2000文字） */
  content: string
}

/**
 * コメントリストレスポンス
 * GET /api/todos/{todoId}/comments のレスポンス型
 */
export type CommentListResponse = Comment[]

/**
 * コメント作成レスポンス
 * POST /api/todos/{todoId}/comments のレスポンス型
 */
export type CreateCommentResponse = Comment

/**
 * コメント削除レスポンス
 * DELETE /api/comments/{id} のレスポンス（204 No Content）
 */
export type DeleteCommentResponse = void

/**
 * コメントフォーム入力状態
 * Vueコンポーネント内部で使用
 */
export interface CommentFormState {
  /** コメント内容 */
  content: string

  /** 選択された投稿者ID */
  userId: number | null

  /** 投稿処理中フラグ */
  submitting: boolean

  /** バリデーションエラーメッセージ */
  errors: {
    content?: string
    userId?: string
  }
}

/**
 * コメントストア状態
 * Piniaストアで使用
 */
export interface CommentStoreState {
  /** コメント一覧 */
  comments: Comment[]

  /** ローディング状態 */
  loading: boolean

  /** エラーメッセージ */
  error: string | null

  /** 現在表示中のToDoID */
  currentTodoId: number | null
}
```

---

## 3. 型のバリデーション仕様

### 3.1 CreateCommentRequest バリデーション

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| userId | 必須、number型、正の整数 | "投稿者を選択してください" |
| content | 必須、string型、1〜2000文字 | "コメントを入力してください（最大2000文字）" |

### 3.2 バリデーション関数

```typescript
/**
 * コメント作成リクエストのバリデーション
 * @param request - バリデーション対象のリクエスト
 * @returns バリデーションエラーのマップ
 */
export function validateCreateCommentRequest(
  request: Partial<CreateCommentRequest>
): { content?: string; userId?: string } {
  const errors: { content?: string; userId?: string } = {}

  // userId検証
  if (!request.userId || request.userId <= 0) {
    errors.userId = '投稿者を選択してください'
  }

  // content検証
  if (!request.content || request.content.trim() === '') {
    errors.content = 'コメントを入力してください'
  } else if (request.content.length > 2000) {
    errors.content = 'コメントは最大2000文字までです'
  }

  return errors
}
```

---

## 4. 型ガード関数

### 4.1 Comment型ガード

```typescript
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
export function isCommentListResponse(value: unknown): value is CommentListResponse {
  return Array.isArray(value) && value.every(isComment)
}
```

---

## 5. ユーティリティ型

### 5.1 コメント表示用型

```typescript
/**
 * コメント表示用の拡張型
 * UI表示用に追加情報を含む
 */
export interface CommentDisplay extends Comment {
  /** 相対時間表示（例: "5分前", "2時間前"） */
  relativeTime: string

  /** 削除可能かどうか（将来的な権限制御用） */
  canDelete: boolean

  /** ユーザーアバター画像URL（将来的な拡張用） */
  avatarUrl?: string
}

/**
 * CommentをCommentDisplayに変換する関数
 * @param comment - 元のコメント
 * @returns 表示用コメント
 */
export function toCommentDisplay(comment: Comment): CommentDisplay {
  return {
    ...comment,
    relativeTime: formatRelativeTime(comment.createdAt),
    canDelete: true // 現状は全て削除可能
  }
}

/**
 * 相対時間をフォーマットする関数
 * @param isoDate - ISO8601形式の日時文字列
 * @returns 相対時間文字列
 */
function formatRelativeTime(isoDate: string): string {
  const now = new Date()
  const past = new Date(isoDate)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'たった今'
  if (diffMins < 60) return `${diffMins}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`

  // 1週間以上前は日時表示
  return past.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
```

---

## 6. APIエラー型

### 6.1 コメントAPIエラー型

```typescript
/**
 * コメントAPI共通エラー型
 */
export interface CommentApiError {
  /** HTTPステータスコード */
  status: number

  /** エラーメッセージ */
  message: string

  /** エラーの詳細（オプション） */
  details?: string
}

/**
 * よくあるエラーパターン
 */
export const COMMENT_ERROR_MESSAGES = {
  NETWORK_ERROR: '通信エラーが発生しました',
  NOT_FOUND: 'コメントが見つかりません',
  TODO_NOT_FOUND: 'チケットが見つかりません',
  USER_NOT_FOUND: '投稿者が見つかりません',
  CREATE_FAILED: 'コメントの投稿に失敗しました',
  DELETE_FAILED: 'コメントの削除に失敗しました',
  FETCH_FAILED: 'コメントの取得に失敗しました',
  VALIDATION_ERROR: '入力内容に誤りがあります'
} as const

/**
 * エラーレスポンスをCommentApiErrorに変換
 * @param error - Fetch APIのエラー
 * @param status - HTTPステータスコード
 * @returns CommentApiError
 */
export async function toCommentApiError(
  error: unknown,
  status?: number
): Promise<CommentApiError> {
  if (error instanceof Error) {
    return {
      status: status ?? 0,
      message: error.message || COMMENT_ERROR_MESSAGES.NETWORK_ERROR
    }
  }

  return {
    status: status ?? 0,
    message: COMMENT_ERROR_MESSAGES.NETWORK_ERROR
  }
}
```

---

## 7. 定数定義

### 7.1 コメント関連定数

```typescript
/**
 * コメント関連の定数
 */
export const COMMENT_CONSTANTS = {
  /** コメント最大文字数 */
  MAX_CONTENT_LENGTH: 2000,

  /** コメント最小文字数 */
  MIN_CONTENT_LENGTH: 1,

  /** コメント一覧のデフォルト表示件数 */
  DEFAULT_DISPLAY_COUNT: 50,

  /** コメント入力欄のplaceholder */
  CONTENT_PLACEHOLDER: 'コメントを入力してください...',

  /** 未選択時の投稿者プレースホルダー */
  USER_PLACEHOLDER: '投稿者を選択してください'
} as const
```

---

## 8. index.tsでのエクスポート

### 8.1 エクスポート集約

```typescript
// src/frontend/src/types/index.ts

// 既存のエクスポート
export * from './todo'
export * from './user'
export * from './project'
export * from './api'

// コメント関連の新規エクスポート
export * from './comment'
```

---

## 9. 使用例

### 9.1 コンポーネントでの使用

```typescript
// CommentForm.vue
import type { CreateCommentRequest, CommentFormState } from '@/types'
import { validateCreateCommentRequest, COMMENT_CONSTANTS } from '@/types'

const formState = reactive<CommentFormState>({
  content: '',
  userId: null,
  submitting: false,
  errors: {}
})

async function submitComment() {
  const request: Partial<CreateCommentRequest> = {
    userId: formState.userId ?? undefined,
    content: formState.content
  }

  formState.errors = validateCreateCommentRequest(request)

  if (Object.keys(formState.errors).length > 0) {
    return
  }

  // API呼び出し...
}
```

### 9.2 ストアでの使用

```typescript
// commentStore.ts
import type { Comment, CommentStoreState, CreateCommentRequest } from '@/types'

const state = reactive<CommentStoreState>({
  comments: [],
  loading: false,
  error: null,
  currentTodoId: null
})
```

---

## 10. 型定義の命名規則

| 接尾辞 | 用途 | 例 |
|--------|------|-----|
| なし | エンティティ | Comment |
| Request | APIリクエスト | CreateCommentRequest |
| Response | APIレスポンス | CommentListResponse |
| State | コンポーネント/ストア状態 | CommentFormState, CommentStoreState |
| Display | UI表示用拡張型 | CommentDisplay |
| Error | エラー型 | CommentApiError |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
