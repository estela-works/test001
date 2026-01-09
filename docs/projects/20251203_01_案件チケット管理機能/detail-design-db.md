# DB詳細設計書

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

データベースの変更仕様（テーブル定義、インデックス、マイグレーション）を定義する。

### 1.2 変更種別

| 種別 | 対象 |
|------|------|
| テーブル新規作成 | PROJECT |
| テーブル変更 | TODO（カラム追加） |
| インデックス追加 | IDX_TODO_PROJECT_ID |
| 外部キー追加 | FK_TODO_PROJECT |

---

## 2. テーブル設計

### 2.1 テーブル名: PROJECT（新規）

| 項目 | 内容 |
|------|------|
| テーブル名 | PROJECT |
| 概要 | 案件情報を管理するテーブル |
| 変更種別 | 新規作成 |

#### カラム定義

| カラム名 | 型 | NULL | デフォルト | PK | FK | 説明 | 変更種別 |
|---------|-----|------|-----------|----|----|------|----------|
| ID | BIGINT | NO | AUTO_INCREMENT | O | - | 主キー（自動採番） | 新規 |
| NAME | VARCHAR(100) | NO | - | - | - | 案件名 | 新規 |
| DESCRIPTION | VARCHAR(500) | YES | NULL | - | - | 説明 | 新規 |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | - | 作成日時 | 新規 |

#### 制約

| 制約名 | 種別 | 対象カラム | 説明 |
|--------|------|-----------|------|
| PK_PROJECT | PRIMARY KEY | ID | 主キー制約 |

---

### 2.2 テーブル名: TODO（変更）

| 項目 | 内容 |
|------|------|
| テーブル名 | TODO |
| 概要 | チケット情報を管理するテーブル |
| 変更種別 | カラム追加 |

#### 追加カラム定義

| カラム名 | 型 | NULL | デフォルト | PK | FK | 説明 | 変更種別 |
|---------|-----|------|-----------|----|----|------|----------|
| PROJECT_ID | BIGINT | YES | NULL | - | O | 所属案件ID | 追加 |
| START_DATE | DATE | YES | NULL | - | - | 開始日 | 追加 |
| DUE_DATE | DATE | YES | NULL | - | - | 終了日 | 追加 |

#### 既存カラム（参考）

| カラム名 | 型 | NULL | デフォルト | PK | FK | 説明 |
|---------|-----|------|-----------|----|----|------|
| ID | BIGINT | NO | AUTO_INCREMENT | O | - | 主キー |
| TITLE | VARCHAR(255) | NO | - | - | - | タイトル |
| DESCRIPTION | VARCHAR(1000) | YES | NULL | - | - | 説明 |
| COMPLETED | BOOLEAN | NO | FALSE | - | - | 完了フラグ |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | - | 作成日時 |

#### 追加制約

| 制約名 | 種別 | 対象カラム | 説明 |
|--------|------|-----------|------|
| FK_TODO_PROJECT | FOREIGN KEY | PROJECT_ID | PROJECT.IDへの外部キー（CASCADE DELETE） |

---

## 3. インデックス設計

### 3.1 インデックス一覧

| インデックス名 | テーブル | カラム | 種別 | 目的 |
|---------------|---------|--------|------|------|
| IDX_TODO_PROJECT_ID | TODO | PROJECT_ID | BTREE | 案件別チケット検索の高速化 |

---

## 4. マイグレーション

### 4.1 DDL

#### 適用SQL（schema.sql）

```sql
-- PROJECTテーブル作成
CREATE TABLE IF NOT EXISTS PROJECT (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    DESCRIPTION VARCHAR(500),
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TODOテーブル変更（カラム追加）
-- 注意: H2はALTER TABLE ADD COLUMNをサポート
-- ただし、schema.sqlはアプリ起動時に毎回実行されるため、
-- CREATE TABLE IF NOT EXISTS形式で全カラムを定義する

-- TODOテーブル作成（変更後）
CREATE TABLE IF NOT EXISTS TODO (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(1000),
    COMPLETED BOOLEAN NOT NULL DEFAULT FALSE,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PROJECT_ID BIGINT,
    START_DATE DATE,
    DUE_DATE DATE,
    CONSTRAINT FK_TODO_PROJECT FOREIGN KEY (PROJECT_ID) REFERENCES PROJECT(ID) ON DELETE CASCADE
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS IDX_TODO_PROJECT_ID ON TODO (PROJECT_ID);
```

#### ロールバックSQL（参考）

```sql
-- インデックス削除
DROP INDEX IF EXISTS IDX_TODO_PROJECT_ID;

-- 外部キー削除（H2構文）
ALTER TABLE TODO DROP CONSTRAINT IF EXISTS FK_TODO_PROJECT;

-- TODOテーブルからカラム削除
ALTER TABLE TODO DROP COLUMN IF EXISTS PROJECT_ID;
ALTER TABLE TODO DROP COLUMN IF EXISTS START_DATE;
ALTER TABLE TODO DROP COLUMN IF EXISTS DUE_DATE;

-- PROJECTテーブル削除
DROP TABLE IF EXISTS PROJECT;
```

### 4.2 DML（初期データ）

```sql
-- PROJECTテーブルの初期データはなし（ユーザーが作成）

-- 既存TODOデータはそのまま維持
-- PROJECT_ID, START_DATE, DUE_DATEはNULLのまま
```

---

## 5. データ移行

### 5.1 移行対象

既存のTODOテーブルデータは移行不要。新規カラムはNULLとして扱う。

| 移行元 | 移行先 | 件数 | 変換ルール |
|--------|--------|------|-----------|
| - | TODO.PROJECT_ID | 既存全件 | NULL（案件未設定） |
| - | TODO.START_DATE | 既存全件 | NULL（開始日未設定） |
| - | TODO.DUE_DATE | 既存全件 | NULL（終了日未設定） |

### 5.2 移行SQL

移行SQLは不要。スキーマ変更のみで対応。

---

## 6. 影響分析

### 6.1 影響を受けるコンポーネント

| コンポーネント | 影響内容 | 対応 |
|---------------|---------|------|
| Todo.java | フィールド追加 | projectId, startDate, dueDateフィールド追加 |
| TodoMapper.java | メソッド追加 | 案件フィルタ用メソッド追加 |
| TodoMapper.xml | SQL変更 | 新カラム対応のSQL追加・変更 |
| TodoService.java | ロジック追加 | 案件フィルタ、日付バリデーション追加 |
| TodoController.java | パラメータ追加 | projectIdクエリパラメータ対応 |

---

## 7. ER図

```
┌──────────────────────────────────┐
│            PROJECT               │
├──────────────────────────────────┤
│ ID         BIGINT       PK       │
│ NAME       VARCHAR(100) NOT NULL │
│ DESCRIPTION VARCHAR(500)         │
│ CREATED_AT TIMESTAMP    NOT NULL │
└──────────────────────────────────┘
                │
                │ 1:N
                │
                ▼
┌──────────────────────────────────┐
│              TODO                │
├──────────────────────────────────┤
│ ID          BIGINT       PK      │
│ TITLE       VARCHAR(255) NOT NULL│
│ DESCRIPTION VARCHAR(1000)        │
│ COMPLETED   BOOLEAN      NOT NULL│
│ CREATED_AT  TIMESTAMP    NOT NULL│
│ PROJECT_ID  BIGINT       FK      │ ← 追加
│ START_DATE  DATE                 │ ← 追加
│ DUE_DATE    DATE                 │ ← 追加
└──────────────────────────────────┘
```

---

## 8. 注意事項

### 8.1 H2 Database固有の考慮点

| 項目 | 内容 |
|------|------|
| スキーマ初期化 | `spring.sql.init.mode=always`により起動時にschema.sql実行 |
| IF NOT EXISTS | テーブル・インデックスは存在チェック付きで作成 |
| CASCADE DELETE | 外部キーにON DELETE CASCADEを設定 |

### 8.2 既存データの扱い

| 項目 | 内容 |
|------|------|
| 既存TODO | PROJECT_ID=NULLとして「案件なし」に分類 |
| 既存初期データ | data.sqlの変更不要（新カラムはDEFAULT NULL） |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
