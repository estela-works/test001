# DB詳細設計書

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

本案件におけるデータベース変更の有無を明確化する。

### 1.2 変更有無

| 項目 | 本案件での変更 |
|------|---------------|
| テーブル追加 | **なし** |
| テーブル変更 | **なし** |
| テーブル削除 | **なし** |
| インデックス変更 | **なし** |
| マイグレーション | **なし** |

---

## 2. 変更なしの理由

本案件はフロントエンドのみの改善（静的HTMLの追加）であり、以下の理由によりDB変更は不要である:

1. **新規データなし**: ホーム画面は新たなデータを扱わない
2. **既存データ構造維持**: Todo, Project, Userのデータ構造に変更なし
3. **リレーション変更なし**: テーブル間の関係に変更なし

---

## 3. 既存テーブル一覧（参考）

本案件で変更対象外のテーブル一覧。

| テーブル | 概要 | 変更 |
|---------|------|------|
| todos | チケット情報 | **なし** |
| projects | 案件情報 | **なし** |
| users | ユーザー情報 | **なし** |

---

## 4. 既存スキーマ（参考）

### 4.1 todosテーブル

| カラム | 型 | 制約 | 変更 |
|--------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | **なし** |
| title | VARCHAR(255) | NOT NULL | **なし** |
| description | TEXT | - | **なし** |
| completed | BOOLEAN | DEFAULT FALSE | **なし** |
| start_date | DATE | - | **なし** |
| end_date | DATE | - | **なし** |
| project_id | BIGINT | FK → projects | **なし** |
| user_id | BIGINT | FK → users | **なし** |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | **なし** |

### 4.2 projectsテーブル

| カラム | 型 | 制約 | 変更 |
|--------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | **なし** |
| name | VARCHAR(255) | NOT NULL | **なし** |
| description | TEXT | - | **なし** |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | **なし** |

### 4.3 usersテーブル

| カラム | 型 | 制約 | 変更 |
|--------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | **なし** |
| name | VARCHAR(255) | NOT NULL | **なし** |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | **なし** |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-24 | 初版作成（変更なし） | - |
