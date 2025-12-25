# マネジメント

プロジェクト全体の運用ルール・プロセス改善を管理するフォルダ。

## フォルダ構成

```
management/
├── rules/                               # グローバルルール定義
│   ├── current/                         # 現在適用中のルール
│   │   ├── workflow.md                  # ワークフロールール
│   │   ├── documentation.md             # ドキュメンテーションルール
│   │   └── development.md               # 開発プロセスルール
│   └── archive/                         # 過去のルール（参照用）
│
├── tickets/                             # マネジメントチケット
│   ├── open/                            # 着手前・作業中
│   │   └── YYYYMMDD_チケット名/
│   │       ├── ticket.md                # チケット情報
│   │       ├── notes.md                 # 作業メモ
│   │       └── rules/                   # チケット専用ルール（オプション）
│   └── done/                            # 完了済み
│       └── YYYYMMDD_チケット名/
│
└── README.md                            # このファイル
```

## 目的

### マネジメントフォルダの役割

1. **プロセス改善**: ワークフロー・運用ルールの継続的改善
2. **ルール管理**: プロジェクト全体に適用するルールの一元管理
3. **変更履歴**: ルール変更の経緯・理由を記録

### 開発フォルダとの違い

| 項目 | マネジメント (`management/`) | 開発 (`docs/projects/`) |
|------|----------------------------|------------------------|
| 目的 | プロセス・ルール変更 | 機能開発・バグ修正 |
| 対象 | ワークフロー・ドキュメント体系 | アプリケーションコード |
| 成果物 | ルール定義・運用ガイド | 実装コード・テスト |
| 適用範囲 | プロジェクト全体 | 特定の案件・機能 |

## グローバルルール

### 3つのルールカテゴリ

1. **workflow.md**: マネジメントチケットの運用フロー
   - チケットのライフサイクル
   - ステータス管理
   - ルール変更の反映フロー

2. **documentation.md**: ドキュメント作成・管理ルール
   - チケットドキュメントの構成
   - グローバルルールへの統合手順
   - アーカイブ管理

3. **development.md**: 開発プロセスルール
   - マネジメントタスクと開発タスクの区別
   - Git 運用との連携
   - レビュープロセス

詳細は [rules/current/](rules/current/) を参照。

## マネジメントチケット運用

### チケット作成から完了まで

```
チケット作成
    │ (management/tickets/open/ に配置)
    ▼
作業開始
    │ (ticket.md のステータスを In Progress に)
    ▼
作業実施
    │ (notes.md に作業ログを記録)
    ▼
作業完了
    │ (ticket.md のステータスを Done に)
    ▼
振り返り記入
    │ (notes.md に振り返りを追記)
    ▼
Done フォルダに移動
    │ (management/tickets/done/ に移動)
    ▼
ルール反映（必要に応じて）
    (rules/current/ を更新)
```

詳細は [tickets/README.md](tickets/README.md) を参照。

## ルール変更の流れ

### 実験的ルールの試行

1. マネジメントチケット作成
2. チケット内 `rules/` でルール定義
3. チケット作業中はそのルールを適用
4. 効果を確認

### グローバルルールへの反映

1. チケット完了後、効果があれば採用
2. `management/rules/current/` に反映
3. 古いルールは `management/rules/archive/` に保存
4. Git にコミット

### ルールの優先順位

1. **チケット内 `rules/`**: 最優先（実験的運用）
2. **`management/rules/current/`**: グローバルルール
3. **`CLAUDE.md`**: プロジェクト基本ルール

## クイックスタート

### 新しいマネジメントチケットを作成

```bash
# 1. フォルダ作成
powershell -Command "New-Item -ItemType Directory -Path 'management/tickets/open/20251225_チケット名' -Force"

# 2. ticket.md と notes.md を作成
# tickets/README.md のテンプレートを使用

# 3. 作業開始
# ticket.md のステータスを In Progress に変更
```

### チケットを完了

```bash
# 1. ticket.md のステータスを Done に変更
# 2. notes.md に振り返りを記入
# 3. Done フォルダに移動
powershell -Command "Move-Item -Path 'management/tickets/open/20251225_チケット名' -Destination 'management/tickets/done/'"
```

### ルールを更新

```bash
# 1. rules/current/ の該当ファイルを編集
# 2. 古いルールを archive/ に保存
# 3. Git にコミット
git add management/rules/
git commit -m "[Management] チケット名: ルール変更内容"
```

## 定期メンテナンス

### 月次

- Open チケットの棚卸し
- 長期停滞チケットの見直し

### 四半期

- ルール全体の見直し
- 不要なルールの削除

### 半期

- Done チケットのアーカイブ整理
- ルール変更履歴の振り返り

## 参照

- ワークフロールール: [rules/current/workflow.md](rules/current/workflow.md)
- ドキュメンテーションルール: [rules/current/documentation.md](rules/current/documentation.md)
- 開発プロセスルール: [rules/current/development.md](rules/current/development.md)
- チケット運用ガイド: [tickets/README.md](tickets/README.md)
- プロジェクト基本ルール: [../CLAUDE.md](../CLAUDE.md)
