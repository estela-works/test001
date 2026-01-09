# ロジック詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | インデックスページ改善 |
| 案件ID | 20251224_インデックスページ改善 |
| 作成日 | 2025-12-24 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

本案件におけるビジネスロジック変更の有無を明確化する。

### 1.2 変更有無

| 項目 | 本案件での変更 |
|------|---------------|
| 新規ロジック追加 | **なし** |
| 既存ロジック変更 | **なし** |
| ロジック廃止 | **なし** |

---

## 2. 変更なしの理由

本案件はフロントエンドのみの改善（静的HTMLの追加）であり、以下の理由によりビジネスロジック変更は不要である:

1. **静的ページ**: ホーム画面はサーバーサイド処理を必要としない
2. **データ操作なし**: 新規画面でのデータ作成・更新・削除がない
3. **バリデーション不要**: ユーザー入力を受け付けない

---

## 3. 既存ロジック一覧（参考）

本案件で変更対象外のロジック一覧。

### 3.1 Serviceクラス

| クラス | 責務 | 変更 |
|--------|------|------|
| TodoService | Todoの CRUD 操作、統計計算 | **なし** |
| ProjectService | Projectの CRUD 操作、進捗計算 | **なし** |
| UserService | Userの CRUD 操作 | **なし** |

### 3.2 主要メソッド

| クラス | メソッド | 機能 | 変更 |
|--------|----------|------|------|
| TodoService | findAll() | Todo全件取得 | **なし** |
| TodoService | findByProjectId() | プロジェクト別Todo取得 | **なし** |
| TodoService | getStats() | 統計情報取得 | **なし** |
| TodoService | create() | Todo作成 | **なし** |
| TodoService | update() | Todo更新 | **なし** |
| TodoService | toggleComplete() | 完了状態切替 | **なし** |
| TodoService | delete() | Todo削除 | **なし** |
| ProjectService | findAll() | Project全件取得 | **なし** |
| ProjectService | getStats() | プロジェクト統計取得 | **なし** |
| ProjectService | create() | Project作成 | **なし** |
| ProjectService | delete() | Project削除 | **なし** |
| UserService | findAll() | User全件取得 | **なし** |
| UserService | create() | User作成 | **なし** |
| UserService | delete() | User削除 | **なし** |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-24 | 初版作成（変更なし） | - |
