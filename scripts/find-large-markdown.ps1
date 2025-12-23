param(
    [string]$Path = "",
    [int]$MinLines = 300
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

if ([string]::IsNullOrEmpty($Path)) {
    $SearchPath = $ProjectRoot
} else {
    if (-not [System.IO.Path]::IsPathRooted($Path)) {
        $SearchPath = Join-Path $ProjectRoot $Path
    } else {
        $SearchPath = $Path
    }
}

if (-not (Test-Path $SearchPath)) {
    Write-Host "Error: Path not found: $SearchPath" -ForegroundColor Red
    exit 1
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Large Markdown File Search" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Search Path: $SearchPath" -ForegroundColor Gray
Write-Host "Threshold: $MinLines lines or more" -ForegroundColor Gray
Write-Host ""

$excludeDirs = @("node_modules", ".git", "dist", "build", "target")

$results = @()
$allMdFiles = Get-ChildItem -Path $SearchPath -Filter "*.md" -Recurse -File | Where-Object {
    $path = $_.FullName
    -not ($excludeDirs | Where-Object { $path -match "[\\/]$_[\\/]" })
}

foreach ($file in $allMdFiles) {
    $lineCount = (Get-Content $file.FullName | Measure-Object -Line).Lines
    if ($lineCount -ge $MinLines) {
        $relativePath = $file.FullName.Replace($ProjectRoot, "").TrimStart("\", "/")
        $results += [PSCustomObject]@{
            Path = $relativePath
            Lines = $lineCount
            SizeKB = [math]::Round($file.Length / 1KB, 1)
        }
    }
}

$results = $results | Sort-Object -Property Lines -Descending

if ($results.Count -eq 0) {
    Write-Host "No files found matching the criteria." -ForegroundColor Green
} else {
    Write-Host "Found: $($results.Count) file(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host ("-" * 80) -ForegroundColor Gray
    Write-Host ("{0,-55} {1,10} {2,10}" -f "File Path", "Lines", "Size(KB)") -ForegroundColor White
    Write-Host ("-" * 80) -ForegroundColor Gray

    foreach ($item in $results) {
        if ($item.Lines -ge 500) { $color = "Red" }
        elseif ($item.Lines -ge 400) { $color = "Yellow" }
        else { $color = "White" }

        if ($item.Path.Length -gt 55) {
            $displayPath = "..." + $item.Path.Substring($item.Path.Length - 52)
        } else {
            $displayPath = $item.Path
        }

        Write-Host ("{0,-55} {1,10} {2,10}" -f $displayPath, $item.Lines, $item.SizeKB) -ForegroundColor $color
    }

    Write-Host ("-" * 80) -ForegroundColor Gray
    Write-Host ""
    $totalLines = ($results | Measure-Object -Property Lines -Sum).Sum
    Write-Host "Total: $($results.Count) file(s) / $totalLines lines" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Recommendation: Files with 500+ lines (red) should be split." -ForegroundColor Yellow
}

Write-Host ""
