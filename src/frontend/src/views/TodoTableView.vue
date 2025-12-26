<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore'
import { useUserStore } from '@/stores/userStore'
import { useProjectStore } from '@/stores/projectStore'
import TodoSearchForm from '@/components/todo/TodoSearchForm.vue'
import TodoTableFilter from '@/components/todo/TodoTableFilter.vue'
import TodoTable from '@/components/todo/TodoTable.vue'
import type { FilterState, SortKey, SortOrder } from '@/types'
import { initialFilterState } from '@/types'

const route = useRoute()
const todoStore = useTodoStore()
const userStore = useUserStore()
const projectStore = useProjectStore()

// ローカル状態
const searchKeyword = ref('')
const filter = ref<FilterState>({ ...initialFilterState })
const sortKey = ref<SortKey>('id')
const sortOrder = ref<SortOrder>('asc')
const showFilter = ref(false)

// フィルタ・検索・ソート適用後のチケット一覧
const filteredAndSortedTodos = computed(() => {
  let result = [...todoStore.todos]

  // 1. キーワード検索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      (todo) =>
        todo.title.toLowerCase().includes(keyword) ||
        (todo.description?.toLowerCase().includes(keyword) ?? false)
    )
  }

  // 2. 完了状態フィルタ
  if (filter.value.completed === 'pending') {
    result = result.filter((todo) => !todo.completed)
  } else if (filter.value.completed === 'completed') {
    result = result.filter((todo) => todo.completed)
  }

  // 3. 担当者フィルタ
  if (filter.value.assigneeId !== null) {
    result = result.filter((todo) => todo.assigneeId === filter.value.assigneeId)
  }

  // 4. 案件フィルタ
  if (filter.value.projectId !== null) {
    result = result.filter((todo) => todo.projectId === filter.value.projectId)
  }

  // 5. 期間フィルタ（開始日）
  if (filter.value.startDateFrom) {
    result = result.filter(
      (todo) => todo.startDate && todo.startDate >= filter.value.startDateFrom!
    )
  }
  if (filter.value.startDateTo) {
    result = result.filter((todo) => todo.startDate && todo.startDate <= filter.value.startDateTo!)
  }

  // 6. 期間フィルタ（終了日）
  if (filter.value.dueDateFrom) {
    result = result.filter((todo) => todo.dueDate && todo.dueDate >= filter.value.dueDateFrom!)
  }
  if (filter.value.dueDateTo) {
    result = result.filter((todo) => todo.dueDate && todo.dueDate <= filter.value.dueDateTo!)
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

// フィルタがアクティブかどうか
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

// 件数情報
const filteredCount = computed(() => filteredAndSortedTodos.value.length)
const totalCount = computed(() => todoStore.todos.length)

// イベントハンドラ
function handleSearch(keyword: string): void {
  searchKeyword.value = keyword
}

function handleFilterChange(newFilter: FilterState): void {
  filter.value = { ...newFilter }
}

function handleFilterReset(): void {
  filter.value = { ...initialFilterState }
}

function handleSortChange(key: SortKey): void {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

async function handleToggle(id: number): Promise<void> {
  try {
    await todoStore.toggleTodo(id)
  } catch (err) {
    console.error('完了状態の更新に失敗しました:', err)
  }
}

async function handleDelete(id: number): Promise<void> {
  if (!confirm('このチケットを削除しますか？')) return

  try {
    await todoStore.deleteTodo(id)
  } catch (err) {
    console.error('チケットの削除に失敗しました:', err)
  }
}

// 初期化
onMounted(async () => {
  // 並列でデータ取得
  await Promise.all([userStore.fetchUsers(), projectStore.fetchProjects()])

  // projectIdパラメータがあれば案件別取得
  const projectId = route.query.projectId
  if (projectId) {
    filter.value.projectId = Number(projectId)
    await todoStore.fetchTodos(String(projectId))
  } else {
    await todoStore.fetchTodos()
  }
})
</script>

<template>
  <div class="todo-table-view">
    <header class="view-header">
      <h1>チケット一覧</h1>
      <div class="header-info">
        <span class="count-info">
          {{ filteredCount }} / {{ totalCount }} 件
          <span v-if="isFilterActive || searchKeyword" class="filter-badge">フィルタ中</span>
        </span>
      </div>
    </header>

    <div class="toolbar">
      <TodoSearchForm :keyword="searchKeyword" @search="handleSearch" />

      <button
        class="filter-toggle-btn"
        :class="{ active: showFilter || isFilterActive }"
        @click="showFilter = !showFilter"
      >
        <span class="icon">&#x1F50D;</span>
        フィルタ
        <span v-if="isFilterActive" class="active-indicator"></span>
      </button>
    </div>

    <TodoTableFilter
      v-if="showFilter"
      :filter="filter"
      :users="userStore.users"
      :projects="projectStore.projects"
      @update:filter="handleFilterChange"
      @reset="handleFilterReset"
    />

    <div v-if="todoStore.loading" class="loading">読み込み中...</div>

    <div v-else-if="todoStore.error" class="error">
      {{ todoStore.error }}
    </div>

    <div v-else-if="filteredAndSortedTodos.length === 0" class="empty">
      <p v-if="searchKeyword || isFilterActive">条件に一致するチケットがありません</p>
      <p v-else>チケットがありません</p>
    </div>

    <TodoTable
      v-else
      :todos="filteredAndSortedTodos"
      :projects="projectStore.projects"
      :sort-key="sortKey"
      :sort-order="sortOrder"
      @sort="handleSortChange"
      @toggle="handleToggle"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.todo-table-view {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-info {
  font-size: 14px;
  color: #666;
}

.filter-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  position: relative;
}

.filter-toggle-btn:hover {
  background: #f5f5f5;
}

.filter-toggle-btn.active {
  border-color: #1976d2;
  color: #1976d2;
}

.filter-toggle-btn .icon {
  font-size: 14px;
}

.active-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: #f44336;
  border-radius: 50%;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 4px;
}

.empty {
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
