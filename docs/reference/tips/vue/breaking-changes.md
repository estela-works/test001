# Breaking Changes / 非推奨 / 削除一覧

この文書は、`Vue 3.2.45 -> 3.5.13` アップグレード時に事故要因になりやすい変更を、`3.3`, `3.4`, `3.5` の順で整理したものです。`defineModel` 安定化や `v-bind` 同名短縮のような「非破壊だが移行判断に影響する項目」も含めています。

## 3.3 系

| 項目 | 影響度 | 概要 | 実務上の確認ポイント | 参照 |
| --- | --- | --- | --- | --- |
| Reactivity Transform の非推奨化 | 高 | 3.3 時点で実験的機能として後退し、3.4 で削除される前提になった | `$ref`, `$computed`, `vue/macros`, `reactivityTransform` 設定があるか検索する | 公式: https://blog.vuejs.org/posts/vue-3-3 / 補足: https://vuejs.org/guide/extras/reactivity-transform.html / GitHub: https://github.com/vuejs/rfcs/discussions/502 |
| `defineModel` はまだ experimental | 中 | 3.3 の `defineModel` は便利だが、3.4 で安定化するまで仕様固定前 | 3.3 時点で使っている場合、3.4 で API 前提を再確認する | 公式: https://blog.vuejs.org/posts/vue-3-3 / GitHub: https://github.com/vuejs/rfcs/discussions/503 |
| TSX の `jsxImportSource` 事前対応 | 中 | 3.3 ブログ時点で、3.4 では global JSX namespace を外す予定と明言 | TSX 利用プロジェクトは `tsconfig.json` に `jsxImportSource: "vue"` を入れる準備をする | 公式: https://blog.vuejs.org/posts/vue-3-3 / 公式 API: https://vuejs.org/api/sfc-script-setup.html |
| imported / complex types 対応により `defineProps` 周辺の型解決経路が変わる | 低 | `defineProps<T>()` が import 型を解決するようになり、TS / tsconfig 解決の影響を受けやすくなる | `paths`, `baseUrl`, 型解決の暗黙依存がないか確認する | 公式: https://blog.vuejs.org/posts/vue-3-3 / GitHub PR: https://github.com/vuejs/core/pull/8083 |

## 3.4 系

| 項目 | 影響度 | 概要 | 実務上の確認ポイント | 参照 |
| --- | --- | --- | --- | --- |
| Global JSX Namespace の削除 | 高 | `Vue 3.4` から global `JSX` namespace を既定登録しない | TSX で `JSX.Element` などを直接使っていないか確認し、`jsxImportSource: "vue"` または `vue/jsx` を明示する | 公式: https://blog.vuejs.org/posts/vue-3-4 / 参考 docs: https://vuejs.org/api/sfc-script-setup.html |
| Reactivity Transform の削除 | 高 | experimental 機能のため minor で削除。`@vitejs/plugin-vue` 5+ でも core では使えない | `$ref` 系構文、`reactivityTransform: true`、`script.refSugar` 前提を除去する。継続利用は Vue Macros に寄せる | 公式: https://blog.vuejs.org/posts/vue-3-4 / 公式 docs: https://vuejs.org/guide/extras/reactivity-transform.html / GitHub: https://github.com/vuejs/rfcs/discussions/502 |
| `app.config.unwrapInjectedRef` の削除 | 中 | 3.3 で既定化された挙動を 3.4 で固定化し、無効化できなくなった | provide/inject で ref unwrap の挙動切替に依存していないか確認する | 公式: https://blog.vuejs.org/posts/vue-3-4 |
| `@vnodeXXX` リスナーが compiler error に昇格 | 中 | 警告ではなくビルドエラーになる | `@vnodeMounted`, `@vnodeUpdated` などを `@vue:mounted` 系へ置換する | 公式: https://blog.vuejs.org/posts/vue-3-4 |
| `v-is` の削除 | 中 | 3.3 で非推奨、3.4 で削除 | `v-is` を `is="vue:..."` に置換する | 公式: https://blog.vuejs.org/posts/vue-3-4 |

### 3.4 の非破壊だが確認価値が高い項目

| 項目 | 影響度 | 何が変わるか | 実務上の見方 | 参照 |
| --- | --- | --- | --- | --- |
| `defineModel` 安定化 | 低 | experimental から stable へ移行。`v-model` 修飾子対応も強化 | 旧来の `props + emits` を段階的に置換する候補 | 公式: https://blog.vuejs.org/posts/vue-3-4 / 公式 docs: https://vuejs.org/guide/components/v-model.html / GitHub: https://github.com/vuejs/rfcs/discussions/503 |
| `v-bind` 同名短縮 | 低 | `:id="id"` を `:id` に短縮できる | ESLint / formatter / レビュー基準の整備が必要 | 公式: https://blog.vuejs.org/posts/vue-3-4 / GitHub PR: https://github.com/vuejs/core/pull/9451 |
| reactivity system 最適化 | 低 | computed と sync effect の発火条件がより厳密になる | 監視回数に暗黙依存したテストがある場合は見直す | 公式: https://blog.vuejs.org/posts/vue-3-4 / GitHub PR: https://github.com/vuejs/core/pull/5912 |

## 3.5 系

`Vue 3.5` は公式ブログで「breaking change なし」と明言されています。ただし、既存コードの書き方や型の出方に影響しやすい項目はあります。

| 項目 | 影響度 | 概要 | 実務上の確認ポイント | 参照 |
| --- | --- | --- | --- | --- |
| 公式 breaking change はなし | 低 | core 3.5 リリース自体は互換性維持が前提 | 依存ライブラリやツール側の追従不足を警戒する | 公式: https://blog.vuejs.org/posts/vue-3-5 |
| Reactive Props Destructure の安定化と既定有効化 | 中 | `defineProps()` の分割代入が reactive になり、デフォルト値定義も簡潔になる | `watch(count)` のような直接監視は compile-time error になるので `watch(() => count)` へ寄せる | 公式: https://blog.vuejs.org/posts/vue-3-5 / GitHub RFC: https://github.com/vuejs/rfcs/discussions/502 |
| `useTemplateRef()` の導入 | 低 | 従来の `ref(null)` パターンを置き換え可能 | `useTemplateRef()` は `ShallowRef` を返すため、配列 refs を deep watch したい用途では不向き | 公式: https://blog.vuejs.org/posts/vue-3-5 / 公式 docs: https://vuejs.org/api/composition-api-helpers.html / Community: https://stackoverflow.com/questions/79031309/usetemplateref-is-not-reactive-for-arrays |
| Deferred Teleport | 低 | `defer` で target 解決を後ろ倒しできる | 同一 mount / update tick 内に target が描画される必要がある | 公式: https://blog.vuejs.org/posts/vue-3-5 / 公式 docs: https://vuejs.org/guide/built-ins/teleport.html / GitHub PR: https://github.com/vuejs/core/pull/11387 |

## 先に潰すべき検索パターン

```sh
rg -n "\$ref|\$computed|\$shallowRef|reactivityTransform|script\\.refSugar" src
rg -n "@vnode|v-is=|JSX\\.Element|namespace JSX|jsxImportSource" src
rg -n "defineModel\\(|withDefaults\\(|defineProps<" src
```

## 判断メモ

- `Reactivity Transform` を使っているなら、Vue 本体アップグレード前に除去計画を立てた方が安全
- TSX を使っているなら、`3.4` 対応を先に終わらせないと型エラーの切り分けが難しい
- `3.5` は core よりも、`vue-tsc`, `@vue/language-tools`, `eslint-plugin-vue`, 周辺ライブラリの整合不足で詰まりやすい
