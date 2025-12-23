# ドキュメント体系ガイド

## 1. 概要

本ドキュメントは、プロジェクトにおけるドキュメントの体系・目的・運用フローを定義する。

---

## 2. ドキュメント分類の基本思想

本プロジェクトでは、ドキュメントを**2つのカテゴリ**に分類して管理する。

### 2.1 分類の目的

| カテゴリ | 目的 | ライフサイクル |
|---------|------|---------------|
| **案件スコープ** | 今回の変更内容・仕様を正確に記録する | 案件ごとに新規作成・完結 |
| **最新仕様** | アプリケーションの現在の状態を反映する | 継続的にメンテナンス・累積 |

### 2.2 なぜ分けるのか

- **案件スコープ**: 「この案件で何を変更したか」を後から追跡可能にする。案件単位でスコープを閉じることで、変更の責任範囲が明確になる。
- **最新仕様**: 「現在のシステムはどうなっているか」を常に把握できる状態を維持する。新規参画者や保守担当者が現状を理解するための唯一の正（Single Source of Truth）となる。

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
| テスト仕様書 | 追加・変更するテストケースを定義 | テストケース、期待結果、前提条件 |

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
│   └── test-spec.md                 # テスト仕様書
└── template/
    ├── requirements-template.md
    ├── basic-design-frontend-template.md
    ├── basic-design-backend-template.md
    ├── detail-design-frontend-template.md
    ├── detail-design-api-template.md
    ├── detail-design-logic-template.md
    ├── detail-design-sql-template.md
    ├── detail-design-db-template.md
    └── test-spec-template.md
```

**注意**: 案件の規模や内容に応じて、必要なドキュメントのみ作成する。すべてを作成する必要はない。

### 3.4 命名規則

- フォルダ名: `YYYYMM_案件名`（例: `202501_ユーザー認証機能追加`）
- 案件名は簡潔かつ識別可能な名称とする

### 3.5 ライフサイクル

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
    ├─→ テスト仕様書を作成（何をテストするか）
    │
    ▼
実装・テスト
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

| ドキュメント | 目的 | 記載内容 |
|-------------|------|----------|
| アーキテクチャ仕様書 | 技術構成・システム構造を定義 | 技術スタック、レイヤー構成、設計原則 |
| API一覧 | 全エンドポイントの現在の仕様 | URL、メソッド、リクエスト/レスポンス |
| 画面一覧 | 全画面の現在の仕様（概要） | 画面構成、UI要素、遷移 |
| 画面詳細 | 各画面の詳細仕様 | 画面仕様、イベント一覧、イベント詳細 |
| ロジック一覧 | ビジネスルール・バリデーションの集積 | ルール名、条件、適用箇所 |
| DB構造 | データベースの現在の構造 | テーブル定義、カラム、リレーション |
| テストケース集積 | 全テストケースの累積一覧 | テストID、対象、期待結果、ステータス |

### 4.3 フォルダ構成

```
docs/specs/
├── architecture.md          # アーキテクチャ仕様書
├── api-catalog.md           # API一覧
├── screen-catalog.md        # 画面一覧（概要・インデックス）
├── logic-catalog.md         # ロジック一覧
├── db-schema.md             # DB構造
├── test-catalog.md          # テストケース集積
└── screens/                 # 画面詳細（階層構造）
    ├── index.md             # 画面インデックス
    ├── SC-001/              # ホーム画面
    │   ├── screen.md        # 画面仕様
    │   ├── events.md        # イベント一覧
    │   └── EV-001-01.md     # イベント詳細（個別ファイル）
    └── SC-002/              # ToDoリスト画面
        ├── screen.md        # 画面仕様
        ├── events.md        # イベント一覧
        ├── EV-002-01.md     # 初期読込
        ├── EV-002-02.md     # 統計更新
        ├── EV-002-03.md     # ToDo追加
        ├── EV-002-04.md     # フィルタ切替
        ├── EV-002-05.md     # 完了状態切替
        ├── EV-002-06.md     # ToDo削除
        └── EV-002-07.md     # ホーム遷移
```

### 4.4 画面ドキュメント構造

画面仕様は3階層で管理する:

| 階層 | ファイル | 内容 |
|------|---------|------|
| 1 | screen.md | 画面基本情報、レイアウト、構成要素、遷移 |
| 2 | events.md | イベント一覧（サマリー）、共通処理 |
| 3 | EV-XXX-XX.md | イベント詳細（処理フロー、API、エラー処理） |

### 4.5 更新タイミング

| タイミング | 対象ドキュメント |
|-----------|-----------------|
| API追加・変更時 | api-catalog.md |
| 画面追加・変更時 | screen-catalog.md, screens/SC-XXX/ |
| イベント追加・変更時 | screens/SC-XXX/events.md, EV-XXX-XX.md |
| ビジネスロジック追加・変更時 | logic-catalog.md |
| DB変更時 | db-schema.md |
| テスト追加時 | test-catalog.md |
| 技術構成変更時 | architecture.md |

### 4.6 更新ルール

- 案件完了時に必ず該当する最新仕様ドキュメントを更新する
- 更新履歴セクションに変更内容と案件名を記録する
- 削除された機能・APIは「廃止」としてマークし、履歴を残す

---

## 5. 運用フロー

### 5.1 案件実施フロー

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
│   → testing/TEST_GUIDE.md                                    │
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

### 5.2 ドキュメント参照関係

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

## 6. テンプレート

### 6.1 案件スコープ用テンプレート

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
| テスト仕様書 | [test-spec-template.md](projects/template/test-spec-template.md) |

### 6.2 最新仕様用テンプレート

最新仕様ドキュメントは継続的に更新するため、テンプレートではなく実体ファイルを直接編集する。

### 6.3 実装テンプレート

実装時は以下のテンプレートを参照して、一貫性のあるコードを作成する。

| テンプレート | 用途 | 配置場所 |
|-------------|------|---------|
| [EntityTemplate.java](../src/main/java/com/example/demo/template/EntityTemplate.java) | エンティティクラス | Entity層 |
| [MapperTemplate.java](../src/main/java/com/example/demo/template/MapperTemplate.java) | Mapperインターフェース | Mapper層 |
| [MapperTemplate.xml](../src/main/resources/mapper/template/MapperTemplate.xml) | Mapper XML | Mapper層 |
| [ServiceTemplate.java](../src/main/java/com/example/demo/template/ServiceTemplate.java) | Serviceクラス | Service層 |
| [ControllerTemplate.java](../src/main/java/com/example/demo/template/ControllerTemplate.java) | Controllerクラス | Controller層 |

詳細な使い方は [IMPLEMENTATION_GUIDE.md](implementation/IMPLEMENTATION_GUIDE.md) を参照。

### 6.4 テストテンプレート

テスト作成時は以下のテンプレートを参照して、一貫性のあるテストを作成する。

| テンプレート | 用途 | 配置場所 |
|-------------|------|---------|
| [ControllerTestTemplate.java](../src/test/java/com/example/demo/template/ControllerTestTemplate.java) | REST API テスト | Controller層 |
| [ServiceTestTemplate.java](../src/test/java/com/example/demo/template/ServiceTestTemplate.java) | ビジネスロジックテスト | Service層 |
| [MapperTestTemplate.java](../src/test/java/com/example/demo/template/MapperTestTemplate.java) | データアクセス層テスト | Mapper層 |

詳細な使い方は [TEST_GUIDE.md](testing/TEST_GUIDE.md) を参照。

---

## 7. 改版履歴

| 版数 | 日付 | 変更内容 |
|------|------|----------|
| 1.0 | 2025-12-22 | 初版作成 |
| 2.0 | 2025-12-22 | 案件スコープ/最新仕様の2軸構成に変更 |
| 2.1 | 2025-12-22 | 画面一覧を最新仕様に追加 |
| 3.0 | 2025-12-22 | 要件整理書を追加、基本設計・詳細設計を細分化 |
| 3.1 | 2025-12-22 | 画面詳細の階層構造（screen/events/EV-XXX-XX）を追加 |
