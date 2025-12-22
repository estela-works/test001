# API詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 案件チケット管理機能 |
| 案件ID | 20251201_案件チケット管理機能 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

REST APIエンドポイントの詳細仕様（リクエスト/レスポンス、バリデーション）を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 |
|---------|---------------|------|
| Controller | ProjectController | 案件APIのHTTPリクエスト処理（新規） |
| Controller | TodoController | チケットAPIのHTTPリクエスト処理（変更） |

---

## 2. API共通仕様

### 2.1 ベースURL

| 項目 | 値 |
|------|-----|
| 開発環境 | `http://localhost:8080` |

### 2.2 共通ヘッダー

| ヘッダー | 値 | 必須 |
|---------|-----|------|
| Content-Type | application/json | 要（POST/PUT） |

### 2.3 共通エラーレスポンス

| ステータス | 説明 |
|-----------|------|
| 400 Bad Request | リクエスト不正（バリデーションエラー） |
| 404 Not Found | リソース未発見 |
| 500 Internal Server Error | サーバーエラー |

---

## 3. 案件API詳細（新規）

### 3.1 GET /api/projects - 案件一覧取得

| 項目 | 内容 |
|------|------|
| URL | `/api/projects` |
| メソッド | GET |
| 概要 | 全案件を作成日時降順で取得 |
| 対応機能 | F-002 |

#### リクエスト

パラメータなし

#### レスポンス

**成功時 (200)**:

```json
[
  {
    "id": 1,
    "name": "案件A",
    "description": "案件Aの説明",
    "createdAt": "2025-12-22T10:00:00"
  },
  {
    "id": 2,
    "name": "案件B",
    "description": null,
    "createdAt": "2025-12-21T15:30:00"
  }
]
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Long | 案件ID |
| name | String | 案件名 |
| description | String | 説明（null可） |
| createdAt | LocalDateTime | 作成日時 |

---

### 3.2 GET /api/projects/{id} - 案件詳細取得

| 項目 | 内容 |
|------|------|
| URL | `/api/projects/{id}` |
| メソッド | GET |
| 概要 | 指定IDの案件を取得 |
| 対応機能 | F-003 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | 案件ID |

#### レスポンス

**成功時 (200)**:

```json
{
  "id": 1,
  "name": "案件A",
  "description": "案件Aの説明",
  "createdAt": "2025-12-22T10:00:00"
}
```

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 404 | 指定IDの案件が存在しない |

---

### 3.3 POST /api/projects - 案件作成

| 項目 | 内容 |
|------|------|
| URL | `/api/projects` |
| メソッド | POST |
| 概要 | 新しい案件を作成 |
| 対応機能 | F-001 |

#### リクエスト

**リクエストボディ**:

```json
{
  "name": "案件名",
  "description": "案件の説明"
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|---------------|
| name | String | 要 | 案件名 | 1〜100文字 |
| description | String | 任意 | 説明 | 500文字以内 |

#### レスポンス

**成功時 (201)**:

```json
{
  "id": 1,
  "name": "案件名",
  "description": "案件の説明",
  "createdAt": "2025-12-22T10:00:00"
}
```

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 400 | nameが空またはnull |

#### 処理フロー

1. リクエストボディを受信
2. nameの必須チェック
3. Projectエンティティを生成
4. ProjectService.create()を呼び出し
5. 201 Createdでレスポンス

---

### 3.4 PUT /api/projects/{id} - 案件更新

| 項目 | 内容 |
|------|------|
| URL | `/api/projects/{id}` |
| メソッド | PUT |
| 概要 | 既存の案件を更新 |
| 対応機能 | F-004 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | 案件ID |

**リクエストボディ**:

```json
{
  "name": "更新後案件名",
  "description": "更新後説明"
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション |
|-----------|-----|------|------|---------------|
| name | String | 要 | 案件名 | 1〜100文字 |
| description | String | 任意 | 説明 | 500文字以内 |

#### レスポンス

**成功時 (200)**:

```json
{
  "id": 1,
  "name": "更新後案件名",
  "description": "更新後説明",
  "createdAt": "2025-12-22T10:00:00"
}
```

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 400 | nameが空またはnull |
| 404 | 指定IDの案件が存在しない |

---

### 3.5 DELETE /api/projects/{id} - 案件削除

| 項目 | 内容 |
|------|------|
| URL | `/api/projects/{id}` |
| メソッド | DELETE |
| 概要 | 案件を削除（配下のチケットも削除） |
| 対応機能 | F-005 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | 案件ID |

#### レスポンス

**成功時 (204)**:

レスポンスボディなし

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 404 | 指定IDの案件が存在しない |

#### 処理フロー

1. パスパラメータからIDを取得
2. 案件の存在チェック
3. @Transactionalで以下を実行:
   - 配下のチケットを全削除
   - 案件を削除
4. 204 No Contentでレスポンス

---

### 3.6 GET /api/projects/{id}/stats - 案件統計取得

| 項目 | 内容 |
|------|------|
| URL | `/api/projects/{id}/stats` |
| メソッド | GET |
| 概要 | 案件の統計情報（チケット数、進捗率）を取得 |
| 対応機能 | F-006 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | 案件ID |

#### レスポンス

**成功時 (200)**:

```json
{
  "total": 10,
  "completed": 3,
  "pending": 7,
  "progressRate": 30
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| total | Integer | 総チケット数 |
| completed | Integer | 完了チケット数 |
| pending | Integer | 未完了チケット数 |
| progressRate | Integer | 進捗率（%、小数点以下切り捨て） |

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 404 | 指定IDの案件が存在しない |

---

## 4. チケットAPI詳細（変更）

### 4.1 GET /api/todos - チケット一覧取得（変更）

| 項目 | 内容 |
|------|------|
| URL | `/api/todos` |
| メソッド | GET |
| 概要 | チケット一覧を取得（案件フィルタ追加） |
| 変更内容 | projectIdパラメータを追加 |

#### リクエスト

**クエリパラメータ**:

| パラメータ | 型 | 必須 | 説明 | デフォルト |
|-----------|-----|------|------|-----------|
| completed | Boolean | 任意 | 完了状態フィルタ（既存） | - |
| projectId | Long/"none" | 任意 | 案件IDフィルタ（追加） | - |

**projectIdパラメータの動作**:

| 値 | 動作 |
|----|------|
| 未指定 | 全チケットを返却 |
| 数値 | 指定案件のチケットのみ返却 |
| "none" | 案件未設定（PROJECT_ID=NULL）のチケットのみ返却 |

#### レスポンス

**成功時 (200)**:

```json
[
  {
    "id": 1,
    "title": "タスク名",
    "description": "説明",
    "completed": false,
    "createdAt": "2025-12-22T10:00:00",
    "projectId": 1,
    "startDate": "2025-01-01",
    "dueDate": "2025-01-15"
  }
]
```

| フィールド | 型 | 説明 | 種別 |
|-----------|-----|------|------|
| id | Long | チケットID | 既存 |
| title | String | タイトル | 既存 |
| description | String | 説明 | 既存 |
| completed | boolean | 完了フラグ | 既存 |
| createdAt | LocalDateTime | 作成日時 | 既存 |
| projectId | Long | 所属案件ID（null可） | 追加 |
| startDate | LocalDate | 開始日（null可） | 追加 |
| dueDate | LocalDate | 終了日（null可） | 追加 |

---

### 4.2 POST /api/todos - チケット作成（変更）

| 項目 | 内容 |
|------|------|
| URL | `/api/todos` |
| メソッド | POST |
| 概要 | 新しいチケットを作成（期間・案件ID対応） |
| 変更内容 | projectId, startDate, dueDateフィールドを追加 |

#### リクエスト

**リクエストボディ**:

```json
{
  "title": "タスク名",
  "description": "説明",
  "projectId": 1,
  "startDate": "2025-01-01",
  "dueDate": "2025-01-15"
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション | 種別 |
|-----------|-----|------|------|---------------|------|
| title | String | 要 | タイトル | 1〜255文字 | 既存 |
| description | String | 任意 | 説明 | 1000文字以内 | 既存 |
| projectId | Long | 任意 | 案件ID | 存在チェック | 追加 |
| startDate | LocalDate | 任意 | 開始日 | 日付形式 | 追加 |
| dueDate | LocalDate | 任意 | 終了日 | 日付形式、startDate以降 | 追加 |

#### レスポンス

**成功時 (201)**:

```json
{
  "id": 1,
  "title": "タスク名",
  "description": "説明",
  "completed": false,
  "createdAt": "2025-12-22T10:00:00",
  "projectId": 1,
  "startDate": "2025-01-01",
  "dueDate": "2025-01-15"
}
```

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 400 | titleが空 |
| 400 | dueDateがstartDateより前 |
| 400 | 指定projectIdが存在しない |

#### 処理フロー

1. リクエストボディを受信
2. バリデーション
   - title必須チェック
   - 日付整合性チェック
   - projectId存在チェック（指定時）
3. Todoエンティティを生成
4. TodoService.createTodo()を呼び出し
5. 201 Createdでレスポンス

---

### 4.3 PUT /api/todos/{id} - チケット更新（変更）

| 項目 | 内容 |
|------|------|
| URL | `/api/todos/{id}` |
| メソッド | PUT |
| 概要 | チケットを更新（期間・案件ID対応） |
| 変更内容 | projectId, startDate, dueDateフィールドを追加 |

#### リクエスト

**パスパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | チケットID |

**リクエストボディ**:

```json
{
  "title": "更新後タイトル",
  "description": "更新後説明",
  "completed": true,
  "projectId": 2,
  "startDate": "2025-01-05",
  "dueDate": "2025-01-20"
}
```

| フィールド | 型 | 必須 | 説明 | バリデーション | 種別 |
|-----------|-----|------|------|---------------|------|
| title | String | 要 | タイトル | 1〜255文字 | 既存 |
| description | String | 任意 | 説明 | 1000文字以内 | 既存 |
| completed | boolean | 任意 | 完了フラグ | - | 既存 |
| projectId | Long | 任意 | 案件ID | 存在チェック | 追加 |
| startDate | LocalDate | 任意 | 開始日 | 日付形式 | 追加 |
| dueDate | LocalDate | 任意 | 終了日 | 日付形式、startDate以降 | 追加 |

#### レスポンス

**成功時 (200)**: 更新後のチケット情報

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 400 | titleが空 |
| 400 | dueDateがstartDateより前 |
| 404 | 指定IDのチケットが存在しない |

---

## 5. Controllerクラス設計

### 5.1 ProjectController（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.ProjectController` |
| アノテーション | `@RestController`, `@RequestMapping("/api/projects")` |

#### 依存関係

| フィールド | 型 | 注入方法 |
|-----------|-----|---------|
| projectService | ProjectService | コンストラクタインジェクション |

#### メソッド一覧

| メソッド | アノテーション | 概要 |
|---------|---------------|------|
| getAllProjects() | @GetMapping | 全案件取得 |
| getProjectById(Long id) | @GetMapping("/{id}") | ID指定取得 |
| createProject(Project project) | @PostMapping | 新規作成 |
| updateProject(Long id, Project project) | @PutMapping("/{id}") | 更新 |
| deleteProject(Long id) | @DeleteMapping("/{id}") | 削除 |
| getProjectStats(Long id) | @GetMapping("/{id}/stats") | 統計取得 |

---

### 5.2 TodoController（変更）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.TodoController` |
| 変更内容 | getAllTodos, createTodo, updateTodoメソッドの変更 |

#### 変更メソッド

| メソッド | 変更内容 |
|---------|---------|
| getAllTodos() | projectIdパラメータの追加 |
| createTodo() | projectId, startDate, dueDateの処理追加 |
| updateTodo() | projectId, startDate, dueDateの処理追加 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
