# フロントエンド詳細設計書 - 共通コンポーネント

[← 目次に戻る](./detail-design-frontend.md)

---

## 3. 共通コンポーネント詳細

### 3.1 LoadingSpinner.vue

#### テンプレート

```vue
<template>
  <div class="loading">読み込み中...</div>
</template>
```

#### Props

なし

#### スタイル

```css
.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}
```

---

### 3.2 ErrorMessage.vue

#### テンプレート

```vue
<template>
  <div v-if="message" class="error">
    {{ message }}
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| message | string \| null | 否 | エラーメッセージ |

#### スタイル

```css
.error {
  color: #dc3545;
  text-align: center;
  padding: 10px;
  background-color: #f8d7da;
  border-radius: 4px;
  margin-bottom: 20px;
}
```

---

### 3.3 NavCard.vue

#### テンプレート

```vue
<template>
  <router-link :to="to" class="nav-card" :class="colorClass">
    <div class="card-icon">
      <span>{{ icon }}</span>
    </div>
    <div class="card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div class="card-action">
      <span class="action-text">開く →</span>
    </div>
  </router-link>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| to | string | 要 | 遷移先パス |
| icon | string | 要 | アイコン文字（絵文字） |
| title | string | 要 | カードタイトル |
| description | string | 要 | カード説明文 |
| colorClass | string | 要 | カラークラス（card-todo/card-project/card-user） |

---

## 8. Composables詳細

### 8.1 useError.ts

```typescript
import { ref } from 'vue'

export function useError() {
  const error = ref<string | null>(null)

  const showError = (message: string) => {
    error.value = message
    setTimeout(() => {
      error.value = null
    }, 5000)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    error,
    showError,
    clearError
  }
}
```

---

## 9. エントリーポイント

### 9.1 main.ts

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### 9.2 App.vue

```vue
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
```
