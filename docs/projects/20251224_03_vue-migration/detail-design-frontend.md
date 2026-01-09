# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## ドキュメント構成

本詳細設計書は以下のファイルに分割されています。

| ドキュメント | 内容 | 行数目安 |
|-------------|------|----------|
| [detail-design-frontend-common.md](./detail-design-frontend-common.md) | 共通コンポーネント・Composables・エントリーポイント | 約120行 |
| [detail-design-frontend-features.md](./detail-design-frontend-features.md) | 機能コンポーネント（Todo, Project, User） | 約280行 |
| [detail-design-frontend-pages.md](./detail-design-frontend-pages.md) | ページコンポーネント | 約220行 |

---

## 1. 概要

### 1.1 本設計書の目的

Vueコンポーネントの実装詳細（テンプレート構造、スクリプト、スタイル）を定義する。

### 1.2 対象コンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| App.vue | ルート | アプリケーション全体のレイアウト |
| HomeView.vue | ページ | トップページ表示 |
| TodoView.vue | ページ | ToDo管理画面 |
| ProjectView.vue | ページ | 案件管理画面 |
| UserView.vue | ページ | 担当者管理画面 |
| TodoForm.vue | 機能 | ToDo追加フォーム |
| TodoItem.vue | 機能 | ToDo表示・操作 |
| TodoList.vue | 機能 | ToDoリスト |
| TodoStats.vue | 機能 | 統計表示 |
| TodoFilter.vue | 機能 | フィルタボタン |
| ProjectForm.vue | 機能 | 案件追加フォーム |
| ProjectCard.vue | 機能 | 案件カード |
| UserForm.vue | 機能 | ユーザー追加フォーム |
| UserCard.vue | 機能 | ユーザーカード |
| LoadingSpinner.vue | 共通 | ローディング表示 |
| ErrorMessage.vue | 共通 | エラー表示 |
| NavCard.vue | 共通 | ナビゲーションカード |

---

## 2. ファイル構成

### 2.1 ファイル一覧

```
src/frontend/src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.vue
│   │   ├── ErrorMessage.vue
│   │   └── NavCard.vue
│   ├── todo/
│   │   ├── TodoForm.vue
│   │   ├── TodoItem.vue
│   │   ├── TodoList.vue
│   │   ├── TodoStats.vue
│   │   └── TodoFilter.vue
│   ├── project/
│   │   ├── ProjectForm.vue
│   │   └── ProjectCard.vue
│   └── user/
│       ├── UserForm.vue
│       └── UserCard.vue
├── views/
│   ├── HomeView.vue
│   ├── TodoView.vue
│   ├── ProjectView.vue
│   └── UserView.vue
├── composables/
│   └── useError.ts
├── App.vue
└── main.ts
```

---

## 3. 共通コンポーネント詳細

- [detail-design-frontend-common.md](./detail-design-frontend-common.md) を参照

**コンポーネント一覧**:
- LoadingSpinner.vue - ローディング表示
- ErrorMessage.vue - エラーメッセージ表示
- NavCard.vue - ナビゲーションカード

---

## 4. ToDoコンポーネント詳細

- [detail-design-frontend-features.md](./detail-design-frontend-features.md#4-todoコンポーネント詳細) を参照

**コンポーネント一覧**:
- TodoForm.vue - ToDo追加フォーム
- TodoItem.vue - ToDo表示・操作
- TodoList.vue - ToDoリスト
- TodoStats.vue - 統計表示
- TodoFilter.vue - フィルタボタン

---

## 5. Projectコンポーネント詳細

- [detail-design-frontend-features.md](./detail-design-frontend-features.md#5-projectコンポーネント詳細) を参照

**コンポーネント一覧**:
- ProjectForm.vue - 案件追加フォーム
- ProjectCard.vue - 案件カード

---

## 6. Userコンポーネント詳細

- [detail-design-frontend-features.md](./detail-design-frontend-features.md#6-userコンポーネント詳細) を参照

**コンポーネント一覧**:
- UserForm.vue - ユーザー追加フォーム
- UserCard.vue - ユーザーカード

---

## 7. ページコンポーネント詳細

- [detail-design-frontend-pages.md](./detail-design-frontend-pages.md) を参照

**コンポーネント一覧**:
- HomeView.vue - トップページ
- TodoView.vue - ToDo管理画面
- ProjectView.vue - 案件管理画面
- UserView.vue - 担当者管理画面

---

## 8. Composables詳細

- [detail-design-frontend-common.md](./detail-design-frontend-common.md#8-composables詳細) を参照

**Composables一覧**:
- useError.ts - エラー表示管理

---

## 9. エントリーポイント

- [detail-design-frontend-common.md](./detail-design-frontend-common.md#9-エントリーポイント) を参照

**ファイル**:
- main.ts - アプリケーションエントリーポイント
- App.vue - ルートコンポーネント

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
| 1.1 | 2025-12-25 | ファイル分割（3ファイル構成に変更） | システム管理者 |
