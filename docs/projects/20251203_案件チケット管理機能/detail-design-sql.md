# SQL詳細設計書

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

データアクセス層のSQLクエリ仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 | 種別 |
|---------|---------------|------|------|
| Mapper | ProjectMapper | 案件データアクセス | 新規 |
| Mapper | TodoMapper | チケットデータアクセス | 変更 |

---

## 2. クエリ一覧

### 2.1 ProjectMapper（新規）

| ID | クエリ名 | 種別 | 対象テーブル | 概要 |
|----|---------|------|-------------|------|
| Q-P01 | selectAll | SELECT | PROJECT | 全案件取得 |
| Q-P02 | selectById | SELECT | PROJECT | ID指定取得 |
| Q-P03 | insert | INSERT | PROJECT | 案件作成 |
| Q-P04 | update | UPDATE | PROJECT | 案件更新 |
| Q-P05 | deleteById | DELETE | PROJECT | 案件削除 |

### 2.2 TodoMapper（変更・追加）

| ID | クエリ名 | 種別 | 対象テーブル | 概要 | 種別 |
|----|---------|------|-------------|------|------|
| Q-T01 | selectByProjectId | SELECT | TODO | 案件別取得 | 新規 |
| Q-T02 | selectByProjectIdIsNull | SELECT | TODO | 未分類取得 | 新規 |
| Q-T03 | countByProjectId | SELECT | TODO | 案件別件数 | 新規 |
| Q-T04 | countByProjectIdAndCompleted | SELECT | TODO | 案件別完了件数 | 新規 |
| Q-T05 | deleteByProjectId | DELETE | TODO | 案件別削除 | 新規 |
| Q-T06 | insert | INSERT | TODO | チケット作成 | 変更 |
| Q-T07 | update | UPDATE | TODO | チケット更新 | 変更 |

---

## 3. クエリ詳細（ProjectMapper）

### 3.1 Q-P01: selectAll

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | PROJECT |
| 概要 | 全案件を作成日時降順で取得 |
| 呼び出し元 | ProjectMapper.selectAll() |

#### SQL

```sql
SELECT
    ID,
    NAME,
    DESCRIPTION,
    CREATED_AT
FROM
    PROJECT
ORDER BY
    CREATED_AT DESC;
```

#### パラメータ

なし

#### 結果

| カラム | 型 | 説明 |
|--------|-----|------|
| ID | BIGINT | 案件ID |
| NAME | VARCHAR(100) | 案件名 |
| DESCRIPTION | VARCHAR(500) | 説明 |
| CREATED_AT | TIMESTAMP | 作成日時 |

---

### 3.2 Q-P02: selectById

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | PROJECT |
| 概要 | ID指定で案件を取得 |
| 呼び出し元 | ProjectMapper.selectById(Long id) |

#### SQL

```sql
SELECT
    ID,
    NAME,
    DESCRIPTION,
    CREATED_AT
FROM
    PROJECT
WHERE
    ID = #{id};
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | 案件ID |

#### 結果

| カラム | 型 | 説明 |
|--------|-----|------|
| ID | BIGINT | 案件ID |
| NAME | VARCHAR(100) | 案件名 |
| DESCRIPTION | VARCHAR(500) | 説明 |
| CREATED_AT | TIMESTAMP | 作成日時 |

---

### 3.3 Q-P03: insert

| 項目 | 内容 |
|------|------|
| 種別 | INSERT |
| 対象テーブル | PROJECT |
| 概要 | 新しい案件を作成 |
| 呼び出し元 | ProjectMapper.insert(Project project) |

#### SQL

```sql
INSERT INTO PROJECT (
    NAME,
    DESCRIPTION,
    CREATED_AT
) VALUES (
    #{name},
    #{description},
    #{createdAt}
);
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| name | String | 要 | 案件名 |
| description | String | 任意 | 説明 |
| createdAt | LocalDateTime | 要 | 作成日時 |

#### 補足

- `useGeneratedKeys="true"` でID自動採番
- `keyProperty="id"` で採番されたIDをエンティティに設定

---

### 3.4 Q-P04: update

| 項目 | 内容 |
|------|------|
| 種別 | UPDATE |
| 対象テーブル | PROJECT |
| 概要 | 案件を更新 |
| 呼び出し元 | ProjectMapper.update(Project project) |

#### SQL

```sql
UPDATE PROJECT SET
    NAME = #{name},
    DESCRIPTION = #{description}
WHERE
    ID = #{id};
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | 案件ID |
| name | String | 要 | 案件名 |
| description | String | 任意 | 説明 |

---

### 3.5 Q-P05: deleteById

| 項目 | 内容 |
|------|------|
| 種別 | DELETE |
| 対象テーブル | PROJECT |
| 概要 | 案件を削除 |
| 呼び出し元 | ProjectMapper.deleteById(Long id) |

#### SQL

```sql
DELETE FROM PROJECT
WHERE ID = #{id};
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | 案件ID |

---

## 4. クエリ詳細（TodoMapper追加・変更）

### 4.1 Q-T01: selectByProjectId（新規）

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 指定案件のチケットを取得 |
| 呼び出し元 | TodoMapper.selectByProjectId(Long projectId) |

#### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT,
    PROJECT_ID,
    START_DATE,
    DUE_DATE
FROM
    TODO
WHERE
    PROJECT_ID = #{projectId}
ORDER BY
    CREATED_AT DESC;
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| projectId | Long | 要 | 案件ID |

---

### 4.2 Q-T02: selectByProjectIdIsNull（新規）

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 案件未設定のチケットを取得 |
| 呼び出し元 | TodoMapper.selectByProjectIdIsNull() |

#### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT,
    PROJECT_ID,
    START_DATE,
    DUE_DATE
FROM
    TODO
WHERE
    PROJECT_ID IS NULL
ORDER BY
    CREATED_AT DESC;
```

#### パラメータ

なし

---

### 4.3 Q-T03: countByProjectId（新規）

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 指定案件のチケット件数を取得 |
| 呼び出し元 | TodoMapper.countByProjectId(Long projectId) |

#### SQL

```sql
SELECT COUNT(*)
FROM TODO
WHERE PROJECT_ID = #{projectId};
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| projectId | Long | 要 | 案件ID |

#### 結果

| カラム | 型 | 説明 |
|--------|-----|------|
| COUNT(*) | INTEGER | 件数 |

---

### 4.4 Q-T04: countByProjectIdAndCompleted（新規）

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 指定案件の完了状態別件数を取得 |
| 呼び出し元 | TodoMapper.countByProjectIdAndCompleted(Long projectId, boolean completed) |

#### SQL

```sql
SELECT COUNT(*)
FROM TODO
WHERE PROJECT_ID = #{projectId}
  AND COMPLETED = #{completed};
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| projectId | Long | 要 | 案件ID |
| completed | boolean | 要 | 完了状態 |

---

### 4.5 Q-T05: deleteByProjectId（新規）

| 項目 | 内容 |
|------|------|
| 種別 | DELETE |
| 対象テーブル | TODO |
| 概要 | 指定案件のチケットを全削除 |
| 呼び出し元 | TodoMapper.deleteByProjectId(Long projectId) |

#### SQL

```sql
DELETE FROM TODO
WHERE PROJECT_ID = #{projectId};
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| projectId | Long | 要 | 案件ID |

---

### 4.6 Q-T06: insert（変更）

| 項目 | 内容 |
|------|------|
| 種別 | INSERT |
| 対象テーブル | TODO |
| 概要 | チケット作成（期間・案件ID対応） |
| 変更内容 | PROJECT_ID, START_DATE, DUE_DATE追加 |

#### SQL（変更後）

```sql
INSERT INTO TODO (
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT,
    PROJECT_ID,
    START_DATE,
    DUE_DATE
) VALUES (
    #{title},
    #{description},
    #{completed},
    #{createdAt},
    #{projectId},
    #{startDate},
    #{dueDate}
);
```

#### 追加パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| projectId | Long | 任意 | 案件ID |
| startDate | LocalDate | 任意 | 開始日 |
| dueDate | LocalDate | 任意 | 終了日 |

---

### 4.7 Q-T07: update（変更）

| 項目 | 内容 |
|------|------|
| 種別 | UPDATE |
| 対象テーブル | TODO |
| 概要 | チケット更新（期間・案件ID対応） |
| 変更内容 | PROJECT_ID, START_DATE, DUE_DATE追加 |

#### SQL（変更後）

```sql
UPDATE TODO SET
    TITLE = #{title},
    DESCRIPTION = #{description},
    COMPLETED = #{completed},
    PROJECT_ID = #{projectId},
    START_DATE = #{startDate},
    DUE_DATE = #{dueDate}
WHERE
    ID = #{id};
```

#### 追加パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| projectId | Long | 任意 | 案件ID |
| startDate | LocalDate | 任意 | 開始日 |
| dueDate | LocalDate | 任意 | 終了日 |

---

## 5. インデックス利用

### 5.1 利用インデックス

| クエリID | 使用インデックス | 備考 |
|---------|-----------------|------|
| Q-P02 | PRIMARY KEY (ID) | WHERE句で使用 |
| Q-T01 | IDX_TODO_PROJECT_ID | WHERE句で使用 |
| Q-T02 | IDX_TODO_PROJECT_ID | WHERE句で使用（NULL検索） |
| Q-T03 | IDX_TODO_PROJECT_ID | WHERE句で使用 |
| Q-T04 | IDX_TODO_PROJECT_ID | WHERE句で使用 |
| Q-T05 | IDX_TODO_PROJECT_ID | WHERE句で使用 |

---

## 6. パフォーマンス考慮

### 6.1 注意事項

| クエリID | 注意点 | 対策 |
|---------|--------|------|
| Q-T02 | NULL検索はインデックスが効きにくい場合がある | 想定データ量が少ないため許容 |
| Q-T05 | 大量削除の可能性 | @Transactional内で実行 |

### 6.2 想定データ量

| テーブル | 想定レコード数 | 備考 |
|---------|---------------|------|
| PROJECT | 〜100件 | 案件数 |
| TODO | 〜1000件 | 全チケット数 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
