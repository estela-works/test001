# 型定義カタログ

<!--
このテンプレートはTypeScript型定義の一覧と詳細を記録するために使用します。
エンティティ型、リクエスト/レスポンス型、UI状態型、定数を網羅的に記載します。
-->

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | <!-- YYYY-MM-DD --> |
| 型定義ファイル数 | <!-- 例: 6 --> |
| 配置ディレクトリ | `src/frontend/src/types/` |

---

## 1. ファイル構成

| ファイル | 内容 | 主な型 |
|---------|------|--------|
| todo.ts | ToDo関連型 | Todo, CreateTodoRequest, TodoStats |
| project.ts | プロジェクト関連型 | Project, CreateProjectRequest, ProjectStats |
| user.ts | ユーザー関連型 | User, CreateUserRequest |
| filter.ts | フィルタ・ソート関連型 | FilterState, SortKey, SortOrder |
| api.ts | API共通型 | ApiError, ApiException |
| comment.ts | コメント関連型 | Comment, CreateCommentRequest |
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
  projectId: number | null
  projectName: string | null
  userId: number | null
  userName: string | null
  startDate: string | null   // ISO8601形式
  endDate: string | null     // ISO8601形式
  createdAt: string          // ISO8601形式
  updatedAt: string          // ISO8601形式
}
```

#### プロパティ詳細

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | `number` | ✓ | ToDoの一意識別子 |
| title | `string` | ✓ | ToDoのタイトル |
| description | `string \| null` | - | 詳細説明 |
| completed | `boolean` | ✓ | 完了状態 |
| projectId | `number \| null` | - | 紐づくプロジェクトID |
| projectName | `string \| null` | - | プロジェクト名（結合済み） |
| userId | `number \| null` | - | 担当者のユーザーID |
| userName | `string \| null` | - | 担当者名（結合済み） |
| startDate | `string \| null` | - | 開始日 |
| endDate | `string \| null` | - | 終了日 |
| createdAt | `string` | ✓ | 作成日時 |
| updatedAt | `string` | ✓ | 更新日時 |

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
  updatedAt: string
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
  projectId?: number
  userId?: number
  startDate?: string
  endDate?: string
}
```

#### バリデーションルール

| フィールド | ルール | エラーメッセージ |
|-----------|--------|----------------|
| title | 必須、1-200文字 | タイトルは必須です |
| description | 任意、最大2000文字 | 説明は2000文字以内です |
| projectId | 任意、正の整数 | - |
| userId | 任意、正の整数 | - |
| startDate | 任意、ISO8601形式 | 日付形式が不正です |
| endDate | 任意、startDate以降 | 終了日は開始日以降を指定してください |

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
  projectId?: number | null
  userId?: number | null
  startDate?: string | null
  endDate?: string | null
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
  projectId: number
  projectName: string
  total: number
  completed: number
  pending: number
  completionRate: number  // 0-100の割合
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
  keyword: string
  completed: CompletedFilter
  userId: number | null
  projectId: number | null
  startDateFrom: string | null
  startDateTo: string | null
  endDateFrom: string | null
  endDateTo: string | null
}
```

---

### 5.2 CompletedFilter

| 項目 | 内容 |
|------|------|
| ファイル | `types/filter.ts` |
| 用途 | 完了状態フィルタ |

```typescript
type CompletedFilter = 'all' | 'completed' | 'pending'
```

---

### 5.3 SortKey / SortOrder

| 項目 | 内容 |
|------|------|
| ファイル | `types/filter.ts` |
| 用途 | ソート設定 |

```typescript
type SortKey = 'id' | 'title' | 'completed' | 'startDate' | 'endDate' | 'createdAt'
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
  key: string
  label: string
  sortable: boolean
  width?: string
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
  status: number
  message: string
  details?: string
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
  status: number
  details?: string

  constructor(status: number, message: string, details?: string) {
    super(message)
    this.status = status
    this.details = details
  }
}
```

---

## 7. 定数

### 7.1 プロジェクト関連

| 定数名 | 型 | 値 | 説明 |
|--------|-----|-----|------|
| NO_PROJECT_ID | `number` | `0` | 未分類プロジェクトID |
| NO_PROJECT_NAME | `string` | `'未分類'` | 未分類プロジェクト名 |

---

### 7.2 コメント関連

| 定数名 | 型 | 値 | 説明 |
|--------|-----|-----|------|
| MAX_COMMENT_LENGTH | `number` | `2000` | コメント最大文字数 |
| MIN_COMMENT_LENGTH | `number` | `1` | コメント最小文字数 |

---

### 7.3 エラーメッセージ

```typescript
const COMMENT_ERROR_MESSAGES = {
  NETWORK_ERROR: '通信エラーが発生しました',
  NOT_FOUND: 'コメントが見つかりません',
  TODO_NOT_FOUND: 'チケットが見つかりません',
  CREATE_FAILED: 'コメントの投稿に失敗しました',
  DELETE_FAILED: 'コメントの削除に失敗しました',
  FETCH_FAILED: 'コメントの取得に失敗しました',
  VALIDATION_ERROR: '入力内容に誤りがあります'
} as const
```

---

### 7.4 初期状態

```typescript
const initialFilterState: FilterState = {
  keyword: '',
  completed: 'all',
  userId: null,
  projectId: null,
  startDateFrom: null,
  startDateTo: null,
  endDateFrom: null,
  endDateTo: null
}

const initialSortState: SortState = {
  key: 'createdAt',
  order: 'desc'
}
```

---

## 8. index.tsエクスポート構成

```typescript
// src/frontend/src/types/index.ts

// エンティティ
export type { Todo, Project, User, Comment } from './todo'
export type { Project } from './project'
export type { User } from './user'
export type { Comment } from './comment'

// リクエスト
export type { CreateTodoRequest, UpdateTodoRequest } from './todo'
export type { CreateProjectRequest } from './project'
export type { CreateUserRequest } from './user'
export type { CreateCommentRequest } from './comment'

// 統計
export type { TodoStats } from './todo'
export type { ProjectStats } from './project'

// UI状態
export type { FilterState, CompletedFilter, SortKey, SortOrder, SortState, TableColumn } from './filter'

// API
export type { ApiError } from './api'
export { ApiException } from './api'

// 定数
export { NO_PROJECT_ID, NO_PROJECT_NAME } from './project'
export { COMMENT_ERROR_MESSAGES, MAX_COMMENT_LENGTH } from './comment'
export { initialFilterState, initialSortState } from './filter'
```

---

## 9. 命名規則

| 接尾辞 | 用途 | 例 |
|--------|------|-----|
| なし | エンティティ | Todo, Project, User |
| Request | APIリクエスト | CreateTodoRequest, UpdateTodoRequest |
| Response | APIレスポンス | TodoListResponse |
| State | コンポーネント/ストア状態 | FilterState, SortState |
| Stats | 統計情報 | TodoStats, ProjectStats |
| Error | エラー型 | ApiError |

---

## 10. 更新ガイドライン

### 10.1 新規型追加時

1. 該当ファイルに型を追加
2. このカタログに型情報を追記
3. index.tsにエクスポートを追加
4. 基本情報の型定義ファイル数を更新

### 10.2 記載項目チェックリスト

- [ ] ファイルパス
- [ ] 用途の説明
- [ ] TypeScript型定義コード
- [ ] プロパティ詳細（エンティティ型の場合）
- [ ] バリデーションルール（リクエスト型の場合）
- [ ] 使用API（リクエスト型の場合）

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | <!-- YYYY-MM-DD --> | 初版作成 | <!-- 変更者名 --> |
