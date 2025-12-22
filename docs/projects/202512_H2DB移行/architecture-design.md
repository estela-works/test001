# アーキテクチャ基本設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | H2 Database移行 |
| 案件ID | 202512_H2DB移行 |
| 作成日 | 2025-12-22 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本設計書の目的

H2 Database移行に伴うシステムアーキテクチャの変更を定義する。現行のインメモリ方式から永続化層を追加したレイヤードアーキテクチャへの移行方針を明確にする。

### 1.2 設計方針

| 方針 | 説明 |
|------|------|
| 最小変更 | 既存のAPI・画面への影響を最小化 |
| レイヤー分離 | データアクセス層をMapper層として独立 |
| SQL制御 | MyBatisによる手書きSQLで完全制御 |
| 拡張性 | 将来のRDBMS移行を容易にする構成 |

---

## 2. 現行アーキテクチャ

### 2.1 システム構成（現行）

```
┌─────────────────────────────────────────────────────────────┐
│                      クライアント                            │
│                   (ブラウザ / REST Client)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Spring Boot Application                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Controller Layer                      │  │
│  │    TodoController.java / HelloController.java          │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Service Layer                        │  │
│  │                  TodoService.java                      │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  ConcurrentHashMap<Long, Todo>  ←データ保持     │  │  │
│  │  │  AtomicLong idGenerator         ←ID採番        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 現行の問題点

| 問題 | 影響 |
|------|------|
| データ揮発性 | アプリ再起動でデータ消失 |
| SQL非対応 | 柔軟なデータ操作不可 |
| 層の混在 | Serviceにデータ保持ロジックが混在 |
| 拡張性 | 他DBへの移行が困難 |

---

## 3. 移行後アーキテクチャ

### 3.1 システム構成（移行後）

```
┌─────────────────────────────────────────────────────────────┐
│                      クライアント                            │
│                   (ブラウザ / REST Client)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Spring Boot Application                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Controller Layer (変更なし)               │  │
│  │    TodoController.java / HelloController.java          │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Service Layer                        │  │
│  │                  TodoService.java                      │  │
│  │            ※Mapper経由でデータアクセス                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                Mapper Layer (新規)                     │  │
│  │                 TodoMapper.java                        │  │
│  │              (MyBatis Mapper Interface)                │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                TodoMapper.xml (SQL定義)                │  │
│  │                  ※手書きSQL                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              │ JDBC                          │
│                              ▼                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   H2 Database                          │  │
│  │              (ファイルモード: ./data/tododb)            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ ファイルI/O
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ファイルシステム                          │
│                   ./data/tododb.mv.db                        │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 H2 Console アクセス

```
┌─────────────────────────────────────────────────────────────┐
│                   開発者ブラウザ                             │
│               http://localhost:8080/h2-console               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP (ローカルのみ)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    H2 Console Servlet                        │
│                   (Spring Boot組み込み)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    H2 Database                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. レイヤー詳細

### 4.1 レイヤー構成

| レイヤー | 責務 | 主要クラス/ファイル |
|---------|------|-------------------|
| Controller | HTTPリクエスト/レスポンス処理 | TodoController |
| Service | ビジネスロジック | TodoService |
| Mapper | データアクセス（SQL実行） | TodoMapper.java + TodoMapper.xml |
| Model | データモデル | Todo |

### 4.2 依存関係

```
Controller → Service → Mapper → Database
    ↓           ↓         ↓
  Model      Model     Model
```

- 上位レイヤーは下位レイヤーにのみ依存
- ModelはすべてのレイヤーからアクセスされるPOJO

### 4.3 レイヤー間の契約

| 呼び出し元 | 呼び出し先 | インターフェース |
|-----------|-----------|-----------------|
| Controller | Service | メソッド呼び出し（DI） |
| Service | Mapper | MyBatis Mapperインターフェース |
| Mapper | Database | 手書きSQL（XML定義） |

---

## 5. 技術スタック

### 5.1 フレームワーク・ライブラリ

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| フレームワーク | Spring Boot | 3.2.0 | アプリケーション基盤 |
| Web | Spring Web | (Boot管理) | REST API |
| O/Rマッパー | MyBatis | (Boot管理) | SQL実行・結果マッピング |
| Database | H2 Database | (Boot管理) | 組み込みSQLデータベース |
| テスト | Spring Boot Test | (Boot管理) | テストサポート |

### 5.2 ランタイム環境

| 項目 | 値 |
|------|-----|
| Java | 21 |
| ビルドツール | Maven |
| 実行形態 | 組み込みTomcat |

---

## 6. データフロー

### 6.1 ToDo作成フロー

```
1. クライアント → POST /api/todos (JSON)
2. TodoController.createTodo()
   └→ バリデーション（title必須）
3. TodoService.createTodo()
   └→ 現行: Map.put() → 移行後: Mapper.insert()
4. TodoMapper.insert() [新規]
   └→ TodoMapper.xml の INSERT文実行
5. H2 Database
   └→ TODOテーブルにレコード追加
6. レスポンス ← 作成されたToDo (JSON)
```

### 6.2 ToDo取得フロー（フィルタあり）

```
1. クライアント → GET /api/todos?completed=false
2. TodoController.getAllTodos()
3. TodoService.getTodosByCompleted()
   └→ 現行: Stream filter → 移行後: Mapper.selectByCompleted()
4. TodoMapper.selectByCompleted() [新規]
   └→ TodoMapper.xml の SELECT文実行（WHERE句付き）
5. H2 Database
   └→ 条件に合致するレコードを取得
6. レスポンス ← ToDoリスト (JSON)
```

---

## 7. 永続化設計

### 7.1 H2 Database設定

| 設定項目 | 値 | 説明 |
|---------|-----|------|
| 接続URL | jdbc:h2:file:./data/tododb | ファイルモード |
| モード | 組み込み | 別プロセス不要 |
| 永続化 | 自動 | トランザクションコミット時 |

### 7.2 ファイル構成

```
project-root/
├── data/
│   ├── tododb.mv.db      # メインデータファイル
│   └── tododb.trace.db   # トレースログ（オプション）
├── src/main/resources/
│   ├── schema.sql        # テーブル定義DDL
│   ├── data.sql          # 初期データDML
│   └── mapper/
│       └── TodoMapper.xml  # SQL定義
└── src/main/java/
    └── ...
```

### 7.3 スキーマ管理

| 項目 | 設定 |
|------|------|
| 管理方式 | schema.sql による明示的定義 |
| 初回起動 | schema.sql でテーブル作成 |
| 初期データ | data.sql で投入 |
| 実行タイミング | spring.sql.init.mode=always |

---

## 8. 設計原則

### 8.1 適用パターン

| パターン | 適用箇所 | 説明 |
|---------|---------|------|
| Data Mapper Pattern | TodoMapper | SQL実行とオブジェクトマッピングの分離 |
| Dependency Injection | 全レイヤー | Spring DIコンテナ利用 |
| POJO | Todo | フレームワーク非依存のデータモデル |

### 8.2 SOLID原則の適用

| 原則 | 適用内容 |
|------|---------|
| 単一責任 | Service=ロジック、Mapper=データアクセス分離 |
| 開放閉鎖 | SQL変更はXMLのみ、Javaコード変更不要 |
| 依存性逆転 | MapperインターフェースへのDI |

### 8.3 MyBatis採用の利点

| 利点 | 説明 |
|------|------|
| SQL完全制御 | 手書きSQLでクエリを最適化可能 |
| 明示性 | 発行されるSQLが明確 |
| 学習コスト | SQLの知識をそのまま活用 |
| デバッグ | SQLを直接確認・修正可能 |
| パフォーマンス | 不要なクエリが発行されない |

---

## 9. 非機能設計

### 9.1 性能

| 項目 | 設計 |
|------|------|
| コネクション | HikariCP（Spring Boot標準）によるプーリング |
| キャッシュ | MyBatisの1次キャッシュ（SqlSession単位） |
| インデックス | PK（ID）に自動作成 |

### 9.2 セキュリティ

| 項目 | 設計 |
|------|------|
| H2 Console | ローカルアクセスのみ許可 |
| SQLインジェクション | MyBatisの#{param}によるパラメータバインディング |
| ファイル保護 | アプリケーションユーザーのみアクセス |

### 9.3 保守性

| 項目 | 設計 |
|------|------|
| ログ | Spring Boot標準ログ出力 |
| SQL確認 | mybatis.configuration.log-impl設定でSQL出力 |
| 設定外部化 | application.propertiesで環境依存設定管理 |
| テスト | 統合テストでDB含めた検証 |

---

## 10. 移行による影響範囲

### 10.1 変更あり

| 対象 | 変更内容 |
|------|---------|
| pom.xml | mybatis-spring-boot-starter, h2 追加 |
| TodoService.java | Mapper利用に変更 |
| application.properties | H2・MyBatis設定追加 |
| TodoMapper.java | 新規作成（Mapperインターフェース） |
| TodoMapper.xml | 新規作成（SQL定義） |
| schema.sql | 新規作成（DDL） |
| data.sql | 新規作成（初期データ） |
| テストコード | 統合テスト対応 |

### 10.2 変更なし

| 対象 | 理由 |
|------|------|
| Todo.java | POJOとして継続利用 |
| TodoController.java | Service呼び出しのみで変更なし |
| HelloController.java | ToDo機能と無関係 |
| フロントエンド | APIインターフェース維持 |

### 10.3 ディレクトリ追加

| パス | 用途 |
|------|------|
| ./data/ | H2データファイル格納（.gitignore推奨） |
| src/main/resources/mapper/ | Mapper XMLファイル格納 |

---

## 11. 将来の拡張性

### 11.1 他RDBMS移行

```
現在の構成:
  Mapper → H2 Database

将来の構成（例: PostgreSQL移行時）:
  Mapper → PostgreSQL

変更点:
  - application.properties: 接続URL・ドライバ変更
  - pom.xml: PostgreSQLドライバ追加
  - TodoMapper.xml: 必要に応じてSQL方言対応
  - Serviceコード: 変更なし
```

### 11.2 Profile切り替え

```properties
# application-dev.properties (開発)
spring.datasource.url=jdbc:h2:file:./data/tododb
spring.datasource.driver-class-name=org.h2.Driver

# application-prod.properties (本番)
spring.datasource.url=jdbc:postgresql://localhost:5432/todo
spring.datasource.driver-class-name=org.postgresql.Driver
```

### 11.3 SQL差分管理

本番移行時は以下を検討。

| ツール | 用途 |
|--------|------|
| Flyway | SQLマイグレーション管理 |
| Liquibase | 変更セット管理 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
| 2.0 | 2025-12-22 | Spring Data JPA → MyBatis方式に変更 | - |
