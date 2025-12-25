# グローバルルール

プロジェクト全体に適用される運用ルール・プロセス定義を管理するフォルダ。

## フォルダ構成

```
rules/
├── current/                         # 現在適用中のルール
│   ├── workflow.md                  # ワークフロールール
│   ├── documentation.md             # ドキュメンテーションルール
│   └── development.md               # 開発プロセスルール
│
├── archive/                         # 過去のルール（参照用）
│   └── YYYYMMDD_*.md               # 日付付きでアーカイブ
│
└── README.md                        # このファイル
```

## ルールカテゴリ

### 1. workflow.md
マネジメントチケットの運用フロー定義。

- チケットのライフサイクル管理
- ステータス遷移ルール
- ルール変更の反映フロー

### 2. documentation.md
ドキュメント作成・管理に関するルール。

- チケットドキュメントの構成
- グローバルルールへの統合手順
- アーカイブ管理方針

### 3. development.md
開発プロセスに関するルール。

- マネジメントタスクと開発タスクの区別
- Git 運用との連携
- レビュープロセス

## ルール更新フロー

### 実験的ルールの試行

1. マネジメントチケット内の `rules/` でルールを定義
2. チケット作業中に試行
3. 効果を検証

### グローバルルールへの反映

1. チケット完了後、効果があれば採用
2. `current/` の該当ファイルを更新
3. 古いルールを `archive/YYYYMMDD_*.md` に保存
4. Git にコミット

## ルールの優先順位

1. **チケット内 `rules/`**: 最優先（実験的運用中のみ）
2. **`management/rules/current/`**: グローバルルール
3. **`CLAUDE.md`**: プロジェクト基本ルール

## 参照

- 親フォルダガイド: [../README.md](../README.md)
- ワークフロールール: [current/workflow.md](current/workflow.md)
- ドキュメンテーションルール: [current/documentation.md](current/documentation.md)
- 開発プロセスルール: [current/development.md](current/development.md)
