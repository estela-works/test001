# コンポーネントカタログ

<!--
このテンプレートはVue.jsコンポーネントの一覧と詳細仕様を記録するために使用します。
各コンポーネントのProps、Emits、用途を標準レベルで記載します。
-->

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | <!-- YYYY-MM-DD --> |
| 総コンポーネント数 | <!-- 例: 25 --> |

---

## 1. ページコンポーネント（views/）

<!--
ルーティングに対応するトップレベルのページコンポーネントを記載します。
-->

| コンポーネント | ファイルパス | ルート | 用途 |
|--------------|-------------|-------|------|
| HomeView.vue | views/HomeView.vue | / | ホーム画面 |
| TodoView.vue | views/TodoView.vue | /todos | ToDo一覧画面 |
| <!-- コンポーネント名 --> | <!-- パス --> | <!-- ルート --> | <!-- 用途 --> |

### 1.1 HomeView.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/views/HomeView.vue` |
| ルート | `/` |
| 用途 | アプリケーションのホーム画面。各機能へのナビゲーションを提供 |

#### 使用コンポーネント

| コンポーネント | 用途 |
|--------------|------|
| NavCard | ナビゲーションカード表示 |
| Header | ページヘッダー |

#### 使用ストア

| ストア | 用途 |
|--------|------|
| <!-- ストア名 --> | <!-- 用途 --> |

---

### 1.2 TodoView.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/views/TodoView.vue` |
| ルート | `/todos` |
| 用途 | ToDo一覧の表示・管理 |

#### 使用コンポーネント

| コンポーネント | 用途 |
|--------------|------|
| TodoForm | ToDo作成フォーム |
| TodoList | ToDo一覧表示 |
| TodoFilter | フィルタ操作 |
| TodoStats | 統計表示 |

#### 使用ストア

| ストア | 用途 |
|--------|------|
| todoStore | ToDo状態管理 |
| projectStore | プロジェクト一覧取得 |
| userStore | ユーザー一覧取得 |

---

## 2. 共通コンポーネント（components/common/）

<!--
複数の機能で再利用される共通コンポーネントを記載します。
-->

### 2.1 NavCard.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/common/NavCard.vue` |
| 用途 | ホーム画面のナビゲーションカード |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| title | `string` | ✓ | - | カードのタイトル |
| description | `string` | ✓ | - | カードの説明文 |
| to | `string` | ✓ | - | 遷移先のルートパス |
| icon | `string` | - | `'default'` | アイコン種別 |

#### Emits

なし（router-linkによる遷移）

---

### 2.2 LoadingSpinner.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/common/LoadingSpinner.vue` |
| 用途 | ローディング中のスピナー表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| size | `'small' \| 'medium' \| 'large'` | - | `'medium'` | スピナーのサイズ |
| message | `string` | - | `''` | 表示メッセージ |

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
| message | `string` | ✓ | - | 表示するエラーメッセージ |
| dismissible | `boolean` | - | `true` | 閉じるボタンを表示するか |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| dismiss | なし | 閉じるボタンクリック時 |

---

### 2.4 Header.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/common/Header.vue` |
| 用途 | ページヘッダーの表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| title | `string` | ✓ | - | ページタイトル |
| showBackButton | `boolean` | - | `false` | 戻るボタンを表示するか |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| back | なし | 戻るボタンクリック時 |

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
| projects | `Project[]` | ✓ | - | プロジェクト選択肢 |
| users | `User[]` | ✓ | - | 担当者選択肢 |
| disabled | `boolean` | - | `false` | フォーム無効化 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| submit | `CreateTodoRequest` | フォーム送信時 |
| cancel | なし | キャンセル時 |

---

### 3.2 TodoList.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoList.vue` |
| 用途 | ToDo一覧のリスト表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todos | `Todo[]` | ✓ | - | 表示するToDo配列 |
| loading | `boolean` | - | `false` | ローディング状態 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| toggle | `number` (todoId) | 完了状態切り替え時 |
| delete | `number` (todoId) | 削除時 |
| select | `number` (todoId) | 選択時（詳細表示） |

---

### 3.3 TodoItem.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoItem.vue` |
| 用途 | 個別ToDo項目の表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todo | `Todo` | ✓ | - | 表示するToDoデータ |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| toggle | なし | 完了状態切り替え時 |
| delete | なし | 削除時 |
| click | なし | 項目クリック時 |

---

### 3.4 TodoFilter.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoFilter.vue` |
| 用途 | 完了状態でのフィルタリング |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| modelValue | `CompletedFilter` | ✓ | - | 現在のフィルタ状態 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| update:modelValue | `CompletedFilter` | フィルタ変更時 |

---

### 3.5 TodoStats.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoStats.vue` |
| 用途 | ToDo統計情報の表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| stats | `TodoStats` | ✓ | - | 統計データ |

#### Emits

なし

---

### 3.6 TodoDetailModal.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/todo/TodoDetailModal.vue` |
| 用途 | ToDo詳細モーダル表示 |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| todoId | `number` | ✓ | - | 表示するToDoのID |
| isOpen | `boolean` | ✓ | - | モーダル開閉状態 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| close | なし | モーダルを閉じる時 |
| updated | `Todo` | ToDo更新後 |

---

## 4. プロジェクト機能コンポーネント（components/project/）

### 4.1 ProjectForm.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/project/ProjectForm.vue` |
| 用途 | プロジェクト新規作成フォーム |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| disabled | `boolean` | - | `false` | フォーム無効化 |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| submit | `CreateProjectRequest` | フォーム送信時 |

---

### 4.2 ProjectCard.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/project/ProjectCard.vue` |
| 用途 | プロジェクトカード表示（統計情報付き） |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| project | `Project` | ✓ | - | プロジェクトデータ |
| stats | `ProjectStats \| null` | - | `null` | 統計データ |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| delete | なし | 削除時 |
| click | なし | カードクリック時 |

---

## 5. ユーザー機能コンポーネント（components/user/）

### 5.1 UserForm.vue

| 項目 | 内容 |
|------|------|
| ファイル | `src/frontend/src/components/user/UserForm.vue` |
| 用途 | ユーザー新規作成フォーム |

#### Props

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|-----------|------|
| disabled | `boolean` | - | `false` | フォーム無効化 |

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
| user | `User` | ✓ | - | ユーザーデータ |

#### Emits

| 名前 | ペイロード | 説明 |
|------|-----------|------|
| delete | なし | 削除時 |

---

## 6. コンポーネント関係図

<!--
主要なコンポーネントの親子関係を示します。
-->

```
App.vue
└── RouterView
    ├── HomeView
    │   ├── Header
    │   └── NavCard (×N)
    ├── TodoView
    │   ├── Header
    │   ├── TodoForm
    │   ├── TodoFilter
    │   ├── TodoStats
    │   ├── TodoList
    │   │   └── TodoItem (×N)
    │   └── TodoDetailModal
    ├── ProjectView
    │   ├── Header
    │   ├── ProjectForm
    │   └── ProjectCard (×N)
    └── UserView
        ├── Header
        ├── UserForm
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

---

## 8. 更新ガイドライン

### 8.1 新規コンポーネント追加時

1. 該当セクションにコンポーネント情報を追加
2. Props/Emitsを表形式で記載
3. コンポーネント関係図を更新
4. 基本情報の総コンポーネント数を更新

### 8.2 記載項目チェックリスト

- [ ] ファイルパス
- [ ] 用途の説明
- [ ] Props一覧（型、必須、デフォルト、説明）
- [ ] Emits一覧（名前、ペイロード、説明）
- [ ] 使用コンポーネント（ページコンポーネントの場合）
- [ ] 使用ストア（ページコンポーネントの場合）

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | <!-- YYYY-MM-DD --> | 初版作成 | <!-- 変更者名 --> |
