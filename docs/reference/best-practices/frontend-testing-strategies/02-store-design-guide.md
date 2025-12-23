# ストア設計ガイド

> [← 目次に戻る](./README.md)

テスト戦略を考える前に、**ストアを複雑にしない設計**を目指すべきである。複雑なストアに対するテスト戦略は「すでに問題が起きた後の対処療法」であり、根本的な解決ではない。

## 1. なぜストアは複雑化するのか

### 典型的な複雑化パターン

```javascript
// 最初はシンプルだったストア
const store = {
  users: [],
  currentUser: null
}

// 機能追加のたびに状態が増殖
const store = {
  users: [],
  currentUser: null,
  isLoading: false,           // ← ローディング状態
  error: null,                // ← エラー状態
  selectedUserId: null,       // ← 選択状態
  filterText: '',             // ← フィルタ状態
  sortOrder: 'asc',           // ← ソート状態
  page: 1,                    // ← ページネーション
  hasMore: true,              // ← 追加読み込み可否
  lastFetchedAt: null,        // ← キャッシュ管理
  editingUser: null,          // ← 編集中データ
  isModalOpen: false,         // ← UI状態まで混入
  // ... 際限なく増え続ける
}
```

### 複雑化の原因

| 原因 | 説明 |
|------|------|
| **責務の混在** | ドメイン状態、UI状態、通信状態が1つのストアに |
| **派生状態の具象化** | 計算で導出できる値を状態として保持 |
| **過度な正規化** | 関連データを細かく分割しすぎ |
| **キャッシュの混入** | サーバー状態をクライアント状態として管理 |
| **楽観的更新の複雑化** | ロールバック用の状態が増殖 |

---

## 2. ストアをシンプルに保つ原則

### 原則1: 責務を分離する

**NG: 全部入りストア**
```javascript
// 1つのストアに全てが混在
const useAppStore = defineStore('app', {
  state: () => ({
    // ドメイン状態
    todos: [],
    // UI状態
    isSidebarOpen: false,
    // 通信状態
    isLoading: false,
    error: null,
    // フォーム状態
    editingTodo: null
  })
})
```

**OK: 責務ごとに分離**
```javascript
// ドメイン状態のみ
const useTodoStore = defineStore('todo', {
  state: () => ({ todos: [] })
})

// UI状態は別管理（またはコンポーネントローカル）
const useUiStore = defineStore('ui', {
  state: () => ({ isSidebarOpen: false })
})

// 通信状態は TanStack Query / SWR に委譲
const { data, isLoading, error } = useQuery(['todos'], fetchTodos)
```

### 原則2: 派生状態は計算で導出する

**NG: 派生状態を保持**
```javascript
state: () => ({
  todos: [],
  completedCount: 0,      // ← todos から計算可能
  incompleteCount: 0,     // ← todos から計算可能
  completionRate: 0       // ← todos から計算可能
})
```

**OK: getter/selector で計算**
```javascript
state: () => ({
  todos: []
}),
getters: {
  completedCount: (state) => state.todos.filter(t => t.completed).length,
  incompleteCount: (state) => state.todos.filter(t => !t.completed).length,
  completionRate: (state) => {
    if (state.todos.length === 0) return 0
    return state.todos.filter(t => t.completed).length / state.todos.length
  }
}
```

**利点**: 状態の一貫性が自動的に保証される。不整合が発生しない。

### 原則3: サーバー状態はサーバー状態として扱う

**NG: サーバーデータをストアで管理**
```javascript
// クライアントでサーバー状態を「管理」しようとする
const store = {
  users: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  invalidated: false
}
```

**OK: サーバー状態専用ライブラリに委譲**
```javascript
// TanStack Query (React) / Vue Query (Vue)
const { data: users, isLoading, error, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000  // 5分間キャッシュ
})

// ストアには「クライアントだけが知っている状態」のみ
const useUiStore = defineStore('ui', {
  state: () => ({
    selectedUserId: null  // サーバーには存在しないUI状態
  })
})
```

### 原則4: UI状態はなるべくコンポーネントローカルに

**NG: 全てのUI状態をグローバルに**
```javascript
// モーダルの開閉までグローバルストアに
const store = {
  isUserModalOpen: false,
  isConfirmDialogOpen: false,
  activeTab: 'general',
  tooltipTarget: null
}
```

**OK: UI状態はコンポーネントで管理**
```vue
<script setup>
// コンポーネントローカルで十分
const isModalOpen = ref(false)
const activeTab = ref('general')
</script>
```

**グローバルにすべきUI状態**:
- 複数の離れたコンポーネントで共有する状態（テーマ、サイドバー開閉）
- ページ遷移後も維持すべき状態

### 原則5: 状態の正規化は慎重に

**過度な正規化（避けるべき）**
```javascript
// リレーショナルDB的な正規化
const store = {
  users: { 1: { id: 1, name: 'Alice' } },
  posts: { 1: { id: 1, authorId: 1, title: '...' } },
  comments: { 1: { id: 1, postId: 1, authorId: 1 } }
}
// → 表示のたびに結合が必要、複雑なセレクタ、バグの温床
```

**適度な非正規化**
```javascript
// 表示に必要な形でデータを保持
const store = {
  posts: [
    {
      id: 1,
      title: '...',
      author: { id: 1, name: 'Alice' },  // 埋め込み
      commentCount: 5                     // 集計値も保持
    }
  ]
}
```

---

## 3. ストア設計のチェックリスト

新しいストアを作成する前、または既存ストアをリファクタリングする際に確認する。

```markdown
## ストア設計チェック

### 責務の分離
- [ ] ドメイン状態とUI状態が分離されているか
- [ ] 通信状態（loading/error）はサーバー状態ライブラリに委譲しているか
- [ ] フォーム状態はコンポーネントローカルまたはフォームライブラリに委譲しているか

### 派生状態
- [ ] 他の状態から計算できる値を状態として保持していないか
- [ ] getter/selector で導出できないか確認したか

### スコープ
- [ ] このUI状態は本当にグローバルに必要か
- [ ] コンポーネントローカルで済まないか確認したか

### 複雑さ
- [ ] 状態のプロパティは10個以下か
- [ ] ネストは2階層以下か
- [ ] 1つのストアの責務を1文で説明できるか
```

---

## 4. 複雑化してしまったストアへの対処

すでに複雑化してしまった場合の段階的なリファクタリング手順。

### ステップ1: 責務を識別する

```javascript
// 現状のストアを責務ごとに色分け
const store = {
  // 🟢 ドメイン状態
  todos: [],

  // 🟡 UI状態（グローバル不要かも）
  selectedTodoId: null,
  isModalOpen: false,

  // 🔴 サーバー状態（ライブラリに委譲すべき）
  isLoading: false,
  error: null,

  // 🟣 派生状態（計算で導出すべき）
  completedCount: 0
}
```

### ステップ2: 優先度をつけて分離

1. **派生状態** → getter に変換（最もリスクが低い）
2. **サーバー状態** → TanStack Query 等に移行
3. **UI状態** → コンポーネントローカルまたは別ストアに
4. **ドメイン状態** → 必要最小限に整理

### ステップ3: テストを追加しながら進める

```javascript
// リファクタリング前にテストを書く
describe('TodoStore', () => {
  it('completedCount は todos から導出される', () => {
    const store = useTodoStore()
    store.todos = [
      { id: 1, completed: true },
      { id: 2, completed: false }
    ]

    expect(store.completedCount).toBe(1)
  })
})

// テストが通ることを確認してから getter に変換
```

---

## 5. テスト戦略との関係

ストアをシンプルに保つことで、テスト戦略も自然とシンプルになる。

| ストアの状態 | テストの複雑さ |
|-------------|---------------|
| 全部入りストア | Mock 地獄、組み合わせ爆発 |
| 責務分離済み | 各ストアが単純、Mock が容易 |
| サーバー状態分離 | MSW でAPIだけ Mock、ストア Mock 不要 |
| 派生状態を計算 | 不整合テスト不要、入力→出力のみ |

> **最も効果的なテスト戦略は「テストしやすい設計」である。**
> 複雑なテスト手法を学ぶ前に、設計を見直すことを検討せよ。
