<script setup lang="ts">
import type { FilterState, CompletedFilter, User, Project } from '@/types'
import { COMPLETED_FILTER_OPTIONS } from '@/types'

const props = defineProps<{
  filter: FilterState
  users: User[]
  projects: Project[]
}>()

const emit = defineEmits<{
  'update:filter': [filter: FilterState]
  reset: []
}>()

function updateFilter(updates: Partial<FilterState>): void {
  emit('update:filter', { ...props.filter, ...updates })
}

function handleCompletedChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value as CompletedFilter
  updateFilter({ completed: value })
}

function handleAssigneeChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  updateFilter({ assigneeId: value ? Number(value) : null })
}

function handleProjectChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  updateFilter({ projectId: value ? Number(value) : null })
}

function handleStartDateFromChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilter({ startDateFrom: value || null })
}

function handleStartDateToChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilter({ startDateTo: value || null })
}

function handleDueDateFromChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilter({ dueDateFrom: value || null })
}

function handleDueDateToChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  updateFilter({ dueDateTo: value || null })
}

function handleReset(): void {
  emit('reset')
}
</script>

<template>
  <div class="todo-table-filter">
    <div class="filter-row">
      <div class="filter-group">
        <label class="filter-label">状態</label>
        <select class="filter-select" :value="filter.completed" @change="handleCompletedChange">
          <option v-for="option in COMPLETED_FILTER_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">担当者</label>
        <select
          class="filter-select"
          :value="filter.assigneeId ?? ''"
          @change="handleAssigneeChange"
        >
          <option value="">すべて</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">案件</label>
        <select
          class="filter-select"
          :value="filter.projectId ?? ''"
          @change="handleProjectChange"
        >
          <option value="">すべて</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="filter-row">
      <div class="filter-group date-range">
        <label class="filter-label">開始日</label>
        <div class="date-inputs">
          <input
            type="date"
            class="filter-input"
            :value="filter.startDateFrom ?? ''"
            @change="handleStartDateFromChange"
          />
          <span class="date-separator">〜</span>
          <input
            type="date"
            class="filter-input"
            :value="filter.startDateTo ?? ''"
            @change="handleStartDateToChange"
          />
        </div>
      </div>

      <div class="filter-group date-range">
        <label class="filter-label">終了日</label>
        <div class="date-inputs">
          <input
            type="date"
            class="filter-input"
            :value="filter.dueDateFrom ?? ''"
            @change="handleDueDateFromChange"
          />
          <span class="date-separator">〜</span>
          <input
            type="date"
            class="filter-input"
            :value="filter.dueDateTo ?? ''"
            @change="handleDueDateToChange"
          />
        </div>
      </div>

      <div class="filter-actions">
        <button class="reset-btn" @click="handleReset">リセット</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-table-filter {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.filter-row + .filter-row {
  margin-top: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.filter-select,
.filter-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 140px;
  background: white;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #1976d2;
}

.date-range {
  flex: 1;
  min-width: 280px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-inputs .filter-input {
  flex: 1;
  min-width: 130px;
}

.date-separator {
  color: #666;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
  margin-left: auto;
}

.reset-btn {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.reset-btn:hover {
  background: #f5f5f5;
  color: #333;
}
</style>
