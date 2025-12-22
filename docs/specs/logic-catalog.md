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

---

### 2.2 統計計算ロジック

| ID | ロジック名 | 概要 | 適用箇所 | 追加案件 |
|----|-----------|------|----------|----------|
| CL-001 | 総数カウント | COUNT(*)で総数を取得 | TodoMapper.count | 初期構築 |
| CL-002 | 完了数カウント | WHERE completed=trueでCOUNT | TodoMapper.countByCompleted(true) | 初期構築 |
| CL-003 | 未完了数カウント | 総数 - 完了数 で計算 | TodoService.getPendingCount | 初期構築 |

---

### 2.3 ソート・フィルタロジック

| ID | ロジック名 | 概要 | 適用箇所 | 追加案件 |
|----|-----------|------|----------|----------|
| SL-001 | 作成日時順ソート | ORDER BY created_at ASCで昇順ソート | TodoMapper.selectAll | 初期構築 |
| SL-002 | 完了状態フィルタ | WHERE completedでフィルタリング | TodoMapper.selectByCompleted | 初期構築 |

---

## 3. Mapper層メソッド一覧

### 3.1 TodoMapper

| メソッド名 | 戻り値 | 概要 | SQL種別 |
|-----------|--------|------|---------|
| selectAll() | List\<Todo\> | 全件取得（作成日時順） | SELECT |
| selectById(Long id) | Todo | ID指定で1件取得 | SELECT |
| selectByCompleted(boolean completed) | List\<Todo\> | 完了状態で抽出 | SELECT |
| insert(Todo todo) | void | 新規登録（ID自動採番） | INSERT |
| update(Todo todo) | void | 更新（createdAt以外） | UPDATE |
| deleteById(Long id) | void | ID指定で削除 | DELETE |
| deleteAll() | void | 全件削除 | DELETE |
| count() | int | 総件数取得 | SELECT |
| countByCompleted(boolean completed) | int | 完了/未完了件数取得 | SELECT |

---

## 4. バリデーション一覧

| ID | 項目 | ルール | エラー条件 | エラーレスポンス | 適用箇所 | 追加案件 |
|----|------|--------|-----------|-----------------|----------|----------|
| VL-001 | title | 必須チェック | null または 空文字 | 400 Bad Request | TodoController.createTodo | 初期構築 |
| VL-002 | title | 必須チェック | null または 空文字 | 400 Bad Request | TodoController.updateTodo | 初期構築 |

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
| createTodo(Todo todo) | Todo | 新規作成 | insert() |
| updateTodo(Long id, Todo todo) | Todo | 更新 | selectById(), update() |
| toggleComplete(Long id) | Todo | 完了切替 | selectById(), update() |
| deleteTodo(Long id) | Todo | 削除 | selectById(), deleteById() |
| deleteAllTodos() | void | 全件削除 | deleteAll() |
| getTotalCount() | int | 総数取得 | count() |
| getCompletedCount() | int | 完了数取得 | countByCompleted(true) |
| getPendingCount() | int | 未完了数取得 | (計算ロジック) |

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-22 | 初版作成 | 初期構築 |
| 2025-12-22 | Mapper層追加、ロジックをDB処理に変更 | 202512_H2DB移行 |
