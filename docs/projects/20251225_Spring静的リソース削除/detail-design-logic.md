# ロジック詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Spring Boot静的リソース削除とVueフロントエンドへのリダイレクト実装 |
| 案件ID | 20251225_Spring静的リソース削除 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

FrontendRedirectControllerの実装詳細を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 | 種別 |
|---------|---------------|------|------|
| Controller | FrontendRedirectController | ルートパスへのアクセス時に案内ページを表示 | 新規 |

---

## 2. Controllerクラス設計

### 2.1 FrontendRedirectController（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.FrontendRedirectController` |
| 種別 | Controller |
| 責務 | Vue開発サーバーへの案内ページ(HTML)を返す |
| アノテーション | `@Controller` |
| 配置 | `src/backend/main/java/com/example/demo/FrontendRedirectController.java` |

#### クラス構造

```java
package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class FrontendRedirectController {

    @GetMapping(value = "/", produces = "text/html; charset=UTF-8")
    @ResponseBody
    public String showFrontendInfo() {
        // HTMLを返す
    }
}
```

#### フィールド

なし(状態を持たないStatelessなController)

---

## 3. メソッド詳細

### 3.1 showFrontendInfo()

| 項目 | 内容 |
|------|------|
| シグネチャ | `public String showFrontendInfo()` |
| アノテーション | `@GetMapping(value = "/", produces = "text/html; charset=UTF-8")`, `@ResponseBody` |
| 概要 | Vue開発サーバーへの案内ページ(HTML)を文字列として返す |
| 引数 | なし |
| 戻り値 | String - HTML文字列 |
| HTTPステータス | 200 OK(常に成功) |

#### 処理フロー

1. HTMLテンプレート文字列を生成
2. 文字列をそのまま返す(Spring BootがContent-Type: text/html; charset=UTF-8で返却)

#### 実装内容

**HTML構造**:

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spring Boot - API Server</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #6db33f;
        }
        .info {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #42b883;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        a:hover {
            background-color: #35a372;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <h1>Spring Boot API Server</h1>
    <div class="info">
        <p>このサーバーはREST APIのみを提供しています。</p>
        <p><strong>フロントエンドアプリケーションは別サーバーで動作しています。</strong></p>
    </div>
    <a href="http://localhost:5173" target="_blank">Vueフロントエンドを開く (localhost:5173)</a>
    <p style="margin-top: 40px; color: #666;">
        API Endpoint: <code>/api/*</code>
    </p>
</body>
</html>
```

#### Javaコード実装方針

**方法1: テキストブロック(Java 15+)を使用(推奨)**

```java
@GetMapping(value = "/", produces = "text/html; charset=UTF-8")
@ResponseBody
public String showFrontendInfo() {
    return """
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Spring Boot - API Server</title>
            <style>
                /* CSS省略 */
            </style>
        </head>
        <body>
            <!-- HTML省略 -->
        </body>
        </html>
        """;
}
```

**メリット**:
- 可読性が高い
- エスケープ不要
- メンテナンスが容易

---

## 4. ビジネスルール

### 4.1 ルール一覧

| ルールID | ルール内容 | 適用箇所 |
|---------|-----------|---------|
| BR-001 | ルートパス(`/`)へのGETリクエストは常に200 OKを返す | FrontendRedirectController.showFrontendInfo() |
| BR-002 | エラーハンドリングは不要(静的HTMLを返すのみ) | FrontendRedirectController.showFrontendInfo() |
| BR-003 | Content-Typeは`text/html; charset=UTF-8`を明示 | @GetMapping produces属性 |

---

## 5. アノテーション詳細

### 5.1 @Controller vs @RestController

| 項目 | @Controller | @RestController |
|------|------------|----------------|
| 使用箇所 | FrontendRedirectController | その他すべてのController |
| 戻り値 | View名 or @ResponseBodyでHTML文字列 | 自動的にJSON変換 |
| 理由 | HTMLを返すため | JSON APIを返すため |

**本案件での選択理由**:
- HTMLを返す必要があるため `@Controller` + `@ResponseBody` を使用
- `@RestController` は自動的にJSONにシリアライズするため不適切

---

## 6. スレッドセーフティ

| 対策 | 説明 |
|------|------|
| 不要 | 状態を持たない(フィールドなし)ため、スレッドセーフ |

---

## 7. 既存コードへの影響

### 7.1 変更が必要なクラス

なし

### 7.2 削除が必要なファイル

| ファイルパス | 削除理由 |
|-------------|---------|
| `src/backend/main/resources/static/index.html` | Vueビルド成果物(不要) |
| `src/backend/main/resources/static/vite.svg` | Vueビルド成果物(不要) |
| `src/backend/main/resources/static/assets/` | Vueビルド成果物(不要) |

---

## 8. テスト観点

### 8.1 単体テスト

| テストケース | 期待結果 |
|-------------|---------|
| GET / へのリクエスト | 200 OK + HTML文字列を返す |
| HTML文字列にVue Dev ServerのURL(localhost:5173)が含まれる | 含まれる |
| Content-Typeが`text/html; charset=UTF-8`である | 正しく設定される |

### 8.2 結合テスト

| テストケース | 期待結果 |
|-------------|---------|
| Spring Boot起動後、ブラウザでlocalhost:8080/にアクセス | 案内ページが表示される |
| 案内ページのリンクをクリック | Vue Dev Server(localhost:5173)が開く |
| 既存API(GET /api/todos など)が正常動作 | 200 OK + JSONレスポンス |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | Claude |
