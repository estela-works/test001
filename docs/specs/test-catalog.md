# テストカタログ

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. 概要

本プロジェクトのテストは、バックエンド（JUnit 5）、フロントエンド（Vitest）、E2E（Playwright）の3層で構成されています。

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2025-12-26 |

---

## 2. テストケース統計

### 2.1 全体サマリー

| テスト種別 | テストケース数 | ファイル数 |
|------------|----------------|------------|
| バックエンドテスト | 151 | 8 |
| フロントエンドテスト（Vitest） | - | 10 |
| E2Eテスト（Playwright） | 32 | 4 |
| **合計** | **183+** | **22** |

### 2.2 カテゴリ別内訳

| カテゴリ | バックエンド | E2E | 合計 |
|----------|--------------|-----|------|
| Todo関連 | 88 | 13 | 101 |
| User関連 | 30 | 10 | 40 |
| Project関連 | 33 | 9 | 42 |

---

## 3. 詳細カタログ

### 3.1 バックエンドテストカタログ

詳細は [test/backend-test-catalog.md](test/backend-test-catalog.md) を参照。

| 対象クラス | 正常系 | 異常系 | 境界値 | 合計 |
|-----------|--------|--------|--------|------|
| TodoMapper | 13 | 1 | 1 | 15 |
| TodoService | 29 | 3 | 11 | 43 |
| TodoController | 25 | 5 | 0 | 30 |
| UserMapper | 7 | 1 | 1 | 9 |
| UserService | 5 | 2 | 0 | 7 |
| UserController | 8 | 6 | 0 | 14 |
| ProjectService | 11 | 2 | 5 | 18 |
| ProjectController | 11 | 4 | 0 | 15 |
| **合計** | **109** | **24** | **18** | **151** |

### 3.2 E2E（Playwright）テストカタログ

詳細は [test/e2e-test-catalog.md](test/e2e-test-catalog.md) を参照。

| 画面 | 画面表示 | CRUD | バリデーション | 遷移 | 合計 |
|------|----------|------|----------------|------|------|
| ToDo管理画面 | 1 | 6 | 2 | 4 | 13 |
| 案件一覧画面 | 1 | 5 | 1 | 3 | 10 |
| ユーザー管理画面 | 1 | 4 | 3 | 2 | 10 |
| **合計** | **3** | **15** | **6** | **9** | **33** |

---

## 4. テストファイル一覧

### 4.1 バックエンドテスト

| ファイル | テスト対象 | 概要 |
|----------|------------|------|
| TodoMapperTest.java | TodoMapper | Mapper層の単体テスト |
| TodoServiceTest.java | TodoService | Service層の統合テスト |
| TodoControllerTest.java | TodoController | REST APIテスト |
| UserMapperTest.java | UserMapper | Mapper層の単体テスト |
| UserServiceTest.java | UserService | Service層の統合テスト |
| UserControllerTest.java | UserController | REST APIテスト |
| ProjectServiceTest.java | ProjectService | Service層の統合テスト |
| ProjectControllerTest.java | ProjectController | REST APIテスト |

### 4.2 フロントエンドテスト（Vitest）

| ファイル | テスト対象 | 概要 |
|----------|------------|------|
| ErrorMessage.spec.ts | ErrorMessage | エラーメッセージコンポーネント |
| TodoStats.spec.ts | TodoStats | 統計表示コンポーネント |
| TodoFilter.spec.ts | TodoFilter | フィルターコンポーネント |
| TodoSearchForm.spec.ts | TodoSearchForm | 検索フォームコンポーネント |
| TodoTableRow.spec.ts | TodoTableRow | テーブル行コンポーネント |
| UserCard.spec.ts | UserCard | ユーザーカードコンポーネント |
| todoStore.spec.ts | todoStore | Todoストア |
| projectStore.spec.ts | projectStore | Projectストア |
| userStore.spec.ts | userStore | Userストア |
| filter.spec.ts | filter.ts | フィルター型定義・関数 |

### 4.3 E2Eテスト（Playwright）

| ファイル | テスト対象 | 概要 |
|----------|------------|------|
| home.spec.ts | ホーム画面 | 画面表示、ナビゲーション |
| todos-crud.spec.ts | ToDo管理画面 | 画面表示、CRUD、フィルタ |
| projects-crud.spec.ts | 案件一覧画面 | 画面表示、CRUD、進捗表示 |
| users-crud.spec.ts | ユーザー管理画面 | 画面表示、CRUD、バリデーション |

---

## 5. テスト実行方法

### 5.1 バックエンドテスト

```bash
# 全テスト実行
./mvnw test

# 特定クラスのテスト実行
./mvnw test -Dtest=TodoServiceTest

# 特定メソッドのテスト実行
./mvnw test -Dtest=TodoServiceTest#getAllTodos*
```

### 5.2 フロントエンドテスト

```bash
# frontendディレクトリに移動
cd src/frontend

# 全テスト実行
npm test

# ウォッチモードで実行
npm run test:watch

# カバレッジ付きで実行
npm run test:coverage
```

### 5.3 E2Eテスト

```bash
# e2eディレクトリに移動
cd src/test/e2e

# 全テスト実行
npx playwright test

# UIモードで実行
npx playwright test --ui

# 特定ファイルのテスト実行
npx playwright test specs/todos/todos-crud.spec.ts
```

---

## 6. テスト設定

### 6.1 バックエンドテスト設定

| 設定 | 内容 |
|------|------|
| テストプロファイル | application-test.properties |
| DB | H2インメモリDB |
| トランザクション | テスト後自動ロールバック |

### 6.2 フロントエンドテスト設定

| 設定 | 内容 |
|------|------|
| 設定ファイル | vitest.config.ts |
| テストフレームワーク | Vitest |
| DOM環境 | jsdom |
| コンポーネントテスト | @vue/test-utils |

### 6.3 E2Eテスト設定

| 設定 | 内容 |
|------|------|
| 設定ファイル | playwright.config.ts |
| ベースURL | http://localhost:8080 |
| ブラウザ | Chromium, Firefox, WebKit |

---

## 7. 関連ドキュメント

| ドキュメント | 説明 |
|--------------|------|
| [test/backend-test-catalog.md](test/backend-test-catalog.md) | バックエンドテスト詳細 |
| [test/e2e-test-catalog.md](test/e2e-test-catalog.md) | E2Eテスト詳細 |
| [api-catalog.md](api-catalog.md) | API仕様 |
| [screens/README.md](screens/README.md) | 画面仕様 |

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-23 | testフォルダを作成し、バックエンド/E2Eに分離して再整理 |
| 2025-12-22 | User関連テスト追加、担当者関連テスト追加（計163ケース） |
| 2025-12-22 | Mapper・Controllerテスト追加（計68ケース） |
| 2025-12-22 | 初版作成（TodoService: 38ケース） |
| 2025-12-26 | フロントエンドテスト（Vitest）追加、E2Eホーム画面テスト追加 |
