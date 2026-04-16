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

- 事例タイトル: `eslint` / `eslint-plugin-vue` 更新で `npm install` が `ERESOLVE could not resolve` になる
- 発生バージョン: `vue 3.4.21`, `vuetify 3.5.13`, `@vitejs/plugin-vue 5.0.4`, `eslint 9.9.0`, `eslint-plugin-vue 9.24.0`, `@vue/eslint-config-typescript 13.0.0`, `vue-tsc 2.0.7`
- 症状: 依存一括更新後に `npm error ERESOLVE could not resolve` が発生し、`npm install` / `npm ci` が止まる
- 原因: `@vue/eslint-config-typescript 13.0.0` が `eslint@^8.56.0` を要求しており、`eslint@9.9.0` と依存解決が衝突
- 対策: `eslint`, `eslint-plugin-vue`, `@vue/eslint-config-typescript` を別々に上げず、peerDependencies を先に確認する。CI では lockfile 更新前に `npm ci` を先行実行して検知する
- 出典(URL): https://github.com/orgs/vuejs/discussions/11660
- 自プロジェクトへの該当可能性: 高

## 事例7

- 事例タイトル: `Vue 3.4.16` で `Element Plus 2.5.5` の描画系コンポーネントが表示されない
- 発生バージョン: `Vue 3.4.16`, `Element Plus 2.5.5`
- 症状: `el-select` のドロップダウンが表示されず、popup layer が `display: none` のままになる。`el-container`, `el-menu`, `el-scrollbar`, `el-overlay` なども影響
- 原因: `v-show` 周辺の `3.4.16` 回帰で、render function ベースのコンポーネント表示が崩れた
- 対策: `3.4.15` との差分確認を優先し、UI ライブラリ側の issue ではなく Vue core 側の回帰も疑う。UI ライブラリを使っていても core patch 差分を無視しない
- 出典(URL): https://github.com/vuejs/core/issues/10294
- 自プロジェクトへの該当可能性: 高

## 事例8

- 事例タイトル: `Vuetify 3.7.3 - 3.7.5` を `Vue 3.5.13` と組み合わせると `VFileUpload` を import できない
- 発生バージョン: `Vuetify 3.7.3 - 3.7.5`, `Vue 3.5.13`
- 症状: `import { VFileUpload } from 'vuetify/labs/VFileUpload'` で `Cannot find module 'vuetify/labs/VFileUpload' or its corresponding type declarations`
- 原因: 公式 docs / playground の案内と実際の公開物が一致していない状態
- 対策: UI ライブラリの docs だけで採用判断せず、実際に lockfile 解決後の型解決と import 可否をサンプルで確認する
- 出典(URL): https://github.com/vuetifyjs/vuetify/issues/20777
- 自プロジェクトへの該当可能性: 中

## 事例9

- 事例タイトル: `Vue 3.5.6` へ上げたら本番メモリ使用量が 1 時間で `200 MB -> 500 MB` に増えた報告 [要検証]
- 発生バージョン: `Vue 3.5.5 -> 3.5.6`
- 症状: 長時間稼働でメモリ消費が増え、`3.5.5` に戻すと正常化したという報告
- 原因: `scope: reactivity` ラベル付き issue だが、再現条件と根本原因は issue 上で十分に確定していない [要検証]
- 対策: 本番監視では Vue minor 更新直後に heap / RSS / SSR 応答時間を比較し、異常時は patch rollback できるようにする
- 出典(URL): https://github.com/vuejs/core/issues/11956
- 自プロジェクトへの該当可能性: 中

---

## 使い方

- GitHub Issue は「既知の再現条件と議論」を掴むために使う
- GitHub Discussion は「依存解決や設定衝突で CI / install が止まる例」を掴むのに有効
- Stack Overflow は「現場でのハマり方」を掴むために使う
- Zenn / Qiita は「日本語での整理」と「導入時の見落とし」を補うために使う

## この文書から分かる傾向

- core 自体の breaking change より、`toolchain` と `型周辺` の不整合で止まりやすい
- UI ライブラリ障害でも、原因が Vue core patch 回帰にあるケースがある
- `3.4` では削除 API、`3.5` では新 API の誤用がハマりどころ
- `useTemplateRef()` は便利だが、従来の `ref(null)` を全面廃止できるわけではない
