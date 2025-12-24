# インフラ基本設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本設計書の目的

Vue.js 3フロントエンド環境の構築に必要なインフラ設定・ツールセットアップ手順を定義する。

### 1.2 対象範囲

| 項目 | 内容 |
|------|------|
| Node.js環境 | Node.js 18以上のインストール確認 |
| パッケージ管理 | npm設定 |
| Viteプロジェクト | Vue 3 + TypeScript + Vite初期構築 |
| 開発ツール | ESLint, Prettier, Vitest設定 |
| 開発サーバー | Vite dev server + APIプロキシ設定 |
| ビルド | 本番ビルド設定 |

---

## 2. 必要環境

### 2.1 前提ソフトウェア

| ソフトウェア | バージョン | 用途 |
|-------------|-----------|------|
| Node.js | 18.x 以上 | JavaScript実行環境 |
| npm | 9.x 以上 | パッケージ管理（Node.js同梱） |
| Java | 17 | バックエンド（既存） |
| Maven | 3.x | バックエンドビルド（既存Wrapper使用） |

### 2.2 Node.jsインストール確認

```bash
# バージョン確認
node --version
# v18.x.x 以上であること

npm --version
# 9.x.x 以上であること
```

Node.jsがインストールされていない場合:
- Windows: https://nodejs.org/ からLTS版をダウンロード
- Mac: `brew install node`
- Linux: `apt install nodejs npm` または nvm使用

---

## 3. プロジェクト初期構築

### 3.1 Viteプロジェクト作成

```bash
# プロジェクトルートで実行
cd c:\Users\sezak\OneDrive\Documents\vscode\work\test001

# src/frontendディレクトリにVueプロジェクトを作成
npm create vite@latest src/frontend -- --template vue-ts
```

### 3.2 依存パッケージインストール

```bash
cd src/frontend
npm install
```

### 3.3 追加パッケージインストール

| パッケージ | 用途 | コマンド |
|-----------|------|---------|
| Vue Router | ルーティング | `npm install vue-router@4` |
| Pinia | 状態管理 | `npm install pinia` |
| Vitest | テストフレームワーク | `npm install -D vitest` |
| Vue Test Utils | コンポーネントテスト | `npm install -D @vue/test-utils` |
| jsdom | DOM環境 | `npm install -D jsdom` |
| ESLint | Linter | `npm install -D eslint` |
| eslint-plugin-vue | Vue用ESLint | `npm install -D eslint-plugin-vue` |
| Prettier | Formatter | `npm install -D prettier` |
| @types/node | Node.js型定義 | `npm install -D @types/node` |

一括インストールコマンド:

```bash
# 本番依存
npm install vue-router@4 pinia

# 開発依存
npm install -D vitest @vue/test-utils jsdom eslint eslint-plugin-vue prettier @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 4. 設定ファイル

### 4.1 package.json（scripts追加）

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src --ext .vue,.ts,.tsx --fix",
    "format": "prettier --write src/"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-vue": "^4.5.0",
    "@vue/test-utils": "^2.4.0",
    "eslint": "^8.56.0",
    "eslint-plugin-vue": "^9.20.0",
    "jsdom": "^23.0.0",
    "prettier": "^3.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.2.0",
    "vue-tsc": "^1.8.0"
  }
}
```

### 4.2 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../backend/main/resources/static',
    emptyOutDir: true
  }
})
```

**ポイント**:
- `@`エイリアスで`src/`ディレクトリへのパス解決
- `/api`リクエストをSpring Boot（8080）にプロキシ
- ビルド成果物をSpring Bootのstaticディレクトリに出力

### 4.3 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4.4 tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 4.5 vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.d.ts', 'src/main.ts']
    }
  }
})
```

### 4.6 .eslintrc.cjs

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
}
```

### 4.7 .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "vueIndentScriptAndStyle": true
}
```

### 4.8 .gitignore（フロントエンド用追記）

```gitignore
# Node
node_modules/
dist/

# Vite
*.local

# Editor
.vscode/*
!.vscode/extensions.json
.idea/

# Testing
coverage/

# Logs
*.log
npm-debug.log*
```

---

## 5. ディレクトリ構成

### 5.1 初期構成

```
src/frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/           # 静的アセット（CSS、画像）
│   ├── components/       # 共通コンポーネント
│   ├── views/            # ページコンポーネント
│   ├── stores/           # Piniaストア
│   ├── composables/      # 共通ロジック
│   ├── services/         # API呼び出し
│   ├── types/            # TypeScript型定義
│   ├── router/           # ルーター設定
│   ├── App.vue           # ルートコンポーネント
│   └── main.ts           # エントリーポイント
├── index.html            # HTMLテンプレート
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .eslintrc.cjs
├── .prettierrc
└── .gitignore
```

---

## 6. 開発サーバー起動

### 6.1 フロントエンド開発サーバー

```bash
cd src/frontend
npm run dev
```

- URL: http://localhost:5173
- ホットリロード有効
- `/api/*` は http://localhost:8080 にプロキシ

### 6.2 バックエンドサーバー

```bash
# プロジェクトルートで
mvnw.cmd spring-boot:run
```

- URL: http://localhost:8080
- API: http://localhost:8080/api/*

### 6.3 同時起動

開発時は2つのターミナルで両方のサーバーを起動する。

| ターミナル | コマンド | URL |
|-----------|---------|-----|
| 1 | `mvnw.cmd spring-boot:run` | http://localhost:8080 |
| 2 | `cd src/frontend && npm run dev` | http://localhost:5173 |

ブラウザでは http://localhost:5173 にアクセスする。

---

## 7. ビルド

### 7.1 本番ビルド

```bash
cd src/frontend
npm run build
```

ビルド成果物は `src/backend/main/resources/static` に出力される。

### 7.2 ビルド確認

```bash
npm run preview
```

ビルド成果物をローカルで確認できる。

### 7.3 Spring Bootでの配信確認

```bash
# フロントエンドビルド後
mvnw.cmd spring-boot:run
```

http://localhost:8080 でVueアプリが配信される。

---

## 8. テスト実行

### 8.1 Vitestテスト

```bash
cd src/frontend

# ウォッチモード（開発中）
npm run test

# 単発実行（CI用）
npm run test:run
```

### 8.2 Lint/Format

```bash
# ESLint実行
npm run lint

# Prettier実行
npm run format
```

---

## 9. VSCode推奨設定

### 9.1 推奨拡張機能

`.vscode/extensions.json`:

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

### 9.2 ワークスペース設定

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": ["javascript", "typescript", "vue"]
}
```

---

## 10. セットアップ手順まとめ

### 10.1 初回セットアップ

```bash
# 1. プロジェクトルートに移動
cd c:\Users\sezak\OneDrive\Documents\vscode\work\test001

# 2. Viteプロジェクト作成
npm create vite@latest src/frontend -- --template vue-ts

# 3. 依存パッケージインストール
cd src/frontend
npm install

# 4. 追加パッケージインストール
npm install vue-router@4 pinia
npm install -D vitest @vue/test-utils jsdom eslint eslint-plugin-vue prettier @types/node @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 5. 設定ファイル作成（vite.config.ts, .eslintrc.cjs, .prettierrc など）

# 6. 動作確認
npm run dev
```

### 10.2 日常の開発フロー

```bash
# ターミナル1: バックエンド起動
mvnw.cmd spring-boot:run

# ターミナル2: フロントエンド開発サーバー起動
cd src/frontend
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

### 10.3 リリース前

```bash
# テスト実行
cd src/frontend
npm run test:run

# Lint/Format
npm run lint
npm run format

# ビルド
npm run build

# 統合動作確認
cd ../..
mvnw.cmd spring-boot:run
# http://localhost:8080 で確認
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
