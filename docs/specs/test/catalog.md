# テストカタログ

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## 1. 概要

本プロジェクトのテストは、バックエンド（JUnit 5）、フロントエンド（Vitest）、E2E（Playwright）の3層で構成されています。

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2026-01-08 |

---

## 2. テストケース統計

### 2.1 全体サマリー

| テスト種別 | テストケース数 | ファイル数 |
|------------|----------------|------------|
| バックエンドテスト | 175 | 10 |
| フロントエンドテスト（Vitest） | 92 | 10 |
| E2Eテスト（Playwright） | 39 | 4 |
| **合計** | **306** | **24** |

### 2.2 カテゴリ別内訳

| カテゴリ | バックエンド | フロントエンド | E2E | 合計 |
|----------|--------------|---------------|-----|------|
| Todo関連 | 88 | 43 | 13 | 144 |
| User関連 | 30 | 17 | 10 | 57 |
| Project関連 | 33 | 12 | 9 | 54 |
| Comment関連 | 17 | - | - | 17 |
| その他 | 7 | 20 | 7 | 34 |

---

## 3. 詳細カタログ

### 3.1 バックエンドテストカタログ

詳細は [backend/catalog/](backend/catalog/) を参照。

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
| TodoCommentController | 10 | 6 | 1 | 17 |
| FrontendRedirectController | 7 | 0 | 0 | 7 |
| **合計** | **126** | **30** | **19** | **175** |

### 3.2 フロントエンドテストカタログ

詳細は [frontend/catalog/](frontend/catalog/) を参照。

| カテゴリ | ファイル数 | テストケース数 |
|---------|-----------|---------------|
| ストアテスト | 3 | 41 |
| コンポーネントテスト | 6 | 34 |
| ユーティリティテスト | 1 | 17 |
| **合計** | **10** | **92** |

### 3.3 E2E（Playwright）テストカタログ

詳細は [e2e/catalog.md](e2e/catalog.md) を参照。

| 画面 | 画面表示 | CRUD | バリデーション | 遷移 | 合計 |
|------|----------|------|----------------|------|------|
| ホーム画面 | 3 | - | - | 4 | 7 |
| ToDo管理画面 | 1 | 6 | 2 | 4 | 13 |
| 案件一覧画面 | 1 | 5 | 1 | 3 | 10 |
| ユーザー管理画面 | 1 | 4 | 3 | 2 | 10 |
| **合計** | **6** | **15** | **6** | **13** | **39** |

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
| TodoCommentControllerTest.java | TodoCommentController | コメントAPIテスト |
| FrontendRedirectControllerTest.java | FrontendRedirectController | ルートパスリダイレクトテスト |

### 4.2 フロントエンドテスト（Vitest）

| ファイル | テスト対象 | 概要 |
|----------|------------|------|
| todoStore.spec.ts | todoStore | Todoストア |
| projectStore.spec.ts | projectStore | Projectストア |
| userStore.spec.ts | userStore | Userストア |
| TodoStats.spec.ts | TodoStats | 統計表示コンポーネント |
| TodoFilter.spec.ts | TodoFilter | フィルターコンポーネント |
| TodoSearchForm.spec.ts | TodoSearchForm | 検索フォームコンポーネント |
| TodoTableRow.spec.ts | TodoTableRow | テーブル行コンポーネント |
| UserCard.spec.ts | UserCard | ユーザーカードコンポーネント |
| ErrorMessage.spec.ts | ErrorMessage | エラーメッセージコンポーネント |
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

# 単発実行（CI向け）
npm run test:run
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
| [backend/catalog/](backend/catalog/) | バックエンドテスト詳細 |
| [frontend/catalog/](frontend/catalog/) | フロントエンドテスト詳細 |
| [e2e/catalog.md](e2e/catalog.md) | E2Eテスト詳細 |
| [../api/api-catalog.md](../api/api-catalog.md) | API仕様 |
| [../screens/README.md](../screens/README.md) | 画面仕様 |

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-01-08 | フロントエンドテストカタログ新規作成、バックエンド/E2E統計更新（合計306件） |
| 2025-12-26 | フロントエンドテスト（Vitest）追加、E2Eホーム画面テスト追加 |
| 2025-12-23 | testフォルダを作成し、バックエンド/E2Eに分離して再整理 |
| 2025-12-22 | User関連テスト追加、担当者関連テスト追加（計163ケース） |
| 2025-12-22 | Mapper・Controllerテスト追加（計68ケース） |
| 2025-12-22 | 初版作成（TodoService: 38ケース） |
