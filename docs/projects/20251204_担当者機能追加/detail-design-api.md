# API詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 担当者機能追加 |
| 案件ID | 202512_担当者機能追加 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

ユーザー管理APIの新規作成および既存ToDo APIの変更に関する詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 | 種別 |
|---------|---------------|------|------|
| Controller | UserController | ユーザーAPIの提供 | 新規 |
| Controller | TodoController | ToDo APIの提供 | 変更 |

---

## 2. API共通仕様

### 2.1 ベースURL

| 項目 | 値 |
|------|-----|
| 開発環境 | `http://localhost:8080` |

### 2.2 共通ヘッダー

| ヘッダー | 値 | 必須 |
|---------|-----|------|
| Content-Type | application/json | 要 |

### 2.3 共通エラーレスポンス

| ステータス | 説明 |
|-----------|------|
| 400 Bad Request | リクエスト不正（バリデーションエラー） |
| 404 Not Found | リソース未発見 |
| 409 Conflict | 競合（重複エラー） |
| 500 Internal Server Error | サーバーエラー |

---

## 3. ユーザーAPI詳細（新規）

### 3.1 GET /api/users - ユーザー一覧取得

| 項目 | 内容 |
|------|------|
| URL | `/api/users` |
| メソッド | GET |
| 概要 | 全ユーザーを作成日時昇順で取得 |
| 対応機能 | F-004 |

#### リクエスト

パラメータなし

#### レスポンス

**成功時 (200)**:

```json
[
  {
    "id": 1,
    "name": "山田太郎",
    "createdAt": "2025-12-22T10:00:00"
  },
  {
    "id": 2,
    "name": "鈴木花子",
    "createdAt": "2025-12-22T11:00:00"
  }
]
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Long | ユーザーID |
| name | String | ユーザー名 |
| createdAt | LocalDateTime | 作成日時 |

#### 処理フロー

1. リクエストを受信
2. UserService.getAllUsers()を呼び出し
3. ユーザー一覧をJSON形式で返却

---

### 3.2 GET /api/users/{id} - ユーザー単一取得

| 項目 | 内容 |
|------|------|
| URL | `/api/users/{id}` |
| メソッド | GET |
| 概要 | 指定IDのユーザーを取得 |
| 対応機能 | F-004 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | ユーザーID |

#### レスポンス

**成功時 (200)**:

```json
{
  "id": 1,
  "name": "山田太郎",
  "createdAt": "2025-12-22T10:00:00"
}
```

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 404 | 指定IDが存在しない |

#### 処理フロー

1. リクエストを受信
2. UserService.getUserById(id)を呼び出し
3. ユーザーが存在しなければ404を返却
4. ユーザーをJSON形式で返却

---

### 3.3 POST /api/users - ユーザー登録

| 項目 | 内容 |
|------|------|
| URL | `/api/users` |
| メソッド | POST |
| 概要 | 新しいユーザーを登録 |
| 対応機能 | F-003 |

#### リクエスト

**リクエストボディ**:

```json
{
  "name": "山田太郎"
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|---------------|
| name | String | 要 | ユーザー名 | 1〜100文字、一意 |

#### レスポンス

**成功時 (201)**:

```json
{
  "id": 1,
  "name": "山田太郎",
  "createdAt": "2025-12-22T10:00:00"
}
```

**エラー時**:

| ステータス | 条件 | レスポンス例 |
|-----------|------|-------------|
| 400 | nameが空または未指定 | - |
| 400 | nameが100文字超過 | - |
| 409 | nameが重複 | - |

#### 処理フロー

1. リクエストを受信
2. バリデーションを実行
   - nameが空でないことを確認
   - nameが100文字以内であることを確認
3. UserService.existsByName(name)で重複チェック
4. 重複があれば409を返却
5. UserService.createUser(user)を呼び出し
6. 作成されたユーザーを201で返却

---

### 3.4 DELETE /api/users/{id} - ユーザー削除

| 項目 | 内容 |
|------|------|
| URL | `/api/users/{id}` |
| メソッド | DELETE |
| 概要 | 指定ユーザーを削除 |
| 対応機能 | F-005 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | ユーザーID |

#### レスポンス

| ステータス | 条件 |
|-----------|------|
| 204 | 削除成功 |
| 404 | 指定IDが存在しない |

#### 処理フロー

1. リクエストを受信
2. UserService.getUserById(id)で存在確認
3. 存在しなければ404を返却
4. UserService.deleteUser(id)を呼び出し
5. 204を返却

**補足**: 削除時、該当ユーザーを担当者として設定しているToDoは、DBの外部キー制約（ON DELETE SET NULL）により自動的にASSIGNEE_IDがNULLになる。

---

## 4. ToDo API変更詳細

### 4.1 レスポンス変更（全エンドポイント共通）

既存のToDoオブジェクトに以下のフィールドを追加:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| assigneeId | Long | 担当者ID（null可） |
| assigneeName | String | 担当者名（null可） |

**変更後のToDoオブジェクト**:

```json
{
  "id": 1,
  "title": "タスク名",
  "description": "説明",
  "completed": false,
  "createdAt": "2025-12-22T10:00:00",
  "projectId": 1,
  "startDate": "2025-12-22",
  "dueDate": "2025-12-31",
  "assigneeId": 1,
  "assigneeName": "山田太郎"
}
```

**担当者未設定の場合**:

```json
{
  "id": 1,
  "title": "タスク名",
  "description": "説明",
  "completed": false,
  "createdAt": "2025-12-22T10:00:00",
  "projectId": null,
  "startDate": null,
  "dueDate": null,
  "assigneeId": null,
  "assigneeName": null
}
```

### 4.2 POST /api/todos - 新規作成（変更）

#### リクエストボディ（変更後）

```json
{
  "title": "タスク名",
  "description": "説明",
  "projectId": 1,
  "startDate": "2025-12-22",
  "dueDate": "2025-12-31",
  "assigneeId": 1
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|---------------|
| title | String | 要 | タイトル | 1〜255文字 |
| description | String | 任意 | 説明 | 最大1000文字 |
| projectId | Long | 任意 | プロジェクトID | 存在するプロジェクト |
| startDate | LocalDate | 任意 | 開始日 | - |
| dueDate | LocalDate | 任意 | 終了日 | 開始日以降 |
| assigneeId | Long | 任意 | 担当者ID | 存在するユーザー |

#### 追加バリデーション

| 条件 | エラー |
|------|--------|
| assigneeIdが指定されているが存在しない | 400 Bad Request |

#### 処理フロー（変更部分）

1. リクエストを受信
2. 既存バリデーションを実行
3. **assigneeIdが指定されている場合、UserService.getUserById(assigneeId)で存在確認**
4. **存在しなければ400を返却**
5. TodoService.createTodo(todo)を呼び出し
6. 作成されたToDoを201で返却

---

### 4.3 PUT /api/todos/{id} - 更新（変更）

#### リクエストボディ（変更後）

```json
{
  "title": "更新後タイトル",
  "description": "更新後説明",
  "completed": true,
  "projectId": 2,
  "startDate": "2025-12-22",
  "dueDate": "2025-12-31",
  "assigneeId": 2
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|---------------|
| title | String | 要 | タイトル | 1〜255文字 |
| description | String | 任意 | 説明 | 最大1000文字 |
| completed | boolean | 任意 | 完了フラグ | - |
| projectId | Long | 任意 | プロジェクトID | 存在するプロジェクト |
| startDate | LocalDate | 任意 | 開始日 | - |
| dueDate | LocalDate | 任意 | 終了日 | 開始日以降 |
| assigneeId | Long | 任意 | 担当者ID | 存在するユーザー |

#### 処理フロー（変更部分）

POSTと同様にassigneeIdの存在確認を追加

---

## 5. Controllerクラス設計

### 5.1 UserController（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.UserController` |
| アノテーション | `@RestController`, `@RequestMapping("/api/users")` |

#### 依存関係

| フィールド | 型 | 注入方法 |
|-----------|-----|---------|
| userService | UserService | コンストラクタインジェクション |

#### メソッド一覧

| メソッド | アノテーション | 概要 |
|---------|---------------|------|
| getAllUsers() | @GetMapping | 全件取得 |
| getUserById(Long id) | @GetMapping("/{id}") | ID指定取得 |
| createUser(User user) | @PostMapping | 新規作成 |
| deleteUser(Long id) | @DeleteMapping("/{id}") | 削除 |

### 5.2 TodoController（変更）

#### 変更メソッド

| メソッド | 変更内容 |
|---------|---------|
| createTodo(Todo todo) | assigneeIdの存在チェック追加 |
| updateTodo(Long id, Todo todo) | assigneeIdの存在チェック追加 |

#### 追加する依存関係

| フィールド | 型 | 注入方法 |
|-----------|-----|---------|
| userService | UserService | コンストラクタインジェクション |

---

## 6. エラーハンドリング

### 6.1 ユーザーAPI

| エラー | HTTPステータス | 条件 |
|--------|--------------|------|
| Bad Request | 400 | ユーザー名が空 |
| Bad Request | 400 | ユーザー名が100文字超過 |
| Not Found | 404 | 指定IDのユーザーが存在しない |
| Conflict | 409 | ユーザー名が重複 |

### 6.2 ToDo API（追加分）

| エラー | HTTPステータス | 条件 |
|--------|--------------|------|
| Bad Request | 400 | assigneeIdが指定されているが存在しない |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
