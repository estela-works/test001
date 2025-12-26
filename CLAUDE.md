# プロジェクトガイド

## ディレクトリナビゲーション

この環境ではすべてのディレクトリにREADMEが配置されている。
不明なときはトップフォルダのREADMEを読むこと。READMEを参照することで、正しく必要なフォルダに素早くアクセスできる。

---

## Windows環境でのコマンド実行

この環境はWindows。Unix系コマンド（`tree`, `find`, `ls`等）は使用不可。

### 基本コマンド

```powershell
# ファイル一覧取得
powershell -Command "Get-ChildItem -Path 'パス' -Recurse -Name | Select-Object -First 100"

# ディレクトリ存在確認
powershell -Command "Test-Path 'パス'"

# サブフォルダ一覧
powershell -Command "Get-ChildItem 'パス' -Directory | Select-Object Name"
```

### 注意事項

- `dir /s /b` はBash環境では動作しない（cmd.exe専用）
- `tree`, `find`, `ls` コマンドは使用不可
- パスにスペースが含まれる場合はシングルクォートで囲む

---

## プロセス管理

```powershell
# ポート使用状況確認
netstat -ano | findstr :8080

# Javaプロセス確認
Get-Process | Where-Object {$_.ProcessName -eq 'java'}

# プロセス停止
Stop-Process -Id <PID> -Force
```

### 重要

- Spring Boot起動前に必ずポート8080が空いているか確認
- H2データベースロックエラーの原因はポート競合が多い
- バックグラウンド実行したプロセスは必ず停止処理を行う

---

## Spring Boot開発

```powershell
# 起動
.\mvnw.cmd spring-boot:run

# テスト実行
.\mvnw.cmd test

# 特定のテストのみ
.\mvnw.cmd test -Dtest=TestClassName

# クリーンビルド
.\mvnw.cmd clean compile
```

### H2データベースロックエラーの対処

```powershell
# 1. ポート確認
netstat -ano | findstr :8080

# 2. プロセス停止
Stop-Process -Id <PID> -Force

# 3. ロックファイル削除（最終手段）
# data/tododb.mv.db.lock を削除
```

---

## ファイル操作

```powershell
# ディレクトリ内の全ファイル削除（ディレクトリは残す）
Remove-Item -Path "パス\*" -Recurse -Force

# 削除後の確認
Get-ChildItem -Path "パス"
```

**注意**:
- `-Force` で隠しファイルも削除
- `-Recurse` でサブディレクトリも再帰的に削除
- バックアップを取ってから実行推奨

---

## 設計・実装フロー

### 案件開始時のチェックリスト

1. ✅ README確認（トップ、docs、案件フォルダ）
2. ✅ テンプレート確認（docs/projects/template/）
3. ✅ 既存案件の参考確認

### ドキュメント作成順序

1. **要件整理書**（requirements.md）
2. **基本設計書**（basic-design-*.md）
   - バックエンド：basic-design-backend.md
   - フロントエンド：basic-design-frontend.md（変更ない場合も作成し理由明記）
3. **詳細設計書**（detail-design-*.md）
   - API、ロジック、DB、フロントエンド
4. **テスト仕様書**（test-spec-*.md）
5. **実装作業報告書**（implementation-report.md）← 実装完了時に作成
6. **テスト実装報告書**（test-implementation-report.md）← テスト実装完了時に作成

### 重要事項

- フロントエンド基本設計書は必須（変更なしでも理由を明記）
- 案件README.mdは必ず作成（概要、ドキュメント一覧、状態管理）
- 完了時にdocs/projects/README.mdの案件一覧を更新

---

## よくあるミスと対策

### PowerShellコマンドエラー

❌ **NG**:
```powershell
Get-ChildItem | ForEach-Object { $_.Line }  # extglob.Line エラー
Get-Content | Measure-Object -Line | $_.Lines  # 構文エラー
Get-ChildItem *.md | Select-Object @{Name='Lines';Expression={...}}  # 複雑で失敗しやすい
```

✅ **OK**:
```powershell
# Measure-Objectの正しい使用
(Get-Content file.md | Measure-Object -Line).Lines

# プロジェクトスクリプトを使用
.\scripts\find-large-markdown.ps1
```

### Bashコマンドの誤用

❌ **NG**: Windows環境で `tree`, `find`, `ls`, `cat`, `grep` を使用
✅ **OK**: PowerShellの `Get-ChildItem` または専用ツール（Read, Grep）を使用

---

## ドキュメント管理

### 大きなMarkdownファイルの分割

**ルール**: 500行を超えるMarkdownファイルは分割する

**分割手順**:
1. 論理的なセクション構造を確認（`## ` レベル）
2. 関連セクションをグループ化
3. 各グループを個別ファイルに分割
4. 元のファイルは目次ファイルに再構成
5. 案件フォルダのREADMEに分割ファイル一覧を追加

**分割例**:
```
detail-design-store.md          # 目次ファイル（約100行）
├─ detail-design-store-todo.md     # todoStore（約200行）
├─ detail-design-store-project.md  # projectStore（約150行）
├─ detail-design-store-user.md     # userStore（約120行）
└─ detail-design-store-common.md   # 共通部分（約80行）
```

### README更新漏れの防止

**ルール**: ファイルを追加・更新したら、必ず該当フォルダのREADMEを更新

**チェックポイント**:
1. 新しいファイル作成 → READMEにリンク追加
2. ファイル分割 → READMEに分割ファイル一覧追加
3. 案件完了 → 案件フォルダと親フォルダのREADME更新
4. 定期確認： `.\scripts\check-missing-readme.ps1`

### 定期メンテナンス（月次）

```powershell
# 大きなMarkdownファイルの確認
.\scripts\find-large-markdown.ps1

# README更新漏れの確認
.\scripts\check-missing-readme.ps1
```

---

## Claude Code使用時のベストプラクティス

### ツール選択の優先順位

**ファイル操作**:
1. **Read**: ファイル内容確認（最優先）
2. **Glob**: ファイルパスのパターン検索
3. **Grep**: ファイル内容の検索
4. ❌ **Bash**: `cat`, `grep`, `find` は使用しない

**行数確認**:
1. **Read**: ファイルを読み込んで全体確認
2. **プロジェクトスクリプト**: `.\scripts\find-large-markdown.ps1`
3. ❌ **Bash (PowerShell)**: 複雑なパイプラインは避ける

**ファイル分割**:
1. **Task (general-purpose)**: 複雑な分割作業はエージェントに委譲
2. **Edit/Write**: 単純な分割は直接編集
3. **Grep**: ファイル構造確認（ヘッダー検索）

### タスク管理

**TodoWriteの活用**:
- 複数ステップのタスクは必ずTodoリスト作成
- 各タスク完了時に即座にステータス更新
- 進捗状況を可視化してユーザーに安心感を提供

### プロジェクトスクリプトの活用

**利用可能なスクリプト**:
- `.\scripts\find-large-markdown.ps1` - 大きなMarkdownファイルの検出
- `.\scripts\check-missing-readme.ps1` - README更新漏れの検出

**使用タイミング**:
- タスク開始前の現状確認
- タスク完了後の最終確認
- 月次メンテナンス時

---

## 推奨ワークフロー

1. **案件開始**
   - README確認 → 要件定義 → 基本設計 → 詳細設計

2. **実装前**
   - プロセス確認 → ポート確認 → 既存コード確認

3. **実装中**
   - テストコード作成 → 実装 → ビルド確認

4. **実装完了**
   - ビルド確認 → **実装作業報告書作成**（implementation-report.md）

5. **テスト実装完了**
   - テスト実行 → **テスト実装報告書作成**（test-implementation-report.md）

6. **案件完了**
   - 動作確認 → ドキュメント更新 → 案件README更新 → 案件一覧更新 → プロセス停止確認

---

## 重要な教訓

### 設計フェーズ

- フロントエンド設計書は変更がなくても必ず作成し理由を明記
- 実装ガイドに詳細な手順とトラブルシューティングを記載

### 実装フェーズ

- 静的リソース削除は前後でファイル一覧を確認
- テストファースト：実装前にテストケースを設計

### テストフェーズ

- `Tests run: X, Failures: 0, Errors: 0, Skipped: 0` を必ず確認
- 単体テストだけでなく実際の起動確認も必須

### 運用フェーズ

- 起動前にポート確認、終了時は確実にプロセス停止
- 実装完了時に案件ステータスを「完了」に更新し結果を記録

### ドキュメント管理

- プロジェクト独自のスクリプトは信頼性が高い
- 複雑なPowerShellコマンドより既存スクリプトを活用
- ファイル作成・分割時は即座にREADME更新
- タイムスタンプだけでなく実際の内容も確認
