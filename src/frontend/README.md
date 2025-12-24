# Frontend

Vue.js 3 フロントエンドアプリケーション。

## 概要

| 項目 | 内容 |
|------|------|
| フレームワーク | Vue.js 3 (Composition API) |
| 状態管理 | Pinia |
| ルーティング | Vue Router 4 |
| ビルドツール | Vite |
| テスト | Vitest |

## ディレクトリ構成

```
frontend/
├── public/          # 静的ファイル
├── src/
│   ├── assets/      # 画像・スタイル
│   ├── components/  # Vueコンポーネント
│   ├── composables/ # Composition API関数
│   ├── router/      # Vue Router設定
│   ├── services/    # APIサービス
│   ├── stores/      # Piniaストア
│   ├── types/       # TypeScript型定義
│   └── views/       # ページコンポーネント
├── package.json
└── vite.config.ts
```

## コマンド

```bash
npm install      # 依存関係インストール
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm test         # テスト実行
```

## 関連ドキュメント

- [画面一覧](../../docs/specs/screens/index.md)
- [アーキテクチャ仕様](../../docs/specs/architecture.md)
