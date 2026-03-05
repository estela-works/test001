# フロントエンド基本設計書 セルフレビューパイプライン

## 目的

設計者が人間レビューに出す前に、自分でやるべき検証を段階的・網羅的に実施する。
感覚的なレビューではなく、「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  トリガーの整合性
      |
      v
Phase 2B  バリエーション差異の保全
      |
      v
Phase 2C  異常系の離脱パス
      |
      v
Phase 2D  データフローの型一貫性
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
| 2A | [10_self-review-trigger.prompt.md](10_self-review-trigger.prompt.md) | トリガーが既存の操作モデルと合っているか？ | 設計書 <-> 既存仕様 |
| 2B | [20_self-review-variation.prompt.md](20_self-review-variation.prompt.md) | バリエーション差異が統合ロジックで消えていないか？ | 設計書内の条件網羅 |
| 2C | [30_self-review-exit-path.prompt.md](30_self-review-exit-path.prompt.md) | 異常系の離脱でシステム状態が壊れないか？ | 設計書 <-> システム状態 |
| 2D | [35_self-review-dataflow.prompt.md](35_self-review-dataflow.prompt.md) | DB->BS->BFF->FEの全レイヤーで型が一貫しているか？ | 設計書 <-> 実装コード |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 前版・類似設計・最新仕様との差分で意図しない脱落がないか？ | 設計書 <-> 過去版・類似設計 |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 設計書内の複数セクションが相互に矛盾していないか？ | 設計書内部の横断確認 |
