/**
 * Jest セットアップファイル
 *
 * グローバルなテスト設定とモックを定義
 */
import '@testing-library/jest-dom';

// グローバルモック設定
global.fetch = jest.fn();

// コンソールエラーの抑制（Vue警告など）
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Vue.jsのハイドレーション警告を抑制
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('[Vue warn]'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('[Vue warn]')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// テスト後のクリーンアップ
afterEach(() => {
  jest.clearAllMocks();
  // DOM のクリーンアップ
  document.body.innerHTML = '';
});

// グローバルなテストユーティリティ
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toHaveClass(className: string): R;
    }
  }
}
