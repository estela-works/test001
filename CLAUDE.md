# プロジェクトガイド

## ディレクトリナビゲーション

この環境ではすべてのディレクトリにREADMEが配置されている。
不明なときはトップフォルダのREADMEを読むこと。READMEを参照することで、正しく必要なフォルダに素早くアクセスできる。

## Windows環境でのコマンド実行

この環境はWindows。Unix系コマンド（`tree`, `find`, `ls`等）は使用不可。

### ファイル一覧取得

```powershell
# 再帰的にファイル一覧（推奨）
powershell -Command "Get-ChildItem -Path 'パス' -Recurse -Name"

# 件数制限付き
powershell -Command "Get-ChildItem -Path 'パス' -Recurse -Name | Select-Object -First 100"
```

### ディレクトリ存在確認

```powershell
powershell -Command "Test-Path 'パス'"
```

### サブフォルダ一覧

```powershell
powershell -Command "Get-ChildItem 'パス' -Directory | Select-Object Name"
```

### 注意事項

- `dir /s /b` はBash環境では動作しない（cmd.exe専用）
- `tree` コマンドは使用不可
- パスにスペースが含まれる場合はシングルクォートで囲む
