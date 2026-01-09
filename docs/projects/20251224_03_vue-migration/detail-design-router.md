# ルーター詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

Vue Routerによるクライアントサイドルーティングの実装詳細を定義する。

### 1.2 ルーティング方式

| 項目 | 値 |
|------|-----|
| ルーティングモード | History API (createWebHistory) |
| ベースURL | / |
| ライブラリ | vue-router 4.x |

---

## 2. ルート定義

### 2.1 ルート一覧

| パス | 名前 | コンポーネント | 説明 |
|------|------|---------------|------|
| / | home | HomeView | トップページ |
| /todos | todos | TodoView | ToDo管理画面 |
| /projects | projects | ProjectView | 案件管理画面 |
| /users | users | UserView | 担当者管理画面 |

### 2.2 クエリパラメータ

| パス | パラメータ | 型 | 必須 | 説明 |
|------|-----------|-----|------|------|
| /todos | projectId | string | 否 | 案件IDでフィルタ。'none'は未分類 |

---

## 3. 実装詳細

### 3.1 router/index.ts

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'ホーム'
    }
  },
  {
    path: '/todos',
    name: 'todos',
    component: () => import('@/views/TodoView.vue'),
    meta: {
      title: 'チケット管理'
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectView.vue'),
    meta: {
      title: '案件管理'
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UserView.vue'),
    meta: {
      title: 'ユーザー管理'
    }
  },
  {
    // 404 - 存在しないパスはホームへリダイレクト
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ページタイトル更新
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title
    ? `${title} - Spring Boot App`
    : 'Spring Boot App'
})

export default router
```

---

## 4. ルートメタ情報

### 4.1 メタ定義

| キー | 型 | 説明 |
|------|-----|------|
| title | string | ページタイトル（ブラウザタブ表示用） |

### 4.2 型定義

```typescript
// src/types/router.d.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}
```

---

## 5. ナビゲーション

### 5.1 プログラマティックナビゲーション

| 操作 | コード |
|------|--------|
| ホームへ遷移 | `router.push('/')` |
| ToDo画面へ遷移 | `router.push('/todos')` |
| 案件指定でToDo画面へ | `router.push({ path: '/todos', query: { projectId: '1' } })` |
| 未分類ToDoへ | `router.push({ path: '/todos', query: { projectId: 'none' } })` |
| 戻る | `router.back()` |

### 5.2 テンプレートでのナビゲーション

```vue
<!-- 基本リンク -->
<router-link to="/">ホーム</router-link>

<!-- 名前付きルート -->
<router-link :to="{ name: 'projects' }">案件管理</router-link>

<!-- クエリパラメータ付き -->
<router-link :to="{ path: '/todos', query: { projectId: project.id } }">
  チケット一覧
</router-link>
```

---

## 6. クエリパラメータの取得

### 6.1 Composition API での取得

```typescript
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// リアクティブに取得
const projectId = computed(() => route.query.projectId as string | undefined)

// 初期値取得
onMounted(() => {
  const id = route.query.projectId
  if (id) {
    // 案件IDがある場合の処理
  }
})
```

### 6.2 ウォッチ

```typescript
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// クエリパラメータ変更を監視
watch(
  () => route.query.projectId,
  (newProjectId) => {
    if (newProjectId) {
      // データ再取得
      todoStore.fetchTodos(newProjectId as string)
    }
  }
)
```

---

## 7. 遷移パターン

### 7.1 画面遷移図

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────┐                                           │
│  │   Home      │                                           │
│  │   (/)       │                                           │
│  └──────┬──────┘                                           │
│         │                                                   │
│    ┌────┼────┬────────────┐                                │
│    │    │    │            │                                │
│    ▼    ▼    ▼            │                                │
│  ┌────┐ ┌────────┐ ┌────┐ │                                │
│  │Todo│ │Projects│ │User│ │                                │
│  │List│ │        │ │    │ │                                │
│  └────┘ └────┬───┘ └────┘ │                                │
│    ▲         │      ▲     │                                │
│    │         │      │     │                                │
│    │    ┌────▼────┐ │     │                                │
│    │    │ Todo    │ │     │                                │
│    │    │ (with   │─┘     │                                │
│    │    │ project)│       │                                │
│    │    └─────────┘       │                                │
│    │                      │                                │
│    └──────────────────────┘                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 遷移詳細

| From | To | トリガー | パラメータ |
|------|-----|---------|-----------|
| Home | Todo | NavCardクリック | なし |
| Home | Projects | NavCardクリック | なし |
| Home | Users | NavCardクリック | なし |
| Projects | Todo | チケット一覧ボタン | projectId |
| Projects | Users | ナビリンク | なし |
| Todo | Projects | 戻るリンク | なし |
| Users | Projects | 戻るリンク | なし |
| Projects | Home | 戻るリンク | なし |

---

## 8. Lazy Loading

### 8.1 コード分割

すべてのページコンポーネントは動的インポートで遅延ロードする。

```typescript
// Lazy loading
component: () => import('@/views/HomeView.vue')

// 直接インポート（非推奨）
// import HomeView from '@/views/HomeView.vue'
// component: HomeView
```

### 8.2 ビルド結果

Viteビルド時に各ページが別チャンクとして出力される。

```
dist/
├── assets/
│   ├── index-[hash].js       # エントリー + 共通
│   ├── HomeView-[hash].js    # Home チャンク
│   ├── TodoView-[hash].js    # Todo チャンク
│   ├── ProjectView-[hash].js # Project チャンク
│   └── UserView-[hash].js    # User チャンク
```

---

## 9. エラーハンドリング

### 9.1 存在しないルート

404エラーはホームページへリダイレクトする。

```typescript
{
  path: '/:pathMatch(.*)*',
  redirect: '/'
}
```

### 9.2 ナビゲーションエラー

```typescript
router.push('/todos').catch((err) => {
  if (err.name !== 'NavigationDuplicated') {
    console.error('Navigation error:', err)
  }
})
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
