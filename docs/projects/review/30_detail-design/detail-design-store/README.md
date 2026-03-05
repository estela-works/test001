# Store詳細設計書 セルフレビューパイプライン

## 目的

設計者が人間レビューに出す前に、Pinia Store詳細設計の品質を段階的・網羅的に検証する。
State/Getters設計、Actions・APIマッピング、エラーハンドリング・パフォーマンスの観点で「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  State/Getters設計の整合性（vs basic-design-frontend.md）
      |
      v
Phase 2B  Actions・APIマッピング（vs specs/ / API詳細設計）
      |
      v
Phase 2C  エラーハンドリング・パフォーマンス（vs サービス仕様）
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
| 2A | [10_self-review-state-design.prompt.md](10_self-review-state-design.prompt.md) | State/Gettersが基本設計の状態管理方針と整合しているか？ | 設計書 <-> 基本設計書 |
| 2B | [20_self-review-actions-api.prompt.md](20_self-review-actions-api.prompt.md) | ActionsのAPI呼び出しが仕様書・API設計と整合しているか？ | 設計書 <-> 仕様書・API設計 |
| 2C | [30_self-review-error-performance.prompt.md](30_self-review-error-performance.prompt.md) | エラーハンドリング・パフォーマンスがサービス仕様を満たしているか？ | 設計書 <-> サービス仕様 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 前版・類似設計・最新仕様との差分で意図しない脱落がないか？ | 設計書 <-> 過去版・類似設計 |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 設計書内・リポジトリ実装と相互に矛盾していないか？ | 設計書内部・実装の横断確認 |

## 状態: プロンプト定義済み
