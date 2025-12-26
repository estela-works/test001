# フロントエンド詳細設計書（Vue.js 3）

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | チケット一覧画面 |
| 案件ID | 20251226_チケット一覧画面 |
| 作成日 | 2025-12-26 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

チケット一覧画面（SC-005）のVueコンポーネント実装詳細を定義する。

### 1.2 対象コンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| TodoTableView.vue | 画面 | チケット一覧画面の統合 |
| TodoSearchForm.vue | フォーム | キーワード検索入力 |
| TodoTableFilter.vue | フォーム | フィルタ条件選択 |
| TodoTable.vue | テーブル | チケットテーブル表示・ソート |
| TodoTableRow.vue | 行 | テーブル行の表示 |

---

## 2. ファイル構成

### 2.1 新規・更新ファイル一覧

```
src/frontend/src/
├── views/
│   └── TodoTableView.vue           # チケット一覧画面（新規）
├── components/
│   └── todo/
│       ├── TodoSearchForm.vue      # 検索フォーム（新規）
│       ├── TodoTableFilter.vue     # フィルタ（新規）
│       ├── TodoTable.vue           # テーブル（新規）
│       └── TodoTableRow.vue        # テーブル行（新規）
├── router/
│   └── index.ts                    # ルート追加（更新）
└── types/
    └── filter.ts                   # フィルタ型定義（新規）
```

---

## 3. コンポーネント詳細設計

### 3.1 TodoTableView.vue

#### ファイル

`src/frontend/src/views/TodoTableView.vue`

#### テンプレート構造

```vue
<template>
  <div class="todo-table-view">
    <header class="page-header">
      <h1>チケット一覧</h1>
      <span v-if="projectName" class="project-badge">{{ projectName }}</span>
    </header>

    <TodoSearchForm v-model="searchKeyword" />

    <TodoTableFilter
      :filter="filter"
      :users="users"
      :projects="projects"
      @update:filter="handleFilterUpdate"
    />

    <div class="result-summary">
      表示件数: <strong>{{ filteredTodos.length }}</strong> 件
    </div>

    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <div v-else-if="filteredTodos.length === 0" class="empty-message">
      該当するチケットがありません
    </div>
    <TodoTable
      v-else
      :todos="filteredTodos"
      :sort-key="sortKey"
      :sort-order="sortOrder"
      @sort="handleSort"
      @row-click="handleRowClick"
    />

    <footer class="page-footer">
      <router-link to="/projects">← 案件一覧に戻る</router-link>
      <router-link :to="cardViewPath">カード表示に切替 →</router-link>
    </footer>

    <TodoDetailModal
      v-if="selectedTodoId !== null"
      :todo-id="selectedTodoId"
      :is-open="isModalOpen"
      @close="handleModalClose"
      @todo-updated="handleTodoUpdated"
    />
  </div>
</template>
```

#### スクリプト（Composition API）

```typescript
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import type { Todo, FilterState, SortKey, SortOrder } from '@/types'

// Stores
const todoStore = useTodoStore()
const userStore = useUserStore()
const projectStore = useProjectStore()
const route = useRoute()

// State
const searchKeyword = ref('')
const filter = ref<FilterState>({
  completed: 'all',
  assigneeId: null,
  projectId: null,
  startDateFrom: null,
  startDateTo: null,
  dueDateFrom: null,
  dueDateTo: null
})
const sortKey = ref<SortKey>('id')
const sortOrder = ref<SortOrder>('asc')
const selectedTodoId = ref<number | null>(null)
const isModalOpen = ref(false)

// Computed
const loading = computed(() => todoStore.loading)
const error = computed(() => todoStore.error)
const users = computed(() => userStore.users)
const projects = computed(() => projectStore.projects)
const projectName = computed(() => {
  const id = route.query.projectId
  if (!id) return null
  const project = projects.value.find(p => p.id === Number(id))
  return project?.name ?? null
})

const cardViewPath = computed(() => {
  const projectId = route.query.projectId
  return projectId ? `/todos?projectId=${projectId}` : '/todos'
})

// フィルタ・検索・ソート適用後のチケット一覧
const filteredTodos = computed(() => {
  let result = [...todoStore.todos]

  // キーワード検索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(todo =>
      todo.title.toLowerCase().includes(keyword) ||
      (todo.description?.toLowerCase().includes(keyword) ?? false)
    )
  }

  // 完了状態フィルタ
  if (filter.value.completed === 'pending') {
    result = result.filter(todo => !todo.completed)
  } else if (filter.value.completed === 'completed') {
    result = result.filter(todo => todo.completed)
  }

  // 担当者フィルタ
  if (filter.value.assigneeId !== null) {
    result = result.filter(todo => todo.assigneeId === filter.value.assigneeId)
  }

  // 案件フィルタ
  if (filter.value.projectId !== null) {
    result = result.filter(todo => todo.projectId === filter.value.projectId)
  }

  // 期間フィルタ（開始日）
  if (filter.value.startDateFrom) {
    result = result.filter(todo =>
      todo.startDate && todo.startDate >= filter.value.startDateFrom!
    )
  }
  if (filter.value.startDateTo) {
    result = result.filter(todo =>
      todo.startDate && todo.startDate <= filter.value.startDateTo!
    )
  }

  // 期間フィルタ（終了日）
  if (filter.value.dueDateFrom) {
    result = result.filter(todo =>
      todo.dueDate && todo.dueDate >= filter.value.dueDateFrom!
    )
  }
  if (filter.value.dueDateTo) {
    result = result.filter(todo =>
      todo.dueDate && todo.dueDate <= filter.value.dueDateTo!
    )
  }

  // ソート
  result.sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

// Event Handlers
function handleFilterUpdate(newFilter: FilterState) {
  filter.value = newFilter
}

function handleSort(payload: { key: SortKey; order: SortOrder }) {
  sortKey.value = payload.key
  sortOrder.value = payload.order
}

function handleRowClick(todoId: number) {
  selectedTodoId.value = todoId
  isModalOpen.value = true
}

function handleModalClose() {
  isModalOpen.value = false
  selectedTodoId.value = null
}

async function handleTodoUpdated() {
  await todoStore.fetchTodos(route.query.projectId as string | undefined)
}

// Lifecycle
onMounted(async () => {
  const projectId = route.query.projectId as string | undefined
  await Promise.all([
    todoStore.fetchTodos(projectId),
    userStore.fetchUsers(),
    projectStore.fetchProjects()
  ])
})

watch(() => route.query.projectId, async (newProjectId) => {
  await todoStore.fetchTodos(newProjectId as string | undefined)
})
</script>
```

#### スタイル

```vue
<style scoped>
.todo-table-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
}

.project-badge {
  background-color: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.result-summary {
  margin: 16px 0;
  color: #666;
}

.empty-message {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.page-footer a {
  color: #007bff;
  text-decoration: none;
}

.page-footer a:hover {
  text-decoration: underline;
}
</style>
```

#### 状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| searchKeyword | Ref\<string\> | '' | 検索キーワード |
| filter | Ref\<FilterState\> | (初期状態) | フィルタ条件 |
| sortKey | Ref\<SortKey\> | 'id' | ソートキー |
| sortOrder | Ref\<SortOrder\> | 'asc' | ソート順序 |
| selectedTodoId | Ref\<number \| null\> | null | 選択中のチケットID |
| isModalOpen | Ref\<boolean\> | false | モーダル開閉状態 |

#### 関数一覧

| 関数名 | 引数 | 戻り値 | 概要 |
|--------|------|--------|------|
| handleFilterUpdate | FilterState | void | フィルタ条件更新 |
| handleSort | { key, order } | void | ソート条件更新 |
| handleRowClick | number | void | 行クリック時にモーダル表示 |
| handleModalClose | なし | void | モーダルを閉じる |
| handleTodoUpdated | なし | Promise\<void\> | チケット更新後に再取得 |

---

### 3.2 TodoSearchForm.vue

#### ファイル

`src/frontend/src/components/todo/TodoSearchForm.vue`

#### テンプレート構造

```vue
<template>
  <div class="search-form">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      placeholder="タイトル・説明で検索..."
      class="search-input"
    />
  </div>
</template>
```

#### スクリプト

```typescript
<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
```

#### スタイル

```vue
<style scoped>
.search-form {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}
</style>
```

#### Props定義

| Prop名 | 型 | 必須 | デフォルト値 | 説明 |
|--------|-----|------|------------|------|
| modelValue | string | - | - | 検索キーワード（v-model） |

#### Emits定義

| イベント名 | ペイロード型 | タイミング | 説明 |
|-----------|------------|-----------|------|
| update:modelValue | string | 入力時 | 検索キーワード変更 |

---

### 3.3 TodoTableFilter.vue

#### ファイル

`src/frontend/src/components/todo/TodoTableFilter.vue`

#### テンプレート構造

```vue
<template>
  <div class="table-filter">
    <div class="filter-row">
      <div class="filter-item">
        <label>状態:</label>
        <select :value="filter.completed" @change="updateFilter('completed', $event)">
          <option value="all">すべて</option>
          <option value="pending">未完了</option>
          <option value="completed">完了済み</option>
        </select>
      </div>

      <div class="filter-item">
        <label>担当者:</label>
        <select :value="filter.assigneeId ?? ''" @change="updateFilter('assigneeId', $event)">
          <option value="">すべて</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label>案件:</label>
        <select :value="filter.projectId ?? ''" @change="updateFilter('projectId', $event)">
          <option value="">すべて</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="filter-row">
      <div class="filter-item date-range">
        <label>開始日:</label>
        <input
          type="date"
          :value="filter.startDateFrom ?? ''"
          @change="updateFilter('startDateFrom', $event)"
        />
        <span>～</span>
        <input
          type="date"
          :value="filter.startDateTo ?? ''"
          @change="updateFilter('startDateTo', $event)"
        />
      </div>

      <div class="filter-item date-range">
        <label>終了日:</label>
        <input
          type="date"
          :value="filter.dueDateFrom ?? ''"
          @change="updateFilter('dueDateFrom', $event)"
        />
        <span>～</span>
        <input
          type="date"
          :value="filter.dueDateTo ?? ''"
          @change="updateFilter('dueDateTo', $event)"
        />
      </div>

      <button class="clear-button" @click="clearFilters">クリア</button>
    </div>
  </div>
</template>
```

#### スクリプト

```typescript
<script setup lang="ts">
import type { FilterState, User, Project } from '@/types'

const props = defineProps<{
  filter: FilterState
  users: User[]
  projects: Project[]
}>()

const emit = defineEmits<{
  'update:filter': [filter: FilterState]
}>()

function updateFilter(key: keyof FilterState, event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  let value: string | number | null = target.value

  // 数値変換が必要なフィールド
  if (key === 'assigneeId' || key === 'projectId') {
    value = value === '' ? null : Number(value)
  }
  // 日付フィールド
  else if (key.includes('Date')) {
    value = value === '' ? null : value
  }

  emit('update:filter', {
    ...props.filter,
    [key]: value
  })
}

function clearFilters() {
  emit('update:filter', {
    completed: 'all',
    assigneeId: null,
    projectId: null,
    startDateFrom: null,
    startDateTo: null,
    dueDateFrom: null,
    dueDateTo: null
  })
}
</script>
```

#### スタイル

```vue
<style scoped>
.table-filter {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-row + .filter-row {
  margin-top: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #555;
  white-space: nowrap;
}

.filter-item select,
.filter-item input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range span {
  color: #666;
}

.clear-button {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
}

.clear-button:hover {
  background-color: #5a6268;
}
</style>
```

#### Props定義

| Prop名 | 型 | 必須 | デフォルト値 | 説明 |
|--------|-----|------|------------|------|
| filter | FilterState | ✓ | - | フィルタ状態 |
| users | User[] | ✓ | - | ユーザー一覧 |
| projects | Project[] | ✓ | - | 案件一覧 |

#### Emits定義

| イベント名 | ペイロード型 | タイミング | 説明 |
|-----------|------------|-----------|------|
| update:filter | FilterState | フィルタ変更時 | フィルタ条件を親に通知 |

---

### 3.4 TodoTable.vue

#### ファイル

`src/frontend/src/components/todo/TodoTable.vue`

#### テンプレート構造

```vue
<template>
  <div class="todo-table-wrapper">
    <table class="todo-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="{ sortable: column.sortable, active: sortKey === column.key }"
            :style="{ width: column.width }"
            @click="column.sortable && handleHeaderClick(column.key)"
          >
            {{ column.label }}
            <span v-if="column.sortable && sortKey === column.key" class="sort-icon">
              {{ sortOrder === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <TodoTableRow
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @click="$emit('rowClick', todo.id)"
        />
      </tbody>
    </table>
  </div>
</template>
```

#### スクリプト

```typescript
<script setup lang="ts">
import type { Todo, SortKey, SortOrder } from '@/types'
import TodoTableRow from './TodoTableRow.vue'

interface Column {
  key: SortKey
  label: string
  width: string
  sortable: boolean
}

const columns: Column[] = [
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

const props = defineProps<{
  todos: Todo[]
  sortKey?: SortKey
  sortOrder?: SortOrder
}>()

const emit = defineEmits<{
  sort: [payload: { key: SortKey; order: SortOrder }]
  rowClick: [todoId: number]
}>()

function handleHeaderClick(key: SortKey) {
  const newOrder: SortOrder =
    props.sortKey === key && props.sortOrder === 'asc' ? 'desc' : 'asc'
  emit('sort', { key, order: newOrder })
}
</script>
```

#### スタイル

```vue
<style scoped>
.todo-table-wrapper {
  overflow-x: auto;
}

.todo-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.todo-table th {
  background-color: #f8f9fa;
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
}

.todo-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.todo-table th.sortable:hover {
  background-color: #e9ecef;
}

.todo-table th.active {
  color: #007bff;
}

.sort-icon {
  margin-left: 4px;
  font-size: 10px;
}
</style>
```

#### Props定義

| Prop名 | 型 | 必須 | デフォルト値 | 説明 |
|--------|-----|------|------------|------|
| todos | Todo[] | ✓ | - | 表示するチケット配列 |
| sortKey | SortKey | - | undefined | 現在のソートキー |
| sortOrder | SortOrder | - | undefined | ソート順序 |

#### Emits定義

| イベント名 | ペイロード型 | タイミング | 説明 |
|-----------|------------|-----------|------|
| sort | { key: SortKey, order: SortOrder } | ヘッダークリック時 | ソート変更 |
| rowClick | number | 行クリック時 | チケットID通知 |

---

### 3.5 TodoTableRow.vue

#### ファイル

`src/frontend/src/components/todo/TodoTableRow.vue`

#### テンプレート構造

```vue
<template>
  <tr class="todo-row" :class="{ completed: todo.completed }" @click="$emit('click')">
    <td class="cell-id">{{ todo.id }}</td>
    <td class="cell-title">{{ todo.title }}</td>
    <td class="cell-description">{{ truncatedDescription }}</td>
    <td class="cell-assignee">{{ todo.assigneeName ?? '-' }}</td>
    <td class="cell-project">{{ projectName }}</td>
    <td class="cell-date">{{ formatDate(todo.startDate) }}</td>
    <td class="cell-date">{{ formatDate(todo.dueDate) }}</td>
    <td class="cell-status">
      <span :class="['status-badge', todo.completed ? 'completed' : 'pending']">
        {{ todo.completed ? '完了' : '未完了' }}
      </span>
    </td>
    <td class="cell-date">{{ formatDate(todo.createdAt) }}</td>
  </tr>
</template>
```

#### スクリプト

```typescript
<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import type { Todo } from '@/types'

const props = defineProps<{
  todo: Todo
}>()

defineEmits<{
  click: []
}>()

const projectStore = useProjectStore()

const truncatedDescription = computed(() => {
  if (!props.todo.description) return '-'
  return props.todo.description.length > 30
    ? props.todo.description.substring(0, 30) + '...'
    : props.todo.description
})

const projectName = computed(() => {
  if (!props.todo.projectId) return '-'
  const project = projectStore.projects.find(p => p.id === props.todo.projectId)
  return project?.name ?? '-'
})

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>
```

#### スタイル

```vue
<style scoped>
.todo-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.todo-row:hover {
  background-color: #f0f4f8;
}

.todo-row.completed {
  opacity: 0.6;
}

.todo-row.completed .cell-title {
  text-decoration: line-through;
  color: #6c757d;
}

.todo-row td {
  padding: 12px 8px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
}

.cell-id {
  text-align: right;
  color: #666;
}

.cell-title {
  font-weight: 500;
}

.cell-description {
  color: #666;
  font-size: 13px;
}

.cell-assignee,
.cell-project {
  white-space: nowrap;
}

.cell-date {
  white-space: nowrap;
  color: #666;
  font-size: 13px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}
</style>
```

#### Props定義

| Prop名 | 型 | 必須 | デフォルト値 | 説明 |
|--------|-----|------|------------|------|
| todo | Todo | ✓ | - | 表示するチケット |

#### Emits定義

| イベント名 | ペイロード型 | タイミング | 説明 |
|-----------|------------|-----------|------|
| click | なし | 行クリック時 | クリックイベント通知 |

---

## 4. 型定義

### 4.1 filter.ts

```typescript
// src/frontend/src/types/filter.ts

export interface FilterState {
  completed: 'all' | 'pending' | 'completed'
  assigneeId: number | null
  projectId: number | null
  startDateFrom: string | null  // YYYY-MM-DD
  startDateTo: string | null    // YYYY-MM-DD
  dueDateFrom: string | null    // YYYY-MM-DD
  dueDateTo: string | null      // YYYY-MM-DD
}

export type SortKey =
  | 'id'
  | 'title'
  | 'description'
  | 'assigneeName'
  | 'projectId'
  | 'startDate'
  | 'dueDate'
  | 'completed'
  | 'createdAt'

export type SortOrder = 'asc' | 'desc'

export const initialFilterState: FilterState = {
  completed: 'all',
  assigneeId: null,
  projectId: null,
  startDateFrom: null,
  startDateTo: null,
  dueDateFrom: null,
  dueDateTo: null
}
```

---

## 5. ルーター設定

### 5.1 router/index.ts への追加

```typescript
// 追加するルート
{
  path: '/todos/table',
  name: 'TodoTable',
  component: () => import('@/views/TodoTableView.vue')
}
```

---

## 6. API連携

### 6.1 API呼び出し一覧

| 操作 | API | メソッド | 呼び出し元 | タイミング |
|------|-----|---------|-----------|-----------|
| チケット一覧取得 | /api/todos | GET | todoStore.fetchTodos() | 画面表示時 |
| ユーザー一覧取得 | /api/users | GET | userStore.fetchUsers() | 画面表示時 |
| 案件一覧取得 | /api/projects | GET | projectStore.fetchProjects() | 画面表示時 |
| チケット詳細取得 | /api/todos/{id} | GET | モーダル表示時 | 行クリック時 |

### 6.2 エラーハンドリング

| エラー種別 | 対応 |
|-----------|------|
| ネットワークエラー | ErrorMessageコンポーネントで表示 |
| 404 Not Found | 「データが見つかりません」と表示 |

---

## 7. パフォーマンス考慮事項

1. **フロントエンドフィルタ**: 全件取得後にcomputedでフィルタ。データ量が少ないため問題なし
2. **仮想スクロール**: 現時点では不要。将来的にデータ量が増えた場合に検討
3. **debounce**: 検索入力にはdebounceを適用（300ms）を検討

---

## 8. 実装時の注意事項

1. **既存コンポーネントの活用**: TodoDetailModal、LoadingSpinner、ErrorMessageは既存を使用
2. **型安全性**: すべてのProps・Emits・Storeは型定義を使用
3. **レスポンシブ**: テーブルはhorizontal scrollで対応
4. **アクセシビリティ**: 行にtabindex、キーボード操作対応

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成 | Claude |
