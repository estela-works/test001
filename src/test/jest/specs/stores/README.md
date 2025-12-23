# specs/stores/

Piniaストアのテストを配置するディレクトリ。

## テストID プレフィックス

`UT-S-{エンティティ}-{番号}`

## 今後追加予定

- `todos.store.spec.ts` - ToDoストア
- `projects.store.spec.ts` - 案件ストア
- `users.store.spec.ts` - ユーザーストア

## テスト方針

- `@pinia/testing` の `createTestingPinia` を使用
- state, getters, actions を個別にテスト
- API呼び出しは `jest.fn()` でモック
