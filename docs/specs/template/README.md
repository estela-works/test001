# フロントエンド仕様書テンプレート

Vue.jsフロントエンドのアプリケーション仕様書を作成するためのテンプレート集。

## 目的

アプリケーション全体のVue.js関連情報を一元管理し、最新の実装状態を反映した仕様書を維持する。

## テンプレート一覧

| テンプレート | 内容 | 詳細レベル |
|------------|------|-----------|
| [frontend-overview-template.md](frontend-overview-template.md) | フロントエンド全体概要 | 概要 |
| [component-catalog-template.md](component-catalog-template.md) | コンポーネントカタログ | 標準（Props/Emits含む） |
| [store-catalog-template.md](store-catalog-template.md) | ストアカタログ | 標準（State/Getters/Actions） |
| [type-catalog-template.md](type-catalog-template.md) | 型定義カタログ | 標準（型定義コード含む） |
| [routing-spec-template.md](routing-spec-template.md) | ルーティング仕様 | 標準 |

## 使い方

### 新規プロジェクトの場合

1. `docs/specs/frontend/` フォルダを作成
2. 各テンプレートをコピー（`-template` を除いたファイル名で保存）
3. プレースホルダー（`<!-- -->` 内）を実際の値に置き換え

### 既存プロジェクトの更新

1. 該当するカタログファイルを開く
2. 新規追加・変更された要素を追記
3. 基本情報（更新日、件数）を更新
4. 改版履歴に変更内容を記録

## テンプレート間の関係

```
frontend-overview.md（全体概要）
    │
    ├── component-catalog.md（コンポーネント詳細）
    ├── store-catalog.md（ストア詳細）
    ├── type-catalog.md（型定義詳細）
    └── routing-spec.md（ルーティング詳細）
```

## 詳細レベルの説明

| レベル | 内容 |
|--------|------|
| 概要 | ファイル名・用途・件数のみ |
| 標準 | Props/Emits/State/型定義を含む実装情報 |
| 詳細 | コード例・利用パターン・設計意図まで含む |

## 関連ドキュメント

- [案件単位テンプレート](../../projects/template/) - 案件スコープの設計書
- [画面仕様](../screens/) - 各画面の詳細仕様
- [API仕様](../api/) - バックエンドAPI仕様

## 更新タイミング

| イベント | 更新対象 |
|---------|---------|
| 新規コンポーネント追加 | component-catalog, frontend-overview |
| 新規ストア追加 | store-catalog, frontend-overview |
| 新規型定義追加 | type-catalog |
| 新規ルート追加 | routing-spec, frontend-overview |
| ライブラリバージョン更新 | frontend-overview |
