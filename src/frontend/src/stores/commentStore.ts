import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Comment,
  CreateCommentRequest,
} from '@/types'
import { COMMENT_ERROR_MESSAGES } from '@/types'

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
