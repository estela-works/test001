# test/

テスト仕様を格納するディレクトリ。本プロジェクトのテストは、バックエンド、フロントエンド、E2Eの3層で構成されています。

## ディレクトリ構成

```
test/
├── README.md                 # このファイル
├── philosophy.md             # テスト設計思想（全体方針）
├── catalog.md                # テストカタログ概要
├── backend/                  # バックエンドテスト（JUnit 5）
│   ├── README.md
│   ├── design.md             # 設計方針
│   └── catalog/              # テストカタログ詳細
├── frontend/                 # フロントエンドテスト（Vitest）
│   ├── README.md
│   ├── design.md             # 設計方針
│   └── catalog/              # テストカタログ詳細
└── e2e/                      # E2Eテスト（Playwright）
    ├── README.md
    ├── design.md             # 設計方針
    └── catalog.md            # テストカタログ詳細
```

## テスト設計ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| [philosophy.md](philosophy.md) | テスト設計思想（全体方針） |
| [backend/design.md](backend/design.md) | バックエンドテスト設計方針 |
| [frontend/design.md](frontend/design.md) | フロントエンドテスト設計方針 |
| [e2e/design.md](e2e/design.md) | E2Eテスト設計方針 |

## テストカタログ

| ドキュメント | 説明 | テスト数 |
|-------------|------|----------|
| [catalog.md](catalog.md) | テストカタログ概要 | - |
| [backend/catalog/](backend/catalog/) | バックエンドテスト詳細（JUnit 5） | 175件 |
| [frontend/catalog/](frontend/catalog/) | フロントエンドテスト詳細（Vitest） | 92件 |
| [e2e/catalog.md](e2e/catalog.md) | E2Eテスト詳細（Playwright） | 39件 |

## テスト統計サマリー

| テスト種別 | フレームワーク | テストケース数 |
|------------|---------------|---------------|
| バックエンド | JUnit 5 | 175 |
| フロントエンド | Vitest | 92 |
| E2E | Playwright | 39 |
| **合計** | - | **306** |
