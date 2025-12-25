# API詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

コメント機能のREST APIエンドポイント詳細仕様（リクエスト/レスポンス、バリデーション）を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 |
|---------|---------------|------|
| Controller | TodoCommentController | コメントAPIのHTTPリクエスト処理 |

---

## 2. API共通仕様

### 2.1 ベースURL

| 項目 | 値 |
|------|-----|
| 開発環境 | `http://localhost:8080` |
| 本番環境 | `http://localhost:8080` |

### 2.2 共通ヘッダー

| ヘッダー | 値 | 必須 |
|---------|-----|------|
| Content-Type | application/json | POST時必須 |
| Accept | application/json | 推奨 |

### 2.3 共通エラーレスポンス

| ステータスコード | 説明 | 発生条件 |
|---------------|------|---------|
| 400 Bad Request | リクエスト不正 | バリデーションエラー |
| 404 Not Found | リソース未発見 | 指定IDが存在しない |
| 500 Internal Server Error | サーバーエラー | 予期しないエラー |

---

## 3. エンドポイント詳細

### 3.1 GET /api/todos/{todoId}/comments - コメント一覧取得

| 項目 | 内容 |
|------|------|
| URL | `/api/todos/{todoId}/comments` |
| メソッド | GET |
| 概要 | 指定チケットに紐づくコメント一覧を新しい順で取得 |
| 対応機能 | F-002 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|-----|------|------|-----|
| todoId | Long | 要 | ToDoのID | 10 |

**クエリパラメータ**: なし

**リクエストボディ**: なし

#### レスポンス

**成功時 (200 OK)**:

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

| フィールド | 型 | NULL可 | 説明 |
|-----------|-----|--------|------|
| id | Long | NO | コメントID |
| todoId | Long | NO | 紐づくToDoのID |
| userId | Long | YES | 投稿者のユーザーID（削除済みユーザーの場合null） |
| userName | String | YES | 投稿者名（削除済みユーザーの場合null） |
| content | String | NO | コメント内容（最大2000文字） |
| createdAt | String | NO | 投稿日時（ISO8601形式） |

**エラー時**:

| ステータスコード | 条件 | レスポンス例 |
|---------------|------|-------------|
| 404 Not Found | 指定todoIdのチケットが存在しない | なし（空レスポンス） |

**注意事項**:
- コメントが0件の場合は空配列 `[]` を返す
- コメントは作成日時の降順（新しい順）でソートされている

#### 処理フロー

1. パスパラメータから`todoId`を取得
2. `TodoMapper`でチケットの存在確認
   - 存在しない場合は404エラー
3. `TodoCommentMapper.selectByTodoId(todoId)`でコメント一覧を取得
4. コメント一覧をJSON形式で返却

---

### 3.2 POST /api/todos/{todoId}/comments - コメント投稿

| 項目 | 内容 |
|------|------|
| URL | `/api/todos/{todoId}/comments` |
| メソッド | POST |
| 概要 | 指定チケットに新しいコメントを投稿 |
| 対応機能 | F-003 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|-----|------|------|-----|
| todoId | Long | 要 | ToDoのID | 10 |

**クエリパラメータ**: なし

**リクエストボディ**:

```json
{
  "userId": 1,
  "content": "コメント内容をここに記載します。"
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|---------------|
| userId | Long | 要 | 投稿者のユーザーID | 1以上の整数、ユーザーが存在すること |
| content | String | 要 | コメント内容 | 1〜2000文字、空白のみ不可 |

#### レスポンス

**成功時 (201 Created)**:

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

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Long | 作成されたコメントのID |
| todoId | Long | 紐づくToDoのID |
| userId | Long | 投稿者のユーザーID |
| userName | String | 投稿者名 |
| content | String | コメント内容 |
| createdAt | String | 投稿日時（ISO8601形式） |

**エラー時**:

| ステータスコード | 条件 | レスポンス例 |
|---------------|------|-------------|
| 400 Bad Request | content未入力 | `{"error": "Content is required"}` |
| 400 Bad Request | content2000文字超過 | `{"error": "Content must be 2000 characters or less"}` |
| 400 Bad Request | userIdが存在しないユーザー | `{"error": "User not found"}` |
| 404 Not Found | 指定todoIdのチケットが存在しない | なし（空レスポンス） |

#### バリデーション詳細

| 項目 | ルール | エラーメッセージ |
|------|--------|----------------|
| userId | 必須 | "User ID is required" |
| userId | ユーザーが存在すること | "User not found" |
| content | 必須 | "Content is required" |
| content | 空白のみ不可 | "Content is required" |
| content | 最大2000文字 | "Content must be 2000 characters or less" |

#### 処理フロー

1. パスパラメータから`todoId`を取得
2. リクエストボディをパース
3. バリデーション実行
   - `content`が空または2000文字超過の場合は400エラー
   - `userId`が存在しない場合は400エラー
4. `TodoMapper`でチケットの存在確認
   - 存在しない場合は404エラー
5. `TodoCommentMapper.insert(comment)`でコメントを作成
6. 作成されたコメントをユーザー名付きで取得
7. 作成されたコメントをJSON形式で返却

---

### 3.3 DELETE /api/comments/{id} - コメント削除

| 項目 | 内容 |
|------|------|
| URL | `/api/comments/{id}` |
| メソッド | DELETE |
| 概要 | 指定IDのコメントを削除 |
| 対応機能 | F-004 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|-----|------|------|-----|
| id | Long | 要 | コメントID | 5 |

**クエリパラメータ**: なし

**リクエストボディ**: なし

#### レスポンス

**成功時 (204 No Content)**:

レスポンスボディなし

**エラー時**:

| ステータスコード | 条件 | レスポンス例 |
|---------------|------|-------------|
| 404 Not Found | 指定IDのコメントが存在しない | なし（空レスポンス） |

#### 処理フロー

1. パスパラメータから`id`を取得
2. `TodoCommentMapper.selectById(id)`でコメントの存在確認
   - 存在しない場合は404エラー
3. `TodoCommentMapper.deleteById(id)`でコメントを削除
4. 204 No Contentを返却

---

## 4. Controllerクラス設計

### 4.1 クラス概要

| 項目 | 内容 |
|------|------|
| パッケージ | `com.example.demo` |
| クラス名 | `TodoCommentController` |
| アノテーション | `@RestController`, `@RequestMapping("/api")` |

### 4.2 依存関係

| フィールド | 型 | 注入方法 |
|-----------|-----|---------|
| todoCommentService | TodoCommentService | コンストラクタインジェクション（`@Autowired`） |

### 4.3 メソッド一覧

```java
@RestController
@RequestMapping("/api")
public class TodoCommentController {

    private final TodoCommentService todoCommentService;

    @Autowired
    public TodoCommentController(TodoCommentService todoCommentService) {
        this.todoCommentService = todoCommentService;
    }

    /**
     * コメント一覧を取得
     * @param todoId ToDoのID
     * @return コメント一覧
     */
    @GetMapping("/todos/{todoId}/comments")
    public List<TodoComment> getCommentsByTodoId(@PathVariable Long todoId) {
        return todoCommentService.getCommentsByTodoId(todoId);
    }

    /**
     * コメントを投稿
     * @param todoId ToDoのID
     * @param request コメント作成リクエスト
     * @return 作成されたコメント
     */
    @PostMapping("/todos/{todoId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public TodoComment createComment(
            @PathVariable Long todoId,
            @RequestBody CreateCommentRequest request) {
        return todoCommentService.createComment(todoId, request);
    }

    /**
     * コメントを削除
     * @param id コメントID
     */
    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteComment(@PathVariable Long id) {
        todoCommentService.deleteComment(id);
    }
}
```

---

## 5. リクエスト/レスポンス用クラス

### 5.1 CreateCommentRequest

```java
package com.example.demo;

/**
 * コメント作成リクエスト
 */
public class CreateCommentRequest {
    private Long userId;
    private String content;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
```

### 5.2 TodoComment

```java
package com.example.demo;

import java.time.LocalDateTime;

/**
 * コメントエンティティ
 */
public class TodoComment {
    private Long id;
    private Long todoId;
    private Long userId;
    private String userName; // JOINで取得
    private String content;
    private LocalDateTime createdAt;

    // Getters and Setters
    // ... (省略)
}
```

---

## 6. エラーハンドリング

### 6.1 例外ハンドリング

Spring Bootのデフォルトエラーハンドリングを使用。

| 例外 | HTTPステータス | 処理 |
|------|--------------|------|
| チケット未発見 | 404 | ResponseStatusExceptionをスロー |
| ユーザー未発見 | 400 | ResponseStatusExceptionをスロー |
| バリデーションエラー | 400 | ResponseStatusExceptionをスロー |

### 6.2 エラーレスポンス形式

```json
{
  "timestamp": "2025-12-25T15:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Content is required",
  "path": "/api/todos/10/comments"
}
```

---

## 7. curlコマンド例

### 7.1 コメント一覧取得

```bash
curl -X GET http://localhost:8080/api/todos/10/comments
```

### 7.2 コメント投稿

```bash
curl -X POST http://localhost:8080/api/todos/10/comments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "content": "テストコメントです。"
  }'
```

### 7.3 コメント削除

```bash
curl -X DELETE http://localhost:8080/api/comments/5
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
