# 型定義詳細設計書

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

チケット一覧画面のフィルタ・検索・ソート機能に関連するTypeScript型定義の詳細を定義する。

### 1.2 ファイル構成

```
src/frontend/src/types/
├── filter.ts      # フィルタ・ソート関連型（新規）
├── todo.ts        # ToDo関連型（既存）
├── user.ts        # ユーザー関連型（既存）
├── project.ts     # プロジェクト関連型（既存）
└── index.ts       # エクスポート集約（更新）
```

---

## 2. 型定義（フィルタ・ソート）

### 2.1 ファイル

`src/frontend/src/types/filter.ts`

### 2.2 型定義

```typescript
/**
 * フィルタ条件の状態
 * チケット一覧画面のフィルタパネルで使用
 */
export interface FilterState {
  /** 完了状態フィルタ: 'all' | 'pending' | 'completed' */
  completed: CompletedFilter

  /** 担当者IDフィルタ: null = すべて */
  assigneeId: number | null

  /** 案件IDフィルタ: null = すべて */
  projectId: number | null

  /** 開始日フィルタ（開始）: YYYY-MM-DD形式 */
  startDateFrom: string | null

  /** 開始日フィルタ（終了）: YYYY-MM-DD形式 */
  startDateTo: string | null

  /** 終了日フィルタ（開始）: YYYY-MM-DD形式 */
  dueDateFrom: string | null

  /** 終了日フィルタ（終了）: YYYY-MM-DD形式 */
  dueDateTo: string | null
}

/**
 * 完了状態フィルタの値
 */
export type CompletedFilter = 'all' | 'pending' | 'completed'

/**
 * ソート可能な列キー
 */
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

/**
 * ソート順序
 */
export type SortOrder = 'asc' | 'desc'

/**
 * ソート状態
 */
export interface SortState {
  /** ソートキー */
  key: SortKey

  /** ソート順序 */
  order: SortOrder
}

/**
 * テーブル列定義
 */
export interface TableColumn {
  /** 列キー（データフィールド名） */
  key: SortKey

  /** 列ラベル（表示名） */
  label: string

  /** 列幅 */
  width: string

  /** ソート可能か */
  sortable: boolean
}

/**
 * 検索・フィルタ・ソート統合状態
 * チケット一覧画面のビューで使用
 */
export interface TableViewState {
  /** 検索キーワード */
  searchKeyword: string

  /** フィルタ条件 */
  filter: FilterState

  /** ソート状態 */
  sort: SortState
}
```

---

## 3. 定数定義

### 3.1 初期状態

```typescript
/**
 * フィルタ初期状態
 */
export const initialFilterState: FilterState = {
  completed: 'all',
  assigneeId: null,
  projectId: null,
  startDateFrom: null,
  startDateTo: null,
  dueDateFrom: null,
  dueDateTo: null
}

/**
 * ソート初期状態
 */
export const initialSortState: SortState = {
  key: 'id',
  order: 'asc'
}

/**
 * テーブルビュー初期状態
 */
export const initialTableViewState: TableViewState = {
  searchKeyword: '',
  filter: initialFilterState,
  sort: initialSortState
}
```

### 3.2 テーブル列定義

```typescript
/**
 * チケット一覧テーブルの列定義
 */
export const TODO_TABLE_COLUMNS: TableColumn[] = [
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

/**
 * 完了状態フィルタの選択肢
 */
export const COMPLETED_FILTER_OPTIONS = [
  { value: 'all' as const, label: 'すべて' },
  { value: 'pending' as const, label: '未完了' },
  { value: 'completed' as const, label: '完了済み' }
]
```

---

## 4. ユーティリティ関数

### 4.1 フィルタリング関数

```typescript
import type { Todo } from './todo'
import type { FilterState } from './filter'

/**
 * チケット配列にフィルタを適用する
 * @param todos - フィルタ対象のチケット配列
 * @param filter - フィルタ条件
 * @param searchKeyword - 検索キーワード
 * @returns フィルタ後のチケット配列
 */
export function applyFilter(
  todos: Todo[],
  filter: FilterState,
  searchKeyword: string
): Todo[] {
  let result = [...todos]

  // キーワード検索
  if (searchKeyword) {
    const keyword = searchKeyword.toLowerCase()
    result = result.filter(todo =>
      todo.title.toLowerCase().includes(keyword) ||
      (todo.description?.toLowerCase().includes(keyword) ?? false)
    )
  }

  // 完了状態フィルタ
  if (filter.completed === 'pending') {
    result = result.filter(todo => !todo.completed)
  } else if (filter.completed === 'completed') {
    result = result.filter(todo => todo.completed)
  }

  // 担当者フィルタ
  if (filter.assigneeId !== null) {
    result = result.filter(todo => todo.assigneeId === filter.assigneeId)
  }

  // 案件フィルタ
  if (filter.projectId !== null) {
    result = result.filter(todo => todo.projectId === filter.projectId)
  }

  // 期間フィルタ（開始日）
  if (filter.startDateFrom) {
    result = result.filter(todo =>
      todo.startDate && todo.startDate >= filter.startDateFrom!
    )
  }
  if (filter.startDateTo) {
    result = result.filter(todo =>
      todo.startDate && todo.startDate <= filter.startDateTo!
    )
  }

  // 期間フィルタ（終了日）
  if (filter.dueDateFrom) {
    result = result.filter(todo =>
      todo.dueDate && todo.dueDate >= filter.dueDateFrom!
    )
  }
  if (filter.dueDateTo) {
    result = result.filter(todo =>
      todo.dueDate && todo.dueDate <= filter.dueDateTo!
    )
  }

  return result
}
```

### 4.2 ソート関数

```typescript
import type { Todo } from './todo'
import type { SortKey, SortOrder } from './filter'

/**
 * チケット配列をソートする
 * @param todos - ソート対象のチケット配列
 * @param key - ソートキー
 * @param order - ソート順序
 * @returns ソート後のチケット配列
 */
export function applySort(
  todos: Todo[],
  key: SortKey,
  order: SortOrder
): Todo[] {
  return [...todos].sort((a, b) => {
    const aVal = a[key as keyof Todo]
    const bVal = b[key as keyof Todo]

    // null/undefined は末尾に
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    // 比較
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}
```

### 4.3 フィルタ判定関数

```typescript
/**
 * フィルタが初期状態かどうかを判定する
 * @param filter - フィルタ状態
 * @returns 初期状態の場合true
 */
export function isFilterEmpty(filter: FilterState): boolean {
  return (
    filter.completed === 'all' &&
    filter.assigneeId === null &&
    filter.projectId === null &&
    filter.startDateFrom === null &&
    filter.startDateTo === null &&
    filter.dueDateFrom === null &&
    filter.dueDateTo === null
  )
}

/**
 * フィルタをリセットする
 * @returns 初期状態のフィルタ
 */
export function resetFilter(): FilterState {
  return { ...initialFilterState }
}
```

---

## 5. index.tsでのエクスポート

```typescript
// src/frontend/src/types/index.ts

// 既存のエクスポート
export * from './todo'
export * from './user'
export * from './project'
export * from './api'

// 新規エクスポート
export * from './filter'
```

---

## 6. 使用例

### 6.1 コンポーネントでの使用

```typescript
// TodoTableView.vue
import type {
  FilterState,
  SortKey,
  SortOrder,
  TableViewState
} from '@/types'
import {
  initialFilterState,
  applyFilter,
  applySort,
  TODO_TABLE_COLUMNS
} from '@/types'

const searchKeyword = ref('')
const filter = ref<FilterState>({ ...initialFilterState })
const sortKey = ref<SortKey>('id')
const sortOrder = ref<SortOrder>('asc')

const filteredTodos = computed(() => {
  let result = applyFilter(todoStore.todos, filter.value, searchKeyword.value)
  result = applySort(result, sortKey.value, sortOrder.value)
  return result
})
```

### 6.2 フィルタコンポーネントでの使用

```typescript
// TodoTableFilter.vue
import type { FilterState, CompletedFilter } from '@/types'
import { COMPLETED_FILTER_OPTIONS } from '@/types'

const props = defineProps<{
  filter: FilterState
}>()

const emit = defineEmits<{
  'update:filter': [filter: FilterState]
}>()

function updateCompleted(value: CompletedFilter) {
  emit('update:filter', { ...props.filter, completed: value })
}
```

---

## 7. 型定義の命名規則

| 接尾辞 | 用途 | 例 |
|--------|------|-----|
| State | 状態オブジェクト | FilterState, SortState |
| Filter | フィルタ型 | CompletedFilter |
| Key | キー型 | SortKey |
| Order | 順序型 | SortOrder |
| Column | 列定義 | TableColumn |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成 | Claude |
