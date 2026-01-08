# テスト実行方法・設定

[← 目次に戻る](./README.md)

---

## 1. テスト実行方法

```bash
# frontendディレクトリに移動
cd src/frontend

# 全テスト実行
npm test

# ウォッチモードで実行（ファイル変更時に自動再実行）
npm run test

# 単発実行（CI向け）
npm run test:run

# 特定ファイルのテスト実行
npx vitest run src/stores/todoStore.spec.ts
npx vitest run src/components/todo/TodoStats.spec.ts

# 特定パターンにマッチするテスト実行
npx vitest run --grep "todoStore"
```

---

## 2. テスト設定

### 2.1 設定ファイル

| ファイル | 用途 |
|----------|------|
| vitest.config.ts | Vitest設定（テスト環境、カバレッジ等） |
| tsconfig.json | TypeScript設定 |

### 2.2 テスト環境

| 項目 | 設定値 |
|------|--------|
| テストフレームワーク | Vitest 1.2.0 |
| DOM環境 | jsdom 23.0.0 |
| コンポーネントテスト | @vue/test-utils 2.4.0 |
| モック | vi.mock() / vi.spyOn() |

### 2.3 ディレクトリ構造

```
src/frontend/src/
├── components/
│   ├── common/
│   │   └── ErrorMessage.spec.ts
│   ├── todo/
│   │   ├── TodoStats.spec.ts
│   │   ├── TodoFilter.spec.ts
│   │   ├── TodoSearchForm.spec.ts
│   │   └── TodoTableRow.spec.ts
│   └── user/
│       └── UserCard.spec.ts
├── stores/
│   ├── todoStore.spec.ts
│   ├── projectStore.spec.ts
│   └── userStore.spec.ts
└── types/
    └── filter.spec.ts
```

---

## 3. テストパターン

### 3.1 ストアテスト

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from './todoStore'
import * as todoService from '@/services/todoService'

vi.mock('@/services/todoService')

describe('todoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('テストケース', async () => {
    vi.mocked(todoService.getAll).mockResolvedValue([])
    const store = useTodoStore()
    await store.fetchTodos()
    expect(store.todos).toEqual([])
  })
})
```

### 3.2 コンポーネントテスト

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoStats from './TodoStats.vue'

describe('TodoStats', () => {
  it('統計情報を正しく表示する', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 10,
        completed: 4,
        pending: 6
      }
    })

    expect(wrapper.text()).toContain('総数: 10')
  })
})
```

---

## 4. よくある問題と対処

### 4.1 Piniaストアのテスト

**問題**: `getActivePinia was called with no active Pinia`

**対処**: `beforeEach`で`setActivePinia(createPinia())`を呼び出す

### 4.2 サービスのモック

**問題**: APIサービスの実際の呼び出しを防ぎたい

**対処**: `vi.mock('@/services/todoService')`でモジュール全体をモック化

### 4.3 非同期処理のテスト

**問題**: `await`後の状態が反映されない

**対処**: `await flushPromises()`または`await nextTick()`を使用

---

[← 目次に戻る](./README.md)
