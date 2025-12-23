# ユーティリティスクリプト

プロジェクト管理用のユーティリティスクリプト集。

## スクリプト一覧

| スクリプト | 説明 |
|-----------|------|
| `check-missing-readme.ps1` | READMEが不足・更新漏れのフォルダを検出（Windows PowerShell） |
| `find-large-markdown.ps1` | 長いMarkdownファイル（300行以上）を検出（Windows PowerShell） |
| `check-project-status.sh` | プロジェクトの状態をチェック（Unix/Linux） |

## 使用方法

### Windows (PowerShell)

```powershell
# README不足・更新漏れチェック
.\scripts\check-missing-readme.ps1

# 長いMarkdownファイル検出
.\scripts\find-large-markdown.ps1
```

### Unix/Linux/Mac

```bash
chmod +x scripts/*.sh
./scripts/check-project-status.sh
```

## READMEのタッチ（タイムスタンプ更新）

READMEの内容に変更がなく、タイムスタンプのみ更新したい場合は以下のコマンドを使用します。

### 単一ファイルをタッチ

```powershell
Set-ItemProperty -Path 'パス\README.md' -Name LastWriteTime -Value (Get-Date)
```

### 複数ファイルを一括タッチ

```powershell
$folders = @('data', 'docs', 'src')  # タッチしたいフォルダ
$basePath = 'c:\path\to\project'

foreach ($folder in $folders) {
    $path = Join-Path $basePath $folder 'README.md'
    Set-ItemProperty -Path $path -Name LastWriteTime -Value (Get-Date)
}
```

**注意**: 親フォルダのREADMEは子フォルダより後にタッチする必要があります（子フォルダのファイルが親より新しいと更新漏れと判定されるため）。
