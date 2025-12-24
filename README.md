# Simple Spring Boot ToDo Application

Spring Boot 3.2 + Java 17 で構築されたタスク管理アプリケーションです。

## 必要環境

- Java 17
- Maven（Maven Wrapperが同梱されているため、インストール不要）
- Node.js（E2Eテスト実行時のみ）

## 起動方法

### Windows

```cmd
mvnw.cmd spring-boot:run
```

### Mac/Linux

```bash
./mvnw spring-boot:run
```

## アクセス

アプリケーション起動後、ブラウザで以下にアクセス:

| 画面 | URL |
|------|-----|
| ホーム | http://localhost:8080 |
| チケット管理 | http://localhost:8080/todos.html |
| 案件管理 | http://localhost:8080/projects.html |
| ユーザー管理 | http://localhost:8080/users.html |

## プロジェクト構成

```
test001/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/    # Javaソースコード
│   │   │   ├── SimpleSpringApplication.java
│   │   │   ├── *Controller.java      # REST APIコントローラ
│   │   │   ├── *Service.java         # ビジネスロジック
│   │   │   ├── *Mapper.java          # MyBatis Mapper
│   │   │   ├── *.java                # エンティティ
│   │   │   └── template/             # コードテンプレート
│   │   └── resources/
│   │       ├── static/               # 静的HTMLファイル
│   │       ├── mapper/               # MyBatis XMLマッパー
│   │       ├── schema.sql            # DBスキーマ定義
│   │       └── data.sql              # 初期データ
│   └── test/
│       ├── java/                     # JUnitテスト
│       └── e2e/                      # Playwright E2Eテスト
│
├── docs/                             # ドキュメント
│   ├── projects/                     # 案件スコープドキュメント
│   ├── specs/                        # 最新仕様ドキュメント
│   ├── reference/                    # リファレンス（技術ノウハウ集）
│   └── prompts/                      # エージェント指示プロンプト
│
├── data/                             # H2データベースファイル
├── scripts/                          # ユーティリティスクリプト
└── pom.xml                           # Maven設定
```

詳細は [docs/README.md](docs/README.md) を参照。

## 主要機能

| 機能 | 説明 |
|------|------|
| チケット管理 | チケットの作成・編集・削除・完了状態管理、担当者割り当て |
| 案件管理 | 案件の作成・編集・削除、配下チケットの進捗管理 |
| ユーザー管理 | ユーザーの作成・削除 |

## API エンドポイント

### チケット API (`/api/todos`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/todos | チケット一覧取得 |
| GET | /api/todos?completed={bool} | 完了状態でフィルタ |
| GET | /api/todos/{id} | チケット単一取得 |
| GET | /api/todos/stats | 統計情報取得 |
| POST | /api/todos | チケット作成 |
| PUT | /api/todos/{id} | チケット更新 |
| PATCH | /api/todos/{id}/toggle | 完了状態切替 |
| DELETE | /api/todos/{id} | チケット削除 |
| DELETE | /api/todos | 全件削除 |

### 案件 API (`/api/projects`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/projects | 案件一覧取得 |
| GET | /api/projects/{id} | 案件単一取得 |
| GET | /api/projects/{id}/stats | 案件の統計情報取得 |
| POST | /api/projects | 案件作成 |
| PUT | /api/projects/{id} | 案件更新 |
| DELETE | /api/projects/{id} | 案件削除（配下チケットも削除） |

### ユーザー API (`/api/users`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/users | ユーザー一覧取得 |
| GET | /api/users/{id} | ユーザー単一取得 |
| POST | /api/users | ユーザー作成 |
| DELETE | /api/users/{id} | ユーザー削除 |

詳細は [docs/specs/api-catalog.md](docs/specs/api-catalog.md) を参照。

## テスト

### JUnitテスト

```bash
# Windows
mvnw.cmd test

# Mac/Linux
./mvnw test
```

### E2Eテスト（Playwright）

```bash
cd src/test/e2e
npm install
npx playwright test
```

詳細は [src/test/e2e/README.md](src/test/e2e/README.md) を参照。

テストカタログは [docs/specs/test/](docs/specs/test/) を参照。

## 技術スタック

| 種別 | 技術 |
|------|------|
| バックエンド | Spring Boot 3.2, Java 17 |
| データベース | H2 Database（ファイルベース） |
| ORM | MyBatis |
| フロントエンド | HTML + JavaScript（Vanilla） |
| ユニットテスト | JUnit 5, Mockito |
| E2Eテスト | Playwright |

## ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| [docs/README.md](docs/README.md) | ドキュメント体系の概要 |
| [docs/specs/](docs/specs/) | 最新仕様ドキュメント |
| [docs/projects/](docs/projects/) | 案件別設計ドキュメント |
| [docs/reference/](docs/reference/) | リファレンス（技術ノウハウ集） |
| [docs/prompts/](docs/prompts/) | エージェント指示プロンプト |
