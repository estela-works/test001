# DB詳細設計書

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

担当者機能追加に伴うデータベースの変更仕様（テーブル定義、マイグレーション）を定義する。

### 1.2 変更種別

| 種別 | 対象 |
|------|------|
| テーブル新規作成 | USER |
| テーブル変更 | TODO（ASSIGNEE_IDカラム追加） |
| インデックス追加 | IDX_TODO_ASSIGNEE_ID |

---

## 2. テーブル設計

### 2.1 テーブル名: USER（新規作成）

| 項目 | 内容 |
|------|------|
| テーブル名 | USER |
| 概要 | ユーザーマスタ（担当者選択用） |
| 変更種別 | 新規作成 |

#### カラム定義

| カラム名 | 型 | NULL | デフォルト | PK | FK | 説明 | 変更種別 |
|---------|-----|------|-----------|----|----|------|----------|
| ID | BIGINT | NO | AUTO_INCREMENT | ○ | - | 主キー | 新規 |
| NAME | VARCHAR(100) | NO | - | - | - | ユーザー名（一意） | 新規 |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | - | 作成日時 | 新規 |

#### 制約

| 制約名 | 種別 | 対象カラム | 説明 |
|--------|------|-----------|------|
| PK_USER | PRIMARY KEY | ID | 主キー制約 |
| UQ_USER_NAME | UNIQUE | NAME | ユーザー名の一意制約 |

---

### 2.2 テーブル名: TODO（変更）

| 項目 | 内容 |
|------|------|
| テーブル名 | TODO |
| 概要 | ToDoアイテム管理テーブル |
| 変更種別 | カラム追加 |

#### 追加カラム定義

| カラム名 | 型 | NULL | デフォルト | PK | FK | 説明 | 変更種別 |
|---------|-----|------|-----------|----|----|------|----------|
| ASSIGNEE_ID | BIGINT | YES | NULL | - | ○ | 担当者ID（USERへの外部キー） | 追加 |

#### 制約（追加）

| 制約名 | 種別 | 対象カラム | 説明 |
|--------|------|-----------|------|
| FK_TODO_USER | FOREIGN KEY | ASSIGNEE_ID | 外部キー制約（ON DELETE SET NULL） |

**補足**: ユーザー削除時は、該当ToDoのASSIGNEE_IDをNULLに設定する（ON DELETE SET NULL）。

---

## 3. インデックス設計

### 3.1 インデックス一覧

| インデックス名 | テーブル | カラム | 種別 | 目的 |
|---------------|---------|--------|------|------|
| IDX_TODO_ASSIGNEE_ID | TODO | ASSIGNEE_ID | BTREE | 担当者での検索・フィルタリング（将来対応） |

---

## 4. マイグレーション

### 4.1 DDL

#### 適用SQL（schema.sql への追記）

```sql
-- USERテーブル作成
CREATE TABLE IF NOT EXISTS USER (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_USER_NAME UNIQUE (NAME)
);

-- TODOテーブルにASSIGNEE_IDカラム追加
ALTER TABLE TODO ADD COLUMN IF NOT EXISTS ASSIGNEE_ID BIGINT;

-- 外部キー制約追加
ALTER TABLE TODO ADD CONSTRAINT IF NOT EXISTS FK_TODO_USER
    FOREIGN KEY (ASSIGNEE_ID) REFERENCES USER(ID) ON DELETE SET NULL;

-- インデックス作成
CREATE INDEX IF NOT EXISTS IDX_TODO_ASSIGNEE_ID ON TODO (ASSIGNEE_ID);
```

#### 変更後のschema.sql（全体）

```sql
-- テーブル削除（依存関係順）
DROP TABLE IF EXISTS TODO;
DROP TABLE IF EXISTS PROJECT;
DROP TABLE IF EXISTS USER;

-- USERテーブル作成
CREATE TABLE USER (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_USER_NAME UNIQUE (NAME)
);

-- PROJECTテーブル作成
CREATE TABLE PROJECT (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    DESCRIPTION VARCHAR(500),
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TODOテーブル作成
CREATE TABLE TODO (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(1000),
    COMPLETED BOOLEAN NOT NULL DEFAULT FALSE,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PROJECT_ID BIGINT,
    START_DATE DATE,
    DUE_DATE DATE,
    ASSIGNEE_ID BIGINT,
    CONSTRAINT FK_TODO_PROJECT FOREIGN KEY (PROJECT_ID) REFERENCES PROJECT(ID) ON DELETE CASCADE,
    CONSTRAINT FK_TODO_USER FOREIGN KEY (ASSIGNEE_ID) REFERENCES USER(ID) ON DELETE SET NULL
);

-- インデックス作成
CREATE INDEX IDX_TODO_PROJECT_ID ON TODO (PROJECT_ID);
CREATE INDEX IDX_TODO_ASSIGNEE_ID ON TODO (ASSIGNEE_ID);
```

#### ロールバックSQL

```sql
-- インデックス削除
DROP INDEX IF EXISTS IDX_TODO_ASSIGNEE_ID ON TODO;

-- 外部キー制約削除
ALTER TABLE TODO DROP CONSTRAINT IF EXISTS FK_TODO_USER;

-- カラム削除
ALTER TABLE TODO DROP COLUMN IF EXISTS ASSIGNEE_ID;

-- テーブル削除
DROP TABLE IF EXISTS USER;
```

### 4.2 DML（初期データ）

#### data.sql への追記

```sql
-- ユーザー初期データ
MERGE INTO USER (ID, NAME) KEY(ID) VALUES
(1, '山田太郎'),
(2, '鈴木花子'),
(3, '佐藤一郎');
```

---

## 5. データ移行

### 5.1 移行対象

| 移行元 | 移行先 | 件数 | 変換ルール |
|--------|--------|------|-----------|
| - | TODO.ASSIGNEE_ID | 既存全件 | NULLを設定（未割当） |

### 5.2 移行方針

- 既存のTODOデータは、ASSIGNEE_IDがNULL（未割当）として扱われる
- マイグレーション時のデータ移行SQLは不要（NULLがデフォルト）

---

## 6. 影響分析

### 6.1 影響を受けるコンポーネント

| コンポーネント | 影響内容 | 対応 |
|---------------|---------|------|
| Todo.java | assigneeId, assigneeNameフィールド追加 | エンティティ変更 |
| TodoMapper.java | ASSIGNEE_ID対応メソッド追加 | インターフェース変更 |
| TodoMapper.xml | SELECT/INSERT/UPDATEのカラム追加 | SQL変更 |
| TodoService.java | assigneeName取得ロジック追加 | サービス変更 |
| TodoController.java | リクエスト/レスポンス対応 | コントローラー変更 |

### 6.2 新規作成コンポーネント

| コンポーネント | 概要 |
|---------------|------|
| User.java | ユーザーエンティティ |
| UserMapper.java | ユーザーMapperインターフェース |
| UserMapper.xml | ユーザーSQL定義 |
| UserService.java | ユーザーサービス |
| UserController.java | ユーザーAPIコントローラー |

---

## 7. ER図

```
┌─────────────────────┐
│       USER          │
├─────────────────────┤
│ * ID (PK)           │
│   NAME (UQ)         │
│   CREATED_AT        │
└──────────┬──────────┘
           │
           │ 1:N
           │
┌──────────▼──────────┐       ┌─────────────────────┐
│       TODO          │       │      PROJECT        │
├─────────────────────┤       ├─────────────────────┤
│ * ID (PK)           │       │ * ID (PK)           │
│   TITLE             │       │   NAME              │
│   DESCRIPTION       │   N:1 │   DESCRIPTION       │
│   COMPLETED         │◄──────│   CREATED_AT        │
│   CREATED_AT        │       └─────────────────────┘
│   PROJECT_ID (FK)   │
│   START_DATE        │
│   DUE_DATE          │
│   ASSIGNEE_ID (FK)  │ ← 追加
└─────────────────────┘
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
