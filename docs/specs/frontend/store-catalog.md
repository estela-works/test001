# ストアカタログ

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2025-12-26 |
| 総ストア数 | 4 |
| 状態管理ライブラリ | Pinia |
| 実装スタイル | Options API / Composition API (setup関数) |

---

## 1. ストア一覧

| ストア名 | ファイル | 責務 | 主な状態 | 実装形式 |
|---------|---------|------|---------|---------|
| todoStore | stores/todoStore.ts | ToDo管理 | todos, filter, loading | Options API |
| projectStore | stores/projectStore.ts | プロジェクト管理 | projects, projectStats | Options API |
| userStore | stores/userStore.ts | ユーザー管理 | users | Options API |
| commentStore | stores/commentStore.ts | コメント管理 | comments, currentTodoId | Composition API |

---

## 2. ストア詳細

### 2.1 todoStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/todoStore.ts` |
| 責務 | ToDo一覧の取得・作成・更新・削除、フィルタ管理 |
| 実装形式 | Options API (defineStore) |

#### State

| 名前 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| todos | `Todo[]` | `[]` | ToDo一覧 |
| loading | `boolean` | `false` | ローディング状態 |
| error | `string \| null` | `null` | エラーメッセージ |
| filter | `'all' \| 'pending' \| 'completed'` | `'all'` | 完了状態フィルタ |
| currentProjectId | `string \| null` | `null` | 現在表示中のプロジェクトID |

#### Getters

| 名前 | 戻り値型 | 説明 |
|------|---------|------|
| filteredTodos | `Todo[]` | フィルタ適用後のToDo一覧 |
| stats | `{ total: number; completed: number; pending: number }` | 統計情報 |

#### Actions

| 名前 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| fetchTodos | `projectId?: string \| null` | `Promise<void>` | ToDo一覧を取得 |
| addTodo | `data: CreateTodoRequest` | `Promise<void>` | ToDoを作成 |
| toggleTodo | `id: number` | `Promise<void>` | 完了状態を切り替え |
| deleteTodo | `id: number` | `Promise<void>` | ToDoを削除 |
| setFilter | `filter: 'all' \| 'pending' \| 'completed'` | `void` | フィルタを設定 |
| clearError | なし | `void` | エラーをクリア |

#### 使用サービス

| サービス | 用途 |
|---------|------|
| todoService | ToDo関連のAPI呼び出し |

---

### 2.2 projectStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/projectStore.ts` |
| 責務 | プロジェクト一覧の取得・作成・削除、統計情報管理 |
| 実装形式 | Options API (defineStore) |

#### State

| 名前 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| projects | `Project[]` | `[]` | プロジェクト一覧 |
| loading | `boolean` | `false` | ローディング状態 |
| error | `string \| null` | `null` | エラーメッセージ |
| projectStats | `Record<number, ProjectStats>` | `{}` | プロジェクト別統計 |
| noProjectStats | `ProjectStats` | `{ total: 0, completed: 0, progressRate: 0 }` | 未分類チケットの統計 |

#### Getters

なし

#### Actions

| 名前 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| fetchProjects | なし | `Promise<void>` | プロジェクト一覧を取得（統計含む） |
| createProject | `data: CreateProjectRequest` | `Promise<void>` | プロジェクトを作成 |
| deleteProject | `id: number` | `Promise<void>` | プロジェクトを削除 |
| fetchProjectStats | `id: number` | `Promise<void>` | プロジェクト別統計を取得 |
| fetchAllStats | なし | `Promise<void>` | 全プロジェクトの統計取得 |
| fetchNoProjectStats | なし | `Promise<void>` | 未分類チケットの統計取得 |
| clearError | なし | `void` | エラーをクリア |

#### 使用サービス

| サービス | 用途 |
|---------|------|
| projectService | プロジェクト関連のAPI呼び出し |

---

### 2.3 userStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/userStore.ts` |
| 責務 | ユーザー一覧の取得・作成・削除 |
| 実装形式 | Options API (defineStore) |

#### State

| 名前 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| users | `User[]` | `[]` | ユーザー一覧 |
| loading | `boolean` | `false` | ローディング状態 |
| error | `string \| null` | `null` | エラーメッセージ |

#### Getters

| 名前 | 戻り値型 | 説明 |
|------|---------|------|
| userCount | `number` | ユーザー総数 |

#### Actions

| 名前 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| fetchUsers | なし | `Promise<void>` | ユーザー一覧を取得 |
| addUser | `name: string` | `Promise<void>` | ユーザーを作成 |
| deleteUser | `id: number` | `Promise<void>` | ユーザーを削除 |
| clearError | なし | `void` | エラーをクリア |

#### 使用サービス

| サービス | 用途 |
|---------|------|
| userService | ユーザー関連のAPI呼び出し |

#### 特記事項

- `addUser`でステータス409（Conflict）の場合、「同じ名前のユーザーが既に存在します」エラーを表示

---

### 2.4 commentStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/commentStore.ts` |
| 責務 | コメント一覧の取得・作成・削除 |
| 実装形式 | Composition API (setup関数) |

#### State

| 名前 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| comments | `Ref<Comment[]>` | `ref([])` | コメント一覧 |
| loading | `Ref<boolean>` | `ref(false)` | ローディング状態 |
| error | `Ref<string \| null>` | `ref(null)` | エラーメッセージ |
| currentTodoId | `Ref<number \| null>` | `ref(null)` | 現在表示中のToDoID |

#### Getters

| 名前 | 戻り値型 | 説明 |
|------|---------|------|
| commentCount | `ComputedRef<number>` | コメント件数 |
| hasComments | `ComputedRef<boolean>` | コメントが存在するか |
| sortedComments | `ComputedRef<Comment[]>` | 新しい順にソート済み |

#### Actions

| 名前 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| fetchComments | `todoId: number` | `Promise<void>` | コメント一覧取得 |
| createComment | `todoId: number, request: CreateCommentRequest` | `Promise<Comment>` | コメント作成 |
| deleteComment | `commentId: number` | `Promise<void>` | コメント削除 |
| clearComments | なし | `void` | コメント一覧クリア |
| clearError | なし | `void` | エラークリア |
| $reset | なし | `void` | ストアを初期状態にリセット |

#### 使用サービス

なし（直接fetch APIを使用）

#### 特記事項

- Composition API形式で実装
- APIエラーメッセージは`COMMENT_ERROR_MESSAGES`定数を使用
- コメント作成時は一覧の先頭に追加（新しい順を維持）

---

## 3. ストア間の依存関係

```
TodoView
    │
    ├─→ todoStore (ToDo一覧表示・操作)
    └─→ userStore (担当者選択肢取得)

TodoTableView
    │
    ├─→ todoStore (ToDo一覧表示・操作)
    ├─→ userStore (担当者フィルタ選択肢)
    └─→ projectStore (案件フィルタ選択肢)

ProjectView
    │
    └─→ projectStore (プロジェクト一覧・統計)

UserView
    │
    └─→ userStore (ユーザー一覧)

TodoDetailModal
    │
    ├─→ todoStore (チケット情報取得)
    └─→ commentStore (コメント一覧・投稿)

CommentForm
    │
    ├─→ commentStore (コメント投稿)
    └─→ userStore (投稿者選択肢)
```

| 呼び出し元 | 呼び出し先 | 用途 |
|-----------|-----------|------|
| TodoView | todoStore | ToDo一覧表示・CRUD |
| TodoView | userStore | 担当者選択肢取得 |
| TodoTableView | todoStore | ToDo一覧表示 |
| TodoTableView | userStore | 担当者フィルタ |
| TodoTableView | projectStore | 案件フィルタ |
| ProjectView | projectStore | プロジェクト一覧・統計 |
| UserView | userStore | ユーザー一覧・CRUD |
| TodoDetailModal | todoStore | チケット情報 |
| TodoDetailModal | commentStore | コメント一覧・投稿 |
| CommentForm | userStore | 投稿者選択肢 |

---

## 4. 共通パターン

### 4.1 ローディング管理

```typescript
async function fetchData() {
  this.loading = true
  this.error = null
  try {
    // API呼び出し
  } catch (e) {
    this.error = 'エラーメッセージ'
    throw e
  } finally {
    this.loading = false
  }
}
```

### 4.2 エラーハンドリング

| ステータス | 処理 |
|-----------|------|
| 400 Bad Request | バリデーションエラーメッセージを設定 |
| 404 Not Found | 「データが見つかりません」を設定 |
| 409 Conflict | 「既に存在します」を設定 |
| 500 Internal Error | 「サーバーエラーが発生しました」を設定 |
| Network Error | 「通信エラーが発生しました」を設定 |

### 4.3 状態リセット

```typescript
function clearError() {
  this.error = null
}

// Composition API版
function $reset() {
  items.value = []
  loading.value = false
  error.value = null
}
```

---

## 5. テスト方針

### 5.1 テストファイル

| ストア | テストファイル | 状態 |
|--------|--------------|------|
| todoStore | todoStore.spec.ts | あり |
| projectStore | projectStore.spec.ts | あり |
| userStore | userStore.spec.ts | あり |
| commentStore | - | なし |

### 5.2 テストパターン

| カテゴリ | テスト内容 |
|---------|-----------|
| State初期値 | 各Stateの初期値が正しいこと |
| Getters | 計算結果が期待値と一致すること |
| Actions（正常系） | API成功時に状態が正しく更新されること |
| Actions（異常系） | APIエラー時にerrorが設定されること |
| ローディング | loading状態が適切に切り替わること |

---

## 6. 更新ガイドライン

### 6.1 新規ストア追加時

1. ストア一覧に情報を追加
2. ストア詳細セクションを追加
3. State/Getters/Actionsを表形式で記載
4. 使用サービスを記載
5. 依存関係がある場合はセクション3を更新
6. 基本情報の総ストア数を更新

### 6.2 記載項目チェックリスト

- [ ] ファイルパス
- [ ] 責務の説明
- [ ] 実装形式（Options API / Composition API）
- [ ] State一覧（名前、型、初期値、説明）
- [ ] Getters一覧（名前、戻り値型、説明）
- [ ] Actions一覧（名前、引数、戻り値、説明）
- [ ] 使用サービス

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成 | Claude |
