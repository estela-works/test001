# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | インデックスページ改善 |
| 案件ID | 20251224_インデックスページ改善 |
| 作成日 | 2025-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

ホーム画面（SC-001）のHTML/CSS実装詳細を定義する。

### 1.2 対象コンポーネント

| コンポーネント/ファイル | 種別 | 責務 |
|----------------------|------|------|
| index.html | HTML/CSS | ホーム画面の表示、ナビゲーション提供 |

---

## 2. ファイル構成

### 2.1 ファイル一覧

| ファイル | パス | 役割 |
|---------|------|------|
| index.html | src/main/resources/static/index.html | ホーム画面（静的HTML） |

### 2.2 変更ファイル

| ファイル | パス | 変更内容 |
|---------|------|----------|
| HelloController.java | src/main/java/com/example/demo/HelloController.java | `@GetMapping("/")`削除 |

---

## 3. 画面詳細設計

### 3.1 SC-001: ホーム画面

#### DOM構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ホーム - Spring Boot App</title>
    <style>
        /* インラインCSS */
    </style>
</head>
<body>
    <div class="container">
        <!-- ヘッダー -->
        <header class="header">
            <h1>Spring Boot App</h1>
            <p class="subtitle">タスク管理アプリケーション</p>
        </header>

        <!-- ナビゲーションカード -->
        <nav class="nav-cards">
            <a href="/todos.html" class="nav-card card-todo">
                <div class="card-icon">...</div>
                <div class="card-content">...</div>
                <div class="card-action">...</div>
            </a>
            <!-- 他のカード -->
        </nav>

        <!-- フッター -->
        <footer class="footer">
            <p>&copy; 2024 Spring Boot Demo App</p>
        </footer>
    </div>
</body>
</html>
```

#### 状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| - | - | - | 静的ページのため状態管理なし |

#### イベント処理

| イベント | 要素 | 処理内容 |
|---------|------|----------|
| click | .nav-card | aタグのhref属性による画面遷移（ブラウザ標準動作） |
| hover | .nav-card | CSSによるスタイル変更（:hover擬似クラス） |

---

## 4. JavaScript関数設計

本画面は静的HTMLのため、JavaScript関数は使用しない。

---

## 5. API連携

### 5.1 API呼び出し一覧

| 操作 | API | メソッド | 呼び出し元 |
|------|-----|---------|-----------|
| - | - | - | API呼び出しなし（静的ページ） |

### 5.2 エラーハンドリング

静的ページのためエラーハンドリングは不要。

---

## 6. スタイル設計

### 6.1 主要クラス

| クラス名 | 用途 |
|---------|------|
| .container | メインコンテナ（中央寄せ、白背景） |
| .header | ヘッダー領域（タイトル、サブタイトル） |
| .nav-cards | ナビゲーションカードコンテナ |
| .nav-card | ナビゲーションカード（リンク） |
| .card-todo | チケット管理カード用テーマ |
| .card-project | 案件管理カード用テーマ |
| .card-user | ユーザー管理カード用テーマ |
| .card-icon | カードアイコン領域 |
| .card-content | カードコンテンツ領域 |
| .card-action | カードアクション領域 |
| .footer | フッター領域 |

### 6.2 状態別スタイル

| 状態 | 適用スタイル |
|------|-------------|
| 通常 | border: 1px solid #ddd, background: #fff |
| ホバー | box-shadow: 0 4px 12px rgba(0,0,0,0.15), transform: translateX(5px), border-left: 4px solid [テーマカラー] |

### 6.3 CSS詳細

#### 基本スタイル

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

#### ヘッダースタイル

```css
.header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.header h1 {
    color: #333;
    font-size: 28px;
    margin-bottom: 10px;
}

.header .subtitle {
    color: #666;
    font-size: 16px;
}
```

#### ナビゲーションカードスタイル

```css
.nav-cards {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.nav-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
}

.nav-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(5px);
}

/* カード別テーマカラー */
.nav-card.card-todo:hover {
    border-left: 4px solid #17a2b8;
}

.nav-card.card-project:hover {
    border-left: 4px solid #28a745;
}

.nav-card.card-user:hover {
    border-left: 4px solid #fd7e14;
}
```

#### カードアイコンスタイル

```css
.card-icon {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-right: 20px;
    font-size: 24px;
}

.card-todo .card-icon {
    background-color: #e8f4f8;
}

.card-project .card-icon {
    background-color: #e8f5e9;
}

.card-user .card-icon {
    background-color: #fff3e0;
}
```

#### カードコンテンツスタイル

```css
.card-content {
    flex-grow: 1;
}

.card-content h3 {
    color: #333;
    font-size: 18px;
    margin-bottom: 8px;
}

.card-content p {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
}
```

#### カードアクションスタイル

```css
.card-action {
    flex-shrink: 0;
    margin-left: 20px;
}

.action-text {
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
}

.card-todo .action-text {
    color: #17a2b8;
}

.card-project .action-text {
    color: #28a745;
}

.card-user .action-text {
    color: #fd7e14;
}
```

#### フッタースタイル

```css
.footer {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    color: #999;
    font-size: 14px;
}
```

---

## 7. バリデーション

### 7.1 入力チェック

| 項目 | ルール | エラー表示 |
|------|--------|-----------|
| - | - | 入力フォームなし（静的ナビゲーションのみ） |

---

## 8. アイコン設計

### 8.1 使用アイコン

| カード | 表示 | 実装方法 |
|--------|------|----------|
| チケット管理 | クリップボード絵文字 | Unicode直接記述 |
| 案件管理 | フォルダ絵文字 | Unicode直接記述 |
| ユーザー管理 | 複数人絵文字 | Unicode直接記述 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-24 | 初版作成 | - |
