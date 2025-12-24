# アーキテクチャ仕様書

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. ドキュメント情報

| 項目 | 内容 |
|------|------|
| プロジェクト名 | Simple Spring Boot ToDo Application |
| 最終更新日 | 2025-12-22 |

---

## 2. 技術スタック

### 2.1 採用技術一覧

| レイヤー | 技術 | バージョン | 選定理由 |
|---------|------|-----------|----------|
| 言語 | Java | 17 | LTS版、安定性重視 |
| フレームワーク | Spring Boot | 3.2.0 | 迅速な開発、豊富なエコシステム |
| ビルド | Maven | 3.x | 標準的なビルドツール |
| Webサーバー | 組み込みTomcat | - | Spring Boot標準、設定不要 |
| O/Rマッパー | MyBatis | 3.0.3 | SQLを完全制御可能、手書きSQLによる明示的なDB操作 |
| データベース | H2 Database | (Boot管理) | 軽量な組み込みDB、開発環境に最適 |
| フロントエンド | HTML/CSS/JS | - | シンプル、フレームワーク不要 |
| テスト | JUnit 5 + AssertJ | - | Spring Boot標準テストスタック |

### 2.2 依存ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| spring-boot-starter-web | Web機能、REST API |
| mybatis-spring-boot-starter | MyBatisサポート |
| h2 | H2 Database |
| spring-boot-starter-test | テスト機能 |
| mybatis-spring-boot-starter-test | MyBatisテスト機能 |

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
│                    Spring Boot Application                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              静的リソース（HTML/CSS/JS）              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    REST API                          │   │
│  │              （/api/todos エンドポイント）             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                H2 Database（ファイルモード）          │   │
│  │                    ./data/tododb                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ ファイルI/O
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ファイルシステム                        │
│                    ./data/tododb.mv.db                      │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 通信フロー

```
ブラウザ  ──GET /todos.html──▶  静的リソース
          ◀──HTML/CSS/JS────

ブラウザ  ──GET /api/todos──▶  Controller ──▶ Service ──▶ Mapper ──▶ DB
          ◀──JSON──────────   ◀───────────  ◀─────────  ◀────────
```

### 3.3 H2 Consoleアクセス

| 項目 | 値 |
|------|-----|
| URL | http://localhost:8080/h2-console |
| JDBC URL | jdbc:h2:file:./data/tododb |
| User | sa |
| Password | (空) |

---

## 4. アプリケーションアーキテクチャ

### 4.1 レイヤー構成

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                     （Controller層）                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │ HelloController │  │ TodoController  │                  │
│  │   （ホーム）     │  │  （REST API）   │                  │
│  └─────────────────┘  └─────────────────┘                  │
│            責務: リクエスト受付、レスポンス返却、バリデーション  │
├─────────────────────────────────────────────────────────────┤
│                     Business Layer                           │
│                     （Service層）                            │
│              ┌─────────────────┐                            │
│              │   TodoService   │                            │
│              └─────────────────┘                            │
│            責務: ビジネスロジック、Mapper経由でデータ操作       │
├─────────────────────────────────────────────────────────────┤
│                   Data Access Layer                          │
│                     （Mapper層）                             │
│              ┌─────────────────┐                            │
│              │   TodoMapper    │                            │
│              │ (+ XML定義)     │                            │
│              └─────────────────┘                            │
│            責務: SQL実行、データベースアクセス                  │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│                     （Entity層）                             │
│              ┌─────────────────┐                            │
│              │      Todo       │                            │
│              └─────────────────┘                            │
│            責務: データ構造定義                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 レイヤー間の依存関係

| 依存元 | 依存先 | 依存方法 |
|--------|--------|----------|
| Controller | Service | @Autowired（DI） |
| Service | Mapper | @Autowired（DI） |
| Service | Entity | 直接利用 |
| Mapper | Entity | 結果マッピング |
| Controller | Entity | 直接利用（リクエスト/レスポンス） |

### 4.3 各レイヤーの責務

| レイヤー | 責務 | やること | やらないこと |
|---------|------|----------|-------------|
| Controller | API提供 | リクエスト受付、バリデーション、レスポンス返却 | ビジネスロジック、DB操作 |
| Service | ビジネスロジック | 業務ルール適用、Mapper呼び出し | HTTPハンドリング、SQL記述 |
| Mapper | データアクセス | SQL実行、結果マッピング | ビジネスロジック |
| Entity | データ構造 | 属性定義、getter/setter | ロジック |

---

## 5. クラス構成

### 5.1 クラス一覧

```
com.example.demo/
├── SimpleSpringApplication.java   # エントリーポイント
├── HelloController.java           # ホームページ用Controller
├── TodoController.java            # ToDo API用Controller
├── TodoService.java               # ビジネスロジック
├── TodoMapper.java                # MyBatis Mapperインターフェース
└── Todo.java                      # エンティティ

src/main/resources/
├── application.properties         # アプリケーション設定
├── schema.sql                     # テーブル定義DDL
├── data.sql                       # 初期データDML
└── mapper/
    └── TodoMapper.xml             # SQL定義
```

### 5.2 クラス図

```
┌────────────────────────┐
│ SimpleSpringApplication│
│ (@SpringBootApplication)│
└────────────────────────┘

┌────────────────────────┐       ┌────────────────────────┐
│    HelloController     │       │    TodoController      │
│    (@Controller)       │       │    (@RestController)   │
│                        │       │                        │
│ + home(): String       │       │ + getAllTodos()        │
│ + message(): Map       │       │ + getTodoById()        │
└────────────────────────┘       │ + createTodo()         │
                                 │ + updateTodo()         │
                                 │ + toggleComplete()     │
                                 │ + deleteTodo()         │
                                 │ + deleteAllTodos()     │
                                 │ + getStats()           │
                                 └───────────┬────────────┘
                                             │ @Autowired
                                             ▼
                                 ┌────────────────────────┐
                                 │     TodoService        │
                                 │     (@Service)         │
                                 │                        │
                                 │ - todoMapper: TodoMapper│
                                 │                        │
                                 │ + getAllTodos()        │
                                 │ + getTodoById()        │
                                 │ + createTodo()         │
                                 │ + updateTodo()         │
                                 │ + toggleComplete()     │
                                 │ + deleteTodo()         │
                                 │ + deleteAllTodos()     │
                                 │ + getTotalCount()      │
                                 │ + getCompletedCount()  │
                                 │ + getPendingCount()    │
                                 └───────────┬────────────┘
                                             │ @Autowired
                                             ▼
                                 ┌────────────────────────┐
                                 │      TodoMapper        │
                                 │      (@Mapper)         │
                                 │                        │
                                 │ + selectAll()          │
                                 │ + selectById()         │
                                 │ + selectByCompleted()  │
                                 │ + insert()             │
                                 │ + update()             │
                                 │ + deleteById()         │
                                 │ + deleteAll()          │
                                 │ + count()              │
                                 │ + countByCompleted()   │
                                 └───────────┬────────────┘
                                             │ uses
                                             ▼
                                 ┌────────────────────────┐
                                 │         Todo           │
                                 │       (Entity)         │
                                 │                        │
                                 │ - id: Long             │
                                 │ - title: String        │
                                 │ - description: String  │
                                 │ - completed: boolean   │
                                 │ - createdAt: LocalDateTime│
                                 └────────────────────────┘
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

### 6.3 スレッドセーフティ

| 対策 | 説明 |
|------|------|
| HikariCP | Spring Boot標準のコネクションプール |
| H2ロック機構 | データベースレベルでの整合性保証 |

---

## 7. フロントエンド構成

### 7.1 ファイル構成

```
src/main/resources/static/
└── todos.html          # ToDoリスト画面（HTML/CSS/JS一体型）
```

### 7.2 技術選定

| 項目 | 採用 | 理由 |
|------|------|------|
| マークアップ | HTML5 | 標準技術 |
| スタイル | インラインCSS | ファイル分割不要でシンプル |
| ロジック | Vanilla JavaScript | フレームワーク不要でシンプル |
| API通信 | Fetch API | ブラウザ標準、非同期対応 |

---

## 8. 設計原則

### 8.1 採用している原則

| 原則 | 適用箇所 |
|------|----------|
| 単一責任 | Controller/Service/Mapper/Entity の分離 |
| 依存性注入 | @Autowired によるDI |
| 関心の分離 | 層ごとの責務分離 |
| Data Mapper Pattern | MyBatis Mapperによるデータアクセス |

### 8.2 MyBatis採用の利点

| 利点 | 説明 |
|------|------|
| SQL完全制御 | 手書きSQLでクエリを最適化可能 |
| 明示性 | 発行されるSQLが明確 |
| 学習コスト | SQLの知識をそのまま活用 |
| デバッグ | SQLを直接確認・修正可能 |

---

## 9. 拡張ポイント

将来の機能追加時の拡張ポイント:

| 拡張 | 対応方法 |
|------|----------|
| 他RDBMS移行 | application.properties変更、SQL方言対応 |
| ユーザー認証 | Spring Security導入 |
| バリデーション強化 | Bean Validation導入 |
| API仕様書 | OpenAPI/Swagger導入 |
| フロントエンド高度化 | React/Vue等のSPA化 |

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-22 | 初版作成（初期構築） | - |
| 2025-12-22 | H2 Database + MyBatis移行 | 202512_H2DB移行 |
| 2025-12-24 | Java 21 → Java 17 ダウングレード | 20251224_Java17ダウングレード |
