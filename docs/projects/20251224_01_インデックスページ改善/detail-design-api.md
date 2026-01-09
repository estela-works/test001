# API詳細設計書

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

本案件におけるAPI変更の有無を明確化する。

### 1.2 変更有無

| 項目 | 本案件での変更 |
|------|---------------|
| 新規API追加 | **なし** |
| 既存API変更 | **なし** |
| API廃止 | **なし** |

---

## 2. 変更なしの理由

本案件はフロントエンドのみの改善（静的HTMLの追加）であり、以下の理由によりAPI変更は不要である:

1. **静的ナビゲーション**: ホーム画面のナビゲーションカードは静的リンクであり、動的データ取得を行わない
2. **既存画面への影響なし**: 既存画面（SC-002〜SC-004）が使用するAPIに変更なし
3. **データモデル変更なし**: Todo, Project, Userエンティティに変更なし

---

## 3. 既存API一覧（参考）

本案件で変更対象外のAPI一覧。

| メソッド | パス | 機能 | 変更 |
|---------|------|------|------|
| GET | /api/todos | Todo全件取得 | **なし** |
| GET | /api/todos?projectId={id} | Todoフィルタ取得 | **なし** |
| GET | /api/todos/{id} | Todo単一取得 | **なし** |
| GET | /api/todos/stats | Todo統計取得 | **なし** |
| POST | /api/todos | Todo新規作成 | **なし** |
| PUT | /api/todos/{id} | Todo更新 | **なし** |
| PATCH | /api/todos/{id}/toggle | Todo完了切替 | **なし** |
| DELETE | /api/todos/{id} | Todo単一削除 | **なし** |
| DELETE | /api/todos | Todo全件削除 | **なし** |
| GET | /api/projects | Project全件取得 | **なし** |
| GET | /api/projects/{id} | Project単一取得 | **なし** |
| GET | /api/projects/{id}/stats | Project統計取得 | **なし** |
| POST | /api/projects | Project新規作成 | **なし** |
| DELETE | /api/projects/{id} | Project削除 | **なし** |
| GET | /api/users | User全件取得 | **なし** |
| GET | /api/users/{id} | User単一取得 | **なし** |
| POST | /api/users | User新規作成 | **なし** |
| DELETE | /api/users/{id} | User削除 | **なし** |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-24 | 初版作成（変更なし） | - |
