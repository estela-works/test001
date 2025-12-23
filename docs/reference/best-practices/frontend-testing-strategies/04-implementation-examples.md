# 実装例

> [← 目次に戻る](./README.md)

## 1. Vue + Pinia 構成

### ケース1: 単純なストア

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

### ケース2: ロジック分離

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

---

## 2. React + Redux Toolkit 構成

### ケース1: 単純なストア

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

### ケース4: 外部依存の分離

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
    ├─ Yes → まず設計を見直す（ストア設計ガイド参照）
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
