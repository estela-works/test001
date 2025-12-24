# バックエンド基本設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本設計書の目的

本案件においてバックエンドに必要な変更（ディレクトリ移動・CORS設定）を定義する。

### 1.2 バックエンドの役割

| 責務 | 説明 |
|------|------|
| データ管理 | H2データベースによるデータ永続化 |
| ビジネスロジック | ToDo・案件・ユーザーのCRUD処理 |
| API提供 | フロントエンドへのREST API提供 |
| バリデーション | 入力データの妥当性検証 |
| **CORS対応** | 【新規】開発時のクロスオリジンリクエスト許可 |

### 1.3 本案件での変更範囲

| 変更種別 | 内容 |
|---------|------|
| ディレクトリ移動 | src/main → src/backend への移動 |
| CORS設定追加 | 開発環境向けCORS設定 |
| 静的ファイル配信 | resources/staticの扱い変更 |

**注意**: 既存のAPI仕様・ビジネスロジックは変更しない。

---

## 2. 機能要件（既存維持）

### 2.1 機能一覧

本案件では既存機能を維持する。参考として一覧を示す。

| ID | 機能名 | 概要 | 変更 |
|----|--------|------|------|
| F-001 | ToDo一覧取得 | ToDoリストを取得 | なし |
| F-002 | ToDo作成 | 新規ToDoを作成 | なし |
| F-003 | ToDo更新 | ToDoの完了状態を切替 | なし |
| F-004 | ToDo削除 | ToDoを削除 | なし |
| F-005 | 案件一覧取得 | 案件リストを取得 | なし |
| F-006 | 案件作成 | 新規案件を作成 | なし |
| F-007 | 案件削除 | 案件と配下ToDoを削除 | なし |
| F-008 | 案件統計取得 | 案件ごとのToDo統計 | なし |
| F-009 | ユーザー一覧取得 | ユーザーリストを取得 | なし |
| F-010 | ユーザー作成 | 新規ユーザーを作成 | なし |
| F-011 | ユーザー削除 | ユーザーを削除 | なし |

---

## 3. ディレクトリ構成変更

### 3.1 現行構成

```
src/
├── main/
│   ├── java/com/example/demo/
│   │   ├── SimpleSpringApplication.java
│   │   ├── *Controller.java
│   │   ├── *Service.java
│   │   ├── *Mapper.java
│   │   └── *.java
│   └── resources/
│       ├── static/           # 静的HTMLファイル
│       ├── application.properties
│       └── schema.sql
└── test/
```

### 3.2 新構成

```
src/
├── frontend/                 # 【新規】Vueフロントエンド
│   └── ... (別設計書参照)
│
├── backend/                  # 【移動】バックエンド
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── SimpleSpringApplication.java
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java    # 【新規】CORS設定
│   │   │   ├── *Controller.java
│   │   │   ├── *Service.java
│   │   │   ├── *Mapper.java
│   │   │   └── *.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql
│   └── test/
│       └── java/             # JUnitテスト
│
└── test/
    └── e2e/                  # Playwright E2Eテスト（既存維持）
```

### 3.3 Maven設定変更

pom.xmlのソースディレクトリ設定を変更する。

```xml
<build>
    <sourceDirectory>src/backend/main/java</sourceDirectory>
    <resources>
        <resource>
            <directory>src/backend/main/resources</directory>
        </resource>
    </resources>
    <testSourceDirectory>src/backend/test/java</testSourceDirectory>
</build>
```

---

## 4. CORS設定

### 4.1 設定目的

開発環境でフロントエンド開発サーバー（localhost:5173）からバックエンドAPI（localhost:8080）へのリクエストを許可する。

### 4.2 設定内容

| 項目 | 値 |
|------|-----|
| 許可オリジン | http://localhost:5173（開発時のみ） |
| 許可メソッド | GET, POST, PUT, PATCH, DELETE, OPTIONS |
| 許可ヘッダー | Content-Type |
| 資格情報 | 不要（認証なし） |

### 4.3 実装方針

Spring Bootの`@Configuration`クラスで`WebMvcConfigurer`を実装する。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("Content-Type");
    }
}
```

### 4.4 本番環境での考慮

本番環境では:
- フロントエンドのビルド成果物をSpring Bootのresources/staticに配置
- 同一オリジンとなるためCORS不要
- または環境変数でCORS設定を制御

---

## 5. API要件（既存維持）

### 5.1 エンドポイント一覧

| メソッド | パス | 機能 | 変更 |
|---------|------|------|------|
| GET | /api/todos | ToDo一覧取得 | なし |
| GET | /api/todos?projectId={id} | 案件別ToDo取得 | なし |
| POST | /api/todos | ToDo作成 | なし |
| PUT | /api/todos/{id} | ToDo更新 | なし |
| PATCH | /api/todos/{id}/toggle | ToDo完了切替 | なし |
| DELETE | /api/todos/{id} | ToDo削除 | なし |
| GET | /api/projects | 案件一覧取得 | なし |
| GET | /api/projects/{id} | 案件詳細取得 | なし |
| GET | /api/projects/{id}/stats | 案件統計取得 | なし |
| POST | /api/projects | 案件作成 | なし |
| DELETE | /api/projects/{id} | 案件削除 | なし |
| GET | /api/users | ユーザー一覧取得 | なし |
| POST | /api/users | ユーザー作成 | なし |
| DELETE | /api/users/{id} | ユーザー削除 | なし |

### 5.2 レスポンス形式（既存維持）

**ToDo**:
```json
{
  "id": 1,
  "title": "タスク名",
  "description": "説明",
  "completed": false,
  "startDate": "2024-12-24",
  "dueDate": "2024-12-31",
  "projectId": 1,
  "assigneeId": 1,
  "assigneeName": "担当者名",
  "createdAt": "2024-12-24T10:00:00"
}
```

**案件**:
```json
{
  "id": 1,
  "name": "案件名",
  "description": "説明",
  "createdAt": "2024-12-24T10:00:00"
}
```

**ユーザー**:
```json
{
  "id": 1,
  "name": "ユーザー名",
  "createdAt": "2024-12-24T10:00:00"
}
```

### 5.3 エラーレスポンス（既存維持）

| ステータス | 条件 |
|-----------|------|
| 400 Bad Request | バリデーションエラー |
| 404 Not Found | リソースが存在しない |
| 409 Conflict | 重複エラー（ユーザー名など） |

---

## 6. 静的ファイル配信

### 6.1 開発環境

| 配信元 | URL | 内容 |
|-------|-----|------|
| Vite dev server | http://localhost:5173 | Vue開発版 |
| Spring Boot | http://localhost:8080/api/* | REST API |

### 6.2 本番環境（将来）

| 配信元 | URL | 内容 |
|-------|-----|------|
| Spring Boot | http://localhost:8080 | Vueビルド成果物 |
| Spring Boot | http://localhost:8080/api/* | REST API |

Viteでビルドした成果物を`src/backend/main/resources/static`に配置する。

---

## 7. 非機能要件

### 7.1 性能要件（既存維持）

| 項目 | 要件 |
|------|------|
| API応答時間 | 1秒以内 |
| 同時アクセス | 複数リクエストの安全な処理 |

### 7.2 セキュリティ要件（既存維持）

| 項目 | 対応 |
|------|------|
| 認証 | なし（現状維持） |
| 入力バリデーション | 必須チェック、文字数制限 |
| SQLインジェクション | MyBatisパラメータバインディング |

---

## 8. 制約条件

| 項目 | 制約 |
|------|------|
| フレームワーク | Spring Boot 3.2 |
| Java | 17 |
| データベース | H2 Database（ファイルベース） |
| ORM | MyBatis |

---

## 9. 移行手順

### 9.1 ディレクトリ移動

1. `src/main` → `src/backend/main` へ移動
2. `src/test/java` → `src/backend/test/java` へ移動（JUnitテストのみ）
3. `src/test/e2e` は既存位置に維持

### 9.2 pom.xml更新

1. sourceDirectoryを`src/backend/main/java`に変更
2. resourcesディレクトリを`src/backend/main/resources`に変更
3. testSourceDirectoryを`src/backend/test/java`に変更

### 9.3 CORS設定追加

1. `CorsConfig.java`を`config`パッケージに作成
2. 開発環境向けCORS設定を実装

### 9.4 動作確認

1. `mvnw.cmd clean compile` でビルド確認
2. `mvnw.cmd spring-boot:run` で起動確認
3. 既存E2Eテストでリグレッション確認

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
