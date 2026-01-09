# フロントエンド詳細設計書 - TodoDetailModal

[← 目次に戻る](./detail-design-frontend.md)

---

## 3.1 TodoDetailModal.vue

### ファイル

`src/frontend/src/components/todo/TodoDetailModal.vue`

### テンプレート構造

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

### スクリプト

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

### スタイル

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
