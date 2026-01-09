# 202512_Vue.js移行

フロントエンドをVanilla JavaScriptからVue.js 3に移行する案件。

## 概要

| 項目 | 内容 |
|------|------|
| 案件ID | 202512_Vue.js移行 |
| 開始日 | 2025-12-24 |
| ステータス | 完了 |

## 実施内容

- Vanilla JavaScript → Vue.js 3 (Composition API) への移行
- Pinia による状態管理の導入
- Vue Router 4 によるSPAルーティング
- Vite によるビルド環境構築
- TypeScript による型安全性の確保

## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [basic-design-frontend.md](basic-design-frontend.md) | フロントエンド基本設計書 |
| [basic-design-infrastructure.md](basic-design-infrastructure.md) | インフラ基本設計書 |
| [detail-design-frontend.md](detail-design-frontend.md) | フロントエンド詳細設計書（目次） |
| [detail-design-store.md](detail-design-store.md) | ストア詳細設計書（目次） |
| [detail-design-types.md](detail-design-types.md) | TypeScript型定義詳細設計書 |
| [detail-design-api-service.md](detail-design-api-service.md) | APIサービス詳細設計書 |
| [test-spec-frontend.md](test-spec-frontend.md) | フロントエンドテスト方針書 |

### 分割ドキュメント

**フロントエンド詳細設計書の分割ファイル**:
- [detail-design-frontend-common.md](detail-design-frontend-common.md) - 共通設計
- [detail-design-frontend-pages.md](detail-design-frontend-pages.md) - ページコンポーネント
- [detail-design-frontend-features.md](detail-design-frontend-features.md) - 機能コンポーネント

**ストア詳細設計書の分割ファイル**:
- [detail-design-store-todo.md](detail-design-store-todo.md) - todoStore
- [detail-design-store-project.md](detail-design-store-project.md) - projectStore
- [detail-design-store-user.md](detail-design-store-user.md) - userStore
- [detail-design-store-common.md](detail-design-store-common.md) - 使用例・エラーハンドリング

## 関連ドキュメント

- [アーキテクチャ仕様](../../specs/architecture.md)
- [画面一覧](../../specs/screens/index.md)
