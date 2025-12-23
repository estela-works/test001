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
