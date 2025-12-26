# ストアカタログ

<!--
このテンプレートはPiniaストアの一覧と詳細仕様を記録するために使用します。
各ストアのState、Getters、Actionsを標準レベルで記載します。
-->

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | <!-- YYYY-MM-DD --> |
| 総ストア数 | <!-- 例: 4 --> |
| 状態管理ライブラリ | Pinia |
| 実装スタイル | Composition API (setup関数) |

---

## 1. ストア一覧

| ストア名 | ファイル | 責務 | 主な状態 |
|---------|---------|------|---------|
| todoStore | stores/todoStore.ts | ToDo管理 | todos, filter, loading |
| projectStore | stores/projectStore.ts | プロジェクト管理 | projects, stats |
| userStore | stores/userStore.ts | ユーザー管理 | users |
| <!-- ストア名 --> | <!-- ファイル --> | <!-- 責務 --> | <!-- 状態 --> |

---

## 2. ストア詳細

### 2.1 todoStore

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/stores/todoStore.ts` |
| 責務 | ToDo一覧の取得・作成・更新・削除、フィルタ管理 |

#### State

| 名前 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| todos | `Todo[]` | `[]` | ToDo一覧 |
| filter | `CompletedFilter` | `'all'` | 完了状態フィルタ |
| loading | `boolean` | `false` | ローディング状態 |
| error | `string \| null` | `null` | エラーメッセージ |

#### Getters

| 名前 | 戻り値型 | 説明 |
|------|---------|------|
| filteredTodos | `Todo[]` | フィルタ適用後のToDo一覧 |
| stats | `TodoStats` | 統計情報（総数、完了数、未完了数） |
| completedCount | `number` | 完了タスク数 |
| pendingCount | `number` | 未完了タスク数 |

#### Actions

| 名前 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| fetchTodos | `projectId?: number` | `Promise<void>` | ToDo一覧を取得 |
| addTodo | `data: CreateTodoRequest` | `Promise<Todo>` | ToDoを作成 |
| toggleTodo | `id: number` | `Promise<void>` | 完了状態を切り替え |
| deleteTodo | `id: number` | `Promise<void>` | ToDoを削除 |
| setFilter | `filter: CompletedFilter` | `void` | フィルタを設定 |
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

#### State

| 名前 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| projects | `Project[]` | `[]` | プロジェクト一覧 |
| stats | `Map<number, ProjectStats>` | `new Map()` | プロジェクト別統計 |
| loading | `boolean` | `false` | ローディング状態 |
| error | `string \| null` | `null` | エラーメッセージ |

#### Getters

| 名前 | 戻り値型 | 説明 |
|------|---------|------|
| projectCount | `number` | プロジェクト総数 |
| getProjectById | `(id: number) => Project \| undefined` | IDでプロジェクト取得 |

#### Actions

| 名前 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| fetchProjects | なし | `Promise<void>` | プロジェクト一覧を取得 |
| createProject | `data: CreateProjectRequest` | `Promise<Project>` | プロジェクトを作成 |
| deleteProject | `id: number` | `Promise<void>` | プロジェクトを削除 |
| fetchAllStats | なし | `Promise<void>` | 全プロジェクトの統計取得 |
| fetchNoProjectStats | なし | `Promise<void>` | 未分類ToDoの統計取得 |

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
| getUserById | `(id: number) => User \| undefined` | IDでユーザー取得 |

#### Actions

| 名前 | 引数 | 戻り値 | 説明 |
|------|------|--------|------|
| fetchUsers | なし | `Promise<void>` | ユーザー一覧を取得 |
| addUser | `name: string` | `Promise<User>` | ユーザーを作成 |
| deleteUser | `id: number` | `Promise<void>` | ユーザーを削除 |

#### 使用サービス

| サービス | 用途 |
|---------|------|
| userService | ユーザー関連のAPI呼び出し |

---

### 2.4 commentStore（Composition API形式）

<!--
Composition API形式（setup関数内でref/computed使用）のストア例
-->

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

---

## 3. ストア間の依存関係

<!--
複数のストアが連携する場合の関係を記載します。
-->

```
todoStore
    ↓ (使用)
projectStore (プロジェクト一覧の参照)

todoStore
    ↓ (使用)
userStore (ユーザー一覧の参照)

commentStore
    ↓ (関連)
todoStore (ToDo詳細表示時にコメント取得)
```

| 呼び出し元 | 呼び出し先 | 用途 |
|-----------|-----------|------|
| TodoView | projectStore | プロジェクト選択肢取得 |
| TodoView | userStore | 担当者選択肢取得 |
| TodoDetailModal | commentStore | コメント一覧取得 |

---

## 4. 共通パターン

### 4.1 ローディング管理

```typescript
async function fetchData() {
  loading.value = true
  error.value = null
  try {
    // API呼び出し
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'エラーが発生しました'
    throw err
  } finally {
    loading.value = false
  }
}
```

### 4.2 エラーハンドリング

| ステータス | 処理 |
|-----------|------|
| 400 Bad Request | バリデーションエラーメッセージを設定 |
| 404 Not Found | 「データが見つかりません」を設定 |
| 500 Internal Error | 「サーバーエラーが発生しました」を設定 |
| Network Error | 「通信エラーが発生しました」を設定 |

### 4.3 状態リセット

```typescript
function reset() {
  items.value = []
  loading.value = false
  error.value = null
}
```

---

## 5. テスト方針

### 5.1 テストファイル命名

| ストア | テストファイル |
|--------|--------------|
| todoStore | todoStore.spec.ts |
| projectStore | projectStore.spec.ts |
| userStore | userStore.spec.ts |

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
- [ ] State一覧（名前、型、初期値、説明）
- [ ] Getters一覧（名前、戻り値型、説明）
- [ ] Actions一覧（名前、引数、戻り値、説明）
- [ ] 使用サービス

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | <!-- YYYY-MM-DD --> | 初版作成 | <!-- 変更者名 --> |
