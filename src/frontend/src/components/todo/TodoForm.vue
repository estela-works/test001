<script setup lang="ts">
  import { reactive } from 'vue'
  import type { User, CreateTodoRequest } from '@/types'

  const props = defineProps<{
    users: User[]
    projectId?: string | null
  }>()

  const emit = defineEmits<{
    (e: 'submit', data: CreateTodoRequest): void
  }>()

  const form = reactive({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    assigneeId: '' as string | number
  })

  const validate = (): boolean => {
    if (!form.title.trim()) {
      alert('タイトルを入力してください')
      return false
    }
    if (form.startDate && form.dueDate && form.startDate > form.dueDate) {
      alert('終了日は開始日以降を指定してください')
      return false
    }
    return true
  }

  const resetForm = () => {
    form.title = ''
    form.description = ''
    form.startDate = ''
    form.dueDate = ''
    form.assigneeId = ''
  }

  const handleSubmit = () => {
    if (!validate()) return

    const data: CreateTodoRequest = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      startDate: form.startDate || null,
      dueDate: form.dueDate || null,
      assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
      projectId: props.projectId ? Number(props.projectId) : null
    }

    emit('submit', data)
    resetForm()
  }
</script>

<template>
  <div class="add-todo card">
    <h3>新しいToDoを追加</h3>
    <input
      v-model="form.title"
      type="text"
      placeholder="タイトルを入力してください"
      @keypress.enter="handleSubmit"
    />
    <textarea
      v-model="form.description"
      rows="3"
      placeholder="説明を入力してください（オプション）"
    />
    <div class="date-inputs">
      <div class="date-field">
        <label>開始日:</label>
        <input v-model="form.startDate" type="date" />
      </div>
      <div class="date-field">
        <label>終了日:</label>
        <input v-model="form.dueDate" type="date" />
      </div>
    </div>
    <div class="assignee-field">
      <label>担当者:</label>
      <select v-model="form.assigneeId">
        <option value="">未割当</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </div>
    <button class="btn-primary" @click="handleSubmit">追加</button>
  </div>
</template>

<style scoped>
  .add-todo h3 {
    margin-top: 0;
    margin-bottom: 16px;
  }

  .add-todo input[type='text'],
  .add-todo textarea {
    width: 100%;
    margin-bottom: 12px;
  }

  .date-inputs {
    display: flex;
    gap: 16px;
    margin-bottom: 12px;
  }

  .date-field {
    flex: 1;
  }

  .date-field label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.9rem;
    color: #666;
  }

  .date-field input {
    width: 100%;
  }

  .assignee-field {
    margin-bottom: 16px;
  }

  .assignee-field label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.9rem;
    color: #666;
  }

  .assignee-field select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
</style>
