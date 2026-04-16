# ビルド / ツールチェーン整合ガイド

この文書は Vue core ではなく、`Vite`, `@vitejs/plugin-vue`, `vue-tsc`, `TypeScript`, `eslint-plugin-vue`, `Vue DevTools`, `Node.js` の整合を確認するための資料です。

## 早見表

| 対象 | Vue 3.3 目安 | Vue 3.4 目安 | Vue 3.5 目安 | 根拠 |
| --- | --- | --- | --- | --- |
| Vite | `^4.3.5` | `5.x` | `5.x` 維持推奨 / `6.x` は別理由がある時 | 3.3 ブログ, 3.4 ブログ, Vite 5/6 公式 |
| `@vitejs/plugin-vue` | `^4.2.0` | `^5.0.0` | `5.x` 推奨 | 3.3 ブログ, 3.4 ブログ |
| `vue-tsc` / Volar / `@vue/language-tools` | `^1.6.4` | `^1.8.27` | `2.1+` 推奨 | 3.3 ブログ, 3.4 ブログ, TS docs |
| TypeScript | `4.1+` 基本線 | 既存要件に従う | `useTemplateRef` 活用時は最新安定推奨 | Vue 3.2 changelog, TS docs |
| `eslint-plugin-vue` | `9.x` 推奨 | `9.x` 推奨 | `9.31+` 推奨 | eslint-plugin-vue ルール docs |
| Node.js | Vite 4 に合わせ `14.18+ / 16+` | Vite 5 に合わせ `18+ / 20+` | Vite 5/6 に合わせ `18/20/22+` | Vite 4 docs, Vite 5/6 blog |

## Vite と `@vitejs/plugin-vue`

### Vue 3.3 系

- Vue 3.3 公式ブログは、依存更新として以下を推奨
  - `vite@^4.3.5`
  - `@vitejs/plugin-vue@^4.2.0`
  - `volar / vue-tsc@^1.6.4`
- 参照: https://blog.vuejs.org/posts/vue-3-3

### Vue 3.4 系

- Vue 3.4 公式ブログは、依存更新として以下を推奨
  - `Volar / vue-tsc@^1.8.27`
  - `@vitejs/plugin-vue@^5.0.0`
  - `vue-loader@^17.4.0`
- 参照: https://blog.vuejs.org/posts/vue-3-4

### Vue 3.5 系

- Vue 3.5 公式ブログには `Vite 6 必須` という記述はない
- 保守的には `Vite 5 + plugin-vue 5.x` のまま core を `3.5.13` に上げる方が切り分けしやすい
- `vite-plugin-vue-devtools` を使うなら `Vue DevTools requires Vite v6 or higher`
- 参照:
  - https://blog.vuejs.org/posts/vue-3-5
  - https://devtools.vuejs.org/guide/vite-plugin

## TypeScript / `vue-tsc`

### 3.2 からの基礎条件

- Vue 3.2 changelog では typings が `Template Literal Types` を使うため `TS >= 4.1`
- 参照: https://github.com/vuejs/core/blob/main/changelogs/CHANGELOG-3.2.md

### 3.3 / 3.4 / 3.5 で見るべき点

- `3.3`: imported types / generics / `defineSlots()` まわりの型解決が大きく改善
- `3.4`: `vue-tsc@^1.8.27` が公式推奨
- `3.5`: `@vue/language-tools 2.1` で `useTemplateRef()` の型自動推論が有効
- 参照:
  - https://blog.vuejs.org/posts/vue-3-3
  - https://blog.vuejs.org/posts/vue-3-4
  - https://vuejs.org/guide/typescript/composition-api.html

### 実務メモ

- `useTemplateRef()` 導入時も `null` 可能性は消えない
- strict mode では `?.` か type guard を前提にする
- 参照:
  - https://vuejs.org/api/composition-api-helpers.html
  - https://vuejs.org/guide/typescript/composition-api.html

## ESLint

### 推奨方針

- 少なくとも `eslint-plugin-vue 9.x` に揃える
- `defineOptions` を lint 対象にしたいなら `v9.13.0+`
- `useTemplateRef()` への寄せを支援したいなら `v9.31.0+`

### 公式根拠

- `vue/valid-define-options` は `eslint-plugin-vue v9.13.0` で導入
- `vue/prefer-use-template-ref` は `eslint-plugin-vue v9.31.0` で導入
- 参照:
  - https://eslint.vuejs.org/rules/valid-define-options.html
  - https://eslint.vuejs.org/rules/prefer-use-template-ref.html

## Vue DevTools

### 何を使うべきか

- ブラウザ拡張としては、Vue 3 プロジェクトなら `v7` 系を前提に見る
- 公式 migration guide では `v7 version of devtools only supports Vue3`
- Pinia v3 移行 docs でも `devtools API has been upgraded to v7`

### 注意点

- Vite plugin 版の DevTools は `Vite v6 or higher` が必要
- つまり、Vue 3.5 へ上げるだけなら DevTools plugin 採用を後回しにしてもよい
- 参照:
  - https://devtools.vuejs.org/guide/migration
  - https://devtools.vuejs.org/guide/vite-plugin
  - https://pinia.vuejs.org/cookbook/migration-v2-v3.html

## Node.js

### Vite 4 系

- Vite 4 docs: `Node.js version 14.18+, 16+`
- Vue 3.3 で Vite 4.3.5 を使うなら、まずここを満たす
- 参照: https://v4.vite.dev/guide/

### Vite 5 系

- Vite 5 blog: `Node.js 18 / 20+ is now required`
- Vue 3.4 以降で Vite 5 に寄せるならここが基準
- 参照: https://vite.dev/blog/announcing-vite5

### Vite 6 系

- Vite 6 blog: `Node.js 18, 20, and 22+`
- `vite-plugin-vue-devtools` 導入時の副作用として Node 要件も上がる
- 参照: https://vite.dev/blog/announcing-vite6

## 実行前の確認コマンド

```sh
npm ls vue vite @vitejs/plugin-vue vue-tsc typescript eslint eslint-plugin-vue
node -v
```

```sh
rg -n "jsxImportSource|useTemplateRef|defineOptions|defineModel|reactivityTransform" src tsconfig*.json vite.config.* eslint.config.* .eslintrc*
```

## 推奨アップグレード順

1. Node.js を Vite 要件に合わせる
2. `vite`, `@vitejs/plugin-vue`, `vue-tsc`, `typescript` を揃える
3. `eslint-plugin-vue` を揃える
4. Vue core を `3.5.13` へ上げる
5. 必要なら Vue DevTools plugin や Pinia v3 を別タスクで進める

## [要検証] メモ

- `Vue 3.5` そのものが `plugin-vue 6` を要求するわけではない
- ただし、周辺ツールや社内テンプレートが `Vite 6` 前提に寄っている場合は別途判断が必要
