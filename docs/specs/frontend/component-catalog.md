# コンポーネントカタログ

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2025-12-26 |
| 総コンポーネント数 | 24 |

---

## 1. ページコンポーネント（views/）

| コンポーネント | ファイルパス | ルート | 用途 |
|--------------|-------------|-------|------|
| HomeView.vue | views/HomeView.vue | / | ホーム画面 |
| TodoView.vue | views/TodoView.vue | /todos | ToDo一覧画面 |
| TodoTableView.vue | views/TodoTableView.vue | /todos/table | ToDoテーブル表示 |
| ProjectView.vue | views/ProjectView.vue | /projects | プロジェクト一覧画面 |
| UserView.vue | views/UserView.vue | /users | ユーザー管理画面 |

### 1.1 HomeView.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/views/HomeView.vue` |
| ルート | `/` |
| 用途 | アプリケーションのホーム画面。各機能へのナビゲーションを提供 |

#### 使用コンポーネント

| コンポーネント | 用途 |
|--------------|------|
| NavCard | ナビゲーションカード表示（4枚） |

#### 使用ストア

なし

---

### 1.2 TodoView.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/views/TodoView.vue` |
| ルート | `/todos` |
| 用途 | ToDo一覧の表示・管理（カード形式） |

#### 使用コンポーネント

| コンポーネント | 用途 |
|--------------|------|
| TodoForm | ToDo新規作成フォーム |
| TodoList | ToDo一覧表示 |
| TodoStats | 統計表示 |
| TodoFilter | フィルタ操作 |
| LoadingSpinner | ローディング表示 |
| ErrorMessage | エラー表示 |
| TodoDetailModal | チケット詳細モーダル |

#### 使用ストア

| ストア | 用途 |
|--------|------|
| todoStore | ToDo状態管理 |
| userStore | ユーザー一覧取得 |

---

### 1.3 TodoTableView.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/views/TodoTableView.vue` |
| ルート | `/todos/table` |
| 用途 | ToDo一覧のテーブル表示、検索・フィルタ・ソート機能 |

#### 使用コンポーネント

| コンポーネント | 用途 |
|--------------|------|
| TodoSearchForm | キーワード検索 |
| TodoTableFilter | フィルタパネル |
| TodoTable | テーブル表示 |

#### 使用ストア

| ストア | 用途 |
|--------|------|
| todoStore | ToDo状態管理 |
| userStore | ユーザー一覧取得 |
| projectStore | プロジェクト一覧取得 |

---

### 1.4 ProjectView.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/views/ProjectView.vue` |
| ルート | `/projects` |
| 用途 | プロジェクト一覧の表示・管理 |

#### 使用コンポーネント

| コンポーネント | 用途 |
|--------------|------|
| ProjectForm | プロジェクト作成フォーム |
| ProjectCard | プロジェクトカード表示 |
| LoadingSpinner | ローディング表示 |
| ErrorMessage | エラー表示 |

#### 使用ストア

| ストア | 用途 |
|--------|------|
| projectStore | プロジェクト状態管理 |

---

### 1.5 UserView.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/views/UserView.vue` |
| ルート | `/users` |
| 用途 | ユーザー一覧の表示・管理 |

#### 使用コンポーネント

| コンポーネント | 用途 |
|--------------|------|
| UserForm | ユーザー追加フォーム |
| UserCard | ユーザーカード表示 |
| LoadingSpinner | ローディング表示 |
| ErrorMessage | エラー表示 |

#### 使用ストア

| ストア | 用途 |
|--------|------|
| userStore | ユーザー状態管理 |

---

## 2. 共通コンポーネント（components/common/）

### 2.1 NavCard.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/common/NavCard.vue` |
| 用途 | ホーム画面のナビゲーションカード |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| to | `string` | ○ | - | 遷移先のルートパス |
| icon | `string` | ○ | - | アイコン（絵文字） |
| title | `string` | ○ | - | カードのタイトル |
| description | `string` | ○ | - | カードの説明文 |
| colorClass | `string` | ○ | - | 色クラス（card-todo, card-project等） |

#### Emits

なし（router-linkによる遷移）

---

### 2.2 LoadingSpinner.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/common/LoadingSpinner.vue` |
| 用途 | ローディング中のスピナー表示 |

#### Props

なし

#### Emits

なし

---

### 2.3 ErrorMessage.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/common/ErrorMessage.vue` |
| 用途 | エラーメッセージの表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| message | `string \| null` | ○ | - | 表示するエラーメッセージ |

#### Emits

なし

---

## 3. ToDo機能コンポーネント（components/todo/）

### 3.1 TodoForm.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoForm.vue` |
| 用途 | ToDo新規作成フォーム |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| users | `User[]` | ○ | - | 担当者選択肢 |
| projectId | `string \| null` | - | - | 紐づけるプロジェクトID |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| submit | `CreateTodoRequest` | フォーム送信時 |

---

### 3.2 TodoList.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoList.vue` |
| 用途 | ToDo一覧のリスト表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todos | `Todo[]` | ○ | - | 表示するToDo配列 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| toggle | `number` (todoId) | 完了状態切り替え時 |
| delete | `number` (todoId) | 削除時 |
| click | `number` (todoId) | 項目クリック時 |

---

### 3.3 TodoItem.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoItem.vue` |
| 用途 | 個別ToDo項目の表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todo | `Todo` | ○ | - | 表示するToDoデータ |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| toggle | `number` | 完了状態切り替え時 |
| delete | `number` | 削除時 |
| click | `number` | 項目クリック時 |

---

### 3.4 TodoFilter.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoFilter.vue` |
| 用途 | 完了状態でのフィルタリング（ボタン形式） |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| modelValue | `'all' \| 'pending' \| 'completed'` | ○ | - | 現在のフィルタ状態 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| update:modelValue | `'all' \| 'pending' \| 'completed'` | フィルタ変更時 |

---

### 3.5 TodoStats.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoStats.vue` |
| 用途 | ToDo統計情報の表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| total | `number` | ○ | - | 総数 |
| completed | `number` | ○ | - | 完了数 |
| pending | `number` | ○ | - | 未完了数 |

#### Emits

なし

---

### 3.6 TodoDetailModal.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoDetailModal.vue` |
| 用途 | ToDo詳細モーダル表示（コメント機能付き） |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todoId | `number` | ○ | - | 表示するToDoのID |
| isOpen | `boolean` | ○ | - | モーダル開閉状態 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| close | なし | モーダルを閉じる時 |
| todoUpdated | `Todo` | ToDo更新後 |

---

### 3.7 TodoSearchForm.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoSearchForm.vue` |
| 用途 | キーワード検索フォーム |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| keyword | `string` | ○ | - | 検索キーワード |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| search | `string` | 検索実行時 |

---

### 3.8 TodoTableFilter.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoTableFilter.vue` |
| 用途 | テーブルビュー用のフィルタパネル |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| filter | `FilterState` | ○ | - | フィルタ状態 |
| users | `User[]` | ○ | - | ユーザー一覧 |
| projects | `Project[]` | ○ | - | プロジェクト一覧 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| update:filter | `FilterState` | フィルタ変更時 |
| reset | なし | リセット時 |

---

### 3.9 TodoTable.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoTable.vue` |
| 用途 | ToDoのテーブル表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todos | `Todo[]` | ○ | - | 表示するToDo配列 |
| projects | `Project[]` | ○ | - | プロジェクト一覧 |
| sortKey | `SortKey` | ○ | - | ソートキー |
| sortOrder | `SortOrder` | ○ | - | ソート順序 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| sort | `SortKey` | ソート変更時 |
| toggle | `number` | 完了状態切り替え時 |
| delete | `number` | 削除時 |

---

### 3.10 TodoTableRow.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoTableRow.vue` |
| 用途 | テーブルの1行表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todo | `Todo` | ○ | - | 表示するToDoデータ |
| projects | `Project[]` | ○ | - | プロジェクト一覧 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| toggle | `number` | 完了状態切り替え時 |
| delete | `number` | 削除時 |

---

### 3.11 CommentForm.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/CommentForm.vue` |
| 用途 | コメント投稿フォーム |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todoId | `number` | ○ | - | コメント対象のToDoID |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| commentCreated | なし | コメント作成成功時 |

---

### 3.12 CommentList.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/CommentList.vue` |
| 用途 | コメント一覧表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todoId | `number` | ○ | - | 表示対象のToDoID |

#### Emits

なし

---

### 3.13 CommentItem.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/CommentItem.vue` |
| 用途 | 個別コメント表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| comment | `Comment` | ○ | - | 表示するコメントデータ |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| delete | `number` (commentId) | 削除時 |

---

## 4. プロジェクト機能コンポーネント（components/project/）

### 4.1 ProjectForm.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/project/ProjectForm.vue` |
| 用途 | プロジェクト新規作成フォーム |

#### Props

なし

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| submit | `CreateProjectRequest` | フォーム送信時 |

---

### 4.2 ProjectCard.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/project/ProjectCard.vue` |
| 用途 | プロジェクトカード表示（統計情報・進捗バー付き） |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| project | `Project \| { id: string; name: string; description: string }` | ○ | - | プロジェクトデータ |
| stats | `ProjectStats` | ○ | - | 統計データ |
| isNoProject | `boolean` | - | `false` | 未分類プロジェクトか |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| view | `number \| string` | チケット一覧表示時 |
| delete | `number` | 削除時 |

---

## 5. ユーザー機能コンポーネント（components/user/）

### 5.1 UserForm.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/user/UserForm.vue` |
| 用途 | ユーザー新規追加フォーム |

#### Props

なし

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| submit | `string` (userName) | フォーム送信時 |

---

### 5.2 UserCard.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/user/UserCard.vue` |
| 用途 | ユーザーカード表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| user | `User` | ○ | - | ユーザーデータ |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| delete | `number` | 削除時 |

---

## 6. コンポーネント関係図

```
App.vue
└── RouterView
    ├── HomeView
    │   └── NavCard (×4)
    ├── TodoView
    │   ├── TodoStats
    │   ├── TodoForm
    │   ├── TodoFilter
    │   ├── LoadingSpinner / ErrorMessage
    │   ├── TodoList
    │   │   └── TodoItem (×N)
    │   └── TodoDetailModal
    │       ├── CommentForm
    │       └── CommentList
    │           └── CommentItem (×N)
    ├── TodoTableView
    │   ├── TodoSearchForm
    │   ├── TodoTableFilter
    │   └── TodoTable
    │       └── TodoTableRow (×N)
    ├── ProjectView
    │   ├── ProjectForm
    │   ├── LoadingSpinner / ErrorMessage
    │   └── ProjectCard (×N)
    └── UserView
        ├── UserForm
        ├── LoadingSpinner / ErrorMessage
        └── UserCard (×N)
```

---

## 7. 命名規則

| 種別 | 規則 | 例 |
|------|------|-----|
| ページコンポーネント | `XxxView.vue` | HomeView, TodoView |
| 機能コンポーネント | `XxxYyy.vue` | TodoForm, TodoList |
| 共通コンポーネント | 機能名.vue | LoadingSpinner, ErrorMessage |
| モーダル | `XxxModal.vue` | TodoDetailModal |
| テーブル部品 | `XxxTable.vue`, `XxxTableRow.vue` | TodoTable, TodoTableRow |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成 | Claude |
