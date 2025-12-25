# マネジメントチケット

プロセス改善・ルール変更・運用見直しを管理するフォルダ。

## フォルダ構成

```
tickets/
├── open/                                # 未着手・作業中
│   └── YYYYMMDD_チケット名/
│       ├── ticket.md                    # チケット情報
│       ├── notes.md                     # 作業メモ
│       └── rules/                       # チケット専用ルール（オプション）
│           ├── workflow.md
│           ├── documentation.md
│           └── development.md
│
└── done/                                # 完了済み
    └── YYYYMMDD_チケット名/
        └── ... (同じ構成)
```

## チケット作成手順

### 1. フォルダ作成

```bash
# Windows
powershell -Command "New-Item -ItemType Directory -Path 'management/tickets/open/YYYYMMDD_チケット名' -Force"
```

### 2. ticket.md 作成

以下のテンプレートをコピーして使用:

```markdown
# チケット名

## 目的
なぜこのマネジメントタスクを実施するのか

## タスク
- [ ] タスク1
- [ ] タスク2
- [ ] タスク3

## ステータス
- **現在**: Open
- **開始日**: YYYY-MM-DD
- **完了日**: （完了時に記入）

## 関連情報
- 関連チケット:
- 参照ドキュメント:
```

### 3. notes.md 作成

```markdown
# 作業メモ

## YYYY-MM-DD
- 作業内容
- 気づき
- 決定事項

## 振り返り（完了時）
- うまくいったこと:
- 改善すべきこと:
- 次回への引き継ぎ:
```

## チケット運用フロー

### Open → In Progress

1. `ticket.md` のステータスを `In Progress` に変更
2. 開始日を記入
3. `notes.md` に作業ログを開始

### In Progress → Done

1. すべてのタスクを完了
2. `ticket.md` のステータスを `Done` に変更
3. 完了日を記入
4. `notes.md` に振り返りを記入
5. フォルダを `management/tickets/done/` に移動

```bash
# Windows
powershell -Command "Move-Item -Path 'management/tickets/open/YYYYMMDD_チケット名' -Destination 'management/tickets/done/'"
```

## ルール変更を伴うチケット

### チケット内ルールの作成

チケット固有のルールを試行する場合:

1. `rules/` フォルダを作成
2. 必要なルールファイルを配置
   - `workflow.md`: ワークフロー変更
   - `documentation.md`: ドキュメントルール変更
   - `development.md`: 開発プロセス変更

### グローバルルールへの反映

チケット完了後、プロジェクト全体に適用する場合:

1. `management/rules/current/` の該当ルールを更新
2. 古いルールを `management/rules/archive/YYYYMMDD_*.md` として保存
3. Git にコミット

```bash
git add management/rules/
git commit -m "[Management] チケット名: ルール変更内容"
```

## チケット一覧の確認

### Open チケット一覧

```bash
# Windows
powershell -Command "Get-ChildItem 'management/tickets/open' -Directory | Select-Object Name"
```

### Done チケット一覧

```bash
# Windows
powershell -Command "Get-ChildItem 'management/tickets/done' -Directory | Select-Object Name"
```

## チケットの粒度

- **小規模**: 1週間以内（例: テンプレート改善）
- **中規模**: 1〜2週間（例: ワークフロー見直し）
- **大規模**: 1ヶ月程度（複数チケットに分割を検討）

## 参照

- ワークフロールール: [../rules/current/workflow.md](../rules/current/workflow.md)
- ドキュメンテーションルール: [../rules/current/documentation.md](../rules/current/documentation.md)
- 開発プロセスルール: [../rules/current/development.md](../rules/current/development.md)
