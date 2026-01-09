# バックエンド基本設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本設計書の目的

チケット詳細モーダルとコメント機能追加に伴うバックエンドの機能・データ・APIの基本設計を定義する。

### 1.2 バックエンドの役割

| 責務 | 説明 |
|------|------|
| データ管理 | ToDoコメントデータの永続化と管理 |
| ビジネスロジック | コメントのCRUD処理、チケットとの関連付け |
| API提供 | コメント管理REST API、チケット詳細取得API |
| バリデーション | コメント内容の必須チェック、文字数制限 |

---

## 2. 機能要件

### 2.1 機能一覧

| ID | 機能名 | 概要 | 対応US |
|----|--------|------|--------|
| F-001 | チケット詳細取得 | チケットIDを指定してチケット詳細情報を取得 | US-001 |
| F-002 | コメント一覧取得 | チケットIDを指定して紐づくコメント一覧を取得 | US-003 |
| F-003 | コメント投稿 | チケットに対して新しいコメントを追加 | US-002 |
| F-004 | コメント削除 | 指定IDのコメントを削除 | US-005 |
| F-005 | 投稿者・日時記録 | コメント投稿時に投稿者と日時を自動記録 | US-004 |

---

## 3. データ要件

### 3.1 データ構造

| データ名 | 概要 | 永続化 |
|---------|------|--------|
| TodoComment | ToDoに紐づくコメントデータ | 要（H2 Database） |
| Todo | ToDoデータ（変更なし） | 要（H2 Database） |
| User | ユーザーデータ（変更なし） | 要（H2 Database） |

### 3.2 エンティティ

#### TodoComment（新規）

| 属性 | 型 | 必須 | 説明 |
|------|-----|------|------|
| id | Long | 自動 | コメント一意識別子（主キー） |
| todoId | Long | 必須 | 紐づくToDoのID（外部キー） |
| userId | Long | 必須 | 投稿者のユーザーID（外部キー） |
| content | String | 必須 | コメント内容（最大2000文字） |
| createdAt | LocalDateTime | 自動 | 投稿日時 |
| userName | String | - | 投稿者名（レスポンス用、非永続化） |

### 3.3 テーブル定義

#### TODOCOMMENTテーブル（新規）

| カラム名 | データ型 | NULL | デフォルト | 制約 |
|---------|----------|------|-----------|------|
| ID | BIGINT | NO | AUTO_INCREMENT | PK |
| TODO_ID | BIGINT | NO | - | FK (TODO.ID) |
| USER_ID | BIGINT | NO | - | FK (USER.ID) |
| CONTENT | VARCHAR(2000) | NO | - | - |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | - |

**外部キー制約**:
- TODO_ID → TODO(ID) ON DELETE CASCADE（チケット削除時にコメントも削除）
- USER_ID → USER(ID) ON DELETE SET NULL（ユーザー削除時はNULLに設定）

**インデックス**:
- TODO_IDにインデックスを作成（コメント一覧取得の高速化）

#### DDL

```sql
CREATE TABLE IF NOT EXISTS TODOCOMMENT (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TODO_ID BIGINT NOT NULL,
    USER_ID BIGINT,
    CONTENT VARCHAR(2000) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TODO_ID) REFERENCES TODO(ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID) ON DELETE SET NULL
);

CREATE INDEX idx_todocomment_todo_id ON TODOCOMMENT(TODO_ID);
```

---

## 4. API要件

### 4.1 エンドポイント一覧

| メソッド | パス | 機能 | 対応機能 |
|---------|------|------|----------|
| GET | /api/todos/{todoId}/comments | コメント一覧取得 | F-002 |
| POST | /api/todos/{todoId}/comments | コメント投稿 | F-003 |
| DELETE | /api/comments/{id} | コメント削除 | F-004 |

---

## 5. API詳細

### 5.1 GET /api/todos/{todoId}/comments - コメント一覧取得

**概要**: 指定チケットに紐づくコメントを新しい順（作成日時降順）で取得

**パスパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| todoId | Long | ToDoのID |

**レスポンス**:

```json
[
  {
    "id": 1,
    "todoId": 10,
    "userId": 2,
    "userName": "鈴木花子",
    "content": "この件について確認しました。問題ありません。",
    "createdAt": "2025-12-25T14:30:00"
  },
  {
    "id": 2,
    "todoId": 10,
    "userId": 1,
    "userName": "山田太郎",
    "content": "進捗状況を報告します。50%完了しています。",
    "createdAt": "2025-12-25T10:15:00"
  }
]
```

| ステータス | 条件 |
|-----------|------|
| 200 | 成功（コメントがない場合は空配列） |
| 404 | 指定todoIdのチケットが存在しない |

---

### 5.2 POST /api/todos/{todoId}/comments - コメント投稿

**概要**: 指定チケットに新しいコメントを追加

**パスパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| todoId | Long | ToDoのID |

**リクエストボディ**:

```json
{
  "userId": 1,
  "content": "コメント内容をここに記載します。"
}
```

| フィールド | 型 | 必須 | 最大文字数 | 説明 |
|-----------|-----|------|-----------|------|
| userId | Long | 必須 | - | 投稿者のユーザーID |
| content | String | 必須 | 2000 | コメント内容 |

**レスポンス**:

```json
{
  "id": 3,
  "todoId": 10,
  "userId": 1,
  "userName": "山田太郎",
  "content": "コメント内容をここに記載します。",
  "createdAt": "2025-12-25T15:00:00"
}
```

| ステータス | 条件 |
|-----------|------|
| 201 | 作成成功 |
| 400 | content未入力、または2000文字超過 |
| 400 | userIdが存在しない |
| 404 | 指定todoIdのチケットが存在しない |

---

### 5.3 DELETE /api/comments/{id} - コメント削除

**概要**: 指定IDのコメントを削除

**パスパラメータ**:

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | Long | コメントID |

| ステータス | 条件 |
|-----------|------|
| 204 | 削除成功 |
| 404 | 指定IDのコメントが存在しない |

---

## 6. クラス構成

### 6.1 追加クラス

| クラス名 | レイヤー | 責務 |
|---------|---------|------|
| TodoComment | Entity | コメントデータ構造定義 |
| TodoCommentController | Controller | コメントAPI提供 |
| TodoCommentService | Service | コメントビジネスロジック |
| TodoCommentMapper | Mapper | コメントデータアクセス |

### 6.2 クラス図（追加部分）

```
┌────────────────────────────────┐
│   TodoCommentController        │
│   (@RestController)            │
│                                │
│ + getCommentsByTodoId()        │
│ + createComment()              │
│ + deleteComment()              │
└───────────┬────────────────────┘
            │ @Autowired
            ▼
┌────────────────────────────────┐
│    TodoCommentService          │
│    (@Service)                  │
│                                │
│ - commentMapper: TodoCommentMapper│
│ - todoMapper: TodoMapper       │
│ - userMapper: UserMapper       │
│                                │
│ + getCommentsByTodoId()        │
│ + createComment()              │
│ + deleteComment()              │
│ + validateTodoExists()         │
│ + validateUserExists()         │
└───────────┬────────────────────┘
            │ @Autowired
            ▼
┌────────────────────────────────┐
│     TodoCommentMapper          │
│     (@Mapper)                  │
│                                │
│ + selectByTodoId()             │
│ + selectById()                 │
│ + insert()                     │
│ + deleteById()                 │
│ + countByTodoId()              │
└───────────┬────────────────────┘
            │ uses
            ▼
┌────────────────────────────────┐
│       TodoComment              │
│       (Entity)                 │
│                                │
│ - id: Long                     │
│ - todoId: Long                 │
│ - userId: Long                 │
│ - userName: String             │
│ - content: String              │
│ - createdAt: LocalDateTime     │
└────────────────────────────────┘
```

---

## 7. ビジネスルール

### 7.1 コメント投稿

| ルールID | ルール | 対応 |
|---------|--------|------|
| BR-001 | コメント内容は必須 | 400エラー |
| BR-002 | コメント内容は2000文字以内 | 400エラー |
| BR-003 | 投稿者（userId）は必須 | 400エラー |
| BR-004 | 存在しないチケットIDへの投稿は不可 | 404エラー |
| BR-005 | 存在しないユーザーIDでの投稿は不可 | 400エラー |
| BR-006 | 投稿日時は自動設定（変更不可） | サーバー側で自動設定 |

### 7.2 コメント削除

| ルールID | ルール | 対応 |
|---------|--------|------|
| BR-007 | 削除対象が存在しない | 404エラー |
| BR-008 | 誰でも任意のコメントを削除可能 | 認証機能がないため制限なし |

### 7.3 コメント一覧取得

| ルールID | ルール | 対応 |
|---------|--------|------|
| BR-009 | コメントは新しい順に表示 | ORDER BY CREATED_AT DESC |
| BR-010 | 存在しないチケットIDの場合 | 404エラー |
| BR-011 | コメントが0件の場合 | 空配列を返却 |

### 7.4 データ整合性

| ルールID | ルール | 対応 |
|---------|--------|------|
| BR-012 | チケット削除時は関連コメントも削除 | ON DELETE CASCADE |
| BR-013 | ユーザー削除時はコメントのuserIdをNULLに | ON DELETE SET NULL |

---

## 8. 非機能要件

### 8.1 性能要件

| 項目 | 要件 |
|------|------|
| コメント一覧取得 | 100件までのコメントを1秒以内に取得 |
| コメント投稿 | 投稿処理を1秒以内に完了 |
| インデックス | TODO_IDにインデックスを作成し検索を高速化 |

### 8.2 セキュリティ要件

| 項目 | 対応 |
|------|------|
| 認証 | なし（既存アプリケーション踏襲） |
| 入力バリデーション | コメント内容の必須・文字数チェック |
| SQLインジェクション対策 | MyBatisのパラメータバインディング使用 |
| XSS対策 | フロントエンドでのHTMLエスケープ |

---

## 9. 制約条件

| 項目 | 制約 |
|------|------|
| データ保存 | H2 Database（既存踏襲） |
| O/Rマッパー | MyBatis（既存踏襲） |
| 外部キー制約 | CASCADE削除、SET NULL削除をサポート |
| 文字数制限 | コメント内容は最大2000文字 |

---

## 10. エラーハンドリング

| エラー | HTTPステータス | レスポンス |
|--------|--------------|-----------|
| コメント内容未入力 | 400 | Bad Request |
| コメント内容2000文字超過 | 400 | Bad Request |
| 存在しないチケットID | 404 | Not Found |
| 存在しないユーザーID | 400 | Bad Request |
| 存在しないコメントID | 404 | Not Found |

---

## 11. データベース初期データ

コメントテーブルには初期データを投入しない（空テーブルで開始）。

---

## 12. 関連設計書

| ドキュメント | 説明 |
|-------------|------|
| [detail-design-api.md](./detail-design-api.md) | コメントAPI詳細設計書（作成予定） |
| [detail-design-sql.md](./detail-design-sql.md) | SQL詳細設計書（作成予定） |
| [../../specs/db-schema.md](../../specs/db-schema.md) | 既存DB構造仕様書 |
| [../../specs/api-catalog.md](../../specs/api-catalog.md) | 既存API一覧 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
