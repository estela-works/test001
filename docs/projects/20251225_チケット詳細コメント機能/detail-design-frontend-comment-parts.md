# フロントエンド詳細設計書 - コメント関連コンポーネント

[← 目次に戻る](./detail-design-frontend.md)

---

## 3.2 CommentList.vue

### ファイル

`src/frontend/src/components/todo/CommentList.vue`

### テンプレート

```vue
<template>
  <div class="comment-list">
    <div v-if="commentStore.loading" class="loading">
      読み込み中...
    </div>

    <div v-else-if="commentStore.error" class="error">
      {{ commentStore.error }}
    </div>

    <div v-else-if="!commentStore.hasComments" class="empty">
      コメントはまだありません
    </div>

    <div v-else class="comments">
      <CommentItem
        v-for="comment in commentStore.sortedComments"
        :key="comment.id"
        :comment="comment"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCommentStore } from '@/stores/commentStore'
import CommentItem from './CommentItem.vue'

const props = defineProps<{
  todoId: number
}>()

const commentStore = useCommentStore()

onMounted(async () => {
  try {
    await commentStore.fetchComments(props.todoId)
  } catch (error) {
    // エラーはストアに保存済み
  }
})

onUnmounted(() => {
  commentStore.clearComments()
})

async function handleDelete(commentId: number) {
  if (!confirm('このコメントを削除してもよろしいですか?')) {
    return
  }

  try {
    await commentStore.deleteComment(commentId)
  } catch (error) {
    alert('コメントの削除に失敗しました')
  }
}
</script>

<style scoped>
.comment-list {
  margin-top: 1rem;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error {
  padding: 1rem;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
```

---

## 3.3 CommentForm.vue

### ファイル

`src/frontend/src/components/todo/CommentForm.vue`

### テンプレート

```vue
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
```

---

## 3.4 CommentItem.vue

### ファイル

`src/frontend/src/components/todo/CommentItem.vue`

### テンプレート

```vue
<template>
  <div class="comment-item">
    <div class="comment-header">
      <span class="author">{{ comment.userName || '削除されたユーザー' }}</span>
      <span class="separator">•</span>
      <span class="timestamp">{{ formattedDate }}</span>
      <button class="btn-delete" @click="handleDelete" aria-label="削除">
        削除
      </button>
    </div>
    <div class="comment-content">{{ comment.content }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '@/types'

const props = defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  delete: [commentId: number]
}>()

const formattedDate = computed(() => {
  return formatRelativeTime(props.comment.createdAt)
})

function formatRelativeTime(isoDate: string): string {
  const now = new Date()
  const past = new Date(isoDate)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'たった今'
  if (diffMins < 60) return `${diffMins}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`

  return past.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleDelete() {
  emit('delete', props.comment.id)
}
</script>

<style scoped>
.comment-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.author {
  font-weight: 600;
  color: #1f2937;
}

.separator {
  color: #9ca3af;
}

.timestamp {
  color: #6b7280;
}

.btn-delete {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.comment-content {
  color: #374151;
  white-space: pre-wrap;
  line-height: 1.5;
}
</style>
```
