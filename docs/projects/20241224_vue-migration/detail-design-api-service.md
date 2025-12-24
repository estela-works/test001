# APIサービス詳細設計書

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

フロントエンドからバックエンドAPIへの通信レイヤーの実装詳細を定義する。

### 1.2 ファイル構成

```
src/frontend/src/services/
├── apiClient.ts       # 共通HTTPクライアント
├── todoService.ts     # ToDo API
├── projectService.ts  # 案件 API
└── userService.ts     # ユーザー API
```

---

## 2. 共通HTTPクライアント

### 2.1 ファイル

`src/frontend/src/services/apiClient.ts`

### 2.2 実装

```typescript
import { ApiException } from '@/types'

const BASE_URL = '/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

/**
 * 共通HTTPクライアント
 * Fetch APIのラッパー
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const url = `${BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorText = await response.text()
      throw new ApiException(
        errorText || `HTTP error ${response.status}`,
        response.status
      )
    }

    // 204 No Content の場合
    if (response.status === 204) {
      return undefined as T
    }

    // JSONレスポンスをパース
    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof ApiException) {
      throw error
    }
    // ネットワークエラー
    throw new ApiException('ネットワークエラーが発生しました', 0)
  }
}

/**
 * GETリクエスト
 */
export function get<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'GET' })
}

/**
 * POSTリクエスト
 */
export function post<T>(endpoint: string, body: unknown): Promise<T> {
  return apiClient<T>(endpoint, { method: 'POST', body })
}

/**
 * PUTリクエスト
 */
export function put<T>(endpoint: string, body: unknown): Promise<T> {
  return apiClient<T>(endpoint, { method: 'PUT', body })
}

/**
 * PATCHリクエスト
 */
export function patch<T>(endpoint: string, body?: unknown): Promise<T> {
  return apiClient<T>(endpoint, { method: 'PATCH', body })
}

/**
 * DELETEリクエスト
 */
export function del<T>(endpoint: string): Promise<T> {
  return apiClient<T>(endpoint, { method: 'DELETE' })
}
```

### 2.3 機能

| 機能 | 説明 |
|------|------|
| ベースURL設定 | `/api`を自動付与 |
| Content-Type | `application/json`を自動設定 |
| JSONシリアライズ | body自動変換 |
| エラーハンドリング | ApiExceptionにラップ |
| 204対応 | No Contentの場合undefined返却 |

---

## 3. TodoService

### 3.1 ファイル

`src/frontend/src/services/todoService.ts`

### 3.2 実装

```typescript
import { get, post, patch, del } from './apiClient'
import type { Todo, CreateTodoRequest } from '@/types'

/**
 * ToDo一覧取得
 * @param projectId 案件ID（オプション）。'none'は未分類
 */
export async function getAll(projectId?: string | null): Promise<Todo[]> {
  let endpoint = '/todos'
  if (projectId) {
    endpoint += `?projectId=${encodeURIComponent(projectId)}`
  }
  return get<Todo[]>(endpoint)
}

/**
 * ToDo詳細取得
 * @param id ToDo ID
 */
export async function getById(id: number): Promise<Todo> {
  return get<Todo>(`/todos/${id}`)
}

/**
 * ToDo作成
 * @param data 作成データ
 */
export async function create(data: CreateTodoRequest): Promise<Todo> {
  return post<Todo>('/todos', data)
}

/**
 * ToDo完了状態切替
 * @param id ToDo ID
 */
export async function toggle(id: number): Promise<Todo> {
  return patch<Todo>(`/todos/${id}/toggle`)
}

/**
 * ToDo削除
 * @param id ToDo ID
 */
export async function deleteTodo(id: number): Promise<void> {
  return del<void>(`/todos/${id}`)
}

// エイリアス
export { deleteTodo as delete }
```

### 3.3 API対応表

| メソッド | エンドポイント | HTTP | 戻り値 |
|---------|---------------|------|--------|
| getAll | /todos?projectId={id} | GET | Todo[] |
| getById | /todos/{id} | GET | Todo |
| create | /todos | POST | Todo |
| toggle | /todos/{id}/toggle | PATCH | Todo |
| delete | /todos/{id} | DELETE | void |

---

## 4. ProjectService

### 4.1 ファイル

`src/frontend/src/services/projectService.ts`

### 4.2 実装

```typescript
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
  const completed = todos.filter(t => t.completed).length
  const progressRate = total > 0 ? Math.round((completed / total) * 100) : 0
  return { total, completed, progressRate }
}

// エイリアス
export { deleteProject as delete }
```

### 4.3 API対応表

| メソッド | エンドポイント | HTTP | 戻り値 |
|---------|---------------|------|--------|
| getAll | /projects | GET | Project[] |
| getById | /projects/{id} | GET | Project |
| create | /projects | POST | Project |
| delete | /projects/{id} | DELETE | void |
| getStats | /projects/{id}/stats | GET | ProjectStats |
| getNoProjectStats | /todos?projectId=none | GET | ProjectStats |

---

## 5. UserService

### 5.1 ファイル

`src/frontend/src/services/userService.ts`

### 5.2 実装

```typescript
import { get, post, del } from './apiClient'
import type { User } from '@/types'

/**
 * ユーザー一覧取得
 */
export async function getAll(): Promise<User[]> {
  return get<User[]>('/users')
}

/**
 * ユーザー作成
 * @param name ユーザー名
 */
export async function create(name: string): Promise<User> {
  return post<User>('/users', { name })
}

/**
 * ユーザー削除
 * @param id ユーザーID
 */
export async function deleteUser(id: number): Promise<void> {
  return del<void>(`/users/${id}`)
}

// エイリアス
export { deleteUser as delete }
```

### 5.3 API対応表

| メソッド | エンドポイント | HTTP | 戻り値 |
|---------|---------------|------|--------|
| getAll | /users | GET | User[] |
| create | /users | POST | User |
| delete | /users/{id} | DELETE | void |

---

## 6. エラーハンドリング

### 6.1 エラー種別

| ステータス | 意味 | 対応 |
|-----------|------|------|
| 0 | ネットワークエラー | 「ネットワークエラーが発生しました」 |
| 400 | バリデーションエラー | エラーメッセージを表示 |
| 404 | リソースなし | 「データが見つかりません」 |
| 409 | 重複エラー | 「既に存在します」 |
| 500 | サーバーエラー | 「サーバーエラーが発生しました」 |

### 6.2 使用例

```typescript
import * as todoService from '@/services/todoService'
import { ApiException } from '@/types'

try {
  await todoService.create({ title: 'テスト' })
} catch (error) {
  if (error instanceof ApiException) {
    switch (error.status) {
      case 400:
        console.error('入力エラー:', error.message)
        break
      case 0:
        console.error('ネットワークエラー')
        break
      default:
        console.error('エラー:', error.message)
    }
  }
}
```

---

## 7. 使用例

### 7.1 ストアからの呼び出し

```typescript
// stores/todoStore.ts
import * as todoService from '@/services/todoService'

actions: {
  async fetchTodos(projectId?: string | null) {
    this.loading = true
    try {
      this.todos = await todoService.getAll(projectId)
    } catch (e) {
      this.error = 'ToDoリストの読み込みに失敗しました'
    } finally {
      this.loading = false
    }
  }
}
```

### 7.2 コンポーネントからの直接呼び出し

```typescript
// 一時的なデータ取得（ストアに保存不要な場合）
import * as projectService from '@/services/projectService'

const projectName = ref('')

onMounted(async () => {
  if (projectId) {
    const project = await projectService.getById(Number(projectId))
    projectName.value = project.name
  }
})
```

---

## 8. テスト用モック

### 8.1 Vitestでのモック

```typescript
// tests/services/todoService.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as todoService from '@/services/todoService'
import * as apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient')

describe('todoService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAll should fetch todos', async () => {
    const mockTodos = [{ id: 1, title: 'Test', completed: false }]
    vi.mocked(apiClient.get).mockResolvedValue(mockTodos)

    const result = await todoService.getAll()

    expect(apiClient.get).toHaveBeenCalledWith('/todos')
    expect(result).toEqual(mockTodos)
  })

  it('getAll with projectId should include query param', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([])

    await todoService.getAll('123')

    expect(apiClient.get).toHaveBeenCalledWith('/todos?projectId=123')
  })
})
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
