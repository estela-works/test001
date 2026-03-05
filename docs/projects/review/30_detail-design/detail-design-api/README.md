# API詳細設計書 セルフレビューパイプライン

## 目的

設計者が人間レビューに出す前に、REST API詳細設計の品質を段階的・網羅的に検証する。
エンドポイント網羅性、スキーマ定義、エラー・セキュリティの観点で「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  エンドポイント網羅性（vs basic-design-backend.md）
      |
      v
Phase 2B  スキーマ・バリデーション（vs specs/）
      |
      v
Phase 2C  エラーレスポンス・セキュリティ（vs サービス仕様）
      |
      v
Phase 3   差分チェック
      |
      v
Phase 4   横断整合性チェック（vs リポジトリ実装）
      |
      v
人間レビューへ提出
```

## プロンプト一覧

| Phase | ファイル | 問い | 視点の方向 |
|-------|---------|------|-----------|
| 2A | [10_self-review-endpoint-completeness.prompt.md](10_self-review-endpoint-completeness.prompt.md) | 全機能に対応するエンドポイントが揃っているか？ | 設計書 <-> 基本設計書 |
| 2B | [20_self-review-schema-validation.prompt.md](20_self-review-schema-validation.prompt.md) | スキーマ・バリデーションが最新仕様と整合しているか？ | 設計書 <-> 仕様書 |
| 2C | [30_self-review-error-security.prompt.md](30_self-review-error-security.prompt.md) | エラーレスポンス・セキュリティがサービス仕様と整合しているか？ | 設計書 <-> サービス仕様 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 前版・類似設計・最新仕様との差分で意図しない脱落がないか？ | 設計書 <-> 過去版・類似設計 |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 設計書内・リポジトリ実装と相互に矛盾していないか？ | 設計書内部・実装の横断確認 |

## 状態: プロンプト定義済み
