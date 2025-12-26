<script setup lang="ts">
import type { Todo, Project, SortKey, SortOrder } from '@/types'
import { TODO_TABLE_COLUMNS } from '@/types'
import TodoTableRow from './TodoTableRow.vue'

defineProps<{
  todos: Todo[]
  projects: Project[]
  sortKey: SortKey
  sortOrder: SortOrder
}>()

const emit = defineEmits<{
  sort: [key: SortKey]
  toggle: [id: number]
  delete: [id: number]
}>()

function handleSort(key: SortKey): void {
  emit('sort', key)
}

function handleToggle(id: number): void {
  emit('toggle', id)
}

function handleDelete(id: number): void {
  emit('delete', id)
}

function getSortIndicator(key: SortKey, currentKey: SortKey, currentOrder: SortOrder): string {
  if (key !== currentKey) return ''
  return currentOrder === 'asc' ? ' ▲' : ' ▼'
}
</script>

<template>
  <div class="todo-table-wrapper">
    <table class="todo-table">
      <thead>
        <tr>
          <th class="col-checkbox"></th>
          <th
            v-for="column in TODO_TABLE_COLUMNS"
            :key="column.key"
            :class="['col-' + column.key, { sortable: column.sortable }]"
            :style="{ width: column.width }"
            @click="column.sortable ? handleSort(column.key) : undefined"
          >
            {{ column.label }}
            <span v-if="column.sortable" class="sort-indicator">
              {{ getSortIndicator(column.key, sortKey, sortOrder) }}
            </span>
          </th>
          <th class="col-actions">操作</th>
        </tr>
      </thead>
      <tbody>
        <TodoTableRow
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          :projects="projects"
          @toggle="handleToggle"
          @delete="handleDelete"
        />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.todo-table-wrapper {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.todo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.todo-table thead {
  background: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
}

.todo-table th {
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  white-space: nowrap;
}

.todo-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.todo-table th.sortable:hover {
  background: #ebebeb;
}

.sort-indicator {
  font-size: 10px;
  color: #1976d2;
}

.col-checkbox {
  width: 40px;
  text-align: center;
}

.col-actions {
  width: 80px;
  text-align: center;
}

.col-id {
  width: 60px;
}

.col-title {
  min-width: 150px;
}

.col-description {
  max-width: 200px;
}

.col-assigneeName,
.col-projectId,
.col-startDate,
.col-dueDate,
.col-createdAt {
  width: 100px;
}

.col-completed {
  width: 80px;
  text-align: center;
}
</style>
