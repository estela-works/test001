# DB詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | <!-- 案件名を記載 --> |
| 案件ID | <!-- YYYYMM_案件名 --> |
| 作成日 | <!-- YYYY-MM-DD --> |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

データベースの変更仕様（テーブル定義、インデックス、マイグレーション）を定義する。

### 1.2 変更種別

| 種別 | 対象 |
|------|------|
| テーブル新規作成 | <!-- テーブル名 --> |
| テーブル変更 | <!-- テーブル名 --> |
| インデックス追加 | <!-- インデックス名 --> |

---

## 2. テーブル設計

### 2.1 テーブル名: table_name

| 項目 | 内容 |
|------|------|
| テーブル名 | table_name |
| 概要 | <!-- テーブルの概要 --> |
| 変更種別 | 新規作成/カラム追加/カラム変更 |

#### カラム定義

| カラム名 | 型 | NULL | デフォルト | PK | FK | 説明 | 変更種別 |
|---------|-----|------|-----------|----|----|------|----------|
| id | BIGINT | NO | AUTO_INCREMENT | ○ | - | 主キー | 新規 |
| name | VARCHAR(100) | NO | - | - | - | 名称 | 新規 |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | - | - | 作成日時 | 新規 |

#### 制約

| 制約名 | 種別 | 対象カラム | 説明 |
|--------|------|-----------|------|
| pk_table_name | PRIMARY KEY | id | 主キー制約 |
| fk_table_other | FOREIGN KEY | other_id | 外部キー制約 |

---

## 3. インデックス設計

### 3.1 インデックス一覧

| インデックス名 | テーブル | カラム | 種別 | 目的 |
|---------------|---------|--------|------|------|
| idx_table_column1 | table_name | column1 | BTREE | 検索性能向上 |

---

## 4. マイグレーション

### 4.1 DDL

#### 適用SQL

```sql
-- テーブル作成
CREATE TABLE table_name (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- インデックス作成
CREATE INDEX idx_table_column1 ON table_name (column1);
```

#### ロールバックSQL

```sql
-- インデックス削除
DROP INDEX idx_table_column1 ON table_name;

-- テーブル削除
DROP TABLE table_name;
```

### 4.2 DML（初期データ）

```sql
INSERT INTO table_name (name) VALUES
('初期データ1'),
('初期データ2');
```

---

## 5. データ移行（該当する場合）

### 5.1 移行対象

| 移行元 | 移行先 | 件数 | 変換ルール |
|--------|--------|------|-----------|
| <!-- 元テーブル.カラム --> | <!-- 先テーブル.カラム --> | <!-- 件数 --> | <!-- ルール --> |

### 5.2 移行SQL

```sql
-- データ移行
INSERT INTO new_table (column1, column2)
SELECT old_column1, old_column2
FROM old_table;
```

---

## 6. 影響分析

### 6.1 影響を受けるコンポーネント

| コンポーネント | 影響内容 | 対応 |
|---------------|---------|------|
| <!-- クラス名 --> | <!-- 影響内容 --> | <!-- 対応方法 --> |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | YYYY-MM-DD | 初版作成 | <!-- 担当者名 --> |
