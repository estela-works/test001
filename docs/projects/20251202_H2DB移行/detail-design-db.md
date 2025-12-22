# DB詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | H2 Database移行 |
| 案件ID | 202512_H2DB移行 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

H2 Databaseの導入に伴うテーブル定義・設定仕様を定義する。

### 1.2 変更種別

| 種別 | 対象 |
|------|------|
| データベース新規作成 | H2 Database（ファイルモード） |
| テーブル新規作成 | TODO |
| スキーマ管理 | schema.sqlによる明示的定義 |

---

## 2. データベース設計

### 2.1 データベース設定

| 項目 | 値 |
|------|-----|
| データベース種別 | H2 Database |
| 動作モード | ファイルモード（組み込み） |
| 接続URL | `jdbc:h2:file:./data/tododb` |
| データファイル | `./data/tododb.mv.db` |
| ユーザー名 | sa |
| パスワード | (空) |

### 2.2 H2固有設定

| 項目 | 設定値 | 説明 |
|------|--------|------|
| AUTO_SERVER | false | 組み込みモードのため不要 |
| DB_CLOSE_ON_EXIT | true | アプリ終了時にDB接続を閉じる |
| DB_CLOSE_DELAY | -1 | 最後の接続が閉じるまでDBを保持 |

---

## 3. テーブル設計

### 3.1 テーブル名: TODO

| 項目 | 内容 |
|------|------|
| テーブル名 | TODO |
| 概要 | ToDoアイテムを格納するテーブル |
| 変更種別 | 新規作成 |
| スキーマ管理 | schema.sqlで明示的に定義 |

#### カラム定義

| カラム名 | 型 | NULL | デフォルト | PK | 説明 |
|---------|-----|------|-----------|----|----|
| ID | BIGINT | NO | AUTO_INCREMENT | ○ | 主キー（自動採番） |
| TITLE | VARCHAR(255) | NO | - | - | タスクのタイトル |
| DESCRIPTION | VARCHAR(1000) | YES | NULL | - | タスクの説明 |
| COMPLETED | BOOLEAN | NO | FALSE | - | 完了状態 |
| CREATED_AT | TIMESTAMP | NO | CURRENT_TIMESTAMP | - | 作成日時 |

#### 制約

| 制約名 | 種別 | 対象カラム | 説明 |
|--------|------|-----------|------|
| PRIMARY KEY | PRIMARY KEY | ID | 主キー制約 |
| NOT NULL | NOT NULL | TITLE | タイトル必須 |
| NOT NULL | NOT NULL | COMPLETED | 完了状態必須 |
| NOT NULL | NOT NULL | CREATED_AT | 作成日時必須 |

---

## 4. スキーマ定義ファイル

### 4.1 schema.sql

| 項目 | 内容 |
|------|------|
| ファイルパス | `src/main/resources/schema.sql` |
| 実行タイミング | アプリケーション起動時 |
| 実行条件 | spring.sql.init.mode=always |

#### DDL

```sql
-- TODOテーブル作成
CREATE TABLE IF NOT EXISTS TODO (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(1000),
    COMPLETED BOOLEAN NOT NULL DEFAULT FALSE,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 data.sql

| 項目 | 内容 |
|------|------|
| ファイルパス | `src/main/resources/data.sql` |
| 実行タイミング | schema.sql実行後 |
| 用途 | 初期データ投入 |

#### DML

```sql
-- 初期データが存在しない場合のみ投入
INSERT INTO TODO (TITLE, DESCRIPTION, COMPLETED, CREATED_AT)
SELECT 'Spring Bootの学習', 'Spring Bootアプリケーションの基本を理解する', FALSE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM TODO);

INSERT INTO TODO (TITLE, DESCRIPTION, COMPLETED, CREATED_AT)
SELECT 'ToDoリストの実装', 'REST APIとフロントエンドを実装する', FALSE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM TODO WHERE TITLE = 'ToDoリストの実装');

INSERT INTO TODO (TITLE, DESCRIPTION, COMPLETED, CREATED_AT)
SELECT 'プロジェクトのテスト', '作成したアプリケーションの動作確認', FALSE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM TODO WHERE TITLE = 'プロジェクトのテスト');
```

---

## 5. インデックス設計

### 5.1 インデックス一覧

| インデックス名 | テーブル | カラム | 種別 | 目的 | 作成方法 |
|---------------|---------|--------|------|------|---------|
| PRIMARY | TODO | ID | PRIMARY | 主キー検索 | 自動作成 |

### 5.2 追加インデックス（将来検討）

本案件では追加インデックスは作成しない。将来的にデータ量増加時に以下を検討。

| インデックス名 | カラム | 目的 |
|---------------|--------|------|
| IDX_TODO_COMPLETED | COMPLETED | 完了状態フィルタの高速化 |
| IDX_TODO_CREATED_AT | CREATED_AT | ソート処理の高速化 |

---

## 6. 設定ファイル

### 6.1 application.properties

```properties
# H2 Database設定
spring.datasource.url=jdbc:h2:file:./data/tododb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# スキーマ初期化設定
spring.sql.init.mode=always

# MyBatis設定
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.configuration.map-underscore-to-camel-case=true

# H2 Console設定
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### 6.2 設定項目説明

| 設定項目 | 値 | 説明 |
|---------|-----|------|
| spring.datasource.url | jdbc:h2:file:./data/tododb | ファイルモードで./data配下に保存 |
| spring.sql.init.mode | always | 起動時にschema.sql/data.sql実行 |
| mybatis.mapper-locations | classpath:mapper/*.xml | Mapper XMLファイルの場所 |
| mybatis.configuration.map-underscore-to-camel-case | true | DB:スネークケース ↔ Java:キャメルケース変換 |
| spring.h2.console.enabled | true | H2コンソール有効化 |
| spring.h2.console.path | /h2-console | コンソールのパス |

---

## 7. 依存関係（pom.xml）

### 7.1 追加依存関係

```xml
<!-- MyBatis Spring Boot Starter -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>3.0.3</version>
</dependency>

<!-- H2 Database -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

## 8. ファイル構成

### 8.1 プロジェクト構成

```
project-root/
├── data/                              # データディレクトリ（新規）
│   ├── tododb.mv.db                   # H2メインデータファイル
│   └── tododb.trace.db                # トレースログ（デバッグ時）
├── src/main/
│   ├── java/com/example/demo/
│   │   └── TodoMapper.java            # Mapperインターフェース（新規）
│   └── resources/
│       ├── application.properties     # 設定追加
│       ├── schema.sql                 # テーブル定義（新規）
│       ├── data.sql                   # 初期データ（新規）
│       └── mapper/
│           └── TodoMapper.xml         # SQL定義（新規）
└── ...
```

### 8.2 .gitignore追加

```
# H2 Database files
/data/
*.db
```

---

## 9. H2 Console

### 9.1 アクセス情報

| 項目 | 値 |
|------|-----|
| URL | http://localhost:8080/h2-console |
| JDBC URL | jdbc:h2:file:./data/tododb |
| User Name | sa |
| Password | (空欄) |

### 9.2 使用方法

1. アプリケーション起動
2. ブラウザで `http://localhost:8080/h2-console` にアクセス
3. 接続情報を入力して「Connect」
4. SQLを実行してデータ確認

### 9.3 確認用SQL

```sql
-- 全データ確認
SELECT * FROM TODO ORDER BY CREATED_AT;

-- 件数確認
SELECT COUNT(*) FROM TODO;

-- 完了状態別件数
SELECT COMPLETED, COUNT(*) FROM TODO GROUP BY COMPLETED;
```

---

## 10. データ移行

### 10.1 概要

本案件ではデータ移行は発生しない。

| 項目 | 内容 |
|------|------|
| 移行対象 | なし（インメモリからの移行のため既存データなし） |
| 初期データ | data.sqlで自動投入 |

---

## 11. 影響分析

### 11.1 影響を受けるコンポーネント

| コンポーネント | 影響内容 | 対応 |
|---------------|---------|------|
| pom.xml | 依存関係追加 | mybatis-spring-boot-starter、h2追加 |
| application.properties | DB・MyBatis設定追加 | 設定追加 |
| schema.sql | テーブル定義 | 新規作成 |
| data.sql | 初期データ | 新規作成 |
| TodoMapper.java | Mapperインターフェース | 新規作成 |
| TodoMapper.xml | SQL定義 | 新規作成 |
| TodoService.java | Mapper利用に変更 | リファクタリング |

### 11.2 変更なし

| コンポーネント | 理由 |
|---------------|------|
| Todo.java | POJOとして継続利用（アノテーション不要） |
| TodoController.java | Service呼び出しのみで変更なし |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
| 2.0 | 2025-12-22 | Spring Data JPA → MyBatis方式に変更 | - |
