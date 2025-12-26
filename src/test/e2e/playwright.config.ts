import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * Vue.jsアプリケーション向けE2Eテスト設定
 */
export default defineConfig({
  // テストディレクトリ
  testDir: './specs',

  // テスト結果の出力先
  outputDir: './output/reports/test-results',

  // 並列実行設定（CIでは並列、ローカルでは直列推奨）
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,

  // リトライ設定
  retries: process.env.CI ? 2 : 0,

  // レポーター設定
  reporter: [
    ['html', { outputFolder: './output/reports/html-report' }],
    ['json', { outputFile: './output/reports/test-results.json' }],
    ['list'],
  ],

  // 共通設定
  use: {
    // ベースURL（環境変数で切り替え可能）
    // Vue.js開発サーバー（Vite）はポート5173で動作
    baseURL: process.env.BASE_URL || 'http://localhost:5173',

    // スクリーンショット設定
    screenshot: 'only-on-failure',

    // 動画記録設定
    video: 'retain-on-failure',

    // トレース設定
    trace: 'retain-on-failure',

    // タイムアウト設定
    actionTimeout: 10000,
    navigationTimeout: 30000,

    // ロケール設定（日本語）
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  },

  // グローバルタイムアウト
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  // プロジェクト（ブラウザ）設定
  // Chromiumのみを対象とする
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Webサーバー設定（テスト前にサーバー起動）
  // 注意: 実行前にサーバーが起動していることを前提とする場合はコメントアウト
  // webServer: {
  //   command: 'cd ../../../.. && mvnw.cmd spring-boot:run',
  //   url: 'http://localhost:8080',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
