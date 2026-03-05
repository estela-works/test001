# DB詳細設計書 セルフレビューパイプライン

## 目的

設計者が人間レビューに出す前に、データベーススキーマ詳細設計の品質を段階的・網羅的に検証する。
スキーマ網羅性、制約・インデックス設計、マイグレーション・影響分析の観点で「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  スキーマ網羅性（vs basic-design-backend.md）
      |
      v
Phase 2B  制約・インデックス（vs specs/）
      |
      v
Phase 2C  マイグレーション・影響分析（vs サービス仕様）
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
| 2A | [10_self-review-schema-completeness.prompt.md](10_self-review-schema-completeness.prompt.md) | テーブル・カラム定義が基本設計を網羅しているか？ | 設計書 <-> 基本設計書 |
| 2B | [20_self-review-constraints-indexes.prompt.md](20_self-review-constraints-indexes.prompt.md) | 制約・インデックスが最新仕様と整合しているか？ | 設計書 <-> 仕様書 |
| 2C | [30_self-review-migration-impact.prompt.md](30_self-review-migration-impact.prompt.md) | マイグレーション・影響分析がサービス仕様を満たしているか？ | 設計書 <-> サービス仕様 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 前版・類似設計・最新仕様との差分で意図しない脱落がないか？ | 設計書 <-> 過去版・類似設計 |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 設計書内・リポジトリ実装と相互に矛盾していないか？ | 設計書内部・実装の横断確認 |

## 状態: プロンプト定義済み
