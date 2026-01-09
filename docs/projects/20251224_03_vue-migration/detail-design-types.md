# 型定義詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

TypeScript型定義の詳細を定義する。APIレスポンス、リクエスト、内部データ構造の型を網羅する。

### 1.2 ファイル構成

```
src/frontend/src/types/
├── todo.ts        # ToDo関連型
├── project.ts     # 案件関連型
├── user.ts        # ユーザー関連型
├── api.ts         # API共通型
└── index.ts       # エクスポート集約
```

---

## 2. ToDo型定義

### 2.1 ファイル

`src/frontend/src/types/todo.ts`

### 2.2 型定義

```typescript
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
```

### 2.3 フィールド詳細

| フィールド | 型 | 必須 | バリデーション | 説明 |
|-----------|-----|------|---------------|------|
| id | number | 自動 | - | サーバー生成 |
| title | string | 要 | 1文字以上 | 必須入力 |
| description | string \| null | 否 | - | 空文字可 |
| completed | boolean | 自動 | - | デフォルトfalse |
| startDate | string \| null | 否 | YYYY-MM-DD | 日付形式 |
| dueDate | string \| null | 否 | YYYY-MM-DD、startDate以降 | 日付形式 |
| projectId | number \| null | 否 | - | 外部キー |
| assigneeId | number \| null | 否 | - | 外部キー |
| assigneeName | string \| null | 読取専用 | - | サーバー結合 |
| createdAt | string | 自動 | - | ISO8601形式 |

---

## 3. 案件型定義

### 3.1 ファイル

`src/frontend/src/types/project.ts`

### 3.2 型定義

```typescript
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
```

### 3.3 フィールド詳細

| フィールド | 型 | 必須 | バリデーション | 説明 |
|-----------|-----|------|---------------|------|
| id | number | 自動 | - | サーバー生成 |
| name | string | 要 | 1文字以上 | 必須入力 |
| description | string \| null | 否 | - | 空文字可 |
| createdAt | string | 自動 | - | ISO8601形式 |

---

## 4. ユーザー型定義

### 4.1 ファイル

`src/frontend/src/types/user.ts`

### 4.2 型定義

```typescript
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
```

### 4.3 フィールド詳細

| フィールド | 型 | 必須 | バリデーション | 説明 |
|-----------|-----|------|---------------|------|
| id | number | 自動 | - | サーバー生成 |
| name | string | 要 | 1-100文字、一意 | 必須入力 |
| createdAt | string | 自動 | - | ISO8601形式 |

---

## 5. API共通型定義

### 5.1 ファイル

`src/frontend/src/types/api.ts`

### 5.2 型定義

```typescript
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
```

---

## 6. エクスポート集約

### 6.1 ファイル

`src/frontend/src/types/index.ts`

### 6.2 内容

```typescript
// Todo
export type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilter,
  TodoStats
} from './todo'

// Project
export type {
  Project,
  CreateProjectRequest,
  ProjectStats,
  ProjectWithStats
} from './project'
export { NO_PROJECT_ID } from './project'
export type { SpecialProjectId } from './project'

// User
export type {
  User,
  CreateUserRequest
} from './user'

// API
export type {
  ApiError,
  Pagination,
  PagedResponse
} from './api'
export { ApiException } from './api'
```

---

## 7. 使用例

### 7.1 インポート

```typescript
// 個別インポート
import type { Todo, CreateTodoRequest } from '@/types/todo'

// 集約インポート
import type { Todo, Project, User } from '@/types'
import { ApiException, NO_PROJECT_ID } from '@/types'
```

### 7.2 型ガード

```typescript
// APIエラー判定
function isApiException(error: unknown): error is ApiException {
  return error instanceof ApiException
}

// 使用例
try {
  await todoService.create(data)
} catch (e) {
  if (isApiException(e) && e.status === 400) {
    // バリデーションエラー処理
  }
}
```

### 7.3 型アサーション

```typescript
// クエリパラメータの型変換
const projectId = route.query.projectId as string | undefined

// null許容フィールドの処理
const assigneeName = todo.assigneeName ?? '未割当'
```

---

## 8. バックエンドとの対応

### 8.1 エンティティマッピング

| フロントエンド | バックエンド(Java) | 備考 |
|--------------|-------------------|------|
| Todo | Todo.java | 完全対応 |
| Project | Project.java | 完全対応 |
| User | User.java | 完全対応 |
| ProjectStats | ProjectStats.java | 完全対応 |

### 8.2 日付フォーマット

| フィールド | フロントエンド | バックエンド | 変換 |
|-----------|--------------|-------------|------|
| startDate | string (YYYY-MM-DD) | LocalDate | 文字列のまま |
| dueDate | string (YYYY-MM-DD) | LocalDate | 文字列のまま |
| createdAt | string (ISO8601) | LocalDateTime | 文字列のまま |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
