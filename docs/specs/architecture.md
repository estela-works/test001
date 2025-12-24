# アーキテクチャ仕様書

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. ドキュメント情報

| 項目 | 内容 |
|------|------|
| プロジェクト名 | ToDo Application |
| 最終更新日 | 2024-12-24 |

---

## 2. 技術スタック

### 2.1 バックエンド

| レイヤー | 技術 | バージョン | 選定理由 |
|---------|------|-----------|----------|
| 言語 | Java | 17 | LTS版、安定性重視 |
| フレームワーク | Spring Boot | 3.2.0 | 迅速な開発、豊富なエコシステム |
| ビルド | Maven | 3.x | 標準的なビルドツール |
| Webサーバー | 組み込みTomcat | - | Spring Boot標準、設定不要 |
| O/Rマッパー | MyBatis | 3.0.3 | SQLを完全制御可能、手書きSQLによる明示的なDB操作 |
| データベース | H2 Database | (Boot管理) | 軽量な組み込みDB、開発環境に最適 |
| テスト | JUnit 5 + AssertJ | - | Spring Boot標準テストスタック |

### 2.2 フロントエンド

| レイヤー | 技術 | バージョン | 選定理由 |
|---------|------|-----------|----------|
| フレームワーク | Vue.js | 3.4+ | Composition API、TypeScript対応 |
| 状態管理 | Pinia | 2.1+ | Vue 3公式推奨、シンプル |
| ルーティング | Vue Router | 4.2+ | Vue公式ルーター |
| ビルドツール | Vite | 5.0+ | 高速HMR、ネイティブESM対応 |
| 言語 | TypeScript | 5.4+ | 型安全性 |
| テスト | Vitest | 1.2+ | Vite統合、高速テスト |
| Linter | ESLint | 8.x | コード品質管理 |
| Formatter | Prettier | 3.x | コードスタイル統一 |

### 2.3 依存ライブラリ

#### バックエンド

| ライブラリ | 用途 |
|-----------|------|
| spring-boot-starter-web | Web機能、REST API |
| mybatis-spring-boot-starter | MyBatisサポート |
| h2 | H2 Database |
| spring-boot-starter-test | テスト機能 |
| mybatis-spring-boot-starter-test | MyBatisテスト機能 |

#### フロントエンド

| ライブラリ | 用途 |
|-----------|------|
| vue | UIフレームワーク |
| vue-router | クライアントサイドルーティング |
| pinia | 状態管理 |
| @vue/test-utils | コンポーネントテスト |
| jsdom | DOMテスト環境 |

---

## 3. システム構成

### 3.1 全体構成

```
┌─────────────────────────────────────────────────────────────┐
│                        クライアント                          │
│                    （Webブラウザ）                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     開発環境構成                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Vite Dev Server (localhost:5173)             │   │
│  │              Vue.js SPA                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              │ /api/* プロキシ               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Spring Boot (localhost:8080)                   │   │
│  │              REST API                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                               │
│                              │                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              H2 Database（ファイルモード）            │   │
│  │                    ./data/tododb                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     本番環境構成                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Spring Boot (localhost:8080)                   │   │
│  │    ┌─────────────────────────────────────────┐      │   │
│  │    │      静的リソース (Vue ビルド成果物)        │      │   │
│  │    │     /static/index.html, assets/*          │      │   │
│  │    └─────────────────────────────────────────┘      │   │
│  │    ┌─────────────────────────────────────────┐      │   │
│  │    │          REST API (/api/*)               │      │   │
│  │    └─────────────────────────────────────────┘      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 通信フロー

```
開発時:
ブラウザ  ──GET /──────────▶  Vite (5173)
          ◀──Vue SPA──────

ブラウザ  ──GET /api/todos──▶  Vite (5173) ──プロキシ──▶ Spring Boot (8080)
          ◀──JSON────────────────────────────◀──────────

本番時:
ブラウザ  ──GET /──────────▶  Spring Boot (8080)
          ◀──Vue SPA (static)──

ブラウザ  ──GET /api/todos──▶  Spring Boot (8080)
          ◀──JSON───────────
```

### 3.3 ディレクトリ構成

```
src/
├── backend/                      # バックエンド
│   └── main/
│       ├── java/
│       │   └── com/example/demo/
│       │       ├── SimpleSpringApplication.java
│       │       ├── config/
│       │       │   └── CorsConfig.java     # CORS設定
│       │       ├── *Controller.java        # REST Controller
│       │       ├── *Service.java           # Service
│       │       ├── *Mapper.java            # MyBatis Mapper
│       │       └── *.java                  # Entity
│       └── resources/
│           ├── application.properties
│           ├── schema.sql
│           ├── data.sql
│           ├── mapper/*.xml
│           └── static/                     # Vueビルド出力先
│
├── frontend/                     # フロントエンド
│   ├── src/
│   │   ├── assets/               # CSS、画像等
│   │   ├── components/           # Vueコンポーネント
│   │   │   ├── common/           # 共通コンポーネント
│   │   │   ├── todo/             # ToDo関連
│   │   │   ├── project/          # Project関連
│   │   │   └── user/             # User関連
│   │   ├── views/                # ページコンポーネント
│   │   ├── stores/               # Piniaストア
│   │   ├── services/             # API通信層
│   │   ├── types/                # TypeScript型定義
│   │   ├── router/               # Vue Router設定
│   │   ├── composables/          # Composition関数
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── vitest.config.ts
│
└── test/                         # バックエンドテスト
    └── java/
```

### 3.4 H2 Consoleアクセス

| 項目 | 値 |
|------|-----|
| URL | http://localhost:8080/h2-console |
| JDBC URL | jdbc:h2:file:./data/tododb |
| User | sa |
| Password | (空) |

---

## 4. アプリケーションアーキテクチャ

### 4.1 バックエンドレイヤー構成

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                     （Controller層）                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │ TodoController │ │ProjectController│ │ UserController │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│            責務: リクエスト受付、レスポンス返却、バリデーション  │
├─────────────────────────────────────────────────────────────┤
│                     Business Layer                           │
│                     （Service層）                            │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │  TodoService   │ │ ProjectService │ │  UserService   │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│            責務: ビジネスロジック、Mapper経由でデータ操作       │
├─────────────────────────────────────────────────────────────┤
│                   Data Access Layer                          │
│                     （Mapper層）                             │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │   TodoMapper   │ │ ProjectMapper  │ │  UserMapper    │  │
│  │   (+ XML定義)  │ │   (+ XML定義)  │ │  (+ XML定義)   │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│            責務: SQL実行、データベースアクセス                  │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│                     （Entity層）                             │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │      Todo      │ │    Project     │ │      User      │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│            責務: データ構造定義                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 フロントエンドレイヤー構成

```
┌─────────────────────────────────────────────────────────────┐
│                      View Layer                              │
│                    （Vue Components）                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Views: HomeView, TodoView, ProjectView, UserView    │   │
│  │  Components: TodoForm, TodoItem, ProjectCard, etc.   │   │
│  └─────────────────────────────────────────────────────┘   │
│            責務: UI表示、ユーザーインタラクション              │
├─────────────────────────────────────────────────────────────┤
│                     State Layer                              │
│                    （Pinia Stores）                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │   todoStore    │ │  projectStore  │ │   userStore    │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│            責務: 状態管理、ビジネスロジック                    │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                             │
│                   （API Services）                           │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │  todoService   │ │ projectService │ │  userService   │  │
│  │                │ │                │ │                │  │
│  │  apiClient.ts  │ │  (共通HTTP     │ │   クライアント) │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│            責務: API通信、レスポンス変換                      │
├─────────────────────────────────────────────────────────────┤
│                      Type Layer                              │
│                  （TypeScript Types）                        │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │   todo.ts      │ │   project.ts   │ │    user.ts     │  │
│  │   api.ts       │ │                │ │                │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│            責務: 型定義                                      │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 レイヤー間の依存関係

#### バックエンド

| 依存元 | 依存先 | 依存方法 |
|--------|--------|----------|
| Controller | Service | @Autowired（DI） |
| Service | Mapper | @Autowired（DI） |
| Service | Entity | 直接利用 |
| Mapper | Entity | 結果マッピング |
| Controller | Entity | 直接利用（リクエスト/レスポンス） |

#### フロントエンド

| 依存元 | 依存先 | 依存方法 |
|--------|--------|----------|
| View | Store | useTodoStore()等 |
| View | Router | useRoute(), useRouter() |
| Store | Service | import |
| Service | Types | import |
| Store | Types | import |

---

## 5. クラス構成

### 5.1 バックエンドクラス一覧

```
com.example.demo/
├── SimpleSpringApplication.java   # エントリーポイント
├── config/
│   └── CorsConfig.java           # CORS設定
├── TodoController.java           # ToDo API Controller
├── TodoService.java              # ToDo Service
├── TodoMapper.java               # ToDo Mapper
├── Todo.java                     # ToDo Entity
├── ProjectController.java        # Project API Controller
├── ProjectService.java           # Project Service
├── ProjectMapper.java            # Project Mapper
├── Project.java                  # Project Entity
├── ProjectStats.java             # Project統計DTO
├── UserController.java           # User API Controller
├── UserService.java              # User Service
├── UserMapper.java               # User Mapper
└── User.java                     # User Entity

src/backend/main/resources/
├── application.properties         # アプリケーション設定
├── schema.sql                     # テーブル定義DDL
├── data.sql                       # 初期データDML
└── mapper/
    ├── TodoMapper.xml             # Todo SQL定義
    ├── ProjectMapper.xml          # Project SQL定義
    └── UserMapper.xml             # User SQL定義
```

### 5.2 フロントエンドファイル一覧

```
src/frontend/src/
├── main.ts                        # エントリーポイント
├── App.vue                        # ルートコンポーネント
├── router/
│   └── index.ts                   # ルート定義
├── stores/
│   ├── todoStore.ts
│   ├── projectStore.ts
│   └── userStore.ts
├── services/
│   ├── apiClient.ts               # 共通HTTPクライアント
│   ├── todoService.ts
│   ├── projectService.ts
│   └── userService.ts
├── types/
│   ├── todo.ts
│   ├── project.ts
│   ├── user.ts
│   ├── api.ts
│   └── index.ts
├── views/
│   ├── HomeView.vue
│   ├── TodoView.vue
│   ├── ProjectView.vue
│   └── UserView.vue
├── components/
│   ├── Header.vue
│   ├── common/
│   │   ├── LoadingSpinner.vue
│   │   ├── ErrorMessage.vue
│   │   └── NavCard.vue
│   ├── todo/
│   │   ├── TodoForm.vue
│   │   ├── TodoItem.vue
│   │   ├── TodoList.vue
│   │   ├── TodoStats.vue
│   │   └── TodoFilter.vue
│   ├── project/
│   │   ├── ProjectForm.vue
│   │   └── ProjectCard.vue
│   └── user/
│       ├── UserForm.vue
│       └── UserCard.vue
└── composables/
    └── useError.ts
```

---

## 6. データ管理

### 6.1 データストア

| 項目 | 内容 |
|------|------|
| 方式 | H2 Database（ファイルモード） |
| 接続URL | jdbc:h2:file:./data/tododb |
| データファイル | ./data/tododb.mv.db |
| ID採番 | AUTO_INCREMENT |
| 永続化 | あり（ファイルに保存） |

### 6.2 スキーマ管理

| 項目 | 設定 |
|------|------|
| 管理方式 | schema.sql による明示的定義 |
| 実行タイミング | アプリケーション起動時 |
| 初期データ | data.sql で投入 |

### 6.3 フロントエンド状態管理

| Store | 管理対象 |
|-------|----------|
| todoStore | ToDoリスト、フィルタ状態、ローディング/エラー |
| projectStore | 案件リスト、案件別統計、ローディング/エラー |
| userStore | ユーザーリスト、ローディング/エラー |

---

## 7. 設計原則

### 7.1 採用している原則

| 原則 | 適用箇所 |
|------|----------|
| 単一責任 | Controller/Service/Mapper/Entity の分離 |
| 依存性注入 | @Autowired によるDI |
| 関心の分離 | 層ごとの責務分離 |
| Data Mapper Pattern | MyBatis Mapperによるデータアクセス |
| Composition API | Vue 3 Composition APIによる再利用性 |
| 型安全 | TypeScriptによる静的型付け |

### 7.2 フロントエンド設計方針

| 方針 | 説明 |
|------|------|
| Composition API | Options APIより柔軟、TypeScript親和性 |
| Pinia | Vuexより軽量、TypeScript完全対応 |
| 単一ファイルコンポーネント | HTML/CSS/JSの凝集性 |
| コンポーネント分割 | 再利用性、テスタビリティ向上 |

---

## 8. 開発環境

### 8.1 起動方法

```bash
# バックエンド起動
./mvnw spring-boot:run

# フロントエンド開発サーバー起動
cd src/frontend
npm run dev
```

### 8.2 アクセスURL

| 環境 | URL | 説明 |
|------|-----|------|
| 開発 | http://localhost:5173 | Vite開発サーバー |
| 開発 | http://localhost:8080 | Spring Boot API |
| 本番 | http://localhost:8080 | 統合配信 |

### 8.3 ビルド

```bash
# フロントエンドビルド（→ src/backend/main/resources/static へ出力）
cd src/frontend
npm run build

# 統合ビルド確認
./mvnw spring-boot:run
# http://localhost:8080 でVue SPAが配信される
```

---

## 9. 拡張ポイント

将来の機能追加時の拡張ポイント:

| 拡張 | 対応方法 |
|------|----------|
| 他RDBMS移行 | application.properties変更、SQL方言対応 |
| ユーザー認証 | Spring Security + Vue側ルートガード |
| バリデーション強化 | Bean Validation + フロント側Zod等 |
| API仕様書 | OpenAPI/Swagger導入 |
| UIコンポーネント | Vuetify/PrimeVue等導入 |
| SSR | Nuxt.js移行 |

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-22 | 初版作成（初期構築） | - |
| 2025-12-22 | H2 Database + MyBatis移行 | 202512_H2DB移行 |
| 2025-12-24 | Java 21 → Java 17 ダウングレード | 20251224_Java17ダウングレード |
| 2024-12-24 | Vue.js 3移行、フロントエンド/バックエンド分離 | 20241224_vue-migration |
