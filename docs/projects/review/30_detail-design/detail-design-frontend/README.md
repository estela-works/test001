# フロントエンド詳細設計書 セルフレビューパイプライン

## 目的

設計者が人間レビューに出す前に、Vue.jsコンポーネント詳細設計の品質を段階的・網羅的に検証する。
コンポーネント構造、状態管理、UX・アクセシビリティの観点で「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  コンポーネント構造の整合性（vs basic-design-frontend.md）
      |
      v
Phase 2B  状態管理・イベントハンドリング（vs specs/）
      |
      v
Phase 2C  UX・アクセシビリティ（vs サービス仕様）
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
| 2A | [10_self-review-component-structure.prompt.md](10_self-review-component-structure.prompt.md) | コンポーネント分割・Props/Emitsが基本設計と整合しているか？ | 設計書 <-> 基本設計書 |
| 2B | [20_self-review-state-event.prompt.md](20_self-review-state-event.prompt.md) | Store利用・イベントハンドリングが最新仕様と整合しているか？ | 設計書 <-> 仕様書 |
| 2C | [30_self-review-ux-accessibility.prompt.md](30_self-review-ux-accessibility.prompt.md) | UX設計とアクセシビリティがサービス仕様と整合しているか？ | 設計書 <-> サービス仕様 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 前版・類似設計・最新仕様との差分で意図しない脱落がないか？ | 設計書 <-> 過去版・類似設計 |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 設計書内・リポジトリ実装と相互に矛盾していないか？ | 設計書内部・実装の横断確認 |

## 状態: プロンプト定義済み
