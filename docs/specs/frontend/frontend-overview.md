# フロントエンド概要

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2025-12-26 |
| フレームワーク | Vue.js 3.4.x (Composition API) |
| ビルドツール | Vite 5.0.x |
| 言語 | TypeScript 5.4.x |

---

## 1. 技術スタック

### 1.1 コアライブラリ

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| Vue.js | ^3.4.0 | UIフレームワーク |
| Pinia | ^2.1.0 | 状態管理 |
| Vue Router | ^4.2.0 | ルーティング |
| TypeScript | ^5.4.5 | 型安全性 |

### 1.2 ビルド・開発ツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Vite | ^5.0.0 | ビルド・開発サーバー |
| ESLint | ^8.56.0 | リンター |
| Prettier | ^3.2.0 | フォーマッター |
| vue-tsc | ^2.0.29 | 型チェック |

### 1.3 テストツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Vitest | ^1.2.0 | ユニットテスト |
| @vue/test-utils | ^2.4.0 | コンポーネントテスト |
| jsdom | ^23.0.0 | DOM環境シミュレーション |

---

## 2. ディレクトリ構成

```
src/frontend/src/
├── views/              # ページコンポーネント（5件）
│   ├── HomeView.vue
│   ├── TodoView.vue
│   ├── TodoTableView.vue
│   ├── ProjectView.vue
│   └── UserView.vue
├── components/         # 子コンポーネント
│   ├── Header.vue     # ヘッダーコンポーネント
│   ├── common/        # 共通コンポーネント（3件）
│   │   ├── NavCard.vue
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorMessage.vue
│   ├── todo/          # ToDo関連（12件）
│   │   ├── TodoForm.vue
│   │   ├── TodoList.vue
│   │   ├── TodoItem.vue
│   │   ├── TodoFilter.vue
│   │   ├── TodoStats.vue
│   │   ├── TodoDetailModal.vue
│   │   ├── TodoSearchForm.vue
│   │   ├── TodoTableFilter.vue
│   │   ├── TodoTable.vue
│   │   ├── TodoTableRow.vue
│   │   ├── CommentForm.vue
│   │   ├── CommentList.vue
│   │   └── CommentItem.vue
│   ├── project/       # プロジェクト関連（2件）
│   │   ├── ProjectForm.vue
│   │   └── ProjectCard.vue
│   └── user/          # ユーザー関連（2件）
│       ├── UserForm.vue
│       └── UserCard.vue
├── stores/             # Piniaストア（4件）
│   ├── todoStore.ts
│   ├── projectStore.ts
│   ├── userStore.ts
│   └── commentStore.ts
├── types/              # TypeScript型定義（7件）
│   ├── todo.ts
│   ├── project.ts
│   ├── user.ts
│   ├── comment.ts
│   ├── filter.ts
│   ├── api.ts
│   └── index.ts
├── services/           # API通信層（4件）
│   ├── apiClient.ts
│   ├── todoService.ts
│   ├── projectService.ts
│   └── userService.ts
├── composables/        # Composition関数
│   └── useError.ts
├── router/             # ルーティング設定
│   └── index.ts
└── App.vue             # ルートコンポーネント
```

### 2.1 フォルダ別コンポーネント数

| フォルダ | ファイル数 | 説明 |
|---------|-----------|------|
| views/ | 5 | ページコンポーネント |
| components/ (直下) | 1 | Header.vue |
| components/common/ | 3 | 共通UI部品 |
| components/todo/ | 12 | ToDo機能コンポーネント |
| components/project/ | 2 | プロジェクト機能コンポーネント |
| components/user/ | 2 | ユーザー機能コンポーネント |
| stores/ | 4 | 状態管理ストア |
| types/ | 7 | 型定義ファイル |
| services/ | 4 | API通信サービス |
| composables/ | 1 | Composition関数 |

---

## 3. アーキテクチャ

### 3.1 レイヤー構成

```
┌─────────────────────────────────────────┐
│           Views (ページコンポーネント)      │
│  HomeView, TodoView, ProjectView, ...   │
├─────────────────────────────────────────┤
│           Components (子コンポーネント)    │
│  TodoForm, TodoList, ProjectCard, ...   │
├─────────────────────────────────────────┤
│           Stores (Pinia)                │
│  todoStore, projectStore, userStore,    │
│  commentStore                           │
├─────────────────────────────────────────┤
│           Services (API通信層)           │
│  todoService, projectService, ...       │
├─────────────────────────────────────────┤
│           Backend API                   │
│  /api/todos, /api/projects, ...         │
└─────────────────────────────────────────┘
```

### 3.2 データフロー

```
User Action
    ↓
View (イベント発火)
    ↓
Store Action (状態更新 + API呼び出し)
    ↓
Service (HTTP通信)
    ↓
Backend API
    ↓
Service (レスポンス処理)
    ↓
Store State (状態更新)
    ↓
View (リアクティブ再描画)
```

### 3.3 設計原則

| 原則 | 説明 |
|------|------|
| **単方向データフロー** | View → Store → Service の順でデータが流れる |
| **コンポーネント責務分離** | ViewはUI表示、StoreはビジネスロジックとAPI通信 |
| **型安全性** | すべてのデータにTypeScript型を定義 |
| **Composition API** | setup()関数でロジックを構成 |

---

## 4. 状態管理方針

### 4.1 ストア設計

| ストア | 責務 | 主な状態 |
|--------|------|---------|
| todoStore | ToDo管理 | todos, filter, loading, error |
| projectStore | プロジェクト管理 | projects, projectStats, noProjectStats |
| userStore | ユーザー管理 | users, loading, error |
| commentStore | コメント管理 | comments, currentTodoId, loading, error |

### 4.2 状態管理ルール

- **API通信はStoreのActionsで行う**: コンポーネントから直接fetchしない
- **エラー状態はStoreで管理**: コンポーネントはStore.errorを参照
- **ローディング状態はStoreで管理**: API呼び出し中はloading=true
- **計算済みデータはGettersで提供**: フィルタリング、集計等

---

## 5. API通信層

### 5.1 共通クライアント

| 項目 | 設定 |
|------|------|
| ベースURL | `/api` |
| エラーハンドリング | ApiException投げ |

### 5.2 サービス一覧

| サービス | ファイル | 対応API |
|---------|---------|---------|
| todoService | services/todoService.ts | /api/todos/* |
| projectService | services/projectService.ts | /api/projects/* |
| userService | services/userService.ts | /api/users/* |
| apiClient | services/apiClient.ts | 共通HTTPクライアント |

---

## 6. ルーティング一覧

| パス | 名前 | コンポーネント | タイトル |
|------|------|----------------|----------|
| `/` | home | HomeView.vue | ホーム |
| `/todos` | todos | TodoView.vue | チケット管理 |
| `/todos/table` | todos-table | TodoTableView.vue | チケット一覧 |
| `/projects` | projects | ProjectView.vue | 案件管理 |
| `/users` | users | UserView.vue | ユーザー管理 |
| `/*` | - | (リダイレクト→/) | - |

---

## 7. 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [画面仕様](../screens/index.md) | 各画面の詳細仕様 |
| [API仕様](../api-catalog.md) | API一覧 |
| [テンプレート](../template/) | 詳細仕様書テンプレート |

---

## 8. 更新ガイドライン

### 8.1 更新タイミング

| イベント | 更新内容 |
|---------|---------|
| 新規ページ追加 | views/一覧、ルート一覧 |
| 新規コンポーネント追加 | components/一覧 |
| 新規ストア追加 | stores/一覧、状態管理方針 |
| ライブラリ更新 | 技術スタックのバージョン |

### 8.2 確認コマンド

```powershell
# コンポーネント数の確認
Get-ChildItem -Path "src/frontend/src/components" -Recurse -Filter "*.vue" | Measure-Object

# ストア数の確認
Get-ChildItem -Path "src/frontend/src/stores" -Filter "*.ts" -Exclude "*.spec.ts" | Measure-Object
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成 | Claude |
