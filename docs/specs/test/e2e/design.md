# E2Eテスト設計方針

> **ドキュメント種別**: 設計ガイドライン（継続的にメンテナンス）

## 1. 概要

本ドキュメントは、Playwrightを使用したE2E（End-to-End）テストの設計方針を定義する。

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2026-01-08 |
| テストフレームワーク | Playwright |
| 対象ブラウザ | Chromium, Firefox, WebKit |
| ベースURL | http://localhost:8080 |

---

## 2. E2Eテストの位置づけ

### 2.1 テストピラミッドにおける役割

```
        /\
       /  \     ← E2Eテスト（ここ）
      / E2E\       - ユーザーシナリオの検証
     /------\      - 主要フローの動作確認
    /        \     - 少数・高価値
   /  FE/BE   \
  /------------\
```

### 2.2 E2Eテストの目的

| 目的 | 説明 |
|------|------|
| **統合動作確認** | フロントエンド・バックエンド・DBが連携して動作することを確認 |
| **ユーザー視点** | 実際のユーザー操作をシミュレートして検証 |
| **リグレッション防止** | デプロイ前の最終確認として機能 |
| **クリティカルパス保護** | 主要業務フローが壊れていないことを保証 |

### 2.3 E2Eテストで検証すべきこと/すべきでないこと

| 検証すべきこと | 検証すべきでないこと |
|--------------|-------------------|
| 主要ユーザーシナリオ | 個別のビジネスロジック |
| 画面遷移フロー | バリデーションの網羅 |
| CRUD操作の一連の流れ | エッジケース |
| 重要なエラーハンドリング | 細かいUI表示 |

---

## 3. テスト設計方針

### 3.1 シナリオベース設計

E2Eテストはシナリオベースで設計する。1つのテストケースは、ユーザーの一連の操作フローを表現する。

```typescript
test('ユーザーは新規Todoを作成し、完了にして削除できる', async ({ page }) => {
  // シナリオ: Todoのライフサイクル全体をテスト
  // 1. 新規作成
  // 2. ステータス変更
  // 3. 削除
});
```

### 3.2 テストケース選定基準

| 優先度 | 基準 | 例 |
|-------|------|-----|
| 高 | 主要業務フロー | Todo作成→編集→完了→削除 |
| 高 | 認証・認可フロー | ログイン、ログアウト |
| 中 | 画面遷移 | ナビゲーション、リダイレクト |
| 中 | データ表示 | 一覧表示、詳細表示 |
| 低 | エラー表示 | 404ページ、入力エラー |

### 3.3 テストケース数の目安

| 画面 | 推奨ケース数 | 内訳 |
|------|------------|------|
| 一覧画面 | 3-5件 | 表示、検索、ページング |
| 詳細画面 | 2-3件 | 表示、編集、削除 |
| フォーム | 3-5件 | 作成成功、バリデーション |
| ナビゲーション | 2-3件 | 遷移、ブレッドクラム |

---

## 4. テスト構成

### 4.1 ディレクトリ構成

```
src/test/e2e/
├── playwright.config.ts      # Playwright設定
├── specs/                    # テストファイル
│   ├── home.spec.ts          # ホーム画面テスト
│   ├── todos/
│   │   └── todos-crud.spec.ts
│   ├── projects/
│   │   └── projects-crud.spec.ts
│   └── users/
│       └── users-crud.spec.ts
├── fixtures/                 # テストフィクスチャ
│   └── test-data.ts
└── pages/                    # Page Objectモデル
    ├── BasePage.ts
    ├── HomePage.ts
    └── TodoPage.ts
```

### 4.2 テストファイル構成

```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo管理画面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todos');
  });

  test.describe('一覧表示', () => {
    test('Todo一覧が表示される', async ({ page }) => {
      // ...
    });
  });

  test.describe('新規作成', () => {
    test('新規Todoを作成できる', async ({ page }) => {
      // ...
    });
  });
});
```

---

## 5. Page Objectモデル

### 5.1 概要

Page Objectパターンを採用し、テストコードとページ操作ロジックを分離する。

### 5.2 実装例

```typescript
// pages/TodoPage.ts
import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoButton: Locator;
  readonly todoList: Locator;
  readonly todoTitleInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoButton = page.getByRole('button', { name: '新規作成' });
    this.todoList = page.getByTestId('todo-list');
    this.todoTitleInput = page.getByLabel('タイトル');
    this.saveButton = page.getByRole('button', { name: '保存' });
  }

  async goto() {
    await this.page.goto('/todos');
  }

  async createTodo(title: string) {
    await this.newTodoButton.click();
    await this.todoTitleInput.fill(title);
    await this.saveButton.click();
  }

  async getTodoCount() {
    return await this.todoList.getByRole('listitem').count();
  }
}
```

### 5.3 テストでの使用

```typescript
import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test('新規Todoを作成できる', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await todoPage.goto();

  const initialCount = await todoPage.getTodoCount();
  await todoPage.createTodo('E2Eテスト用Todo');

  expect(await todoPage.getTodoCount()).toBe(initialCount + 1);
});
```

---

## 6. ロケーター戦略

### 6.1 優先順位

| 順位 | ロケーター | 用途 | 例 |
|------|-----------|------|-----|
| 1 | getByRole | セマンティックな要素 | `getByRole('button', { name: '保存' })` |
| 2 | getByLabel | フォーム要素 | `getByLabel('タイトル')` |
| 3 | getByText | テキストによる特定 | `getByText('ようこそ')` |
| 4 | getByTestId | 上記で特定できない場合 | `getByTestId('todo-item-1')` |

### 6.2 ロケーター例

```typescript
// 推奨: セマンティックなロケーター
page.getByRole('button', { name: '送信' });
page.getByLabel('メールアドレス');
page.getByRole('heading', { name: 'Todo一覧' });

// 代替: data-testid
page.getByTestId('todo-list');
page.getByTestId('delete-button');

// 非推奨: CSSセレクター（最終手段）
page.locator('.btn-primary');  // スタイル変更で壊れやすい
page.locator('#submit-btn');   // IDに依存
```

---

## 7. テストデータ管理

### 7.1 方針

| 方針 | 説明 |
|------|------|
| **テスト前準備** | beforeEach でAPIを呼んでデータをセットアップ |
| **テスト後クリーンアップ** | afterEach でテストデータを削除 |
| **独立性** | 各テストは他テストのデータに依存しない |
| **冪等性** | テストは何度実行しても同じ結果 |

### 7.2 データセットアップ例

```typescript
test.describe('Todo管理', () => {
  let testTodoId: number;

  test.beforeEach(async ({ request }) => {
    // APIでテストデータを作成
    const response = await request.post('/api/todos', {
      data: {
        title: 'テスト用Todo',
        status: 'NOT_STARTED',
      },
    });
    const todo = await response.json();
    testTodoId = todo.id;
  });

  test.afterEach(async ({ request }) => {
    // テストデータを削除
    if (testTodoId) {
      await request.delete(`/api/todos/${testTodoId}`);
    }
  });

  test('Todoを編集できる', async ({ page }) => {
    await page.goto(`/todos/${testTodoId}`);
    // テスト実行...
  });
});
```

### 7.3 フィクスチャの活用

```typescript
// fixtures/test-data.ts
export const testTodos = {
  basic: {
    title: 'テストTodo',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
  },
  completed: {
    title: '完了済みTodo',
    status: 'COMPLETED',
    priority: 'HIGH',
  },
};
```

---

## 8. 待機戦略

### 8.1 自動待機（推奨）

Playwrightは多くの操作で自動待機を行う。

```typescript
// 自動待機される操作
await page.click('button');       // 要素が表示・有効になるまで待機
await page.fill('input', 'text'); // 要素が編集可能になるまで待機
await expect(element).toBeVisible(); // 要素が表示されるまで待機
```

### 8.2 明示的な待機

```typescript
// ネットワークリクエスト完了を待機
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/todos') && resp.status() === 200),
  page.click('button[type="submit"]'),
]);

// 特定の状態を待機
await expect(page.getByText('保存しました')).toBeVisible();

// ナビゲーション完了を待機
await page.waitForURL('/todos');
```

### 8.3 避けるべき待機

```typescript
// NG: 固定時間の待機
await page.waitForTimeout(3000);  // 不安定、遅い

// OK: 条件による待機
await expect(page.getByText('読み込み完了')).toBeVisible();
```

---

## 9. アサーション方針

### 9.1 基本アサーション

```typescript
// 要素の可視性
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByTestId('error')).not.toBeVisible();

// テキスト内容
await expect(page.getByRole('heading')).toHaveText('Todo一覧');
await expect(page.getByTestId('count')).toContainText('10件');

// 要素の状態
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('checkbox')).toBeChecked();

// URL
await expect(page).toHaveURL('/todos');
await expect(page).toHaveURL(/\/todos\/\d+/);

// 件数
await expect(page.getByRole('listitem')).toHaveCount(5);
```

### 9.2 ソフトアサーション

複数の検証を一度に行う場合に使用。

```typescript
await expect.soft(page.getByTestId('title')).toHaveText('Todo1');
await expect.soft(page.getByTestId('status')).toHaveText('未着手');
await expect.soft(page.getByTestId('priority')).toHaveText('高');
// 全てのアサーションが実行される（1つ失敗しても続行）
```

---

## 10. エラーハンドリング

### 10.1 スクリーンショット

```typescript
// 失敗時の自動スクリーンショット（playwright.config.ts）
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
```

### 10.2 手動スクリーンショット

```typescript
test('デバッグ用スクリーンショット', async ({ page }) => {
  await page.goto('/todos');
  await page.screenshot({ path: 'debug/todos-page.png' });
});
```

---

## 11. 並列実行

### 11.1 設定

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : undefined, // CIでは2並列
  fullyParallel: true,
});
```

### 11.2 テストの独立性確保

```typescript
// 各テストは独立したデータを使用
test.describe.configure({ mode: 'parallel' });

test.describe('Todo操作', () => {
  test('作成', async ({ page }) => {
    // ユニークなデータを使用
    const uniqueTitle = `Todo-${Date.now()}`;
    // ...
  });
});
```

---

## 12. ブラウザ設定

### 12.1 対象ブラウザ

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### 12.2 モバイルテスト（オプション）

```typescript
projects: [
  { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
],
```

---

## 13. CI/CD統合

### 13.1 実行コマンド

```bash
# 全テスト実行
npx playwright test

# 特定のブラウザのみ
npx playwright test --project=chromium

# ヘッドレスモード（CI用）
npx playwright test --reporter=html

# UIモード（ローカル開発用）
npx playwright test --ui
```

### 13.2 CI設定例

```yaml
# GitHub Actions
- name: Run E2E tests
  run: npx playwright test
  env:
    CI: true
- uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## 14. ベストプラクティス

### 14.1 推奨事項

| 項目 | 内容 |
|------|------|
| **ユーザー視点** | 実装詳細ではなくユーザー行動をテスト |
| **シナリオ重視** | 単発操作より一連のフローをテスト |
| **Page Object** | ページ操作ロジックを分離 |
| **自動待機活用** | 明示的なwaitは最小限に |
| **独立性確保** | テスト間のデータ依存を排除 |

### 14.2 アンチパターン

| 避けるべきこと | 理由 | 代替 |
|--------------|------|------|
| 固定時間待機 | 不安定、遅い | 条件待機 |
| CSSセレクター多用 | 壊れやすい | getByRole, getByTestId |
| テスト間の依存 | 実行順序で結果が変わる | 独立したセットアップ |
| 過度なE2Eテスト | 実行時間増大 | 単体・統合で代替 |

---

## 15. 関連ドキュメント

| ドキュメント | 説明 |
|--------------|------|
| [../philosophy.md](../philosophy.md) | テスト設計思想（全体） |
| [catalog.md](catalog.md) | E2Eテストカタログ |
| [../../screens/](../../screens/) | 画面仕様 |

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-01-08 | 初版作成 |
