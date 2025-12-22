# SQL詳細設計書

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

MyBatis Mapper XMLで定義する手書きSQLの詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 |
|---------|---------------|------|
| Mapper | TodoMapper.java | Mapperインターフェース |
| Mapper | TodoMapper.xml | SQL定義（手書き） |

### 1.3 SQL管理方式

| 項目 | 内容 |
|------|------|
| O/Rマッパー | MyBatis |
| SQL定義場所 | src/main/resources/mapper/TodoMapper.xml |
| 管理方式 | 手書きSQL（XML形式） |
| パラメータバインド | #{param} 形式（SQLインジェクション対策済み） |

---

## 2. クエリ一覧

| ID | クエリ名 | 種別 | 対象テーブル | Mapperメソッド |
|----|---------|------|-------------|----------------|
| Q-001 | 全件取得（作成日時順） | SELECT | TODO | selectAll() |
| Q-002 | ID指定取得 | SELECT | TODO | selectById() |
| Q-003 | 完了状態フィルタ | SELECT | TODO | selectByCompleted() |
| Q-004 | 新規作成 | INSERT | TODO | insert() |
| Q-005 | 更新 | UPDATE | TODO | update() |
| Q-006 | ID指定削除 | DELETE | TODO | deleteById() |
| Q-007 | 全件削除 | DELETE | TODO | deleteAll() |
| Q-008 | 件数取得 | SELECT | TODO | count() |
| Q-009 | 完了状態別件数 | SELECT | TODO | countByCompleted() |

---

## 3. Mapper XML全体構造

### 3.1 TodoMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.demo.TodoMapper">

    <!-- Q-001: 全件取得（作成日時順） -->
    <select id="selectAll" resultType="com.example.demo.Todo">
        SELECT
            ID,
            TITLE,
            DESCRIPTION,
            COMPLETED,
            CREATED_AT
        FROM
            TODO
        ORDER BY
            CREATED_AT ASC
    </select>

    <!-- Q-002: ID指定取得 -->
    <select id="selectById" resultType="com.example.demo.Todo">
        SELECT
            ID,
            TITLE,
            DESCRIPTION,
            COMPLETED,
            CREATED_AT
        FROM
            TODO
        WHERE
            ID = #{id}
    </select>

    <!-- Q-003: 完了状態フィルタ -->
    <select id="selectByCompleted" resultType="com.example.demo.Todo">
        SELECT
            ID,
            TITLE,
            DESCRIPTION,
            COMPLETED,
            CREATED_AT
        FROM
            TODO
        WHERE
            COMPLETED = #{completed}
        ORDER BY
            CREATED_AT ASC
    </select>

    <!-- Q-004: 新規作成 -->
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO TODO (
            TITLE,
            DESCRIPTION,
            COMPLETED,
            CREATED_AT
        ) VALUES (
            #{title},
            #{description},
            #{completed},
            #{createdAt}
        )
    </insert>

    <!-- Q-005: 更新 -->
    <update id="update">
        UPDATE TODO
        SET
            TITLE = #{title},
            DESCRIPTION = #{description},
            COMPLETED = #{completed}
        WHERE
            ID = #{id}
    </update>

    <!-- Q-006: ID指定削除 -->
    <delete id="deleteById">
        DELETE FROM TODO
        WHERE ID = #{id}
    </delete>

    <!-- Q-007: 全件削除 -->
    <delete id="deleteAll">
        DELETE FROM TODO
    </delete>

    <!-- Q-008: 件数取得 -->
    <select id="count" resultType="int">
        SELECT COUNT(*) FROM TODO
    </select>

    <!-- Q-009: 完了状態別件数 -->
    <select id="countByCompleted" resultType="int">
        SELECT COUNT(*)
        FROM TODO
        WHERE COMPLETED = #{completed}
    </select>

</mapper>
```

---

## 4. クエリ詳細

### 4.1 Q-001: 全件取得（作成日時順）

| 項目 | 内容 |
|------|------|
| ID | selectAll |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 全ToDoを作成日時の昇順で取得 |
| 呼び出し元 | TodoMapper.selectAll() |

#### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
FROM
    TODO
ORDER BY
    CREATED_AT ASC
```

#### パラメータ

なし

#### 結果マッピング

| DBカラム | Javaフィールド | 型 |
|---------|---------------|-----|
| ID | id | Long |
| TITLE | title | String |
| DESCRIPTION | description | String |
| COMPLETED | completed | boolean |
| CREATED_AT | createdAt | LocalDateTime |

※ `map-underscore-to-camel-case=true` 設定により自動マッピング

---

### 4.2 Q-002: ID指定取得

| 項目 | 内容 |
|------|------|
| ID | selectById |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 指定IDのToDoを取得 |
| 呼び出し元 | TodoMapper.selectById(Long id) |

#### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
FROM
    TODO
WHERE
    ID = #{id}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{id} | Long | 要 | ToDo ID |

#### 戻り値

- 該当レコードが存在する場合: Todoオブジェクト
- 該当レコードが存在しない場合: null

---

### 4.3 Q-003: 完了状態フィルタ

| 項目 | 内容 |
|------|------|
| ID | selectByCompleted |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 完了状態でフィルタし作成日時順で取得 |
| 呼び出し元 | TodoMapper.selectByCompleted(boolean completed) |

#### SQL

```sql
SELECT
    ID,
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
FROM
    TODO
WHERE
    COMPLETED = #{completed}
ORDER BY
    CREATED_AT ASC
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{completed} | boolean | 要 | 完了状態（true/false） |

---

### 4.4 Q-004: 新規作成

| 項目 | 内容 |
|------|------|
| ID | insert |
| 種別 | INSERT |
| 対象テーブル | TODO |
| 概要 | 新規ToDoを作成 |
| 呼び出し元 | TodoMapper.insert(Todo todo) |

#### SQL

```sql
INSERT INTO TODO (
    TITLE,
    DESCRIPTION,
    COMPLETED,
    CREATED_AT
) VALUES (
    #{title},
    #{description},
    #{completed},
    #{createdAt}
)
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{title} | String | 要 | タイトル |
| #{description} | String | 任意 | 説明 |
| #{completed} | boolean | 要 | 完了状態 |
| #{createdAt} | LocalDateTime | 要 | 作成日時 |

#### 自動採番設定

| 設定 | 値 | 説明 |
|------|-----|------|
| useGeneratedKeys | true | 自動採番されたIDを取得 |
| keyProperty | id | 取得したIDをセットするプロパティ |

※ INSERT実行後、引数のTodoオブジェクトのidフィールドに自動採番されたIDがセットされる

---

### 4.5 Q-005: 更新

| 項目 | 内容 |
|------|------|
| ID | update |
| 種別 | UPDATE |
| 対象テーブル | TODO |
| 概要 | 既存ToDoを更新 |
| 呼び出し元 | TodoMapper.update(Todo todo) |

#### SQL

```sql
UPDATE TODO
SET
    TITLE = #{title},
    DESCRIPTION = #{description},
    COMPLETED = #{completed}
WHERE
    ID = #{id}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{title} | String | 要 | タイトル |
| #{description} | String | 任意 | 説明 |
| #{completed} | boolean | 要 | 完了状態 |
| #{id} | Long | 要 | 更新対象ID |

#### 注意事項

- CREATED_ATは更新対象外（作成日時は不変）
- WHERE句でIDを指定して対象レコードを特定

---

### 4.6 Q-006: ID指定削除

| 項目 | 内容 |
|------|------|
| ID | deleteById |
| 種別 | DELETE |
| 対象テーブル | TODO |
| 概要 | 指定IDのToDoを削除 |
| 呼び出し元 | TodoMapper.deleteById(Long id) |

#### SQL

```sql
DELETE FROM TODO
WHERE ID = #{id}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{id} | Long | 要 | 削除対象ID |

---

### 4.7 Q-007: 全件削除

| 項目 | 内容 |
|------|------|
| ID | deleteAll |
| 種別 | DELETE |
| 対象テーブル | TODO |
| 概要 | 全ToDoを削除 |
| 呼び出し元 | TodoMapper.deleteAll() |

#### SQL

```sql
DELETE FROM TODO
```

#### パラメータ

なし

---

### 4.8 Q-008: 件数取得

| 項目 | 内容 |
|------|------|
| ID | count |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 全ToDo件数を取得 |
| 呼び出し元 | TodoMapper.count() |

#### SQL

```sql
SELECT COUNT(*) FROM TODO
```

#### 戻り値

| 型 | 説明 |
|-----|------|
| int | 件数 |

---

### 4.9 Q-009: 完了状態別件数

| 項目 | 内容 |
|------|------|
| ID | countByCompleted |
| 種別 | SELECT |
| 対象テーブル | TODO |
| 概要 | 完了状態でフィルタした件数を取得 |
| 呼び出し元 | TodoMapper.countByCompleted(boolean completed) |

#### SQL

```sql
SELECT COUNT(*)
FROM TODO
WHERE COMPLETED = #{completed}
```

#### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| #{completed} | boolean | 要 | 完了状態 |

---

## 5. インデックス利用

### 5.1 利用インデックス

| クエリID | 使用インデックス | 備考 |
|---------|-----------------|------|
| selectById | PRIMARY (ID) | WHERE句でID検索 |
| deleteById | PRIMARY (ID) | WHERE句でID検索 |

### 5.2 フルスキャンとなるクエリ

| クエリID | 理由 | 影響 |
|---------|------|------|
| selectAll | 全件取得 | 件数が少ないため許容 |
| selectByCompleted | COMPLETEDにインデックスなし | 件数が少ないため許容 |
| deleteAll | 全件削除 | 意図的な全件操作 |
| count | COUNT(*) | 件数が少ないため許容 |
| countByCompleted | COMPLETEDにインデックスなし | 件数が少ないため許容 |

---

## 6. パフォーマンス考慮

### 6.1 想定データ量

| テーブル | 想定レコード数 | 備考 |
|---------|---------------|------|
| TODO | 〜100件 | 個人利用想定 |

### 6.2 注意事項

| クエリID | 注意点 | 対策 |
|---------|--------|------|
| deleteAll | 全件削除 | 確認ダイアログでユーザー確認 |

### 6.3 将来の最適化

データ量が増加した場合（1000件以上）、以下の対応を検討。

| 対策 | 内容 |
|------|------|
| インデックス追加 | COMPLETED, CREATED_AT にインデックス |
| ページネーション | selectAllにLIMIT/OFFSET追加 |

---

## 7. セキュリティ

### 7.1 SQLインジェクション対策

| 対策 | 内容 |
|------|------|
| パラメータバインディング | #{param} 形式を使用 |
| PreparedStatement | MyBatisが内部で使用 |

**悪い例（使用禁止）**:
```sql
-- ${param} は文字列連結のため危険
SELECT * FROM TODO WHERE TITLE = '${title}'
```

**良い例（採用）**:
```sql
-- #{param} はパラメータバインディングで安全
SELECT * FROM TODO WHERE TITLE = #{title}
```

---

## 8. デバッグ設定

### 8.1 SQL出力設定

`application.properties`で発行SQLをログ出力可能。

```properties
# MyBatis SQL出力
logging.level.com.example.demo.TodoMapper=DEBUG

# または詳細なログ
logging.level.org.mybatis=DEBUG
```

### 8.2 ログ出力例

```
DEBUG c.e.demo.TodoMapper.selectAll - ==>  Preparing: SELECT ID, TITLE, DESCRIPTION, COMPLETED, CREATED_AT FROM TODO ORDER BY CREATED_AT ASC
DEBUG c.e.demo.TodoMapper.selectAll - ==> Parameters:
DEBUG c.e.demo.TodoMapper.selectAll - <==      Total: 3
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
| 2.0 | 2025-12-22 | Spring Data JPA → MyBatis方式に変更（手書きSQL） | - |
