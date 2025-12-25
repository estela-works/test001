# 完了済みチケット

完了したマネジメントチケットを保管するフォルダ。

## チケット一覧

```bash
# Windows
powershell -Command "Get-ChildItem 'management/tickets/done' -Directory | Select-Object Name"
```

## チケット完了手順

### 1. 完了前の準備

1. すべてのタスクが完了していることを確認
2. `ticket.md` のステータスを "Done" に変更
3. 完了日を記入
4. `notes.md` に振り返りを記入

### 2. Done フォルダへ移動

```bash
powershell -Command "Move-Item -Path 'management/tickets/open/YYYYMMDD_チケット名' -Destination 'management/tickets/done/'"
```

### 3. ルール反映（該当する場合のみ）

チケット内で試行したルールをグローバル化する場合:

1. `management/rules/current/` の該当ファイルを更新
2. 古いルールを `management/rules/archive/` に保存
3. Git にコミット

## 完了チケットの活用

- 過去の意思決定の参照
- 同様の課題が発生した際のナレッジベース
- プロセス改善の効果測定

## アーカイブ方針

### 定期整理（半期ごと）

- 1年以上前の完了チケットを圧縮
- 重要な知見は別途ドキュメント化

## 参照

- 親フォルダガイド: [../README.md](../README.md)
- オープンチケット: [../open/README.md](../open/README.md)
