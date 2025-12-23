# テスト戦略

> [← 目次に戻る](./README.md)

ストア設計を見直した上でなお複雑さが残る場合、ストアの性質に応じてテスト戦略を変える。

## 1. ストアの性質によるケース分類

「モックできる／できない」は二項対立ではない。

| ケース | ストアの性質 | 特徴 |
|--------|-------------|------|
| **ケース1** | 単純・決定的 | 状態が有限、遷移が単純、副作用が少ない |
| **ケース2** | 複雑だが純粋 | 遷移は複雑だが副作用がない |
| **ケース3** | 巨大・状態空間が爆発 | 状態の組み合わせが膨大 |
| **ケース4** | 非同期・外部依存が強い | API、WebSocket、Feature Flag など |
| **ケース5** | 時間・履歴に依存 | undo/redo、ワークフロー、マルチステップ |

---

## 2. ケース別テスト戦略

### 2.1 ケース1: 単純・決定的なストア → Mock が有効

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

### 2.2 ケース2: 複雑だが純粋なロジック → ストアを分解してテスト

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

### 2.3 ケース3: 巨大・状態空間が爆発 → Mock を諦める

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

### 2.4 ケース4: 非同期・外部依存が強い → ストアをテストしない

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

### 2.5 ケース5: 時間・履歴に依存 → 性質をテスト

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

## 3. 判断マトリクス

| ストアの性質 | 推奨テスト戦略 | キーワード |
|-------------|---------------|-----------|
| 単純・静的 | Mock | 初期状態注入、コンポーネントテスト |
| 複雑・純粋 | ロジック分離 | 純粋関数抽出、ドメイン層テスト |
| 巨大・爆発 | Black Box | Contract、Storybook、代表例 |
| 外部依存 | 境界分離 | Service層、MSW、統合テスト |
| 時間・履歴 | 不変条件 | Invariant、プロパティベース |

---

## 4. 診断テンプレート

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
