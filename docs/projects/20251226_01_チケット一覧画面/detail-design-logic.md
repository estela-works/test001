# ロジック詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | チケット一覧画面 |
| 案件ID | 20251226_チケット一覧画面 |
| 作成日 | 2025-12-26 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

ビジネスロジック（Service層、Entity）の詳細仕様を定義する。

### 1.2 変更有無

| 項目 | 状態 |
|------|------|
| Entity追加/変更 | **なし** |
| Service追加/変更 | **なし** |
| ビジネスルール追加 | **なし** |

### 1.3 変更なしの理由

本案件はフロントエンドのみの改善であり、以下の理由によりバックエンドロジックの追加・変更は不要である:

1. **既存APIで対応可能**: 既存の `TodoService`、`UserService`、`ProjectService` が提供するメソッドで必要なデータはすべて取得可能
2. **フィルタ・検索・ソート処理**: フロントエンド（Vue.js computed）で実装するため、バックエンドへの追加実装は不要
3. **データ量が少ない**: 現時点では数百件程度を想定しており、サーバーサイドでの処理は必要ない

---

## 2. 利用する既存コンポーネント

### 2.1 Entity

本案件で使用する既存Entityの一覧。

| Entity | ファイル | 利用目的 |
|--------|---------|---------|
| Todo | `com.example.todo.entity.Todo` | チケットデータ構造 |
| User | `com.example.todo.entity.User` | ユーザーデータ構造 |
| Project | `com.example.todo.entity.Project` | プロジェクトデータ構造 |

### 2.2 Service

本案件で使用する既存Serviceの一覧。

| Service | ファイル | 利用メソッド |
|---------|---------|-------------|
| TodoService | `com.example.todo.service.TodoService` | findAll(), findById(), toggleCompleted(), delete() |
| UserService | `com.example.todo.service.UserService` | findAll() |
| ProjectService | `com.example.todo.service.ProjectService` | findAll() |

---

## 3. フロントエンドでのロジック実装

### 3.1 概要

フィルタリング、検索、ソートのロジックはフロントエンドで実装する。詳細は以下の設計書を参照。

| ロジック | 実装場所 | 参照設計書 |
|---------|---------|-----------|
| フィルタリング関数 | `types/filter.ts` | [detail-design-types.md](./detail-design-types.md) |
| ソート関数 | `types/filter.ts` | [detail-design-types.md](./detail-design-types.md) |
| computed処理 | `TodoTableView.vue` | [detail-design-store.md](./detail-design-store.md) |

### 3.2 処理フロー

```
┌─────────────────┐
│  todoStore.todos │  ← 既存ストアからデータ取得
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  キーワード検索   │  ← title, descriptionで部分一致
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  完了状態フィルタ │  ← all/pending/completed
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  担当者フィルタ   │  ← assigneeId一致
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  案件フィルタ     │  ← projectId一致
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  期間フィルタ     │  ← startDate, dueDate範囲
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ソート           │  ← 指定列で昇順/降順
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  表示用配列       │  → テーブルに表示
└─────────────────┘
```

---

## 4. 将来的な拡張案

### 4.1 サーバーサイドフィルタリング

データ量が増加した場合（数千件以上）に検討するロジックの拡張案。

#### TodoService への追加メソッド（案）

```java
/**
 * 条件付きチケット検索
 * @param keyword 検索キーワード（nullable）
 * @param completed 完了状態（nullable）
 * @param assigneeId 担当者ID（nullable）
 * @param projectId 案件ID（nullable）
 * @param startDateFrom 開始日From（nullable）
 * @param startDateTo 開始日To（nullable）
 * @param dueDateFrom 終了日From（nullable）
 * @param dueDateTo 終了日To（nullable）
 * @return 条件に一致するチケット一覧
 */
public List<Todo> search(
    String keyword,
    Boolean completed,
    Long assigneeId,
    Long projectId,
    LocalDate startDateFrom,
    LocalDate startDateTo,
    LocalDate dueDateFrom,
    LocalDate dueDateTo
);
```

#### TodoMapper への追加（案）

```xml
<select id="search" resultType="Todo">
  SELECT * FROM todos
  WHERE 1=1
  <if test="keyword != null">
    AND (title LIKE CONCAT('%', #{keyword}, '%')
         OR description LIKE CONCAT('%', #{keyword}, '%'))
  </if>
  <if test="completed != null">
    AND completed = #{completed}
  </if>
  <if test="assigneeId != null">
    AND assignee_id = #{assigneeId}
  </if>
  <if test="projectId != null">
    AND project_id = #{projectId}
  </if>
  <if test="startDateFrom != null">
    AND start_date >= #{startDateFrom}
  </if>
  <if test="startDateTo != null">
    AND start_date <= #{startDateTo}
  </if>
  <if test="dueDateFrom != null">
    AND due_date >= #{dueDateFrom}
  </if>
  <if test="dueDateTo != null">
    AND due_date <= #{dueDateTo}
  </if>
</select>
```

**注意**: これらの拡張は本案件のスコープ外であり、将来的な検討事項として記載。

---

## 5. ビジネスルール

### 5.1 本案件での追加ルール

なし（既存ルールを変更せず使用）

### 5.2 フロントエンドでの表示ルール

| ルールID | ルール内容 | 適用箇所 |
|---------|-----------|---------|
| DR-001 | 説明が30文字を超える場合は省略表示 | TodoTableRow.vue |
| DR-002 | 日付はYYYY/MM/DD形式で表示 | TodoTableRow.vue |
| DR-003 | 完了状態は「完了」「未完了」で表示 | TodoTableRow.vue |
| DR-004 | null/undefinedの値はソート時に末尾に配置 | TodoTableView.vue |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-26 | 初版作成（変更なしを明記） | Claude |
