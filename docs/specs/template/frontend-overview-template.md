# フロントエンド概要

<!--
このテンプレートはVue.jsフロントエンドの全体像を記録するために使用します。
技術スタック、ディレクトリ構成、データフローを一覧化し、
他の詳細ドキュメントへのナビゲーションを提供します。
-->

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | <!-- YYYY-MM-DD --> |
| フレームワーク | Vue.js 3.x (Composition API) |
| ビルドツール | Vite |
| 言語 | TypeScript |

---

## 1. 技術スタック

### 1.1 コアライブラリ

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| Vue.js | <!-- 例: 3.4.x --> | UIフレームワーク |
| Pinia | <!-- 例: 2.1.x --> | 状態管理 |
| Vue Router | <!-- 例: 4.2.x --> | ルーティング |
| TypeScript | <!-- 例: 5.4.x --> | 型安全性 |

### 1.2 ビルド・開発ツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Vite | <!-- 例: 5.0.x --> | ビルド・開発サーバー |
| ESLint | <!-- 例: 8.x --> | リンター |
| Prettier | <!-- 例: 3.x --> | フォーマッター |

### 1.3 テストツール

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Vitest | <!-- 例: 1.2.x --> | ユニットテスト |
| Playwright | <!-- 例: 1.x --> | E2Eテスト |
| @vue/test-utils | <!-- 例: 2.x --> | コンポーネントテスト |

---

## 2. ディレクトリ構成

<!--
実際のディレクトリ構成に合わせて更新してください。
各フォルダの件数は定期的に確認・更新することを推奨します。
-->

```
src/frontend/src/
├── views/              # ページコンポーネント（X件）
│   ├── HomeView.vue
│   ├── TodoView.vue
│   └── ...
├── components/         # 子コンポーネント
│   ├── common/        # 共通コンポーネント（X件）
│   ├── todo/          # ToDo関連（X件）
│   ├── project/       # プロジェクト関連（X件）
│   └── user/          # ユーザー関連（X件）
├── stores/             # Piniaストア（X件）
│   ├── todoStore.ts
│   ├── projectStore.ts
│   └── ...
├── types/              # TypeScript型定義
│   ├── todo.ts
│   ├── project.ts
│   └── index.ts
├── services/           # API通信層
│   ├── apiClient.ts   # 共通HTTPクライアント
│   ├── todoService.ts
│   └── ...
├── composables/        # カスタムコンポーザブル
│   └── useError.ts
├── router/             # ルーティング設定
│   └── index.ts
└── App.vue             # ルートコンポーネント
```

### 2.1 フォルダ別コンポーネント数

| フォルダ | ファイル数 | 説明 |
|---------|-----------|------|
| views/ | <!-- 例: 5 --> | ページコンポーネント |
| components/common/ | <!-- 例: 4 --> | 共通UI部品 |
| components/todo/ | <!-- 例: 10 --> | ToDo機能コンポーネント |
| components/project/ | <!-- 例: 2 --> | プロジェクト機能コンポーネント |
| components/user/ | <!-- 例: 2 --> | ユーザー機能コンポーネント |
| stores/ | <!-- 例: 4 --> | 状態管理ストア |

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
│  todoStore, projectStore, userStore     │
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

<!--
このプロジェクトで採用している設計原則を記載します。
-->

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
| projectStore | プロジェクト管理 | projects, stats, loading, error |
| userStore | ユーザー管理 | users, loading, error |
| <!-- 追加ストア --> | <!-- 責務 --> | <!-- 状態 --> |

### 4.2 状態管理ルール

<!--
状態管理に関するルールを記載します。
-->

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
| タイムアウト | <!-- 例: 30秒 --> |
| エラーハンドリング | ApiException投げ |

### 5.2 サービス一覧

| サービス | ファイル | 対応API |
|---------|---------|---------|
| todoService | services/todoService.ts | /api/todos/* |
| projectService | services/projectService.ts | /api/projects/* |
| userService | services/userService.ts | /api/users/* |

---

## 6. 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [コンポーネントカタログ](./component-catalog.md) | 全コンポーネントのProps/Emits仕様 |
| [ストアカタログ](./store-catalog.md) | State/Getters/Actions一覧 |
| [型定義カタログ](./type-catalog.md) | TypeScript型定義一覧 |
| [ルーティング仕様](./routing-spec.md) | 全ルート定義 |
| [画面仕様](../screens/index.md) | 各画面の詳細仕様 |

---

## 7. 更新ガイドライン

### 7.1 更新タイミング

| イベント | 更新内容 |
|---------|---------|
| 新規ページ追加 | views/一覧、ルート一覧 |
| 新規コンポーネント追加 | components/一覧 |
| 新規ストア追加 | stores/一覧、状態管理方針 |
| ライブラリ更新 | 技術スタックのバージョン |

### 7.2 確認コマンド

<!--
ディレクトリ構成を確認するためのコマンド例を記載します。
-->

```powershell
# コンポーネント数の確認
Get-ChildItem -Path "src/frontend/src/components" -Recurse -Filter "*.vue" | Measure-Object

# ストア数の確認
Get-ChildItem -Path "src/frontend/src/stores" -Filter "*.ts" | Measure-Object
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | <!-- YYYY-MM-DD --> | 初版作成 | <!-- 変更者名 --> |
