# テンプレート

案件スコープドキュメントのテンプレート集。

## テンプレート一覧

### 要件定義

| テンプレート | 説明 |
|-------------|------|
| [requirements-template.md](requirements-template.md) | 要件整理書 |

### 基本設計

| テンプレート | 説明 |
|-------------|------|
| [basic-design-frontend-template.md](basic-design-frontend-template.md) | フロントエンド基本設計書 |
| [basic-design-backend-template.md](basic-design-backend-template.md) | バックエンド基本設計書 |

### 詳細設計

| テンプレート | 説明 |
|-------------|------|
| [detail-design-frontend-template.md](detail-design-frontend-template.md) | フロントエンド詳細設計書 |
| [detail-design-api-template.md](detail-design-api-template.md) | API詳細設計書 |
| [detail-design-logic-template.md](detail-design-logic-template.md) | ロジック詳細設計書 |
| [detail-design-sql-template.md](detail-design-sql-template.md) | SQL詳細設計書 |
| [detail-design-db-template.md](detail-design-db-template.md) | DB詳細設計書 |
| [detail-design-store-template.md](detail-design-store-template.md) | Store詳細設計書（Vue/Pinia） |
| [detail-design-types-template.md](detail-design-types-template.md) | TypeScript型定義詳細設計書 |

### テスト設計

| テンプレート | 説明 |
|-------------|------|
| [test-spec-frontend-template.md](test-spec-frontend-template.md) | フロントエンドテスト方針書 |
| [test-spec-backend-template.md](test-spec-backend-template.md) | バックエンドテスト方針書 |

## 使い方

1. 案件フォルダを作成: `YYYYMM_案件名`
2. 必要なテンプレートをコピー
3. 内容を記入

詳細は [ドキュメント体系ガイド](../../document-guide.md) を参照。

---

## ファイル分割ガイド

ドキュメントが400行を超えた場合、可読性向上のためファイル分割を推奨。

### 分割基準

| 行数 | 推奨アクション |
|------|---------------|
| 300行未満 | 分割不要 |
| 300-400行 | 分割検討 |
| 400行以上 | 分割推奨 |

### 分割方法

1. 元ファイル名でフォルダを作成（例: `test-spec/`）
2. フォルダ内に `README.md` を配置（目次・概要・改版履歴）
3. セクションごとにファイルを分割
4. 各分割ファイルの冒頭に「← 目次に戻る」リンクを追加
5. 元ファイルを削除

### 分割パターン例

```
test-spec.md (500行)
    ↓ 分割
test-spec/
├── README.md         # 目次・概要・改版履歴
├── unit-tests.md     # 単体テスト
├── integration-tests.md  # 結合テスト
└── test-metadata.md  # テストデータ・環境
```

### 既存の分割済みドキュメント

- [frontend-testing-strategies/](../../reference/best-practices/frontend-testing-strategies/)
- [backend-test-catalog/](../../specs/test/backend-test-catalog/)
