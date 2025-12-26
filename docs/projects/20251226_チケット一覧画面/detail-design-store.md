# ストア詳細設計書

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

チケット一覧画面のフィルタ・検索・ソート機能に関連するPiniaストアの実装詳細を定義する。

### 1.2 変更有無

| 項目 | 状態 |
|------|------|
| ストア新規作成 | **なし** |
| ストア変更 | **なし** |

### 1.3 変更なしの理由

本案件では既存のストアを変更せず、以下の方針で実装する:

1. **フィルタ・検索・ソート状態**: ビューコンポーネント（TodoTableView.vue）のローカルstate（ref）で管理
2. **チケットデータ**: 既存のtodoStoreをそのまま利用
3. **ユーザー・プロジェクトデータ**: 既存のuserStore、projectStoreをそのまま利用

この方針を採用する理由:
- フィルタ・検索状態は画面固有であり、他の画面と共有する必要がない
- 既存ストアのAPIで必要なデータはすべて取得可能
- ストアを追加すると複雑性が増し、保守コストが上がる

---

## 2. 利用する既存ストア

### 2.1 todoStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/todoStore.ts` |
| 利用目的 | チケット一覧データの取得・更新 |

#### 利用するState

| State | 型 | 説明 |
|-------|-----|------|
| todos | Todo[] | チケット一覧 |
| loading | boolean | ローディング状態 |
| error | string \| null | エラーメッセージ |

#### 利用するActions

| Action | 説明 | 利用シーン |
|--------|------|-----------|
| fetchTodos() | 全チケット取得 | 画面初期表示時 |
| fetchTodosByProject(projectId) | 案件別チケット取得 | projectIdパラメータ付きアクセス時 |
| toggleTodo(id) | 完了状態切替 | テーブル行のチェックボックス操作 |
| deleteTodo(id) | チケット削除 | テーブル行の削除ボタン操作 |

### 2.2 userStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/userStore.ts` |
| 利用目的 | 担当者フィルタの選択肢取得 |

#### 利用するState

| State | 型 | 説明 |
|-------|-----|------|
| users | User[] | ユーザー一覧 |

#### 利用するActions

| Action | 説明 | 利用シーン |
|--------|------|-----------|
| fetchUsers() | 全ユーザー取得 | 画面初期表示時 |

### 2.3 projectStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/projectStore.ts` |
| 利用目的 | 案件フィルタの選択肢取得、案件名表示 |

#### 利用するState

| State | 型 | 説明 |
|-------|-----|------|
| projects | Project[] | プロジェクト一覧 |

#### 利用するActions

| Action | 説明 | 利用シーン |
|--------|------|-----------|
| fetchProjects() | 全プロジェクト取得 | 画面初期表示時 |

---

## 3. ビューコンポーネントでの状態管理

### 3.1 概要

フィルタ・検索・ソート状態はTodoTableView.vueのローカルstateとして管理する。

### 3.2 状態定義

```typescript
// TodoTableView.vue

import { ref, computed } from 'vue'
import type { FilterState, SortKey, SortOrder } from '@/types'
import { initialFilterState } from '@/types'

// ========================================
// ローカルState
// ========================================

/** 検索キーワード */
const searchKeyword = ref<string>('')

/** フィルタ条件 */
const filter = ref<FilterState>({ ...initialFilterState })

/** ソートキー */
const sortKey = ref<SortKey>('id')

/** ソート順序 */
const sortOrder = ref<SortOrder>('asc')

// ========================================
// Computed（算出プロパティ）
// ========================================

/**
 * フィルタ・検索・ソート適用後のチケット一覧
 */
const filteredAndSortedTodos = computed(() => {
  let result = [...todoStore.todos]

  // 1. キーワード検索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(todo =>
      todo.title.toLowerCase().includes(keyword) ||
      (todo.description?.toLowerCase().includes(keyword) ?? false)
    )
  }

  // 2. 完了状態フィルタ
  if (filter.value.completed === 'pending') {
    result = result.filter(todo => !todo.completed)
  } else if (filter.value.completed === 'completed') {
    result = result.filter(todo => todo.completed)
  }

  // 3. 担当者フィルタ
  if (filter.value.assigneeId !== null) {
    result = result.filter(todo => todo.assigneeId === filter.value.assigneeId)
  }

  // 4. 案件フィルタ
  if (filter.value.projectId !== null) {
    result = result.filter(todo => todo.projectId === filter.value.projectId)
  }

  // 5. 期間フィルタ（開始日）
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

  // 6. 期間フィルタ（終了日）
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

  // 7. ソート
  result.sort((a, b) => {
    const aVal = a[sortKey.value as keyof typeof a]
    const bVal = b[sortKey.value as keyof typeof b]

    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

/**
 * フィルタがアクティブかどうか
 */
const isFilterActive = computed(() => {
  return (
    filter.value.completed !== 'all' ||
    filter.value.assigneeId !== null ||
    filter.value.projectId !== null ||
    filter.value.startDateFrom !== null ||
    filter.value.startDateTo !== null ||
    filter.value.dueDateFrom !== null ||
    filter.value.dueDateTo !== null
  )
})

/**
 * 検索・フィルタ後の件数
 */
const filteredCount = computed(() => filteredAndSortedTodos.value.length)

/**
 * 全件数
 */
const totalCount = computed(() => todoStore.todos.length)
```

### 3.3 イベントハンドラ

```typescript
// ========================================
// イベントハンドラ
// ========================================

/**
 * 検索キーワード更新
 */
function handleSearch(keyword: string): void {
  searchKeyword.value = keyword
}

/**
 * フィルタ条件更新
 */
function handleFilterChange(newFilter: FilterState): void {
  filter.value = { ...newFilter }
}

/**
 * フィルタリセット
 */
function handleFilterReset(): void {
  filter.value = { ...initialFilterState }
}

/**
 * ソート変更
 */
function handleSortChange(key: SortKey): void {
  if (sortKey.value === key) {
    // 同じ列をクリック → 順序を反転
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // 別の列をクリック → 昇順でソート
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
```

---

## 4. 状態管理方針

### 4.1 ローカルState vs ストア

| 状態 | 管理場所 | 理由 |
|------|---------|------|
| チケット一覧 | todoStore | 複数画面で共有、API連携が必要 |
| ユーザー一覧 | userStore | 複数画面で共有、API連携が必要 |
| プロジェクト一覧 | projectStore | 複数画面で共有、API連携が必要 |
| 検索キーワード | ローカル | この画面固有、永続化不要 |
| フィルタ条件 | ローカル | この画面固有、永続化不要 |
| ソート状態 | ローカル | この画面固有、永続化不要 |

### 4.2 フィルタリング設計指針

- **クライアントサイド処理**: データ量が少ないため、全件取得後にフロントエンドでフィルタリング
- **computed活用**: リアクティブな依存関係により、条件変更時に自動再計算
- **パイプライン方式**: 検索 → フィルタ → ソートの順で処理を適用

### 4.3 パフォーマンス考慮

| 項目 | 対応 |
|------|------|
| 大量データ | 現時点では数百件を想定、問題なし |
| 再計算コスト | computedのメモ化により最小化 |
| 初期ロード | onMounted で3つのストアを並列fetch |

---

## 5. 使用例

### 5.1 ストアの初期化

```typescript
// TodoTableView.vue

import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'

const route = useRoute()
const todoStore = useTodoStore()
const userStore = useUserStore()
const projectStore = useProjectStore()

onMounted(async () => {
  // 並列でデータ取得
  await Promise.all([
    userStore.fetchUsers(),
    projectStore.fetchProjects()
  ])

  // projectIdパラメータがあれば案件別取得
  const projectId = route.query.projectId
  if (projectId) {
    filter.value.projectId = Number(projectId)
    await todoStore.fetchTodosByProject(Number(projectId))
  } else {
    await todoStore.fetchTodos()
  }
})
```

### 5.2 テーブル行操作

```typescript
// TodoTableView.vue

/**
 * 完了状態トグル
 */
async function handleToggle(id: number): Promise<void> {
  try {
    await todoStore.toggleTodo(id)
  } catch (err) {
    console.error('完了状態の更新に失敗しました:', err)
  }
}

/**
 * チケット削除
 */
async function handleDelete(id: number): Promise<void> {
  if (!confirm('このチケットを削除しますか？')) return

  try {
    await todoStore.deleteTodo(id)
  } catch (err) {
    console.error('チケットの削除に失敗しました:', err)
  }
}
```

---

## 6. 将来的な拡張案

### 6.1 フィルタ状態のURL永続化

URLクエリパラメータにフィルタ状態を保存し、ブックマークやリンク共有を可能にする。

```typescript
// 将来的な実装案
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// URLからフィルタ状態を復元
watch(() => route.query, (query) => {
  if (query.completed) filter.value.completed = query.completed as CompletedFilter
  if (query.assigneeId) filter.value.assigneeId = Number(query.assigneeId)
  // ...
}, { immediate: true })

// フィルタ変更時にURLを更新
watch(filter, (newFilter) => {
  router.replace({
    query: {
      ...route.query,
      completed: newFilter.completed !== 'all' ? newFilter.completed : undefined,
      assigneeId: newFilter.assigneeId?.toString(),
      // ...
    }
  })
}, { deep: true })
```

### 6.2 専用ストアへの分離

データ量が増加し、ページネーションやサーバーサイドフィルタリングが必要になった場合:

```typescript
// stores/todoTableStore.ts（将来的な実装案）
export const useTodoTableStore = defineStore('todoTable', () => {
  const filter = ref<FilterState>({ ...initialFilterState })
  const searchKeyword = ref('')
  const sort = ref<SortState>({ key: 'id', order: 'asc' })
  const pagination = ref({ page: 0, size: 20, total: 0 })

  async function fetchFilteredTodos(): Promise<void> {
    // サーバーサイドフィルタリング・ページネーション
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      size: pagination.value.size.toString(),
      sort: sort.value.key,
      order: sort.value.order,
      // フィルタパラメータ...
    })
    const response = await fetch(`/api/todos?${params}`)
    // ...
  }

  return { filter, searchKeyword, sort, pagination, fetchFilteredTodos }
})
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成（変更なしを明記） | Claude |
