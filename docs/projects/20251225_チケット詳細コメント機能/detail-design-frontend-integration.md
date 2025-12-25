# フロントエンド詳細設計書 - 統合

[← 目次に戻る](./detail-design-frontend.md)

---

## 4. TodoView.vueへの統合

### 4.1 モーダル呼び出し

既存の`TodoView.vue`または`TodoList.vue`に以下を追加:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TodoDetailModal from '@/components/todo/TodoDetailModal.vue'

const selectedTodoId = ref<number | null>(null)
const isModalOpen = ref(false)

function openTodoDetail(todoId: number) {
  selectedTodoId.value = todoId
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedTodoId.value = null
}

function handleTodoUpdated(todo: Todo) {
  // ToDoリストを更新
  todoStore.fetchTodos()
}
</script>

<template>
  <!-- 既存のToDo一覧 -->
  <div v-for="todo in todos" :key="todo.id" @click="openTodoDetail(todo.id)">
    <!-- ToDoカード -->
  </div>

  <!-- モーダル -->
  <TodoDetailModal
    v-if="selectedTodoId !== null"
    :todo-id="selectedTodoId"
    :is-open="isModalOpen"
    @close="closeModal"
    @todo-updated="handleTodoUpdated"
  />
</template>
```
