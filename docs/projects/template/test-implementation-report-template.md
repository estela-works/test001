# テスト実装報告書

## 1. 概要

| 項目 | 内容 |
|------|------|
| 案件名 | {{PROJECT_NAME}} |
| 実施日 | YYYY-MM-DD |
| 実施者 | Claude |
| ステータス | 完了 / 一部完了 / 中断 |

### 1.1 テスト実装範囲

本報告書は以下のテスト実装作業の結果をまとめたものである。

- 対象テスト方針書: test-spec-frontend.md, test-spec-backend.md
- テストガイド: docs/reference/best-practices/backend-testing-guide.md

---

## 2. 成果物一覧

### 2.1 バックエンドテスト

| # | ファイルパス | テスト種別 | テスト対象 |
|---|-------------|-----------|-----------|
| 1 | src/test/java/.../XXXMapperTest.java | Mapper | XXXMapper |
| 2 | src/test/java/.../XXXServiceTest.java | Service | XXXService |
| 3 | src/test/java/.../XXXControllerTest.java | Controller | XXXController |

### 2.2 フロントエンドテスト

| # | ファイルパス | テスト種別 | テスト対象 |
|---|-------------|-----------|-----------|
| 1 | src/frontend/src/stores/xxxStore.spec.ts | Store | xxxStore |
| 2 | src/frontend/src/components/xxx/XXX.spec.ts | Component | XXXコンポーネント |
| 3 | src/frontend/src/views/XXXView.spec.ts | View | XXXView |

### 2.3 E2Eテスト（該当する場合）

| # | ファイルパス | シナリオ | 説明 |
|---|-------------|---------|------|
| 1 | src/test/e2e/tests/xxx.spec.ts | XXX操作 | XXXの一連操作テスト |

---

## 3. テストケース詳細

### 3.1 バックエンドテスト

#### 3.1.1 Mapperテスト

```
ファイル: src/test/java/.../XXXMapperTest.java
```

| # | テストメソッド | 説明 | 結果 |
|---|--------------|------|------|
| 1 | findAll_ReturnsAllRecords | 全件取得 | PASS |
| 2 | findById_ExistingId_ReturnsRecord | ID指定取得 | PASS |
| 3 | insert_ValidEntity_ReturnsId | 新規登録 | PASS |
| 4 | update_ExistingRecord_UpdatesFields | 更新 | PASS |
| 5 | delete_ExistingId_RemovesRecord | 削除 | PASS |

#### 3.1.2 Serviceテスト

```
ファイル: src/test/java/.../XXXServiceTest.java
```

| # | テストメソッド | 説明 | 結果 |
|---|--------------|------|------|
| 1 | getAll_ReturnsListFromMapper | 一覧取得 | PASS |
| 2 | getById_ExistingId_ReturnsEntity | 単一取得 | PASS |
| 3 | getById_NonExistingId_ReturnsNull | 存在しないID | PASS |
| 4 | create_ValidInput_CallsMapperInsert | 新規作成 | PASS |
| 5 | update_ValidInput_CallsMapperUpdate | 更新 | PASS |
| 6 | delete_ValidId_CallsMapperDelete | 削除 | PASS |

#### 3.1.3 Controllerテスト

```
ファイル: src/test/java/.../XXXControllerTest.java
```

| # | テストメソッド | 説明 | 結果 |
|---|--------------|------|------|
| 1 | getAll_ReturnsOkWithList | GET /api/xxx | PASS |
| 2 | getById_ExistingId_ReturnsOk | GET /api/xxx/{id} | PASS |
| 3 | getById_NonExistingId_ReturnsNotFound | 404レスポンス | PASS |
| 4 | create_ValidBody_ReturnsCreated | POST /api/xxx | PASS |
| 5 | update_ValidBody_ReturnsOk | PUT /api/xxx/{id} | PASS |
| 6 | delete_ExistingId_ReturnsNoContent | DELETE /api/xxx/{id} | PASS |

### 3.2 フロントエンドテスト

#### 3.2.1 Storeテスト

```
ファイル: src/frontend/src/stores/xxxStore.spec.ts
```

| # | テスト名 | 説明 | 結果 |
|---|---------|------|------|
| 1 | 初期状態 | 初期値の確認 | PASS |
| 2 | fetchAll | 一覧取得アクション | PASS |
| 3 | create | 新規作成アクション | PASS |
| 4 | update | 更新アクション | PASS |
| 5 | delete | 削除アクション | PASS |

#### 3.2.2 Componentテスト

```
ファイル: src/frontend/src/components/xxx/XXX.spec.ts
```

| # | テスト名 | 説明 | 結果 |
|---|---------|------|------|
| 1 | レンダリング | 正常表示確認 | PASS |
| 2 | イベント発火 | クリックイベント | PASS |
| 3 | Props反映 | Props表示確認 | PASS |

### 3.3 E2Eテスト（該当する場合）

```
ファイル: src/test/e2e/tests/xxx.spec.ts
```

| # | シナリオ | ステップ | 結果 |
|---|---------|---------|------|
| 1 | XXX一覧表示 | ページ遷移→一覧確認 | PASS |
| 2 | XXX新規作成 | フォーム入力→保存→確認 | PASS |
| 3 | XXX編集 | 既存選択→編集→保存→確認 | PASS |
| 4 | XXX削除 | 既存選択→削除→確認 | PASS |

---

## 4. テスト実行結果

### 4.1 バックエンドテスト

```
コマンド: .\mvnw.cmd test
```

```
結果:
Tests run: XX, Failures: 0, Errors: 0, Skipped: 0
```

| 項目 | 件数 |
|------|------|
| 総テスト数 | XX |
| 成功 | XX |
| 失敗 | 0 |
| エラー | 0 |
| スキップ | 0 |

### 4.2 フロントエンドテスト

```
コマンド: npm test
```

```
結果:
Test Suites: X passed, X total
Tests:       XX passed, XX total
```

| 項目 | 件数 |
|------|------|
| 総テストスイート数 | X |
| 総テスト数 | XX |
| 成功 | XX |
| 失敗 | 0 |

### 4.3 E2Eテスト（該当する場合）

```
コマンド: npx playwright test
```

```
結果:
X passed
```

---

## 5. カバレッジ（計測した場合）

### 5.1 バックエンドカバレッジ

| パッケージ | クラス | 行 | 分岐 |
|-----------|--------|-----|------|
| XXX | XX% | XX% | XX% |

### 5.2 フロントエンドカバレッジ

| ファイル | ステートメント | 分岐 | 関数 | 行 |
|---------|--------------|------|------|-----|
| xxxStore.ts | XX% | XX% | XX% | XX% |

---

## 6. 課題・残件

### 6.1 発見した課題

| # | 課題 | 重要度 | 対応方針 |
|---|------|--------|---------|
| 1 | （例）境界値テストが不足 | 低 | 次回追加 |
| 2 | - | - | - |

### 6.2 未実装のテスト

| # | テスト内容 | 理由 | 対応予定 |
|---|-----------|------|---------|
| 1 | （例）異常系の網羅テスト | 設計書待ち | 次フェーズ |
| 2 | - | - | - |

### 6.3 テスト実装時の発見事項

- 実装コードで発見した問題
- 設計との不整合
- 改善提案

---

## 7. 備考

### 7.1 テスト方針からの変更点

| 項目 | テスト方針書の内容 | 実装での変更 | 変更理由 |
|------|------------------|-------------|---------|
| - | - | - | - |

### 7.2 特記事項

- テスト実装中に判明した特記事項
- テスト環境に関する注意点
- モック・スタブの使用方針

---

## 改版履歴

| 版数 | 日付 | 変更内容 |
|------|------|----------|
| 1.0 | YYYY-MM-DD | 初版作成 |
