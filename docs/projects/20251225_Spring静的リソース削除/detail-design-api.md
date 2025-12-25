# API詳細設計書

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

ルートパス(`/`)へのアクセス時に案内ページを返すエンドポイントの詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 |
|---------|---------------|------|
| Controller | FrontendRedirectController | ルートパスのHTTPリクエスト処理 |

---

## 2. API共通仕様

### 2.1 ベースURL

| 項目 | 値 |
|------|-----|
| 開発環境 | `http://localhost:8080` |
| 本番環境 | (本案件では対象外) |

### 2.2 本エンドポイントの特殊性

| 項目 | 内容 |
|------|------|
| Content-Type | `text/html; charset=UTF-8` (JSON APIではない) |
| レスポンス形式 | HTML |
| エラーレスポンス | なし(常に200 OK) |

**注意**: 本エンドポイントは従来のREST API(`/api/*`)とは異なり、HTMLページを返す。

---

## 3. エンドポイント詳細

### 3.1 GET / - Vue開発サーバー案内ページ

| 項目 | 内容 |
|------|------|
| URL | `/` |
| メソッド | GET |
| 概要 | Vue開発サーバーへの案内ページ(HTML)を表示 |
| 対応機能 | F-002(ルートパス案内ページ表示) |

#### リクエスト

**パスパラメータ**: なし

**クエリパラメータ**: なし

**リクエストボディ**: なし

**リクエストヘッダー**: なし(特別な要求なし)

**リクエスト例**:

```http
GET / HTTP/1.1
Host: localhost:8080
```

#### レスポンス

**成功時 (200 OK)**:

**HTTPステータス**: 200 OK

**Content-Type**: `text/html; charset=UTF-8`

**レスポンスボディ**:

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

**HTML構造の説明**:

| 要素 | 説明 |
|------|------|
| `<h1>` | タイトル「Spring Boot API Server」 |
| `.info` | 説明ボックス(このサーバーはAPIのみ提供) |
| `<a>` | Vueフロントエンドへのリンク(localhost:5173) |
| `<code>` | APIエンドポイントの説明 |

**エラー時**: なし

本エンドポイントは静的HTMLを返すのみであり、エラー条件は存在しない。常に200 OKを返す。

#### 処理フロー

```
1. クライアントがGET / をリクエスト
2. FrontendRedirectController.showFrontendInfo() が呼ばれる
3. HTML文字列を生成
4. Content-Type: text/html; charset=UTF-8 でレスポンスを返す
5. クライアントがHTMLを受信・表示
```

---

## 4. Controllerクラス設計

### 4.1 クラス概要

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.FrontendRedirectController` |
| パッケージ | `com.example.demo` |
| アノテーション | `@Controller` |
| 配置パス | `src/backend/main/java/com/example/demo/FrontendRedirectController.java` |

**@Controllerを使用する理由**:
- `@RestController` は自動的にレスポンスをJSONにシリアライズする
- 本エンドポイントはHTMLを返す必要があるため、`@Controller` + `@ResponseBody` を使用

### 4.2 依存関係

なし(ServiceやRepositoryへの依存なし)

### 4.3 メソッド一覧

| メソッド | アノテーション | 概要 | 戻り値 |
|---------|---------------|------|--------|
| showFrontendInfo() | `@GetMapping(value = "/", produces = "text/html; charset=UTF-8")`, `@ResponseBody` | 案内ページHTML文字列を返す | String |

---

## 5. メソッド詳細設計

### 5.1 showFrontendInfo()

#### シグネチャ

```java
@GetMapping(value = "/", produces = "text/html; charset=UTF-8")
@ResponseBody
public String showFrontendInfo()
```

#### アノテーション詳細

| アノテーション | 属性 | 値 | 説明 |
|--------------|------|-----|------|
| @GetMapping | value | "/" | ルートパスへのGETリクエストをマッピング |
| @GetMapping | produces | "text/html; charset=UTF-8" | Content-Typeを明示的に指定 |
| @ResponseBody | - | - | 戻り値をHTTPレスポンスボディに直接書き込む |

#### 引数

なし

#### 戻り値

| 型 | 説明 |
|-----|------|
| String | HTML文字列 |

#### 例外

なし(例外をスローしない)

#### 実装方法

**Java 15以降のテキストブロックを使用**:

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
        """;
}
```

---

## 6. 既存APIへの影響

### 6.1 影響を受けないAPI

| API | 理由 |
|-----|------|
| `/api/todos` | パスが異なる |
| `/api/projects` | パスが異なる |
| `/api/users` | パスが異なる |
| `/api/message` | パスが異なる |

すべての既存REST API(`/api/*`)は影響を受けない。

### 6.2 競合の可能性

**ルートパス(`/`)のマッピング競合**:

| クラス | マッピング | 状態 |
|-------|-----------|------|
| HelloController | (削除済み) | 既にコメントアウト済みのため競合なし |
| FrontendRedirectController | `/` | 新規追加 |

**確認事項**: HelloControllerの13行目にコメント `// ルートパス("/")は static/index.html で配信されるため、マッピング削除` があり、既にルートパスのマッピングは削除済み。

---

## 7. テスト仕様

### 7.1 単体テスト

**テストクラス**: `FrontendRedirectControllerTest`

| テストケース | 検証内容 | 期待結果 |
|-------------|---------|---------|
| testShowFrontendInfo_returnsHtml | HTMLが返されること | 戻り値にHTML文字列が含まれる |
| testShowFrontendInfo_containsVueUrl | Vue Dev ServerのURL(localhost:5173)が含まれること | "localhost:5173"が含まれる |

### 7.2 結合テスト

| テストケース | リクエスト | 期待結果 |
|-------------|-----------|---------|
| GET_root_returns200 | GET / | 200 OK + HTML |
| GET_root_contentType | GET / | Content-Type: text/html; charset=UTF-8 |

### 7.3 手動テスト

| 手順 | 期待結果 |
|------|---------|
| 1. Spring Boot起動 | 正常起動 |
| 2. ブラウザでlocalhost:8080/にアクセス | 案内ページが表示される |
| 3. 「Vueフロントエンドを開く」リンクをクリック | 新しいタブでlocalhost:5173が開く |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | Claude |
