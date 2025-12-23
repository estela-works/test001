# READMEファイル不足・更新漏れチェックスクリプト
# Usage: .\scripts\check-missing-readme.ps1 [-Verbose]
# 各フォルダにREADME.mdが存在するかチェックし、不足しているフォルダを一覧表示します
# また、フォルダ内のファイルよりREADMEが古い場合は更新漏れの可能性を警告します

param(
    [switch]$VerboseOutput
)

# ベースディレクトリ
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# =============================================================================
# 除外フォルダの設定
# =============================================================================
# このリストに追加されたフォルダはREADMEチェックの対象外になります
# パターンはプロジェクトルートからの相対パスで指定してください
# =============================================================================

$ExcludePatterns = @(
    # ビルド成果物・キャッシュ
    "target",
    "target\*",
    "node_modules",
    "*\node_modules",
    "*\node_modules\*",

    # 隠しフォルダ
    ".git",
    ".git\*",
    ".mvn",
    ".mvn\*",
    ".claude",
    ".claude\*",
    ".github",
    ".github\*",

    # Javaソースコードのパッケージ構造（深いネスト）
    "src\main\java\com",
    "src\main\java\com\*",
    "src\test\java\com",
    "src\test\java\com\*",

    # テスト出力
    "src\test\e2e\output",
    "src\test\e2e\output\*",

    # リソースフォルダ（内容がファイルのみの場合が多い）
    "src\main\resources\static",
    "src\main\resources\mapper",
    "src\main\resources\mapper\*",

    # テストクラスのビルド出力
    "target\test-classes",
    "target\test-classes\*",
    "target\classes",
    "target\classes\*"
)

# =============================================================================

# フォルダが除外対象かチェック
function Test-Excluded {
    param([string]$DirPath)

    $relativePath = $DirPath.Substring($ProjectRoot.Length).TrimStart('\', '/')

    foreach ($pattern in $ExcludePatterns) {
        # 完全一致
        if ($relativePath -eq $pattern) {
            return $true
        }

        # ワイルドカードパターン（末尾が\*）
        if ($pattern.EndsWith("\*")) {
            $parent = $pattern.TrimEnd('\*')
            if ($relativePath.StartsWith("$parent\")) {
                return $true
            }
        }

        # 任意の場所のフォルダ名（*\folder_name）
        if ($pattern.StartsWith("*\")) {
            $folderName = $pattern.Substring(2)
            if ($folderName.EndsWith("\*")) {
                $folderName = $folderName.TrimEnd('\*')
            }
            if ($relativePath -match "(^|\\)$([regex]::Escape($folderName))(\\|$)") {
                return $true
            }
        }
    }

    return $false
}

# READMEのパスを取得
function Get-ReadmePath {
    param([string]$DirPath)

    $readmeNames = @("README.md", "readme.md", "README", "readme")

    foreach ($name in $readmeNames) {
        $readmePath = Join-Path $DirPath $name
        if (Test-Path $readmePath -PathType Leaf) {
            return $readmePath
        }
    }

    return $null
}

# フォルダ内の最新ファイル更新時刻を取得（README自体を除く）
function Get-LatestFileTime {
    param(
        [string]$DirPath,
        [string]$ReadmePath
    )

    $files = Get-ChildItem -Path $DirPath -File -ErrorAction SilentlyContinue
    $latestTime = $null

    foreach ($file in $files) {
        # README自体はスキップ
        if ($file.FullName -eq $ReadmePath) {
            continue
        }

        if ($null -eq $latestTime -or $file.LastWriteTime -gt $latestTime) {
            $latestTime = $file.LastWriteTime
        }
    }

    return $latestTime
}

# メイン処理
function Main {
    Write-Host ""
    Write-Host "======================================"
    Write-Host "  README不足・更新漏れチェッカー"
    Write-Host "======================================"
    Write-Host ""

    $missingCount = 0
    $checkedCount = 0
    $excludedCount = 0
    $hasReadmeCount = 0
    $outdatedCount = 0

    $missingDirs = @()
    $outdatedDirs = @()

    # 全フォルダを走査
    $allDirs = Get-ChildItem -Path $ProjectRoot -Directory -Recurse -ErrorAction SilentlyContinue

    foreach ($dir in $allDirs) {
        # 除外対象かチェック
        if (Test-Excluded -DirPath $dir.FullName) {
            $excludedCount++
            if ($VerboseOutput) {
                Write-Host "[除外] $($dir.FullName.Substring($ProjectRoot.Length + 1))" -ForegroundColor Blue
            }
            continue
        }

        $checkedCount++
        $relativePath = $dir.FullName.Substring($ProjectRoot.Length + 1)

        # READMEの存在確認
        $readmePath = Get-ReadmePath -DirPath $dir.FullName

        if ($null -ne $readmePath) {
            $hasReadmeCount++

            # 更新漏れチェック
            $readmeTime = (Get-Item $readmePath).LastWriteTime
            $latestFileTime = Get-LatestFileTime -DirPath $dir.FullName -ReadmePath $readmePath

            if ($null -ne $latestFileTime -and $latestFileTime -gt $readmeTime) {
                $outdatedCount++
                $outdatedDirs += [PSCustomObject]@{
                    Path = $relativePath
                    ReadmeTime = $readmeTime.ToString("yyyy-MM-dd HH:mm")
                    LatestFileTime = $latestFileTime.ToString("yyyy-MM-dd HH:mm")
                }

                if ($VerboseOutput) {
                    Write-Host "[要更新] $relativePath" -ForegroundColor Magenta
                }
            } else {
                if ($VerboseOutput) {
                    Write-Host "[OK] $relativePath" -ForegroundColor Green
                }
            }
        } else {
            $missingCount++
            $missingDirs += $relativePath

            if ($VerboseOutput) {
                Write-Host "[不足] $relativePath" -ForegroundColor Red
            }
        }
    }

    # 結果表示
    Write-Host ""
    Write-Host "===== 結果 =====" -ForegroundColor Yellow
    Write-Host ""

    # READMEが不足しているフォルダ
    if ($missingCount -gt 0) {
        Write-Host "READMEが不足しているフォルダ ($missingCount 件):" -ForegroundColor Red
        Write-Host ""
        foreach ($dir in $missingDirs) {
            Write-Host "  ● $dir" -ForegroundColor Red
        }
        Write-Host ""
    }

    # 更新漏れの可能性があるフォルダ
    if ($outdatedCount -gt 0) {
        Write-Host "READMEの更新漏れの可能性があるフォルダ ($outdatedCount 件):" -ForegroundColor Magenta
        Write-Host "(フォルダ内のファイルがREADMEより新しい)" -ForegroundColor Magenta
        Write-Host ""
        foreach ($entry in $outdatedDirs) {
            Write-Host "  ▲ $($entry.Path)" -ForegroundColor Magenta
            Write-Host "      README更新: $($entry.ReadmeTime)"
            Write-Host "      最新ファイル: $($entry.LatestFileTime)"
        }
        Write-Host ""
    }

    # 問題がない場合
    if ($missingCount -eq 0 -and $outdatedCount -eq 0) {
        Write-Host "すべてのフォルダにREADMEが存在し、最新の状態です！" -ForegroundColor Green
        Write-Host ""
    }

    Write-Host "======================================"
    Write-Host "  サマリー"
    Write-Host "======================================"
    Write-Host "  チェック対象:   $checkedCount フォルダ"
    Write-Host "  README存在:     " -NoNewline; Write-Host "$hasReadmeCount" -ForegroundColor Green -NoNewline; Write-Host " フォルダ"
    Write-Host "  README不足:     " -NoNewline; Write-Host "$missingCount" -ForegroundColor Red -NoNewline; Write-Host " フォルダ"
    Write-Host "  更新漏れ疑い:   " -NoNewline; Write-Host "$outdatedCount" -ForegroundColor Magenta -NoNewline; Write-Host " フォルダ"
    Write-Host "  除外:           " -NoNewline; Write-Host "$excludedCount" -ForegroundColor Blue -NoNewline; Write-Host " フォルダ"
    Write-Host "======================================"
    Write-Host ""

    # 不足または更新漏れがある場合は終了コード1を返す
    if ($missingCount -gt 0 -or $outdatedCount -gt 0) {
        exit 1
    }

    exit 0
}

Main
