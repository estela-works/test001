# テスト仕様書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 案件チケット管理機能 |
| 案件ID | 20251203_案件チケット管理機能 |
| 作成日 | 2025-12-22 |
| 作成者 | - |
| 関連詳細設計書 | [detail-design-api.md](../detail-design-api.md), [detail-design-logic.md](../detail-design-logic.md) |

---

## 目次

### [1. 単体テスト](./unit-tests.md)
- ProjectServiceTest（新規）
- TodoServiceTest（変更分）

### [2. 結合テスト](./integration-tests.md)
- ProjectController APIテスト
- TodoController APIテスト（変更分）
- E2Eテスト（画面テスト）

### [3. テストメタ情報](./test-metadata.md)
- テストケース一覧
- テストデータ
- テスト環境

---

## テスト概要

### テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| ProjectService | 新規 | 案件のCRUD操作とビジネスロジック |
| ProjectController | 新規 | 案件APIエンドポイント |
| TodoService | 変更 | 案件フィルタ、日付バリデーション追加 |
| TodoController | 変更 | projectIdパラメータ対応 |
| Project | 新規 | 案件エンティティ |
| Todo | 変更 | projectId, startDate, dueDateフィールド追加 |

### テスト方針

- 各メソッドに対して正常系・異常系・境界値のテストケースを定義
- JUnit 5 + AssertJ + MockitoまたはSpring Boot Testでテストを実装
- `@SpringBootTest` + `@Transactional` でDBテストを実施
- 案件削除のカスケード動作を重点的にテスト
- 日付バリデーションの境界値を確認

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
