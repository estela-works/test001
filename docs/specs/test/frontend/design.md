# フロントエンドテスト設計方針

> **ドキュメント種別**: 設計ガイドライン（継続的にメンテナンス）

## 1. 概要

本ドキュメントは、Vue.js 3 + Pinia で構成されるフロントエンドのテスト設計方針を定義する。

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2026-01-08 |
| テストフレームワーク | Vitest |
| コンポーネントテスト | @vue/test-utils |
| DOM環境 | jsdom |

---

## 2. テストレイヤー構成

### 2.1 構成図

```
┌─────────────────────────────────────────────────────────────┐
│                   コンポーネントテスト                        │
│              @vue/test-utils + Vitest                       │
│             描画・ユーザーイベント・Props検証                 │
├─────────────────────────────────────────────────────────────┤
│                     ストアテスト                              │
│                   Pinia + Vitest                            │
│               状態管理・アクション・ゲッター検証              │
├─────────────────────────────────────────────────────────────┤
│                  ユーティリティテスト                         │
│                      Vitest                                 │
│                純粋関数・ヘルパー関数検証                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 レイヤー別責務

| レイヤー | テスト対象 | モック対象 | 優先度 |
|---------|-----------|-----------|--------|
| ストア | 状態管理、アクション、API連携 | API呼び出し | 高 |
| コンポーネント | 描画、イベント、Props | ストア、Router | 中 |
| ユーティリティ | 純粋関数、フォーマッター | なし | 高 |

---

## 3. ストアテスト

### 3.1 目的

- 状態管理の正確性を検証
- アクション（API連携含む）の動作を検証
- ゲッターの計算結果を検証

### 3.2 テスト構成

```typescript
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodoStore } from '@/stores/todoStore';

describe('todoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
});
```

### 3.3 検証項目

| 分類 | 検証内容 | 例 |
|------|---------|-----|
| 初期状態 | state の初期値 | todos: [], loading: false |
| アクション | 非同期処理、状態変更 | fetchTodos, createTodo |
| ゲッター | 計算プロパティ | filteredTodos, todoCount |
| エラー処理 | API失敗時の状態 | error 状態の設定 |

### 3.4 コード例

```typescript
describe('todoStore', () => {
  describe('fetchTodos', () => {
    it('正常系: APIからTodo一覧を取得できる', async () => {
      // Arrange
      const store = useTodoStore();
      const mockTodos = [
        { id: 1, title: 'Todo1', status: 'NOT_STARTED' },
        { id: 2, title: 'Todo2', status: 'IN_PROGRESS' },
      ];
      vi.spyOn(api, 'getTodos').mockResolvedValue({ data: mockTodos });

      // Act
      await store.fetchTodos();

      // Assert
      expect(store.todos).toEqual(mockTodos);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('異常系: API失敗時にエラーがセットされる', async () => {
      // Arrange
      const store = useTodoStore();
      vi.spyOn(api, 'getTodos').mockRejectedValue(new Error('Network Error'));

      // Act
      await store.fetchTodos();

      // Assert
      expect(store.todos).toEqual([]);
      expect(store.error).toBe('Network Error');
    });
  });

  describe('getters', () => {
    it('filteredTodos: ステータスでフィルタできる', () => {
      // Arrange
      const store = useTodoStore();
      store.todos = [
        { id: 1, title: 'Todo1', status: 'NOT_STARTED' },
        { id: 2, title: 'Todo2', status: 'IN_PROGRESS' },
        { id: 3, title: 'Todo3', status: 'NOT_STARTED' },
      ];
      store.filter = { status: 'NOT_STARTED' };

      // Act & Assert
      expect(store.filteredTodos).toHaveLength(2);
      expect(store.filteredTodos.every(t => t.status === 'NOT_STARTED')).toBe(true);
    });
  });
});
```

---

## 4. コンポーネントテスト

### 4.1 目的

- コンポーネントが正しく描画されることを検証
- ユーザーイベントに正しく反応することを検証
- Props / Emit の動作を検証

### 4.2 テスト構成

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import TodoCard from '@/components/TodoCard.vue';

describe('TodoCard', () => {
  const createWrapper = (props = {}) => {
    return mount(TodoCard, {
      props: {
        todo: { id: 1, title: 'Test Todo', status: 'NOT_STARTED' },
        ...props,
      },
      global: {
        plugins: [createTestingPinia()],
      },
    });
  };
});
```

### 4.3 検証項目

| 分類 | 検証内容 | 例 |
|------|---------|-----|
| 描画 | 要素の存在、テキスト | タイトル表示、ボタン存在 |
| Props | Props による表示変化 | disabled 状態 |
| イベント | ユーザー操作の結果 | クリック、入力 |
| Emit | 親への通知 | @update, @delete |
| 条件分岐 | 条件による表示切替 | v-if, v-show |

### 4.4 コード例

```typescript
describe('TodoCard', () => {
  describe('描画', () => {
    it('Todoのタイトルが表示される', () => {
      // Arrange
      const wrapper = createWrapper({
        todo: { id: 1, title: 'テストTodo', status: 'NOT_STARTED' },
      });

      // Assert
      expect(wrapper.text()).toContain('テストTodo');
    });

    it('削除ボタンが表示される', () => {
      // Arrange
      const wrapper = createWrapper();

      // Assert
      expect(wrapper.find('[data-testid="delete-button"]').exists()).toBe(true);
    });
  });

  describe('イベント', () => {
    it('削除ボタンクリックで delete イベントが発火する', async () => {
      // Arrange
      const wrapper = createWrapper({
        todo: { id: 1, title: 'Test', status: 'NOT_STARTED' },
      });

      // Act
      await wrapper.find('[data-testid="delete-button"]').trigger('click');

      // Assert
      expect(wrapper.emitted('delete')).toBeTruthy();
      expect(wrapper.emitted('delete')[0]).toEqual([1]);
    });
  });

  describe('条件分岐', () => {
    it('完了ステータスの場合、完了マークが表示される', () => {
      // Arrange
      const wrapper = createWrapper({
        todo: { id: 1, title: 'Test', status: 'COMPLETED' },
      });

      // Assert
      expect(wrapper.find('.completed-mark').exists()).toBe(true);
    });

    it('未完了ステータスの場合、完了マークが表示されない', () => {
      // Arrange
      const wrapper = createWrapper({
        todo: { id: 1, title: 'Test', status: 'NOT_STARTED' },
      });

      // Assert
      expect(wrapper.find('.completed-mark').exists()).toBe(false);
    });
  });
});
```

---

## 5. ユーティリティテスト

### 5.1 目的

- 純粋関数の正確性を検証
- フォーマッター、バリデーター等の動作確認
- 境界値・エッジケースの検証

### 5.2 テスト構成

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate, validateEmail } from '@/utils/helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    // テストケース
  });
});
```

### 5.3 コード例

```typescript
describe('formatDate', () => {
  it('正常系: 日付を YYYY/MM/DD 形式にフォーマットする', () => {
    // Arrange
    const date = new Date('2026-01-08');

    // Act
    const result = formatDate(date);

    // Assert
    expect(result).toBe('2026/01/08');
  });

  it('境界値: null の場合は空文字を返す', () => {
    // Act
    const result = formatDate(null);

    // Assert
    expect(result).toBe('');
  });
});

describe('validateEmail', () => {
  it.each([
    ['test@example.com', true],
    ['user.name@domain.co.jp', true],
    ['invalid-email', false],
    ['@nodomain.com', false],
    ['', false],
  ])('入力 "%s" は %s を返す', (input, expected) => {
    expect(validateEmail(input)).toBe(expected);
  });
});
```

---

## 6. モック戦略

### 6.1 モック対象

| 対象 | モック方法 | 用途 |
|------|-----------|------|
| API呼び出し | vi.mock / vi.spyOn | ストアテスト |
| Router | createRouter (mock) | ナビゲーションテスト |
| Store | @pinia/testing | コンポーネントテスト |
| 外部ライブラリ | vi.mock | 外部依存の排除 |

### 6.2 モック例

#### API モック

```typescript
// api.ts のモック
vi.mock('@/api', () => ({
  getTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

// テスト内での設定
import * as api from '@/api';
vi.mocked(api.getTodos).mockResolvedValue({ data: mockTodos });
```

#### Router モック

```typescript
import { createRouter, createMemoryHistory } from 'vue-router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/todos', component: { template: '<div>Todos</div>' } },
  ],
});

const wrapper = mount(Component, {
  global: {
    plugins: [router],
  },
});
```

#### Store モック（@pinia/testing）

```typescript
import { createTestingPinia } from '@pinia/testing';

const wrapper = mount(Component, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          todo: { todos: mockTodos, loading: false },
        },
        stubActions: false, // アクションを実行する場合
      }),
    ],
  },
});
```

---

## 7. テストデータ管理

### 7.1 ファクトリ関数

```typescript
// tests/factories/todoFactory.ts
export const createTestTodo = (overrides = {}): Todo => ({
  id: 1,
  title: 'テストTodo',
  description: '',
  status: 'NOT_STARTED',
  priority: 'MEDIUM',
  dueDate: null,
  createdAt: '2026-01-08T00:00:00',
  updatedAt: '2026-01-08T00:00:00',
  ...overrides,
});

export const createTestTodoList = (count: number): Todo[] => {
  return Array.from({ length: count }, (_, i) =>
    createTestTodo({ id: i + 1, title: `Todo ${i + 1}` })
  );
};
```

### 7.2 使用例

```typescript
import { createTestTodo, createTestTodoList } from '@/tests/factories/todoFactory';

describe('TodoList', () => {
  it('Todoが10件表示される', () => {
    const todos = createTestTodoList(10);
    const wrapper = mount(TodoList, {
      props: { todos },
    });
    expect(wrapper.findAll('.todo-item')).toHaveLength(10);
  });
});
```

---

## 8. data-testid 規則

### 8.1 命名規則

| パターン | 例 | 用途 |
|---------|-----|------|
| `{component}-{element}` | `todo-card-title` | 要素の特定 |
| `{action}-button` | `delete-button` | アクションボタン |
| `{element}-{index}` | `todo-item-0` | リストアイテム |

### 8.2 使用方針

```vue
<template>
  <div data-testid="todo-card">
    <h3 data-testid="todo-card-title">{{ todo.title }}</h3>
    <button data-testid="delete-button" @click="handleDelete">
      削除
    </button>
  </div>
</template>
```

```typescript
// テストでの使用
wrapper.find('[data-testid="todo-card-title"]');
wrapper.find('[data-testid="delete-button"]');
```

---

## 9. テストカバレッジ目標

| 対象 | 目標 | 重点項目 |
|------|------|---------|
| ストア | 80%以上 | アクション、ゲッター |
| コンポーネント | 60%以上 | 主要コンポーネント |
| ユーティリティ | 90%以上 | 全関数 |

### 9.1 カバレッジ対象外

- 型定義ファイル（.d.ts）
- 設定ファイル（vite.config.ts 等）
- index.ts（エクスポートのみ）

---

## 10. ベストプラクティス

### 10.1 推奨事項

| 項目 | 内容 |
|------|------|
| **ユーザー視点** | 実装詳細ではなくユーザー行動をテスト |
| **data-testid** | クラス名やタグではなく data-testid で要素を特定 |
| **非同期処理** | await / waitFor で非同期完了を待つ |
| **ファクトリ関数** | テストデータ生成を共通化 |
| **1テスト1検証** | 1つのテストで1つの振る舞いを検証 |

### 10.2 アンチパターン

| 避けるべきこと | 理由 | 代替 |
|--------------|------|------|
| snapshot テストの多用 | 変更に弱い | 明示的なアサーション |
| 実装詳細のテスト | リファクタリング耐性がない | ユーザー視点のテスト |
| setTimeout での待機 | 不安定 | waitFor / flushPromises |
| クラス名での要素特定 | スタイル変更で壊れる | data-testid |

---

## 11. 関連ドキュメント

| ドキュメント | 説明 |
|--------------|------|
| [../philosophy.md](../philosophy.md) | テスト設計思想（全体） |
| [catalog/](catalog/) | フロントエンドテストカタログ |
| [../../frontend/](../../frontend/) | フロントエンド仕様 |

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-01-08 | 初版作成 |
