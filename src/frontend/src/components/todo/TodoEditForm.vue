<template>
  <form class="edit-form" @submit.prevent="handleSubmit">
    <!-- タイトル -->
    <div class="form-group">
      <label for="edit-title">タイトル <span class="required">*</span></label>
      <input
        id="edit-title"
        ref="titleInput"
        v-model="formData.title"
        type="text"
        required
        placeholder="タイトルを入力してください"
        :disabled="saving"
      />
      <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
    </div>

    <!-- 説明 -->
    <div class="form-group">
      <label for="edit-description">説明</label>
      <textarea
        id="edit-description"
        v-model="formData.description"
        placeholder="説明を入力してください（オプション）"
        rows="3"
        :disabled="saving"
      />
    </div>

    <!-- 期間 -->
    <div class="form-row">
      <div class="form-group half">
        <label for="edit-startDate">開始日</label>
        <input
          id="edit-startDate"
          v-model="formData.startDate"
          type="date"
          :disabled="saving"
        />
      </div>
      <div class="form-group half">
        <label for="edit-dueDate">期限日</label>
        <input
          id="edit-dueDate"
          v-model="formData.dueDate"
          type="date"
          :disabled="saving"
        />
      </div>
    </div>
    <span v-if="errors.date" class="error-message">{{ errors.date }}</span>

    <!-- 担当者 -->
    <div class="form-group">
      <label for="edit-assignee">担当者</label>
      <select
        id="edit-assignee"
        v-model="formData.assigneeId"
        :disabled="saving"
      >
        <option :value="null">未割当</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </div>

    <!-- ボタン -->
    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="handleCancel" :disabled="saving">
        キャンセル
      </button>
      <button type="submit" class="btn-save" :disabled="saving || !isValid">
        <span v-if="saving">保存中...</span>
        <span v-else>保存</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Todo, UpdateTodoRequest, User } from '@/types'

// Props
const props = defineProps<{
  todo: Todo | null
  users: User[]
  saving: boolean
}>()

// Emits
const emit = defineEmits<{
  save: [request: UpdateTodoRequest]
  cancel: []
}>()

// Refs
const titleInput = ref<HTMLInputElement | null>(null)

// フォームデータ
const formData = ref({
  title: '',
  description: '',
  startDate: null as string | null,
  dueDate: null as string | null,
  assigneeId: null as number | null
})

// エラー状態
const errors = ref({
  title: '',
  date: ''
})

// バリデーション
const isValid = computed(() => {
  return formData.value.title.trim() !== '' && !errors.value.title && !errors.value.date
})

// 初期値を設定
watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    formData.value = {
      title: newTodo.title,
      description: newTodo.description || '',
      startDate: newTodo.startDate,
      dueDate: newTodo.dueDate,
      assigneeId: newTodo.assigneeId
    }
    clearErrors()
  }
}, { immediate: true })

// タイトルのバリデーション
watch(() => formData.value.title, (newTitle) => {
  if (newTitle.trim() === '') {
    errors.value.title = 'タイトルを入力してください'
  } else {
    errors.value.title = ''
  }
})

// 日付のバリデーション
watch([() => formData.value.startDate, () => formData.value.dueDate], ([start, due]) => {
  if (start && due && start > due) {
    errors.value.date = '開始日は期限日以前にしてください'
  } else {
    errors.value.date = ''
  }
})

// エラーをクリア
function clearErrors() {
  errors.value = { title: '', date: '' }
}

// フォーム送信
function handleSubmit() {
  if (!isValid.value) return

  const request: UpdateTodoRequest = {
    title: formData.value.title.trim(),
    description: formData.value.description.trim() || undefined,
    startDate: formData.value.startDate,
    dueDate: formData.value.dueDate,
    assigneeId: formData.value.assigneeId
  }

  emit('save', request)
}

// キャンセル
function handleCancel() {
  emit('cancel')
}

// マウント時にタイトル入力にフォーカス
onMounted(() => {
  titleInput.value?.focus()
})
</script>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group.half {
  flex: 1;
}

.required {
  color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-save {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-save:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-save:disabled,
.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
