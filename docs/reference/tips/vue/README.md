# Vue 3.2.45 -> 3.5.13 アップグレード参考資料

このフォルダは、`Vue 3.2.45` から `Vue 3.5.13` へ上げる担当者向けの共通リファレンスです。目的は、破壊的変更・新機能・依存互換・ビルドツール要件・実施手順・失敗事例・ロールバック判断を、公式情報と実例ベースで横断的に確認できるようにすることです。

プロジェクト固有の作業手順、環境差分、社内承認フロー、監視項目、実行順序はこのフォルダには置かず、各プロジェクト配下の運用ドキュメントに分離してください。

## 読み順

1. [migration-checklist.md](./migration-checklist.md)
2. [breaking-changes.md](./breaking-changes.md)
3. [dependency-compatibility.md](./dependency-compatibility.md)
4. [build-toolchain.md](./build-toolchain.md)
5. [new-features.md](./new-features.md)
6. [failure-cases.md](./failure-cases.md)
7. [upgrade-strategy.md](./upgrade-strategy.md)
8. [rollback-template.md](./rollback-template.md)

## ファイル一覧

| ファイル | 役割 | こんな時に読む |
| --- | --- | --- |
| `README.md` | 全体案内、読書順、用途定義 | 最初に全体像を掴みたい時 |
| `breaking-changes.md` | 3.3 / 3.4 / 3.5 の破壊的変更、削除、非推奨化 | 先に事故ポイントを洗いたい時 |
| `new-features.md` | 3.3 / 3.4 / 3.5 の新機能と改善点 | 置き換え候補や書き方改善を探す時 |
| `dependency-compatibility.md` | 主要依存ライブラリの安全側の推奨バージョン帯 | 依存更新の順序を決める時 |
| `build-toolchain.md` | Vite、TypeScript、ESLint、DevTools、Node.js の整合 | ビルド周りで詰まりたくない時 |
| `migration-checklist.md` | 優先順位付きチェックリスト | 実作業の抜け漏れを防ぎたい時 |
| `upgrade-strategy.md` | 一括移行か段階移行かの判断材料 | プロジェクト計画を決める時 |
| `failure-cases.md` | 実例ベースの失敗事例集 | 事前にハマりどころを知りたい時 |
| `rollback-template.md` | 汎用ロールバック判断テンプレート | 切り戻し基準を決めたい時 |

## このフォルダの前提

- 基本対象は `Vue 3.2.45 -> 3.5.13`
- 破壊的変更の整理単位は `3.3`, `3.4`, `3.5`
- 可能な限り `Vue 公式ブログ / 公式ドキュメント / GitHub PR / GitHub Issue` を優先
- 失敗事例は `GitHub Issues`, `Stack Overflow`, `Zenn`, `Qiita` を併用
- 断定できない内容には `[要検証]` を付与

## 先に押さえるべき要点

- `3.4` で `Reactivity Transform` は削除済み
- `3.4` で TSX 利用時の `global JSX namespace` 前提が崩れる
- `3.4` では `defineModel` が安定化し、`v-bind` 同名短縮が追加された
- `3.5` は公式には breaking change なしだが、`Reactive Props Destructure` の安定化と `useTemplateRef()` 導入で実装方針が変わりやすい
- Vue 本体より先に、`vite / @vitejs/plugin-vue / vue-tsc / typescript / eslint-plugin-vue` の整合を確認した方が安全

## 参照のしかた

- 影響度は `高 / 中 / 低`
- `高` はビルド失敗、型崩壊、ランタイム不具合、主要依存ライブラリ影響を想定
- `中` は局所修正が必要なもの
- `低` は非推奨解消、置き換え推奨、将来対応の前倒し

## 参考 URL

- Vue 3.3: https://blog.vuejs.org/posts/vue-3-3
- Vue 3.4: https://blog.vuejs.org/posts/vue-3-4
- Vue 3.5: https://blog.vuejs.org/posts/vue-3-5
- `<script setup>` API: https://vuejs.org/api/sfc-script-setup.html
- Reactivity Transform: https://vuejs.org/guide/extras/reactivity-transform.html
