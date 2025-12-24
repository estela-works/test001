# ストア詳細設計書

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

Piniaストアの実装詳細（状態、ゲッター、アクション）を定義する。

### 1.2 ストア構成

| ストア | ファイル | 責務 |
|--------|---------|------|
| todoStore | stores/todoStore.ts | ToDo状態管理 |
| projectStore | stores/projectStore.ts | 案件状態管理 |
| userStore | stores/userStore.ts | ユーザー状態管理 |

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

## 3. projectStore

### 3.1 ファイル

`src/frontend/src/stores/projectStore.ts`

### 3.2 状態定義

```typescript
interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  projectStats: Record<number, ProjectStats>
  noProjectStats: ProjectStats
}
```

| 状態 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| projects | Project[] | [] | 案件リスト |
| loading | boolean | false | ローディング状態 |
| error | string \| null | null | エラーメッセージ |
| projectStats | Record<number, ProjectStats> | {} | 案件別統計 |
| noProjectStats | ProjectStats | { total: 0, completed: 0, progressRate: 0 } | 未分類統計 |

### 3.3 アクション

| アクション | 引数 | 説明 |
|-----------|------|------|
| fetchProjects | - | 案件一覧取得 |
| createProject | data: CreateProjectRequest | 案件作成 |
| deleteProject | id: number | 案件削除 |
| fetchProjectStats | id: number | 案件統計取得 |
| fetchAllStats | - | 全案件統計取得 |
| fetchNoProjectStats | - | 未分類統計取得 |

### 3.4 完全実装

```typescript
import { defineStore } from 'pinia'
import type { Project, CreateProjectRequest, ProjectStats } from '@/types/project'
import * as projectService from '@/services/projectService'

interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  projectStats: Record<number, ProjectStats>
  noProjectStats: ProjectStats
}

const defaultStats: ProjectStats = { total: 0, completed: 0, progressRate: 0 }

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    projects: [],
    loading: false,
    error: null,
    projectStats: {},
    noProjectStats: { ...defaultStats }
  }),

  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null

      try {
        this.projects = await projectService.getAll()
        await this.fetchAllStats()
      } catch (e) {
        this.error = '案件リストの読み込みに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async createProject(data: CreateProjectRequest) {
      this.error = null
      try {
        await projectService.create(data)
        await this.fetchProjects()
      } catch (e) {
        this.error = '案件の作成に失敗しました'
        throw e
      }
    },

    async deleteProject(id: number) {
      this.error = null
      try {
        await projectService.delete(id)
        await this.fetchProjects()
      } catch (e) {
        this.error = '案件の削除に失敗しました'
        throw e
      }
    },

    async fetchProjectStats(id: number) {
      try {
        const stats = await projectService.getStats(id)
        this.projectStats[id] = stats
      } catch (e) {
        this.projectStats[id] = { ...defaultStats }
      }
    },

    async fetchAllStats() {
      await Promise.all([
        ...this.projects.map(p => this.fetchProjectStats(p.id)),
        this.fetchNoProjectStats()
      ])
    },

    async fetchNoProjectStats() {
      try {
        this.noProjectStats = await projectService.getNoProjectStats()
      } catch (e) {
        this.noProjectStats = { ...defaultStats }
      }
    },

    clearError() {
      this.error = null
    }
  }
})
```

---

## 4. userStore

### 4.1 ファイル

`src/frontend/src/stores/userStore.ts`

### 4.2 状態定義

```typescript
interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}
```

| 状態 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| users | User[] | [] | ユーザーリスト |
| loading | boolean | false | ローディング状態 |
| error | string \| null | null | エラーメッセージ |

### 4.3 ゲッター

| ゲッター | 戻り値 | 説明 |
|---------|--------|------|
| userCount | number | ユーザー数 |

### 4.4 アクション

| アクション | 引数 | 説明 |
|-----------|------|------|
| fetchUsers | - | ユーザー一覧取得 |
| addUser | name: string | ユーザー追加 |
| deleteUser | id: number | ユーザー削除 |

### 4.5 完全実装

```typescript
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import * as userService from '@/services/userService'

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    userCount: (state): number => state.users.length
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        this.users = await userService.getAll()
      } catch (e) {
        this.error = 'ユーザーリストの読み込みに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async addUser(name: string) {
      this.error = null
      try {
        await userService.create(name)
        await this.fetchUsers()
      } catch (e: any) {
        if (e.status === 409) {
          this.error = '同じ名前のユーザーが既に存在します'
        } else {
          this.error = 'ユーザーの追加に失敗しました'
        }
        throw e
      }
    },

    async deleteUser(id: number) {
      this.error = null
      try {
        await userService.delete(id)
        await this.fetchUsers()
      } catch (e) {
        this.error = 'ユーザーの削除に失敗しました'
        throw e
      }
    },

    clearError() {
      this.error = null
    }
  }
})
```

---

## 5. ストア使用例

### 5.1 コンポーネントでの使用

```vue
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

// 状態の参照
const todos = computed(() => todoStore.filteredTodos)
const loading = computed(() => todoStore.loading)
const error = computed(() => todoStore.error)
const stats = computed(() => todoStore.stats)

// アクション呼び出し
onMounted(async () => {
  await todoStore.fetchTodos()
})

const handleAdd = async (data: CreateTodoRequest) => {
  await todoStore.addTodo(data)
}

const handleToggle = async (id: number) => {
  await todoStore.toggleTodo(id)
}

const handleDelete = async (id: number) => {
  await todoStore.deleteTodo(id)
}
</script>
```

### 5.2 複数ストアの使用

```vue
<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'
import { useUserStore } from '@/stores/userStore'

const todoStore = useTodoStore()
const userStore = useUserStore()

onMounted(async () => {
  await Promise.all([
    todoStore.fetchTodos(),
    userStore.fetchUsers()
  ])
})
</script>
```

---

## 6. エラーハンドリング

### 6.1 ストア内でのエラー処理

1. エラーをキャッチ
2. `error`状態にメッセージを設定
3. 例外を再スロー（呼び出し元で追加処理可能に）

```typescript
async addTodo(data: CreateTodoRequest) {
  this.error = null
  try {
    await todoService.create(data)
    await this.fetchTodos(this.currentProjectId)
  } catch (e) {
    this.error = 'ToDoの追加に失敗しました'
    throw e  // 再スロー
  }
}
```

### 6.2 コンポーネントでのエラー表示

```vue
<template>
  <ErrorMessage :message="todoStore.error" />
</template>
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
