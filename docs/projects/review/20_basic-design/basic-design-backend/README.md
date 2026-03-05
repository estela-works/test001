# バックエンド基本設計書 セルフレビューパイプライン

## 目的

設計者が人間レビューに出す前に、自分でやるべき検証を段階的・網羅的に実施する。
感覚的なレビューではなく、「表を作って機械的に突合する」ことでミスを構造的に防ぐ。

## 対象ドキュメント

- **レビュー対象**: バックエンド基本設計書（basic-design-backend.md）
- **上流ドキュメント**: 要件整理書（requirements.md）
- **下流ドキュメント**: detail-design-api.md, detail-design-logic.md, detail-design-sql.md, detail-design-db.md

## 実行フロー

```
Phase 1（テンプレート充填）
      |  ※ ここから自動レビュー開始
      v
Phase 2A  テンプレート充足性・要件トレーサビリティ
      |
      v
Phase 2B  内部整合性（エンティティ-API整合）
      |
      v
Phase 2C  技術的実現可能性
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
| 2A | [10_self-review-completeness.prompt.md](10_self-review-completeness.prompt.md) | テンプレートの全項目が充足され、要件との対応が取れているか？ | 設計書 <-> テンプレート・要件 |
| 2B | [20_self-review-consistency.prompt.md](20_self-review-consistency.prompt.md) | エンティティ・API・エラー定義が内部で一貫しているか？ | 設計書内の整合性 |
| 2C | [30_self-review-feasibility.prompt.md](30_self-review-feasibility.prompt.md) | 技術的に実現可能な設計になっているか？ | 設計書 <-> アーキテクチャ制約 |
| 3 | [40_diff-check.prompt.md](40_diff-check.prompt.md) | 上流要件・最新仕様・リポジトリとの差分で意図しない脱落がないか？ | 設計書 <-> 外部ドキュメント・実装 |
| 4 | [50_cross-consistency.prompt.md](50_cross-consistency.prompt.md) | 設計書内の複数セクションが相互に矛盾していないか？ | 設計書内部の横断確認 |
