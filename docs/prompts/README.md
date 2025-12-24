# プロンプト管理

エージェントへの指示プロンプト。

## フェーズ

| # | フェーズ | プロンプト |
|---|---------|-----------|
| 01 | 要件定義 | [requirements.md](phases/01-requirements/requirements.md) |
| 02 | 基本設計 | [basic-design.md](phases/02-basic-design/basic-design.md) |
| 03 | 詳細設計 | [detail-design.md](phases/03-detail-design/detail-design.md) |
| 04 | 実装 | [implementation.md](phases/04-implementation/implementation.md) |
| 05 | テスト実装 | [test-implementation.md](phases/05-test-implementation/test-implementation.md) |
| 06 | テスト | [testing.md](phases/06-testing/testing.md) |
| 07 | ドキュメント | [documentation.md](phases/07-documentation/documentation.md) |

## 使い方

1. 該当フェーズのプロンプトを開く
2. `{{PROJECT_NAME}}`を案件名に置換（例: `202501_ユーザー認証機能追加`）
3. プロンプト内容をエージェントに渡す

## 関連
- [ドキュメント体系ガイド](../document-guide.md)
- [案件テンプレート](../projects/template/)
