# 移行チェックリスト

## TOP5 優先順位

1. `Reactivity Transform` 依存の除去有無を確認する
2. Vite / plugin-vue / vue-tsc / Node.js の整合を先に揃える
3. TSX 利用時は `jsxImportSource: "vue"` と `JSX` 依存コードを確認する
4. `defineModel`, `useTemplateRef`, Reactive Props Destructure へ寄せる対象を切り分ける
5. 依存ライブラリを core と同時に major upgrade しない

## フェーズ1: 移行前

| チェック | 具体的な確認方法 |
| --- | --- |
| 現在の依存を棚卸ししたか | `npm ls vue vite @vitejs/plugin-vue vue-tsc typescript vue-router pinia vuex @vue/test-utils` |
| Node.js が要件を満たすか | `node -v` を実行し、Vite 4/5/6 の要件と照合 |
| Reactivity Transform を使っていないか | `rg -n "\$ref|\$computed|reactivityTransform|script\\.refSugar|vue/macros" src vite.config.*` |
| 3.4 で削除される API を使っていないか | `rg -n "@vnode|v-is=|unwrapInjectedRef" src` |
| TSX / JSX 影響を洗ったか | `rg -n "JSX\\.|namespace JSX|jsxImportSource" src tsconfig*.json` |
| `defineModel` へ置き換えたい候補を洗ったか | `rg -n "update:modelValue|defineEmits\\(\\['update:modelValue'\\]" src` |
| テンプレート ref の旧パターンを把握したか | `rg -n "ref<.*\\| null>|ref\\(null\\)|shallowRef\\(null\\)" src` |

## フェーズ2: 移行実施

| チェック | 具体的な実施例 |
| --- | --- |
| Vue core を固定で上げたか | `npm install vue@3.5.13` |
| Vite / plugin-vue / vue-tsc を同時整合したか | 例: `npm install -D vite@^5 @vitejs/plugin-vue@^5 vue-tsc@latest typescript@latest` |
| TSX 用 `jsxImportSource` を入れたか | `tsconfig.json` に `"jsxImportSource": "vue"` を追加 |
| `Reactivity Transform` を除去したか | 旧: `const count = $ref(0)` -> 新: `const count = ref(0)` |
| `defineModel` 適用範囲を限定したか | 新規 or テスト済みコンポーネントから段階導入 |
| Reactive Props Destructure を使う箇所で getter watch に直したか | `watch(count)` ではなく `watch(() => count)` |

### `defineModel` 置換例

```vue
<script setup>
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

### Reactive Props Destructure の注意例

```ts
const { count = 0 } = defineProps<{ count?: number }>()

watch(() => count, (value) => {
  console.log(value)
})
```

### TSX 設定例

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
  }
}
```

## フェーズ3: 動作確認

| チェック | 具体的な確認方法 |
| --- | --- |
| 型検査が通るか | `npx vue-tsc --noEmit` |
| ビルドが通るか | `npm run build` |
| 開発サーバが起動するか | `npm run dev` |
| 主要画面の E2E / 画面テストが通るか | プロジェクトの E2E コマンドを実行 |
| フォームの `v-model` が双方向に動くか | 入力 -> 親 state -> 再描画の往復を確認 |
| SSR / hydration 警告が出ていないか | ブラウザ console と server log を確認 |
| テンプレート ref 利用箇所が null 安全か | `?.` または type guard があるかレビュー |
| Store / Router が初期化できるか | 画面遷移、初回ストア読込、永続化復元を確認 |

## 最低限の受け入れ条件

- `vue-tsc --noEmit` が成功
- 本番ビルドが成功
- 主要業務フローの回帰確認が完了
- コンソールに `Maximum recursive updates exceeded`, hydration mismatch, JSX type error が出ない
- ロールバック手順が別紙で確認済み

## 失敗しやすい順序

- `Vue core` と `Pinia major`, `UI library major`, `Vite major` を全部同時に上げる
- `reactivityTransform` を残したまま `3.4+` へ上げる
- `vue-tsc` を古いまま `3.5` の型機能だけ先に使う

## 補助コマンド集

```sh
rg -n "defineModel\\(|useTemplateRef\\(|withDefaults\\(|defineProps<|@vnode|v-is=" src
```

```sh
npm outdated
```
