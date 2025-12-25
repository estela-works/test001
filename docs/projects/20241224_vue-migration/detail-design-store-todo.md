# ストア詳細設計書 - todoStore

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |
| 親文書 | [detail-design-store.md](./detail-design-store.md) |

---

## 2. todoStore

### 2.1 ファイル

`src/frontend/src/stores/todoStore.ts`

### 2.2 状態定義

```typescript
interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
  filter: 'all' | 'pending' | 'completed'
  currentProjectId: string | null
}
```

| 状態 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| todos | Todo[] | [] | ToDoリスト |
| loading | boolean | false | ローディング状態 |
| error | string \| null | null | エラーメッセージ |
| filter | string | 'all' | フィルタ状態 |
| currentProjectId | string \| null | null | 現在の案件ID |

### 2.3 ゲッター

```typescript
getters: {
  // フィルタ適用後のToDo
  filteredTodos: (state): Todo[] => {
    switch (state.filter) {
      case 'pending':
        return state.todos.filter(t => !t.completed)
      case 'completed':
        return state.todos.filter(t => t.completed)
      default:
        return state.todos
    }
  },

  // 統計情報
  stats: (state): { total: number; completed: number; pending: number } => {
    const total = state.todos.length
    const completed = state.todos.filter(t => t.completed).length
    return {
      total,
      completed,
      pending: total - completed
    }
  }
}
```

| ゲッター | 戻り値 | 説明 |
|---------|--------|------|
| filteredTodos | Todo[] | フィルタ適用後のリスト |
| stats | object | 統計情報 |

### 2.4 アクション

```typescript
actions: {
  // ToDo一覧取得
  async fetchTodos(projectId?: string | null) {
    this.loading = true
    this.error = null
    this.currentProjectId = projectId ?? null

    try {
      this.todos = await todoService.getAll(projectId)
    } catch (e) {
      this.error = 'ToDoリストの読み込みに失敗しました'
      throw e
    } finally {
      this.loading = false
    }
  },

  // ToDo追加
  async addTodo(data: CreateTodoRequest) {
    this.error = null
    try {
      await todoService.create(data)
      await this.fetchTodos(this.currentProjectId)
    } catch (e) {
      this.error = 'ToDoの追加に失敗しました'
      throw e
    }
  },

  // 完了状態切替
  async toggleTodo(id: number) {
    this.error = null
    try {
      await todoService.toggle(id)
      await this.fetchTodos(this.currentProjectId)
    } catch (e) {
      this.error = 'ToDoの更新に失敗しました'
      throw e
    }
  },

  // ToDo削除
  async deleteTodo(id: number) {
    this.error = null
    try {
      await todoService.delete(id)
      await this.fetchTodos(this.currentProjectId)
    } catch (e) {
      this.error = 'ToDoの削除に失敗しました'
      throw e
    }
  },

  // フィルタ設定
  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter = filter
  },

  // エラークリア
  clearError() {
    this.error = null
  }
}
```

| アクション | 引数 | 説明 |
|-----------|------|------|
| fetchTodos | projectId?: string | ToDo一覧取得 |
| addTodo | data: CreateTodoRequest | ToDo追加 |
| toggleTodo | id: number | 完了状態切替 |
| deleteTodo | id: number | ToDo削除 |
| setFilter | filter: string | フィルタ設定 |
| clearError | - | エラークリア |

### 2.5 完全実装

```typescript
import { defineStore } from 'pinia'
import type { Todo, CreateTodoRequest } from '@/types/todo'
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
    filteredTodos: (state): Todo[] => {
      switch (state.filter) {
        case 'pending':
          return state.todos.filter(t => !t.completed)
        case 'completed':
          return state.todos.filter(t => t.completed)
        default:
          return state.todos
      }
    },

    stats: (state) => {
      const total = state.todos.length
      const completed = state.todos.filter(t => t.completed).length
      return {
        total,
        completed,
        pending: total - completed
      }
    }
  },

  actions: {
    async fetchTodos(projectId?: string | null) {
      this.loading = true
      this.error = null
      this.currentProjectId = projectId ?? null

      try {
        this.todos = await todoService.getAll(projectId)
      } catch (e) {
        this.error = 'ToDoリストの読み込みに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async addTodo(data: CreateTodoRequest) {
      this.error = null
      try {
        await todoService.create(data)
        await this.fetchTodos(this.currentProjectId)
      } catch (e) {
        this.error = 'ToDoの追加に失敗しました'
        throw e
      }
    },

    async toggleTodo(id: number) {
      this.error = null
      try {
        await todoService.toggle(id)
        await this.fetchTodos(this.currentProjectId)
      } catch (e) {
        this.error = 'ToDoの更新に失敗しました'
        throw e
      }
    },

    async deleteTodo(id: number) {
      this.error = null
      try {
        await todoService.delete(id)
        await this.fetchTodos(this.currentProjectId)
      } catch (e) {
        this.error = 'ToDoの削除に失敗しました'
        throw e
      }
    },

    setFilter(filter: 'all' | 'pending' | 'completed') {
      this.filter = filter
    },

    clearError() {
      this.error = null
    }
  }
})
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
