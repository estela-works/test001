<script setup lang="ts">
  import { computed } from 'vue'
  import type { Todo } from '@/types'

  const props = defineProps<{
    todo: Todo
  }>()

  const emit = defineEmits<{
    (e: 'toggle', id: number): void
    (e: 'delete', id: number): void
  }>()

  const dateRange = computed(() => {
    if (!props.todo.startDate && !props.todo.dueDate) return ''
    const start = props.todo.startDate || '未定'
    const end = props.todo.dueDate || '未定'
    return `${start} 〜 ${end}`
  })

  const formattedCreatedAt = computed(() => {
    const date = new Date(props.todo.createdAt)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  const handleDelete = () => {
    if (confirm('このToDoを削除しますか？')) {
      emit('delete', props.todo.id)
    }
  }
</script>

<template>
  <div class="todo-item card" :class="{ completed: todo.completed }">
    <h3>{{ todo.title }}</h3>
    <p v-if="todo.description">{{ todo.description }}</p>
    <p v-if="dateRange" class="date-range">期間: {{ dateRange }}</p>
    <p class="assignee" :class="{ unassigned: !todo.assigneeName }">
      担当: {{ todo.assigneeName || '未割当' }}
    </p>
    <p>
      <small>作成日: {{ formattedCreatedAt }}</small>
    </p>
    <div class="actions">
      <button class="toggle-btn" @click="$emit('toggle', todo.id)">
        {{ todo.completed ? '未完了にする' : '完了にする' }}
      </button>
      <button class="delete-btn btn-danger" @click="handleDelete">削除</button>
    </div>
  </div>
</template>

<style scoped>
  .todo-item {
    transition: opacity 0.3s;
  }

  .todo-item.completed {
    opacity: 0.6;
    background-color: #f8f9fa;
  }

  .todo-item.completed h3 {
    text-decoration: line-through;
    color: #6c757d;
  }

  .todo-item h3 {
    margin-top: 0;
    margin-bottom: 8px;
  }

  .todo-item p {
    margin: 4px 0;
    color: #666;
  }

  .date-range {
    font-size: 0.9rem;
  }

  .assignee {
    font-size: 0.9rem;
  }

  .assignee.unassigned {
    color: #999;
    font-style: italic;
  }

  .actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }

  .toggle-btn {
    background-color: #28a745;
    color: white;
  }

  .toggle-btn:hover {
    background-color: #218838;
  }

  .completed .toggle-btn {
    background-color: #6c757d;
  }

  .completed .toggle-btn:hover {
    background-color: #545b62;
  }
</style>
