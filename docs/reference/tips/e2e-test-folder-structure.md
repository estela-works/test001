# E2Eテスト フォルダ構成計画書

## 概要

PlaywrightによるE2Eテストのフォルダ構成を定義する。
王道シナリオ（コアテスト）を中心に、複数人での開発・運用を想定した構成。

---

## spec/とtest/の関係

```
spec/（試験観点・仕様）          test/（テスト実装）
        ↓ 参照して実装               ↓
試験観点を定義              →    Playwrightコードを実装
```

| 役割 | 配置場所 | 内容 |
|---|---|---|
| 試験観点の定義 | `spec/テスト/結合試験/` | シナリオの目的、確認観点、期待結果 |
| テスト実装 | `test/core/` | Playwrightによる自動テストコード |

**重要**: シナリオの「何を確認するか」はspec側で定義し、test側はその実装に専念する。

---

## フォルダ構成

### spec/ 側（試験観点）

```
spec/
├─ 案件スコープ/
└─ テスト/
   └─ 結合試験/
      ├─ README.md                    # 試験観点の管理ルール
      │
      ├─ SC001-ログイン.md            # 各シナリオの試験観点
      ├─ SC002-基本見積フロー.md
      └─ SC003-プラン変更.md
```

### test/ 側（テスト実装）

```
test/
├─ system/                            # システム共通
│  ├─ utils/                          # ユーティリティ関数
│  │  ├─ login.js
│  │  └─ error-watcher.js
│  ├─ fixtures/                       # 共通テストデータ
│  │  ├─ device.json
│  │  └─ plan.json
│  └─ prompts/                        # AI向けプロンプト
│     └─ test-generate.md
│
├─ core/                              # 王道シナリオ実装
│  ├─ README.md                       # 実装状況・管理ルール
│  │
│  ├─ SC001-ログイン/
│  │  ├─ README.md                    # 実装メモ・変更履歴
│  │  └─ SC001.spec.js
│  │
│  ├─ SC002-基本見積フロー/
│  │  ├─ README.md
│  │  └─ SC002.spec.js
│  │
│  └─ SC003-プラン変更/
│     ├─ README.md
│     └─ SC003.spec.js
│
└─ sandbox/                           # 個人作業スペース（gitignore）
   └─ .gitkeep
```

---

## spec/とtest/の対応

| spec（試験観点） | test（実装） |
|---|---|
| `spec/テスト/結合試験/SC001-ログイン.md` | `test/core/SC001-ログイン/SC001.spec.js` |
| `spec/テスト/結合試験/SC002-基本見積フロー.md` | `test/core/SC002-基本見積フロー/SC002.spec.js` |

シナリオIDで紐付け。spec側のファイルを見れば「何を確認するか」、test側を見れば「どう実装しているか」が分かる。

---

## 命名規則

| 対象 | ルール | 例 |
|---|---|---|
| シナリオID | `SC{連番3桁}` | `SC001`, `SC042` |
| 試験観点ファイル（spec） | `SC{ID}-{概要}.md` | `SC001-ログイン.md` |
| シナリオフォルダ（test） | `SC{ID}-{概要}/` | `SC001-ログイン/` |
| specファイル（test） | `SC{ID}.spec.js` | `SC001.spec.js` |

---

## 複数人開発の運用ルール

### シナリオID（連番）の管理

複数人が同時にシナリオを追加する場合、IDが衝突する可能性がある。

**ルール**: `spec/テスト/結合試験/README.md` でIDを予約制とする。

```markdown
## シナリオID予約表

| ID | 概要 | 担当 | 状態 |
|---|---|---|---|
| SC001 | ログイン | - | 完了 |
| SC002 | 基本見積フロー | - | 完了 |
| SC003 | プラン変更 | - | 完了 |
| SC004 | アクセサリー選択 | yamada | 作業中 |
| SC005 | （予約）バンドル対応 | tanaka | 観点作成中 |
```

**手順**:
1. 新規シナリオ作成前に、README.mdで次のIDを予約
2. 担当者名と状態を記入
3. PRまたは直接pushで予約を確定

### sandbox/の使い方

sandboxは個人作業スペース。各自で自分のフォルダを作成する。

```
test/sandbox/
├─ .gitkeep
├─ yamada/           # 山田さんの作業スペース
│  ├─ wip-sc004.spec.js
│  ├─ prompt.md      # Copilotへの指示メモ
│  └─ memo.md        # 作業メモ
├─ tanaka/           # 田中さんの作業スペース
└─ suzuki/           # 鈴木さんの作業スペース
```

**ルール**:
- フォルダ名は自分の名前（ローマ字）
- 何を置いてもOK（gitignoreされる）
- 完成したら `core/` に移動してPR

---

## Copilotを活用したテスト作成手順

sandbox/でCopilot（GitHub Copilot / Claude等）を活用してテストを作成する詳細手順。

### 前提

- VSCodeにGitHub Copilot拡張がインストール済み
- または Claude Code CLI が利用可能

### Step 1: 作業フォルダの準備

```bash
# 自分のsandboxフォルダを作成（初回のみ）
mkdir test/sandbox/自分の名前
cd test/sandbox/自分の名前
```

作業フォルダ内に以下を用意：

```
test/sandbox/yamada/
├─ wip.spec.js       # 作成中のテストファイル
├─ prompt.md         # Copilotへの指示（任意）
└─ memo.md           # 作業メモ（任意）
```

### Step 2: 参照ファイルの確認

テスト作成前に以下を確認・準備する：

| 参照先 | 内容 | 用途 |
|---|---|---|
| `spec/テスト/結合試験/SC{ID}-{概要}.md` | 試験観点 | 何を確認するか |
| `test/system/prompts/test-generate.md` | プロンプトテンプレート | Copilotへの指示の参考 |
| `test/system/utils/` | 共通ユーティリティ | login.js等の使い方 |
| `test/core/` 内の既存テスト | 実装例 | コーディング規約の参考 |
| `test/system/fixtures/` | テストデータ | device.json, plan.json等 |

### Step 3: Copilotへの指示作成

#### 方法A: プロンプトファイルを使う

`test/system/prompts/test-generate.md` をコピーして編集：

```bash
copy test\system\prompts\test-generate.md test\sandbox\yamada\prompt.md
```

`prompt.md` を開いて、以下の情報を記入：

```markdown
# テスト生成指示

## 対象シナリオ
SC004 - アクセサリー選択

## 試験観点（spec/テスト/結合試験/SC004-アクセサリー選択.md より）
- アクセサリー一覧が表示されること
- アクセサリーを選択すると見積に反映されること
- 選択解除ができること

## 参照してほしいファイル
- test/system/utils/login.js（ログイン処理）
- test/core/SC002-基本見積フロー/SC002.spec.js（似た処理の参考）
- test/system/fixtures/device.json（デバイスデータ）

## 制約
- Playwright + TypeScript
- data-testid セレクタを優先
- 日本語コメントOK
```

#### 方法B: インラインでCopilotに指示

VSCodeで `wip.spec.js` を開き、コメントで指示：

```javascript
// Copilotへの指示:
// - SC004 アクセサリー選択のE2Eテストを作成
// - test/system/utils/login.js を使ってログイン
// - アクセサリー一覧画面でアクセサリーを選択
// - 見積金額に反映されることを確認
// - 参考: test/core/SC002-基本見積フロー/SC002.spec.js

import { test, expect } from '@playwright/test';
import { login } from '../../system/utils/login';

// ここからCopilotが補完を提案
```

### Step 4: テスト生成と編集

#### GitHub Copilotの場合

1. `wip.spec.js` でコメント指示を書く
2. Enterで改行すると補完候補が表示される
3. `Tab` で採用、または `Ctrl+Enter` で複数候補を表示
4. Copilot Chat（`Ctrl+I`）で対話的に修正を依頼

```
Copilot Chat例:
「このテストにエラーハンドリングを追加して」
「セレクタを data-testid に変更して」
「ログイン失敗時のテストケースを追加して」
```

#### Claude Code CLIの場合

```bash
# sandboxフォルダで実行
cd test/sandbox/yamada

# Claude Codeを起動
claude

# 指示例
> spec/テスト/結合試験/SC004-アクセサリー選択.md を読んで、
> test/core/SC002-基本見積フロー/SC002.spec.js を参考に、
> wip.spec.js にPlaywrightテストを作成して
```

### Step 5: テスト実行と修正（試行錯誤）

```bash
# sandboxのテストを実行
npx playwright test test/sandbox/yamada/wip.spec.js

# ヘッドレスモードをOFFにして目視確認
npx playwright test test/sandbox/yamada/wip.spec.js --headed

# デバッグモード（ステップ実行）
npx playwright test test/sandbox/yamada/wip.spec.js --debug

# 特定のテストケースのみ実行
npx playwright test test/sandbox/yamada/wip.spec.js -g "アクセサリーを選択"
```

#### 失敗時の修正サイクル

```
テスト実行
   ↓ 失敗
エラーメッセージを確認
   ↓
Copilotに修正を依頼（または手動修正）
   ↓
再実行
   ↓ 成功するまで繰り返し
```

**Copilotへの修正依頼例**:

```
「TimeoutErrorが出る。セレクタ '.accessory-list' が見つからない。
 正しいセレクタを調べて修正して」

「このアサーションが失敗する。期待値を確認して修正して」

「ログイン後の画面遷移を待つ処理を追加して」
```

### Step 6: 完成したテストの整理

テストが安定して動くようになったら：

1. **ファイル名を正式名称に変更**

```bash
# wip.spec.js → SC004.spec.js
rename wip.spec.js SC004.spec.js
```

2. **コードを整理**
   - 不要なコメント削除
   - Copilot指示コメントを削除
   - コーディング規約に合わせる

3. **README.mdを作成**

```markdown
# SC004 - アクセサリー選択

## 試験観点
[spec/テスト/結合試験/SC004-アクセサリー選択.md](../../../spec/テスト/結合試験/SC004-アクセサリー選択.md)

## 実装メモ
- ログイン処理は system/utils/login.js を使用
- アクセサリー一覧は data-testid="accessory-list" で取得

## 変更履歴
| 日付 | 担当 | 内容 |
|---|---|---|
| 2024-XX-XX | yamada | 初版作成（Copilot活用） |
```

### Step 7: core/への移動とPR

```bash
# core/にフォルダ作成
mkdir test/core/SC004-アクセサリー選択

# ファイルを移動
move test\sandbox\yamada\SC004.spec.js test\core\SC004-アクセサリー選択\
move test\sandbox\yamada\README.md test\core\SC004-アクセサリー選択\

# 最終確認
npx playwright test test/core/SC004-アクセサリー選択/

# core/README.md の一覧を更新
# PR作成
```

---

## Copilot活用のコツ

### 効果的なプロンプト

**良い例**:
```
SC004 アクセサリー選択のE2Eテストを作成して。
- test/core/SC002-基本見積フロー/SC002.spec.js の構造を参考に
- test/system/utils/login.js でログイン
- data-testid セレクタを使用
- 各ステップにコメントを入れて
```

**悪い例**:
```
テストを作って
```

### 参照ファイルを明示する

Copilotは開いているファイルや指定されたファイルを参照する。
効果的に使うため、関連ファイルをVSCodeで開いておく：

- 試験観点ファイル（spec側）
- 似た処理の既存テスト（core内）
- 共通ユーティリティ（utils内）

### 段階的に作成する

一度に全部作ろうとせず、段階的に：

```
1. まずログイン部分だけ作成・動作確認
2. 次に画面遷移部分を追加・動作確認
3. 最後にアサーション（検証）を追加・動作確認
```

### エラー時はログを共有

Copilotにエラーを修正させる際は、エラーメッセージ全文を共有：

```
このエラーを修正して:

Error: locator.click: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for locator('[data-testid="submit-btn"]')
============================================================
```

---

## クローン後のセットアップ

リポジトリをクローンした人向けの手順。

### 1. 依存パッケージのインストール

```bash
npm install
npx playwright install
```

### 2. sandbox/に自分のフォルダを作成

```bash
mkdir test/sandbox/自分の名前
```

### 3. テスト実行確認

```bash
# 全シナリオ実行
npx playwright test test/core/

# 特定シナリオのみ
npx playwright test test/core/SC001-ログイン/
```

### 4. 作業開始

1. `spec/テスト/結合試験/README.md` でシナリオIDを予約
2. `test/sandbox/自分の名前/` で実装・動作確認
3. 完成したら `test/core/` に配置してPR

---

## 各フォルダの役割

### spec/テスト/結合試験/

| ファイル | 役割 |
|---|---|
| `README.md` | シナリオID予約表、管理ルール |
| `SC{ID}-{概要}.md` | 各シナリオの試験観点（目的、確認項目、期待結果） |

### test/system/

| フォルダ | 役割 |
|---|---|
| `utils/` | ログイン処理、エラー監視など共通関数 |
| `fixtures/` | テストで使用する共通データ（JSON等） |
| `prompts/` | AIによるテスト生成時に参照するプロンプト |

### test/core/

王道シナリオの実装を格納。

- リリース前に必ず全件パスを確認
- 画面仕様変更時は最優先で修正
- spec側の試験観点に対応した実装

### test/sandbox/

個人作業スペース。gitignore対象。

- テスト作成中の下書き
- 動作確認・実験
- 完成したら `core/` に移動

---

## .gitignore 設定

```gitignore
# 個人作業スペース（.gitkeep以外）
test/sandbox/*
!test/sandbox/.gitkeep
```

---

## 運用フロー

### 新規シナリオ追加

```
1. spec/テスト/結合試験/README.md でシナリオIDを予約
   ↓
2. spec/テスト/結合試験/SC{ID}-{概要}.md に試験観点を記述
   ↓
3. test/sandbox/自分の名前/ でテスト実装・動作確認
   ↓
4. test/core/SC{ID}-{概要}/ にフォルダ作成して配置
   ↓
5. test/core/README.md の一覧を更新
   ↓
6. PR作成 → レビュー → マージ
```

### 既存シナリオの修正

```
1. spec側の観点に変更があれば先に更新
   ↓
2. test/sandbox/ で修正・動作確認
   ↓
3. test/core/ を更新
   ↓
4. 各README.mdの変更履歴に記録
   ↓
5. PR作成 → レビュー → マージ
```

### シナリオの廃止

```
1. test/core/ のフォルダ名先頭に `_` を付与（例: `_SC001-ログイン`）
   ↓
2. README.mdに廃止理由を記載
   ↓
3. spec側も同様に対応（または削除）
   ↓
4. PR作成 → レビュー → マージ
```

---

## テンプレート

### spec/テスト/結合試験/SC{ID}-{概要}.md

```markdown
# SC001 - ログイン

## 目的

認証機能の基本動作を確認する。

## 前提条件

- テストユーザーが登録済みであること
- テスト環境にアクセス可能であること

## 確認観点

| No | 観点 | 期待結果 |
|---|---|---|
| 1 | 正しいID/PWでログイン | TOP画面に遷移する |
| 2 | 誤ったPWでログイン | エラーメッセージが表示される |
| 3 | ログアウト | ログイン画面に戻る |

## 関連画面

- ログイン画面
- TOP画面
```

### test/core/SC{ID}-{概要}/README.md

```markdown
# SC001 - ログイン

## 試験観点

[spec/テスト/結合試験/SC001-ログイン.md](../../../spec/テスト/結合試験/SC001-ログイン.md)

## 実装メモ

- ログイン処理は `system/utils/login.js` を使用
- セレクタは data-testid を優先

## 変更履歴

| 日付 | 担当 | 内容 |
|---|---|---|
| 2024-XX-XX | yamada | 初版作成 |
```

### test/core/README.md

```markdown
# 王道シナリオ（Core E2E Tests）

## 概要

プロダクトの基本動作を確認するE2Eテスト集。
リリース前に必ず全件パスすることを確認する。

## 実装状況

| ID | 名称 | 試験観点 | 状態 |
|---|---|---|---|
| SC001 | ログイン | [観点](../../spec/テスト/結合試験/SC001-ログイン.md) | 有効 |
| SC002 | 基本見積フロー | [観点](../../spec/テスト/結合試験/SC002-基本見積フロー.md) | 有効 |
| SC003 | プラン変更 | [観点](../../spec/テスト/結合試験/SC003-プラン変更.md) | 有効 |

## テスト実行

```bash
# 全シナリオ
npx playwright test test/core/

# 特定シナリオ
npx playwright test test/core/SC001-ログイン/
```
```
