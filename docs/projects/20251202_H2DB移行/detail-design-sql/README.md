# SQL詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | H2 Database移行 |
| 案件ID | 202512_H2DB移行 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-backend.md](../basic-design-backend.md) |

---

## 目次

- [概要](#1-概要) (このページ)
- [クエリ一覧](#2-クエリ一覧) (このページ)
- [Mapper XML全体構造](#3-mapper-xml全体構造) (このページ)
- [クエリ詳細](./query-details.md)
- [インデックス・パフォーマンス・セキュリティ・デバッグ](./performance.md)
- [改版履歴](#改版履歴) (このページ)

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

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
| 2.0 | 2025-12-22 | Spring Data JPA → MyBatis方式に変更（手書きSQL） | - |
| 3.0 | 2025-12-23 | ファイル分割（README, query-details, performance） | - |
