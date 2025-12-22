# ロジック一覧

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. 概要

| 項目 | 内容 |
|------|------|
| 対象 | ビジネスロジック、バリデーション、計算ロジック |
| 最終更新日 | 2025-12-22 |

---

## 2. ビジネスロジック一覧

### 2.1 ToDo管理ロジック

| ID | ロジック名 | 概要 | 適用箇所 | 追加案件 |
|----|-----------|------|----------|----------|
| BL-001 | ID自動採番 | ToDoの作成時にAUTO_INCREMENTで連番IDを付与 | TodoMapper.insert | 初期構築 |
| BL-002 | 作成日時自動設定 | ToDo作成時にDBのCURRENT_TIMESTAMPで自動設定 | TodoMapper.insert (DDL) | 初期構築 |
| BL-003 | 完了状態トグル | completedフラグを反転させる | TodoService.toggleComplete | 初期構築 |
| BL-004 | 更新時のcreatedAt保持 | 更新時に作成日時は変更しない | TodoMapper.update | 初期構築 |
| BL-005 | 担当者名の取得 | ToDoのSELECT時にLEFT JOINでユーザー名を取得 | TodoMapper.selectAll等 | 202512_担当者機能追加 |
| BL-006 | 担当者名を含む再取得 | ToDo作成/更新後にDBから再取得して担当者名を含める | TodoService.createTodo/updateTodo | 202512_担当者機能追加 |

### 2.2 ユーザー管理ロジック

| ID | ロジック名 | 概要 | 適用箇所 | 追加案件 |
|----|-----------|------|----------|----------|
| BL-U01 | ユーザーID自動採番 | ユーザー作成時にAUTO_INCREMENTで連番IDを付与 | UserMapper.insert | 202512_担当者機能追加 |
| BL-U02 | ユーザー名一意チェック | ユーザー名の重複を検証 | UserService.existsByName | 202512_担当者機能追加 |
| BL-U03 | ユーザー削除時の担当解除 | ユーザー削除時に関連ToDoの担当者をNULLに設定 | UserController.deleteUser → TodoMapper.clearAssigneeByUserId | 202512_担当者機能追加 |

---

### 2.3 統計計算ロジック

| ID | ロジック名 | 概要 | 適用箇所 | 追加案件 |
|----|-----------|------|----------|----------|
| CL-001 | 総数カウント | COUNT(*)で総数を取得 | TodoMapper.count | 初期構築 |
| CL-002 | 完了数カウント | WHERE completed=trueでCOUNT | TodoMapper.countByCompleted(true) | 初期構築 |
| CL-003 | 未完了数カウント | 総数 - 完了数 で計算 | TodoService.getPendingCount | 初期構築 |

---

### 2.4 ソート・フィルタロジック

| ID | ロジック名 | 概要 | 適用箇所 | 追加案件 |
|----|-----------|------|----------|----------|
| SL-001 | 作成日時順ソート | ORDER BY created_at ASCで昇順ソート | TodoMapper.selectAll | 初期構築 |
| SL-002 | 完了状態フィルタ | WHERE completedでフィルタリング | TodoMapper.selectByCompleted | 初期構築 |

---

## 3. Mapper層メソッド一覧

### 3.1 TodoMapper

| メソッド名 | 戻り値 | 概要 | SQL種別 |
|-----------|--------|------|---------|
| selectAll() | List\<Todo\> | 全件取得（作成日時順）、担当者名をJOINで取得 | SELECT |
| selectById(Long id) | Todo | ID指定で1件取得、担当者名をJOINで取得 | SELECT |
| selectByCompleted(boolean completed) | List\<Todo\> | 完了状態で抽出、担当者名をJOINで取得 | SELECT |
| selectByProjectId(Long projectId) | List\<Todo\> | プロジェクトIDで抽出 | SELECT |
| selectByProjectIdIsNull() | List\<Todo\> | 未分類のToDoを取得 | SELECT |
| insert(Todo todo) | void | 新規登録（ID自動採番、assigneeId含む） | INSERT |
| update(Todo todo) | void | 更新（assigneeId含む、createdAt以外） | UPDATE |
| deleteById(Long id) | void | ID指定で削除 | DELETE |
| deleteAll() | void | 全件削除 | DELETE |
| count() | int | 総件数取得 | SELECT |
| countByCompleted(boolean completed) | int | 完了/未完了件数取得 | SELECT |
| clearAssigneeByUserId(Long userId) | void | 指定ユーザーIDの担当をNULLに設定 | UPDATE |

### 3.2 UserMapper

| メソッド名 | 戻り値 | 概要 | SQL種別 |
|-----------|--------|------|---------|
| selectAll() | List\<User\> | 全件取得（作成日時順） | SELECT |
| selectById(Long id) | User | ID指定で1件取得 | SELECT |
| selectByName(String name) | User | 名前指定で1件取得 | SELECT |
| insert(User user) | void | 新規登録（ID自動採番） | INSERT |
| deleteById(Long id) | void | ID指定で削除 | DELETE |
| count() | int | 総件数取得 | SELECT |

---

## 4. バリデーション一覧

| ID | 項目 | ルール | エラー条件 | エラーレスポンス | 適用箇所 | 追加案件 |
|----|------|--------|-----------|-----------------|----------|----------|
| VL-001 | title | 必須チェック | null または 空文字 | 400 Bad Request | TodoController.createTodo | 初期構築 |
| VL-002 | title | 必須チェック | null または 空文字 | 400 Bad Request | TodoController.updateTodo | 初期構築 |
| VL-003 | assigneeId | 存在チェック | 指定IDのユーザーが存在しない | 400 Bad Request | TodoController.createTodo/updateTodo | 202512_担当者機能追加 |
| VL-U01 | name | 必須チェック | null または 空文字 または 空白のみ | 400 Bad Request | UserController.createUser | 202512_担当者機能追加 |
| VL-U02 | name | 長さチェック | 100文字超過 | 400 Bad Request | UserController.createUser | 202512_担当者機能追加 |
| VL-U03 | name | 一意チェック | 同名ユーザーが存在 | 409 Conflict | UserController.createUser | 202512_担当者機能追加 |

---

## 5. ロジック詳細

### 5.1 BL-001: ID自動採番

**概要**: ToDoの作成時に一意のIDを自動で付与する

**実装詳細**:
```
1. INSERT実行時にDBのAUTO_INCREMENTでID採番
2. useGeneratedKeysでJavaオブジェクトにIDを設定
3. IDは1から開始し、連番で採番
```

**MyBatis設定**:
```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO TODO (TITLE, DESCRIPTION, COMPLETED)
    VALUES (#{title}, #{description}, #{completed})
</insert>
```

---

### 5.2 BL-003: 完了状態トグル

**概要**: ToDoの完了状態を反転させる

**実装詳細**:
```
1. selectById()で対象ToDoを取得
2. todo.setCompleted(!todo.isCompleted()) で反転
3. update()でDB更新
4. 更新後のToDoを返却
```

**状態遷移**:
- false → true（未完了 → 完了）
- true → false（完了 → 未完了）

---

### 5.3 CL-003: 未完了数カウント

**概要**: 未完了のToDo数を計算

**計算式**:
```
未完了数 = getTotalCount() - getCompletedCount()
```

**理由**: 直接SQLを発行するより既存メソッドの再利用で効率的

---

### 5.4 SL-001: 作成日時順ソート

**概要**: ToDoリストを作成日時の昇順でソートする

**SQL**:
```sql
SELECT * FROM TODO ORDER BY CREATED_AT ASC
```

**理由**: 古いタスクを上に、新しいタスクを下に表示する自然な順序

---

## 6. Service層メソッド一覧

### 6.1 TodoService

| メソッド名 | 戻り値 | 概要 | 呼び出すMapper |
|-----------|--------|------|---------------|
| getAllTodos() | List\<Todo\> | 全件取得 | selectAll() |
| getTodoById(Long id) | Todo | ID指定取得 | selectById() |
| getTodosByCompleted(boolean completed) | List\<Todo\> | 完了状態フィルタ | selectByCompleted() |
| getTodosByProjectId(Long projectId) | List\<Todo\> | プロジェクトIDフィルタ | selectByProjectId() / selectByProjectIdIsNull() |
| createTodo(Todo todo) | Todo | 新規作成（担当者名含む再取得） | insert(), selectById() |
| updateTodo(Long id, Todo todo) | Todo | 更新（担当者名含む再取得） | selectById(), update(), selectById() |
| toggleComplete(Long id) | Todo | 完了切替 | selectById(), update() |
| deleteTodo(Long id) | Todo | 削除 | selectById(), deleteById() |
| deleteAllTodos() | void | 全件削除 | deleteAll() |
| getTotalCount() | int | 総数取得 | count() |
| getCompletedCount() | int | 完了数取得 | countByCompleted(true) |
| getPendingCount() | int | 未完了数取得 | (計算ロジック) |

### 6.2 UserService

| メソッド名 | 戻り値 | 概要 | 呼び出すMapper |
|-----------|--------|------|---------------|
| getAllUsers() | List\<User\> | 全件取得 | selectAll() |
| getUserById(Long id) | User | ID指定取得 | selectById() |
| createUser(User user) | User | 新規作成 | insert() |
| deleteUser(Long id) | User | 削除 | selectById(), deleteById() |
| existsByName(String name) | boolean | 名前重複チェック | selectByName() |
| getCount() | int | 総数取得 | count() |

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-22 | 初版作成 | 初期構築 |
| 2025-12-22 | Mapper層追加、ロジックをDB処理に変更 | 202512_H2DB移行 |
| 2025-12-22 | UserMapper/UserService追加、担当者関連ロジック追加 | 202512_担当者機能追加 |
