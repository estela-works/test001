# 型定義詳細設計書 セルフレビューパイプライン

## 目的

型定義詳細設計書（detail-design-types.md）の品質を、人間レビュー前に設計者自身が段階的・網羅的に検証する。
感覚的なレビューではなく、「表を作って機械的に突合する」ことで、型の漏れ・不整合・安全性の問題を構造的に防ぐ。

## 対象アプリ

携帯電話のプラン見積アプリ

## 上流ドキュメント

- basic-design-frontend.md（フロントエンド基本設計書）
- detail-design-frontend.md（コンポーネント詳細設計書）
- detail-design-store.md（ストア詳細設計書）

## 関連ドキュメント

- detail-design-api.md（API詳細設計書 - APIスキーマとFE型の一致が必須）

## 共通レビュー観点

| ID | 観点 | 説明 |
|----|------|------|
| A | 上流ドキュメント整合性 | basic-design-frontend.md、detail-design-frontend.md、detail-design-store.md との整合 |
| B | 最新仕様書整合性 | specs/ 配下の最新仕様との整合 |
| C | 最新サービス仕様整合性 | サービス仕様（プラン体系、料金ルール等）との整合 |
| D | リポジトリ実装整合性 | 既存の型定義ファイル（src/types/）との整合 |

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  型の網羅性チェック
      |
      v
Phase 2B  型の整合性チェック
      |
      v
Phase 2C  型安全性チェック
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
| 2A | [10_self-review-type-completeness.prompt.md](10_self-review-type-completeness.prompt.md) | 必要な型がすべて定義されているか？ | 設計書 <-> テンプレート・上流設計 |
| 2B | [20_self-review-type-consistency.prompt.md](20_self-review-type-consistency.prompt.md) | 型がAPIスキーマ・コンポーネント設計・バリデーションルールと整合しているか？ | 設計書 <-> 関連設計書 |
| 2C | [30_self-review-type-safety.prompt.md](30_self-review-type-safety.prompt.md) | 型安全性（nullable、union、exhaustive）が確保されているか？ | 設計書内の型安全性 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 上流設計・仕様・リポジトリとの差分で意図しない脱落がないか？ | 設計書 <-> 上流・仕様・実装 |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 型定義ファイル間・セクション間で矛盾がないか？ | 設計書内部の横断確認 |
