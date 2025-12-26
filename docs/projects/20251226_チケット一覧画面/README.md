# 20251226_チケット一覧画面

## 案件概要

| 項目 | 内容 |
|------|------|
| 案件ID | 20251226_チケット一覧画面 |
| 状態 | 完了 |
| 開始日 | 2025-12-26 |
| 完了日 | 2025-12-26 |

現在のチケット管理画面（SC-002: ToDoリスト画面）はカード形式で一覧性が低い。
テーブル形式のチケット一覧画面を新設し、検索・フィルタリング機能を提供する。

## ドキュメント一覧

| ドキュメント | 説明 | 状態 |
|-------------|------|------|
| [requirements.md](requirements.md) | 要件整理書 | 完了 |
| [basic-design-frontend.md](basic-design-frontend.md) | フロントエンド基本設計書 | 完了 |
| [basic-design-backend.md](basic-design-backend.md) | バックエンド基本設計書（変更なし） | 完了 |
| [detail-design-frontend.md](detail-design-frontend.md) | フロントエンド詳細設計書 | 完了 |
| [detail-design-types.md](detail-design-types.md) | 型定義詳細設計書 | 完了 |
| [detail-design-store.md](detail-design-store.md) | ストア詳細設計書（変更なし） | 完了 |
| [detail-design-api.md](detail-design-api.md) | API詳細設計書（変更なし） | 完了 |
| [detail-design-sql.md](detail-design-sql.md) | SQL詳細設計書（変更なし） | 完了 |
| [detail-design-db.md](detail-design-db.md) | DB詳細設計書（変更なし） | 完了 |
| [detail-design-logic.md](detail-design-logic.md) | ロジック詳細設計書（変更なし） | 完了 |

## 主な機能

1. **テーブル形式表示** - チケットを行列形式で一覧表示
2. **検索機能** - タイトル・説明をキーワード検索
3. **フィルタ機能** - 完了状態、担当者、案件、期間でフィルタリング
4. **ソート機能** - 各列ヘッダーでソート切替

## 関連ドキュメント

- [画面一覧](../../specs/screens/index.md)
- [既存ToDoリスト画面仕様](../../specs/screens/SC-002/screen.md)
