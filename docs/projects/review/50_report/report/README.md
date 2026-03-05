# 作業報告書 セルフレビューパイプライン

## 目的

実装者・テスト実装者が人間レビューに出す前に、自分でやるべき検証を段階的・網羅的に実施する。
実装作業報告書（implementation-report.md）とテスト実装報告書（test-implementation-report.md）の両方に共通して適用できるレビュープロンプト。
感覚的なレビューではなく、「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  報告書完全性
      |
      v
Phase 2B  報告書正確性
      |
      v
Phase 2C  トレーサビリティ
      |
      v
Phase 3   差分チェック
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
| 2A | [10_self-review-completeness.prompt.md](10_self-review-completeness.prompt.md) | 必要な項目がすべて記載されているか？ | 報告書 <-> テンプレート・設計書 |
| 2B | [20_self-review-accuracy.prompt.md](20_self-review-accuracy.prompt.md) | ファイルパス・テスト結果・数値が実際と一致しているか？ | 報告書 <-> リポジトリ・実行ログ |
| 2C | [30_self-review-traceability.prompt.md](30_self-review-traceability.prompt.md) | 成果物・テスト結果・課題が上流と漏れなく対応づけられているか？ | 報告書 <-> 設計書・テスト仕様書 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 設計書最終版・スペック仕様・リポジトリとの差分で脱落がないか？ | 報告書 <-> 外部ドキュメント・コード |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 報告書全体を横断して矛盾・漏れがないか？ | 報告書全体の横断確認 |

## 状態: プロンプト定義済み
