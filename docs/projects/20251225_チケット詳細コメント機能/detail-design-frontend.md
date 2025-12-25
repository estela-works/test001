# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

チケット詳細モーダルとコメント機能のVueコンポーネント実装詳細を定義する。

### 1.2 対象コンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| TodoDetailModal.vue | モーダル | チケット詳細とコメント機能の統合 |
| CommentList.vue | リスト | コメント一覧表示 |
| CommentForm.vue | フォーム | コメント投稿 |
| CommentItem.vue | アイテム | 個別コメント表示 |

---

## 2. ファイル構成

### 2.1 新規ファイル一覧

```
src/frontend/src/
├── components/
│   └── todo/
│       ├── TodoDetailModal.vue    # チケット詳細モーダル（新規）
│       ├── CommentList.vue        # コメント一覧（新規）
│       ├── CommentForm.vue        # コメント投稿フォーム（新規）
│       └── CommentItem.vue        # コメントアイテム（新規）
├── stores/
│   └── commentStore.ts            # コメントストア（新規）
└── types/
    └── comment.ts                 # コメント型定義（新規）
```

---

## 3. コンポーネント詳細設計

### 3.1 TodoDetailModal.vue

#### ファイル

`src/frontend/src/components/todo/TodoDetailModal.vue`

#### テンプレート構造

```vue
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- ヘッダー -->
          <div class="modal-header">
            <h2>チケット詳細</h2>
            <button class="close-button" @click="handleClose" aria-label="閉じる">
              ×
            </button>
          </div>

          <!-- コンテンツ -->
          <div class="modal-content">
            <!-- チケット情報セクション -->
            <section class="todo-info">
              <div class="info-row">
                <label>タイトル:</label>
                <p class="title">{{ todo?.title }}</p>
              </div>
              <div class="info-row">
                <label>説明:</label>
                <p class="description">{{ todo?.description || '説明なし' }}</p>
              </div>
              <div class="info-row">
                <label>ステータス:</label>
                <div class="status">
                  <span :class="['badge', todo?.completed ? 'completed' : 'pending']">
                    {{ todo?.completed ? '完了' : '未完了' }}
                  </span>
                  <button
                    v-if="!todo?.completed"
                    class="btn-toggle"
                    @click="handleToggleComplete"
                  >
                    完了にする
                  </button>
                </div>
              </div>
              <div class="info-row">
                <label>期間:</label>
                <p>{{ formatDateRange(todo?.startDate, todo?.dueDate) }}</p>
              </div>
              <div class="info-row">
                <label>担当:</label>
                <p>{{ todo?.assigneeName || '未割当' }}</p>
              </div>
              <div class="info-row">
                <label>作成日時:</label>
                <p>{{ formatDateTime(todo?.createdAt) }}</p>
              </div>
            </section>

            <hr class="divider" />

            <!-- コメントセクション -->
            <section class="comment-section">
              <h3>コメント ({{ commentStore.commentCount }}件)</h3>

              <!-- コメント投稿フォーム -->
              <CommentForm :todo-id="todoId" @comment-created="handleCommentCreated" />

              <!-- コメント一覧 -->
              <CommentList :todo-id="todoId" />
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

#### スクリプト

```typescript
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { useCommentStore } from '@/stores/commentStore'
import CommentList from './CommentList.vue'
import CommentForm from './CommentForm.vue'
import type { Todo } from '@/types'

// Props
const props = defineProps<{
  todoId: number
  isOpen: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
  todoUpdated: [todo: Todo]
}>()

// Stores
const todoStore = useTodoStore()
const commentStore = useCommentStore()

// State
const todo = ref<Todo | null>(null)

// チケット詳細を取得
async function loadTodoDetail() {
  try {
    todo.value = await todoStore.getTodoById(props.todoId)
  } catch (error) {
    console.error('チケット詳細の取得に失敗しました:', error)
  }
}

// モーダルを閉じる
function handleClose() {
  emit('close')
}

// オーバーレイクリック
function handleOverlayClick() {
  handleClose()
}

// 完了状態を切り替え
async function handleToggleComplete() {
  if (!todo.value) return

  try {
    await todoStore.toggleTodo(todo.value.id)
    await loadTodoDetail()
    if (todo.value) {
      emit('todoUpdated', todo.value)
    }
  } catch (error) {
    console.error('完了状態の切り替えに失敗しました:', error)
  }
}

// コメント作成成功時
function handleCommentCreated() {
  // コメント一覧は自動更新されるので、特に処理は不要
}

// 日時範囲フォーマット
function formatDateRange(startDate: string | null, dueDate: string | null): string {
  if (!startDate && !dueDate) return '未設定'
  const start = startDate ? formatDate(startDate) : '未設定'
  const due = dueDate ? formatDate(dueDate) : '未設定'
  return `${start} 〜 ${due}`
}

// 日付フォーマット
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ja-JP')
}

// 日時フォーマット
function formatDateTime(dateStr: string | undefined): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('ja-JP')
}

// キーボードイベント（Escキーでモーダルを閉じる）
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

// モーダルが開いた時
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await loadTodoDetail()
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden' // スクロール無効化
  } else {
    commentStore.clearComments()
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = '' // スクロール有効化
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>
```

#### スタイル

```vue
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  line-height: 1;
}

.close-button:hover {
  color: #1f2937;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.todo-info {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  margin-bottom: 1rem;
}

.info-row label {
  font-weight: 600;
  min-width: 100px;
  color: #374151;
}

.info-row p {
  margin: 0;
  flex: 1;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
}

.description {
  white-space: pre-wrap;
}

.status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.completed {
  background-color: #d1fae5;
  color: #065f46;
}

.badge.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.btn-toggle {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-toggle:hover {
  background-color: #2563eb;
}

.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5rem 0;
}

.comment-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

/* トランジション */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
```

---

### 3.2 CommentList.vue

#### テンプレート

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

### 3.3 CommentForm.vue

#### テンプレート

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

### 3.4 CommentItem.vue

#### テンプレート

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

---

## 4. TodoView.vueへの統合

### 4.1 モーダル呼び出し

既存の`TodoView.vue`または`TodoList.vue`に以下を追加：

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

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
