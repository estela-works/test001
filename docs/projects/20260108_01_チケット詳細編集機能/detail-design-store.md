# ストア詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | チケット詳細編集機能 |
| 案件ID | 20260108_01_チケット詳細編集機能 |
| 作成日 | 2026-01-08 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |
| 関連型定義設計書 | [detail-design-types.md](./detail-design-types.md) |
| 関連コンポーネント設計書 | [detail-design-frontend.md](./detail-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

チケット更新機能に関連するPiniaストアとサービスの実装詳細を定義する。

### 1.2 ストア構成

| ストア | ファイル | 責務 | 変更 |
|--------|---------|------|------|
| todoStore | stores/todoStore.ts | ToDo状態管理 | **改修**（updateTodo追加） |

### 1.3 サービス構成

| サービス | ファイル | 責務 | 変更 |
|---------|---------|------|------|
| todoService | services/todoService.ts | ToDo API通信 | **改修**（update追加） |

---

## 2. サービス実装（todoService.ts）

### 2.1 ファイル

`src/frontend/src/services/todoService.ts`

### 2.2 追加関数

```typescript
import { get, post, put, patch, del } from './apiClient'
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types'

// ... 既存のコード ...

/**
 * ToDo更新
 * @param id ToDo ID
 * @param data 更新データ
 */
export async function update(id: number, data: UpdateTodoRequest): Promise<Todo> {
  return put<Todo>(`/todos/${id}`, data)
}
```

### 2.3 apiClient確認

`apiClient.ts`に`put`関数が必要。既存の実装を確認し、なければ追加。

```typescript
// src/frontend/src/services/apiClient.ts

/**
 * PUTリクエスト
 */
export async function put<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : undefined
  })

  if (!response.ok) {
    throw await createApiError(response)
  }

  return response.json()
}
```

---

## 3. ストア実装（todoStore.ts）

### 3.1 ファイル

`src/frontend/src/stores/todoStore.ts`

### 3.2 追加Action

```typescript
import { defineStore } from 'pinia'
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo'
import * as todoService from '@/services/todoService'

interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
  filter: 'all' | 'pending' | 'completed'
  currentProjectId: string | null
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    loading: false,
    error: null,
    filter: 'all',
    currentProjectId: null
  }),

  getters: {
    // ... 既存のgetters ...
  },

  actions: {
    // ... 既存のactions ...

    /**
     * ToDoを更新
     * @param id ToDo ID
     * @param data 更新データ
     */
    async updateTodo(id: number, data: UpdateTodoRequest) {
      this.error = null
      try {
        await todoService.update(id, data)
        await this.fetchTodos(this.currentProjectId)
      } catch (e) {
        this.error = 'ToDoの更新に失敗しました'
        throw e
      }
    },

    // ... 既存のactions ...
  }
})
```

---

## 4. 状態管理方針

### 4.1 State設計指針

- **単一責任**: todoStoreはToDo関連の状態のみを管理
- **正規化**: todos配列で一覧を保持、個別取得は配列から検索
- **最小化**: 更新時は一覧を再取得して最新状態を反映

### 4.2 Actions設計指針

- **非同期処理**: API呼び出しはサービス経由で実行
- **エラーハンドリング**: try-catchでエラーを捕捉し、error状態を更新
- **一覧再取得**: 更新後はfetchTodosで最新データを取得

---

## 5. API連携仕様

### 5.1 APIエンドポイントマッピング

| Action | HTTPメソッド | エンドポイント | 説明 |
|--------|-------------|---------------|------|
| updateTodo | PUT | `/api/todos/{id}` | チケット更新 |

### 5.2 リクエストボディ

```json
{
  "title": "更新後タイトル",
  "description": "更新後説明",
  "startDate": "2026-01-01",
  "dueDate": "2026-01-31",
  "assigneeId": 1
}
```

### 5.3 レスポンス

**成功時（200）**:
```json
{
  "id": 1,
  "title": "更新後タイトル",
  "description": "更新後説明",
  "completed": false,
  "startDate": "2026-01-01",
  "dueDate": "2026-01-31",
  "projectId": null,
  "assigneeId": 1,
  "assigneeName": "山田太郎",
  "createdAt": "2026-01-08T10:00:00"
}
```

### 5.4 エラーハンドリング

| HTTPステータス | エラーメッセージ | 処理 |
|--------------|----------------|------|
| 400 | Assignee not found | エラーメッセージを表示 |
| 404 | Todo not found | エラーメッセージを表示 |
| 500 | サーバーエラー | 「更新に失敗しました」と表示 |

---

## 6. 使用例

### 6.1 コンポーネントでのストア利用

```vue
<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'
import type { UpdateTodoRequest } from '@/types'

const todoStore = useTodoStore()

// チケットを更新
async function handleSave(request: UpdateTodoRequest) {
  try {
    await todoStore.updateTodo(todoId, request)
    // 成功時の処理
  } catch (error) {
    // エラー時の処理（todoStore.errorを参照）
    console.error(todoStore.error)
  }
}
</script>
```

---

## 7. 実装変更箇所まとめ

### 7.1 todoService.ts

| 変更種別 | 内容 |
|---------|------|
| 追加 | `update(id: number, data: UpdateTodoRequest): Promise<Todo>` |

### 7.2 apiClient.ts

| 変更種別 | 内容 |
|---------|------|
| 確認/追加 | `put<T>(endpoint: string, data?: unknown): Promise<T>` |

### 7.3 todoStore.ts

| 変更種別 | 内容 |
|---------|------|
| 追加 | `updateTodo(id: number, data: UpdateTodoRequest)` アクション |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2026-01-08 | 初版作成 | Claude |
