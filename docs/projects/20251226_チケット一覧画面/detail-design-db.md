# DB詳細設計書

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

データベースの変更仕様（テーブル定義、インデックス、マイグレーション）を定義する。

### 1.2 変更有無

| 項目 | 状態 |
|------|------|
| テーブル追加 | **なし** |
| テーブル変更 | **なし** |
| カラム追加 | **なし** |
| インデックス追加 | **なし** |
| 初期データ変更 | **なし** |

### 1.3 変更なしの理由

本案件はフロントエンドのみの改善であり、以下の理由によりデータベースの変更は不要である:

1. **既存テーブルで対応可能**: TODO、USER、PROJECTテーブルの既存カラムで一覧表示・検索・フィルタに必要な属性はすべて揃っている
2. **新規エンティティ不要**: 検索履歴やフィルタ設定の永続化は行わない
3. **スキーマ変更不要**: フロントエンドでの表示・操作のみで対応可能

---

## 2. 利用する既存テーブル

本案件で使用する既存テーブルの一覧。詳細は [docs/specs/db-schema.md](../../specs/db-schema.md) を参照。

### 2.1 TODOテーブル

| カラム名 | 利用目的 |
|---------|----------|
| ID | テーブル表示（ID列） |
| TITLE | テーブル表示、キーワード検索対象 |
| DESCRIPTION | テーブル表示、キーワード検索対象 |
| COMPLETED | テーブル表示（状態列）、完了状態フィルタ |
| START_DATE | テーブル表示（開始日列）、期間フィルタ |
| DUE_DATE | テーブル表示（終了日列）、期間フィルタ |
| ASSIGNEE_ID | 担当者フィルタ |
| PROJECT_ID | 案件フィルタ |
| CREATED_AT | テーブル表示（作成日列） |

### 2.2 USERテーブル

| カラム名 | 利用目的 |
|---------|----------|
| ID | 担当者フィルタの値 |
| NAME | 担当者フィルタの選択肢表示、テーブル表示（担当者列） |

### 2.3 PROJECT関連

現時点ではPROJECTテーブルは存在せず、TODO.PROJECT_IDは論理的なグルーピングに使用。案件名はフロントエンドで管理。

---

## 3. DDL/DML

### 3.1 変更なし

本案件ではDDL（スキーマ変更）、DML（データ変更）は不要。

```sql
-- 変更なし
-- 本案件ではデータベースの変更は行わない
```

---

## 4. マイグレーション

### 4.1 適用SQL

```sql
-- 変更なし
-- 本案件ではマイグレーションは不要
```

### 4.2 ロールバックSQL

```sql
-- 変更なし
-- 本案件ではロールバックは不要
```

---

## 5. 将来的な拡張案

データ量が増加した場合や機能拡張時に検討するスキーマ変更案。

### 5.1 検索用インデックス

```sql
-- キーワード検索高速化
CREATE INDEX idx_todo_title ON TODO (TITLE);

-- フィルタ高速化
CREATE INDEX idx_todo_completed ON TODO (COMPLETED);
CREATE INDEX idx_todo_assignee ON TODO (ASSIGNEE_ID);
CREATE INDEX idx_todo_project ON TODO (PROJECT_ID);
CREATE INDEX idx_todo_dates ON TODO (START_DATE, DUE_DATE);
```

### 5.2 フィルタ設定の永続化（将来検討）

ユーザーごとのフィルタ設定を保存する場合:

```sql
CREATE TABLE USER_FILTER_SETTING (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    USER_ID BIGINT NOT NULL,
    SETTING_NAME VARCHAR(100) NOT NULL,
    FILTER_JSON TEXT NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID) ON DELETE CASCADE
);
```

**注意**: これらの拡張は本案件のスコープ外であり、将来的な検討事項として記載。

---

## 6. 影響分析

### 6.1 影響を受けるコンポーネント

| コンポーネント | 影響 |
|---------------|------|
| TodoMapper | **影響なし** |
| UserMapper | **影響なし** |
| TodoService | **影響なし** |
| UserService | **影響なし** |

本案件ではDBスキーマ変更がないため、バックエンドコンポーネントへの影響はない。

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成（変更なしを明記） | Claude |
