# フロントエンド詳細設計書 - ページコンポーネント

[← 目次に戻る](./detail-design-frontend.md)

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

#### メソッド

| メソッド | 説明 |
|---------|------|
| handleAdd(name) | ユーザー追加API呼び出し |
| handleDelete(id) | ユーザー削除API呼び出し |
