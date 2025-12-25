# フロントエンドテスト方針書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 作成者 | システム管理者 |
| 関連詳細設計書 | [detail-design-frontend.md](./detail-design-frontend.md), [detail-design-store.md](./detail-design-store.md), [detail-design-types.md](./detail-design-types.md) |

---

## ドキュメント構成

本テスト仕様書は以下のファイルに分割されています。

| ドキュメント | 内容 | 行数目安 |
|-------------|------|----------|
| [test-spec-frontend-overview.md](./test-spec-frontend-overview.md) | テスト概要・環境・実行方法 | 約150行 |
| [test-spec-frontend-components.md](./test-spec-frontend-components.md) | コンポーネントテスト詳細 | 約240行 |
| [test-spec-frontend-store-types.md](./test-spec-frontend-store-types.md) | ストア・型定義テスト詳細 | 約160行 |
| [test-spec-frontend-integration.md](./test-spec-frontend-integration.md) | 統合テスト・ケース一覧・テストデータ | 約180行 |

---

## テスト概要

### テスト対象コンポーネント

- TodoDetailModal.vue - チケット詳細モーダル
- CommentList.vue - コメント一覧表示
- CommentForm.vue - コメント投稿フォーム
- CommentItem.vue - 個別コメント表示
- commentStore.ts - Piniaストア
- comment.ts - TypeScript型定義

### テスト方針

- Vue Testing Libraryによるコンポーネント単体テスト
- Vitestによるストア単体テスト
- MSW (Mock Service Worker) によるAPIモック
- ユーザー視点のインタラクションテスト重視

### カバレッジ目標

| 対象 | 目標 |
|------|------|
| コンポーネント | 80%以上 |
| ストア | 90%以上 |
| 純粋関数 | 100% |
| 全体 | 85%以上 |

---

## テスト実施コマンド

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

---

## テストケース数

- **コンポーネントテスト**: 30件
  - TodoDetailModal: 7件
  - CommentList: 7件
  - CommentForm: 9件
  - CommentItem: 7件
- **ストアテスト**: 10件
- **純粋関数テスト**: 9件
- **統合テスト**: 4件

**合計**: 51件

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
| 1.1 | 2025-12-25 | ファイル分割（4ファイル構成に変更） | システム管理者 |
