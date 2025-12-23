# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 担当者機能追加 |
| 案件ID | 202512_担当者機能追加 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-frontend.md](../basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

担当者機能追加に伴うフロントエンドの画面実装詳細を定義する。

### 1.2 対象コンポーネント

| コンポーネント/ファイル | 種別 | 責務 | 変更種別 |
|----------------------|------|------|----------|
| todos.html | HTML/CSS/JS | ToDoリスト画面 | 変更 |
| users.html | HTML/CSS/JS | ユーザー管理画面 | 新規 |
| index.html | HTML | ホーム画面 | 変更 |

---

## 2. ファイル構成

### 2.1 詳細設計ファイル一覧

| ファイル | 内容 |
|---------|------|
| [sc-002-todolist.md](./sc-002-todolist.md) | ToDoリスト画面変更（SC-002） |
| [sc-003-usermgmt.md](./sc-003-usermgmt.md) | ユーザー管理画面新規（SC-003） |
| [common-specs.md](./common-specs.md) | API連携・バリデーション |

### 2.2 実装ファイル一覧

| ファイル | パス | 役割 | 変更種別 |
|---------|------|------|----------|
| todos.html | src/main/resources/static/todos.html | ToDoリスト画面 | 変更 |
| users.html | src/main/resources/static/users.html | ユーザー管理画面 | 新規 |
| index.html | src/main/resources/static/index.html | ホーム画面 | 変更 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
| 1.1 | 2025-12-23 | ファイル分割 | - |
