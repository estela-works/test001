# 最新仕様ドキュメント

アプリケーションの現在の状態を反映する仕様ドキュメントを格納するフォルダ。

## システム概要

| 項目 | 内容 |
|------|------|
| フロントエンド | Vue.js 3 (Composition API) + Pinia + Vue Router |
| バックエンド | Spring Boot 3.2 + MyBatis |
| データベース | H2 Database (ファイルモード) |
| ビルドツール | Vite (フロントエンド) / Maven (バックエンド) |
| 最終更新日 | 2025-12-24 |

## フォルダ構成

```
specs/
├── architecture.md          # アーキテクチャ仕様書
├── api-catalog.md           # API一覧
├── api/                     # API詳細仕様
│   ├── index.md             # APIインデックス
│   ├── API-TODO-XXX.md      # Todo API詳細
│   ├── API-PROJECT-XXX.md   # Project API詳細
│   └── API-USER-XXX.md      # User API詳細
├── logic-catalog.md         # ロジック一覧
├── db-schema.md             # DB構造
├── test-catalog.md          # テストケース概要
├── test/                    # テスト詳細仕様
│   ├── backend-test-catalog.md  # バックエンドテスト詳細
│   └── e2e-test-catalog.md      # E2Eテスト詳細
└── screens/                 # 画面一覧・詳細
    ├── index.md             # 画面一覧
    ├── SC-001/              # ホーム画面
    ├── SC-002/              # ToDoリスト画面
    ├── SC-003/              # プロジェクト画面
    └── SC-004/              # ユーザー管理画面
```

## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [architecture.md](architecture.md) | 技術構成・システム構造 |
| [api-catalog.md](api-catalog.md) | 全APIエンドポイント一覧 |
| [screens/](screens/) | 画面一覧・詳細仕様 |
| [api/](api/) | API詳細仕様 |
| [logic-catalog.md](logic-catalog.md) | ビジネスロジック一覧 |
| [db-schema.md](db-schema.md) | DB構造・テーブル定義 |
| [test-catalog.md](test-catalog.md) | テストケース概要 |
| [test/](test/) | テスト詳細仕様 |

## 更新タイミング

案件完了時に該当するドキュメントを更新する。

詳細は [ドキュメント体系ガイド](../document-guide.md) を参照。
