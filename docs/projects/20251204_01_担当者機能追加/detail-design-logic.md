# ロジック詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 担当者機能追加 |
| 案件ID | 202512_担当者機能追加 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

ビジネスロジック（Entity、Service、Mapper）の詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 | 種別 |
|---------|---------------|------|------|
| Entity | User | ユーザーデータ構造定義 | 新規 |
| Entity | Todo | ToDoデータ構造定義 | 変更 |
| Service | UserService | ユーザービジネスロジック | 新規 |
| Service | TodoService | ToDoビジネスロジック | 変更 |
| Mapper | UserMapper | ユーザーデータアクセス | 新規 |
| Mapper | TodoMapper | ToDoデータアクセス | 変更 |

---

## 2. エンティティ設計

### 2.1 User（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.User` |
| 種別 | Entity |
| 責務 | ユーザーデータの保持 |

#### フィールド

| フィールド名 | 型 | 概要 | 初期値 |
|-------------|-----|------|--------|
| id | Long | 一意識別子 | null |
| name | String | ユーザー名 | null |
| createdAt | LocalDateTime | 作成日時 | LocalDateTime.now() |

#### コンストラクタ

| シグネチャ | 説明 |
|-----------|------|
| `User()` | デフォルトコンストラクタ、createdAtを現在時刻で初期化 |
| `User(String name)` | ユーザー名を指定して作成 |

#### メソッド

| メソッド | 説明 |
|---------|------|
| getter/setter | 各フィールドのアクセサ |
| toString() | デバッグ用文字列表現 |

---

### 2.2 Todo（変更）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.Todo` |
| 種別 | Entity |
| 責務 | ToDoデータの保持 |

#### 追加フィールド

| フィールド名 | 型 | 概要 | 初期値 |
|-------------|-----|------|--------|
| assigneeId | Long | 担当者ID | null |
| assigneeName | String | 担当者名（表示用、非永続化） | null |

#### 追加メソッド

| メソッド | 説明 |
|---------|------|
| getAssigneeId() | 担当者IDを取得 |
| setAssigneeId(Long assigneeId) | 担当者IDを設定 |
| getAssigneeName() | 担当者名を取得 |
| setAssigneeName(String assigneeName) | 担当者名を設定 |

#### toString()の変更

assigneeId, assigneeNameを出力に追加

---

## 3. Mapperインターフェース設計

### 3.1 UserMapper（新規）

| 項目 | 内容 |
|------|------|
| インターフェース名 | `com.example.demo.UserMapper` |
| アノテーション | `@Mapper` |
| 責務 | ユーザーデータのCRUD |

#### メソッド一覧

| メソッド | 概要 | SQL ID |
|---------|------|--------|
| `List<User> selectAll()` | 全件取得 | Q-U01 |
| `User selectById(Long id)` | ID指定取得 | Q-U02 |
| `User selectByName(String name)` | 名前指定取得 | Q-U03 |
| `void insert(User user)` | 新規作成 | Q-U04 |
| `void deleteById(Long id)` | ID指定削除 | Q-U05 |
| `int count()` | 件数取得 | Q-U06 |

---

### 3.2 TodoMapper（変更）

#### 変更メソッド

既存メソッドのSELECT文にASSIGNEE_IDを追加

| メソッド | 変更内容 |
|---------|---------|
| selectAll() | ASSIGNEE_IDをSELECT句に追加 |
| selectById() | ASSIGNEE_IDをSELECT句に追加 |
| selectByCompleted() | ASSIGNEE_IDをSELECT句に追加 |
| selectByProjectId() | ASSIGNEE_IDをSELECT句に追加 |
| selectByProjectIdIsNull() | ASSIGNEE_IDをSELECT句に追加 |
| insert() | ASSIGNEE_IDをINSERT句に追加 |
| update() | ASSIGNEE_IDをUPDATE句に追加 |

#### 追加メソッド

| メソッド | 概要 | SQL ID |
|---------|------|--------|
| `void clearAssigneeByUserId(Long userId)` | 指定ユーザーIDの担当をNULLに設定 | Q-T06 |

---

## 4. SQL設計

### 4.1 UserMapper.xml（新規）

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.demo.UserMapper">

    <!-- Q-U01: 全件取得（作成日時順） -->
    <select id="selectAll" resultType="com.example.demo.User">
        SELECT
            ID,
            NAME,
            CREATED_AT
        FROM
            USER
        ORDER BY
            CREATED_AT ASC
    </select>

    <!-- Q-U02: ID指定取得 -->
    <select id="selectById" resultType="com.example.demo.User">
        SELECT
            ID,
            NAME,
            CREATED_AT
        FROM
            USER
        WHERE
            ID = #{id}
    </select>

    <!-- Q-U03: 名前指定取得 -->
    <select id="selectByName" resultType="com.example.demo.User">
        SELECT
            ID,
            NAME,
            CREATED_AT
        FROM
            USER
        WHERE
            NAME = #{name}
    </select>

    <!-- Q-U04: 新規作成 -->
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO USER (
            NAME,
            CREATED_AT
        ) VALUES (
            #{name},
            #{createdAt}
        )
    </insert>

    <!-- Q-U05: ID指定削除 -->
    <delete id="deleteById">
        DELETE FROM USER
        WHERE ID = #{id}
    </delete>

    <!-- Q-U06: 件数取得 -->
    <select id="count" resultType="int">
        SELECT COUNT(*) FROM USER
    </select>

</mapper>
```

### 4.2 TodoMapper.xml（変更）

#### 変更例: selectAll（Q-001）

```xml
<!-- Q-001: 全件取得（作成日時順） -->
<select id="selectAll" resultType="com.example.demo.Todo">
    SELECT
        T.ID,
        T.TITLE,
        T.DESCRIPTION,
        T.COMPLETED,
        T.CREATED_AT,
        T.PROJECT_ID,
        T.START_DATE,
        T.DUE_DATE,
        T.ASSIGNEE_ID,
        U.NAME AS ASSIGNEE_NAME
    FROM
        TODO T
    LEFT JOIN
        USER U ON T.ASSIGNEE_ID = U.ID
    ORDER BY
        T.CREATED_AT ASC
</select>
```

#### 変更例: insert（Q-004）

```xml
<!-- Q-004: 新規作成 -->
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO TODO (
        TITLE,
        DESCRIPTION,
        COMPLETED,
        CREATED_AT,
        PROJECT_ID,
        START_DATE,
        DUE_DATE,
        ASSIGNEE_ID
    ) VALUES (
        #{title},
        #{description},
        #{completed},
        #{createdAt},
        #{projectId},
        #{startDate},
        #{dueDate},
        #{assigneeId}
    )
</insert>
```

#### 変更例: update（Q-005）

```xml
<!-- Q-005: 更新 -->
<update id="update">
    UPDATE TODO
    SET
        TITLE = #{title},
        DESCRIPTION = #{description},
        COMPLETED = #{completed},
        PROJECT_ID = #{projectId},
        START_DATE = #{startDate},
        DUE_DATE = #{dueDate},
        ASSIGNEE_ID = #{assigneeId}
    WHERE
        ID = #{id}
</update>
```

#### 追加: clearAssigneeByUserId（Q-T06）

```xml
<!-- Q-T06: 指定ユーザーIDの担当をNULLに設定 -->
<update id="clearAssigneeByUserId">
    UPDATE TODO
    SET ASSIGNEE_ID = NULL
    WHERE ASSIGNEE_ID = #{userId}
</update>
```

---

## 5. Serviceクラス設計

### 5.1 UserService（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.UserService` |
| 種別 | Service |
| 責務 | ユーザーのビジネスロジック |
| アノテーション | `@Service` |

#### フィールド

| フィールド名 | 型 | 概要 |
|-------------|-----|------|
| userMapper | UserMapper | ユーザーMapper |

#### メソッド詳細

##### getAllUsers()

| 項目 | 内容 |
|------|------|
| シグネチャ | `List<User> getAllUsers()` |
| 概要 | 全ユーザーを取得 |
| 引数 | なし |
| 戻り値 | ユーザーリスト |

**処理フロー**:

1. userMapper.selectAll()を呼び出し
2. 結果を返却

##### getUserById(Long id)

| 項目 | 内容 |
|------|------|
| シグネチャ | `User getUserById(Long id)` |
| 概要 | 指定IDのユーザーを取得 |
| 引数 | `id`: ユーザーID |
| 戻り値 | ユーザー（見つからない場合はnull） |

**処理フロー**:

1. userMapper.selectById(id)を呼び出し
2. 結果を返却

##### createUser(User user)

| 項目 | 内容 |
|------|------|
| シグネチャ | `User createUser(User user)` |
| 概要 | 新しいユーザーを作成 |
| 引数 | `user`: 作成するユーザー |
| 戻り値 | 作成されたユーザー |

**処理フロー**:

1. userMapper.insert(user)を呼び出し
2. 作成されたユーザーを返却

##### deleteUser(Long id)

| 項目 | 内容 |
|------|------|
| シグネチャ | `User deleteUser(Long id)` |
| 概要 | ユーザーを削除 |
| 引数 | `id`: 削除するユーザーID |
| 戻り値 | 削除されたユーザー（見つからない場合はnull） |

**処理フロー**:

1. userMapper.selectById(id)で存在確認
2. 存在しなければnullを返却
3. userMapper.deleteById(id)を呼び出し
4. 削除されたユーザーを返却

##### existsByName(String name)

| 項目 | 内容 |
|------|------|
| シグネチャ | `boolean existsByName(String name)` |
| 概要 | ユーザー名の重複チェック |
| 引数 | `name`: チェックするユーザー名 |
| 戻り値 | 存在する場合はtrue |

**処理フロー**:

1. userMapper.selectByName(name)を呼び出し
2. 結果がnullでなければtrueを返却

##### getCount()

| 項目 | 内容 |
|------|------|
| シグネチャ | `int getCount()` |
| 概要 | ユーザー総数を取得 |
| 引数 | なし |
| 戻り値 | ユーザー数 |

**処理フロー**:

1. userMapper.count()を呼び出し
2. 結果を返却

---

### 5.2 TodoService（変更）

#### 変更メソッド

##### createTodo(Todo todo)

**変更処理**:

INSERT後にDBから再取得することで、担当者名（assigneeName）を含めた完全なToDoを返却する。

```java
public Todo createTodo(Todo todo) {
    validateDateRange(todo.getStartDate(), todo.getDueDate());
    todoMapper.insert(todo);
    // 担当者名を含めて再取得
    return todoMapper.selectById(todo.getId());
}
```

##### updateTodo(Long id, Todo updatedTodo)

**追加処理**:

1. assigneeIdフィールドの更新追加
2. UPDATE後にDBから再取得することで、担当者名（assigneeName）を含めた完全なToDoを返却する

```java
existingTodo.setAssigneeId(updatedTodo.getAssigneeId());
todoMapper.update(existingTodo);
// 担当者名を含めて再取得
return todoMapper.selectById(id);
```

#### assigneeNameの取得について

assigneeNameはSQLのLEFT JOIN句で取得するため、以下の方針で対応:

| メソッド | 対応方法 |
|---------|---------|
| selectAll(), selectById()等 | SQLのJOIN句で自動取得（追加処理不要） |
| createTodo() | INSERT後にselectById()で再取得 |
| updateTodo() | UPDATE後にselectById()で再取得 |

---

## 6. ビジネスルール

### 6.1 ルール一覧

| ルールID | ルール内容 | 適用箇所 | チェック方法 |
|---------|-----------|---------|-------------|
| BR-001 | ユーザー名は必須 | UserController.createUser | name != null && !name.isEmpty() |
| BR-002 | ユーザー名は100文字以内 | UserController.createUser | name.length() <= 100 |
| BR-003 | ユーザー名は一意 | UserController.createUser | UserService.existsByName() |
| BR-004 | 削除対象ユーザーが存在する | UserController.deleteUser | UserService.getUserById() != null |
| BR-005 | 担当者IDが指定された場合は存在する | TodoController.createTodo/updateTodo | UserService.getUserById() != null |

---

## 7. 初期データ

### 7.1 ユーザー初期データ

| ID | NAME | CREATED_AT | 備考 |
|----|------|------------|------|
| 1 | 山田太郎 | 起動時刻 | サンプルユーザー1 |
| 2 | 鈴木花子 | 起動時刻 | サンプルユーザー2 |
| 3 | 佐藤一郎 | 起動時刻 | サンプルユーザー3 |

---

## 8. スレッドセーフティ

| 対策 | 説明 |
|------|------|
| HikariCP | Spring Boot標準のコネクションプール |
| H2ロック機構 | データベースレベルでの整合性保証 |
| ユーザー名一意制約 | DBレベルでの重複防止 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
| 1.1 | 2025-12-22 | TodoService.createTodo/updateTodoの戻り値仕様を明確化（担当者名を含めて再取得） | - |
