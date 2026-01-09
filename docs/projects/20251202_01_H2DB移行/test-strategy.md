# テスト方針書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | H2 Database移行 |
| 案件ID | 202512_H2DB移行 |
| 作成日 | 2025-12-22 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本書の目的

H2 Database移行プロジェクトにおけるテスト方針を定義し、品質保証の観点から必要なテスト項目・手法・基準を明確にする。

### 1.2 テスト対象

| 対象 | 説明 |
|------|------|
| TodoService.java | Mapper経由でのデータアクセスに変更 |
| TodoMapper.java | 新規作成（MyBatis Mapperインターフェース） |
| TodoMapper.xml | 新規作成（SQL定義ファイル） |
| schema.sql | 新規作成（テーブル定義DDL） |
| data.sql | 新規作成（初期データDML） |
| application.properties | H2・MyBatis設定追加 |

### 1.3 テスト対象外

| 対象 | 理由 |
|------|------|
| TodoController.java | APIインターフェース変更なし（既存テストで担保） |
| HelloController.java | 変更なし |
| Todo.java | POJOとして変更なし |
| フロントエンド | バックエンドAPI互換性維持のため |

---

## 2. テスト方針

### 2.1 基本方針

| 方針 | 説明 |
|------|------|
| 移行前後の機能等価性 | 既存APIの動作が移行後も同一であることを確認 |
| データ永続化の確認 | アプリケーション再起動後もデータが保持されることを確認 |
| 回帰テスト重視 | 既存機能への影響がないことを確認 |
| 段階的テスト | 単体テスト → 統合テスト → E2Eテストの順で実施 |

### 2.2 テストレベル

| レベル | 対象 | 責務 | 実行タイミング |
|--------|------|------|---------------|
| 単体テスト | Mapper層 | SQL正常動作確認 | 開発中 |
| 統合テスト | Service + Mapper + DB | ビジネスロジック確認 | 開発中 |
| APIテスト | Controller + 全層 | REST API動作確認 | 統合後 |
| E2Eテスト | フロントエンド + バックエンド | ユーザー操作確認 | 最終確認 |

---

## 3. テスト種別と詳細

### 3.1 単体テスト（Mapper層）

#### 3.1.1 目的

MyBatis Mapper（TodoMapper）の各SQLが正しく動作することを確認する。

#### 3.1.2 テスト観点

| 観点 | 説明 |
|------|------|
| CRUD操作 | 各SQLの正常系動作 |
| パラメータバインディング | #{param}が正しくバインドされること |
| 結果マッピング | DBカラム → Javaフィールドの変換 |
| NULL処理 | NULL値の適切な処理 |

#### 3.1.3 テストケース

| ID | テスト対象 | テストケース | 期待結果 |
|----|-----------|------------|---------|
| M-001 | selectAll | 全件取得 | 作成日時順でリスト取得 |
| M-002 | selectById | 存在するID指定 | 該当Todoオブジェクト |
| M-003 | selectById | 存在しないID指定 | null |
| M-004 | selectByCompleted | completed=true指定 | 完了済みのみ取得 |
| M-005 | selectByCompleted | completed=false指定 | 未完了のみ取得 |
| M-006 | insert | 正常なTodo挿入 | IDが自動採番され返却 |
| M-007 | insert | description=null | 正常に挿入 |
| M-008 | update | 既存Todoの更新 | 更新件数=1 |
| M-009 | update | 存在しないID | 更新件数=0 |
| M-010 | deleteById | 既存Todoの削除 | 削除件数=1 |
| M-011 | deleteById | 存在しないID | 削除件数=0 |
| M-012 | deleteAll | 全件削除 | 全レコード削除 |
| M-013 | count | 件数取得 | 正確な件数 |
| M-014 | countByCompleted | 完了件数取得 | 完了済みの件数 |
| M-015 | countByCompleted | 未完了件数取得 | 未完了の件数 |

#### 3.1.4 テスト環境

| 項目 | 設定 |
|------|------|
| DB | H2 インメモリモード |
| フレームワーク | @MybatisTest |
| トランザクション | テスト後ロールバック |

---

### 3.2 統合テスト（Service層）

#### 3.2.1 目的

TodoServiceがMapperを経由してDBアクセスし、ビジネスロジックが正しく動作することを確認する。

#### 3.2.2 テスト観点

| 観点 | 説明 |
|------|------|
| ビジネスロジック | Service層の処理正常動作 |
| トランザクション | データ整合性の確保 |
| 例外処理 | エラー時の適切な処理 |
| データ変換 | 入出力データの正確性 |

#### 3.2.3 テストケース（既存テストの移行）

現行のTodoServiceTest.javaを統合テストに変換する。

| 現行テストID | テストケース | 移行対応 |
|-------------|------------|---------|
| GT-001〜003 | getAllTodos | @SpringBootTest化 |
| GC-001〜004 | getTodosByCompleted | @SpringBootTest化 |
| GI-001〜003 | getTodoById | GI-003はOptional対応に修正 |
| CT-001〜003 | createTodo | ID自動採番のため期待値修正 |
| UT-001〜004 | updateTodo | @SpringBootTest化 |
| TC-001〜004 | toggleComplete | @SpringBootTest化 |
| DT-001〜003 | deleteTodo | @SpringBootTest化 |
| DA-001〜002 | deleteAllTodos | @SpringBootTest化 |
| CN-001〜004 | getTotalCount | @SpringBootTest化 |
| CC-001〜004 | getCompletedCount | @SpringBootTest化 |
| PC-001〜004 | getPendingCount | @SpringBootTest化 |

#### 3.2.4 テスト修正ポイント

| 項目 | 現行 | 移行後 |
|------|------|--------|
| テストアノテーション | なし | @SpringBootTest |
| DI | new TodoService() | @Autowired |
| DB | ConcurrentHashMap | H2 インメモリ |
| トランザクション | なし | @Transactional |
| ID期待値 | id=4L固定 | isNotNull()で検証 |
| NullPointerテスト | 例外発生 | 動作変更のため削除または修正 |

#### 3.2.5 テスト環境

| 項目 | 設定 |
|------|------|
| DB | H2 インメモリモード |
| プロファイル | @ActiveProfiles("test") |
| フレームワーク | @SpringBootTest |
| トランザクション | @Transactional（テスト後ロールバック） |

#### 3.2.6 テスト用設定ファイル

`src/test/resources/application-test.properties`:

```properties
# テスト用H2設定（インメモリモード）
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# SQL初期化
spring.sql.init.mode=always

# MyBatis設定
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.configuration.map-underscore-to-camel-case=true

# H2 Console無効化
spring.h2.console.enabled=false
```

---

### 3.3 APIテスト（Controller層）

#### 3.3.1 目的

REST APIエンドポイントが移行前後で同一の動作をすることを確認する。

#### 3.3.2 テスト観点

| 観点 | 説明 |
|------|------|
| レスポンス形式 | JSONフォーマットの互換性 |
| HTTPステータス | 正常系・異常系のステータスコード |
| パスパラメータ | ID指定の動作 |
| クエリパラメータ | フィルタ機能の動作 |

#### 3.3.3 テストケース

| ID | メソッド | パス | テストケース | 期待ステータス |
|----|---------|------|-------------|---------------|
| A-001 | GET | /api/todos | 全件取得 | 200 OK |
| A-002 | GET | /api/todos?completed=true | 完了フィルタ | 200 OK |
| A-003 | GET | /api/todos?completed=false | 未完了フィルタ | 200 OK |
| A-004 | GET | /api/todos/{id} | 存在するID | 200 OK |
| A-005 | GET | /api/todos/{id} | 存在しないID | 404 Not Found |
| A-006 | POST | /api/todos | 正常作成 | 200 OK |
| A-007 | POST | /api/todos | title空 | 400 Bad Request |
| A-008 | PUT | /api/todos/{id} | 正常更新 | 200 OK |
| A-009 | PUT | /api/todos/{id} | 存在しないID | 404 Not Found |
| A-010 | PATCH | /api/todos/{id}/toggle | 完了切替 | 200 OK |
| A-011 | PATCH | /api/todos/{id}/toggle | 存在しないID | 404 Not Found |
| A-012 | DELETE | /api/todos/{id} | 正常削除 | 200 OK |
| A-013 | DELETE | /api/todos/{id} | 存在しないID | 404 Not Found |
| A-014 | DELETE | /api/todos | 全件削除 | 200 OK |
| A-015 | GET | /api/todos/stats | 統計取得 | 200 OK |

#### 3.3.4 テスト環境

| 項目 | 設定 |
|------|------|
| フレームワーク | @SpringBootTest + @AutoConfigureMockMvc |
| リクエスト実行 | MockMvc |
| レスポンス検証 | JSONPath |

---

### 3.4 永続化テスト

#### 3.4.1 目的

アプリケーション再起動後もデータが保持されることを確認する。

#### 3.4.2 テストケース

| ID | テストケース | 手順 | 期待結果 |
|----|------------|------|---------|
| P-001 | データ永続化確認 | 1. ToDo作成 2. アプリ停止 3. アプリ再起動 4. ToDo取得 | 作成したToDoが取得できる |
| P-002 | 更新データ永続化 | 1. ToDo更新 2. アプリ再起動 3. ToDo取得 | 更新内容が反映されている |
| P-003 | 削除データ永続化 | 1. ToDo削除 2. アプリ再起動 3. ToDo取得 | 削除されたToDoが存在しない |

#### 3.4.3 テスト方法

手動テスト（自動化困難のため）

---

### 3.5 H2 Consoleテスト

#### 3.5.1 目的

H2 Consoleからデータベースにアクセスし、SQLを実行できることを確認する。

#### 3.5.2 テストケース

| ID | テストケース | 手順 | 期待結果 |
|----|------------|------|---------|
| H-001 | Console接続 | http://localhost:8080/h2-console にアクセス | ログイン画面表示 |
| H-002 | DBログイン | JDBC URL, User, Passwordを入力 | 接続成功 |
| H-003 | テーブル確認 | TODOテーブルを選択 | カラム情報表示 |
| H-004 | SELECT実行 | SELECT * FROM TODO | データ一覧表示 |
| H-005 | INSERT実行 | INSERT文実行 | レコード追加 |

#### 3.5.3 接続情報

| 項目 | 値 |
|------|-----|
| JDBC URL | jdbc:h2:file:./data/tododb |
| User | sa |
| Password | (空) |

#### 3.5.4 テスト方法

手動テスト

---

### 3.6 回帰テスト

#### 3.6.1 目的

移行による既存機能への影響がないことを確認する。

#### 3.6.2 テスト観点

| 観点 | 確認内容 |
|------|---------|
| API互換性 | リクエスト/レスポンス形式が変わらないこと |
| 画面動作 | フロントエンドの動作に影響がないこと |
| 性能 | レスポンス時間が許容範囲内であること |

#### 3.6.3 テスト項目

| ID | 機能 | テスト内容 | 期待結果 |
|----|------|----------|---------|
| R-001 | ToDo作成 | 画面からToDo作成 | 正常に作成される |
| R-002 | ToDo一覧 | 作成したToDoが一覧に表示 | 一覧に表示される |
| R-003 | ToDo更新 | タイトル・説明を編集 | 正常に更新される |
| R-004 | 完了切替 | チェックボックスをクリック | 状態が切り替わる |
| R-005 | ToDo削除 | 削除ボタンをクリック | 正常に削除される |
| R-006 | フィルタ | 完了/未完了フィルタ切替 | フィルタが適用される |
| R-007 | 統計表示 | ヘッダーの件数表示 | 正しい件数が表示される |

#### 3.6.4 テスト方法

手動テスト

---

## 4. テスト環境

### 4.1 環境一覧

| 環境 | 用途 | DB設定 |
|------|------|--------|
| 開発環境 | 開発・デバッグ | H2ファイルモード（./data/tododb） |
| テスト環境 | 自動テスト | H2インメモリモード |
| 手動テスト環境 | 手動確認 | H2ファイルモード（./data/tododb） |

### 4.2 テスト実行コマンド

```bash
# 全テスト実行
./mvnw test

# 特定テストクラス実行
./mvnw test -Dtest=TodoServiceTest

# テストレポート生成
./mvnw test jacoco:report
```

---

## 5. テストデータ

### 5.1 初期データ（data.sql）

```sql
INSERT INTO TODO (TITLE, DESCRIPTION, COMPLETED, CREATED_AT) VALUES
('Spring Bootの学習', 'Spring Bootアプリケーションの基本を理解する', FALSE, CURRENT_TIMESTAMP),
('ToDoリストの実装', 'REST APIとフロントエンドを実装する', FALSE, CURRENT_TIMESTAMP),
('プロジェクトのテスト', '作成したアプリケーションの動作確認', FALSE, CURRENT_TIMESTAMP);
```

### 5.2 テスト用データ（テストクラス内で準備）

各テストクラスの@BeforeEachで以下を実施:
1. 全データ削除（deleteAll）
2. テスト用データ投入（3件のサンプルToDo）

---

## 6. 合格基準

### 6.1 テスト完了基準

| 基準 | 条件 |
|------|------|
| 単体テスト | 全テストケースPASS |
| 統合テスト | 全テストケースPASS |
| APIテスト | 全テストケースPASS |
| 手動テスト | 全確認項目OK |

### 6.2 品質基準

| 項目 | 基準 |
|------|------|
| テストカバレッジ | Service層: 80%以上 |
| 不具合密度 | 重大バグ: 0件 |
| 性能 | API応答時間: 1秒以内 |

---

## 7. リスクと対策

### 7.1 リスク一覧

| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|---------|------|
| ID採番方式の違いによるテスト失敗 | 中 | 高 | 固定ID検証を動的検証に変更 |
| トランザクション動作の違い | 中 | 中 | @Transactionalで明示的制御 |
| SQLエラーの検出漏れ | 高 | 低 | 網羅的なMapper単体テスト |
| 初期データ不整合 | 中 | 中 | @BeforeEachで毎回初期化 |

### 7.2 テスト修正が必要な箇所

| テストID | 現行の問題 | 修正内容 |
|---------|-----------|---------|
| GI-003 | NullPointerException期待 | 動作確認後、適切な期待結果に修正 |
| CT-001 | id=4L固定 | isNotNull()に変更 |
| CT-002 | id=4L, 5L, 6L固定 | 連番確認を件数確認に変更 |

---

## 8. スケジュール

| フェーズ | 作業内容 |
|---------|---------|
| Phase 1 | Mapper単体テスト作成・実行 |
| Phase 2 | 既存テストの統合テスト変換・実行 |
| Phase 3 | APIテスト作成・実行 |
| Phase 4 | 永続化・回帰テスト（手動） |
| Phase 5 | 不具合修正・再テスト |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
