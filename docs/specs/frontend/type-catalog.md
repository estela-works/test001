# 型定義カタログ

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2025-12-26 |
| 型定義ファイル数 | 7 |
| 配置ディレクトリ | `src/frontend/src/types/` |

---

## 1. ファイル構成

| ファイル | 内容 | 主な型 |
|---------|------|--------|
| todo.ts | ToDo関連型 | Todo, CreateTodoRequest, TodoStats |
| project.ts | プロジェクト関連型 | Project, CreateProjectRequest, ProjectStats |
| user.ts | ユーザー関連型 | User, CreateUserRequest |
| comment.ts | コメント関連型 | Comment, CreateCommentRequest |
| filter.ts | フィルタ・ソート関連型 | FilterState, SortKey, SortOrder |
| api.ts | API共通型 | ApiError, ApiException |
| index.ts | エクスポート集約 | すべての型をre-export |

---

## 2. エンティティ型

### 2.1 Todo

| 項目 | 内容 |
|------|------|
| ファイル | `types/todo.ts` |
| 用途 | ToDoエンティティ（APIレスポンス） |

```typescript
interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  startDate: string | null      // YYYY-MM-DD形式
  dueDate: string | null        // YYYY-MM-DD形式
  projectId: number | null
  assigneeId: number | null
  assigneeName: string | null   // 結合済み
  createdAt: string             // ISO8601形式
}
```

#### プロパティ詳細

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | `number` | ○ | ToDoの一意識別子 |
| title | `string` | ○ | ToDoのタイトル |
| description | `string \| null` | - | 詳細説明 |
| completed | `boolean` | ○ | 完了状態 |
| startDate | `string \| null` | - | 開始日（YYYY-MM-DD） |
| dueDate | `string \| null` | - | 終了日（YYYY-MM-DD） |
| projectId | `number \| null` | - | 紐づくプロジェクトID |
| assigneeId | `number \| null` | - | 担当者のユーザーID |
| assigneeName | `string \| null` | - | 担当者名（結合済み） |
| createdAt | `string` | ○ | 作成日時 |

---

### 2.2 Project

| 項目 | 内容 |
|------|------|
| ファイル | `types/project.ts` |
| 用途 | プロジェクトエンティティ |

```typescript
interface Project {
  id: number
  name: string
  description: string | null
  createdAt: string
}
```

---

### 2.3 User

| 項目 | 内容 |
|------|------|
| ファイル | `types/user.ts` |
| 用途 | ユーザーエンティティ |

```typescript
interface User {
  id: number
  name: string
  createdAt: string
}
```

---

### 2.4 Comment

| 項目 | 内容 |
|------|------|
| ファイル | `types/comment.ts` |
| 用途 | コメントエンティティ |

```typescript
interface Comment {
  id: number
  todoId: number
  userId: number | null
  userName: string | null
  content: string
  createdAt: string
}
```

---

## 3. リクエスト型

### 3.1 CreateTodoRequest

| 項目 | 内容 |
|------|------|
| ファイル | `types/todo.ts` |
| 用途 | ToDo作成リクエスト |
| 使用API | `POST /api/todos` |

```typescript
interface CreateTodoRequest {
  title: string
  description?: string
  startDate?: string | null
  dueDate?: string | null
  projectId?: number | null
  assigneeId?: number | null
}
```

#### バリデーションルール

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| title | 必須 | タイトルは必須です |
| startDate, dueDate | startDate <= dueDate | 終了日は開始日以降を指定してください |

---

### 3.2 UpdateTodoRequest

| 項目 | 内容 |
|------|------|
| ファイル | `types/todo.ts` |
| 用途 | ToDo更新リクエスト |
| 使用API | `PUT /api/todos/{id}` |

```typescript
interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
  startDate?: string | null
  dueDate?: string | null
  assigneeId?: number | null
}
```

---

### 3.3 CreateProjectRequest

| 項目 | 内容 |
|------|------|
| ファイル | `types/project.ts` |
| 用途 | プロジェクト作成リクエスト |
| 使用API | `POST /api/projects` |

```typescript
interface CreateProjectRequest {
  name: string
  description?: string
}
```

---

### 3.4 CreateUserRequest

| 項目 | 内容 |
|------|------|
| ファイル | `types/user.ts` |
| 用途 | ユーザー作成リクエスト |
| 使用API | `POST /api/users` |

```typescript
interface CreateUserRequest {
  name: string
}
```

---

### 3.5 CreateCommentRequest

| 項目 | 内容 |
|------|------|
| ファイル | `types/comment.ts` |
| 用途 | コメント作成リクエスト |
| 使用API | `POST /api/todos/{todoId}/comments` |

```typescript
interface CreateCommentRequest {
  userId: number
  content: string
}
```

---

## 4. 統計型

### 4.1 TodoStats

| 項目 | 内容 |
|------|------|
| ファイル | `types/todo.ts` |
| 用途 | ToDo統計情報 |

```typescript
interface TodoStats {
  total: number
  completed: number
  pending: number
}
```

---

### 4.2 ProjectStats

| 項目 | 内容 |
|------|------|
| ファイル | `types/project.ts` |
| 用途 | プロジェクト別統計情報 |

```typescript
interface ProjectStats {
  total: number
  completed: number
  progressRate: number  // 0-100の割合
}
```

---

## 5. UI状態型

### 5.1 FilterState

| 項目 | 内容 |
|------|------|
| ファイル | `types/filter.ts` |
| 用途 | テーブルビューのフィルタ状態 |

```typescript
interface FilterState {
  completed: CompletedFilter
  assigneeId: number | null
  projectId: number | null
  startDateFrom: string | null
  startDateTo: string | null
  dueDateFrom: string | null
  dueDateTo: string | null
}
```

---

### 5.2 CompletedFilter / TodoFilter

| 項目 | 内容 |
|------|------|
| ファイル | `types/filter.ts`, `types/todo.ts` |
| 用途 | 完了状態フィルタ |

```typescript
type CompletedFilter = 'all' | 'pending' | 'completed'
type TodoFilter = 'all' | 'pending' | 'completed'
```

---

### 5.3 SortKey / SortOrder

| 項目 | 内容 |
|------|------|
| ファイル | `types/filter.ts` |
| 用途 | ソート設定 |

```typescript
type SortKey =
  | 'id'
  | 'title'
  | 'description'
  | 'assigneeName'
  | 'projectId'
  | 'startDate'
  | 'dueDate'
  | 'completed'
  | 'createdAt'

type SortOrder = 'asc' | 'desc'

interface SortState {
  key: SortKey
  order: SortOrder
}
```

---

### 5.4 TableColumn

| 項目 | 内容 |
|------|------|
| ファイル | `types/filter.ts` |
| 用途 | テーブル列定義 |

```typescript
interface TableColumn {
  key: SortKey
  label: string
  width: string
  sortable: boolean
}
```

---

### 5.5 TableViewState

| 項目 | 内容 |
|------|------|
| ファイル | `types/filter.ts` |
| 用途 | 検索・フィルタ・ソート統合状態 |

```typescript
interface TableViewState {
  searchKeyword: string
  filter: FilterState
  sort: SortState
}
```

---

## 6. API共通型

### 6.1 ApiError

| 項目 | 内容 |
|------|------|
| ファイル | `types/api.ts` |
| 用途 | APIエラーレスポンス |

```typescript
interface ApiError {
  message: string
  status: number
  code?: string
}
```

---

### 6.2 ApiException

| 項目 | 内容 |
|------|------|
| ファイル | `types/api.ts` |
| 用途 | API例外クラス |

```typescript
class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiException'
  }
}
```

---

### 6.3 Pagination / PagedResponse

| 項目 | 内容 |
|------|------|
| ファイル | `types/api.ts` |
| 用途 | ページネーション（将来拡張用） |

```typescript
interface Pagination {
  page: number
  size: number
  totalElements: number
  totalPages: number
}

interface PagedResponse<T> {
  content: T[]
  pagination: Pagination
}
```

---

## 7. 定数

### 7.1 プロジェクト関連

| 定数名 | 型 | 値 | 説明 |
|--------|-----|-----|------|
| NO_PROJECT_ID | `'none'` | `'none'` | 未分類プロジェクトID |

```typescript
const NO_PROJECT_ID = 'none' as const
type SpecialProjectId = typeof NO_PROJECT_ID
```

---

### 7.2 コメント関連

| 定数名 | 型 | 値 | 説明 |
|--------|-----|-----|------|
| MAX_CONTENT_LENGTH | `number` | `2000` | コメント最大文字数 |
| MIN_CONTENT_LENGTH | `number` | `1` | コメント最小文字数 |

```typescript
const COMMENT_CONSTANTS = {
  MAX_CONTENT_LENGTH: 2000,
  MIN_CONTENT_LENGTH: 1,
  CONTENT_PLACEHOLDER: 'コメントを入力してください（最大2000文字）',
  USER_PLACEHOLDER: '投稿者を選択してください'
} as const
```

---

### 7.3 エラーメッセージ

```typescript
const COMMENT_ERROR_MESSAGES = {
  FETCH_FAILED: 'コメントの取得に失敗しました',
  CREATE_FAILED: 'コメントの投稿に失敗しました',
  DELETE_FAILED: 'コメントの削除に失敗しました',
  VALIDATION_ERROR: '入力内容に誤りがあります',
  TODO_NOT_FOUND: 'チケットが見つかりません',
  NOT_FOUND: 'コメントが見つかりません',
  NETWORK_ERROR: '通信エラーが発生しました'
} as const
```

---

### 7.4 初期状態

```typescript
const initialFilterState: FilterState = {
  completed: 'all',
  assigneeId: null,
  projectId: null,
  startDateFrom: null,
  startDateTo: null,
  dueDateFrom: null,
  dueDateTo: null
}

const initialSortState: SortState = {
  key: 'id',
  order: 'asc'
}

const initialTableViewState: TableViewState = {
  searchKeyword: '',
  filter: initialFilterState,
  sort: initialSortState
}
```

---

### 7.5 テーブル列定義

```typescript
const TODO_TABLE_COLUMNS: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px', sortable: true },
  { key: 'title', label: 'タイトル', width: 'auto', sortable: true },
  { key: 'description', label: '説明', width: '200px', sortable: false },
  { key: 'assigneeName', label: '担当者', width: '100px', sortable: true },
  { key: 'projectId', label: '案件', width: '120px', sortable: true },
  { key: 'startDate', label: '開始日', width: '100px', sortable: true },
  { key: 'dueDate', label: '終了日', width: '100px', sortable: true },
  { key: 'completed', label: '状態', width: '80px', sortable: true },
  { key: 'createdAt', label: '作成日', width: '100px', sortable: true }
]

const COMPLETED_FILTER_OPTIONS = [
  { value: 'all' as const, label: 'すべて' },
  { value: 'pending' as const, label: '未完了' },
  { value: 'completed' as const, label: '完了済み' }
]
```

---

## 8. ユーティリティ関数

### 8.1 バリデーション

```typescript
// コメント作成リクエストのバリデーション
function validateCreateCommentRequest(
  request: Partial<CreateCommentRequest>
): { [key: string]: string }

// フィルタが初期状態かどうかを判定
function isFilterEmpty(filter: FilterState): boolean

// フィルタをリセット
function resetFilter(): FilterState
```

### 8.2 タイプガード

```typescript
// Comment型のタイプガード
function isComment(value: unknown): value is Comment

// CommentListResponse型のタイプガード
function isCommentList(value: unknown): value is CommentListResponse
```

---

## 9. index.tsエクスポート構成

```typescript
// Todo
export type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilter, TodoStats } from './todo'

// Project
export type { Project, CreateProjectRequest, ProjectStats, ProjectWithStats } from './project'
export { NO_PROJECT_ID } from './project'
export type { SpecialProjectId } from './project'

// User
export type { User, CreateUserRequest } from './user'

// Comment
export type {
  Comment,
  CreateCommentRequest,
  CommentListResponse,
  CreateCommentResponse,
  DeleteCommentResponse
} from './comment'
export {
  COMMENT_ERROR_MESSAGES,
  COMMENT_CONSTANTS,
  validateCreateCommentRequest,
  isComment,
  isCommentList
} from './comment'

// API
export type { ApiError, Pagination, PagedResponse } from './api'
export { ApiException } from './api'

// Filter
export type {
  FilterState,
  CompletedFilter,
  SortKey,
  SortOrder,
  SortState,
  TableColumn,
  TableViewState
} from './filter'
export {
  initialFilterState,
  initialSortState,
  initialTableViewState,
  TODO_TABLE_COLUMNS,
  COMPLETED_FILTER_OPTIONS,
  isFilterEmpty,
  resetFilter
} from './filter'
```

---

## 10. 命名規則

| 接尾辞 | 用途 | 例 |
|--------|------|-----|
| なし | エンティティ | Todo, Project, User |
| Request | APIリクエスト | CreateTodoRequest, UpdateTodoRequest |
| Response | APIレスポンス | CommentListResponse |
| State | コンポーネント/ストア状態 | FilterState, SortState |
| Stats | 統計情報 | TodoStats, ProjectStats |
| Error | エラー型 | ApiError |
| Filter | フィルタ種別 | CompletedFilter, TodoFilter |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成 | Claude |
