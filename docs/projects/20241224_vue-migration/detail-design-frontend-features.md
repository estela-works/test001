# フロントエンド詳細設計書 - 機能コンポーネント

[← 目次に戻る](./detail-design-frontend.md)

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
