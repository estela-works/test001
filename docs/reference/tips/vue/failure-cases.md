# 失敗事例集

以下は `Vue 3.2 -> 3.5` 周辺アップグレードで参考になる実例です。再現条件は各記事・Issue の文脈に依存するため、そのまま断定せず「自プロジェクトへの該当可能性」で見るのが安全です。

---

## 事例1

- 事例タイトル: `3.4.14` では出ないのに `3.4.21` で `Maximum recursive updates exceeded`
- 発生バージョン: `Vue 3.4.14 -> 3.4.21`
- 症状: 地図描画系の画面で `Maximum recursive updates exceeded` が発生
- 原因: reactive effect が自身の依存を更新する構造が、3.4.21 ではより表面化したケース
- 対策: 再現 repo を作って watcher / computed / 外部ライブラリ連携を切り分ける。Vue 本体より先に OpenLayers など連携層を疑う
- 出典(URL): https://github.com/vuejs/core/issues/10510
- 自プロジェクトへの該当可能性: 高

## 事例2

- 事例タイトル: `vue-loader` で SFC バンドル時に `@vitejs/plugin-vue requires vue...` と誤誘導される
- 発生バージョン: `Vue 3.3.4`, `vue-loader 17.2.2`, `webpack 5`
- 症状: SFC バンドル時に Vite プラグイン絡みのようなエラーメッセージが出る
- 原因: 実際は古い `Node.js 12.22.9` が `compiler-sfc` 内の構文を解釈できず失敗
- 対策: Vue 依存ではなく Node.js を先に更新する。特に手組み webpack 環境は Node 要件確認を先にやる
- 出典(URL): https://qiita.com/tomomoss/items/4fe67c019312d223829c
- 自プロジェクトへの該当可能性: 中

## 事例3

- 事例タイトル: `vite-plugin-checker` と `vuejs/language-tools 2.0.29-2.1.2` の不整合
- 発生バージョン: `@vue/language-tools 2.0.29 - 2.1.2`
- 症状: `pluginContext.vueCompilerOptions.plugins is not iterable` で開発サーバや型チェックが失敗
- 原因: `vite-plugin-checker` 側との upstream incompatibility
- 対策: `vue-tsc` / `@vue/language-tools` / `vite-plugin-checker` をセットで確認し、既知不整合バージョンを避ける
- 出典(URL): https://github.com/vuejs/language-tools/issues/4755
- 自プロジェクトへの該当可能性: 高

## 事例4

- 事例タイトル: `useTemplateRef()` の配列 refs は deep watch できると思っていた
- 発生バージョン: `Vue 3.5`
- 症状: `v-for` で取得した template refs 配列を watch しても期待通りに追従しない
- 原因: `useTemplateRef()` は `ShallowRef` を返す。配列 refs を fully reactive な配列として扱えない
- 対策: 配列 refs を本当に監視したい場合は従来の `ref([])` + function ref で明示管理する
- 出典(URL): https://stackoverflow.com/questions/79031309/usetemplateref-is-not-reactive-for-arrays
- 自プロジェクトへの該当可能性: 中

## 事例5

- 事例タイトル: `useTemplateRef()` 導入後に TypeScript が `possibly null` を出す
- 発生バージョン: `Vue 3.5 + TypeScript`
- 症状: `audioPlayer.value.pause()` のようなコードに `value is possibly null`
- 原因: `useTemplateRef()` でも mount 前や unmount 後は `null` になり得るため、strict mode では警告が正しい
- 対策: `?.`、type guard、`onMounted` の中での利用を徹底する
- 出典(URL): https://stackoverflow.com/questions/79294748/vue-3-5-typescriptt-is-possibly-null-error-on-usetemplateref
- 自プロジェクトへの該当可能性: 高

## 事例6

- 事例タイトル: Reactivity Transform のつもりで props destructure を使っていたら 3.4 以降で設計前提が変わった
- 発生バージョン: `3.3 -> 3.4 -> 3.5`
- 症状: `$ref` 系を使っていたコードが core では維持できず、props destructure だけが別機能として残る
- 原因: Reactivity Transform 廃止後、`Reactive Props Destructure` が独立機能として 3.5 で安定化
- 対策: `$ref` 系構文と props destructure を分離して考える。継続利用が必要なら Vue Macros を検討
- 出典(URL): https://zenn.dev/comm_vue_nuxt/articles/reactive-props-destructure
- 自プロジェクトへの該当可能性: 中

---

## 使い方

- GitHub Issue は「既知の再現条件と議論」を掴むために使う
- Stack Overflow は「現場でのハマり方」を掴むために使う
- Zenn / Qiita は「日本語での整理」と「導入時の見落とし」を補うために使う

## この文書から分かる傾向

- core 自体の breaking change より、`toolchain` と `型周辺` の不整合で止まりやすい
- `3.4` では削除 API、`3.5` では新 API の誤用がハマりどころ
- `useTemplateRef()` は便利だが、従来の `ref(null)` を全面廃止できるわけではない
