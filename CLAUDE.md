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

---

## プロセス管理

### プロセス確認

```powershell
# ポート使用状況確認
powershell -Command "netstat -ano | findstr :8080"

# 実行中のJavaプロセス確認
powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'java'}"
```

### プロセス停止

```powershell
# プロセスIDを指定して停止
powershell -Command "Stop-Process -Id <PID> -Force"

# プロセス名で停止
powershell -Command "Stop-Process -Name java -Force"
```

### 注意事項

- Spring Boot起動時にポート8080が既に使用中の場合、H2データベースロックエラーが発生する
- 起動前に必ずポートが空いているか確認する
- バックグラウンド実行したプロセスは必ず停止処理を行う

---

## Spring Boot開発のベストプラクティス

### 起動・停止

```powershell
# 起動
.\mvnw.cmd spring-boot:run

# 停止
Ctrl + C
```

### トラブルシューティング

#### H2データベースロックエラー

**症状**: `Database may be already in use` エラー

**原因**:
- 別のSpring Bootプロセスが実行中
- 前回の終了が不完全

**対策**:
```powershell
# 1. ポート8080使用中のプロセスを確認
netstat -ano | findstr :8080

# 2. プロセスIDを確認して停止
Stop-Process -Id <PID> -Force

# 3. データベースファイルのロックファイル削除（最終手段）
# data/tododb.mv.db.lock を削除
```

#### ビルドエラー

**症状**: コンパイルエラー

**対策**:
```powershell
# クリーンビルド
.\mvnw.cmd clean compile

# キャッシュクリア後にビルド
.\mvnw.cmd clean install
```

---

## テスト実行

### 全テスト実行

```powershell
.\mvnw.cmd test
```

### 特定のテストクラスのみ実行

```powershell
.\mvnw.cmd test -Dtest=FrontendRedirectControllerTest
```

### 静かなモード（ログ簡略化）

```powershell
.\mvnw.cmd test -q
```

---

## ファイル操作のベストプラクティス

### 静的リソース削除

```powershell
# ディレクトリ内の全ファイル削除（ディレクトリは残す）
Remove-Item -Path "パス\*" -Recurse -Force

# 削除後の確認
Get-ChildItem -Path "パス"
```

### 注意事項

- `-Force` オプションで隠しファイルも削除される
- `-Recurse` でサブディレクトリも再帰的に削除
- バックアップを取ってから実行推奨

---

## 設計・実装フロー

### 案件開始時のチェックリスト

1. ✅ README確認（トップ、docs、案件フォルダ）
2. ✅ プロンプト確認（docs/prompts/phases/）
3. ✅ テンプレート確認（docs/projects/template/）
4. ✅ 既存案件の参考確認

### ドキュメント作成順序

1. 要件整理書（requirements.md）
2. 基本設計書（basic-design-*.md）
   - バックエンド: basic-design-backend.md
   - フロントエンド: basic-design-frontend.md（変更ない場合も作成し理由明記）
3. 詳細設計書（detail-design-*.md）
   - API: detail-design-api.md
   - ロジック: detail-design-logic.md
   - DB: detail-design-db.md（該当時）
   - フロントエンド: detail-design-frontend-*.md（該当時）
4. 実装ガイド（implementation-guide.md）
5. テスト仕様書（test-spec-*.md）

### 注意事項

- **フロントエンド基本設計書は必須**：変更がない場合でも作成し、「変更なし」の理由を明記
- 案件README.mdは必ず作成（概要、ドキュメント一覧、状態管理）
- 完了時にdocs/projects/README.mdの案件一覧を更新

---

## curlコマンドの注意点

### Windows PowerShellでのcurl使用

```powershell
# シンプルなGETリクエスト
curl http://localhost:8080/

# 出力を制限（先頭20行のみ）
curl http://localhost:8080/ 2>&1 | Select-Object -First 20
```

### 注意事項

- Windows PowerShellでは `curl` は `Invoke-WebRequest` のエイリアス
- パイプ処理に注意（`2>&1` でエラー出力もリダイレクト）
- レスポンスが大きい場合は `Select-Object -First` で制限

---

## 今回の案件で得られた教訓

### 設計フェーズ

- **フロントエンド設計書の重要性**: 変更がない場合でも必ず作成し、理由を明記することで混乱を防ぐ
- **実装ガイドの価値**: 詳細な手順とトラブルシューティングを記載することで再現性が向上

### 実装フェーズ

- **静的リソース削除の確認**: 削除前後でファイル一覧を確認し、確実に削除されたことを検証
- **テストファーストの重要性**: 実装前にテストケースを設計することで、仕様が明確になる

### テストフェーズ

- **テスト成功の確認**: `Tests run: X, Failures: 0, Errors: 0, Skipped: 0` を必ず確認
- **統合テストの価値**: 単体テストだけでなく、実際の起動確認も必須

### 運用フェーズ

- **プロセス管理の重要性**: 起動前にポート確認、終了時は確実にプロセス停止
- **ドキュメント更新**: 実装完了時に案件ステータスを「完了」に更新し、結果を記録

---

## よくあるミスと対策

### PowerShellコマンドの失敗

❌ **NG**: `Get-Process | Where-Object {$_.ProcessName -like '*java*'}`
- `extglob.ProcessName` エラーが発生

✅ **OK**: `Get-Process | Where-Object {$_.ProcessName -eq 'java'}`
- `-eq` で完全一致検索

❌ **NG**: パイプ処理での変数参照エラー
```powershell
Get-ChildItem | ForEach-Object { $_.Line }  # extglob.Line エラー
Get-Content | Measure-Object -Line | $_.Lines  # 構文エラー
```

✅ **OK**: 正しい構文を使用
```powershell
# Select-Stringの結果を取得
Get-Content file.md | Select-String 'pattern' | ForEach-Object { $_.Line }

# Measure-Objectの結果を取得
(Get-Content file.md | Measure-Object -Line).Lines
```

### Bashコマンドの誤用

❌ **NG**: Windows環境で `tree`, `find`, `ls` を使用
✅ **OK**: PowerShellの `Get-ChildItem` を使用

❌ **NG**: Bash環境で `dir /s /b` を使用（cmd.exe専用）
✅ **OK**: PowerShell専用ツールを使用、またはReadツールで直接確認

### ファイル削除の不完全

❌ **NG**: 削除後の確認を怠る
✅ **OK**: `Get-ChildItem` で空であることを確認

### ファイル行数確認の失敗

❌ **NG**: 複雑なPowerShellパイプラインで行数確認
```powershell
# エラーが発生しやすい
Get-ChildItem *.md | Select-Object @{Name='Lines';Expression={(Get-Content $_.FullName | Measure-Object -Line).Lines}}
```

✅ **OK**: Readツールで直接確認、またはプロジェクトのスクリプトを使用
```powershell
# スクリプトを使用
.\scripts\find-large-markdown.ps1

# Readツールで確認（Claude Codeの場合）
Read tool を使用してファイルを読み込み、行数を確認
```

---

## ドキュメント管理のベストプラクティス

### 大きなMarkdownファイルの分割

**ルール**: 500行を超えるMarkdownファイルは分割する

**分割の手順**:
1. ファイルの論理的なセクション構造を確認（`## ` レベルのヘッダー）
2. 関連性の高いセクションをグループ化
3. 各グループを個別ファイルに分割
4. 元のファイルは目次ファイルとして再構成
5. 案件フォルダのREADMEに分割ファイルの一覧を追加

**分割例**:
```
# 分割前（500行）
detail-design-store.md

# 分割後
detail-design-store.md          # 目次ファイル（約100行）
├─ detail-design-store-todo.md     # todoStore（約200行）
├─ detail-design-store-project.md  # projectStore（約150行）
├─ detail-design-store-user.md     # userStore（約120行）
└─ detail-design-store-common.md   # 共通部分（約80行）
```

**目次ファイルの構成**:
- 案件情報
- 概要
- ドキュメント構成表（分割ファイルへのリンク）
- 各セクションの簡単な説明
- 改版履歴（分割の記録を追加）

### README更新漏れの防止

**ルール**: ファイルを追加・更新したら、必ず該当フォルダのREADMEを更新する

**チェックポイント**:
1. 新しいファイルを作成したか？ → READMEにリンクを追加
2. ファイルを分割したか？ → READMEに分割ファイル一覧を追加
3. 案件が完了したか？ → 案件フォルダと親フォルダのREADMEを更新
4. 定期的にスクリプトで確認： `.\scripts\check-missing-readme.ps1`

**更新内容の例**:
```markdown
## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [detail-design-store.md](detail-design-store.md) | ストア詳細設計書（目次） |

### 分割ドキュメント

**ストア詳細設計書の分割ファイル**:
- [detail-design-store-todo.md](detail-design-store-todo.md) - todoStore
- [detail-design-store-project.md](detail-design-store-project.md) - projectStore
- [detail-design-store-user.md](detail-design-store-user.md) - userStore
- [detail-design-store-common.md](detail-design-store-common.md) - 使用例・エラーハンドリング
```

### 定期メンテナンス

**月次チェック**:
```powershell
# 大きなMarkdownファイルの確認
.\scripts\find-large-markdown.ps1

# README更新漏れの確認
.\scripts\check-missing-readme.ps1
```

**対処**:
- 500行以上のファイル → 分割を検討
- README更新漏れ → 内容を確認して更新

---

## 推奨ワークフロー

1. **案件開始**
   - README確認 → 要件定義 → 基本設計 → 詳細設計

2. **実装前**
   - プロセス確認 → ポート確認 → 既存コード確認

3. **実装中**
   - テストコード作成 → 実装 → ビルド確認

4. **実装後**
   - テスト実行 → 動作確認 → ドキュメント更新

5. **案件完了**
   - 案件README更新 → 案件一覧更新 → プロセス停止確認

---

## Claude Code使用時のベストプラクティス

### ツール選択の優先順位

**ファイル操作**:
1. **Read**: ファイル内容の確認（最優先）
2. **Glob**: ファイルパスのパターン検索
3. **Grep**: ファイル内容の検索
4. ❌ **Bash**: `cat`, `grep`, `find` は使用しない

**行数確認**:
1. **Read**: ファイルを読み込んで全体を確認
2. **プロジェクトスクリプト**: `.\scripts\find-large-markdown.ps1`
3. ❌ **Bash (PowerShell)**: 複雑なパイプラインは避ける（エラーが多い）

**ファイル分割**:
1. **Task (general-purpose)**: 複雑な分割作業はエージェントに委譲
2. **Edit/Write**: 単純な分割は直接編集
3. ファイル構造の確認は **Grep** でヘッダーを検索

### エラー回避のパターン

**PowerShellエラーの回避**:
```powershell
# ❌ NG: パイプラインでのプロパティアクセスエラー
Get-ChildItem | ForEach-Object { $_.Line }  # extglob.Line エラー

# ✅ OK: Readツールで確認
Read tool を使用してファイルを直接読み込む
```

**ファイル確認の効率化**:
```powershell
# ❌ NG: すべてのファイルをループで確認
for file in *.md; do wc -l $file; done

# ✅ OK: プロジェクトスクリプトを使用
.\scripts\find-large-markdown.ps1
```

### タスク管理のベストプラクティス

**TodoWriteの活用**:
- 複数ステップのタスクは必ずTodoリストを作成
- 各タスク完了時に即座にステータス更新
- タスクの進捗状況を可視化することでユーザーに安心感を提供

**例**:
```markdown
1. [in_progress] detail-design-store.md (500行) を分割
2. [pending] スクリプトを再実行して問題が解決したことを確認
3. [completed] README更新漏れのあるフォルダのREADMEを更新
```

### プロジェクトスクリプトの活用

**利用可能なスクリプト**:
- `.\scripts\find-large-markdown.ps1` - 大きなMarkdownファイルの検出
- `.\scripts\check-missing-readme.ps1` - README更新漏れの検出

**使用タイミング**:
- タスク開始前の現状確認
- タスク完了後の最終確認
- 月次メンテナンス時

---

## 今回の作業から得られた具体的な教訓

### 問題検出

**スクリプトの有効活用**:
- プロジェクト独自のスクリプトは信頼性が高い
- 複雑なPowerShellコマンドを自分で組み立てるより、既存スクリプトを活用

### ファイル分割

**分割の判断基準**:
- 500行以上のファイルは必ず分割対象
- 分割済みファイル（目次ファイル）かどうかを最初に確認
- 分割ファイルが作成されているが空（0行）の場合は未完了

**分割の実施方法**:
- 単純な分割: Edit/Writeツールで直接編集
- 複雑な分割: Task (general-purpose) エージェントに委譲

### README管理

**更新タイミング**:
- ファイル作成・分割時は即座にREADME更新
- タイムスタンプだけでなく、実際の内容も確認
- 分割ファイルのセクションを追加して一覧性を向上

**更新内容**:
- 新規ファイルへのリンク追加
- 分割ファイルの一覧追加
- 目次ファイルには「（目次）」などの注釈を追加
