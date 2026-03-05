# セルフレビュー プロンプト集

設計者が人間レビューに出す前に、AIを使って段階的・網羅的にセルフレビューを実施するためのプロンプト集。

## 対象アプリケーション

携帯電話のプラン見積アプリ（料金プラン選択、オプション組み合わせ、割引適用、見積計算）

## 設計思想

- **番号順に実行する** - 内部品質を固めてから、外部比較、全体整合へと段階的に広げる
- **「表を作って突合する」** - 感覚レビューではなく、組み合わせを列挙して機械的に網羅する
- **アンチパターンを明示する** - よくあるミスをあらかじめ定義し、同じ罠に落ちないようにする

## 共通レビュー観点

全フェーズ・全ドキュメントに共通して、以下の観点を必ず確認する。

| # | 観点 | 突合対象 | 確認内容 |
|---|------|---------|---------|
| A | 上流ドキュメントとの整合性 | 前段フェーズの成果物 | 要件→基本設計→詳細設計の各段階で、上流の決定事項が正しく反映されているか。抜け・矛盾・勝手な解釈変更がないか |
| B | 最新スペック仕様書との整合性 | specs/ 配下の仕様書 | 料金プラン・オプション・割引ルール等のスペック仕様が最新版と一致しているか。改定漏れがないか |
| C | 最新サービス仕様との整合性 | サービス仕様書・業務ルール | 実際のサービス提供条件（申込条件、適用ルール、排他制御等）が正しく反映されているか |
| D | リポジトリ実装との整合性 | 実際のソースコード | 設計書の記述が実装コードと一致しているか。既存の実装パターン・命名規則・データ構造との乖離がないか |

### 観点の適用タイミング

```
Phase 2（内部品質チェック）
  └─ 観点D: リポジトリ実装との整合性を随時確認

Phase 3（差分チェック）
  ├─ 観点A: 上流ドキュメントとの突合
  ├─ 観点B: 最新スペック仕様書との突合
  └─ 観点C: 最新サービス仕様との突合

Phase 4（横断整合性チェック）
  └─ 観点A〜Dの横断的な矛盾検出
```

## フォルダ構成

```
review/
├── knowhow/                            # レビューノウハウ集（10観点）
├── 10_requirements/                    # 要件定義フェーズ
│   └── requirements/
├── 20_basic-design/                    # 基本設計フェーズ
│   ├── basic-design-frontend/          ★ プロンプト定義済み
│   └── basic-design-backend/           ★ プロンプト定義済み
├── 30_detail-design/                   # 詳細設計フェーズ
│   ├── detail-design-frontend/        ★ プロンプト定義済み
│   ├── detail-design-api/             ★ プロンプト定義済み
│   ├── detail-design-logic/           ★ プロンプト定義済み
│   ├── detail-design-sql/             ★ プロンプト定義済み
│   ├── detail-design-db/              ★ プロンプト定義済み
│   ├── detail-design-store/           ★ プロンプト定義済み
│   └── detail-design-types/           ★ プロンプト定義済み
├── 40_test-spec/                       # テスト設計フェーズ
│   └── test-spec/                     ★ プロンプト定義済み
└── 50_report/                          # 作業報告フェーズ
    └── report/                        ★ プロンプト定義済み
```

## 実行フロー（共通）

```
Phase 1（テンプレート充填）
      |  ※ ここからセルフレビュー開始
      v
Phase 2A〜2D（内部品質チェック）
      |
      v
Phase 3（差分チェック）
      |
      v
Phase 4（横断整合性チェック）
      |
      v
人間レビューへ提出
```

## 状態

| フォルダ | 状態 |
|---------|------|
| [10_requirements/requirements/](10_requirements/requirements/) | プロンプト定義済み |
| [20_basic-design/basic-design-frontend/](20_basic-design/basic-design-frontend/) | プロンプト定義済み |
| [20_basic-design/basic-design-backend/](20_basic-design/basic-design-backend/) | プロンプト定義済み |
| [30_detail-design/detail-design-frontend/](30_detail-design/detail-design-frontend/) | プロンプト定義済み |
| [30_detail-design/detail-design-api/](30_detail-design/detail-design-api/) | プロンプト定義済み |
| [30_detail-design/detail-design-logic/](30_detail-design/detail-design-logic/) | プロンプト定義済み |
| [30_detail-design/detail-design-sql/](30_detail-design/detail-design-sql/) | プロンプト定義済み |
| [30_detail-design/detail-design-db/](30_detail-design/detail-design-db/) | プロンプト定義済み |
| [30_detail-design/detail-design-store/](30_detail-design/detail-design-store/) | プロンプト定義済み |
| [30_detail-design/detail-design-types/](30_detail-design/detail-design-types/) | プロンプト定義済み |
| [40_test-spec/test-spec/](40_test-spec/test-spec/) | プロンプト定義済み |
| [50_report/report/](50_report/report/) | プロンプト定義済み |

## ノウハウ集

レビュー実施時の背景知識・判断基準として活用するノウハウ集。詳細は [knowhow/README.md](knowhow/README.md) を参照。

| # | 観点 |
|---|------|
| 01 | [要件トレーサビリティ](knowhow/01_requirements-traceability.md) |
| 02 | [設計の一貫性・整合性](knowhow/02_design-consistency.md) |
| 03 | [インターフェース設計](knowhow/03_interface-design.md) |
| 04 | [セキュリティ設計](knowhow/04_security-design.md) |
| 05 | [パフォーマンス・スケーラビリティ](knowhow/05_performance-scalability.md) |
| 06 | [エラーハンドリング・異常系](knowhow/06_error-handling.md) |
| 07 | [テストカバレッジ・テスト戦略](knowhow/07_test-coverage-strategy.md) |
| 08 | [テストデータ設計・管理](knowhow/08_test-data-management.md) |
| 09 | [保守性・可読性・命名規則](knowhow/09_maintainability-readability.md) |
| 10 | [レビュープロセス・メトリクス](knowhow/10_review-process-metrics.md) |

## 使い方

1. レビュー対象のドキュメントに対応するフォルダを開く
2. README.md でフェーズ構成を確認する
3. 番号順にプロンプトを実行し、各フェーズの検証表を出力する
4. 全フェーズ通過後、人間レビューへ提出する
