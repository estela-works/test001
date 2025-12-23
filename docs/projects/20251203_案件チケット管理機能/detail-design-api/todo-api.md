[← 目次に戻る](./README.md)

# チケットAPI詳細（変更）

## 4.1 GET /api/todos - チケット一覧取得（変更）

| 項目 | 内容 |
|------|------|
| URL | `/api/todos` |
| メソッド | GET |
| 概要 | チケット一覧を取得（案件フィルタ追加） |
| 変更内容 | projectIdパラメータを追加 |

### リクエスト

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

### レスポンス

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

## 4.2 POST /api/todos - チケット作成（変更）

| 項目 | 内容 |
|------|------|
| URL | `/api/todos` |
| メソッド | POST |
| 概要 | 新しいチケットを作成（期間・案件ID対応） |
| 変更内容 | projectId, startDate, dueDateフィールドを追加 |

### リクエスト

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

### レスポンス

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

### 処理フロー

1. リクエストボディを受信
2. バリデーション
   - title必須チェック
   - 日付整合性チェック
   - projectId存在チェック（指定時）
3. Todoエンティティを生成
4. TodoService.createTodo()を呼び出し
5. 201 Createdでレスポンス

---

## 4.3 PUT /api/todos/{id} - チケット更新（変更）

| 項目 | 内容 |
|------|------|
| URL | `/api/todos/{id}` |
| メソッド | PUT |
| 概要 | チケットを更新（期間・案件ID対応） |
| 変更内容 | projectId, startDate, dueDateフィールドを追加 |

### リクエスト

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

### レスポンス

**成功時 (200)**: 更新後のチケット情報

**エラー時**:

| ステータス | 条件 |
|-----------|------|
| 400 | titleが空 |
| 400 | dueDateがstartDateより前 |
| 404 | 指定IDのチケットが存在しない |
