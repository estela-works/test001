# 型定義詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | チケット詳細編集機能 |
| 案件ID | 20260108_01_チケット詳細編集機能 |
| 作成日 | 2026-01-08 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |
| 関連ストア設計書 | [detail-design-store.md](./detail-design-store.md) |
| 関連コンポーネント設計書 | [detail-design-frontend.md](./detail-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

チケット編集機能で使用するTypeScript型定義を明確にする。

### 1.2 型定義の変更

| ファイル | 変更 |
|---------|------|
| types/todo.ts | **変更なし**（既存のUpdateTodoRequestを使用） |

---

## 2. 使用する既存型定義

### 2.1 Todo（既存）

```typescript
// src/frontend/src/types/todo.ts

/**
 * ToDoエンティティ
 * APIレスポンスの型
 */
export interface Todo {
  /** ToDo ID */
  id: number

  /** タイトル */
  title: string

  /** 説明（オプション） */
  description: string | null

  /** 完了フラグ */
  completed: boolean

  /** 開始日（YYYY-MM-DD形式） */
  startDate: string | null

  /** 終了日（YYYY-MM-DD形式） */
  dueDate: string | null

  /** 案件ID（null = 未分類） */
  projectId: number | null

  /** 担当者ID（null = 未割当） */
  assigneeId: number | null

  /** 担当者名（結合済み） */
  assigneeName: string | null

  /** 作成日時（ISO8601形式） */
  createdAt: string
}
```

### 2.2 UpdateTodoRequest（既存）

```typescript
// src/frontend/src/types/todo.ts

/**
 * ToDo更新リクエスト
 */
export interface UpdateTodoRequest {
  /** タイトル */
  title?: string

  /** 説明 */
  description?: string

  /** 完了フラグ */
  completed?: boolean

  /** 開始日 */
  startDate?: string | null

  /** 終了日 */
  dueDate?: string | null

  /** 担当者ID */
  assigneeId?: number | null
}
```

### 2.3 User（既存）

```typescript
// src/frontend/src/types/user.ts

/**
 * ユーザーエンティティ
 */
export interface User {
  /** ユーザーID */
  id: number

  /** ユーザー名 */
  name: string
}
```

---

## 3. コンポーネント型定義

### 3.1 TodoDetailModal.vue Props/Emits

```typescript
// Props
interface TodoDetailModalProps {
  todoId: number
  isOpen: boolean
}

// Emits
interface TodoDetailModalEmits {
  close: []
  todoUpdated: [todo: Todo]
}
```

### 3.2 TodoEditForm.vue Props/Emits

```typescript
// Props
interface TodoEditFormProps {
  todo: Todo | null
  users: User[]
  saving: boolean
}

// Emits
interface TodoEditFormEmits {
  save: [request: UpdateTodoRequest]
  cancel: []
}
```

### 3.3 TodoEditForm内部状態

```typescript
// フォームデータ
interface FormData {
  title: string
  description: string
  startDate: string | null
  dueDate: string | null
  assigneeId: number | null
}

// バリデーションエラー
interface FormErrors {
  title: string
  date: string
}
```

---

## 4. 型の使用箇所

| 型 | 使用箇所 |
|---|---------|
| Todo | TodoDetailModal（表示用データ）、TodoEditForm（初期値） |
| UpdateTodoRequest | TodoEditForm（送信データ）、todoStore.updateTodo（引数） |
| User | TodoEditForm（担当者選択肢） |

---

## 5. 変更なしの理由

既存の型定義で本案件の要件を満たすため、新規型の追加は不要。

- `UpdateTodoRequest`: title, description, startDate, dueDate, assigneeIdをすべてカバー
- `Todo`: 表示・編集に必要な全プロパティを持つ
- `User`: 担当者選択に必要なid, nameを持つ

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2026-01-08 | 初版作成 | Claude |
