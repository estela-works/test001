# ストア詳細設計書 - 使用例とエラーハンドリング

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |
| 親文書 | [detail-design-store.md](./detail-design-store.md) |

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
