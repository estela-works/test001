# SQL詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

コメント機能のデータアクセス層SQLクエリ仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 |
|---------|---------------|------|
| Mapper | TodoCommentMapper | コメントデータアクセス |
| XML | TodoCommentMapper.xml | SQL定義 |

---

## 2. クエリ一覧

| ID | クエリ名 | 種別 | 対象テーブル | 概要 |
|----|---------|------|-------------|------|
| Q-001 | selectByTodoId | SELECT | TODOCOMMENT, USER | ToDoIDでコメント一覧を取得 |
| Q-002 | selectById | SELECT | TODOCOMMENT, USER | IDでコメントを取得 |
| Q-003 | insert | INSERT | TODOCOMMENT | コメントを挿入 |
| Q-004 | deleteById | DELETE | TODOCOMMENT | IDでコメントを削除 |
| Q-005 | countByTodoId | SELECT | TODOCOMMENT | ToDoIDでコメント数を取得 |

---

## 3. クエリ詳細

### 3.1 Q-001: selectByTodoId

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | TODOCOMMENT, USER |
| 概要 | 指定ToDoに紐づくコメント一覧を新しい順で取得 |
| 呼び出し元 | TodoCommentMapper.selectByTodoId(Long todoId) |

#### SQL

```sql
SELECT
    c.ID AS id,
    c.TODO_ID AS todoId,
    c.USER_ID AS userId,
    u.NAME AS userName,
    c.CONTENT AS content,
    c.CREATED_AT AS createdAt
FROM
    TODOCOMMENT c
LEFT JOIN
    USER u ON c.USER_ID = u.ID
WHERE
    c.TODO_ID = #{todoId}
ORDER BY
    c.CREATED_AT DESC
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| todoId | Long | 要 | ToDoのID |

#### 結果

| カラム | Javaフィールド | 型 | 説明 |
|--------|---------------|-----|------|
| id | id | Long | コメントID |
| todoId | todoId | Long | ToDoID |
| userId | userId | Long | ユーザーID（NULL可） |
| userName | userName | String | ユーザー名（NULL可） |
| content | content | String | コメント内容 |
| createdAt | createdAt | LocalDateTime | 投稿日時 |

#### 注意事項

- LEFT JOINを使用してユーザーが削除されていてもコメントは取得される
- ORDER BY で作成日時の降順（新しい順）にソート

---

### 3.2 Q-002: selectById

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | TODOCOMMENT, USER |
| 概要 | IDでコメントを1件取得 |
| 呼び出し元 | TodoCommentMapper.selectById(Long id) |

#### SQL

```sql
SELECT
    c.ID AS id,
    c.TODO_ID AS todoId,
    c.USER_ID AS userId,
    u.NAME AS userName,
    c.CONTENT AS content,
    c.CREATED_AT AS createdAt
FROM
    TODOCOMMENT c
LEFT JOIN
    USER u ON c.USER_ID = u.ID
WHERE
    c.ID = #{id}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | コメントID |

#### 結果

Q-001と同じ（1件のみ）

---

### 3.3 Q-003: insert

| 項目 | 内容 |
|------|------|
| 種別 | INSERT |
| 対象テーブル | TODOCOMMENT |
| 概要 | コメントを新規挿入 |
| 呼び出し元 | TodoCommentMapper.insert(TodoComment comment) |

#### SQL

```sql
INSERT INTO TODOCOMMENT (
    TODO_ID,
    USER_ID,
    CONTENT,
    CREATED_AT
) VALUES (
    #{todoId},
    #{userId},
    #{content},
    CURRENT_TIMESTAMP
)
```

#### パラメータ

| パラメータ | Javaフィールド | 型 | 必須 | 説明 |
|-----------|---------------|-----|------|------|
| todoId | todoId | Long | 要 | ToDoID |
| userId | userId | Long | 要 | ユーザーID |
| content | content | String | 要 | コメント内容 |

#### 自動生成キー

- `ID`: AUTO_INCREMENTで自動採番
- `CREATED_AT`: CURRENT_TIMESTAMPで自動設定

#### MyBatis設定

```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
```

---

### 3.4 Q-004: deleteById

| 項目 | 内容 |
|------|------|
| 種別 | DELETE |
| 対象テーブル | TODOCOMMENT |
| 概要 | IDでコメントを削除 |
| 呼び出し元 | TodoCommentMapper.deleteById(Long id) |

#### SQL

```sql
DELETE FROM TODOCOMMENT
WHERE ID = #{id}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | Long | 要 | コメントID |

#### 戻り値

削除された行数（0または1）

---

### 3.5 Q-005: countByTodoId

| 項目 | 内容 |
|------|------|
| 種別 | SELECT |
| 対象テーブル | TODOCOMMENT |
| 概要 | ToDoに紐づくコメント数を取得 |
| 呼び出し元 | TodoCommentMapper.countByTodoId(Long todoId) |

#### SQL

```sql
SELECT COUNT(*)
FROM TODOCOMMENT
WHERE TODO_ID = #{todoId}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| todoId | Long | 要 | ToDoID |

#### 結果

| 型 | 説明 |
|-----|------|
| int | コメント件数 |

---

## 4. Mapper XML

### 4.1 ファイル

`src/main/resources/mapper/TodoCommentMapper.xml`

### 4.2 完全なXML定義

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.demo.TodoCommentMapper">

  <!-- ResultMap定義 -->
  <resultMap id="todoCommentResultMap" type="com.example.demo.TodoComment">
    <id property="id" column="id" />
    <result property="todoId" column="todoId" />
    <result property="userId" column="userId" />
    <result property="userName" column="userName" />
    <result property="content" column="content" />
    <result property="createdAt" column="createdAt" />
  </resultMap>

  <!-- Q-001: ToDoIDでコメント一覧を取得 -->
  <select id="selectByTodoId" resultMap="todoCommentResultMap">
    SELECT
      c.ID AS id,
      c.TODO_ID AS todoId,
      c.USER_ID AS userId,
      u.NAME AS userName,
      c.CONTENT AS content,
      c.CREATED_AT AS createdAt
    FROM
      TODOCOMMENT c
    LEFT JOIN
      USER u ON c.USER_ID = u.ID
    WHERE
      c.TODO_ID = #{todoId}
    ORDER BY
      c.CREATED_AT DESC
  </select>

  <!-- Q-002: IDでコメントを取得 -->
  <select id="selectById" resultMap="todoCommentResultMap">
    SELECT
      c.ID AS id,
      c.TODO_ID AS todoId,
      c.USER_ID AS userId,
      u.NAME AS userName,
      c.CONTENT AS content,
      c.CREATED_AT AS createdAt
    FROM
      TODOCOMMENT c
    LEFT JOIN
      USER u ON c.USER_ID = u.ID
    WHERE
      c.ID = #{id}
  </select>

  <!-- Q-003: コメントを挿入 -->
  <insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO TODOCOMMENT (
      TODO_ID,
      USER_ID,
      CONTENT,
      CREATED_AT
    ) VALUES (
      #{todoId},
      #{userId},
      #{content},
      CURRENT_TIMESTAMP
    )
  </insert>

  <!-- Q-004: IDでコメントを削除 -->
  <delete id="deleteById">
    DELETE FROM TODOCOMMENT
    WHERE ID = #{id}
  </delete>

  <!-- Q-005: ToDoIDでコメント数を取得 -->
  <select id="countByTodoId" resultType="int">
    SELECT COUNT(*)
    FROM TODOCOMMENT
    WHERE TODO_ID = #{todoId}
  </select>

</mapper>
```

---

## 5. インデックス利用

### 5.1 利用インデックス

| クエリID | 使用インデックス | カラム | 備考 |
|---------|-----------------|--------|------|
| Q-001 | idx_todocomment_todo_id | TODO_ID | WHERE句で使用、性能向上 |
| Q-002 | PRIMARY KEY | ID | WHERE句で使用 |
| Q-004 | PRIMARY KEY | ID | WHERE句で使用 |
| Q-005 | idx_todocomment_todo_id | TODO_ID | WHERE句で使用 |

---

## 6. パフォーマンス考慮

### 6.1 注意事項

| クエリID | 注意点 | 対策 |
|---------|--------|------|
| Q-001 | ToDoに大量のコメントがある場合 | TODO_IDにインデックスを作成済み |
| Q-001 | LEFT JOINの性能 | USERテーブルは小規模なため問題なし |

### 6.2 想定パフォーマンス

| クエリID | 想定実行時間 | コメント数 |
|---------|------------|-----------|
| Q-001 | < 10ms | 100件以下 |
| Q-002 | < 5ms | 1件 |
| Q-003 | < 10ms | - |
| Q-004 | < 5ms | - |
| Q-005 | < 5ms | - |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
