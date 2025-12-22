# DB構造

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. 概要

| 項目 | 内容 |
|------|------|
| データストア種別 | H2 Database（ファイルモード） |
| 接続URL | jdbc:h2:file:./data/tododb |
| データファイル | ./data/tododb.mv.db |
| 永続化 | あり（ファイルに保存） |
| 最終更新日 | 2025-12-22 |

---

## 2. テーブル一覧

| テーブル名 | 説明 | 行数目安 | 追加案件 |
|-----------|------|----------|----------|
| TODO | ToDoアイテム管理テーブル | 数十〜数百件 | 初期構築 |
| USER | ユーザー管理テーブル | 数件〜数十件 | 202512_担当者機能追加 |

---

## 3. テーブル定義

### 3.1 TODO

**テーブル名**: TODO

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|----------|------|-----------|------|
| ID | BIGINT | NO | AUTO_INCREMENT | 主キー（自動採番） |
| TITLE | VARCHAR(255) | NO | - | タイトル（必須） |
| DESCRIPTION | VARCHAR(1000) | YES | NULL | 説明（任意） |
| COMPLETED | BOOLEAN | NO | FALSE | 完了フラグ |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時（自動設定） |
| PROJECT_ID | BIGINT | YES | NULL | プロジェクトID（外部キー） |
| START_DATE | DATE | YES | NULL | 開始日 |
| DUE_DATE | DATE | YES | NULL | 終了日 |
| ASSIGNEE_ID | BIGINT | YES | NULL | 担当者ID（外部キー） |

**主キー**: ID

**外部キー**:
- ASSIGNEE_ID → USER(ID) ON DELETE SET NULL

**インデックス**: なし（現時点では不要）

#### DDL

```sql
CREATE TABLE IF NOT EXISTS TODO (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(1000),
    COMPLETED BOOLEAN NOT NULL DEFAULT FALSE,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PROJECT_ID BIGINT,
    START_DATE DATE,
    DUE_DATE DATE,
    ASSIGNEE_ID BIGINT,
    FOREIGN KEY (ASSIGNEE_ID) REFERENCES USER(ID) ON DELETE SET NULL
);
```

---

### 3.2 USER

**テーブル名**: USER

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|----------|------|-----------|------|
| ID | BIGINT | NO | AUTO_INCREMENT | 主キー（自動採番） |
| NAME | VARCHAR(100) | NO | - | ユーザー名（必須、一意） |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時（自動設定） |

**主キー**: ID

**ユニーク制約**: NAME

#### DDL

```sql
CREATE TABLE IF NOT EXISTS USER (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL UNIQUE,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Entity マッピング

### 4.1 Todo.java

| カラム名 | フィールド名 | Javaの型 | 備考 |
|---------|-------------|----------|------|
| ID | id | Long | 主キー |
| TITLE | title | String | 必須 |
| DESCRIPTION | description | String | 任意 |
| COMPLETED | completed | boolean | プリミティブ型 |
| CREATED_AT | createdAt | LocalDateTime | camelCase変換 |
| PROJECT_ID | projectId | Long | 任意 |
| START_DATE | startDate | LocalDate | 任意 |
| DUE_DATE | dueDate | LocalDate | 任意 |
| ASSIGNEE_ID | assigneeId | Long | 任意 |
| (JOIN) | assigneeName | String | USER.NAMEから取得（非永続化） |

### 4.2 User.java

| カラム名 | フィールド名 | Javaの型 | 備考 |
|---------|-------------|----------|------|
| ID | id | Long | 主キー |
| NAME | name | String | 必須、一意 |
| CREATED_AT | createdAt | LocalDateTime | camelCase変換 |

**マッピング設定**:
```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

---

## 5. 初期データ

### 5.1 USER初期データ

アプリケーション起動時に3件のユーザーデータが投入される:

| ID | NAME | CREATED_AT |
|----|------|------------|
| 1 | 山田太郎 | 起動時刻 |
| 2 | 鈴木花子 | 起動時刻 |
| 3 | 佐藤一郎 | 起動時刻 |

### 5.2 TODO初期データ

アプリケーション起動時に3件のサンプルデータが投入される:

| ID | TITLE | DESCRIPTION | COMPLETED | CREATED_AT |
|----|-------|-------------|-----------|------------|
| 1 | Spring Bootの学習 | Spring Bootアプリケーションの基本を理解する | FALSE | 起動時刻 |
| 2 | ToDoリストの実装 | REST APIとフロントエンドを実装する | FALSE | 起動時刻 |
| 3 | プロジェクトのテスト | 作成したアプリケーションの動作確認 | FALSE | 起動時刻 |

#### DML（data.sql）

```sql
-- USERテーブル初期データ（TODOより先に投入）
MERGE INTO USER (ID, NAME) KEY(ID) VALUES
(1, '山田太郎'),
(2, '鈴木花子'),
(3, '佐藤一郎');

-- TODOテーブル初期データ
MERGE INTO TODO (ID, TITLE, DESCRIPTION, COMPLETED) KEY(ID) VALUES
(1, 'Spring Bootの学習', 'Spring Bootアプリケーションの基本を理解する', FALSE),
(2, 'ToDoリストの実装', 'REST APIとフロントエンドを実装する', FALSE),
(3, 'プロジェクトのテスト', '作成したアプリケーションの動作確認', FALSE);
```

**補足**: `MERGE INTO ... KEY(ID)` により、既存データがあれば更新、なければ挿入となる。USERテーブルはTODOより先に投入する必要がある（外部キー制約のため）。

---

## 6. データ管理仕様

### 6.1 ID採番

| 項目 | 内容 |
|------|------|
| 方式 | AUTO_INCREMENT |
| 開始値 | 1 |
| 採番 | DBが自動採番 |
| 再利用 | なし（削除されたIDは再利用しない） |

### 6.2 スレッドセーフティ

| 対策 | 説明 |
|------|------|
| HikariCP | Spring Boot標準のコネクションプール |
| H2ロック機構 | データベースレベルでの整合性保証 |
| ユーザー名一意制約 | DBレベルでの重複防止 |

### 6.3 スキーマ管理

| 項目 | 設定 |
|------|------|
| 定義ファイル | src/main/resources/schema.sql |
| 初期データ | src/main/resources/data.sql |
| 実行タイミング | アプリケーション起動時（常に実行） |
| 設定 | spring.sql.init.mode=always |

---

## 7. H2 Console

開発時にH2 Consoleからデータベースに直接アクセス可能:

| 項目 | 値 |
|------|-----|
| URL | http://localhost:8080/h2-console |
| JDBC URL | jdbc:h2:file:./data/tododb |
| User | sa |
| Password | (空) |

---

## 8. テスト用設定

テスト実行時はインメモリモードを使用:

| 項目 | 本番 | テスト |
|------|------|--------|
| 接続URL | jdbc:h2:file:./data/tododb | jdbc:h2:mem:testdb |
| 永続化 | あり | なし |
| プロファイル | default | test |

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-22 | 初版作成（インメモリ構造） | 初期構築 |
| 2025-12-22 | H2 Database移行（テーブル定義追加） | 202512_H2DB移行 |
| 2025-12-22 | USERテーブル追加、TODOにASSIGNEE_ID追加 | 202512_担当者機能追加 |
