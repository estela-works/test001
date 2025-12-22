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

| テーブル名 | 説明 | 行数目安 |
|-----------|------|----------|
| TODO | ToDoアイテム管理テーブル | 数十〜数百件 |

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

**主キー**: ID

**インデックス**: なし（現時点では不要）

#### DDL

```sql
CREATE TABLE IF NOT EXISTS TODO (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(1000),
    COMPLETED BOOLEAN NOT NULL DEFAULT FALSE,
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

**マッピング設定**:
```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

---

## 5. 初期データ

アプリケーション起動時に3件のサンプルデータが投入される:

| ID | TITLE | DESCRIPTION | COMPLETED | CREATED_AT |
|----|-------|-------------|-----------|------------|
| 1 | Spring Bootの学習 | Spring Bootアプリケーションの基本を理解する | FALSE | 起動時刻 |
| 2 | ToDoリストの実装 | REST APIとフロントエンドを実装する | FALSE | 起動時刻 |
| 3 | プロジェクトのテスト | 作成したアプリケーションの動作確認 | FALSE | 起動時刻 |

#### DML（data.sql）

```sql
MERGE INTO TODO (ID, TITLE, DESCRIPTION, COMPLETED) KEY(ID) VALUES
(1, 'Spring Bootの学習', 'Spring Bootアプリケーションの基本を理解する', FALSE),
(2, 'ToDoリストの実装', 'REST APIとフロントエンドを実装する', FALSE),
(3, 'プロジェクトのテスト', '作成したアプリケーションの動作確認', FALSE);
```

**補足**: `MERGE INTO ... KEY(ID)` により、既存データがあれば更新、なければ挿入となる。

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
