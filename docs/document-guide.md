# ドキュメント体系ガイド

## 1. 概要

本ドキュメントは、プロジェクトにおけるドキュメントの体系・目的・運用フローを定義する。

---

## 2. ドキュメント分類の基本思想

本プロジェクトでは、ドキュメントを**3つのカテゴリ**に分類して管理する。

### 2.1 分類の目的

| カテゴリ | 目的 | ライフサイクル |
|---------|------|---------------|
| **案件スコープ** | 今回の変更内容・仕様を正確に記録する | 案件ごとに新規作成・完結 |
| **最新仕様** | アプリケーションの現在の状態を反映する | 継続的にメンテナンス・累積 |
| **リファレンス** | 技術ノウハウ・ベストプラクティスを蓄積する | 知見の蓄積・随時更新 |

### 2.2 なぜ分けるのか

- **案件スコープ**: 「この案件で何を変更したか」を後から追跡可能にする。案件単位でスコープを閉じることで、変更の責任範囲が明確になる。
- **最新仕様**: 「現在のシステムはどうなっているか」を常に把握できる状態を維持する。新規参画者や保守担当者が現状を理解するための唯一の正（Single Source of Truth）となる。
- **リファレンス**: 「どうすればうまくいくか」の知見を蓄積する。案件や仕様に依存しない、横断的な技術ノウハウを共有する。

---

## 3. 案件スコープドキュメント

### 3.1 概要

案件（機能追加・改修・バグ修正など）ごとに作成し、その案件で完結するドキュメント。

### 3.2 対象ドキュメント

#### 要件定義フェーズ

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| 要件整理書 | なぜ作るか・何が必要かを整理 | 背景、要求、スコープ、受入条件 |

#### 基本設計フェーズ

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| フロントエンド基本設計書 | 画面・UIを定義 | 画面一覧、レイアウト、操作フロー |
| バックエンド基本設計書 | 機能・データを定義 | 機能要件、データ要件、API要件 |

#### 詳細設計フェーズ

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| フロントエンド詳細設計書 | 画面実装仕様を定義 | コンポーネント、状態管理、イベント処理 |
| API詳細設計書 | APIエンドポイント仕様を定義 | リクエスト/レスポンス、バリデーション |
| ロジック詳細設計書 | ビジネスロジック仕様を定義 | クラス設計、メソッド仕様、処理フロー |
| SQL詳細設計書 | SQLクエリ仕様を定義 | クエリ一覧、パラメータ、実行計画 |
| DB詳細設計書 | DB変更仕様を定義 | テーブル定義、インデックス、マイグレーション |

#### テスト設計フェーズ

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| フロントエンドテスト方針書 | フロントエンドのテストケースを定義 | コンポーネントテスト、E2Eテスト、ストア戦略 |
| バックエンドテスト方針書 | バックエンドのテストケースを定義 | Mapper/Service/Controller層テスト |

#### 作業報告フェーズ

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| 実装作業報告書 | 実装作業の結果を記録 | 成果物一覧、変更内容詳細、課題・残件 |
| テスト実装報告書 | テスト実装作業の結果を記録 | テストファイル一覧、テストケース詳細、実行結果 |

### 3.3 フォルダ構成

```
docs/projects/
├── YYYYMM_案件名/
│   ├── requirements.md              # 要件整理書
│   ├── basic-design-frontend.md     # フロントエンド基本設計書
│   ├── basic-design-backend.md      # バックエンド基本設計書
│   ├── detail-design-frontend.md    # フロントエンド詳細設計書
│   ├── detail-design-api.md         # API詳細設計書
│   ├── detail-design-logic.md       # ロジック詳細設計書
│   ├── detail-design-sql.md         # SQL詳細設計書
│   ├── detail-design-db.md          # DB詳細設計書
│   ├── test-spec-frontend.md        # フロントエンドテスト方針書
│   ├── test-spec-backend.md         # バックエンドテスト方針書
│   ├── implementation-report.md     # 実装作業報告書
│   └── test-implementation-report.md # テスト実装報告書
└── template/
    ├── requirements-template.md
    ├── basic-design-frontend-template.md
    ├── basic-design-backend-template.md
    ├── detail-design-frontend-template.md
    ├── detail-design-api-template.md
    ├── detail-design-logic-template.md
    ├── detail-design-sql-template.md
    ├── detail-design-db-template.md
    ├── test-spec-frontend-template.md
    ├── test-spec-backend-template.md
    ├── implementation-report-template.md
    └── test-implementation-report-template.md
```

**注意**: 案件の規模や内容に応じて、必要なドキュメントのみ作成する。すべてを作成する必要はない。

### 3.4 ドキュメント作成方針

#### 3.4.1 「変更なし」も記録する

案件において変更がない領域についても、ドキュメントを作成して「変更なし」であることを明記する。

**理由**:
- 「検討した結果、変更しなかった」ことと「検討を忘れた」ことを区別できる
- 案件のスコープが明確になり、レビューや引き継ぎが容易になる
- 将来の案件で参照した際に、影響範囲の判断材料となる

**例**: フロントエンドのみの改修案件でも、バックエンド基本設計書を作成し「変更なし」と記載する

```markdown
# バックエンド基本設計書

## 1. 概要

### 1.1 バックエンドの役割

| 責務 | 本案件での変更 |
|------|---------------|
| データ管理 | **変更なし** |
| ビジネスロジック | **変更なし** |
| API提供 | **変更なし** |

### 1.2 変更なしの理由

本案件はフロントエンドのみの改善であり、以下の理由によりバックエンドの変更は不要である:
1. 静的HTMLファイルの追加のみ
2. 新規API不要
3. データモデル変更なし
```

### 3.5 命名規則

- フォルダ名: `YYYYMM_案件名`（例: `202501_ユーザー認証機能追加`）
- 案件名は簡潔かつ識別可能な名称とする

### 3.6 ライフサイクル

```
案件開始
    │
    ├─→ 要件整理書を作成（なぜ・何が必要か）
    │
    ├─→ 基本設計書を作成（何を作るか）
    │     ├─ フロントエンド基本設計書
    │     └─ バックエンド基本設計書
    │
    ├─→ 詳細設計書を作成（どう作るか）
    │     ├─ フロントエンド詳細設計書
    │     ├─ API詳細設計書
    │     ├─ ロジック詳細設計書
    │     ├─ SQL詳細設計書
    │     └─ DB詳細設計書
    │
    ├─→ テスト方針書を作成（何をテストするか）
    │     ├─ フロントエンドテスト方針書
    │     └─ バックエンドテスト方針書
    │
    ▼
実装
    │
    ├─→ 実装作業報告書を作成（何を実装したか）
    │
    ▼
テスト実装
    │
    ├─→ テスト実装報告書を作成（何をテストしたか）
    │
    ▼
案件完了（ドキュメントはアーカイブとして保持）
```

※ 案件の規模・内容に応じて必要なドキュメントのみ作成

---

## 4. 最新仕様ドキュメント

### 4.1 概要

アプリケーションの現在の状態を反映し、継続的にメンテナンスするドキュメント。案件完了時に更新される。

### 4.2 対象ドキュメント

#### システム基盤

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| アーキテクチャ仕様書 | 技術構成・システム構造を定義 | 技術スタック、レイヤー構成、設計原則 |
| ロジック一覧 | ビジネスルール・バリデーションの集積 | ルール名、条件、適用箇所 |
| DB構造 | データベースの現在の構造 | テーブル定義、カラム、リレーション |

#### バックエンド

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| API一覧 | 全エンドポイントの現在の仕様（概要） | URL、メソッド、リクエスト/レスポンス |
| API詳細 | 各APIの詳細仕様 | 利用案件、参照システム、処理フロー |

#### フロントエンド

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| フロントエンド概要 | フロントエンド技術構成の全体像 | ディレクトリ構成、技術スタック、依存関係 |
| コンポーネントカタログ | 全コンポーネントの一覧・仕様 | Props、Emits、依存関係、使用画面 |
| ストアカタログ | Pinia Storeの一覧・仕様 | State、Getters、Actions、型定義 |
| 型定義カタログ | TypeScript型定義の一覧・仕様 | インターフェース、型エイリアス、使用箇所 |
| ルーティング仕様 | Vue Routerのルート定義 | パス、コンポーネント、ガード |

#### 画面

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| 画面一覧 | 全画面の現在の仕様（概要） | 画面構成、UI要素、遷移 |
| 画面詳細 | 各画面の詳細仕様 | 画面仕様、イベント一覧、イベント詳細 |

#### テスト

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| テストケース概要 | テスト全体のサマリー | テスト分類、カバレッジ、実行方法 |
| バックエンドテストカタログ | JUnitテストの詳細一覧 | Controller/Service/Mapperテスト仕様 |
| E2Eテストカタログ | Playwrightテストの詳細一覧 | テストシナリオ、画面遷移、検証項目 |

### 4.3 フォルダ構成

```
docs/specs/
├── architecture.md          # アーキテクチャ仕様書
├── logic-catalog.md         # ロジック一覧
├── db-schema.md             # DB構造
│
├── api-catalog.md           # API一覧
├── api/                     # API詳細（階層構造）
│   ├── index.md             # APIインデックス
│   ├── API-TODO-XXX.md      # Todo API詳細（9件）
│   └── API-USER-XXX.md      # User API詳細（4件）
│
├── frontend/                # フロントエンド仕様
│   ├── frontend-overview.md    # フロントエンド全体概要
│   ├── component-catalog.md    # コンポーネントカタログ
│   ├── store-catalog.md        # ストアカタログ
│   ├── type-catalog.md         # 型定義カタログ
│   └── routing-spec.md         # ルーティング仕様
│
├── screens/                 # 画面詳細（階層構造）
│   ├── index.md             # 画面一覧
│   ├── SC-001/              # ホーム画面
│   │   ├── screen.md        # 画面仕様
│   │   ├── events.md        # イベント一覧
│   │   └── EV-001-XX.md     # イベント詳細
│   ├── SC-002/              # チケット管理画面
│   ├── SC-003/              # プロジェクト画面
│   ├── SC-004/              # ユーザー管理画面
│   └── SC-005/              # チケット一覧画面
│
├── test-catalog.md          # テストケース概要
├── test/                    # テスト詳細仕様
│   ├── backend-test-catalog/   # バックエンドテスト詳細
│   │   ├── controller-tests.md
│   │   ├── service-tests.md
│   │   ├── mapper-tests.md
│   │   └── execution-guide.md
│   └── e2e-test-catalog.md     # E2Eテスト詳細
│
└── template/                # 最新仕様用テンプレート
    ├── frontend-overview-template.md
    ├── component-catalog-template.md
    ├── store-catalog-template.md
    ├── type-catalog-template.md
    └── routing-spec-template.md
```

### 4.4 APIドキュメント構造

API仕様は2階層で管理する:

| 階層 | ファイル | 内容 |
|------|---------|------|
| 1 | api-catalog.md | API一覧（サマリー）、共通レスポンス形式 |
| 2 | api/API-XXX-NNN.md | API詳細（利用案件、参照システム、処理フロー） |

各API詳細ファイルには以下を記載:
- 基本情報（メソッド、パス、機能）
- 利用案件（追加・変更された案件履歴）
- 参照システム（どの画面・外部システムから利用されているか）
- リクエスト/レスポンス仕様
- 処理フロー
- エラー処理
- 関連項目（他API、ロジック、Mapper、画面へのリンク）

### 4.5 画面ドキュメント構造

画面仕様は3階層で管理する:

| 階層 | ファイル | 内容 |
|------|---------|------|
| 1 | screen.md | 画面基本情報、レイアウト、構成要素、遷移 |
| 2 | events.md | イベント一覧（サマリー）、共通処理 |
| 3 | EV-XXX-XX.md | イベント詳細（処理フロー、API、エラー処理） |

### 4.6 フロントエンドドキュメント構造

フロントエンド仕様は5つのドキュメントで管理する:

| ファイル | 内容 |
|---------|------|
| frontend-overview.md | 技術スタック、ディレクトリ構成、依存関係 |
| component-catalog.md | 全コンポーネント一覧、Props/Emits仕様 |
| store-catalog.md | Pinia Store一覧、State/Getters/Actions仕様 |
| type-catalog.md | TypeScript型定義一覧、インターフェース定義 |
| routing-spec.md | Vue Routerルート定義、ナビゲーションガード |

### 4.7 テストドキュメント構造

テスト仕様は概要と詳細の2階層で管理する:

| 階層 | ファイル | 内容 |
|------|---------|------|
| 1 | test-catalog.md | テスト全体のサマリー、分類、カバレッジ |
| 2 | test/backend-test-catalog/ | JUnitテスト詳細（層別） |
| 2 | test/e2e-test-catalog.md | Playwrightテストシナリオ |

### 4.8 更新タイミング

| タイミング | 対象ドキュメント |
|-----------|-----------------|
| API追加・変更時 | api-catalog.md, api/API-XXX-NNN.md |
| 画面追加・変更時 | screens/index.md, screens/SC-XXX/ |
| イベント追加・変更時 | screens/SC-XXX/events.md, EV-XXX-XX.md |
| コンポーネント追加・変更時 | frontend/component-catalog.md |
| ストア追加・変更時 | frontend/store-catalog.md |
| 型定義追加・変更時 | frontend/type-catalog.md |
| ルート追加・変更時 | frontend/routing-spec.md |
| ビジネスロジック追加・変更時 | logic-catalog.md |
| DB変更時 | db-schema.md |
| バックエンドテスト追加時 | test-catalog.md, test/backend-test-catalog/ |
| E2Eテスト追加時 | test-catalog.md, test/e2e-test-catalog.md |
| 技術構成変更時 | architecture.md, frontend/frontend-overview.md |

### 4.9 更新ルール

- 案件完了時に必ず該当する最新仕様ドキュメントを更新する
- 更新履歴セクションに変更内容と案件名を記録する
- 削除された機能・APIは「廃止」としてマークし、履歴を残す

---

## 5. リファレンスドキュメント

### 5.1 概要

プロジェクト横断で参照できる技術ノウハウ・ベストプラクティス集。案件や仕様に依存せず、開発全般で活用できる知見を蓄積する。

### 5.2 対象ドキュメント

| フォルダ | 目的 | 記載内容 |
|---------|------|----------|
| best-practices/ | 設計・実装のベストプラクティス | テスト戦略、コーディング規約、アーキテクチャパターン |
| tips/ | 実装の小技・スニペット | よく使うコードパターン、ライブラリ活用法、デバッグテクニック |
| troubleshooting/ | 問題解決の記録 | エラー対処法、環境構築トラブル、パフォーマンス問題 |

### 5.3 フォルダ構成

```
docs/reference/
├── best-practices/                 # ベストプラクティス・設計指針
│   ├── frontend-testing-strategies/  # フロントエンドテスト戦略
│   └── backend-testing-guide.md      # バックエンドテストガイド
├── tips/                           # 実装Tips・小技集
├── troubleshooting/                # トラブルシューティング
└── README.md                       # リファレンスの説明
```

### 5.4 更新タイミング

- 新しい技術的知見を得たとき
- 問題を解決して再発防止策をまとめたとき
- コードレビューで共有すべきパターンを発見したとき

### 5.5 案件スコープ・最新仕様との違い

| 観点 | 案件スコープ | 最新仕様 | リファレンス |
|------|------------|---------|-------------|
| 対象 | 変更内容 | システム状態 | 技術ノウハウ |
| 粒度 | 案件単位 | システム全体 | トピック単位 |
| 更新契機 | 案件開始〜完了 | 案件完了時 | 随時 |
| 例 | 「認証機能追加の詳細設計」 | 「API一覧」 | 「フロントエンドテスト戦略」 |

---

## 6. 運用フロー

### 6.1 案件実施フロー

```
┌─────────────────────────────────────────────────────────────┐
│                      1. 案件開始                             │
│                                                              │
│   projects/YYYYMM_案件名/ フォルダを作成                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  2. 案件スコープドキュメント作成              │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │ 基本設計書   │  │ 詳細設計書   │  │ テスト仕様書 │       │
│   │ (何を作るか) │  │ (どう作るか) │  │ (何をテスト) │       │
│   └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      3. 実装・テスト                         │
│                                                              │
│   実装テンプレートを参照して実装                              │
│   → implementation/IMPLEMENTATION_GUIDE.md                   │
│                                                              │
│   テストテンプレートを参照してテスト作成                       │
│   → reference/best-practices/backend-testing-guide.md        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  4. 最新仕様ドキュメント更新                  │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │ API一覧     │  │ ロジック一覧 │  │ DB構造      │       │
│   └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                              │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │ テスト集積   │  │ アーキテクチャ│  │ 画面詳細    │       │
│   └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      5. 案件完了                             │
│                                                              │
│   案件ドキュメントはアーカイブとして保持                       │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 ドキュメント参照関係

```
【案件スコープ】                          【最新仕様】

要件整理書 ─────→ 基本設計書              アーキテクチャ仕様書
                       │                        ↑
                       ▼                        │（技術変更時）
                  詳細設計書                     │
                       │                        │
                       ▼                        │
                  テスト仕様書 ─────────→ テストケース集積
                       │
                       ├─────────────────→ API一覧
                       ├─────────────────→ 画面一覧
                       │                    └→ screens/SC-XXX/
                       │                        ├→ screen.md
                       │                        ├→ events.md
                       │                        └→ EV-XXX-XX.md
                       ├─────────────────→ ロジック一覧
                       └─────────────────→ DB構造
```

---

## 7. テンプレート

### 7.1 案件スコープ用テンプレート

#### 要件定義

| ドキュメント | テンプレート |
|-------------|-------------|
| 要件整理書 | [requirements-template.md](projects/template/requirements-template.md) |

#### 基本設計

| ドキュメント | テンプレート |
|-------------|-------------|
| フロントエンド基本設計書 | [basic-design-frontend-template.md](projects/template/basic-design-frontend-template.md) |
| バックエンド基本設計書 | [basic-design-backend-template.md](projects/template/basic-design-backend-template.md) |

#### 詳細設計

| ドキュメント | テンプレート |
|-------------|-------------|
| フロントエンド詳細設計書 | [detail-design-frontend-template.md](projects/template/detail-design-frontend-template.md) |
| API詳細設計書 | [detail-design-api-template.md](projects/template/detail-design-api-template.md) |
| ロジック詳細設計書 | [detail-design-logic-template.md](projects/template/detail-design-logic-template.md) |
| SQL詳細設計書 | [detail-design-sql-template.md](projects/template/detail-design-sql-template.md) |
| DB詳細設計書 | [detail-design-db-template.md](projects/template/detail-design-db-template.md) |

#### テスト設計

| ドキュメント | テンプレート |
|-------------|-------------|
| フロントエンドテスト方針書 | [test-spec-frontend-template.md](projects/template/test-spec-frontend-template.md) |
| バックエンドテスト方針書 | [test-spec-backend-template.md](projects/template/test-spec-backend-template.md) |

#### 作業報告

| ドキュメント | テンプレート |
|-------------|-------------|
| 実装作業報告書 | [implementation-report-template.md](projects/template/implementation-report-template.md) |
| テスト実装報告書 | [test-implementation-report-template.md](projects/template/test-implementation-report-template.md) |

### 7.2 最新仕様用テンプレート

フロントエンド仕様書は以下のテンプレートを参照して作成する。

| ドキュメント | テンプレート |
|-------------|-------------|
| フロントエンド概要 | [frontend-overview-template.md](specs/template/frontend-overview-template.md) |
| コンポーネントカタログ | [component-catalog-template.md](specs/template/component-catalog-template.md) |
| ストアカタログ | [store-catalog-template.md](specs/template/store-catalog-template.md) |
| 型定義カタログ | [type-catalog-template.md](specs/template/type-catalog-template.md) |
| ルーティング仕様 | [routing-spec-template.md](specs/template/routing-spec-template.md) |

**注意**: その他の最新仕様ドキュメントは継続的に更新するため、テンプレートではなく実体ファイルを直接編集する。

### 7.3 実装テンプレート

実装時は以下のテンプレートを参照して、一貫性のあるコードを作成する。

| テンプレート | 用途 | 配置場所 |
|-------------|------|---------|
| [EntityTemplate.java](../src/main/java/com/example/demo/template/EntityTemplate.java) | エンティティクラス | Entity層 |
| [MapperTemplate.java](../src/main/java/com/example/demo/template/MapperTemplate.java) | Mapperインターフェース | Mapper層 |
| [MapperTemplate.xml](../src/main/resources/mapper/template/MapperTemplate.xml) | Mapper XML | Mapper層 |
| [ServiceTemplate.java](../src/main/java/com/example/demo/template/ServiceTemplate.java) | Serviceクラス | Service層 |
| [ControllerTemplate.java](../src/main/java/com/example/demo/template/ControllerTemplate.java) | Controllerクラス | Controller層 |

詳細な使い方は [IMPLEMENTATION_GUIDE.md](implementation/IMPLEMENTATION_GUIDE.md) を参照。

### 7.4 テストテンプレート

テスト作成時は以下のテンプレートを参照して、一貫性のあるテストを作成する。

| テンプレート | 用途 | 配置場所 |
|-------------|------|---------|
| [ControllerTestTemplate.java](../src/test/java/com/example/demo/template/ControllerTestTemplate.java) | REST API テスト | Controller層 |
| [ServiceTestTemplate.java](../src/test/java/com/example/demo/template/ServiceTestTemplate.java) | ビジネスロジックテスト | Service層 |
| [MapperTestTemplate.java](../src/test/java/com/example/demo/template/MapperTestTemplate.java) | データアクセス層テスト | Mapper層 |

詳細な使い方は [backend-testing-guide.md](reference/best-practices/backend-testing-guide.md) を参照。

---

## 8. 改版履歴

| 版数 | 日付 | 変更内容 |
|------|------|----------|
| 1.0 | 2025-12-22 | 初版作成 |
| 2.0 | 2025-12-22 | 案件スコープ/最新仕様の2軸構成に変更 |
| 2.1 | 2025-12-22 | 画面一覧を最新仕様に追加 |
| 3.0 | 2025-12-22 | 要件整理書を追加、基本設計・詳細設計を細分化 |
| 3.1 | 2025-12-22 | 画面詳細の階層構造（screen/events/EV-XXX-XX）を追加 |
| 4.0 | 2025-12-23 | リファレンスドキュメント（技術ノウハウ集）を追加 |
| 4.1 | 2025-12-23 | テスト仕様書をフロントエンド/バックエンドの2テンプレートに分離 |
| 5.0 | 2025-12-23 | API詳細ドキュメント階層構造（api/API-XXX-NNN.md）を追加 |
| 5.1 | 2025-12-23 | testing/ を廃止、reference/best-practices/ に統合 |
| 5.2 | 2025-12-24 | 「変更なし」も記録する方針を追加 |
| 6.0 | 2025-12-26 | 実装作業報告書・テスト実装報告書を追加 |
| 7.0 | 2025-12-26 | フロントエンド仕様（frontend/）を最新仕様に追加 |
| 7.1 | 2025-12-26 | テスト詳細仕様（test/）を最新仕様に追加 |
| 7.2 | 2025-12-26 | 画面仕様にSC-003〜SC-005を追加 |
| 7.3 | 2025-12-26 | 最新仕様用テンプレート（specs/template/）を追加 |
