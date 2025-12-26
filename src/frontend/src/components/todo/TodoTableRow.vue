<script setup lang="ts">
import { computed } from 'vue'
import type { Todo, Project } from '@/types'

const props = defineProps<{
  todo: Todo
  projects: Project[]
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()

// 案件名を取得
const projectName = computed(() => {
  if (props.todo.projectId === null) return '-'
  const project = props.projects.find((p) => p.id === props.todo.projectId)
  return project?.name ?? '-'
})

// 説明を省略表示（30文字まで）
const truncatedDescription = computed(() => {
  const desc = props.todo.description
  if (!desc) return '-'
  if (desc.length <= 30) return desc
  return desc.substring(0, 30) + '...'
})

// 日付をフォーマット（YYYY/MM/DD）
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

// 作成日をフォーマット（YYYY/MM/DD）
function formatCreatedAt(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}

function handleToggle(): void {
  emit('toggle', props.todo.id)
}

function handleDelete(): void {
  emit('delete', props.todo.id)
}
</script>

<template>
  <tr :class="{ completed: todo.completed }">
    <td class="col-checkbox">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="handleToggle"
        title="完了状態を切り替え"
      />
    </td>
    <td class="col-id">{{ todo.id }}</td>
    <td class="col-title">
      <span class="title-text">{{ todo.title }}</span>
    </td>
    <td class="col-description" :title="todo.description ?? ''">
      {{ truncatedDescription }}
    </td>
    <td class="col-assigneeName">{{ todo.assigneeName ?? '-' }}</td>
    <td class="col-projectId">{{ projectName }}</td>
    <td class="col-startDate">{{ formatDate(todo.startDate) }}</td>
    <td class="col-dueDate">{{ formatDate(todo.dueDate) }}</td>
    <td class="col-completed">
      <span :class="['status-badge', todo.completed ? 'done' : 'pending']">
        {{ todo.completed ? '完了' : '未完了' }}
      </span>
    </td>
    <td class="col-createdAt">{{ formatCreatedAt(todo.createdAt) }}</td>
    <td class="col-actions">
      <button class="delete-btn" @click="handleDelete" title="削除">
        &#x1F5D1;
      </button>
    </td>
  </tr>
</template>

<style scoped>
tr {
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.15s;
}

tr:hover {
  background: #f8f9fa;
}

tr.completed {
  background: #fafafa;
}

tr.completed .title-text {
  text-decoration: line-through;
  color: #999;
}

td {
  padding: 10px 8px;
  vertical-align: middle;
}

.col-checkbox {
  text-align: center;
}

.col-checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.col-id {
  color: #666;
  font-size: 13px;
}

.col-title {
  font-weight: 500;
}

.title-text {
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-description {
  color: #666;
  font-size: 13px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-assigneeName,
.col-projectId {
  font-size: 13px;
}

.col-startDate,
.col-dueDate,
.col-createdAt {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.col-completed {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.done {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.pending {
  background: #fff3e0;
  color: #ef6c00;
}

.col-actions {
  text-align: center;
}

.delete-btn {
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.delete-btn:hover {
  opacity: 1;
}
</style>
