# テンプレート

案件スコープドキュメントのテンプレート集。
フェーズごとにフォルダ分けし、開発の流れに沿ってナンバリングしている。

## フォルダ構成

```
template/
├── 10_requirements/          # 要件定義フェーズ
│   └── requirements-template.md
├── 20_basic-design/          # 基本設計フェーズ
│   ├── basic-design-frontend-template.md
│   └── basic-design-backend-template.md
├── 30_detail-design/         # 詳細設計フェーズ
│   ├── detail-design-frontend-template.md
│   ├── detail-design-api-template.md
│   ├── detail-design-logic-template.md
│   ├── detail-design-sql-template.md
│   ├── detail-design-db-template.md
│   ├── detail-design-store-template.md
│   └── detail-design-types-template.md
├── 40_test-spec/             # テスト設計フェーズ
│   ├── 41_unit-test/             # 単体試験
│   │   ├── test-spec-unit-frontend-template.md
│   │   └── test-spec-unit-backend-template.md
│   ├── 42_integration-test/      # 結合試験
│   │   ├── test-spec-integration-frontend-template.md
│   │   ├── test-spec-integration-backend-template.md
│   │   └── test-spec-integration-external-template.md
│   └── 43_system-test/           # 総合試験
│       ├── test-spec-system-template.md
│       └── test-spec-e2e-template.md
├── 50_report/                # 作業報告フェーズ
│   ├── implementation-report-template.md
│   └── test-implementation-report-template.md
└── README.md
```

## テンプレート一覧

### 10 - 要件定義

| テンプレート | 説明 |
|-------------|------|
| [requirements-template.md](10_requirements/requirements-template.md) | 要件整理書 |

### 20 - 基本設計

| テンプレート | 説明 |
|-------------|------|
| [basic-design-frontend-template.md](20_basic-design/basic-design-frontend-template.md) | フロントエンド基本設計書 |
| [basic-design-backend-template.md](20_basic-design/basic-design-backend-template.md) | バックエンド基本設計書 |

### 30 - 詳細設計

| テンプレート | 説明 |
|-------------|------|
| [detail-design-frontend-template.md](30_detail-design/detail-design-frontend-template.md) | フロントエンド詳細設計書 |
| [detail-design-api-template.md](30_detail-design/detail-design-api-template.md) | API詳細設計書 |
| [detail-design-logic-template.md](30_detail-design/detail-design-logic-template.md) | ロジック詳細設計書 |
| [detail-design-sql-template.md](30_detail-design/detail-design-sql-template.md) | SQL詳細設計書 |
| [detail-design-db-template.md](30_detail-design/detail-design-db-template.md) | DB詳細設計書 |
| [detail-design-store-template.md](30_detail-design/detail-design-store-template.md) | Store詳細設計書（Vue/Pinia） |
| [detail-design-types-template.md](30_detail-design/detail-design-types-template.md) | TypeScript型定義詳細設計書 |

### 40 - テスト設計

テストレベルごとにサブフォルダで整理。詳細は [40_test-spec/README.md](40_test-spec/README.md) を参照。

#### 41 - 単体試験

| テンプレート | 説明 |
|-------------|------|
| [test-spec-unit-frontend-template.md](40_test-spec/41_unit-test/test-spec-unit-frontend-template.md) | フロントエンド単体テスト（コンポーネント・ストア・純粋関数） |
| [test-spec-unit-backend-template.md](40_test-spec/41_unit-test/test-spec-unit-backend-template.md) | バックエンド単体テスト（Mapper・Service） |

#### 42 - 結合試験

| テンプレート | 説明 |
|-------------|------|
| [test-spec-integration-frontend-template.md](40_test-spec/42_integration-test/test-spec-integration-frontend-template.md) | フロントエンド結合テスト（コンポーネント+ストア・画面遷移） |
| [test-spec-integration-backend-template.md](40_test-spec/42_integration-test/test-spec-integration-backend-template.md) | バックエンド結合テスト（Service+Mapper+DB・API全層） |
| [test-spec-integration-external-template.md](40_test-spec/42_integration-test/test-spec-integration-external-template.md) | 外部コンポーネント接続テスト（外部API・DB・MQ・認証等） |

#### 43 - 総合試験

| テンプレート | 説明 |
|-------------|------|
| [test-spec-system-template.md](40_test-spec/43_system-test/test-spec-system-template.md) | 総合テスト（業務シナリオ・非機能・障害リカバリ） |
| [test-spec-e2e-template.md](40_test-spec/43_system-test/test-spec-e2e-template.md) | E2Eテスト（総合試験の自動化パート） |

### 50 - 作業報告

| テンプレート | 説明 |
|-------------|------|
| [implementation-report-template.md](50_report/implementation-report-template.md) | 実装作業報告書 |
| [test-implementation-report-template.md](50_report/test-implementation-report-template.md) | テスト実装報告書 |

## 使い方

1. 案件フォルダを作成: `YYYYMMDD_連番_案件名`
   - 例: `20260108_01_ユーザー管理機能`
   - 同日に複数案件がある場合は連番を増やす（01, 02, 03...）
2. 必要なテンプレートをフェーズフォルダからコピー
3. 内容を記入

詳細は [ドキュメント体系ガイド](../../document-guide.md) を参照。

---

## フロントエンド設計書の責務分担

フロントエンド関連の設計書は、以下の責務分担に従って記載する。

### 責務マトリクス

| 設計書 | 責務 |
|--------|------|
| basic-design-frontend | コンポーネント一覧、画面構成、状態管理方針、Props/Emits概要 |
| detail-design-frontend | テンプレート構造、スタイル設計、イベント処理、Props/Emits概要表 |
| detail-design-store | 状態定義、API呼び出し実装、エラーハンドリング |
| detail-design-types | 型定義（Props/Emits/State/API）、バリデーション |

### 記載しない項目

| 設計書 | 記載しない項目 | 参照先 |
|--------|---------------|--------|
| detail-design-frontend | 型の詳細定義、バリデーション実装 | detail-design-types |
| detail-design-frontend | API呼び出し実装、エラー処理ロジック | detail-design-store |
| detail-design-store | 型定義 | detail-design-types |
| basic-design-frontend | 型の詳細仕様 | detail-design-types |

### 設計書間の参照関係

```
basic-design-frontend
    ↓
    ├── detail-design-frontend （テンプレート・スタイル）
    ├── detail-design-store （状態・API・エラー処理）
    └── detail-design-types （型・バリデーション）
```

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
