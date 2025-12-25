# 未着手・作業中チケット

現在オープン状態のマネジメントチケットを管理するフォルダ。

## チケット一覧

```bash
# Windows
powershell -Command "Get-ChildItem 'management/tickets/open' -Directory | Select-Object Name"
```

## チケット作成手順

### 1. フォルダ作成

```bash
powershell -Command "New-Item -ItemType Directory -Path 'management/tickets/open/YYYYMMDD_チケット名' -Force"
```

### 2. 必須ファイル作成

- `ticket.md`: チケット情報（テンプレートは親README参照）
- `notes.md`: 作業メモ（テンプレートは親README参照）

### 3. オプションファイル

- `rules/`: チケット専用ルール（実験的運用時のみ）

## ステータス管理

### Open（未着手）
- チケット作成直後の状態
- `ticket.md` のステータス欄を "Open" に設定

### In Progress（作業中）
- 作業開始時に変更
- `ticket.md` のステータス欄を "In Progress" に更新
- 開始日を記入

## 次のステップ

作業完了後は [../done/README.md](../done/README.md) を参照してチケットを完了させる。

## 参照

- 親フォルダガイド: [../README.md](../README.md)
- 完了チケット: [../done/README.md](../done/README.md)
