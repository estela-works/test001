[← 目次に戻る](./README.md)

# クエリ詳細

## 4.1 Q-001: 全件取得（作成日時順）

| 項目 | 内容 |
|------|------|
| ID | selectAll |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 全ToDoを作成日時の昇順で取得 |
| 呼び出し元 | TodoMapper.selectAll() |

### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
FROM
    TODO
ORDER BY
    CREATED_AT ASC
```

### パラメータ

なし

### 結果マッピング

| DBカラム | Javaフィールド | 型 |
|---------|---------------|-----|
| ID | id | Long |
| TITLE | title | String |
| DESCRIPTION | description | String |
| COMPLETED | completed | boolean |
| CREATED_AT | createdAt | LocalDateTime |

※ `map-underscore-to-camel-case=true` 設定により自動マッピング

---

## 4.2 Q-002: ID指定取得

| 項目 | 内容 |
|------|------|
| ID | selectById |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 指定IDのToDoを取得 |
| 呼び出し元 | TodoMapper.selectById(Long id) |

### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
FROM
    TODO
WHERE
    ID = #{id}
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{id} | Long | 要 | ToDo ID |

### 戻り値

- 該当レコードが存在する場合: Todoオブジェクト
- 該当レコードが存在しない場合: null

---

## 4.3 Q-003: 完了状態フィルタ

| 項目 | 内容 |
|------|------|
| ID | selectByCompleted |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 完了状態でフィルタし作成日時順で取得 |
| 呼び出し元 | TodoMapper.selectByCompleted(boolean completed) |

### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
FROM
    TODO
WHERE
    COMPLETED = #{completed}
ORDER BY
    CREATED_AT ASC
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{completed} | boolean | 要 | 完了状態（true/false） |

---

## 4.4 Q-004: 新規作成

| 項目 | 内容 |
|------|------|
| ID | insert |
| 種別 | INSERT |
| 対象テーブル | TODO |
| 概要 | 新規ToDoを作成 |
| 呼び出し元 | TodoMapper.insert(Todo todo) |

### SQL

```sql
INSERT INTO TODO (
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
) VALUES (
    #{title},
    #{description},
    #{completed},
    #{createdAt}
)
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{title} | String | 要 | タイトル |
| #{description} | String | 任意 | 説明 |
| #{completed} | boolean | 要 | 完了状態 |
| #{createdAt} | LocalDateTime | 要 | 作成日時 |

### 自動採番設定

| 設定 | 値 | 説明 |
|------|-----|------|
| useGeneratedKeys | true | 自動採番されたIDを取得 |
| keyProperty | id | 取得したIDをセットするプロパティ |

※ INSERT実行後、引数のTodoオブジェクトのidフィールドに自動採番されたIDがセットされる

---

## 4.5 Q-005: 更新

| 項目 | 内容 |
|------|------|
| ID | update |
| 種別 | UPDATE |
| 対象テーブル | TODO |
| 概要 | 既存ToDoを更新 |
| 呼び出し元 | TodoMapper.update(Todo todo) |

### SQL

```sql
UPDATE TODO
SET
    TITLE = #{title},
    DESCRIPTION = #{description},
    COMPLETED = #{completed}
WHERE
    ID = #{id}
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{title} | String | 要 | タイトル |
| #{description} | String | 任意 | 説明 |
| #{completed} | boolean | 要 | 完了状態 |
| #{id} | Long | 要 | 更新対象ID |

### 注意事項

- CREATED_ATは更新対象外（作成日時は不変）
- WHERE句でIDを指定して対象レコードを特定

---

## 4.6 Q-006: ID指定削除

| 項目 | 内容 |
|------|------|
| ID | deleteById |
| 種別 | DELETE |
| 対象テーブル | TODO |
| 概要 | 指定IDのToDoを削除 |
| 呼び出し元 | TodoMapper.deleteById(Long id) |

### SQL

```sql
DELETE FROM TODO
WHERE ID = #{id}
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{id} | Long | 要 | 削除対象ID |

---

## 4.7 Q-007: 全件削除

| 項目 | 内容 |
|------|------|
| ID | deleteAll |
| 種別 | DELETE |
| 対象テーブル | TODO |
| 概要 | 全ToDoを削除 |
| 呼び出し元 | TodoMapper.deleteAll() |

### SQL

```sql
DELETE FROM TODO
```

### パラメータ

なし

---

## 4.8 Q-008: 件数取得

| 項目 | 内容 |
|------|------|
| ID | count |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 全ToDo件数を取得 |
| 呼び出し元 | TodoMapper.count() |

### SQL

```sql
SELECT COUNT(*) FROM TODO
```

### 戻り値

| 型 | 説明 |
|-----|------|
| int | 件数 |

---

## 4.9 Q-009: 完了状態別件数

| 項目 | 内容 |
|------|------|
| ID | countByCompleted |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 完了状態でフィルタした件数を取得 |
| 呼び出し元 | TodoMapper.countByCompleted(boolean completed) |

### SQL

```sql
SELECT COUNT(*)
FROM TODO
WHERE COMPLETED = #{completed}
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{completed} | boolean | 要 | 完了状態 |

---

[← 目次に戻る](./README.md)
