# ロジック詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoアプリケーション初期構築 |
| 案件ID | 202512_初期構築 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

ビジネスロジック（Service層、Entity）の詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 |
|---------|---------------|------|
| Entity | Todo | データ構造定義 |
| Service | TodoService | ビジネスロジック |

---

## 2. Todoエンティティ

### 2.1 概要

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.Todo` |
| 種別 | Entity |
| 責務 | ToDoアイテムのデータ構造を定義 |

### 2.2 フィールド

| フィールド名 | 型 | 概要 | 初期値 |
|-------------|-----|------|--------|
| id | Long | 一意識別子 | null |
| title | String | タイトル | null |
| description | String | 説明 | null |
| completed | boolean | 完了フラグ | false |
| createdAt | LocalDateTime | 作成日時 | LocalDateTime.now() |

### 2.3 コンストラクタ

| シグネチャ | 説明 |
|-----------|------|
| `Todo()` | デフォルト。createdAt=now(), completed=false で初期化 |
| `Todo(String title, String description)` | title, descriptionを指定して作成 |

---

## 3. TodoService

### 3.1 概要

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.TodoService` |
| 種別 | Service |
| 責務 | ToDoアイテムのCRUD操作とビジネスロジック |
| アノテーション | `@Service` |

### 3.2 フィールド

| フィールド名 | 型 | 概要 | 初期値 |
|-------------|-----|------|--------|
| todos | Map<Long, Todo> | ToDoデータストア | ConcurrentHashMap |
| idGenerator | AtomicLong | ID採番 | 1 |

### 3.3 メソッド詳細

#### getAllTodos

| 項目 | 内容 |
|------|------|
| シグネチャ | `List<Todo> getAllTodos()` |
| 概要 | 全ToDoを作成日時順で取得 |
| 戻り値 | 全ToDoのリスト（作成日時昇順） |

**処理フロー**:
1. todos.values()を取得
2. createdAtでソート
3. Listとして返却

---

#### getTodosByCompleted

| 項目 | 内容 |
|------|------|
| シグネチャ | `List<Todo> getTodosByCompleted(boolean completed)` |
| 概要 | 完了状態でフィルタリングして取得 |
| 引数 | `completed`: true=完了, false=未完了 |
| 戻り値 | フィルタ後のリスト |

**処理フロー**:
1. todos.values()をストリーム化
2. completed状態でフィルタ
3. createdAtでソート
4. Listとして返却

---

#### getTodoById

| 項目 | 内容 |
|------|------|
| シグネチャ | `Todo getTodoById(Long id)` |
| 概要 | ID指定でToDoを取得 |
| 引数 | `id`: ToDoのID |
| 戻り値 | 該当ToDo、存在しない場合null |

---

#### createTodo

| 項目 | 内容 |
|------|------|
| シグネチャ | `Todo createTodo(Todo todo)` |
| 概要 | 新しいToDoを作成 |
| 引数 | `todo`: 作成するToDo |
| 戻り値 | IDが設定された作成済みToDo |

**処理フロー**:
1. idGeneratorから新しいIDを取得（getAndIncrement）
2. todoにIDを設定
3. todosに登録
4. 作成したtodoを返却

---

#### updateTodo

| 項目 | 内容 |
|------|------|
| シグネチャ | `Todo updateTodo(Long id, Todo updatedTodo)` |
| 概要 | 既存のToDoを更新 |
| 引数 | `id`: 更新対象のID, `updatedTodo`: 更新内容 |
| 戻り値 | 更新後のToDo、存在しない場合null |

**処理フロー**:
1. idでToDoを検索
2. 存在しない場合はnullを返却
3. title, description, completedを更新
4. **createdAtは変更しない**
5. 更新後のToDoを返却

---

#### toggleComplete

| 項目 | 内容 |
|------|------|
| シグネチャ | `Todo toggleComplete(Long id)` |
| 概要 | 完了状態を反転 |
| 引数 | `id`: 対象のID |
| 戻り値 | 更新後のToDo、存在しない場合null |

**処理フロー**:
1. idでToDoを検索
2. 存在しない場合はnullを返却
3. `setCompleted(!isCompleted())` で反転
4. 更新後のToDoを返却

---

#### deleteTodo

| 項目 | 内容 |
|------|------|
| シグネチャ | `Todo deleteTodo(Long id)` |
| 概要 | ToDoを削除 |
| 引数 | `id`: 削除対象のID |
| 戻り値 | 削除されたToDo、存在しない場合null |

---

#### deleteAllTodos

| 項目 | 内容 |
|------|------|
| シグネチャ | `void deleteAllTodos()` |
| 概要 | 全ToDoを削除 |

**処理フロー**:
1. todos.clear()を実行

---

#### getTotalCount / getCompletedCount / getPendingCount

| メソッド | 概要 | 計算方法 |
|---------|------|---------|
| getTotalCount | 総数取得 | todos.size() |
| getCompletedCount | 完了数取得 | completed=trueでフィルタしてカウント |
| getPendingCount | 未完了数取得 | getTotalCount() - getCompletedCount() |

---

## 4. 初期データ

TodoServiceのコンストラクタで以下のサンプルデータが作成される:

| ID | title | description | completed |
|----|-------|-------------|-----------|
| 1 | Spring Bootの学習 | Spring Bootアプリケーションの基本を理解する | false |
| 2 | ToDoリストの実装 | REST APIとフロントエンドを実装する | false |
| 3 | プロジェクトのテスト | 作成したアプリケーションの動作確認 | false |

---

## 5. スレッドセーフティ

| 対策 | 説明 |
|------|------|
| ConcurrentHashMap | 複数スレッドからの同時アクセスに対応 |
| AtomicLong | ID採番の原子性を保証 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成（既存詳細設計書から分離） | - |
