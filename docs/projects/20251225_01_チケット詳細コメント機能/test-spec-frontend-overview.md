# フロントエンドテスト仕様書 - 概要・環境・実行

[← 目次に戻る](./test-spec-frontend.md)

---

## 1. テスト概要

### 1.1 テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| TodoDetailModal.vue | 新規 | チケット詳細とコメント機能を表示するモーダルコンポーネント |
| CommentList.vue | 新規 | コメント一覧を表示するコンポーネント |
| CommentForm.vue | 新規 | コメント投稿フォームコンポーネント |
| CommentItem.vue | 新規 | 個別コメント表示コンポーネント |
| commentStore.ts | 新規 | コメント状態管理Piniaストア |
| comment.ts | 新規 | TypeScript型定義（Comment, CreateCommentRequest等） |

### 1.2 テスト方針

**基本方針**:
- Vue Testing Libraryを使用したコンポーネント単体テスト
- Vitestを使用したストア単体テスト
- MSW (Mock Service Worker) によるAPIモック
- ユーザー視点でのインタラクションテスト重視

**カバレッジ目標**:
- コンポーネント: 80%以上
- ストア: 90%以上
- 型定義: 100%（型ガード関数、バリデーション関数）

### 1.3 ストア診断結果

| 診断項目 | 結果 | 備考 |
|---------|------|------|
| ストアの複雑さ | ケース2（ロジック分離型） | API通信とシンプルな状態管理が中心、複雑なビジネスロジックは少ない |
| 推奨テスト戦略 | ロジック分離 + MSW | 型ガード・バリデーション関数を純粋関数としてテスト、ストアはMSWで統合テスト |

**戦略選択理由**:
- コメントストアは主にCRUD操作が中心でロジックがシンプル
- バリデーション関数や型ガードは純粋関数として分離されている
- API通信部分はMSWでモックして実際のフローをテスト

---

## 6. テスト環境

### 6.1 テストフレームワーク

| ツール | バージョン | 用途 |
|--------|----------|------|
| Vitest | ^2.1.8 | テストランナー |
| Vue Testing Library | ^9.2.1 | コンポーネントテスト |
| @testing-library/user-event | ^14.5.2 | ユーザー操作シミュレーション |
| MSW (Mock Service Worker) | ^2.4.5 | APIモック |
| happy-dom | ^15.11.7 | DOMシミュレーション環境 |

### 6.2 テスト戦略別設定

| 戦略 | 設定内容 |
|------|---------|
| Pinia Mock | `createTestingPinia({ stubActions: false })` でストアをテスト環境に設定 |
| MSW | `server.use(http.get('/api/todos/:id/comments', ...))` でAPIモック設定 |
| Component Render | `render(Component, { global: { plugins: [createTestingPinia()] } })` でコンポーネントレンダリング |

### 6.3 テストセットアップ例

```typescript
// vitest.setup.ts
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// MSWサーバーのセットアップ
export const server = setupServer(
  http.get('/api/todos/:todoId/comments', () => {
    return HttpResponse.json([
      {
        id: 1,
        todoId: 1,
        userId: 1,
        userName: 'テストユーザー',
        content: 'テストコメント',
        createdAt: '2025-12-25T10:00:00'
      }
    ])
  }),
  http.post('/api/todos/:todoId/comments', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      {
        id: 2,
        todoId: 1,
        userId: body.userId,
        userName: 'テストユーザー',
        content: body.content,
        createdAt: new Date().toISOString()
      },
      { status: 201 }
    )
  }),
  http.delete('/api/comments/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'テストユーザー1' },
      { id: 2, name: 'テストユーザー2' }
    ])
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## 7. テスト実行

### 7.1 コマンド

```bash
# 全テスト実行
npm run test

# ウォッチモード
npm run test:watch

# カバレッジ
npm run test:coverage

# 特定ファイルのみ
npm run test CommentForm.spec.ts
```

### 7.2 カバレッジ目標

| 対象 | 目標カバレッジ |
|------|--------------|
| コンポーネント | 80%以上 |
| ストア | 90%以上 |
| 純粋関数 | 100% |
| 全体 | 85%以上 |
