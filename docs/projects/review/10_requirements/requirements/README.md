# 要件整理書 セルフレビューパイプライン

## 目的

要件整理書を人間レビューに出す前に、完全性・一貫性・実現可能性を段階的に検証する。
IEEE 830の品質属性（正確・明確・完全・一貫・検証可能・追跡可能）を基準とし、
携帯電話プラン見積アプリのドメイン特性（料金計算の複雑性、仕様変更頻度）を考慮する。

## 関連ノウハウ

レビュー実施前に、以下の関連ノウハウを読むことを推奨する。

| # | ノウハウ | 主な活用Phase |
|---|---------|-------------|
| 01 | [要件トレーサビリティ](../../knowhow/01_requirements-traceability.md) | 2A, 3 |
| 02 | [設計の一貫性・整合性](../../knowhow/02_design-consistency.md) | 2B, 4 |
| 04 | [セキュリティ設計](../../knowhow/04_security-design.md) | 2C |
| 05 | [パフォーマンス・スケーラビリティ](../../knowhow/05_performance-scalability.md) | 2C |
| 06 | [エラーハンドリング・異常系](../../knowhow/06_error-handling.md) | 2C |
| 07 | [テストカバレッジ・テスト戦略](../../knowhow/07_test-coverage-strategy.md) | 2C |
| 09 | [保守性・可読性・命名規則](../../knowhow/09_maintainability-readability.md) | 2B, 4 |
| 10 | [レビュープロセス・メトリクス](../../knowhow/10_review-process-metrics.md) | 4 |

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  要件の完全性
      |
      v
Phase 2B  要件間の一貫性・矛盾
      |
      v
Phase 2C  実現可能性・検証可能性
      |
      v
Phase 3   差分チェック（上流・仕様・サービス・リポジトリとの突合）
      |
      v
Phase 4   横断整合性チェック
      |
      v
人間レビューへ提出
```

## プロンプト一覧

| Phase | ファイル | 問い | 視点の方向 |
|-------|---------|------|-----------|
| 2A | [10_self-review-completeness.prompt.md](10_self-review-completeness.prompt.md) | テンプレートの全セクションが埋まっているか？ ID体系が途切れていないか？ 暗黙の要件が文書化されているか？ | テンプレート <-> 要件整理書 |
| 2B | [20_self-review-consistency.prompt.md](20_self-review-consistency.prompt.md) | 要件同士が矛盾していないか？ 用語・優先度が統一されているか？ 曖昧表現がないか？ | 要件整理書内の相互比較 |
| 2C | [30_self-review-feasibility.prompt.md](30_self-review-feasibility.prompt.md) | 各要件は技術的に実現可能か？ テストで検証可能か？ 非機能・セキュリティ・異常系は考慮されているか？ | 要件整理書 <-> 技術制約・リポジトリ |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 最新仕様・サービス・類似案件との差分で脱落がないか？ 派生要件が追跡されているか？ | 要件整理書 <-> 外部仕様・過去案件・リポジトリ |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 全セクションを横断して矛盾・脱落がないか？ 5W1Hを満たしているか？ | 要件整理書全体の俯瞰 |

## 状態

プロンプト定義済み
