# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## ドキュメント構成

本詳細設計書は以下のファイルに分割されています。

| ドキュメント | 内容 | 行数目安 |
|-------------|------|----------|
| [detail-design-frontend-modal.md](./detail-design-frontend-modal.md) | TodoDetailModalコンポーネント | 約200行 |
| [detail-design-frontend-comment-parts.md](./detail-design-frontend-comment-parts.md) | CommentList, CommentForm, CommentItem | 約330行 |
| [detail-design-frontend-integration.md](./detail-design-frontend-integration.md) | TodoView統合方法 | 約50行 |

---

## 1. 概要

### 1.1 本設計書の目的

チケット詳細モーダルとコメント機能のVueコンポーネント実装詳細を定義する。

### 1.2 対象コンポーネント

| コンポーネント | 種別 | 責務 |
|--------------|------|------|
| TodoDetailModal.vue | モーダル | チケット詳細とコメント機能の統合 |
| CommentList.vue | リスト | コメント一覧表示 |
| CommentForm.vue | フォーム | コメント投稿 |
| CommentItem.vue | アイテム | 個別コメント表示 |

---

## 2. ファイル構成

### 2.1 新規ファイル一覧

```
src/frontend/src/
├── components/
│   └── todo/
│       ├── TodoDetailModal.vue    # チケット詳細モーダル（新規）
│       ├── CommentList.vue        # コメント一覧（新規）
│       ├── CommentForm.vue        # コメント投稿フォーム（新規）
│       └── CommentItem.vue        # コメントアイテム（新規）
├── stores/
│   └── commentStore.ts            # コメントストア（新規）
└── types/
    └── comment.ts                 # コメント型定義（新規）
```

---

## 3. コンポーネント詳細設計

詳細は以下の分割ドキュメントを参照してください。

### 3.1 TodoDetailModal.vue

- [detail-design-frontend-modal.md](./detail-design-frontend-modal.md) を参照

**主要機能**:
- Teleport を使用したbodyへのポータル
- Escキーでの閉じる機能
- オーバーレイクリックでの閉じる機能
- チケット情報表示
- 完了状態切り替え
- コメントセクション統合

### 3.2 CommentList.vue

- [detail-design-frontend-comment-parts.md](./detail-design-frontend-comment-parts.md#32-commentlistvue) を参照

**主要機能**:
- ローディング状態表示
- エラー状態表示
- 空状態表示
- コメント一覧表示
- コメント削除確認ダイアログ

### 3.3 CommentForm.vue

- [detail-design-frontend-comment-parts.md](./detail-design-frontend-comment-parts.md#33-commentformvue) を参照

**主要機能**:
- コメント入力フォーム
- 文字数カウント表示
- 投稿者選択
- バリデーション
- 投稿中状態表示

### 3.4 CommentItem.vue

- [detail-design-frontend-comment-parts.md](./detail-design-frontend-comment-parts.md#34-commentitemvue) を参照

**主要機能**:
- コメント情報表示
- 相対時間表示
- 削除ボタン

---

## 4. TodoView.vueへの統合

- [detail-design-frontend-integration.md](./detail-design-frontend-integration.md) を参照

**統合ポイント**:
- ToDoアイテムクリックでモーダルを開く
- モーダル閉じる処理
- ToDo更新時のリスト再取得

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
| 1.1 | 2025-12-25 | ファイル分割（3ファイル構成に変更） | システム管理者 |
