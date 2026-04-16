# 主要依存ライブラリ互換マトリクス

この表は、`Vue 3.2 -> 3.5` の移行で安全側に倒した推奨ラインをまとめたものです。数値は `2026-04-16` 時点で公式 release / docs から確認できた版をベースにしています。UI ライブラリは「Vue minor ごとの厳密な最小 patch」を公式が公開していないケースが多いため、`現行の公式 stable 系` を推奨値として置き、最小必要版が断定できないものは `[要検証]` を付けています。

## 推奨マトリクス

| ライブラリ | Vue 3.2 系 | Vue 3.3 系 | Vue 3.4 系 | Vue 3.5 系 | 補足 |
| --- | --- | --- | --- | --- | --- |
| Vue Router | `4.6.4+ [要検証]` | `4.6.4+ [要検証]` | `4.6.4+ [要検証]` | `4.6.4+` | 公式 release で確認できる `4.x` 最新は `v4.6.4`。release には `5.x` 系もあるため、既存 Vue 3 系では `4.6.x` 維持が安全 |
| Pinia | `2.3.1+ [要検証]` | `2.3.1+ [要検証]` | `2.3.1+ [要検証]` | `2.3.1+` | `v2` 系の公式 release で確認できる最新は `v2.3.1`。`v3.0.4+` は `Vue 3 only` かつ `TypeScript 5+` 前提 |
| Vuex | `4.0.2` | `4.0.2` | `4.0.2` | `4.0.2` | 公式 release の最新は `v4.0.2`。新規採用より維持運用前提 |
| `@vue/test-utils` | `2.4.6+ [要検証]` | `2.4.6+ [要検証]` | `2.4.6+ [要検証]` | `2.4.6+` | 公式 release で確認できる `2.x` 最新は `v2.4.6` |
| Vuetify | `3.12.5+ [要検証]` | `3.12.5+ [要検証]` | `3.12.5+ [要検証]` | `3.12.5+ [要検証]` | 公式 release で確認できる `3.x` 最新は `v3.12.5`。Vue minor ごとの最小必要版は公式未表明 |
| Element Plus | `2.13.7+ [要検証]` | `2.13.7+ [要検証]` | `2.13.7+ [要検証]` | `2.13.7+ [要検証]` | 公式 release で確認できる `2.x` 最新は `2.13.7`。Vue minor ごとの最小必要版は公式未表明 |
| PrimeVue | `4.5.5+ [要検証]` | `4.5.5+ [要検証]` | `4.5.5+ [要検証]` | `4.5.5+ [要検証]` | 公式 release で確認できる現行最新は `PrimeVue 4.5.5`。`3.x` 継続採用は別途 lockfile 検証が必要 |

## ライブラリ別メモ

### Vue Router

- 公式 release で確認できる `4.x` 最新は `v4.6.4`
- `Vue 3.2 -> 3.5` の core upgrade では、通常は Router major を変えず `4.6.x` 系に寄せるのが安全
- `5.x` 系は存在するため、既存プロジェクトを据え置きで上げるなら `npm install vue-router@^4.6.4` のように major を固定する
- 参照:
  - https://router.vuejs.org/
  - https://github.com/vuejs/router/releases

### Pinia

- `v2` 系の公式 release で確認できる最新は `v2.3.1`
- `Pinia v3` は `Only Vue 3 is supported`、かつ `TypeScript 5 or newer is required`
- `Vue 3.2 -> 3.5` の core upgrade と同時に store major を動かしたくない場合は `2.3.1+` を推奨
- `TypeScript 5+` へ同時に寄せられるなら `3.0.4+` も選択肢だが、切り分け難易度は上がる
- 参照:
  - https://github.com/vuejs/pinia/releases
  - https://pinia.vuejs.org/introduction.html
  - https://pinia.vuejs.org/cookbook/migration-v2-v3.html

### Vuex 4

- 公式 release の最新は `v4.0.2`
- `Vuex 4` は Vue 3 対応の既存選択肢で、既存プロジェクトではそのまま core を先に上げる方が安全
- Pinia への移行は別案件として扱う
- 参照:
  - https://github.com/vuejs/vuex/releases
  - https://vuex.vuejs.org/

### `@vue/test-utils`

- 公式 release で確認できる `2.x` 最新は `v2.4.6`
- Vue 3 系のテストユーティリティは `2.x` で、core と一緒に patch/minor を追従するのはよいが major を跨ぐ必要は通常ない
- 参照:
  - https://github.com/vuejs/test-utils/releases
  - https://test-utils.vuejs.org/guide/

### Vuetify

- `Vuetify 2` は EOL。Vue 3 系では `Vuetify 3`
- 公式 release で確認できる `3.x` 最新は `v3.12.5`
- ただし Vue minor ごとの最小必要 patch は公式に表で出ていないため、`3.12.5+` は推奨値であり下限保証ではない [要検証]
- 参照:
  - https://github.com/vuetifyjs/vuetify/releases
  - https://v2.vuetifyjs.com/en/about/eol/

### Element Plus

- 公式インストール例は Vue 3 を前提としている
- 公式 release で確認できる `2.x` 最新は `2.13.7`
- Vue minor ごとの最小必要 patch は公式未表明のため、`2.13.7+` は推奨値として扱う [要検証]
- 参照:
  - https://github.com/element-plus/element-plus/releases
  - https://element-plus.org/en-US/guide/installation
  - https://element-plus.org/en-US/guide/migration

### PrimeVue

- 公式 release で確認できる現行最新は `PrimeVue 4.5.5`
- ただし UI ライブラリの major change は見た目・テーマ・スタイル層の影響が大きい
- 既存で `3.x` を使っている場合は、Vue core を `3.2 -> 3.5` に上げる作業と `PrimeVue 3 -> 4` を分ける方が安全 [要検証]
- 参照:
  - https://github.com/primefaces/primevue/releases
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

- Vue Router / Pinia / `@vue/test-utils` も、上表は「2026-04-16 時点の公式 release ベース推奨値」であり「各 Vue minor での最低必要版」そのものではない [要検証]
- Vuetify / Element Plus / PrimeVue の「Vue 3.2, 3.3, 3.4, 3.5 ごとの最小 patch」は公式に統一表がないため、採用時は lockfile 解決結果と peerDependencies を確認する
