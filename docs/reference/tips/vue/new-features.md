# 3.3 / 3.4 / 3.5 の新機能と改善点

この文書は、`Vue 3.2.45` から上げる時に「何が増えたか」「どの旧パターンを置き換えられるか」を把握するための一覧です。

## 3.3 系

| 機能 | 要点 | 実務での使いどころ | 参照 |
| --- | --- | --- | --- |
| imported / complex types 対応 | `defineProps` / `defineEmits` の型引数で import 型や交差型を扱いやすくなった | props 型を別ファイルへ切り出しやすい | 公式: https://blog.vuejs.org/posts/vue-3-3 / GitHub PR: https://github.com/vuejs/core/pull/8083 / 公式 API: https://vuejs.org/api/sfc-script-setup.html |
| generic components | `<script setup generic="T">` が実用レベルに | 汎用テーブル、セレクト、フォーム部品 | 公式: https://blog.vuejs.org/posts/vue-3-3 / GitHub RFC: https://github.com/vuejs/rfcs/discussions/436 / 公式 API: https://vuejs.org/api/sfc-script-setup.html |
| `defineSlots()` | スロット props の型宣言ができる | 大規模 UI コンポーネントの型安全化 | 公式: https://blog.vuejs.org/posts/vue-3-3 / 公式 API: https://vuejs.org/api/sfc-script-setup.html |
| `defineOptions()` | `<script setup>` 内で `inheritAttrs` などを直接宣言できる | `<script>` ブロック分離を減らす | 公式: https://blog.vuejs.org/posts/vue-3-3 / 公式 API: https://vuejs.org/api/sfc-script-setup.html |
| `toRef()` / `toValue()` 改善 | getter ベースの composable 設計がしやすい | props を getter で渡す composable の整理 | 公式: https://blog.vuejs.org/posts/vue-3-3 / GitHub PR: https://github.com/vuejs/core/pull/7997 |
| `defineModel()` experimental | `v-model` 実装をマクロ化 | ただし 3.3 では experimental 扱い | 公式: https://blog.vuejs.org/posts/vue-3-3 / GitHub RFC: https://github.com/vuejs/rfcs/discussions/503 |

### 3.3 のコード断片

```vue
<script setup lang="ts" generic="T extends { id: string }">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  items: T[]
  selectedId?: string
}>()

defineSlots<{
  item(props: { item: T }): any
}>()
</script>
```

## 3.4 系

| 機能 | 要点 | 実務での使いどころ | 参照 |
| --- | --- | --- | --- |
| `defineModel()` stable | `props + emits` の定型を減らせる | フォーム部品、wrapper component | 公式: https://blog.vuejs.org/posts/vue-3-4 / 公式 docs: https://vuejs.org/guide/components/v-model.html |
| `v-bind` 同名短縮 | `:id="id"` を `:id` と書ける | テンプレートのノイズ削減 | 公式: https://blog.vuejs.org/posts/vue-3-4 / GitHub PR: https://github.com/vuejs/core/pull/9451 |
| `watch` の `once: true` | 変更時に一度だけ実行する watch が書ける | 初回変化検知、アニメーション開始、計測イベント | 公式 docs: https://vuejs.org/guide/essentials/watchers.html |
| 2x faster parser / SFC build 改善 | テンプレートパーサを書き直し、SFC コンパイルも高速化 | 開発体験改善、CI 時間短縮 | 公式: https://blog.vuejs.org/posts/vue-3-4 / GitHub PR: https://github.com/vuejs/core/pull/9674 |
| reactivity system 最適化 | computed の再評価と effect 発火がより効率化 | 不要な再描画削減 | 公式: https://blog.vuejs.org/posts/vue-3-4 / GitHub PR: https://github.com/vuejs/core/pull/5912 |
| hydration mismatch 情報改善 | デバッグしやすいエラーメッセージに | SSR / Nuxt の調査効率向上 | 公式: https://blog.vuejs.org/posts/vue-3-4 |

### 3.4 のコード断片

```ts
watch(
  source,
  () => {
    // 変更された最初の 1 回だけ実行
  },
  { once: true }
)
```

```vue
<script setup>
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" :aria-label />
</template>
```

## 3.5 系

| 機能 | 要点 | 実務での使いどころ | 参照 |
| --- | --- | --- | --- |
| Reactive Props Destructure 安定化 | `defineProps()` の分割代入が既定で reactive | props の default 値定義を簡潔化 | 公式: https://blog.vuejs.org/posts/vue-3-5 / GitHub RFC: https://github.com/vuejs/rfcs/discussions/502 |
| `useTemplateRef()` | 文字列キーで template ref を取得 | ref 命名と `ref(null)` 初期化の定型削減 | 公式: https://blog.vuejs.org/posts/vue-3-5 / 公式 API: https://vuejs.org/api/composition-api-helpers.html / 公式 guide: https://vuejs.org/guide/essentials/template-refs.html |
| `useId()` | SSR/CSR で安定した ID 生成 | フォーム部品、a11y 属性、SSR ハイドレーションズレ回避 | 公式: https://blog.vuejs.org/posts/vue-3-5 / 公式 API: https://vuejs.org/api/composition-api-helpers.html / GitHub PR: https://github.com/vuejs/core/pull/11404 |
| Deferred Teleport | `defer` で後から描画される target に teleport 可能 | レイアウト後段の modal container | 公式: https://blog.vuejs.org/posts/vue-3-5 / 公式 guide: https://vuejs.org/guide/built-ins/teleport.html / GitHub PR: https://github.com/vuejs/core/pull/11387 |
| reactivity system refactor | メモリ使用量削減、SSR stale computed 問題改善、大規模配列追跡改善 | 状態量が多い画面、SSR | 公式: https://blog.vuejs.org/posts/vue-3-5 / GitHub PR: https://github.com/vuejs/core/pull/10397 / GitHub PR: https://github.com/vuejs/core/pull/9511 |
| lazy hydration / `data-allow-mismatch` | SSR 制御が細かくなる | 部分 hydration、日時表示など | 公式: https://blog.vuejs.org/posts/vue-3-5 / GitHub PR: https://github.com/vuejs/core/pull/11458 |

### 3.5 のコード断片

```vue
<script setup lang="ts">
const { count = 0, label = 'hello' } = defineProps<{
  count?: number
  label?: string
}>()
</script>
```

```vue
<script setup lang="ts">
import { useTemplateRef, onMounted, useId } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('name')
const id = useId()

onMounted(() => inputRef.value?.focus())
</script>

<template>
  <label :for="id">Name</label>
  <input :id="id" ref="name" />
</template>
```

```vue
<template>
  <Teleport defer to="#modal-root">
    <div class="modal">...</div>
  </Teleport>
  <div id="modal-root"></div>
</template>
```

## 3.2.45 から見た置き換え候補

| 旧パターン | 置き換え候補 | 備考 |
| --- | --- | --- |
| `props + emit('update:modelValue')` | `defineModel()` | まずは新規コンポーネントから採用 |
| `withDefaults(defineProps(...), ...)` | Reactive Props Destructure | 3.5 以降で採用しやすい |
| `const el = ref(null)` + template ref 名合わせ | `useTemplateRef()` | 配列 refs は従来パターンの方が扱いやすい |
| `watch(..., { immediate: true })` + 手動停止 | `watch(..., { once: true })` | 要件に合う箇所だけ置換 |
| `<img :id="id" :src="src">` | `<img :id :src>` | formatter 追従後に採用 |

## 注意点

- `useTemplateRef()` は配列 refs の deep watch には向かない
- Reactive Props Destructure では、分割代入した props を watch するとき getter 包装が必要
- `defineModel()` への全面置換は、まず既存テストが揃っているコンポーネントから進めた方が安全
