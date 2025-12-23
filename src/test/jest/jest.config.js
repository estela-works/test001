/** @type {import('jest').Config} */
module.exports = {
  // テスト環境
  testEnvironment: 'jsdom',

  // ルートディレクトリ
  rootDir: '.',

  // テストファイルのパターン
  testMatch: [
    '<rootDir>/specs/**/*.spec.ts',
    '<rootDir>/specs/**/*.test.ts'
  ],

  // TypeScript変換
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json'
    }],
    '^.+\\.vue$': '@vue/vue3-jest'
  },

  // モジュール解決
  moduleNameMapper: {
    // パスエイリアス（Vue.js移行後用）
    '^@/(.*)$': '<rootDir>/../../../main/resources/static/vue/$1',
    '^@components/(.*)$': '<rootDir>/../../../main/resources/static/vue/components/$1',
    '^@stores/(.*)$': '<rootDir>/../../../main/resources/static/vue/stores/$1',
    '^@utils/(.*)$': '<rootDir>/../../../main/resources/static/vue/utils/$1',
    // CSS/アセットのモック
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },

  // ファイル拡張子
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'vue', 'json'],

  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/setup/jest.setup.ts'],

  // カバレッジ設定
  collectCoverageFrom: [
    '../../../main/resources/static/**/*.{js,ts,vue}',
    '!**/node_modules/**',
    '!**/*.d.ts'
  ],
  coverageDirectory: './output/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },

  // レポート出力（CI用）
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './output/reports',
      outputName: 'jest-results.xml'
    }]
  ],

  // タイムアウト
  testTimeout: 10000,

  // 詳細出力
  verbose: true
};
