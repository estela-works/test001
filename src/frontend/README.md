# Frontend

Vue.js 3 フロントエンドアプリケーションです。

## 概要

| 項目 | 内容 |
|------|------|
| フレームワーク | Vue.js 3 (Composition API) |
| 状態管理 | Pinia |
| ルーティング | Vue Router 4 |
| ビルドツール | Vite |
| テスト | Vitest |

## 起動方法

**前提**: バックエンド（Spring Boot）が起動している必要があります。

```bash
# 1. バックエンドを起動（プロジェクトルートで実行）
.\mvnw.cmd spring-boot:run

# 2. 別のターミナルでフロントエンドを起動
cd src/frontend
npm install    # 初回のみ
npm run dev
```

### アクセス

| URL | 説明 |
|-----|------|
| http://localhost:5173 | フロントエンド（メインのアクセス先） |
| http://localhost:8080/api/* | バックエンドAPI（Viteがプロキシ） |

### APIプロキシ設定

`vite.config.ts`で`/api`へのリクエストはバックエンド（localhost:8080）に自動転送されます。

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

| コマンド | 説明 |
|---------|------|
| `npm install` | 依存関係インストール |
| `npm run dev` | 開発サーバー起動（ポート5173） |
| `npm run build` | 本番ビルド |
| `npm test` | テスト実行（ウォッチモード） |
| `npm run test:run` | テスト実行（1回のみ） |
| `npm run lint` | ESLintによるコードチェック |
| `npm run format` | Prettierによるコード整形 |

## 関連ドキュメント

- [画面一覧](../../docs/specs/screens/index.md)
- [アーキテクチャ仕様](../../docs/specs/architecture.md)
