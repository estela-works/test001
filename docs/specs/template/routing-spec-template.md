# ルーティング仕様

<!--
このテンプレートはVue Routerのルーティング設定を記録するために使用します。
全ルート定義、ナビゲーションガード、メタ情報を網羅的に記載します。
-->

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | <!-- YYYY-MM-DD --> |
| ルート総数 | <!-- 例: 5 --> |
| ルーター設定ファイル | `src/frontend/src/router/index.ts` |
| ルーティングライブラリ | Vue Router 4.x |

---

## 1. ルート一覧

| パス | 名前 | コンポーネント | 説明 |
|------|------|--------------|------|
| `/` | home | HomeView | ホーム画面 |
| `/todos` | todos | TodoView | ToDo一覧画面 |
| `/todos/table` | todos-table | TodoTableView | ToDoテーブル表示 |
| `/projects` | projects | ProjectView | プロジェクト一覧画面 |
| `/users` | users | UserView | ユーザー管理画面 |
| `/:pathMatch(.*)*` | not-found | - | 404リダイレクト |

---

## 2. ルート詳細

### 2.1 ホーム（/）

| 項目 | 内容 |
|------|------|
| パス | `/` |
| 名前 | `home` |
| コンポーネント | `views/HomeView.vue` |
| タイトル | ホーム |

#### メタ情報

```typescript
meta: {
  title: 'ホーム',
  requiresAuth: false
}
```

#### 遷移先

| 遷移先 | 方法 |
|--------|------|
| /todos | NavCardクリック |
| /projects | NavCardクリック |
| /users | NavCardクリック |

---

### 2.2 ToDo一覧（/todos）

| 項目 | 内容 |
|------|------|
| パス | `/todos` |
| 名前 | `todos` |
| コンポーネント | `views/TodoView.vue` |
| タイトル | チケット管理 |

#### クエリパラメータ

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| projectId | `number` | プロジェクトでフィルタ |

#### メタ情報

```typescript
meta: {
  title: 'チケット管理',
  requiresAuth: false
}
```

---

### 2.3 ToDoテーブル表示（/todos/table）

| 項目 | 内容 |
|------|------|
| パス | `/todos/table` |
| 名前 | `todos-table` |
| コンポーネント | `views/TodoTableView.vue` |
| タイトル | チケット一覧 |

#### クエリパラメータ

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| keyword | `string` | キーワード検索 |
| completed | `'all' \| 'completed' \| 'pending'` | 完了状態フィルタ |
| projectId | `number` | プロジェクトフィルタ |
| userId | `number` | 担当者フィルタ |
| sortKey | `string` | ソートキー |
| sortOrder | `'asc' \| 'desc'` | ソート順 |

#### メタ情報

```typescript
meta: {
  title: 'チケット一覧',
  requiresAuth: false
}
```

---

### 2.4 プロジェクト一覧（/projects）

| 項目 | 内容 |
|------|------|
| パス | `/projects` |
| 名前 | `projects` |
| コンポーネント | `views/ProjectView.vue` |
| タイトル | 案件管理 |

#### メタ情報

```typescript
meta: {
  title: '案件管理',
  requiresAuth: false
}
```

#### 遷移先

| 遷移先 | 方法 | 説明 |
|--------|------|------|
| /todos?projectId={id} | ProjectCardクリック | プロジェクトのToDo一覧へ |

---

### 2.5 ユーザー管理（/users）

| 項目 | 内容 |
|------|------|
| パス | `/users` |
| 名前 | `users` |
| コンポーネント | `views/UserView.vue` |
| タイトル | ユーザー管理 |

#### メタ情報

```typescript
meta: {
  title: 'ユーザー管理',
  requiresAuth: false
}
```

---

### 2.6 404リダイレクト

| 項目 | 内容 |
|------|------|
| パス | `/:pathMatch(.*)*` |
| 名前 | `not-found` |
| 処理 | `/` へリダイレクト |

```typescript
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  redirect: '/'
}
```

---

## 3. ナビゲーションガード

### 3.1 beforeEach

<!--
ルート遷移前に実行されるガードを記載します。
-->

| 処理 | 説明 |
|------|------|
| <!-- 例: 認証チェック --> | <!-- 未ログイン時はログイン画面へリダイレクト --> |

```typescript
router.beforeEach((to, from, next) => {
  // 認証チェック等の処理
  next()
})
```

---

### 3.2 afterEach

<!--
ルート遷移後に実行されるガードを記載します。
-->

| 処理 | 説明 |
|------|------|
| ページタイトル更新 | meta.titleをドキュメントタイトルに反映 |

```typescript
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = `${title} | アプリ名`
  }
})
```

---

## 4. メタ情報定義

### 4.1 利用可能なメタ情報

| キー | 型 | 説明 |
|------|-----|------|
| title | `string` | ページタイトル |
| requiresAuth | `boolean` | 認証が必要か |
| <!-- 追加メタ --> | <!-- 型 --> | <!-- 説明 --> |

### 4.2 TypeScript型定義

```typescript
// router/index.ts または types/router.ts

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
  }
}
```

---

## 5. 遅延ローディング

<!--
コード分割とルートの遅延ローディング設定を記載します。
-->

### 5.1 遅延ローディング対象

| ルート | コンポーネント | チャンク名 |
|--------|--------------|-----------|
| /todos | TodoView | todos |
| /todos/table | TodoTableView | todos-table |
| /projects | ProjectView | projects |
| /users | UserView | users |

### 5.2 実装例

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView  // 即時ロード
  },
  {
    path: '/todos',
    name: 'todos',
    component: () => import('@/views/TodoView.vue')  // 遅延ロード
  },
  {
    path: '/todos/table',
    name: 'todos-table',
    component: () => import('@/views/TodoTableView.vue')
  }
]
```

---

## 6. プログラマティックナビゲーション

### 6.1 よく使うパターン

| 用途 | コード例 |
|------|---------|
| 名前指定で遷移 | `router.push({ name: 'todos' })` |
| パラメータ付き | `router.push({ name: 'todos', query: { projectId: 1 } })` |
| 戻る | `router.back()` |
| 置き換え | `router.replace({ name: 'home' })` |

### 6.2 コンポーネントでの使用

```typescript
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToTodos(projectId: number) {
  router.push({
    name: 'todos',
    query: { projectId }
  })
}
</script>
```

---

## 7. ルート遷移図

```
                    ┌─────────────────┐
                    │     Home (/)    │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌────────────┐    ┌────────────┐    ┌────────────┐
   │   ToDos    │    │  Projects  │    │   Users    │
   │  (/todos)  │    │(/projects) │    │  (/users)  │
   └─────┬──────┘    └─────┬──────┘    └────────────┘
         │                 │
         │                 │ (プロジェクト選択)
         ▼                 │
   ┌────────────┐          │
   │ ToDo Table │◄─────────┘
   │(/todos/    │
   │  table)    │
   └────────────┘
```

---

## 8. 更新ガイドライン

### 8.1 新規ルート追加時

1. ルート一覧に情報を追加
2. ルート詳細セクションを追加
3. メタ情報を設定
4. 遅延ローディングを検討
5. 遷移図を更新
6. 基本情報のルート総数を更新

### 8.2 記載項目チェックリスト

- [ ] パス
- [ ] 名前
- [ ] コンポーネント
- [ ] タイトル（meta.title）
- [ ] クエリパラメータ（あれば）
- [ ] パスパラメータ（あれば）
- [ ] 遷移先・遷移元
- [ ] 遅延ローディング設定

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | <!-- YYYY-MM-DD --> | 初版作成 | <!-- 変更者名 --> |
