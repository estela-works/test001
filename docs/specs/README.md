# 最新仕様ドキュメント

アプリケーションの現在の状態を反映する仕様ドキュメントを格納するフォルダ。

## システム概要

| 項目 | 内容 |
|------|------|
| フロントエンド | Vue.js 3 (Composition API) + Pinia + Vue Router |
| バックエンド | Spring Boot 3.2 + MyBatis |
| データベース | H2 Database (ファイルモード) |
| ビルドツール | Vite (フロントエンド) / Maven (バックエンド) |
| 最終更新日 | 2025-12-26 |

## フォルダ構成

```
specs/
├── architecture.md          # アーキテクチャ仕様書
├── api/                     # API仕様
│   ├── api-catalog.md       # API一覧
│   ├── index.md             # APIインデックス
│   ├── API-TODO-XXX.md      # Todo API詳細（9件）
│   └── API-USER-XXX.md      # User API詳細（4件）
├── logic/                   # ロジック仕様
│   └── logic-catalog.md     # ロジック一覧
├── db/                      # DB仕様
│   └── db-schema.md         # DB構造
├── test/                    # テスト仕様
│   ├── test-catalog.md      # テストケース概要
│   ├── backend-test-catalog/ # バックエンドテスト詳細
│   ├── frontend-test-catalog/ # フロントエンドテスト詳細
│   └── e2e-test-catalog.md  # E2Eテスト詳細
├── screens/                 # 画面一覧・詳細
│   ├── index.md             # 画面一覧
│   ├── SC-001/              # ホーム画面
│   ├── SC-002/              # チケット管理画面
│   ├── SC-003/              # プロジェクト画面
│   ├── SC-004/              # ユーザー管理画面
│   └── SC-005/              # チケット一覧画面
├── frontend/                # フロントエンド仕様
│   ├── README.md              # フロントエンド仕様概要
│   ├── frontend-overview.md   # フロントエンド全体概要
│   ├── component-catalog.md   # コンポーネントカタログ
│   ├── store-catalog.md       # ストアカタログ
│   ├── type-catalog.md        # 型定義カタログ
│   └── routing-spec.md        # ルーティング仕様
├── service/                 # サービス仕様（ドコモサービスの仕様定義）
│   ├── 01-plans/            # 料金プラン（MAX/mini/ahamo等）
│   ├── 02-infrastructure/   # インフラ（光/home 5G/でんき/ガス）
│   ├── 03-discounts/        # セット割引（みんなドコモ割/光セット割等）
│   ├── 04-devices/          # 端末購入プログラム・補償
│   ├── 05-accessories/      # アクセサリー
│   └── 06-terminology/      # 用語・表記ルール
└── template/                # フロントエンド仕様書テンプレート
    ├── README.md                       # テンプレート概要
    ├── frontend-overview-template.md   # フロントエンド全体概要
    ├── component-catalog-template.md   # コンポーネントカタログ
    ├── store-catalog-template.md       # ストアカタログ
    ├── type-catalog-template.md        # 型定義カタログ
    └── routing-spec-template.md        # ルーティング仕様
```

## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [architecture.md](architecture.md) | 技術構成・システム構造 |
| [api/](api/) | API仕様（一覧・詳細） |
| [logic/](logic/) | ロジック仕様 |
| [db/](db/) | DB仕様（テーブル定義） |
| [test/](test/) | テスト仕様（カタログ・詳細） |
| [screens/](screens/) | 画面一覧・詳細仕様 |
| [frontend/](frontend/) | フロントエンド仕様 |
| [service/](service/) | サービス仕様（ドコモサービスの料金・割引・インフラ・端末） |
| [template/](template/) | フロントエンド仕様書テンプレート |

## 更新タイミング

案件完了時に該当するドキュメントを更新する。

詳細は [ドキュメント体系ガイド](../document-guide.md) を参照。
