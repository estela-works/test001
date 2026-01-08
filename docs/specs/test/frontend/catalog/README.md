# フロントエンドテストカタログ

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 目次

- [ストアテスト](./store-tests.md) - Piniaストア（todoStore/projectStore/userStore）
- [コンポーネントテスト](./component-tests.md) - Vueコンポーネント
- [ユーティリティテスト](./utility-tests.md) - 型定義・ユーティリティ関数
- [実行方法・設定](./execution-guide.md) - テスト実行方法と設定

---

## 1. 概要

| 項目 | 内容 |
|------|------|
| テストフレームワーク | Vitest |
| コンポーネントテスト | @vue/test-utils |
| DOM環境 | jsdom |
| ディレクトリ | src/frontend/src/ |
| 最終更新日 | 2026-01-08 |

---

## 2. テストケース統計

### 2.1 サマリー

| カテゴリ | ファイル数 | テストケース数 |
|---------|-----------|---------------|
| ストアテスト | 3 | 41 |
| コンポーネントテスト | 6 | 34 |
| ユーティリティテスト | 1 | 17 |
| **合計** | **10** | **92** |

### 2.2 ファイル別内訳

| ファイル | テスト対象 | テストケース数 |
|----------|------------|---------------|
| todoStore.spec.ts | todoStore | 17 |
| projectStore.spec.ts | projectStore | 12 |
| userStore.spec.ts | userStore | 12 |
| TodoStats.spec.ts | TodoStats | 4 |
| TodoFilter.spec.ts | TodoFilter | 4 |
| TodoSearchForm.spec.ts | TodoSearchForm | 6 |
| TodoTableRow.spec.ts | TodoTableRow | 12 |
| UserCard.spec.ts | UserCard | 5 |
| ErrorMessage.spec.ts | ErrorMessage | 3 |
| filter.spec.ts | filter.ts | 17 |

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-01-08 | 初版作成（実装済みテストファイルから自動生成） |
