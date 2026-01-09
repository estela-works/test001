# 20251225_Spring静的リソース削除

Spring Boot側の静的リソースを削除し、フロントエンドとバックエンドを完全分離する案件。

## 概要

Vue.js移行が完了した後も、Spring Boot側の`src/backend/main/resources/static/`にVueのビルド成果物が残っており、フロントエンドの実体がどこにあるか不明瞭だった。本案件では、Spring Bootをバックエンド(REST API)専用に明確化し、ルートパスアクセス時にVue開発サーバーへの案内ページを表示する。

## 主な変更内容

| 変更箇所 | 内容 |
|---------|------|
| 静的リソース削除 | `src/backend/main/resources/static/` を空にする |
| Controller追加 | `FrontendRedirectController` を新規作成 |
| ルートパス挙動 | `/` にアクセス時、Vue Dev Serverへの案内ページを表示 |
| 既存API | `/api/*` はすべて変更なし |
| フロントエンド | 一切変更なし |

## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [requirements.md](requirements.md) | 要件整理書 |
| [basic-design-backend.md](basic-design-backend.md) | バックエンド基本設計書 |
| [basic-design-frontend.md](basic-design-frontend.md) | フロントエンド基本設計書(変更なしを明記) |
| [detail-design-logic.md](detail-design-logic.md) | ロジック詳細設計書(FrontendRedirectController) |
| [detail-design-api.md](detail-design-api.md) | API詳細設計書(GET /) |
| [implementation-guide.md](implementation-guide.md) | 実装ガイド |

## 実装手順

詳細は[implementation-guide.md](implementation-guide.md)を参照。

### 簡易版

1. **静的リソース削除**
   ```powershell
   Remove-Item -Path "src\backend\main\resources\static\*" -Recurse -Force
   ```

2. **FrontendRedirectController作成**
   - `src/backend/main/java/com/example/demo/FrontendRedirectController.java` を作成
   - 実装コードは[implementation-guide.md](implementation-guide.md#32-実装コード)を参照

3. **動作確認**
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
   - ブラウザで http://localhost:8080/ にアクセス
   - 案内ページが表示されることを確認

4. **README更新**
   - プロジェクトルートの `README.md` を更新
   - アクセス方法をフロントエンド/バックエンドで明確化

## 状態

完了

### 実装結果

- ✅ 静的リソース削除完了
- ✅ FrontendRedirectController実装完了
- ✅ テスト実装完了 (7 tests passed)
- ✅ 動作確認完了 (Spring Boot起動、案内ページ表示、既存API動作確認)

## 関連案件

| 案件 | 関連 |
|------|------|
| [20241224_vue-migration](../20241224_vue-migration/) | Vue.js移行(前提案件) |

## 備考

- 本案件ではフロントエンドコードは一切変更しない
- Vue Dev Server(localhost:5173)とSpring Boot(localhost:8080)の明確な分離が目的
- 本番環境のビルド成果物配置方法は本案件のスコープ外(将来検討)
