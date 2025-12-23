# フロントエンドユニットテスト（Jest）

フロントエンドのユニットテスト環境。Vue.jsコンポーネント、ユーティリティ関数、DOM操作のテストを実行します。

## ディレクトリ構成

```
src/test/jest/
├── package.json          # 依存関係定義
├── jest.config.js        # Jest設定
├── tsconfig.json         # TypeScript設定
├── setup/
│   └── jest.setup.ts     # グローバルセットアップ
├── specs/
│   ├── components/       # Vueコンポーネントテスト
│   │   ├── todos/
│   │   ├── projects/
│   │   └── users/
│   ├── utils/            # ユーティリティテスト
│   └── stores/           # Piniaストアテスト
├── __mocks__/            # モック定義
└── output/
    ├── coverage/         # カバレッジレポート
    └── reports/          # テストレポート
```

## テスト実行

```bash
# ディレクトリに移動
cd src/test/jest

# 依存関係インストール（初回のみ）
npm install

# 全テスト実行
npm test

# ウォッチモード（ファイル変更時に自動実行）
npm run test:watch

# カバレッジレポート付き
npm run test:coverage

# カテゴリ別実行
npm run test:utils       # ユーティリティテスト
npm run test:components  # コンポーネントテスト
npm run test:stores      # ストアテスト

# CI用（JUnitレポート出力）
npm run test:ci
```

## テストID命名規則

既存のバックエンドテストID規則との整合性を保つ形式：

```
{層プレフィックス}-{エンティティ略称}-{カテゴリ}{連番}
```

### 層プレフィックス

| レイヤー | プレフィックス | 説明 |
|---------|---------------|------|
| Component | `UT-C` | Vue.jsコンポーネントテスト |
| Utility | `UT-U` | ユーティリティ関数テスト |
| Store | `UT-S` | Piniaストアテスト |

### エンティティ略称

| エンティティ | 略称 |
|-------------|------|
| Todo | TODO |
| User | USR |
| Project | PRJ |
| Common | CMN |

### カテゴリサフィックス

| カテゴリ | サフィックス |
|---------|-------------|
| 正常系 | (なし) |
| 異常系 | E |
| 境界値 | B |
| モック | M |

### 命名例

```
UT-C-TODO-001   # コンポーネント層 Todo 正常系テスト #1
UT-C-TODO-E001  # コンポーネント層 Todo エラー系テスト #1
UT-U-CMN-001    # ユーティリティ層 共通 正常系テスト #1
UT-S-TODO-M001  # ストア層 Todo モックテスト #1
```

## テストファイルテンプレート

### ユーティリティテスト

```typescript
/**
 * {関数名} テスト
 *
 * 対象ファイル: @utils/{filename}.ts
 */
describe('{関数名}', () => {
  describe('正常系', () => {
    it('UT-U-CMN-001: {テスト内容}', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = targetFunction(input);

      // Assert
      expect(result).toBe('expected');
    });
  });

  describe('異常系', () => {
    it('UT-U-CMN-E001: {エラーケース}', () => {
      expect(() => targetFunction(null)).toThrow();
    });
  });
});
```

### コンポーネントテスト

```typescript
/**
 * {コンポーネント名} テスト
 *
 * 対象コンポーネント: @components/{path}/{ComponentName}.vue
 */
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import ComponentName from '@components/{path}/ComponentName.vue';

describe('ComponentName', () => {
  const createWrapper = (props = {}) => {
    return mount(ComponentName, {
      props,
      global: {
        plugins: [createTestingPinia()]
      }
    });
  };

  describe('表示', () => {
    it('UT-C-XXX-001: {表示内容}', () => {
      const wrapper = createWrapper();
      expect(wrapper.text()).toContain('expected text');
    });
  });

  describe('インタラクション', () => {
    it('UT-C-XXX-010: {操作内容}', async () => {
      const wrapper = createWrapper();
      await wrapper.find('[data-testid="button"]').trigger('click');
      expect(wrapper.emitted('event')).toBeTruthy();
    });
  });
});
```

## E2Eテストとの役割分担

| テスト種別 | 責務 | ディレクトリ |
|------------|------|-------------|
| Jest（ユニット） | 個々の関数・コンポーネント | `src/test/jest/` |
| Playwright（E2E） | ユーザーシナリオ全体 | `src/test/e2e/` |

### 棲み分けの原則

- **バリデーションロジック** → Jest
- **バリデーションエラーの画面表示** → Playwright
- **API呼び出しのモック** → Jest
- **実際のAPI連携** → Playwright

## カバレッジ目標

| 項目 | 目標 |
|------|-----|
| Branches | 60% |
| Functions | 60% |
| Lines | 60% |
| Statements | 60% |

## 関連ドキュメント

- [テストガイド](../../../docs/testing/TEST_GUIDE.md)
- [テストカタログ](../../../docs/specs/test-catalog.md)
- [E2Eテスト](../e2e/README.md)
- [フロントエンドテスト戦略](../../../docs/reference/best-practices/frontend-testing-strategies/README.md)
