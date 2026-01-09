# フロントエンド詳細設計書（Vue.js 3）

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | チケット詳細編集機能 |
| 案件ID | 20260108_01_チケット詳細編集機能 |
| 作成日 | 2026-01-08 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |
| 関連型定義設計書 | [detail-design-types.md](./detail-design-types.md) |
| 関連ストア設計書 | [detail-design-store.md](./detail-design-store.md) |

---

## 1. 概要

### 1.1 本設計書の目的

チケット詳細モーダル（`TodoDetailModal.vue`）に編集機能を追加するためのVueコンポーネント実装詳細を定義する。

### 1.2 対象コンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| TodoDetailModal.vue | モーダル | 表示モード⇔編集モードの切り替え管理（改修） |
| TodoEditForm.vue | フォーム | チケット情報の編集フォーム（新規） |

---

## 2. ファイル構成

### 2.1 新規・更新ファイル一覧

```
src/frontend/src/
├── components/
│   └── todo/
│       ├── TodoDetailModal.vue    # チケット詳細モーダル（改修）
│       └── TodoEditForm.vue       # チケット編集フォーム（新規）
├── stores/
│   └── todoStore.ts               # ToDoストア（改修：updateTodo追加）
├── services/
│   └── todoService.ts             # ToDoサービス（改修：update追加）
└── types/
    └── todo.ts                    # 型定義（変更なし、既存のUpdateTodoRequest使用）
```

---

## 3. コンポーネント詳細設計

### 3.1 TodoDetailModal.vue（改修）

#### ファイル

`src/frontend/src/components/todo/TodoDetailModal.vue`

#### テンプレート構造（改修後）

```vue
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- ヘッダー -->
          <div class="modal-header">
            <h2>チケット詳細</h2>
            <button class="close-button" @click="handleClose" aria-label="閉じる">×</button>
          </div>

          <!-- コンテンツ -->
          <div class="modal-content">
            <!-- チケット情報セクション -->
            <section class="todo-info">
              <!-- 表示モード -->
              <template v-if="!isEditMode">
                <div class="info-row">
                  <label>タイトル:</label>
                  <p class="title">{{ todo?.title }}</p>
                </div>
                <!-- ...他の表示項目... -->
                <div class="info-row">
                  <button class="btn-edit" @click="enterEditMode">編集</button>
                </div>
              </template>

              <!-- 編集モード -->
              <TodoEditForm
                v-else
                :todo="todo"
                :users="userStore.users"
                :saving="saving"
                @save="handleSave"
                @cancel="exitEditMode"
              />
            </section>

            <hr class="divider" />

            <!-- コメントセクション（既存） -->
            <section class="comment-section">
              <!-- ...コメント機能... -->
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

#### スクリプト（Composition API）

```typescript
<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { useUserStore } from '@/stores/userStore'
import { useCommentStore } from '@/stores/commentStore'
import TodoEditForm from './TodoEditForm.vue'
import CommentList from './CommentList.vue'
import CommentForm from './CommentForm.vue'
import type { Todo, UpdateTodoRequest } from '@/types'

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
const userStore = useUserStore()
const commentStore = useCommentStore()

// State
const todo = ref<Todo | null>(null)
const isEditMode = ref(false)
const saving = ref(false)

// 編集モードに入る
function enterEditMode() {
  isEditMode.value = true
}

// 編集モードを終了
function exitEditMode() {
  isEditMode.value = false
}

// 保存処理
async function handleSave(request: UpdateTodoRequest) {
  if (!todo.value) return

  saving.value = true
  try {
    await todoStore.updateTodo(todo.value.id, request)
    await loadTodoDetail()
    exitEditMode()
    if (todo.value) {
      emit('todoUpdated', todo.value)
    }
  } catch (error) {
    console.error('チケットの更新に失敗しました:', error)
  } finally {
    saving.value = false
  }
}

// チケット詳細を取得
async function loadTodoDetail() {
  try {
    const todoData = todoStore.todos.find(t => t.id === props.todoId)
    if (todoData) {
      todo.value = todoData
    }
  } catch (error) {
    console.error('チケット詳細の取得に失敗しました:', error)
  }
}

// モーダルを閉じる
function handleClose() {
  exitEditMode()
  emit('close')
}

// オーバーレイクリック
function handleOverlayClick() {
  handleClose()
}

// モーダルが開いた時
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await loadTodoDetail()
    await userStore.fetchUsers() // 担当者選択用
    document.body.style.overflow = 'hidden'
  } else {
    exitEditMode()
    commentStore.clearComments()
    document.body.style.overflow = ''
  }
})

// Escキーでモーダルを閉じる（既存機能維持）
// ...
</script>
```

#### Props定義

| Prop名 | 型 | 必須 | 説明 |
|--------|-----|------|------|
| todoId | number | ✓ | 表示するチケットのID |
| isOpen | boolean | ✓ | モーダルの開閉状態 |

#### Emits定義

| イベント名 | ペイロード | タイミング | 説明 |
|-----------|-----------|-----------|------|
| close | なし | モーダルを閉じる時 | 親コンポーネントに通知 |
| todoUpdated | Todo | チケット更新後 | 更新されたチケットデータを伝える |

#### 状態管理（追加分）

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| isEditMode | Ref\<boolean\> | false | 編集モードかどうか |
| saving | Ref\<boolean\> | false | 保存処理中かどうか |

#### 関数一覧（追加分）

| 関数名 | 引数 | 戻り値 | 概要 |
|--------|------|--------|------|
| enterEditMode | なし | void | 編集モードに切り替え |
| exitEditMode | なし | void | 表示モードに戻る |
| handleSave | request: UpdateTodoRequest | Promise\<void\> | 保存処理を実行 |

---

### 3.2 TodoEditForm.vue（新規）

#### ファイル

`src/frontend/src/components/todo/TodoEditForm.vue`

#### テンプレート構造

```vue
<template>
  <form class="edit-form" @submit.prevent="handleSubmit">
    <!-- タイトル -->
    <div class="form-group">
      <label for="title">タイトル <span class="required">*</span></label>
      <input
        id="title"
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
      <label for="description">説明</label>
      <textarea
        id="description"
        v-model="formData.description"
        placeholder="説明を入力してください（オプション）"
        rows="3"
        :disabled="saving"
      />
    </div>

    <!-- 期間 -->
    <div class="form-row">
      <div class="form-group half">
        <label for="startDate">開始日</label>
        <input
          id="startDate"
          v-model="formData.startDate"
          type="date"
          :disabled="saving"
        />
      </div>
      <div class="form-group half">
        <label for="dueDate">期限日</label>
        <input
          id="dueDate"
          v-model="formData.dueDate"
          type="date"
          :disabled="saving"
        />
      </div>
    </div>
    <span v-if="errors.date" class="error-message">{{ errors.date }}</span>

    <!-- 担当者 -->
    <div class="form-group">
      <label for="assignee">担当者</label>
      <select
        id="assignee"
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
```

#### スクリプト（Composition API）

```typescript
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
</script>
```

#### スタイル

```vue
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
```

#### Props定義

| Prop名 | 型 | 必須 | 説明 |
|--------|-----|------|------|
| todo | Todo \| null | ✓ | 編集対象のチケット |
| users | User[] | ✓ | 担当者選択用ユーザー一覧 |
| saving | boolean | ✓ | 保存処理中かどうか |

#### Emits定義

| イベント名 | ペイロード | タイミング | 説明 |
|-----------|-----------|-----------|------|
| save | UpdateTodoRequest | 保存ボタンクリック時 | 親に更新データを渡す |
| cancel | なし | キャンセルボタンクリック時 | 編集を中止 |

#### 状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| formData | Ref\<FormData\> | {} | フォーム入力値 |
| errors | Ref\<Errors\> | {} | バリデーションエラー |

#### 関数一覧

| 関数名 | 引数 | 戻り値 | 概要 |
|--------|------|--------|------|
| handleSubmit | なし | void | バリデーション後、saveイベントを発火 |
| handleCancel | なし | void | cancelイベントを発火 |
| clearErrors | なし | void | エラー状態をクリア |

---

## 4. 状態管理（Pinia Store）

### 4.1 使用するストア

| ストア名 | 用途 |
|---------|------|
| useTodoStore | チケットの取得・更新 |
| useUserStore | 担当者選択用ユーザー一覧の取得 |
| useCommentStore | コメント機能（既存） |

### 4.2 ストアとの連携

```typescript
// ストアのインポート
const todoStore = useTodoStore()
const userStore = useUserStore()

// 更新処理
await todoStore.updateTodo(todoId, request)

// ユーザー一覧取得
await userStore.fetchUsers()
```

---

## 5. API連携

### 5.1 API呼び出し一覧

| 操作 | API | タイミング | 使用ストアAction |
|------|-----|-----------|-----------------|
| チケット更新 | PUT /api/todos/{id} | 保存ボタンクリック時 | todoStore.updateTodo() |
| ユーザー一覧取得 | GET /api/users | モーダル表示時 | userStore.fetchUsers() |

### 5.2 エラー表示

| エラー種別 | UI表示 |
|-----------|--------|
| 400 Bad Request | フォームにエラーメッセージを表示 |
| 404 Not Found | 「チケットが見つかりません」、モーダルを閉じる |
| ネットワークエラー | 「保存に失敗しました」とトーストで表示 |

---

## 6. イベント処理

### 6.1 ユーザーイベント一覧

| イベント | トリガー要素 | ハンドラ関数 | 処理内容 |
|---------|------------|------------|---------|
| @click | 編集ボタン | enterEditMode() | 編集モードに切り替え |
| @submit.prevent | フォーム | handleSubmit() | 保存処理を実行 |
| @click | キャンセルボタン | handleCancel() | 編集モードを終了 |
| @click | 閉じるボタン | handleClose() | モーダルを閉じる |

### 6.2 ライフサイクルフック

| フック | 処理内容 |
|--------|---------|
| watch(isOpen) | モーダル開閉時の処理、ユーザー一覧取得 |
| watch(todo) | TodoEditFormの初期値設定 |

---

## 7. スタイル設計

### 7.1 追加クラス（TodoDetailModal.vue）

| クラス名 | 用途 |
|---------|------|
| .btn-edit | 編集ボタン |

### 7.2 TodoEditForm.vueの主要クラス

| クラス名 | 用途 |
|---------|------|
| .edit-form | フォームコンテナ |
| .form-group | フォームグループ |
| .form-row | 横並びフォーム行 |
| .form-actions | ボタンコンテナ |
| .error-message | エラーメッセージ |
| .btn-save | 保存ボタン |
| .btn-cancel | キャンセルボタン |

---

## 8. アクセシビリティ

- **フォーカス管理**: 編集モード開始時、タイトル入力欄にフォーカス
- **キーボード操作**: Escキーでモーダルを閉じる（既存機能維持）
- **必須項目表示**: 必須項目に`*`マークを表示
- **エラー表示**: バリデーションエラーは該当フィールド直下に表示

---

## 9. 実装時の注意事項

1. **双方向バインディング**: v-modelでフォームデータを管理
2. **バリデーションタイミング**: 入力時にリアルタイムでバリデーション
3. **保存中の二重送信防止**: saving状態でボタンを無効化
4. **編集キャンセル時**: フォームデータは破棄（元の値に戻す処理は不要、次回表示時にリセット）
5. **モーダルクローズ時**: 編集モードを終了してから閉じる

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2026-01-08 | 初版作成 | Claude |
