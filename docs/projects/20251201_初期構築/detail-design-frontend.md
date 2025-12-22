# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoアプリケーション初期構築 |
| 案件ID | 202512_初期構築 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

フロントエンドの実装仕様（コンポーネント、状態管理、イベント処理）を定義する。

### 1.2 技術スタック

| 項目 | 採用 | 理由 |
|------|------|------|
| マークアップ | HTML5 | 標準技術 |
| スタイル | インラインCSS | ファイル分割不要でシンプル |
| ロジック | Vanilla JavaScript | フレームワーク不要でシンプル |
| API通信 | Fetch API | ブラウザ標準、非同期対応 |

---

## 2. ファイル構成

```
src/main/resources/static/
└── todos.html          # ToDoリスト画面（HTML/CSS/JS一体型）
```

---

## 3. 状態管理

### 3.1 グローバル変数

| 変数名 | 型 | 説明 |
|--------|-----|------|
| todos | Array | ToDoデータの配列 |
| currentFilter | String | 現在のフィルタ状態（'all', 'pending', 'completed'） |

---

## 4. JavaScript関数

### 4.1 関数一覧

| 関数名 | 概要 | 戻り値 |
|--------|------|--------|
| loadTodos() | ToDo一覧を取得して表示 | void |
| loadStats() | 統計情報を取得して表示 | void |
| addTodo() | 新規ToDoを追加 | void |
| toggleTodo(id) | 完了状態を切り替え | void |
| deleteTodo(id) | ToDoを削除 | void |
| filterTodos(filter) | フィルタを適用 | void |
| renderTodos() | ToDoリストを描画 | void |
| showError(message) | エラーメッセージを表示 | void |

### 4.2 関数詳細

#### loadTodos()

| 項目 | 内容 |
|------|------|
| 概要 | APIからToDo一覧を取得し、画面に表示する |
| API | GET /api/todos または GET /api/todos?completed={bool} |
| 処理フロー | 1. currentFilterに応じてAPIを呼び出し<br>2. レスポンスをtodos変数に格納<br>3. renderTodos()を呼び出し |

#### addTodo()

| 項目 | 内容 |
|------|------|
| 概要 | フォームの入力値でToDoを新規作成 |
| API | POST /api/todos |
| 処理フロー | 1. タイトル入力値を取得<br>2. 空の場合はエラー表示<br>3. APIを呼び出し<br>4. 成功時はフォームクリア、リスト再読込、統計更新 |

#### toggleTodo(id)

| 項目 | 内容 |
|------|------|
| 概要 | 指定IDのToDoの完了状態を切り替え |
| API | PATCH /api/todos/{id}/toggle |
| 処理フロー | 1. APIを呼び出し<br>2. 成功時はリスト再読込、統計更新 |

#### deleteTodo(id)

| 項目 | 内容 |
|------|------|
| 概要 | 指定IDのToDoを削除 |
| API | DELETE /api/todos/{id} |
| 処理フロー | 1. 確認ダイアログを表示<br>2. OKの場合APIを呼び出し<br>3. 成功時はリスト再読込、統計更新 |

---

## 5. イベントハンドリング

### 5.1 イベント一覧

| 要素 | イベント | 処理 |
|------|---------|------|
| 追加ボタン | click | addTodo() |
| タイトル入力 | keypress (Enter) | addTodo() |
| フィルタボタン | click | filterTodos(filter) |
| 完了ボタン | click | toggleTodo(id) |
| 削除ボタン | click | deleteTodo(id) |

### 5.2 初期化処理

| タイミング | 処理 |
|-----------|------|
| DOMContentLoaded | loadTodos(), loadStats() |

---

## 6. API連携

### 6.1 共通設定

```javascript
const API_BASE = '/api/todos';
const headers = { 'Content-Type': 'application/json' };
```

### 6.2 エラーハンドリング

| 状況 | 表示メッセージ |
|------|---------------|
| ネットワークエラー | 「ネットワークエラーが発生しました」 |
| 作成失敗 | 「ToDoの作成に失敗しました」 |
| 削除失敗 | 「ToDoの削除に失敗しました」 |
| 入力不備 | 「タイトルを入力してください」 |

---

## 7. スタイル仕様

### 7.1 ToDoカードの状態別スタイル

| 状態 | スタイル |
|------|----------|
| 未完了 | 通常表示 |
| 完了 | background: #f5f5f5, text-decoration: line-through, opacity: 0.7 |

### 7.2 フィルタボタンの状態別スタイル

| 状態 | スタイル |
|------|----------|
| 非アクティブ | 通常表示 |
| アクティブ | background: primary color, color: white |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成（既存詳細設計書から分離） | - |
