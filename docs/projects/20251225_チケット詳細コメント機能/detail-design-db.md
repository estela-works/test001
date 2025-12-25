# DB詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

コメント機能のデータベース変更仕様（テーブル定義、インデックス、マイグレーション）を定義する。

### 1.2 変更種別

| 種別 | 対象 |
|------|------|
| テーブル新規作成 | TODOCOMMENT |
| インデックス追加 | idx_todocomment_todo_id |

---

## 2. テーブル設計

### 2.1 テーブル名: TODOCOMMENT

| 項目 | 内容 |
|------|------|
| テーブル名 | TODOCOMMENT |
| 物理名 | TODOCOMMENT |
| 論理名 | ToDoコメント |
| 概要 | ToDoチケットに紐づくコメント情報を格納 |
| 変更種別 | 新規作成 |

#### カラム定義

| # | カラム名 | 型 | NULL | デフォルト | PK | FK | 説明 | 変更種別 |
|---|---------|-----|------|-----------|----|----|------|----------|
| 1 | ID | BIGINT | NO | AUTO_INCREMENT | ○ | - | コメントID（主キー） | 新規 |
| 2 | TODO_ID | BIGINT | NO | - | - | ○ | ToDoID（外部キー） | 新規 |
| 3 | USER_ID | BIGINT | YES | NULL | - | ○ | 投稿者のユーザーID（外部キー） | 新規 |
| 4 | CONTENT | VARCHAR(2000) | NO | - | - | - | コメント内容 | 新規 |
| 5 | CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | - | 投稿日時 | 新規 |

#### 制約

| 制約名 | 種別 | 対象カラム | 参照先 | 削除時動作 | 説明 |
|--------|------|-----------|--------|----------|------|
| pk_todocomment | PRIMARY KEY | ID | - | - | 主キー制約 |
| fk_todocomment_todo | FOREIGN KEY | TODO_ID | TODO(ID) | CASCADE | チケット削除時にコメントも削除 |
| fk_todocomment_user | FOREIGN KEY | USER_ID | USER(ID) | SET NULL | ユーザー削除時にNULLに設定 |

#### インデックス

| インデックス名 | 種別 | カラム | 目的 |
|--------------|------|--------|------|
| pk_todocomment | PRIMARY | ID | 主キー検索 |
| idx_todocomment_todo_id | BTREE | TODO_ID | コメント一覧取得の高速化 |

#### DDL

```sql
CREATE TABLE IF NOT EXISTS TODOCOMMENT (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TODO_ID BIGINT NOT NULL,
    USER_ID BIGINT,
    CONTENT VARCHAR(2000) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TODO_ID) REFERENCES TODO(ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID) ON DELETE SET NULL
);

CREATE INDEX idx_todocomment_todo_id ON TODOCOMMENT(TODO_ID);
```

---

## 3. ER図

### 3.1 テーブル間の関連

```
┌──────────────┐
│     TODO     │
│              │
│ ID (PK)      │◄──────────┐
│ TITLE        │            │
│ ...          │            │
└──────────────┘            │
                            │
                            │ TODO_ID (FK)
                            │ ON DELETE CASCADE
                            │
                   ┌────────┴────────┐
                   │  TODOCOMMENT    │
                   │                 │
                   │ ID (PK)         │
                   │ TODO_ID (FK)    │
                   │ USER_ID (FK)    │◄────┐
                   │ CONTENT         │     │
                   │ CREATED_AT      │     │
                   └─────────────────┘     │
                                           │ USER_ID (FK)
                                           │ ON DELETE SET NULL
                                           │
                                      ┌────┴────────┐
                                      │    USER     │
                                      │             │
                                      │ ID (PK)     │
                                      │ NAME        │
                                      │ ...         │
                                      └─────────────┘
```

---

## 4. マイグレーション

### 4.1 適用SQL

#### schema.sqlへの追加

```sql
-- ========================================
-- TODOCOMMENTテーブル（コメント機能）
-- 案件: 20251225_チケット詳細コメント機能
-- ========================================

CREATE TABLE IF NOT EXISTS TODOCOMMENT (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TODO_ID BIGINT NOT NULL,
    USER_ID BIGINT,
    CONTENT VARCHAR(2000) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TODO_ID) REFERENCES TODO(ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID) ON DELETE SET NULL
);

CREATE INDEX idx_todocomment_todo_id ON TODOCOMMENT(TODO_ID);
```

### 4.2 ロールバックSQL

```sql
-- インデックス削除
DROP INDEX idx_todocomment_todo_id ON TODOCOMMENT;

-- テーブル削除
DROP TABLE IF EXISTS TODOCOMMENT;
```

### 4.3 DML（初期データ）

コメントテーブルには初期データを投入しない。

```sql
-- 初期データなし
```

---

## 5. データ量見積もり

### 5.1 容量計算

#### 1件あたりのデータサイズ

| カラム | 型 | バイト数 | 備考 |
|--------|-----|---------|------|
| ID | BIGINT | 8 | - |
| TODO_ID | BIGINT | 8 | - |
| USER_ID | BIGINT | 8 | NULL許可 |
| CONTENT | VARCHAR(2000) | 〜2000 | 可変長 |
| CREATED_AT | TIMESTAMP | 8 | - |
| **合計** | - | **〜2032** | 平均500文字と仮定で532バイト |

#### 想定レコード数

| 期間 | 想定レコード数 | 容量 |
|------|-------------|------|
| 1ヶ月 | 100件 | 〜50KB |
| 1年 | 1,200件 | 〜600KB |
| 5年 | 6,000件 | 〜3MB |

### 5.2 パフォーマンス見積もり

| 操作 | 想定時間 | 条件 |
|------|---------|------|
| コメント一覧取得 | < 10ms | 100件以下、インデックス使用 |
| コメント投稿 | < 10ms | - |
| コメント削除 | < 5ms | - |

---

## 6. 制約と削除時動作

### 6.1 外部キー制約の詳細

#### FK: TODO_ID → TODO(ID)

| 項目 | 内容 |
|------|------|
| 参照先 | TODO(ID) |
| 削除時動作 | ON DELETE CASCADE |
| 更新時動作 | デフォルト（RESTRICT） |
| 理由 | チケット削除時に紐づくコメントも削除されるべき |

**動作例**:
```sql
-- TODOを削除すると、関連するTODOCOMMENTも自動削除される
DELETE FROM TODO WHERE ID = 10;
-- TODO_ID=10のTODOCOMMENTも全て削除される
```

#### FK: USER_ID → USER(ID)

| 項目 | 内容 |
|------|------|
| 参照先 | USER(ID) |
| 削除時動作 | ON DELETE SET NULL |
| 更新時動作 | デフォルト（RESTRICT） |
| 理由 | ユーザー削除後もコメント履歴は残したい |

**動作例**:
```sql
-- USERを削除すると、関連するTODOCOMMENTのUSER_IDがNULLになる
DELETE FROM USER WHERE ID = 1;
-- USER_ID=1のTODOCOMMENTは、USER_ID=NULLに更新される
```

---

## 7. インデックス設計詳細

### 7.1 idx_todocomment_todo_id

| 項目 | 内容 |
|------|------|
| インデックス名 | idx_todocomment_todo_id |
| 種別 | BTREE |
| 対象カラム | TODO_ID |
| ユニーク | NO |
| 目的 | コメント一覧取得クエリの高速化 |

**使用クエリ**:
```sql
SELECT * FROM TODOCOMMENT WHERE TODO_ID = ?
```

**効果**:
- フルテーブルスキャンを回避
- コメント数が増えても検索性能が劣化しない

---

## 8. 整合性保証

### 8.1 データ整合性ルール

| ルール | 保証方法 | 説明 |
|--------|---------|------|
| コメントは必ずチケットに紐づく | FK制約（TODO_ID） | チケットが存在しないコメントは作成不可 |
| チケット削除時はコメントも削除 | ON DELETE CASCADE | 孤立コメントを防ぐ |
| ユーザー削除後もコメントは残る | ON DELETE SET NULL | 履歴として保持 |
| コメント内容は必須 | NOT NULL制約 | 空コメントは作成不可 |
| 投稿日時は自動設定 | DEFAULT CURRENT_TIMESTAMP | アプリケーション側で設定不要 |

---

## 9. バックアップ・リストア

### 9.1 バックアップ

H2 Databaseのファイルベースのため、以下のファイルをバックアップ：

```
data/tododb.mv.db
```

### 9.2 リストア

バックアップファイルを復元後、アプリケーション再起動。

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
