<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="comment-content">コメント</label>
      <textarea
        id="comment-content"
        v-model="formState.content"
        :placeholder="COMMENT_CONSTANTS.CONTENT_PLACEHOLDER"
        rows="4"
        :disabled="formState.submitting"
        :maxlength="COMMENT_CONSTANTS.MAX_CONTENT_LENGTH"
      />
      <div v-if="formState.errors.content" class="error-message">
        {{ formState.errors.content }}
      </div>
      <div class="char-count">
        {{ formState.content.length }} / {{ COMMENT_CONSTANTS.MAX_CONTENT_LENGTH }}
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="comment-user">投稿者</label>
        <select
          id="comment-user"
          v-model="formState.userId"
          :disabled="formState.submitting"
        >
          <option :value="null">{{ COMMENT_CONSTANTS.USER_PLACEHOLDER }}</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <div v-if="formState.errors.userId" class="error-message">
          {{ formState.errors.userId }}
        </div>
      </div>

      <button
        type="submit"
        class="btn-submit"
        :disabled="formState.submitting || !canSubmit"
      >
        {{ formState.submitting ? '投稿中...' : '投稿' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useCommentStore } from '@/stores/commentStore'
import { useUserStore } from '@/stores/userStore'
import type { CreateCommentRequest } from '@/types'
import { validateCreateCommentRequest, COMMENT_CONSTANTS } from '@/types'

const props = defineProps<{
  todoId: number
}>()

const emit = defineEmits<{
  commentCreated: []
}>()

const commentStore = useCommentStore()
const userStore = useUserStore()

const formState = reactive({
  content: '',
  userId: null as number | null,
  submitting: false,
  errors: {} as Record<string, string>
})

const users = computed(() => userStore.users)

const canSubmit = computed(() => {
  return formState.content.trim() !== '' && formState.userId !== null
})

onMounted(async () => {
  await userStore.fetchUsers()
})

async function handleSubmit() {
  const request: Partial<CreateCommentRequest> = {
    userId: formState.userId ?? undefined,
    content: formState.content
  }

  formState.errors = validateCreateCommentRequest(request)

  if (Object.keys(formState.errors).length > 0) {
    return
  }

  formState.submitting = true

  try {
    await commentStore.createComment(props.todoId, request as CreateCommentRequest)

    // フォームをクリア
    formState.content = ''
    formState.userId = null
    formState.errors = {}

    emit('commentCreated')
  } catch (error) {
    alert('コメントの投稿に失敗しました')
  } finally {
    formState.submitting = false
  }
}
</script>

<style scoped>
.comment-form {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.form-row .form-group {
  flex: 1;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-submit:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
</style>
