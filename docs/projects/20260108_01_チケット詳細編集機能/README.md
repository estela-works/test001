# チケット詳細編集機能

チケット詳細モーダルでチケット情報を編集できるようにする機能の実装案件。

## 概要

現在、チケット詳細モーダルでは情報の表示のみで編集ができない。本案件では、タイトル、説明、開始日、期限日、担当者を編集できる機能を追加する。

## ドキュメント一覧

### 要件定義

| ドキュメント | 説明 |
|-------------|------|
| [requirements.md](requirements.md) | 要件整理書 |

### 基本設計

| ドキュメント | 説明 |
|-------------|------|
| [basic-design-frontend.md](basic-design-frontend.md) | フロントエンド基本設計書 |
| [basic-design-backend.md](basic-design-backend.md) | バックエンド基本設計書（変更なし） |

### 詳細設計

| ドキュメント | 説明 |
|-------------|------|
| [detail-design-frontend.md](detail-design-frontend.md) | フロントエンド詳細設計書 |
| [detail-design-store.md](detail-design-store.md) | ストア詳細設計書 |
| [detail-design-types.md](detail-design-types.md) | 型定義詳細設計書 |

### テスト仕様

| ドキュメント | 説明 |
|-------------|------|
| [test-spec-frontend.md](test-spec-frontend.md) | フロントエンドテスト仕様書 |

### テスト報告

| ドキュメント | 説明 |
|-------------|------|
| [test-implementation-report.md](test-implementation-report.md) | テスト実装報告書 |

### 完了報告

| ドキュメント | 説明 |
|-------------|------|
| [completion-report.md](completion-report.md) | 案件完了報告書 |

## 主要機能

- 編集モード切替（表示モード⇔編集モード）
- タイトル編集
- 説明編集
- 開始日・期限日編集
- 担当者変更
- 保存・キャンセル処理

## 技術的なポイント

- **バックエンド変更なし**: 既存の `PUT /api/todos/{id}` APIを利用
- **新規コンポーネント**: `TodoEditForm.vue` を追加
- **既存コンポーネント改修**: `TodoDetailModal.vue` に編集モード切替機能を追加
- **サービス拡張**: `todoService.ts` に `update` 関数を追加
- **ストア拡張**: `useTodoStore` に `updateTodo` アクションを追加

## 実装対象ファイル

| ファイル | 変更種別 |
|---------|---------|
| `src/frontend/src/components/todo/TodoDetailModal.vue` | 改修 |
| `src/frontend/src/components/todo/TodoEditForm.vue` | 新規 |
| `src/frontend/src/stores/todoStore.ts` | 改修 |
| `src/frontend/src/services/todoService.ts` | 改修 |
| `src/frontend/src/services/apiClient.ts` | 確認/改修 |

## ステータス

- **開始日**: 2026-01-08
- **完了日**: 2026-01-08
- **状態**: **完了**

## テスト結果サマリ

| テスト種別 | テスト数 | 成功 | 失敗 |
|-----------|---------|------|------|
| 単体テスト（Vitest） | 43 | 43 | 0 |
| E2Eテスト（Playwright） | 8 | 8 | 0 |
| **合計** | **51** | **51** | **0** |
