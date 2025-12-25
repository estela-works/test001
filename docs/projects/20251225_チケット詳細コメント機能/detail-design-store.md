# ストア詳細設計書

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

コメント機能に関連するPiniaストアの実装詳細（状態、ゲッター、アクション）を定義する。

### 1.2 ストア構成

| ストア | ファイル | 責務 |
|--------|---------|------|
| commentStore | stores/commentStore.ts | コメント状態管理（新規） |

---

## 2. commentStore

### 2.1 ファイル

`src/frontend/src/stores/commentStore.ts`

### 2.2 状態定義

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Comment,
  CreateCommentRequest,
  CommentApiError,
  COMMENT_ERROR_MESSAGES
} from '@/types'

export const useCommentStore = defineStore('comment', () => {
  // ========================================
  // State
  // ========================================

  /** コメント一覧 */
  const comments = ref<Comment[]>([])

  /** ローディング状態 */
  const loading = ref<boolean>(false)

  /** エラーメッセージ */
  const error = ref<string | null>(null)

  /** 現在表示中のToDoID */
  const currentTodoId = ref<number | null>(null)

  // ========================================
  // Getters
  // ========================================

  /**
   * コメント件数
   */
  const commentCount = computed(() => comments.value.length)

  /**
   * コメントが存在するか
   */
  const hasComments = computed(() => comments.value.length > 0)

  /**
   * 新しい順にソートされたコメント一覧
   * （APIレスポンスは既にソート済みだが、念のため）
   */
  const sortedComments = computed(() => {
    return [...comments.value].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })

  // ========================================
  // Actions
  // ========================================

  /**
   * コメント一覧を取得
   * @param todoId - ToDoのID
   */
  async function fetchComments(todoId: number): Promise<void> {
    loading.value = true
    error.value = null
    currentTodoId.value = todoId

    try {
      const response = await fetch(`/api/todos/${todoId}/comments`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(COMMENT_ERROR_MESSAGES.TODO_NOT_FOUND)
        }
        throw new Error(COMMENT_ERROR_MESSAGES.FETCH_FAILED)
      }

      const data = await response.json()
      comments.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : COMMENT_ERROR_MESSAGES.FETCH_FAILED
      comments.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * コメントを投稿
   * @param todoId - ToDoのID
   * @param request - コメント作成リクエスト
   * @returns 作成されたコメント
   */
  async function createComment(
    todoId: number,
    request: CreateCommentRequest
  ): Promise<Comment> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/todos/${todoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(COMMENT_ERROR_MESSAGES.VALIDATION_ERROR)
        }
        if (response.status === 404) {
          throw new Error(COMMENT_ERROR_MESSAGES.TODO_NOT_FOUND)
        }
        throw new Error(COMMENT_ERROR_MESSAGES.CREATE_FAILED)
      }

      const newComment: Comment = await response.json()

      // コメント一覧に追加（先頭に追加して新しい順を維持）
      comments.value.unshift(newComment)

      return newComment
    } catch (err) {
      error.value = err instanceof Error ? err.message : COMMENT_ERROR_MESSAGES.CREATE_FAILED
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * コメントを削除
   * @param commentId - コメントID
   */
  async function deleteComment(commentId: number): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(COMMENT_ERROR_MESSAGES.NOT_FOUND)
        }
        throw new Error(COMMENT_ERROR_MESSAGES.DELETE_FAILED)
      }

      // コメント一覧から削除
      comments.value = comments.value.filter((c) => c.id !== commentId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : COMMENT_ERROR_MESSAGES.DELETE_FAILED
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * コメント一覧をクリア
   * モーダルを閉じる時などに使用
   */
  function clearComments(): void {
    comments.value = []
    error.value = null
    currentTodoId.value = null
  }

  /**
   * エラーをクリア
   */
  function clearError(): void {
    error.value = null
  }

  /**
   * ストアをリセット（初期状態に戻す）
   */
  function $reset(): void {
    comments.value = []
    loading.value = false
    error.value = null
    currentTodoId.value = null
  }

  return {
    // State
    comments,
    loading,
    error,
    currentTodoId,

    // Getters
    commentCount,
    hasComments,
    sortedComments,

    // Actions
    fetchComments,
    createComment,
    deleteComment,
    clearComments,
    clearError,
    $reset
  }
})
```

---

## 3. ストア仕様詳細

### 3.1 State（状態）

| 状態名 | 型 | 初期値 | 説明 |
|--------|-----|--------|------|
| comments | Comment[] | [] | コメント一覧 |
| loading | boolean | false | API通信中かどうか |
| error | string \| null | null | エラーメッセージ |
| currentTodoId | number \| null | null | 現在表示中のToDoID |

### 3.2 Getters（算出プロパティ）

| ゲッター名 | 戻り値型 | 説明 |
|-----------|---------|------|
| commentCount | number | コメント件数 |
| hasComments | boolean | コメントが1件以上あるか |
| sortedComments | Comment[] | 新しい順にソートされたコメント一覧 |

### 3.3 Actions（アクション）

| アクション名 | 引数 | 戻り値 | 説明 |
|------------|------|--------|------|
| fetchComments | todoId: number | Promise<void> | コメント一覧を取得 |
| createComment | todoId: number, request: CreateCommentRequest | Promise<Comment> | コメントを投稿 |
| deleteComment | commentId: number | Promise<void> | コメントを削除 |
| clearComments | なし | void | コメント一覧をクリア |
| clearError | なし | void | エラーをクリア |
| $reset | なし | void | ストアを初期状態にリセット |

---

## 4. APIエンドポイント

### 4.1 使用するAPI

| アクション | メソッド | エンドポイント | 説明 |
|-----------|---------|---------------|------|
| fetchComments | GET | /api/todos/{todoId}/comments | コメント一覧取得 |
| createComment | POST | /api/todos/{todoId}/comments | コメント投稿 |
| deleteComment | DELETE | /api/comments/{id} | コメント削除 |

---

## 5. エラーハンドリング

### 5.1 エラーパターンとメッセージ

| HTTPステータス | エラーメッセージ | 発生アクション |
|--------------|----------------|--------------|
| 400 | "入力内容に誤りがあります" | createComment |
| 404 | "チケットが見つかりません" | fetchComments, createComment |
| 404 | "コメントが見つかりません" | deleteComment |
| その他 | "コメントの取得に失敗しました" | fetchComments |
| その他 | "コメントの投稿に失敗しました" | createComment |
| その他 | "コメントの削除に失敗しました" | deleteComment |
| ネットワークエラー | "通信エラーが発生しました" | 全アクション |

### 5.2 エラー処理フロー

```typescript
try {
  // API呼び出し
  const response = await fetch(...)

  // HTTPステータスチェック
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('適切なエラーメッセージ')
    }
    throw new Error('デフォルトエラーメッセージ')
  }

  // 成功時の処理
  const data = await response.json()
  // ...
} catch (err) {
  // エラーを状態に保存
  error.value = err instanceof Error ? err.message : 'デフォルトエラーメッセージ'
  // エラーを再スロー（呼び出し側でハンドリング可能に）
  throw err
} finally {
  // ローディング状態を解除
  loading.value = false
}
```

---

## 6. 使用例

### 6.1 コンポーネントでの使用

#### CommentList.vue

```typescript
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCommentStore } from '@/stores/commentStore'

const props = defineProps<{
  todoId: number
}>()

const commentStore = useCommentStore()

// マウント時にコメント一覧を取得
onMounted(async () => {
  try {
    await commentStore.fetchComments(props.todoId)
  } catch (error) {
    // エラーはストアに保存済みなので、ここでは何もしない
    // または、トースト通知を表示するなど
  }
})

// アンマウント時にクリア
onUnmounted(() => {
  commentStore.clearComments()
})
</script>

<template>
  <div>
    <div v-if="commentStore.loading">読み込み中...</div>
    <div v-else-if="commentStore.error" class="error">
      {{ commentStore.error }}
    </div>
    <div v-else-if="!commentStore.hasComments">
      コメントはまだありません
    </div>
    <div v-else>
      <p>コメント ({{ commentStore.commentCount }}件)</p>
      <div v-for="comment in commentStore.sortedComments" :key="comment.id">
        <!-- コメント表示 -->
      </div>
    </div>
  </div>
</template>
```

#### CommentForm.vue

```typescript
<script setup lang="ts">
import { reactive } from 'vue'
import { useCommentStore } from '@/stores/commentStore'
import type { CreateCommentRequest } from '@/types'
import { validateCreateCommentRequest } from '@/types'

const props = defineProps<{
  todoId: number
}>()

const emit = defineEmits<{
  commentCreated: []
}>()

const commentStore = useCommentStore()

const formState = reactive({
  content: '',
  userId: null as number | null,
  errors: {} as Record<string, string>
})

async function submitComment() {
  // バリデーション
  const request: Partial<CreateCommentRequest> = {
    userId: formState.userId ?? undefined,
    content: formState.content
  }

  formState.errors = validateCreateCommentRequest(request)

  if (Object.keys(formState.errors).length > 0) {
    return
  }

  try {
    await commentStore.createComment(props.todoId, request as CreateCommentRequest)

    // フォームをクリア
    formState.content = ''
    formState.userId = null

    // 親コンポーネントに通知
    emit('commentCreated')
  } catch (error) {
    // エラーはストアに保存済み
  }
}
</script>
```

---

## 7. テスト仕様

### 7.1 単体テスト項目

| テストケース | 検証内容 |
|------------|---------|
| 初期状態 | comments=[], loading=false, error=null, currentTodoId=null |
| fetchComments成功 | API成功時、commentsに値が設定される |
| fetchComments失敗（404） | 404エラー時、適切なエラーメッセージが設定される |
| createComment成功 | 新規コメントがcommentsの先頭に追加される |
| createComment失敗（400） | 400エラー時、適切なエラーメッセージが設定される |
| deleteComment成功 | 指定コメントがcommentsから削除される |
| deleteComment失敗（404） | 404エラー時、適切なエラーメッセージが設定される |
| clearComments | comments=[], error=null, currentTodoId=null になる |
| clearError | error=null になる |
| $reset | 全状態が初期値に戻る |

### 7.2 テストコード例

```typescript
// commentStore.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCommentStore } from '@/stores/commentStore'

describe('commentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn()
  })

  it('初期状態が正しい', () => {
    const store = useCommentStore()
    expect(store.comments).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.currentTodoId).toBeNull()
  })

  it('fetchComments成功時、commentsに値が設定される', async () => {
    const mockComments = [
      { id: 1, todoId: 10, userId: 1, userName: 'テスト', content: 'テスト', createdAt: '2025-12-25T10:00:00' }
    ]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockComments
    } as Response)

    const store = useCommentStore()
    await store.fetchComments(10)

    expect(store.comments).toEqual(mockComments)
    expect(store.currentTodoId).toBe(10)
  })

  // その他のテストケース...
})
```

---

## 8. パフォーマンス考慮事項

### 8.1 最適化ポイント

| 項目 | 対応 |
|------|------|
| コメント一覧のソート | computed で計算結果をキャッシュ |
| 不要な再取得防止 | currentTodoIdが変わった時のみ再取得 |
| メモリリーク防止 | モーダル閉じる時にclearComments()実行 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
