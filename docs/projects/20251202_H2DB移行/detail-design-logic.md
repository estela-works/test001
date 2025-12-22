# ロジック詳細設計書

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

H2 Database移行に伴うModel層・Service層・Mapper層の詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 | 変更種別 |
|---------|---------------|------|----------|
| Model | Todo.java | データ構造定義 | 変更なし（POJO継続） |
| Service | TodoService.java | ビジネスロジック | 変更（Mapper利用） |
| Mapper | TodoMapper.java | データアクセスインターフェース | 新規作成 |
| Mapper | TodoMapper.xml | SQL定義 | 新規作成 |

---

## 2. Model設計

### 2.1 Todo（変更なし）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.Todo` |
| 種別 | POJO |
| 責務 | ToDoデータの構造定義 |

Todo.javaはPOJOとして変更なしで継続利用する。MyBatisはアノテーション不要でマッピング可能。

#### フィールド

| フィールド名 | 型 | 概要 | 初期値 | DBカラム |
|-------------|-----|------|--------|----------|
| id | Long | 一意識別子 | null | ID |
| title | String | タスクタイトル | null | TITLE |
| description | String | タスク説明 | null | DESCRIPTION |
| completed | boolean | 完了状態 | false | COMPLETED |
| createdAt | LocalDateTime | 作成日時 | LocalDateTime.now() | CREATED_AT |

#### コンストラクタ（変更なし）

| シグネチャ | 説明 |
|-----------|------|
| `Todo()` | デフォルトコンストラクタ |
| `Todo(String title, String description)` | パラメータ付きコンストラクタ |

#### マッピング設定

MyBatisの`map-underscore-to-camel-case=true`設定により、DBカラム名（スネークケース）とフィールド名（キャメルケース）が自動マッピングされる。

| DBカラム | Javaフィールド |
|---------|---------------|
| ID | id |
| TITLE | title |
| DESCRIPTION | description |
| COMPLETED | completed |
| CREATED_AT | createdAt |

---

## 3. Mapper設計

### 3.1 TodoMapper.java（新規）

| 項目 | 内容 |
|------|------|
| インターフェース名 | `com.example.demo.TodoMapper` |
| 種別 | MyBatis Mapper Interface |
| 責務 | データアクセスメソッド定義 |
| アノテーション | `@Mapper` |

#### メソッド一覧

| メソッド | 戻り値 | 用途 | SQL種別 |
|---------|--------|------|---------|
| `selectAll()` | `List<Todo>` | 全件取得（作成日時順） | SELECT |
| `selectById(Long id)` | `Todo` | ID指定取得 | SELECT |
| `selectByCompleted(boolean completed)` | `List<Todo>` | 完了状態フィルタ | SELECT |
| `insert(Todo todo)` | `void` | 新規作成 | INSERT |
| `update(Todo todo)` | `void` | 更新 | UPDATE |
| `deleteById(Long id)` | `void` | ID指定削除 | DELETE |
| `deleteAll()` | `void` | 全件削除 | DELETE |
| `count()` | `int` | 全件数取得 | SELECT |
| `countByCompleted(boolean completed)` | `int` | 完了状態別件数 | SELECT |

#### コード

```java
package com.example.demo;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface TodoMapper {

    List<Todo> selectAll();

    Todo selectById(Long id);

    List<Todo> selectByCompleted(boolean completed);

    void insert(Todo todo);

    void update(Todo todo);

    void deleteById(Long id);

    void deleteAll();

    int count();

    int countByCompleted(boolean completed);
}
```

### 3.2 TodoMapper.xml（新規）

| 項目 | 内容 |
|------|------|
| ファイルパス | `src/main/resources/mapper/TodoMapper.xml` |
| 種別 | MyBatis Mapper XML |
| 責務 | SQL定義 |
| namespace | `com.example.demo.TodoMapper` |

詳細なSQL定義は[SQL詳細設計書](./detail-design-sql.md)を参照。

---

## 4. Service設計

### 4.1 TodoService（変更）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.TodoService` |
| 種別 | Service |
| 責務 | ToDoのビジネスロジック |
| アノテーション | `@Service` |

### 4.2 フィールド

| フィールド名 | 型 | 概要 | 変更 |
|-------------|-----|------|------|
| ~~todos~~ | ~~ConcurrentHashMap~~ | ~~データ保持~~ | 削除 |
| ~~idGenerator~~ | ~~AtomicLong~~ | ~~ID採番~~ | 削除 |
| todoMapper | TodoMapper | データアクセス | 新規追加 |

### 4.3 コンストラクタ

**変更前**:
```java
public TodoService() {
    // サンプルデータの追加
    createTodo(new Todo("Spring Bootの学習", ...));
    ...
}
```

**変更後**:
```java
@Autowired
public TodoService(TodoMapper todoMapper) {
    this.todoMapper = todoMapper;
}
```

※ 初期データ投入は data.sql で実行

### 4.4 メソッド詳細

#### getAllTodos

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `List<Todo> getAllTodos()` | 変更なし |
| 実装 | `todos.values().stream()...` | `todoMapper.selectAll()` |

**処理フロー（変更後）**:
1. Mapperの`selectAll()`を呼び出し
2. 結果をそのまま返却

#### getTodosByCompleted

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `List<Todo> getTodosByCompleted(boolean completed)` | 変更なし |
| 実装 | `Stream.filter()` | `todoMapper.selectByCompleted(completed)` |

**処理フロー（変更後）**:
1. Mapperの`selectByCompleted()`を呼び出し
2. 結果をそのまま返却

#### getTodoById

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `Todo getTodoById(Long id)` | 変更なし |
| 実装 | `todos.get(id)` | `todoMapper.selectById(id)` |

**処理フロー（変更後）**:
1. Mapperの`selectById()`を呼び出し
2. 結果を返却（存在しなければnull）

#### createTodo

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `Todo createTodo(Todo todo)` | 変更なし |
| 実装 | `idGenerator.getAndIncrement()` + `todos.put()` | `todoMapper.insert(todo)` |

**処理フロー（変更後）**:
1. Mapperの`insert()`を呼び出し
2. INSERT時に自動採番されたIDがtodoにセットされる（useGeneratedKeys）
3. todoを返却

#### updateTodo

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `Todo updateTodo(Long id, Todo updatedTodo)` | 変更なし |
| 実装 | `todos.get()` + フィールド更新 | `selectById()` + フィールド更新 + `update()` |

**処理フロー（変更後）**:
1. `selectById()`で既存データを取得
2. 存在しなければnullを返却
3. フィールドを更新（title, description, completed）
4. `update()`で永続化
5. 更新されたエンティティを返却

#### toggleComplete

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `Todo toggleComplete(Long id)` | 変更なし |
| 実装 | `todos.get()` + 状態反転 | `selectById()` + 状態反転 + `update()` |

**処理フロー（変更後）**:
1. `selectById()`で既存データを取得
2. 存在しなければnullを返却
3. completed状態を反転
4. `update()`で永続化
5. 更新されたエンティティを返却

#### deleteTodo

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `Todo deleteTodo(Long id)` | 変更なし |
| 実装 | `todos.remove(id)` | `selectById()` + `deleteById()` |

**処理フロー（変更後）**:
1. `selectById()`で既存データを取得
2. 存在しなければnullを返却
3. `deleteById()`で削除
4. 削除されたエンティティを返却

#### deleteAllTodos

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `void deleteAllTodos()` | 変更なし |
| 実装 | `todos.clear()` | `todoMapper.deleteAll()` |

#### getTotalCount

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `int getTotalCount()` | 変更なし |
| 実装 | `todos.size()` | `todoMapper.count()` |

#### getCompletedCount

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `int getCompletedCount()` | 変更なし |
| 実装 | `Stream.filter().count()` | `todoMapper.countByCompleted(true)` |

#### getPendingCount

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| シグネチャ | `int getPendingCount()` | 変更なし |
| 実装 | `getTotalCount() - getCompletedCount()` | 変更なし |

### 4.5 変更後コード

```java
@Service
public class TodoService {

    private final TodoMapper todoMapper;

    @Autowired
    public TodoService(TodoMapper todoMapper) {
        this.todoMapper = todoMapper;
    }

    public List<Todo> getAllTodos() {
        return todoMapper.selectAll();
    }

    public List<Todo> getTodosByCompleted(boolean completed) {
        return todoMapper.selectByCompleted(completed);
    }

    public Todo getTodoById(Long id) {
        return todoMapper.selectById(id);
    }

    public Todo createTodo(Todo todo) {
        todoMapper.insert(todo);
        return todo;
    }

    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo existingTodo = todoMapper.selectById(id);
        if (existingTodo != null) {
            existingTodo.setTitle(updatedTodo.getTitle());
            existingTodo.setDescription(updatedTodo.getDescription());
            existingTodo.setCompleted(updatedTodo.isCompleted());
            todoMapper.update(existingTodo);
            return existingTodo;
        }
        return null;
    }

    public Todo toggleComplete(Long id) {
        Todo todo = todoMapper.selectById(id);
        if (todo != null) {
            todo.setCompleted(!todo.isCompleted());
            todoMapper.update(todo);
            return todo;
        }
        return null;
    }

    public Todo deleteTodo(Long id) {
        Todo todo = todoMapper.selectById(id);
        if (todo != null) {
            todoMapper.deleteById(id);
            return todo;
        }
        return null;
    }

    public void deleteAllTodos() {
        todoMapper.deleteAll();
    }

    public int getTotalCount() {
        return todoMapper.count();
    }

    public int getCompletedCount() {
        return todoMapper.countByCompleted(true);
    }

    public int getPendingCount() {
        return getTotalCount() - getCompletedCount();
    }
}
```

---

## 5. 初期データ投入

### 5.1 実装方式

`data.sql`を使用してアプリケーション起動時に初期データを投入する。

### 5.2 data.sql

| 項目 | 内容 |
|------|------|
| ファイルパス | `src/main/resources/data.sql` |
| 実行タイミング | アプリケーション起動時（spring.sql.init.mode=always） |

#### コード

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

### 5.3 初期データ

| ID | title | description | completed |
|----|-------|-------------|-----------|
| 1 | Spring Bootの学習 | Spring Bootアプリケーションの基本を理解する | false |
| 2 | ToDoリストの実装 | REST APIとフロントエンドを実装する | false |
| 3 | プロジェクトのテスト | 作成したアプリケーションの動作確認 | false |

---

## 6. ビジネスルール

### 6.1 ルール一覧

| ルールID | ルール内容 | 適用箇所 | 変更 |
|---------|-----------|---------|------|
| BR-001 | titleは必須 | TodoController.createTodo | なし |
| BR-002 | 新規作成時completedはfalse | Todo コンストラクタ | なし |
| BR-003 | 新規作成時createdAtは現在日時 | Todo コンストラクタ | なし |
| BR-004 | IDは自動採番 | TodoMapper INSERT（useGeneratedKeys） | 方式変更 |
| BR-005 | 初期データは空DB時のみ投入 | data.sql (WHERE NOT EXISTS) | 新規 |

---

## 7. スレッドセーフティ

### 7.1 変更前

| 対策 | 説明 |
|------|------|
| ConcurrentHashMap | スレッドセーフなMap実装 |
| AtomicLong | スレッドセーフなID採番 |

### 7.2 変更後

| 対策 | 説明 |
|------|------|
| Spring管理のコネクションプール | HikariCPによる安全なコネクション管理 |
| H2のロック機構 | データベースレベルでの整合性保証 |
| @Transactional（必要時） | 複数操作の原子性保証 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
| 2.0 | 2025-12-22 | Spring Data JPA → MyBatis方式に変更 | - |
