<script setup lang="ts">
  import type { Todo } from '@/types'
  import TodoItem from './TodoItem.vue'

  defineProps<{
    todos: Todo[]
  }>()

  defineEmits<{
    (e: 'toggle', id: number): void
    (e: 'delete', id: number): void
    (e: 'click', id: number): void
  }>()
</script>

<template>
  <div class="todo-list">
    <p v-if="todos.length === 0" class="empty-message">ToDoアイテムがありません。</p>
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="$emit('toggle', $event)"
      @delete="$emit('delete', $event)"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<style scoped>
  .todo-list {
    margin-top: 20px;
  }

  .empty-message {
    text-align: center;
    color: #666;
    padding: 40px 20px;
  }
</style>
