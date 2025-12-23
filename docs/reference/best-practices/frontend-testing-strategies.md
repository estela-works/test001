# フロントエンド単体テスト戦略ガイド

Vue/React アプリケーションにおける状態管理（Store）とテストの課題を整理し、ストアの性質に応じたテスト戦略を提案する。

## 目次

1. [従来のテストが前提としていたこと](#1-従来のテストが前提としていたこと)
2. [モダンフロントエンドで崩れた前提](#2-モダンフロントエンドで崩れた前提)
3. [そもそもストアを複雑化させない](#3-そもそもストアを複雑化させない)
4. [ストアの性質によるケース分類](#4-ストアの性質によるケース分類)
5. [ケース別テスト戦略](#5-ケース別テスト戦略)
6. [判断マトリクス](#6-判断マトリクス)
7. [診断テンプレート](#7-診断テンプレート)
8. [Vue/React 具体構成例](#8-vuereact-具体構成例)

---

## 1. 従来のテストが前提としていたこと

### 1.1 関数の冪等性

従来の単体テストは「同じ入力に対して同じ出力を返す」という**冪等性**を暗黙的に前提としていた。

```javascript
// 従来の純粋関数
function add(a, b) {
  return a + b
}

// テストは簡単
expect(add(2, 3)).toBe(5)  // 何度実行しても同じ結果
```

### 1.2 関数に閉じた振る舞い

テスト対象の関数は、外部状態に依存せず、自己完結していた。

```javascript
// 入力と出力が明確
function formatPrice(price) {
  return `¥${price.toLocaleString()}`
}

// 外部依存がないためモックも不要
expect(formatPrice(1000)).toBe('¥1,000')
```

### 1.3 副作用の分離

副作用（API呼び出し、DOM操作など）は境界に集約され、ビジネスロジックと分離されていた。

```
[純粋なロジック] → テスト容易
       ↓
[副作用層] → モックで分離
```

---

## 2. モダンフロントエンドで崩れた前提

### 2.1 グローバルストアという共有状態

Vue (Pinia/Vuex) や React (Redux/Zustand) では、コンポーネント間で状態を共有するグローバルストアが存在する。

```javascript
// ストアの状態がコンポーネントの振る舞いを決定
const userStore = useUserStore()

function canEdit() {
  return userStore.currentUser.role === 'admin'
}
```

**問題**: `canEdit()` の結果は、ストアの状態という**外部要因**に依存する。

### 2.2 冪等性の喪失

同じコンポーネント、同じpropsでも、ストアの状態によって振る舞いが変わる。

```javascript
// 1回目の呼び出し（ストア: { count: 0 }）
increment()  // count → 1

// 2回目の呼び出し（ストア: { count: 1 }）
increment()  // count → 2  ← 同じ関数なのに結果が違う
```

### 2.3 状態空間の爆発

複数の状態が組み合わさることで、テストすべきケースが爆発的に増加する。

```
user.isLoggedIn × user.role × cart.items × ui.isModalOpen × ...

2 × 3 × n × 2 × ... = 組み合わせ爆発
```

### 2.4 従来のモック戦略の限界

| 従来の前提 | モダンFEの現実 |
|-----------|---------------|
| 依存は注入できる | ストアはグローバル |
| 状態は関数に閉じる | 状態は複数コンポーネントで共有 |
| 副作用は境界に集約 | 副作用がストアに散在 |
| モックは1箇所 | モックが複数箇所に波及 |

---

## 3. そもそもストアを複雑化させない

テスト戦略を考える前に、**ストアを複雑にしない設計**を目指すべきである。複雑なストアに対するテスト戦略は「すでに問題が起きた後の対処療法」であり、根本的な解決ではない。

### 3.1 なぜストアは複雑化するのか

#### 典型的な複雑化パターン

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

#### 複雑化の原因

| 原因 | 説明 |
|------|------|
| **責務の混在** | ドメイン状態、UI状態、通信状態が1つのストアに |
| **派生状態の具象化** | 計算で導出できる値を状態として保持 |
| **過度な正規化** | 関連データを細かく分割しすぎ |
| **キャッシュの混入** | サーバー状態をクライアント状態として管理 |
| **楽観的更新の複雑化** | ロールバック用の状態が増殖 |

### 3.2 ストアをシンプルに保つ原則

#### 原則1: 責務を分離する

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

#### 原則2: 派生状態は計算で導出する

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

#### 原則3: サーバー状態はサーバー状態として扱う

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

#### 原則4: UI状態はなるべくコンポーネントローカルに

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

#### 原則5: 状態の正規化は慎重に

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

### 3.3 ストア設計のチェックリスト

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

### 3.4 複雑化してしまったストアへの対処

すでに複雑化してしまった場合の段階的なリファクタリング手順。

#### ステップ1: 責務を識別する

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

#### ステップ2: 優先度をつけて分離

1. **派生状態** → getter に変換（最もリスクが低い）
2. **サーバー状態** → TanStack Query 等に移行
3. **UI状態** → コンポーネントローカルまたは別ストアに
4. **ドメイン状態** → 必要最小限に整理

#### ステップ3: テストを追加しながら進める

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

### 3.5 テスト戦略との関係

ストアをシンプルに保つことで、テスト戦略も自然とシンプルになる。

| ストアの状態 | テストの複雑さ |
|-------------|---------------|
| 全部入りストア | Mock 地獄、組み合わせ爆発 |
| 責務分離済み | 各ストアが単純、Mock が容易 |
| サーバー状態分離 | MSW でAPIだけ Mock、ストア Mock 不要 |
| 派生状態を計算 | 不整合テスト不要、入力→出力のみ |

> **最も効果的なテスト戦略は「テストしやすい設計」である。**
> 複雑なテスト手法を学ぶ前に、設計を見直すことを検討せよ。

---

## 4. ストアの性質によるケース分類

ストア設計を見直した上でなお複雑さが残る場合、ストアの性質に応じてテスト戦略を変える。「モックできる／できない」は二項対立ではない。

| ケース | ストアの性質 | 特徴 |
|--------|-------------|------|
| **ケース1** | 単純・決定的 | 状態が有限、遷移が単純、副作用が少ない |
| **ケース2** | 複雑だが純粋 | 遷移は複雑だが副作用がない |
| **ケース3** | 巨大・状態空間が爆発 | 状態の組み合わせが膨大 |
| **ケース4** | 非同期・外部依存が強い | API、WebSocket、Feature Flag など |
| **ケース5** | 時間・履歴に依存 | undo/redo、ワークフロー、マルチステップ |

---

## 5. ケース別テスト戦略

### 5.1 ケース1: 単純・決定的なストア → Mock が有効

#### 特徴

- 状態が**有限・静的**
- 遷移が単純（if / switch 程度）
- 非同期・副作用が少ない
- 依存関係が少ない

```typescript
// シンプルな状態定義
type State = {
  isOpen: boolean
  count: number
}
```

#### 推奨方式

**ストアを丸ごと Mock**

Pinia / Redux をテスト用に差し替え、初期 state を注入する。

```javascript
// Vue + Pinia の例
import { createTestingPinia } from '@pinia/testing'

createTestingPinia({
  initialState: {
    counter: { count: 3 }
  }
})
```

```javascript
// React + Redux の例
import { renderWithProviders } from './test-utils'

renderWithProviders(<Component />, {
  preloadedState: {
    counter: { count: 3 }
  }
})
```

**コンポーネントテスト**

- props + store state → DOM / event
- 内部状態は見ない

#### 適用場面

- UI コンポーネント
- フォーム
- 表示切り替え系

> **最も一般的でコスパが良い方式**

---

### 5.2 ケース2: 複雑だが純粋なロジック → ストアを分解してテスト

#### 特徴

- 状態遷移が複雑（条件分岐が多い）
- ただし**副作用はない**
- ビジネスルールが中心

```javascript
// reducer / action が肥大化している
function cartReducer(state, action) {
  // 100行以上の複雑なロジック...
}
```

#### 推奨方式

**ストアを「ドメインロジック」として分離**

```javascript
// domain/calcPrice.ts - ストアから独立した純粋関数
export function calcPrice(items, discounts, taxRate) {
  // 複雑な計算ロジック
  return { subtotal, tax, total }
}
```

**純粋関数として Unit Test**

```javascript
// 入力と出力が明確なのでテストが容易
describe('calcPrice', () => {
  it('割引が正しく適用される', () => {
    const result = calcPrice(
      [{ price: 1000, quantity: 2 }],
      [{ type: 'percent', value: 10 }],
      0.1
    )
    expect(result.total).toBe(1980)  // 2000 - 10% + tax
  })
})
```

**ストア自体は最小限の統合テスト**

コンポーネントテストでは、ロジックを信頼し、ストアは最小モック or 実ストアで。

#### 適用場面

- 金額計算
- 権限判定
- 状態遷移ルール

> **「Mock 困難」を根本的に解消する設計アプローチ**

---

### 5.3 ケース3: 巨大・状態空間が爆発 → Mock を諦める

#### 特徴

- 状態の組み合わせが膨大
- if/else だらけ
- 「全パターン再現」は不可能
- Mock が壊れやすい

```
user × role × featureFlag × apiState × route × ...
```

#### 推奨方式

**戦略A: ストアは Black Box 扱い**

ストアの状態は考慮せず、コンポーネント単位の**contract**を定義する。

```yaml
Given:
  props: { userId: 123 }
When:
  user clicks "削除" button
Then:
  emits: "delete" event with userId
```

テスト対象:
- props
- emits / callbacks
- DOM 出力

ストアは最低限の stub、または実ストア（初期化のみ）で。

> **「ストアがどうなっても壊れない UI」を測定する**

**戦略B: Storybook + Interaction Test**

状態を「列挙」ではなく「代表例」で扱う。

```javascript
// Story = 状態のスナップショット
export const LoggedIn = {
  args: { user: mockUser }
}

export const LoggedOut = {
  args: { user: null }
}

// Interaction = ユーザー操作
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByRole('button'))
  expect(canvas.getByText('送信完了')).toBeInTheDocument()
}
```

> **Mock 地獄をシナリオに変換する**

#### 適用場面

- 複雑なダッシュボード
- 権限×機能フラグの組み合わせが多いUI
- レガシーコードのテスト追加

---

### 5.4 ケース4: 非同期・外部依存が強い → ストアをテストしない

#### 特徴

- API 呼び出し
- WebSocket
- IndexedDB
- Feature Flag
- 時刻依存

#### NG パターン

```javascript
// アンチパターン: 全部 Mock して内部状態を精密に再現
jest.mock('./api')
jest.mock('./websocket')
jest.mock('./featureFlag')
// → モックのメンテナンスが本体より大変になる
```

#### 推奨方式: 境界で分離

**設計**

```
UI（表示ロジック）
     ↓
Store（調停役・薄く保つ）
     ↓
Service / Gateway（外部依存）
```

**テスト戦略**

| レイヤ | テスト方式 |
|-------|----------|
| Service | モック or 契約テスト（API スキーマ検証） |
| Store | 薄く（統合テストで十分） |
| UI | Black Box（APIレスポンスのみ固定） |

```javascript
// UI テストでは API レスポンスのみ固定、Store の中身は無視
server.use(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Test User' }]))
  })
)

render(<UserList />)
expect(await screen.findByText('Test User')).toBeInTheDocument()
```

> **「動くかどうか」だけを見る**

---

### 5.5 ケース5: 時間・履歴に依存 → 性質をテスト

#### 例

- undo / redo
- workflow（申請→承認→完了）
- マルチステップフォーム

#### 推奨方式

**不変条件（Invariant）テスト**

状態がどう遷移しても壊れてはいけないルールを定義する。

```javascript
// 常に成り立つべき条件
describe('invariants', () => {
  it('count は常に 0 以上', () => {
    // 任意の操作列を実行
    store.dispatch(randomActions())

    expect(store.getState().count).toBeGreaterThanOrEqual(0)
  })

  it('selected は常に items に含まれる', () => {
    store.dispatch(randomActions())

    const { selected, items } = store.getState()
    if (selected !== null) {
      expect(items).toContain(selected)
    }
  })
})
```

**プロパティベーステスト（可能なら）**

```javascript
import fc from 'fast-check'

fc.assert(
  fc.property(
    fc.array(fc.oneof(
      fc.constant({ type: 'INCREMENT' }),
      fc.constant({ type: 'DECREMENT' }),
      fc.constant({ type: 'RESET' })
    )),
    (actions) => {
      const state = actions.reduce(reducer, initialState)
      return state.count >= 0  // 不変条件
    }
  )
)
```

> **状態の列挙を捨て、性質で検証する**

---

## 6. 判断マトリクス

| ストアの性質 | 推奨テスト戦略 | キーワード |
|-------------|---------------|-----------|
| 単純・静的 | Mock | 初期状態注入、コンポーネントテスト |
| 複雑・純粋 | ロジック分離 | 純粋関数抽出、ドメイン層テスト |
| 巨大・爆発 | Black Box | Contract、Storybook、代表例 |
| 外部依存 | 境界分離 | Service層、MSW、統合テスト |
| 時間・履歴 | 不変条件 | Invariant、プロパティベース |

---

## 7. 診断テンプレート

自分のストアがどのケースに当てはまるかを診断する。

### 診断チェックリスト

```markdown
## ストア診断: [ストア名]

### 1. 状態の複雑さ
- [ ] 状態のプロパティは5個以下
- [ ] 状態の型は primitive が中心
- [ ] ネストは2階層以下

→ 全て Yes → **ケース1（単純）**

### 2. ロジックの性質
- [ ] 副作用（API、タイマー等）がある
- [ ] 外部サービスに依存している
- [ ] 非同期処理が含まれている

→ 全て No → **ケース2（純粋）**
→ いずれか Yes → **ケース4（外部依存）**

### 3. 状態空間
- [ ] 取りうる状態の組み合わせを列挙できる
- [ ] 10パターン以下でカバーできる

→ いずれか No → **ケース3（巨大）**

### 4. 時間依存
- [ ] undo/redo がある
- [ ] 履歴を保持している
- [ ] ステップ/フェーズの概念がある

→ いずれか Yes → **ケース5（時間依存）**
```

### 診断結果の活用

| 診断結果 | 次のアクション |
|---------|--------------|
| ケース1 | Testing Library + Mock Store で進める |
| ケース2 | ロジックを純粋関数に抽出 → Unit Test |
| ケース3 | Black Box 戦略 or Storybook 導入 |
| ケース4 | Service 層を分離 → 境界でテスト |
| ケース5 | 不変条件を定義 → プロパティテスト検討 |

---

## 8. Vue/React 具体構成例

### 8.1 Vue + Pinia 構成

#### ケース1: 単純なストア

```typescript
// stores/ui.ts
export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: false,
    theme: 'light' as 'light' | 'dark'
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    }
  }
})
```

```typescript
// components/Sidebar.test.ts
import { createTestingPinia } from '@pinia/testing'

describe('Sidebar', () => {
  it('開閉状態に応じてクラスが変わる', () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [createTestingPinia({
          initialState: { ui: { isSidebarOpen: true } }
        })]
      }
    })

    expect(wrapper.classes()).toContain('sidebar--open')
  })
})
```

#### ケース2: ロジック分離

```typescript
// domain/cart.ts - 純粋関数として抽出
export function calculateCartTotal(
  items: CartItem[],
  discount: Discount | null
): CartTotal {
  const subtotal = items.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  )

  const discountAmount = discount
    ? applyDiscount(subtotal, discount)
    : 0

  return {
    subtotal,
    discountAmount,
    total: subtotal - discountAmount
  }
}

// domain/cart.test.ts
describe('calculateCartTotal', () => {
  it('割引なしの場合', () => {
    const items = [{ price: 100, quantity: 2 }]
    const result = calculateCartTotal(items, null)

    expect(result.total).toBe(200)
  })

  it('パーセント割引の場合', () => {
    const items = [{ price: 100, quantity: 2 }]
    const discount = { type: 'percent', value: 10 }
    const result = calculateCartTotal(items, discount)

    expect(result.total).toBe(180)
  })
})
```

```typescript
// stores/cart.ts - ストアは薄く
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [], discount: null }),
  getters: {
    // ドメインロジックに委譲
    total: (state) => calculateCartTotal(state.items, state.discount)
  }
})
```

### 8.2 React + Redux Toolkit 構成

#### ケース1: 単純なストア

```typescript
// store/slices/ui.ts
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: false,
    theme: 'light' as const
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    }
  }
})
```

```typescript
// components/Sidebar.test.tsx
import { renderWithProviders } from '../test-utils'

describe('Sidebar', () => {
  it('開閉状態に応じてクラスが変わる', () => {
    const { container } = renderWithProviders(<Sidebar />, {
      preloadedState: {
        ui: { isSidebarOpen: true, theme: 'light' }
      }
    })

    expect(container.firstChild).toHaveClass('sidebar--open')
  })
})
```

#### ケース4: 外部依存の分離

```typescript
// services/userService.ts - 外部依存を分離
export const userService = {
  async fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/users')
    return response.json()
  },

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }
}
```

```typescript
// components/UserList.test.tsx
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]))
  })
)

describe('UserList', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('ユーザー一覧が表示される', async () => {
    render(<UserList />)

    // Store の中身は気にせず、表示結果だけを検証
    expect(await screen.findByText('Alice')).toBeInTheDocument()
    expect(await screen.findByText('Bob')).toBeInTheDocument()
  })
})
```

---

## まとめ

### 重要な認識

**Mock が難しいのは「テストが下手」ではなく、設計や抽象化の境界が間違っているサインであることが多い。**

### 基本方針

1. **まずストアをシンプルに保つ** - 複雑なテスト戦略は対処療法に過ぎない
2. **Mock できるならする** - ケース1は積極的に Mock
3. **できないならやり方を変える** - ケース2〜5は戦略を切り替え
4. **「全状態をテストしよう」としない** - 代表例、不変条件で十分
5. **UI は contract、安全性、振る舞いで測る** - 内部状態に依存しない

### テスト戦略選択のフローチャート

```
ストアが複雑になっている？
    │
    ├─ Yes → まず設計を見直す（セクション3参照）
    │         │
    │         └─ 見直し後もなお複雑 → 下へ
    │
    └─ No（または見直し後）
              │
              ストアの状態は単純か？
                  │
                  ├─ Yes → Mock で OK
                  │
                  └─ No → ロジックは純粋か？
                            │
                            ├─ Yes → ロジック分離 + 純粋関数テスト
                            │
                            └─ No → 外部依存が強いか？
                                      │
                                      ├─ Yes → 境界分離 + Service 層テスト
                                      │
                                      └─ No → 時間/履歴依存か？
                                                │
                                                ├─ Yes → 不変条件テスト
                                                │
                                                └─ No → Black Box / Storybook
```

---

## 関連ドキュメント

- [テストガイド](../../testing/TEST_GUIDE.md) - バックエンドテストの方針
- [アーキテクチャ仕様書](../../specs/architecture.md) - システム全体構成
