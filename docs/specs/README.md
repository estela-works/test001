# 最新仕様ドキュメント

アプリケーションの現在の状態を反映する仕様ドキュメントを格納するフォルダ。

## フォルダ構成

```
specs/
├── architecture.md          # アーキテクチャ仕様書
├── api-catalog.md           # API一覧
├── screen-catalog.md        # 画面一覧
├── logic-catalog.md         # ロジック一覧
├── db-schema.md             # DB構造
├── test-catalog.md          # テストケース集積
└── screens/                 # 画面詳細
    ├── index.md             # 画面インデックス
    ├── SC-001/              # ホーム画面
    └── SC-002/              # ToDoリスト画面
```

## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [architecture.md](architecture.md) | 技術構成・システム構造 |
| [api-catalog.md](api-catalog.md) | 全APIエンドポイント一覧 |
| [screen-catalog.md](screen-catalog.md) | 画面一覧・UI仕様 |
| [logic-catalog.md](logic-catalog.md) | ビジネスロジック一覧 |
| [db-schema.md](db-schema.md) | DB構造・テーブル定義 |
| [test-catalog.md](test-catalog.md) | 全テストケース集積 |
| [screens/](screens/) | 画面詳細仕様 |

## 更新タイミング

案件完了時に該当するドキュメントを更新する。

詳細は [ドキュメント体系ガイド](../document-guide.md) を参照。
