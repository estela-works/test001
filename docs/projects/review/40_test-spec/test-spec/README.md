# テスト仕様書 セルフレビューパイプライン

## 目的

テスト設計者が人間レビューに出す前に、自分でやるべき検証を段階的・網羅的に実施する。
7つのテストテンプレート（単体FE/BE、結合FE/BE/外部、総合、E2E）の全てに共通して適用できるレビュープロンプト。
感覚的なレビューではなく、「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  テストケースカバレッジ完全性
      |
      v
Phase 2B  テスト設計品質
      |
      v
Phase 2C  テスト仕様書 <-> 設計書の整合性
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
| 2A | [10_self-review-coverage.prompt.md](10_self-review-coverage.prompt.md) | 要件・設計のすべての仕様項目がテストケースでカバーされているか？ | 上流ドキュメント <-> テスト仕様書 |
| 2B | [20_self-review-testability.prompt.md](20_self-review-testability.prompt.md) | テストケースが独立・再現可能で期待結果が検証可能か？ | テスト仕様書内の品質 |
| 2C | [30_self-review-consistency.prompt.md](30_self-review-consistency.prompt.md) | ID体系・レベル境界・命名が設計ルールと一致し重複がないか？ | テスト仕様書 <-> 設計ルール・設計書 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 上流設計書・スペック仕様・テストコードとの差分で脱落がないか？ | テスト仕様書 <-> 外部ドキュメント・コード |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | テスト仕様書全体を横断して矛盾・漏れがないか？ | テスト仕様書全体の横断確認 |

## 状態: プロンプト定義済み
