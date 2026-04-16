# 主要依存ライブラリ互換マトリクス

この表は、`Vue 3.2 -> 3.5` の移行で安全側に倒した推奨ラインをまとめたものです。UI ライブラリは「Vue minor ごとの厳密な最小 patch」を公式が公開していないケースが多いため、原則は `同時 major 変更を避ける` 方針です。厳密な peerDependencies は導入前に各ライブラリの `package.json` でも確認してください。

## 推奨マトリクス

| ライブラリ | Vue 3.2 系 | Vue 3.3 系 | Vue 3.4 系 | Vue 3.5 系 | 補足 |
| --- | --- | --- | --- | --- | --- |
| Vue Router | `4.x` | `4.x` | `4.x` | `4.x` | 公式ルータは `4.x` 系。core upgrade とは分離しやすい |
| Pinia | `2.x` | `2.x` | `2.x` | `2.x` 優先 | `3.x` は Vue 3 専用かつ TS 5+ 前提。core upgrade と同時に上げない方が安全 |
| Vuex | `4.x` | `4.x` | `4.x` | `4.x` | 新規採用より維持運用前提。Pinia への将来移行は別計画で扱う |
| `@vue/test-utils` | `2.x` | `2.x` | `2.x` | `2.x` | Vue 3 向けは `2.x` 系 |
| Vuetify | `3.x` | `3.x` | `3.x` | `3.x` | Vuetify 2 は EOL。Vue 3 系では 3 系へ揃える |
| Element Plus | `2.x` | `2.x` | `2.x` | `2.x` | Vue 3 前提の UI ライブラリ |
| PrimeVue | `3.x` 維持推奨 | `3.x` 維持推奨 | `3.x` または `4.x` [要検証] | `3.x` または `4.x` [要検証] | Vue core と UI major を同時に上げない方が安全 |

## ライブラリ別メモ

### Vue Router 4.x

- 公式ルータは `4.x`
- `Vue 3.2 -> 3.5` の core upgrade では、通常は Router major を変えずに進める
- 参照: https://router.vuejs.org/

### Pinia

- 現行 docs のトップは `v3.x` だが、移行観点では `2.x` 維持が安全
- `Pinia v3` は `Only Vue 3 is supported`、かつ `TypeScript 5 or newer is required`
- Vue core と Pinia major を同時に上げると切り分けが難しい
- 参照:
  - https://pinia.vuejs.org/introduction.html
  - https://pinia.vuejs.org/cookbook/migration-v2-v3.html

### Vuex 4

- `Vuex 4` は Vue 3 向けの既存選択肢
- 既存プロジェクトでは `Vuex 4` のまま core を先に上げる方が安全
- Pinia 移行は別案件として扱う
- 参照: https://vuex.vuejs.org/

### `@vue/test-utils` 2.x

- Vue 3 系のテストユーティリティは `2.x`
- Vue core と一緒に patch/minor を追従するのはよいが、major を跨ぐ必要は通常ない
- 参照: https://test-utils.vuejs.org/guide/

### Vuetify

- Vuetify 2 は EOL。Vue 3 系では `Vuetify 3`
- Vue 2 / Vuetify 2 を残しているプロジェクトは、Vue core upgrade と同時に UI 移行計画が必要
- 参照: https://v2.vuetifyjs.com/en/about/eol/

### Element Plus

- 公式インストール例が Vue 3 を前提としている
- 少なくとも Vue 3 minor upgrade の範囲では `2.x` 維持が安全
- 参照:
  - https://element-plus.org/en-US/guide/installation
  - https://element-plus.org/en-US/guide/migration

### PrimeVue

- `PrimeVue 3.x` も `4.x` も Vue 3 ベース
- ただし UI ライブラリの major change は見た目・テーマ・スタイル層の影響が大きい
- Vue core を `3.2 -> 3.5` に上げる作業と、PrimeVue `3 -> 4` は分ける方が事故率が低い
- 参照:
  - https://v3.primevue.org/vite
  - https://primevue.org/setup

## 実務ルール

1. 先に Vue core と build toolchain を揃える
2. 次に Router / Store / Test Utils の minor 追従を行う
3. UI ライブラリの major 変更は最後に別コミットで行う

## 最低限の確認コマンド

```sh
npm ls vue vue-router pinia vuex @vue/test-utils vuetify element-plus primevue
```

```sh
pnpm why vue
pnpm why @vitejs/plugin-vue
```

## [要検証] メモ

- PrimeVue の `3.x / 4.x` 境界は、Vue minor よりテーマ層と自プロジェクトの導入方式の影響が大きい
- Vuetify / Element Plus / PrimeVue の「Vue 3.2, 3.3, 3.4, 3.5 ごとの最小 patch」は公式に統一表がないため、採用時は lockfile 解決結果を確認する
