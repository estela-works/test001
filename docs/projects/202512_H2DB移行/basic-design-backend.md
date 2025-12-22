# バックエンド基本設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | H2 Database移行 |
| 案件ID | 202512_H2DB移行 |
| 作成日 | 2025-12-22 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本設計書の目的

H2 Database移行に伴うバックエンドの変更内容を定義する。ConcurrentHashMapによるインメモリ管理からH2 Database + Spring Data JPAへの移行に必要な機能・データ・構成の変更を明確にする。

### 1.2 バックエンドの役割

| 責務 | 現状 | 移行後 |
|------|------|--------|
| データ管理 | ConcurrentHashMapでメモリ上に保持 | H2 Databaseでファイルに永続化 |
| ビジネスロジック | TodoServiceで実装 | 変更なし（Repositoryへ委譲） |
| API提供 | REST API（TodoController） | 変更なし |
| バリデーション | Controllerで必須チェック | 変更なし |

---

## 2. 機能要件

### 2.1 機能一覧

| ID | 機能名 | 概要 | 対応US |
|----|--------|------|--------|
| F-001 | データ永続化 | H2ファイルモードでToDoデータを永続化 | US-001 |
| F-002 | JPA Repository | Spring Data JPAによるデータアクセス層追加 | US-002 |
| F-003 | H2 Console | ブラウザからDB操作可能なコンソール提供 | US-002 |
| F-004 | 初期データ投入 | 空DB時にサンプルToDoを作成 | - |
| F-005 | 自動スキーマ生成 | Hibernateによるテーブル自動作成 | US-003 |

### 2.2 変更対象コンポーネント

| コンポーネント | 変更内容 |
|---------------|---------|
| Todo.java | JPAエンティティ化（@Entity, @Id等のアノテーション追加） |
| TodoService.java | Repository経由でのデータアクセスに変更 |
| TodoRepository.java | 新規作成（Spring Data JPA Repository） |
| application.properties | H2設定追加 |
| pom.xml | 依存関係追加（spring-boot-starter-data-jpa, h2） |

### 2.3 変更なしコンポーネント

| コンポーネント | 備考 |
|---------------|------|
| TodoController.java | APIエンドポイント・レスポンス形式は維持 |
| HelloController.java | 変更なし |
| SimpleSpringApplication.java | 変更なし |

---

## 3. データ要件

### 3.1 データ構造

| データ名 | 概要 | 現状 | 移行後 |
|---------|------|------|--------|
| ToDo | タスク情報 | ConcurrentHashMap | H2 Databaseテーブル |

### 3.2 エンティティ（変更後）

#### Todo

| 属性 | 型 | 必須 | DBカラム | 説明 |
|------|-----|------|----------|------|
| id | Long | 自動 | ID (PK, AUTO_INCREMENT) | 一意識別子 |
| title | String | 必須 | TITLE (VARCHAR) | タスクのタイトル |
| description | String | 任意 | DESCRIPTION (VARCHAR) | タスクの説明 |
| completed | boolean | 自動 | COMPLETED (BOOLEAN) | 完了状態（デフォルト: false） |
| createdAt | LocalDateTime | 自動 | CREATED_AT (TIMESTAMP) | 作成日時 |

### 3.3 テーブル定義

```sql
CREATE TABLE TODO (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(1000),
    COMPLETED BOOLEAN DEFAULT FALSE,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

※ Hibernateのddl-auto設定により自動生成される

---

## 4. API要件

### 4.1 エンドポイント一覧（変更なし）

| メソッド | パス | 機能 | 対応機能 |
|---------|------|------|----------|
| GET | /api/todos | 全ToDo取得（フィルタ可） | 既存維持 |
| GET | /api/todos/{id} | ID指定ToDo取得 | 既存維持 |
| POST | /api/todos | ToDo作成 | 既存維持 |
| PUT | /api/todos/{id} | ToDo更新 | 既存維持 |
| PATCH | /api/todos/{id}/toggle | 完了状態切替 | 既存維持 |
| DELETE | /api/todos/{id} | ToDo削除 | 既存維持 |
| DELETE | /api/todos | 全ToDo削除 | 既存維持 |
| GET | /api/todos/stats | 統計情報取得 | 既存維持 |

### 4.2 レスポンス形式（変更なし）

**成功時（ToDo取得）**:
```json
{
  "id": 1,
  "title": "タスク名",
  "description": "説明",
  "completed": false,
  "createdAt": "2025-12-22T10:00:00"
}
```

**統計情報**:
```json
{
  "total": 3,
  "completed": 1,
  "pending": 2
}
```

### 4.3 エラーレスポンス（変更なし）

| ステータス | 条件 |
|-----------|------|
| 400 Bad Request | titleが空または未指定 |
| 404 Not Found | 指定IDのToDoが存在しない |

---

## 5. 設定要件

### 5.1 application.properties追加項目

| 設定項目 | 値 | 説明 |
|---------|-----|------|
| spring.datasource.url | jdbc:h2:file:./data/tododb | DBファイルパス |
| spring.datasource.driver-class-name | org.h2.Driver | JDBCドライバ |
| spring.datasource.username | sa | DBユーザー名 |
| spring.datasource.password | (空) | DBパスワード |
| spring.jpa.database-platform | org.hibernate.dialect.H2Dialect | Hibernate方言 |
| spring.jpa.hibernate.ddl-auto | update | スキーマ自動更新 |
| spring.h2.console.enabled | true | H2 Console有効化 |
| spring.h2.console.path | /h2-console | コンソールパス |

### 5.2 依存関係追加（pom.xml）

| 依存関係 | 用途 |
|---------|------|
| spring-boot-starter-data-jpa | JPA/Hibernateサポート |
| com.h2database:h2 | H2 Database |

---

## 6. 非機能要件

### 6.1 性能要件

| 項目 | 要件 | 備考 |
|------|------|------|
| API応答時間 | 現状維持（1秒以内） | H2組み込みのため遅延なし |
| 同時アクセス | 複数リクエストの安全な処理 | JPAのトランザクション管理で対応 |

### 6.2 セキュリティ要件

| 項目 | 対応 |
|------|------|
| 認証 | なし（開発環境） |
| H2 Console | ローカルアクセスのみ許可 |
| 入力バリデーション | 既存のtitle必須チェック維持 |

---

## 7. 制約条件

| 項目 | 制約 |
|------|------|
| データベース | H2 Database（ファイルモード） |
| ORM | Spring Data JPA (Hibernate) |
| データ保存先 | ./data/tododb |
| JDKバージョン | 21 |
| Spring Bootバージョン | 3.2.0 |

---

## 8. レイヤー構成（移行後）

```
┌─────────────────────────────────────────────┐
│          TodoController (REST API)          │
│             ※変更なし                        │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          TodoService (ビジネスロジック)       │
│     ※ConcurrentHashMap → Repository        │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│      TodoRepository (Spring Data JPA)       │
│             ※新規追加                        │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│        H2 Database (ファイルモード)          │
│             ※新規追加                        │
└─────────────────────────────────────────────┘
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
