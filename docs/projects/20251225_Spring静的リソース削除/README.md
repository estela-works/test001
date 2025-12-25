# Spring静的リソース削除

Spring Bootの静的リソース提供機能を削除し、フロントエンドをVue.jsに完全移行する案件。

## 概要

従来のSpring BootのstaticフォルダからHTML提供する仕組みを削除し、Vue.jsベースのSPAに完全移行。

## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [requirements.md](requirements.md) | 要件整理書 |
| [basic-design-backend.md](basic-design-backend.md) | バックエンド基本設計 |

## 主要変更

- Spring Boot静的リソース配信機能の削除
- resources/staticフォルダの削除
- Vue.jsフロントエンドへの完全移行

## ステータス

- **開始日**: 2025-12-25
- **状態**: 進行中
