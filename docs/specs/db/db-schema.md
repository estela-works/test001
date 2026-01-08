# DB構造

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. 概要

| 項目 | 内容 |
|------|------|
| データストア種別 | H2 Database（ファイルモード） |
| 接続URL | jdbc:h2:file:./data/tododb |
| データファイル | ./data/tododb.mv.db |
| 永続化 | あり（ファイルに保存） |
| 最終更新日 | 2025-12-26 |

---

## 2. テーブル一覧

| テーブル名 | 説明 | 行数目安 | 追加案件 |
|-----------|------|----------|----------|
| APP_USER | ユーザー管理テーブル | 数件〜数十件 | 202512_担当者機能追加 |
| PROJECT | プロジェクト管理テーブル | 数件〜数十件 | 202512_プロジェクト機能追加 |
| TODO | ToDoアイテム管理テーブル | 数十〜数百件 | 初期構築 |
| TODOCOMMENT | ToDoコメント管理テーブル | 数十〜数百件 | 20251225_チケット詳細コメント機能 |

---

## 3. テーブル定義

### 3.1 APP_USER

**テーブル名**: APP_USER（担当者マスタ）

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|----------|------|-----------|------|
| ID | BIGINT | NO | AUTO_INCREMENT | 主キー（自動採番） |
| NAME | VARCHAR(100) | NO | - | ユーザー名（必須、一意） |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時（自動設定） |

**主キー**: ID

**ユニーク制約**: UQ_APP_USER_NAME (NAME)

#### DDL

```sql
CREATE TABLE IF NOT EXISTS APP_USER (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_APP_USER_NAME UNIQUE (NAME)
);
```

---

### 3.2 PROJECT

**テーブル名**: PROJECT

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|----------|------|-----------|------|
| ID | BIGINT | NO | AUTO_INCREMENT | 主キー（自動採番） |
| NAME | VARCHAR(100) | NO | - | プロジェクト名（必須） |
| DESCRIPTION | VARCHAR(500) | YES | NULL | 説明（任意） |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時（自動設定） |

**主キー**: ID

#### DDL

```sql
CREATE TABLE IF NOT EXISTS PROJECT (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    DESCRIPTION VARCHAR(500),
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3.3 TODO

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
- FK_TODO_PROJECT: PROJECT_ID → PROJECT(ID) ON DELETE CASCADE
- FK_TODO_USER: ASSIGNEE_ID → APP_USER(ID) ON DELETE SET NULL

**インデックス**:
- IDX_TODO_PROJECT_ID (PROJECT_ID)
- IDX_TODO_ASSIGNEE_ID (ASSIGNEE_ID)

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
    CONSTRAINT FK_TODO_PROJECT FOREIGN KEY (PROJECT_ID) REFERENCES PROJECT(ID) ON DELETE CASCADE,
    CONSTRAINT FK_TODO_USER FOREIGN KEY (ASSIGNEE_ID) REFERENCES APP_USER(ID) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IDX_TODO_PROJECT_ID ON TODO (PROJECT_ID);
CREATE INDEX IF NOT EXISTS IDX_TODO_ASSIGNEE_ID ON TODO (ASSIGNEE_ID);
```

---

### 3.4 TODOCOMMENT

**テーブル名**: TODOCOMMENT（コメント機能）

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|---------|----------|------|-----------|------|
| ID | BIGINT | NO | AUTO_INCREMENT | 主キー（自動採番） |
| TODO_ID | BIGINT | NO | - | ToDoID（外部キー、必須） |
| USER_ID | BIGINT | YES | NULL | 投稿者ID（外部キー） |
| CONTENT | VARCHAR(2000) | NO | - | コメント内容（必須） |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | 作成日時（自動設定） |

**主キー**: ID

**外部キー**:
- FK_TODOCOMMENT_TODO: TODO_ID → TODO(ID) ON DELETE CASCADE
- FK_TODOCOMMENT_USER: USER_ID → APP_USER(ID) ON DELETE SET NULL

**インデックス**:
- IDX_TODOCOMMENT_TODO_ID (TODO_ID)

#### DDL

```sql
CREATE TABLE IF NOT EXISTS TODOCOMMENT (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TODO_ID BIGINT NOT NULL,
    USER_ID BIGINT,
    CONTENT VARCHAR(2000) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_TODOCOMMENT_TODO FOREIGN KEY (TODO_ID) REFERENCES TODO(ID) ON DELETE CASCADE,
    CONSTRAINT FK_TODOCOMMENT_USER FOREIGN KEY (USER_ID) REFERENCES APP_USER(ID) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IDX_TODOCOMMENT_TODO_ID ON TODOCOMMENT(TODO_ID);
```

---

## 4. Entity マッピング

### 4.1 User.java（APP_USERテーブル）

| カラム名 | フィールド名 | Javaの型 | 備考 |
|---------|-------------|----------|------|
| ID | id | Long | 主キー |
| NAME | name | String | 必須、一意 |
| CREATED_AT | createdAt | LocalDateTime | camelCase変換 |

### 4.2 Project.java

| カラム名 | フィールド名 | Javaの型 | 備考 |
|---------|-------------|----------|------|
| ID | id | Long | 主キー |
| NAME | name | String | 必須 |
| DESCRIPTION | description | String | 任意 |
| CREATED_AT | createdAt | LocalDateTime | camelCase変換 |

### 4.3 Todo.java

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
| (JOIN) | assigneeName | String | APP_USER.NAMEから取得（非永続化） |
| (JOIN) | projectName | String | PROJECT.NAMEから取得（非永続化） |

### 4.4 TodoComment.java

| カラム名 | フィールド名 | Javaの型 | 備考 |
|---------|-------------|----------|------|
| ID | id | Long | 主キー |
| TODO_ID | todoId | Long | 必須 |
| USER_ID | userId | Long | 任意 |
| CONTENT | content | String | 必須 |
| CREATED_AT | createdAt | LocalDateTime | camelCase変換 |
| (JOIN) | userName | String | APP_USER.NAMEから取得（非永続化） |

**マッピング設定**:
```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

---

## 5. 初期データ

### 5.1 APP_USER初期データ

アプリケーション起動時に3件のユーザーデータが投入される:

| ID | NAME | CREATED_AT |
|----|------|------------|
| 1 | 山田太郎 | 起動時刻 |
| 2 | 鈴木花子 | 起動時刻 |
| 3 | 佐藤一郎 | 起動時刻 |

### 5.2 PROJECT初期データ

アプリケーション起動時に2件のプロジェクトデータが投入される:

| ID | NAME | DESCRIPTION | CREATED_AT |
|----|------|-------------|------------|
| 1 | サンプルプロジェクト | デモ用プロジェクト | 起動時刻 |
| 2 | 開発プロジェクト | 開発用プロジェクト | 起動時刻 |

### 5.3 TODO初期データ

アプリケーション起動時に3件のサンプルデータが投入される:

| ID | TITLE | DESCRIPTION | COMPLETED | CREATED_AT |
|----|-------|-------------|-----------|------------|
| 1 | Spring Bootの学習 | Spring Bootアプリケーションの基本を理解する | FALSE | 起動時刻 |
| 2 | ToDoリストの実装 | REST APIとフロントエンドを実装する | FALSE | 起動時刻 |
| 3 | プロジェクトのテスト | 作成したアプリケーションの動作確認 | FALSE | 起動時刻 |

#### DML（data.sql）

```sql
-- APP_USERテーブル初期データ（TODOより先に投入）
MERGE INTO APP_USER (ID, NAME) KEY(ID) VALUES
(1, '山田太郎'),
(2, '鈴木花子'),
(3, '佐藤一郎');

-- PROJECTテーブル初期データ
MERGE INTO PROJECT (ID, NAME, DESCRIPTION) KEY(ID) VALUES
(1, 'サンプルプロジェクト', 'デモ用プロジェクト'),
(2, '開発プロジェクト', '開発用プロジェクト');

-- TODOテーブル初期データ
MERGE INTO TODO (ID, TITLE, DESCRIPTION, COMPLETED) KEY(ID) VALUES
(1, 'Spring Bootの学習', 'Spring Bootアプリケーションの基本を理解する', FALSE),
(2, 'ToDoリストの実装', 'REST APIとフロントエンドを実装する', FALSE),
(3, 'プロジェクトのテスト', '作成したアプリケーションの動作確認', FALSE);
```

**補足**:
- `MERGE INTO ... KEY(ID)` により、既存データがあれば更新、なければ挿入となる
- APP_USER、PROJECTはTODOより先に投入（外部キー制約）
- TODOCOMMENTテーブルには初期データなし

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
| 2025-12-22 | PROJECTテーブル追加、TODOにPROJECT_ID追加 | 202512_プロジェクト機能追加 |
| 2025-12-25 | TODOCOMMENTテーブル追加 | 20251225_チケット詳細コメント機能 |
| 2025-12-26 | USERテーブル名をAPP_USERに変更、インデックス・外部キー制約名追加 | - |
