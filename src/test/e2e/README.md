# Playwright E2Eテスト

Vue.jsアプリケーション向けPlaywright E2Eテストフレームワーク

## ディレクトリ構成

```
src/test/e2e/
├── master/                    # マスタデータ
│   ├── screen-spec/           # 画面仕様JSON
│   ├── code-samples/          # コードサンプル・関数リファレンス
│   └── test-scenarios/        # テストシナリオ（Markdown）
├── pages/                     # ページオブジェクト
├── fixtures/                  # カスタムフィクスチャ
├── helpers/                   # ヘルパー（APIヘルパー等）
├── scripts/                   # ユーティリティスクリプト
│   └── extract-screen-spec.ts # 画面仕様JSON自動抽出
├── specs/                     # テストスペック
│   ├── todos/                 # ToDo管理画面テスト
│   ├── projects/              # 案件一覧画面テスト
│   └── users/                 # ユーザー管理画面テスト
└── output/                    # 出力（レポート等）
```

---

## セットアップ

### 1. 依存関係のインストール

```bash
cd src/test/e2e
npm install
```

### 2. Playwrightブラウザのインストール

```bash
npx playwright install
```

---

## テスト実行

### 前提条件

テスト実行前に、アプリケーションサーバーを起動してください。

```bash
# プロジェクトルートで実行
mvnw.cmd spring-boot:run
```

アプリケーションが `http://localhost:8080` で動作していることを確認してください。

### テスト実行コマンド

| コマンド | 説明 |
|---------|------|
| `npm test` | 全テスト実行（ヘッドレス） |
| `npm run test:headed` | ブラウザを表示して実行 |
| `npm run test:ui` | UIモード（インタラクティブ） |
| `npm run test:debug` | デバッグモード |
| `npm run test:chromium` | Chromiumのみで実行 |
| `npm run test:firefox` | Firefoxのみで実行 |
| `npm run test:webkit` | WebKitのみで実行 |
| `npm run report` | テストレポートを表示 |
| `npm run codegen` | コード生成ツール起動 |

### 実行例

```bash
# 全テスト実行
npm test

# 特定のテストファイルを実行
npx playwright test specs/todos/todos-crud.spec.ts

# 特定のテスト名で絞り込み
npx playwright test -g "ToDo追加"

# UIモードで実行（推奨：テスト開発時）
npm run test:ui
```

---

## テストレポート

テスト実行後、以下の場所にレポートが生成されます。

- HTMLレポート: `output/reports/html-report/`
- JSONレポート: `output/reports/test-results.json`

レポートを表示するには：

```bash
npm run report
```

---

## コード生成ツール

ブラウザ操作を記録してテストコードを自動生成できます。

```bash
npm run codegen
```

1. ブラウザとPlaywright Inspectorが起動
2. ブラウザで操作を行う
3. Inspectorにコードが自動生成される
4. 生成されたコードをコピーして使用

---

## テストの書き方

### 基本構造

```typescript
import { test, expect } from '../../fixtures/custom-fixtures';

test.describe('画面名', () => {

  test.beforeEach(async ({ todosPage }) => {
    // 各テスト前の共通処理
    await todosPage.goto();
    await todosPage.waitForLoadingComplete();
  });

  test('テスト名', async ({ todosPage }) => {
    // テスト処理
    await todosPage.addTodo({ title: 'テストタスク' });
    await todosPage.expectTodoExists('テストタスク');
  });

});
```

### ページオブジェクトの使用

各画面のページオブジェクトがフィクスチャとして提供されています。

- `todosPage` - ToDo管理画面
- `projectsPage` - 案件一覧画面
- `usersPage` - ユーザー管理画面
- `apiHelper` - APIヘルパー（テストデータ操作）
- `cleanApiHelper` - クリーンなAPIヘルパー（テスト前後でデータクリア）

### テストデータのセットアップ

```typescript
test('テストデータを使用するテスト', async ({ todosPage, cleanApiHelper }) => {
  // APIでテストデータを作成
  await cleanApiHelper.createUser('テストユーザー');
  await cleanApiHelper.createProject('テスト案件');
  await cleanApiHelper.createTodo({ title: 'テストタスク' });

  // 画面を開いてテスト
  await todosPage.goto();
  await todosPage.waitForLoadingComplete();
  // ...
});
```

---

## 参照ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| [master/code-samples/playwright-functions.md](master/code-samples/playwright-functions.md) | Playwright関数リファレンス |
| [master/code-samples/sample.spec.ts](master/code-samples/sample.spec.ts) | テストコードサンプル |
| [master/screen-spec/](master/screen-spec/) | 画面仕様JSON |
| [master/test-scenarios/](master/test-scenarios/) | テストシナリオ |

---

## トラブルシューティング

### テストがタイムアウトする

- アプリケーションサーバーが起動しているか確認
- `http://localhost:8080` にアクセスできるか確認

### ブラウザが起動しない

```bash
npx playwright install
```

### セレクタが見つからない

1. UIモード (`npm run test:ui`) で実行して要素を確認
2. 画面仕様JSON (`master/screen-spec/`) のセレクタを確認
3. `codegen` で正しいセレクタを生成

### テストデータが残る

`cleanApiHelper` フィクスチャを使用すると、テスト前後で自動的にデータがクリアされます。

---

## 画面仕様JSON自動抽出

実際の画面から画面仕様JSONを自動生成できます。

### 前提条件

アプリケーションサーバーが起動していること（`http://localhost:8080`）

### 抽出コマンド

```bash
# 特定の画面を抽出
npm run extract-spec -- /todos.html
npm run extract-spec -- /projects.html
npm run extract-spec -- /users.html

# 全画面を一括抽出
npm run extract-spec:all
```

### 出力先

抽出されたJSONは `master/screen-spec/` フォルダに保存されます：

- `todos-screen.json`
- `projects-screen.json`
- `users-screen.json`

### 抽出される情報

| カテゴリ | 内容 |
|---------|------|
| inputs | 入力フィールド（input, textarea, select） |
| buttons | ボタン要素 |
| dynamicElements | 動的リスト要素（todo-item, project-card等） |
| stats | 統計表示要素 |
| messages | エラー・ローディング表示 |
| links | リンク要素 |
| waitConditions | 待機条件 |
| apiEndpoints | 推測されたAPIエンドポイント |

### 注意事項

- 自動抽出は現在の画面状態を元に生成するため、データがある状態で実行すると動的要素がより正確に抽出されます
- `altSelectors`、`vueSelector` は必要に応じて手動で調整してください
- 既存のJSONファイルは上書きされます

---

## Vue.js移行時の対応

画面仕様JSONに `vueSelector` フィールドが定義されています。Vue移行後は：

1. 各コンポーネントに `data-testid` 属性を追加
2. ページオブジェクトの `getVueAwareLocator()` を使用してセレクタを切り替え
