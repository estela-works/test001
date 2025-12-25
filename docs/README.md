# ドキュメント

## フォルダ構成

```
docs/
├── projects/                               # 案件スコープドキュメント
│   ├── YYYYMM_案件名/                       # 案件ごとのフォルダ
│   │   ├── requirements.md                 # 要件整理書
│   │   ├── basic-design-frontend.md        # フロントエンド基本設計書
│   │   ├── basic-design-backend.md         # バックエンド基本設計書
│   │   ├── detail-design-frontend.md       # フロントエンド詳細設計書
│   │   ├── detail-design-api.md            # API詳細設計書
│   │   ├── detail-design-logic.md          # ロジック詳細設計書
│   │   ├── detail-design-sql.md            # SQL詳細設計書
│   │   ├── detail-design-db.md             # DB詳細設計書
│   │   ├── detail-design-store.md          # Store詳細設計書
│   │   ├── detail-design-types.md          # TypeScript型定義詳細設計書
│   │   ├── test-spec-frontend.md            # フロントエンドテスト方針書
│   │   └── test-spec-backend.md             # バックエンドテスト方針書
│   └── template/                            # テンプレート
│       ├── requirements-template.md
│       ├── basic-design-frontend-template.md
│       ├── basic-design-backend-template.md
│       ├── detail-design-frontend-template.md
│       ├── detail-design-api-template.md
│       ├── detail-design-logic-template.md
│       ├── detail-design-sql-template.md
│       ├── detail-design-db-template.md
│       ├── detail-design-store-template.md
│       ├── detail-design-types-template.md
│       ├── test-spec-frontend-template.md
│       └── test-spec-backend-template.md
│
├── specs/                                   # 最新仕様ドキュメント
│   ├── architecture.md                      # アーキテクチャ仕様書
│   ├── api-catalog.md                       # API一覧
│   ├── api/                                 # API詳細仕様
│   ├── screens/                             # 画面一覧・詳細仕様
│   ├── logic-catalog.md                     # ロジック一覧
│   ├── db-schema.md                         # DB構造
│   └── test-catalog.md                      # テストケース集積
│
├── reference/                               # リファレンス（技術ノウハウ集）
│   ├── best-practices/                      # ベストプラクティス・設計指針
│   │   ├── frontend-testing-strategies/     # フロントエンドテスト戦略
│   │   └── backend-testing-guide.md         # バックエンドテストガイド
│   ├── tips/                                # 実装Tips・小技集
│   └── troubleshooting/                     # トラブルシューティング
│
├── implementation/                          # 実装ガイド
│   └── IMPLEMENTATION_GUIDE.md              # 実装ガイドライン
│
├── document-guide.md                        # ドキュメント体系ガイド
└── README.md                                # このファイル
```

## ドキュメント分類

詳細は[ドキュメント体系ガイド](document-guide.md)を参照してください。

### 3つのカテゴリ

| カテゴリ | 目的 | ライフサイクル |
|---------|------|---------------|
| **案件スコープ** | 今回の変更内容を記録 | 案件ごとに作成・完結 |
| **最新仕様** | 現在のシステム状態を反映 | 継続的にメンテナンス |
| **リファレンス** | 技術ノウハウ・ベストプラクティス | 知見の蓄積・更新 |

## 案件スコープドキュメント

案件ごとに `projects/YYYYMM_案件名/` フォルダを作成し、以下を格納する。

### 要件定義フェーズ

| ドキュメント | 目的 |
|-------------|------|
| requirements.md | なぜ作るか・何が必要か |

### 基本設計フェーズ

| ドキュメント | 目的 |
|-------------|------|
| basic-design-frontend.md | 画面・UIの基本設計 |
| basic-design-backend.md | 機能・データ・APIの基本設計 |

### 詳細設計フェーズ

| ドキュメント | 目的 |
|-------------|------|
| detail-design-frontend.md | 画面実装仕様 |
| detail-design-api.md | APIエンドポイント仕様 |
| detail-design-logic.md | ビジネスロジック仕様 |
| detail-design-sql.md | SQLクエリ仕様 |
| detail-design-db.md | DB変更仕様 |
| detail-design-store.md | Store設計仕様（Vue/Pinia） |
| detail-design-types.md | TypeScript型定義仕様 |

### テスト設計フェーズ

| ドキュメント | 目的 |
|-------------|------|
| test-spec-frontend.md | フロントエンドテスト方針 |
| test-spec-backend.md | バックエンドテスト方針 |

**注意**: 案件の規模や内容に応じて、必要なドキュメントのみ作成する。

## 最新仕様ドキュメント

アプリケーションの現在の状態を反映する。案件完了時に更新する。

| ドキュメント | 目的 |
|-------------|------|
| [architecture.md](specs/architecture.md) | 技術構成・システム構造 |
| [api-catalog.md](specs/api-catalog.md) | 全APIエンドポイント一覧 |
| [screens/](specs/screens/) | 画面一覧・UI仕様 |
| [logic-catalog.md](specs/logic-catalog.md) | ビジネスロジック一覧 |
| [db-schema.md](specs/db-schema.md) | DB構造・テーブル定義 |
| [test-catalog.md](specs/test-catalog.md) | 全テストケース集積 |

## リファレンスドキュメント

プロジェクト横断で参照できる技術ノウハウ集。詳細は [reference/README.md](reference/README.md) を参照。

| フォルダ | 内容 |
|---------|------|
| [best-practices/](reference/best-practices/) | ベストプラクティス・設計指針 |
| [tips/](reference/tips/) | 実装Tips・小技集 |
| [troubleshooting/](reference/troubleshooting/) | トラブルシューティング |

## 運用フロー

```
案件開始
    │
    ▼
案件スコープドキュメント作成
（要件整理 → 基本設計 → 詳細設計 → テスト仕様）
    │
    ▼
実装・テスト
    │
    ▼
最新仕様ドキュメント更新
（API一覧、画面一覧、ロジック一覧、DB構造、テスト集積）
    │
    ▼
案件完了・振り返り
```
