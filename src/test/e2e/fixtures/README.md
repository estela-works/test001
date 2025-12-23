# カスタムフィクスチャ

Playwrightのカスタムフィクスチャを格納するフォルダ。

## ファイル構成

| ファイル | 説明 |
|---------|------|
| custom-fixtures.ts | カスタムフィクスチャ定義 |

## 提供するフィクスチャ

| フィクスチャ | 説明 |
|-------------|------|
| todosPage | ToDo管理画面ページオブジェクト |
| projectsPage | 案件一覧画面ページオブジェクト |
| usersPage | ユーザー管理画面ページオブジェクト |
| apiHelper | APIヘルパー |
| cleanApiHelper | クリーンなAPIヘルパー（テスト前後でデータクリア） |

## 使用例

```typescript
import { test, expect } from '../../fixtures/custom-fixtures';

test('テスト', async ({ todosPage }) => {
  await todosPage.goto();
  // ...
});
```
