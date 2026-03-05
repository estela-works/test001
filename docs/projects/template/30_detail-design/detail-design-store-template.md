# ストア詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | <!-- 例: ToDoチケット詳細モーダル＋コメント機能 --> |
| 案件ID | <!-- YYYYMMDD_案件名 --> |
| 作成日 | <!-- YYYY-MM-DD --> |
| 関連基本設計書 | <!-- [basic-design-frontend.md](./basic-design-frontend.md) --> |
| 関連型定義設計書 | <!-- [detail-design-types.md](./detail-design-types.md) --> |
| 関連コンポーネント設計書 | <!-- [detail-design-frontend.md](./detail-design-frontend.md) --> |

---

## 1. 概要

### 1.1 本設計書の目的

<!--
このストアの目的を記載
例: コメント機能に関連するPiniaストアの実装詳細（状態、ゲッター、アクション）を定義する。
-->

### 1.2 ストア構成

<!--
作成・更新するストアの一覧を記載
例:

| ストア | ファイル | 責務 |
|--------|---------|------|
| commentStore | stores/commentStore.ts | コメント状態管理（新規） |
| todoStore | stores/todoStore.ts | ToDo状態管理（既存） |
-->

---

## 2. ストア実装（メインストア）

### 2.1 ファイル

<!-- 例: src/frontend/src/stores/commentStore.ts -->

### 2.2 状態定義

<!--
Pinia Composition APIスタイルでの実装を記載
以下の要素を含める:
- State: ref()で定義する状態変数
- Getters: computed()で定義する算出プロパティ
- Actions: async functionで定義する非同期処理

例:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Comment,
  CreateCommentRequest,
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

  // ========================================
  // Return (公開API)
  // ========================================

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
    clearError
  }
})
```
-->

---

## 3. 状態管理方針

### 3.1 State設計指針

<!--
状態の設計方針を記載
例:

- **単一責任**: 各ストアは単一のドメインモデルに責任を持つ
- **正規化**: 重複データを避け、必要に応じて算出プロパティで導出
- **最小化**: UIに必要な最小限の状態のみを保持
- **イミュータブル**: 配列・オブジェクトは常に新しいインスタンスで更新
-->

### 3.2 Getters設計指針

<!--
Gettersの設計方針を記載
例:

- **算出専用**: Gettersは状態を変更しない
- **キャッシュ活用**: computed()により自動的にキャッシュされる
- **複雑な演算**: フィルタリング・ソート・集計などの処理を集約
- **再利用性**: コンポーネント間で共通の算出ロジックを集約
-->

### 3.3 Actions設計指針

<!--
Actionsの設計方針を記載
例:

- **非同期処理**: API呼び出しは必ずActions内で実行
- **エラーハンドリング**: try-catch-finallyで確実にエラーを処理
- **ローディング管理**: loading状態を適切に更新
- **楽観的更新**: 可能な場合は先にUIを更新してから同期
- **トランザクション**: 複数の状態変更は一貫性を保つ

※ 重要: コンポーネントから直接fetch()を呼び出してはならない。
  すべてのAPI通信はストアのActionsを経由する。
  これによりAPI呼び出しロジックが一元化され、キャッシュ・エラー処理・ローディング管理が統一される。
-->

---

## 4. API連携仕様

### 4.1 APIエンドポイントマッピング

<!--
各Actionで呼び出すAPIエンドポイントを記載
例:

| Action | HTTPメソッド | エンドポイント | 説明 |
|--------|-------------|---------------|------|
| fetchComments | GET | `/api/todos/{todoId}/comments` | コメント一覧取得 |
| createComment | POST | `/api/todos/{todoId}/comments` | コメント作成 |
| deleteComment | DELETE | `/api/comments/{id}` | コメント削除 |
-->

### 4.2 エラーハンドリング

<!--
APIエラーのハンドリング方法を記載
例:

| HTTPステータス | エラーメッセージ | 処理 |
|--------------|----------------|------|
| 400 | VALIDATION_ERROR | エラーメッセージを表示、状態は変更しない |
| 404 | NOT_FOUND / TODO_NOT_FOUND | エラーメッセージを表示、空配列で初期化 |
| 500 | FETCH_FAILED / CREATE_FAILED / DELETE_FAILED | エラーメッセージを表示、前の状態を維持 |
| Network Error | NETWORK_ERROR | エラーメッセージを表示、再試行を促す |

※ 重要: エラーハンドリングの実装はストアが唯一の責務を持つ。
  コンポーネントはストアのerror状態を参照してUIに表示する。
  コンポーネント側でtry-catchでエラーを処理してはならない（二重処理を防ぐため）。
-->

---

## 5. 使用例

### 5.1 コンポーネントでのストア利用

<!--
Vueコンポーネントでのストアの使用例を記載
例:
```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useCommentStore } from '@/stores/commentStore'

const props = defineProps<{
  todoId: number
}>()

const commentStore = useCommentStore()

// コメント一覧を取得
onMounted(async () => {
  try {
    await commentStore.fetchComments(props.todoId)
  } catch (err) {
    console.error('コメント取得エラー:', err)
  }
})

// コメントを投稿
async function handleSubmit(content: string, userId: number) {
  try {
    await commentStore.createComment(props.todoId, { content, userId })
  } catch (err) {
    console.error('コメント投稿エラー:', err)
  }
}

// コメントを削除
async function handleDelete(commentId: number) {
  if (!confirm('コメントを削除しますか?')) return

  try {
    await commentStore.deleteComment(commentId)
  } catch (err) {
    console.error('コメント削除エラー:', err)
  }
}
</script>

<template>
  <div>
    <div v-if="commentStore.loading">読み込み中...</div>
    <div v-else-if="commentStore.error" class="error">
      {{ commentStore.error }}
    </div>
    <div v-else-if="!commentStore.hasComments">
      コメントがありません
    </div>
    <div v-else>
      <p>コメント数: {{ commentStore.commentCount }}</p>
      <div v-for="comment in commentStore.sortedComments" :key="comment.id">
        <!-- コメント表示 -->
      </div>
    </div>
  </div>
</template>
```
-->

### 5.2 複数ストア間の連携

<!--
複数のストアを連携させる場合の例を記載（オプション）
例:
```typescript
// todoStore.ts
import { useCommentStore } from './commentStore'

export const useTodoStore = defineStore('todo', () => {
  const commentStore = useCommentStore()

  async function deleteTodo(todoId: number): Promise<void> {
    // ToDoを削除する前にコメントをクリア
    if (commentStore.currentTodoId === todoId) {
      commentStore.clearComments()
    }

    // ToDoを削除...
  }

  return { deleteTodo }
})
```
-->

---

## 6. テスト方針

### 6.1 ユニットテスト

<!--
ストアのユニットテストアプローチを記載（オプション）
例:

- **setActivePinia()**: テスト前にPiniaインスタンスを初期化
- **vi.mock()**: API呼び出しをモック
- **状態検証**: 各Actionの実行前後で状態が正しく変化することを確認
- **エラーケース**: エラー時の状態変化を確認

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useCommentStore } from '@/stores/commentStore'
import { beforeEach, describe, it, expect, vi } from 'vitest'

describe('commentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn()
  })

  it('fetchComments: 正常系', async () => {
    const store = useCommentStore()
    const mockComments = [{ id: 1, content: 'test', ... }]

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockComments
    } as Response)

    await store.fetchComments(1)

    expect(store.comments).toEqual(mockComments)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchComments: エラー系', async () => {
    const store = useCommentStore()

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404
    } as Response)

    await expect(store.fetchComments(1)).rejects.toThrow()
    expect(store.comments).toEqual([])
    expect(store.error).not.toBeNull()
  })
})
```
-->

---

## 7. パフォーマンス考慮事項

<!--
ストアのパフォーマンスに関する考慮事項を記載（オプション）
例:

- **Computed のメモ化**: computed()は依存が変わらない限り再計算しない
- **不要な再描画防止**: toRefs()で必要な状態のみコンポーネントに渡す
- **大量データ**: 仮想スクロールやページネーション を検討
- **キャッシュ戦略**: 同じデータの再取得を避けるキャッシュロジック
-->

---

## 8. ストア設計のベストプラクティス

<!--
このプロジェクトで採用するストア設計のベストプラクティスを記載（オプション）
例:

1. **Composition API スタイル**: defineStore()の第二引数に setup 関数を渡す
2. **TypeScript厳密型付け**: すべての状態・引数・戻り値に型注釈
3. **明確な命名**: State は名詞、Actions は動詞で命名
4. **return で公開API制御**: 必要なもののみ return で公開
5. **コメント充実**: 各State/Getter/Actionの役割をJSDocで記載
6. **エラー処理の一貫性**: すべての非同期Actionで try-catch-finally
7. **状態のリセット**: clearXXX() 関数でストアを初期状態に戻せるようにする
-->

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | <!-- YYYY-MM-DD --> | 初版作成 | <!-- 変更者名 --> |
