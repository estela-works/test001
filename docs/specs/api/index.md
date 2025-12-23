# API詳細設計 インデックス

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. 概要

各APIエンドポイントの詳細設計を個別ファイルで管理する。
API一覧（サマリー）は [api-catalog.md](../api-catalog.md) を参照。

---

## 2. API一覧

### 2.1 Todo API

| ID | メソッド | パス | 機能 | 詳細 |
|----|---------|------|------|------|
| API-TODO-001 | GET | /api/todos | 全件取得 | [API-TODO-001.md](API-TODO-001.md) |
| API-TODO-002 | GET | /api/todos?completed={bool} | フィルタ取得 | [API-TODO-002.md](API-TODO-002.md) |
| API-TODO-003 | GET | /api/todos/{id} | 単一取得 | [API-TODO-003.md](API-TODO-003.md) |
| API-TODO-004 | GET | /api/todos/stats | 統計取得 | [API-TODO-004.md](API-TODO-004.md) |
| API-TODO-005 | POST | /api/todos | 新規作成 | [API-TODO-005.md](API-TODO-005.md) |
| API-TODO-006 | PUT | /api/todos/{id} | 更新 | [API-TODO-006.md](API-TODO-006.md) |
| API-TODO-007 | PATCH | /api/todos/{id}/toggle | 完了切替 | [API-TODO-007.md](API-TODO-007.md) |
| API-TODO-008 | DELETE | /api/todos/{id} | 単一削除 | [API-TODO-008.md](API-TODO-008.md) |
| API-TODO-009 | DELETE | /api/todos | 全件削除 | [API-TODO-009.md](API-TODO-009.md) |

### 2.2 User API

| ID | メソッド | パス | 機能 | 詳細 |
|----|---------|------|------|------|
| API-USER-001 | GET | /api/users | ユーザー全件取得 | [API-USER-001.md](API-USER-001.md) |
| API-USER-002 | GET | /api/users/{id} | ユーザー単一取得 | [API-USER-002.md](API-USER-002.md) |
| API-USER-003 | POST | /api/users | ユーザー新規作成 | [API-USER-003.md](API-USER-003.md) |
| API-USER-004 | DELETE | /api/users/{id} | ユーザー削除 | [API-USER-004.md](API-USER-004.md) |

---

## 3. ドキュメント構造

各API詳細ファイルには以下の情報を記載する：

| セクション | 内容 |
|-----------|------|
| 基本情報 | メソッド、パス、機能概要 |
| 利用案件 | このAPIが追加・変更された案件 |
| 参照システム | このAPIを利用している画面・システム |
| リクエスト | パラメータ、リクエストボディ |
| レスポンス | ステータスコード、レスポンスボディ |
| 処理フロー | 内部処理の流れ |
| エラー処理 | エラーケースと対応 |
| 関連項目 | 関連するAPI、ロジック、DB |

---

## 4. 命名規則

- **API ID**: `API-{ドメイン}-{連番3桁}`
  - 例: `API-TODO-001`, `API-USER-001`
- **ファイル名**: `{API ID}.md`
  - 例: `API-TODO-001.md`

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-23 | 初版作成（Todo API 9件、User API 4件） | - |
