# フロントエンド詳細設計書（Vue.js 3）

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | <!-- 例: ToDoチケット詳細モーダル＋コメント機能 --> |
| 案件ID | <!-- YYYYMMDD_案件名 --> |
| 作成日 | <!-- YYYY-MM-DD --> |
| 関連基本設計書 | <!-- [basic-design-frontend.md](./basic-design-frontend.md) --> |
| 関連型定義設計書 | <!-- [detail-design-types.md](./detail-design-types.md) --> |
| 関連ストア設計書 | <!-- [detail-design-store.md](./detail-design-store.md) --> |

---

## 1. 概要

### 1.1 本設計書の目的

<!--
この設計書の目的を記載
例: チケット詳細モーダルとコメント機能のVueコンポーネント実装詳細を定義する。
-->

### 1.2 対象コンポーネント

<!--
作成・更新するコンポーネントの一覧を記載
例:

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| TodoDetailModal.vue | モーダル | チケット詳細とコメント機能の統合 |
| CommentList.vue | リスト | コメント一覧表示 |
| CommentForm.vue | フォーム | コメント投稿 |
| CommentItem.vue | アイテム | 個別コメント表示 |
-->

---

## 2. ファイル構成

### 2.1 新規・更新ファイル一覧

<!--
作成・更新するファイルのディレクトリ構成を記載
例:
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
-->

---

## 3. コンポーネント詳細設計

### 3.1 コンポーネント名.vue

#### ファイル

<!-- 例: src/frontend/src/components/todo/TodoDetailModal.vue -->

#### テンプレート構造

<!--
Vueテンプレートの構造を記載。主要な要素のみ抜粋して記載することを推奨。
例:
```vue
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2>チケット詳細</h2>
            <button class="close-button" @click="handleClose" aria-label="閉じる">×</button>
          </div>

          <div class="modal-content">
            <section class="todo-info">
              <!-- チケット情報 -->
            </section>
            <section class="comment-section">
              <!-- コメント機能 -->
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```
-->

#### スクリプト（Composition API）

<!--
Vue 3 Composition API + TypeScriptでのスクリプトを記載。重要なロジックを中心に記載。
例:
```typescript
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
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

// モーダルが開いた時
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await loadTodoDetail()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
```
-->

#### スタイル

<!--
スコープ付きスタイルを記載。主要なスタイル定義のみ抜粋を推奨。
例:
```vue
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

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
-->

#### Props定義

<!--
Props の概要を表形式で記載（型の詳細はdetail-design-types.mdを参照）
例:

| Prop名 | 必須 | 説明 |
|--------|------|------|
| todoId | ✓ | 表示するチケットのID |
| isOpen | ✓ | モーダルの開閉状態 |

※ 型の詳細仕様はdetail-design-types.mdを参照
-->

#### Emits定義

<!--
Emits の概要を表形式で記載（型の詳細はdetail-design-types.mdを参照）
例:

| イベント名 | タイミング | 説明 |
|-----------|-----------|------|
| close | モーダルを閉じる時 | 親コンポーネントにモーダルを閉じることを通知 |
| todoUpdated | チケット更新後 | 更新されたチケットデータを親に伝える |

※ 型の詳細仕様はdetail-design-types.mdを参照
-->

#### 状態管理

<!--
コンポーネント内部の状態を記載
例:

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| todo | Ref<Todo \| null> | null | 表示中のチケットデータ |
| loading | Ref<boolean> | false | ローディング状態 |
| error | Ref<string \| null> | null | エラーメッセージ |
-->

#### 関数一覧

<!--
コンポーネント内の関数を記載
例:

| 関数名 | 引数 | 戻り値 | 概要 |
|--------|------|--------|------|
| loadTodoDetail | なし | Promise<void> | チケット詳細をAPIから取得 |
| handleClose | なし | void | モーダルを閉じるイベントを発火 |
| handleToggleComplete | なし | Promise<void> | チケットの完了状態を切り替え |
| formatDate | dateStr: string | string | 日付文字列をフォーマット |
-->

---

## 4. 状態管理（Pinia Store）

### 4.1 使用するストア

<!--
コンポーネントが使用するストアを記載
例:

| ストア名 | 用途 |
|---------|------|
| useCommentStore | コメント一覧の取得・作成・削除 |
| useTodoStore | チケット詳細の取得・更新 |
| useUserStore | ユーザー一覧の取得 |
-->

### 4.2 ストアとの連携

<!--
ストアの使用方法を簡潔に記載
例:
```typescript
// ストアのインポート
const commentStore = useCommentStore()

// State参照
console.log(commentStore.comments)

// Getters参照
console.log(commentStore.commentCount)

// Actions呼び出し
await commentStore.fetchComments(todoId)
```
-->

---

## 5. API連携

### 5.1 API呼び出し一覧

<!--
コンポーネントが必要とするAPI操作を記載（実装詳細はdetail-design-store.mdを参照）
例:

| 操作 | API | タイミング | 使用ストアAction |
|------|-----|-----------|-----------------|
| チケット詳細取得 | /api/todos/{id} | モーダル表示時 | todoStore.getTodoById() |
| チケット完了切替 | /api/todos/{id}/toggle | 完了ボタンクリック時 | todoStore.toggleComplete() |

※ API呼び出しの実装詳細はdetail-design-store.mdを参照
  コンポーネントから直接fetch()を呼び出さず、必ずストアのActionsを経由する
-->

### 5.2 エラー表示

<!--
エラー状態のUI表示方法を記載（エラーハンドリングの実装はdetail-design-store.mdを参照）
例:

| エラー種別 | UI表示 |
|-----------|--------|
| ネットワークエラー | エラーメッセージを表示、リトライボタンを提供 |
| 404 Not Found | 「データが見つかりません」と表示、モーダルを閉じる |
| 400 Bad Request | バリデーションエラーメッセージを各フィールドに表示 |

※ エラーハンドリングの実装詳細はdetail-design-store.mdを参照
  コンポーネントはストアのerror状態を参照してUIに表示する
-->

---

## 6. イベント処理

### 6.1 ユーザーイベント一覧

<!--
ユーザー操作とイベント処理を記載
例:

| イベント | トリガー要素 | ハンドラ関数 | 処理内容 |
|---------|------------|------------|---------|
| @click | 閉じるボタン | handleClose() | モーダルを閉じる |
| @click | オーバーレイ | handleOverlayClick() | モーダルを閉じる |
| @submit | フォーム | handleSubmit() | コメントを投稿 |
| Escキー | document | handleKeyDown() | モーダルを閉じる |
-->

### 6.2 ライフサイクルフック

<!--
Vueライフサイクルフックでの処理を記載（オプション）
例:

| フック | 処理内容 |
|--------|---------|
| onMounted | 初期データの取得 |
| onUnmounted | イベントリスナーのクリーンアップ、body overflow復元 |
| watch(isOpen) | モーダル開閉時の処理、データ取得、スクロール制御 |
-->

---

## 7. スタイル設計

### 7.1 主要クラス

<!--
スタイル定義の主要クラスを記載（オプション）
例:

| クラス名 | 用途 |
|---------|------|
| .modal-overlay | モーダル背景オーバーレイ |
| .modal-container | モーダル本体コンテナ |
| .modal-header | モーダルヘッダー |
| .close-button | 閉じるボタン |
-->

### 7.2 レスポンシブ対応

<!--
レスポンシブデザインの方針を記載（オプション）
例:

| ブレークポイント | 対応 |
|---------------|------|
| デスクトップ (>768px) | モーダル幅: 800px、2カラムレイアウト |
| タブレット (768px以下) | モーダル幅: 90vw、1カラムレイアウト |
| モバイル (480px以下) | モーダル全画面表示、フォントサイズ縮小 |
-->

---

## 8. アクセシビリティ

<!--
アクセシビリティ対応を記載（オプション）
例:

- **ARIA属性**: モーダルに `role="dialog"` を付与
- **フォーカス管理**: モーダル表示時、最初のフォーカス可能要素にフォーカス
- **キーボード操作**: Escキーでモーダルを閉じる、Tabキーでフォーカス移動
- **スクリーンリーダー**: 閉じるボタンに `aria-label="閉じる"`
-->

---

## 9. パフォーマンス考慮事項

<!--
パフォーマンス最適化の方針を記載（オプション）
例:

- **Teleport使用**: モーダルをbodyに移動してz-index問題を回避
- **v-if vs v-show**: モーダルは頻繁に開閉しないため v-if を使用
- **Lazy Loading**: コメント一覧は表示時にのみ取得
-->

---

## 10. 実装時の注意事項

<!--
実装時の注意点を記載（オプション）
例:

1. **Teleport使用時の注意**: Teleportは`<body>`に移動するため、親コンポーネントのスタイルが適用されない
2. **メモリリーク防止**: onUnmountedでイベントリスナーを必ずクリーンアップ
3. **型安全性**: Props・Emits・Storeは必ず型定義を使用
4. **エラーバウンダリ**: 予期しないエラーは親コンポーネントでキャッチ
5. **ローディング状態**: API呼び出し中は二重送信を防ぐため、ボタンを無効化
-->

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | <!-- YYYY-MM-DD --> | 初版作成 | <!-- 変更者名 --> |
