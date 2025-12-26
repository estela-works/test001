# ルーティング仕様

## 基本情報

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2025-12-26 |
| ルート総数 | 6 |
| ルーター設定ファイル | `src/frontend/src/router/index.ts` |
| ルーティングライブラリ | Vue Router 4.x |
| ヒストリーモード | HTML5 History API (createWebHistory) |

---

## 1. ルート一覧

| パス | 名前 | コンポーネント | 説明 |
|------|------|--------------|------|
| `/` | home | HomeView | ホーム画面 |
| `/todos` | todos | TodoView | ToDo一覧画面（カード形式） |
| `/todos/table` | todos-table | TodoTableView | ToDoテーブル表示 |
| `/projects` | projects | ProjectView | プロジェクト一覧画面 |
| `/users` | users | UserView | ユーザー管理画面 |
| `/:pathMatch(.*)*` | - | - | 404リダイレクト |

---

## 2. ルート詳細

### 2.1 ホーム（/）

| 項目 | 内容 |
|------|------|
| パス | `/` |
| 名前 | `home` |
| コンポーネント | `views/HomeView.vue` |
| タイトル | ホーム |
| 遅延ロード | あり |

#### メタ情報

```typescript
meta: {
  title: 'ホーム'
}
```

#### 遷移先

| 遷移先 | 方法 | 説明 |
|--------|------|------|
| /todos | NavCardクリック | チケット管理画面へ |
| /todos/table | NavCardクリック | チケット一覧画面へ |
| /projects | NavCardクリック | 案件管理画面へ |
| /users | NavCardクリック | ユーザー管理画面へ |

---

### 2.2 ToDo一覧（/todos）

| 項目 | 内容 |
|------|------|
| パス | `/todos` |
| 名前 | `todos` |
| コンポーネント | `views/TodoView.vue` |
| タイトル | チケット管理 |
| 遅延ロード | あり |

#### クエリパラメータ

| パラメータ | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| projectId | `string` | プロジェクトでフィルタ | `?projectId=1`, `?projectId=none` |

#### メタ情報

```typescript
meta: {
  title: 'チケット管理'
}
```

#### 遷移先

| 遷移先 | 方法 | 説明 |
|--------|------|------|
| /projects | router-link | 案件一覧に戻る |

---

### 2.3 ToDoテーブル表示（/todos/table）

| 項目 | 内容 |
|------|------|
| パス | `/todos/table` |
| 名前 | `todos-table` |
| コンポーネント | `views/TodoTableView.vue` |
| タイトル | チケット一覧 |
| 遅延ロード | あり |

#### クエリパラメータ

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| projectId | `number` | プロジェクトフィルタ（初期値） |

#### メタ情報

```typescript
meta: {
  title: 'チケット一覧'
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
| 遅延ロード | あり |

#### メタ情報

```typescript
meta: {
  title: '案件管理'
}
```

#### 遷移先

| 遷移先 | 方法 | 説明 |
|--------|------|------|
| /todos?projectId={id} | router.push | プロジェクトのToDo一覧へ |
| /todos?projectId=none | router.push | 未分類のToDo一覧へ |
| /users | router-link | ユーザー管理へ |
| / | router-link | ホームに戻る |

---

### 2.5 ユーザー管理（/users）

| 項目 | 内容 |
|------|------|
| パス | `/users` |
| 名前 | `users` |
| コンポーネント | `views/UserView.vue` |
| タイトル | ユーザー管理 |
| 遅延ロード | あり |

#### メタ情報

```typescript
meta: {
  title: 'ユーザー管理'
}
```

#### 遷移先

| 遷移先 | 方法 | 説明 |
|--------|------|------|
| /projects | router-link | 案件一覧に戻る |

---

### 2.6 404リダイレクト

| 項目 | 内容 |
|------|------|
| パス | `/:pathMatch(.*)*` |
| 名前 | - |
| 処理 | `/` へリダイレクト |

```typescript
{
  path: '/:pathMatch(.*)*',
  redirect: '/'
}
```

---

## 3. ナビゲーションガード

### 3.1 afterEach

ルート遷移後に実行されるガード。

| 処理 | 説明 |
|------|------|
| ページタイトル更新 | meta.titleをドキュメントタイトルに反映 |

```typescript
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} - ToDo App` : 'ToDo App'
})
```

---

## 4. メタ情報定義

### 4.1 利用可能なメタ情報

| キー | 型 | 説明 |
|------|-----|------|
| title | `string` | ページタイトル（ドキュメントタイトルに反映） |

### 4.2 TypeScript型定義

```typescript
// vue-routerのRouteMeta拡張（必要に応じて）
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}
```

---

## 5. 遅延ローディング

### 5.1 遅延ローディング対象

すべてのページコンポーネントが遅延ロード対象。

| ルート | コンポーネント | チャンク |
|--------|--------------|---------|
| / | HomeView | HomeView |
| /todos | TodoView | TodoView |
| /todos/table | TodoTableView | TodoTableView |
| /projects | ProjectView | ProjectView |
| /users | UserView | UserView |

### 5.2 実装

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'ホーム' }
  },
  {
    path: '/todos',
    name: 'todos',
    component: () => import('@/views/TodoView.vue'),
    meta: { title: 'チケット管理' }
  },
  {
    path: '/todos/table',
    name: 'todos-table',
    component: () => import('@/views/TodoTableView.vue'),
    meta: { title: 'チケット一覧' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectView.vue'),
    meta: { title: '案件管理' }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UserView.vue'),
    meta: { title: 'ユーザー管理' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
```

---

## 6. プログラマティックナビゲーション

### 6.1 よく使うパターン

| 用途 | コード例 |
|------|---------|
| 名前指定で遷移 | `router.push({ name: 'todos' })` |
| パスで遷移 | `router.push('/todos')` |
| パラメータ付き | `router.push({ path: '/todos', query: { projectId: '1' } })` |
| 戻る | `router.back()` |
| 置き換え | `router.replace({ name: 'home' })` |

### 6.2 コンポーネントでの使用例

```typescript
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToTodos(projectId: number | string) {
  router.push({
    path: '/todos',
    query: { projectId: String(projectId) }
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
          ┌──────────────────┼──────────────────┐──────────────┐
          │                  │                  │              │
          ▼                  ▼                  ▼              ▼
   ┌────────────┐    ┌────────────┐    ┌────────────┐  ┌────────────┐
   │   ToDos    │    │ ToDo Table │    │  Projects  │  │   Users    │
   │  (/todos)  │    │(/todos/    │    │(/projects) │  │  (/users)  │
   └────────────┘    │  table)    │    └─────┬──────┘  └─────┬──────┘
                     └────────────┘          │               │
                                             │               │
                                             ▼               │
                                    ┌────────────┐           │
                                    │   ToDos    │◄──────────┘
                                    │  (/todos   │
                                    │ ?projectId)│
                                    └────────────┘
```

### 遷移パターン

| 起点 | 終点 | トリガー |
|------|------|---------|
| Home | /todos | NavCardクリック |
| Home | /todos/table | NavCardクリック |
| Home | /projects | NavCardクリック |
| Home | /users | NavCardクリック |
| ProjectView | /todos?projectId={id} | ProjectCardクリック |
| ProjectView | /todos?projectId=none | 未分類カードクリック |
| ProjectView | /users | router-link |
| ProjectView | / | router-link |
| TodoView | /projects | router-link |
| UserView | /projects | router-link |

---

## 8. 更新ガイドライン

### 8.1 新規ルート追加時

1. router/index.tsにルート定義を追加
2. ルート一覧に情報を追加
3. ルート詳細セクションを追加
4. メタ情報を設定
5. 遅延ローディングを設定
6. 遷移図を更新
7. 基本情報のルート総数を更新

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
| 1.0 | 2025-12-26 | 初版作成 | Claude |
