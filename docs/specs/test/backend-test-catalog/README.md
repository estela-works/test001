# バックエンドテストカタログ

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 目次

- [Mapper層テスト](./mapper-tests.md) - TodoMapper/UserMapper
- [Service層テスト](./service-tests.md) - TodoService/UserService/ProjectService
- [Controller層テスト](./controller-tests.md) - TodoController/UserController/ProjectController
- [実行方法・設定](./execution-guide.md) - テスト実行方法と設定

---

## 1. 概要

| 項目 | 内容 |
|------|------|
| テストフレームワーク | JUnit 5 + AssertJ |
| APIテストユーティリティ | Spring MockMvc（コントローラ/APIテストに使用） |
| Mapperテスト | @MybatisTest |
| 統合テスト | @SpringBootTest |
| 最終更新日 | 2025-12-23 |

---

## 2. テストケース統計

### 2.1 サマリー

| 対象クラス | 正常系 | 異常系 | 境界値 | 合計 |
|-----------|--------|--------|--------|------|
| TodoMapper | 13 | 1 | 1 | 15 |
| TodoService | 29 | 3 | 11 | 43 |
| TodoController | 25 | 5 | 0 | 30 |
| UserMapper | 7 | 1 | 1 | 9 |
| UserService | 5 | 2 | 0 | 7 |
| UserController | 8 | 6 | 0 | 14 |
| ProjectService | 11 | 2 | 5 | 18 |
| ProjectController | 11 | 4 | 0 | 15 |
| **合計** | **109** | **24** | **18** | **151** |

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-23 | 初版作成（実装済みテストファイルから自動生成） |
| 2025-12-23 | ファイル分割実施（README、Mapper、Service、Controller、実行方法に分割） |
