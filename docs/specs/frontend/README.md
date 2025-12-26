# フロントエンド仕様書

Vue.jsフロントエンドのアプリケーション仕様書。

## 概要

| 項目 | 内容 |
|------|------|
| フレームワーク | Vue.js 3.4.x (Composition API) |
| 状態管理 | Pinia |
| ルーティング | Vue Router 4.x |
| 言語 | TypeScript |
| ビルドツール | Vite |
| 最終更新日 | 2025-12-26 |

## ドキュメント一覧

| ドキュメント | 内容 | 詳細レベル |
|------------|------|-----------|
| [frontend-overview.md](frontend-overview.md) | フロントエンド全体概要 | 概要 |
| [component-catalog.md](component-catalog.md) | コンポーネントカタログ（24件） | 標準（Props/Emits含む） |
| [store-catalog.md](store-catalog.md) | ストアカタログ（4件） | 標準（State/Getters/Actions） |
| [type-catalog.md](type-catalog.md) | 型定義カタログ（7ファイル） | 標準（型定義コード含む） |
| [routing-spec.md](routing-spec.md) | ルーティング仕様（6ルート） | 標準 |

## ドキュメント間の関係

```
frontend-overview.md（全体概要）
    │
    ├── component-catalog.md（コンポーネント詳細）
    ├── store-catalog.md（ストア詳細）
    ├── type-catalog.md（型定義詳細）
    └── routing-spec.md（ルーティング詳細）
```

## 関連ドキュメント

- [画面仕様](../screens/) - 各画面の詳細仕様
- [API仕様](../api/) - バックエンドAPI仕様
- [仕様書テンプレート](../template/) - フロントエンド仕様書テンプレート

## 更新タイミング

| イベント | 更新対象 |
|---------|---------|
| 新規コンポーネント追加 | component-catalog, frontend-overview |
| 新規ストア追加 | store-catalog, frontend-overview |
| 新規型定義追加 | type-catalog |
| 新規ルート追加 | routing-spec, frontend-overview |
| ライブラリバージョン更新 | frontend-overview |
