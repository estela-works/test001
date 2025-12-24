# フロントエンド詳細設計書

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

Vueコンポーネントの実装詳細（テンプレート構造、スクリプト、スタイル）を定義する。

### 1.2 対象コンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| App.vue | ルート | アプリケーション全体のレイアウト |
| HomeView.vue | ページ | トップページ表示 |
| TodoView.vue | ページ | ToDo管理画面 |
| ProjectView.vue | ページ | 案件管理画面 |
| UserView.vue | ページ | 担当者管理画面 |
| TodoForm.vue | 機能 | ToDo追加フォーム |
| TodoItem.vue | 機能 | ToDo表示・操作 |
| TodoList.vue | 機能 | ToDoリスト |
| TodoStats.vue | 機能 | 統計表示 |
| TodoFilter.vue | 機能 | フィルタボタン |
| ProjectForm.vue | 機能 | 案件追加フォーム |
| ProjectCard.vue | 機能 | 案件カード |
| UserForm.vue | 機能 | ユーザー追加フォーム |
| UserCard.vue | 機能 | ユーザーカード |
| LoadingSpinner.vue | 共通 | ローディング表示 |
| ErrorMessage.vue | 共通 | エラー表示 |
| NavCard.vue | 共通 | ナビゲーションカード |

---

## 2. ファイル構成

### 2.1 ファイル一覧

```
src/frontend/src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.vue
│   │   ├── ErrorMessage.vue
│   │   └── NavCard.vue
│   ├── todo/
│   │   ├── TodoForm.vue
│   │   ├── TodoItem.vue
│   │   ├── TodoList.vue
│   │   ├── TodoStats.vue
│   │   └── TodoFilter.vue
│   ├── project/
│   │   ├── ProjectForm.vue
│   │   └── ProjectCard.vue
│   └── user/
│       ├── UserForm.vue
│       └── UserCard.vue
├── views/
│   ├── HomeView.vue
│   ├── TodoView.vue
│   ├── ProjectView.vue
│   └── UserView.vue
├── composables/
│   └── useError.ts
├── App.vue
└── main.ts
```

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

## 4. ToDoコンポーネント詳細

### 4.1 TodoForm.vue

#### テンプレート

```vue
<template>
  <div class="add-todo">
    <h3>新しいToDoを追加</h3>
    <input
      v-model="form.title"
      type="text"
      placeholder="タイトルを入力してください"
      @keypress.enter="handleSubmit"
    />
    <textarea
      v-model="form.description"
      rows="3"
      placeholder="説明を入力してください（オプション）"
    />
    <div class="date-inputs">
      <div class="date-field">
        <label>開始日:</label>
        <input v-model="form.startDate" type="date" />
      </div>
      <div class="date-field">
        <label>終了日:</label>
        <input v-model="form.dueDate" type="date" />
      </div>
    </div>
    <div class="assignee-field">
      <label>担当者:</label>
      <select v-model="form.assigneeId">
        <option value="">未割当</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </div>
    <button @click="handleSubmit">追加</button>
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| users | User[] | 要 | ユーザーリスト（担当者選択用） |
| projectId | string \| null | 否 | 案件ID |

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| submit | CreateTodoRequest | フォーム送信 |

#### 状態

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| form | object | { title: '', description: '', startDate: '', dueDate: '', assigneeId: '' } | フォーム入力値 |

#### メソッド

| メソッド | 説明 |
|---------|------|
| handleSubmit() | バリデーション実行後、submitイベント発火、フォームクリア |
| validate() | タイトル必須、日付範囲チェック |
| resetForm() | フォームを初期値にリセット |

#### バリデーション

| 項目 | ルール | エラーメッセージ |
|------|--------|----------------|
| title | 必須、空文字不可 | タイトルを入力してください |
| dueDate | startDateより後 | 終了日は開始日以降を指定してください |

---

### 4.2 TodoItem.vue

#### テンプレート

```vue
<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <h3>{{ todo.title }}</h3>
    <p>{{ todo.description }}</p>
    <p v-if="dateRange" class="date-range">期間: {{ dateRange }}</p>
    <p class="assignee" :class="{ unassigned: !todo.assigneeName }">
      担当: {{ todo.assigneeName || '未割当' }}
    </p>
    <p><small>作成日: {{ formattedCreatedAt }}</small></p>
    <div class="actions">
      <button class="toggle-btn" @click="$emit('toggle', todo.id)">
        {{ todo.completed ? '未完了にする' : '完了にする' }}
      </button>
      <button class="delete-btn" @click="handleDelete">削除</button>
    </div>
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| todo | Todo | 要 | ToDoデータ |

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| toggle | number | 完了状態切替（ID） |
| delete | number | 削除（ID） |

#### Computed

| プロパティ | 説明 |
|-----------|------|
| dateRange | 開始日〜終了日のフォーマット文字列 |
| formattedCreatedAt | 作成日時の日本語フォーマット |

#### メソッド

| メソッド | 説明 |
|---------|------|
| handleDelete() | 確認ダイアログ表示後、deleteイベント発火 |

---

### 4.3 TodoList.vue

#### テンプレート

```vue
<template>
  <div class="todo-list">
    <p v-if="todos.length === 0" class="empty-message">
      ToDoアイテムがありません。
    </p>
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="$emit('toggle', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| todos | Todo[] | 要 | ToDoリスト |

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| toggle | number | 完了状態切替 |
| delete | number | 削除 |

---

### 4.4 TodoStats.vue

#### テンプレート

```vue
<template>
  <div class="stats">
    <span>総数: <strong>{{ total }}</strong></span>
    <span>完了: <strong>{{ completed }}</strong></span>
    <span>未完了: <strong>{{ pending }}</strong></span>
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| total | number | 要 | 総数 |
| completed | number | 要 | 完了数 |
| pending | number | 要 | 未完了数 |

---

### 4.5 TodoFilter.vue

#### テンプレート

```vue
<template>
  <div class="filter-buttons">
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="{ active: modelValue === filter.value }"
      @click="$emit('update:modelValue', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| modelValue | 'all' \| 'pending' \| 'completed' | 要 | 現在のフィルタ値 |

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| update:modelValue | string | フィルタ変更 |

#### 定数

```typescript
const filters = [
  { value: 'all', label: 'すべて' },
  { value: 'pending', label: '未完了' },
  { value: 'completed', label: '完了済み' }
]
```

---

## 5. Projectコンポーネント詳細

### 5.1 ProjectForm.vue

#### テンプレート

```vue
<template>
  <div class="add-form">
    <h3>新しい案件を作成</h3>
    <input
      v-model="form.name"
      type="text"
      placeholder="案件名を入力してください"
      @keypress.enter="handleSubmit"
    />
    <textarea
      v-model="form.description"
      rows="2"
      placeholder="説明を入力してください（オプション）"
    />
    <button @click="handleSubmit">作成</button>
  </div>
</template>
```

#### Props

なし

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| submit | { name: string, description: string } | フォーム送信 |

#### バリデーション

| 項目 | ルール | エラーメッセージ |
|------|--------|----------------|
| name | 必須、空文字不可 | 案件名を入力してください |

---

### 5.2 ProjectCard.vue

#### テンプレート

```vue
<template>
  <div class="project-card" :class="{ 'no-project': isNoProject }">
    <h3>{{ project.name }}</h3>
    <p>{{ project.description }}</p>
    <p class="stats">
      チケット: {{ stats.total }}件 / 完了: {{ stats.completed }}件 / 進捗: {{ stats.progressRate }}%
    </p>
    <div v-if="!isNoProject" class="progress-bar">
      <div class="progress" :style="{ width: stats.progressRate + '%' }"></div>
    </div>
    <div class="actions">
      <button class="view-btn" @click="$emit('view', project.id)">
        チケット一覧
      </button>
      <button v-if="!isNoProject" class="delete-btn" @click="handleDelete">
        削除
      </button>
    </div>
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| project | Project | 要 | 案件データ |
| stats | ProjectStats | 要 | 案件統計 |
| isNoProject | boolean | 否 | 「案件なし」カードか |

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| view | number \| 'none' | チケット一覧表示 |
| delete | number | 削除 |

---

## 6. Userコンポーネント詳細

### 6.1 UserForm.vue

#### テンプレート

```vue
<template>
  <div class="add-form">
    <h3>新しいユーザーを追加</h3>
    <input
      v-model="name"
      type="text"
      placeholder="ユーザー名を入力してください"
      maxlength="100"
      @keypress.enter="handleSubmit"
    />
    <button @click="handleSubmit">追加</button>
  </div>
</template>
```

#### Props

なし

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| submit | string | ユーザー名 |

#### バリデーション

| 項目 | ルール | エラーメッセージ |
|------|--------|----------------|
| name | 必須、100文字以内 | ユーザー名を入力してください / 100文字以内で入力してください |

---

### 6.2 UserCard.vue

#### テンプレート

```vue
<template>
  <div class="user-card">
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>登録日: {{ formattedCreatedAt }}</p>
    </div>
    <div class="actions">
      <button class="delete-btn" @click="handleDelete">削除</button>
    </div>
  </div>
</template>
```

#### Props

| Props | 型 | 必須 | 説明 |
|-------|-----|------|------|
| user | User | 要 | ユーザーデータ |

#### Emits

| Event | Payload | 説明 |
|-------|---------|------|
| delete | number | 削除 |

---

## 7. ページコンポーネント詳細

### 7.1 HomeView.vue

#### テンプレート

```vue
<template>
  <div class="container">
    <header class="header">
      <h1>Spring Boot App</h1>
      <p class="subtitle">タスク管理アプリケーション</p>
    </header>

    <nav class="nav-cards">
      <NavCard
        to="/todos"
        icon="📋"
        title="チケット管理"
        description="チケットの作成・編集・進捗管理を行います。"
        color-class="card-todo"
      />
      <NavCard
        to="/projects"
        icon="📁"
        title="案件管理"
        description="案件ごとにチケットをグループ化し、進捗状況を確認できます。"
        color-class="card-project"
      />
      <NavCard
        to="/users"
        icon="👥"
        title="ユーザー管理"
        description="チケットに割り当てる担当者を登録・管理します。"
        color-class="card-user"
      />
    </nav>

    <footer class="footer">
      <p>&copy; 2024 Spring Boot Demo App</p>
    </footer>
  </div>
</template>
```

---

### 7.2 TodoView.vue

#### テンプレート概要

```vue
<template>
  <div class="container">
    <h1>ToDoリスト</h1>
    <p class="project-subtitle">{{ projectName }}</p>

    <TodoStats :total="stats.total" :completed="stats.completed" :pending="stats.pending" />

    <TodoForm :users="users" :project-id="projectId" @submit="handleAddTodo" />

    <TodoFilter v-model="filter" />

    <ErrorMessage :message="error" />
    <LoadingSpinner v-if="loading" />

    <TodoList
      v-else
      :todos="filteredTodos"
      @toggle="handleToggle"
      @delete="handleDelete"
    />

    <div class="back-link">
      <router-link to="/projects">← 案件一覧に戻る</router-link>
    </div>
  </div>
</template>
```

#### 状態（Piniaストア使用）

| 変数名 | 型 | 用途 |
|--------|-----|------|
| todos | Todo[] | ToDoリスト（ストアから） |
| loading | boolean | ローディング状態 |
| error | string \| null | エラーメッセージ |
| filter | 'all' \| 'pending' \| 'completed' | フィルタ状態 |
| projectId | string \| null | 案件ID（ルートパラメータ） |
| projectName | string | 案件名 |
| users | User[] | ユーザーリスト |

#### ライフサイクル

```typescript
onMounted(async () => {
  projectId.value = route.query.projectId as string || null
  await Promise.all([
    todoStore.fetchTodos(projectId.value),
    userStore.fetchUsers(),
    loadProjectName()
  ])
})
```

#### メソッド

| メソッド | 説明 |
|---------|------|
| handleAddTodo(data) | ToDo追加API呼び出し |
| handleToggle(id) | 完了状態切替API呼び出し |
| handleDelete(id) | 削除API呼び出し |
| loadProjectName() | 案件名取得 |

---

### 7.3 ProjectView.vue

#### テンプレート概要

```vue
<template>
  <div class="container">
    <h1>案件一覧</h1>

    <ProjectForm @submit="handleCreate" />

    <ErrorMessage :message="error" />
    <LoadingSpinner v-if="loading" />

    <div v-else>
      <p v-if="projects.length === 0" class="empty-message">
        案件がありません。
      </p>
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :stats="projectStats[project.id] || defaultStats"
        @view="navigateToTodos"
        @delete="handleDelete"
      />

      <!-- 案件なしカード -->
      <ProjectCard
        :project="{ id: 'none', name: '案件なし（未分類）', description: '' }"
        :stats="noProjectStats"
        :is-no-project="true"
        @view="navigateToTodos('none')"
      />
    </div>

    <div class="back-link">
      <router-link to="/users">ユーザー管理</router-link> |
      <router-link to="/">← ホームに戻る</router-link>
    </div>
  </div>
</template>
```

#### メソッド

| メソッド | 説明 |
|---------|------|
| handleCreate(data) | 案件作成API呼び出し |
| handleDelete(id) | 案件削除API呼び出し |
| navigateToTodos(projectId) | /todos?projectId=xxx へ遷移 |
| fetchAllStats() | 全案件の統計を取得 |

---

### 7.4 UserView.vue

#### テンプレート概要

```vue
<template>
  <div class="container">
    <h1>ユーザー管理</h1>

    <div class="stats">
      <span>登録ユーザー数: <strong>{{ users.length }}</strong>人</span>
    </div>

    <UserForm @submit="handleAdd" />

    <ErrorMessage :message="error" />
    <LoadingSpinner v-if="loading" />

    <div v-else>
      <p v-if="users.length === 0" class="empty-message">
        ユーザーが登録されていません。
      </p>
      <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @delete="handleDelete"
      />
    </div>

    <div class="back-link">
      <router-link to="/projects">← 案件一覧に戻る</router-link>
    </div>
  </div>
</template>
```

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

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
