# Simple Spring Boot ToDo Application

Spring Boot 3.2 + Java 17 で構築されたシンプルなToDoアプリケーションです。

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
| トップページ | http://localhost:8080 |
| ToDo管理 | http://localhost:8080/todos.html |
| 案件管理 | http://localhost:8080/projects.html |
| 担当者管理 | http://localhost:8080/users.html |

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
│   │       └── static/               # 静的HTMLファイル
│   └── test/
│       ├── java/                     # JUnitテスト
│       └── e2e/                      # Playwright E2Eテスト
│
├── docs/                             # ドキュメント
│   ├── projects/                     # 案件スコープドキュメント
│   ├── specs/                        # 最新仕様ドキュメント
│   ├── reference/                    # リファレンス（技術ノウハウ集）
│   ├── testing/                      # テストガイド
│   └── implementation/               # 実装ガイド
│
├── data/                             # H2データベースファイル
├── scripts/                          # ユーティリティスクリプト
└── pom.xml                           # Maven設定
```

詳細は [docs/README.md](docs/README.md) を参照。

## 主要機能

| 機能 | 説明 |
|------|------|
| ToDo管理 | タスクの作成・編集・削除・完了状態管理 |
| 案件管理 | プロジェクト/案件の作成・編集・削除 |
| 担当者管理 | ユーザーの作成・編集・削除 |

## API エンドポイント

### ToDo API

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/todos | ToDo一覧取得 |
| POST | /api/todos | ToDo作成 |
| PUT | /api/todos/{id} | ToDo更新 |
| DELETE | /api/todos/{id} | ToDo削除 |

### 案件 API

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/projects | 案件一覧取得 |
| POST | /api/projects | 案件作成 |
| PUT | /api/projects/{id} | 案件更新 |
| DELETE | /api/projects/{id} | 案件削除 |

### 担当者 API

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/users | 担当者一覧取得 |
| POST | /api/users | 担当者作成 |
| PUT | /api/users/{id} | 担当者更新 |
| DELETE | /api/users/{id} | 担当者削除 |

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
| [docs/implementation/](docs/implementation/) | 実装ガイド |
| [docs/testing/](docs/testing/) | テストガイド |
