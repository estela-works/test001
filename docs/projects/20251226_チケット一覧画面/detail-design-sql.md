# SQL詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | チケット一覧画面 |
| 案件ID | 20251226_チケット一覧画面 |
| 作成日 | 2025-12-26 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

データアクセス層のSQLクエリ仕様を定義する。

### 1.2 変更有無

| 項目 | 状態 |
|------|------|
| クエリ追加 | **なし** |
| クエリ変更 | **なし** |
| クエリ削除 | **なし** |

### 1.3 変更なしの理由

本案件はフロントエンドのみの改善であり、以下の理由によりSQLクエリの追加・変更は不要である:

1. **既存クエリで対応可能**: `selectAll` で全チケットを取得し、フロントエンドでフィルタ・検索・ソートを実装する
2. **検索クエリ不要**: キーワード検索はフロントエンドのJavaScriptで実装
3. **複合条件クエリ不要**: 複数条件のフィルタはフロントエンドのcomputedで実装

---

## 2. 利用する既存クエリ

本案件で使用する既存クエリの一覧。詳細は `src/main/resources/mapper/TodoMapper.xml` を参照。

### 2.1 チケット関連

| クエリID | 種別 | 概要 | 利用目的 |
|---------|------|------|----------|
| selectAll | SELECT | 全チケット取得 | 一覧表示のデータ取得 |
| selectById | SELECT | ID指定取得 | 詳細モーダル表示 |
| selectByProjectId | SELECT | 案件別取得 | projectIdパラメータ付きの場合 |

### 2.2 ユーザー関連

| クエリID | 種別 | 概要 | 利用目的 |
|---------|------|------|----------|
| selectAll | SELECT | 全ユーザー取得 | 担当者フィルタの選択肢 |

### 2.3 案件関連

| クエリID | 種別 | 概要 | 利用目的 |
|---------|------|------|----------|
| selectAll | SELECT | 全案件取得 | 案件フィルタの選択肢 |

---

## 3. Mapperクラス設計

### 3.1 変更なし

本案件ではMapperクラス・Mapper XMLの変更は不要。

| ファイル | 変更 |
|---------|------|
| TodoMapper.java | **変更なし** |
| TodoMapper.xml | **変更なし** |
| UserMapper.java | **変更なし** |
| UserMapper.xml | **変更なし** |
| ProjectMapper.java | **変更なし** |
| ProjectMapper.xml | **変更なし** |

---

## 4. 将来的な拡張案

データ量が増加した場合（数千件以上）に検討するクエリの拡張案。

### 4.1 キーワード検索クエリ

```sql
-- Q-NEW-001: キーワード検索
SELECT
    t.ID,
    t.TITLE,
    t.DESCRIPTION,
    t.COMPLETED,
    t.CREATED_AT,
    t.PROJECT_ID,
    t.START_DATE,
    t.DUE_DATE,
    t.ASSIGNEE_ID,
    u.NAME AS ASSIGNEE_NAME
FROM TODO t
LEFT JOIN USER u ON t.ASSIGNEE_ID = u.ID
WHERE
    t.TITLE LIKE CONCAT('%', #{keyword}, '%')
    OR t.DESCRIPTION LIKE CONCAT('%', #{keyword}, '%')
ORDER BY t.CREATED_AT DESC;
```

### 4.2 複合フィルタクエリ

```sql
-- Q-NEW-002: 複合フィルタ
SELECT
    t.ID,
    t.TITLE,
    t.DESCRIPTION,
    t.COMPLETED,
    t.CREATED_AT,
    t.PROJECT_ID,
    t.START_DATE,
    t.DUE_DATE,
    t.ASSIGNEE_ID,
    u.NAME AS ASSIGNEE_NAME
FROM TODO t
LEFT JOIN USER u ON t.ASSIGNEE_ID = u.ID
WHERE 1=1
    <if test="completed != null">
        AND t.COMPLETED = #{completed}
    </if>
    <if test="assigneeId != null">
        AND t.ASSIGNEE_ID = #{assigneeId}
    </if>
    <if test="projectId != null">
        AND t.PROJECT_ID = #{projectId}
    </if>
    <if test="startDateFrom != null">
        AND t.START_DATE >= #{startDateFrom}
    </if>
    <if test="dueDateTo != null">
        AND t.DUE_DATE <= #{dueDateTo}
    </if>
ORDER BY t.CREATED_AT DESC;
```

### 4.3 ページネーションクエリ

```sql
-- Q-NEW-003: ページネーション
SELECT
    t.ID,
    t.TITLE,
    t.DESCRIPTION,
    t.COMPLETED,
    t.CREATED_AT,
    t.PROJECT_ID,
    t.START_DATE,
    t.DUE_DATE,
    t.ASSIGNEE_ID,
    u.NAME AS ASSIGNEE_NAME
FROM TODO t
LEFT JOIN USER u ON t.ASSIGNEE_ID = u.ID
ORDER BY ${sortField} ${sortOrder}
LIMIT #{size} OFFSET #{offset};
```

**注意**: これらの拡張は本案件のスコープ外であり、将来的な検討事項として記載。

---

## 5. インデックス利用

### 5.1 変更なし

本案件ではインデックスの追加・変更は不要。

将来的に検索クエリを追加する場合は、以下のインデックスを検討:

| インデックス案 | 対象カラム | 目的 |
|--------------|-----------|------|
| idx_todo_title | TODO.TITLE | キーワード検索高速化 |
| idx_todo_completed | TODO.COMPLETED | 完了状態フィルタ高速化 |
| idx_todo_assignee | TODO.ASSIGNEE_ID | 担当者フィルタ高速化 |
| idx_todo_project | TODO.PROJECT_ID | 案件フィルタ高速化 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成（変更なしを明記） | Claude |
