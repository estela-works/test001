# レビューノウハウ集

設計書レビュー・テスト設計レビューにおけるベストプラクティスとノウハウをまとめたフォルダ。
セルフレビュープロンプト集（`review/` 配下）を補完する位置づけで、レビュー実施時の背景知識・判断基準として活用する。

## 観点一覧

| # | ファイル | 観点 | 概要 |
|---|---------|------|------|
| 01 | [01_requirements-traceability.md](01_requirements-traceability.md) | 要件トレーサビリティ | 要件→設計→実装→テストの追跡性確保 |
| 02 | [02_design-consistency.md](02_design-consistency.md) | 設計の一貫性・整合性 | ドキュメント間・ドキュメント内の矛盾検出 |
| 03 | [03_interface-design.md](03_interface-design.md) | インターフェース設計 | API・画面・外部連携の設計品質 |
| 04 | [04_security-design.md](04_security-design.md) | セキュリティ設計 | OWASP Top 10、認証認可、脆弱性対策 |
| 05 | [05_performance-scalability.md](05_performance-scalability.md) | パフォーマンス・スケーラビリティ | 非機能要件、負荷設計、キャッシュ戦略 |
| 06 | [06_error-handling.md](06_error-handling.md) | エラーハンドリング・異常系 | 異常系設計、例外処理、リカバリー |
| 07 | [07_test-coverage-strategy.md](07_test-coverage-strategy.md) | テストカバレッジ・テスト戦略 | テストレベル設計、網羅性、観点リスト |
| 08 | [08_test-data-management.md](08_test-data-management.md) | テストデータ設計・管理 | テストデータ準備、境界値、環境管理 |
| 09 | [09_maintainability-readability.md](09_maintainability-readability.md) | 保守性・可読性・命名規則 | コード品質、命名規約、SOLID原則 |
| 10 | [10_review-process-metrics.md](10_review-process-metrics.md) | レビュープロセス・メトリクス | レビュー運営、品質指標、改善サイクル |

## 使い方

1. セルフレビュープロンプト実行前に、該当する観点のノウハウを読む
2. レビュー指摘の根拠・背景知識として参照する
3. 新たな知見やプロジェクト固有のノウハウがあれば追記する

## 情報源

- Qiita、Zenn 等の技術ブログ
- OWASP（Open Web Application Security Project）
- Microsoft Azure Architecture Center
- フューチャー株式会社 Web API設計ガイドライン
- JaSST / SQuBOK 等のソフトウェア品質コミュニティ
- IPA（情報処理推進機構）
