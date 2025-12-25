# 実装ガイド

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Spring Boot静的リソース削除とVueフロントエンドへのリダイレクト実装 |
| 案件ID | 20251225_Spring静的リソース削除 |
| 作成日 | 2025-12-25 |
| 関連設計書 | [basic-design-backend.md](./basic-design-backend.md), [detail-design-logic.md](./detail-design-logic.md), [detail-design-api.md](./detail-design-api.md) |

---

## 1. 実装手順概要

| ステップ | 作業 | 担当レイヤー |
|---------|------|-------------|
| 1 | 静的リソース削除 | ファイルシステム |
| 2 | FrontendRedirectController作成 | Controller |
| 3 | 動作確認 | 手動テスト |
| 4 | README更新 | ドキュメント |

---

## 2. ステップ1: 静的リソース削除

### 2.1 削除対象ファイル

```
src/backend/main/resources/static/
├── index.html         # 削除
├── vite.svg           # 削除
└── assets/            # ディレクトリごと削除
    ├── index-DBKnUi_6.js
    └── index-XgpwuAj1.css
```

### 2.2 削除コマンド

#### Windowsの場合

```powershell
# PowerShellで実行
Remove-Item -Path "src\backend\main\resources\static\*" -Recurse -Force
```

#### Mac/Linuxの場合

```bash
rm -rf src/backend/main/resources/static/*
```

### 2.3 削除後の確認

```powershell
# staticディレクトリが空であることを確認
Get-ChildItem -Path "src\backend\main\resources\static"
```

**期待結果**: 何も表示されない(空)

### 2.4 注意事項

- `static` ディレクトリ自体は削除しない(中身のみ削除)
- Gitで追跡されているファイルの場合、削除後にコミットが必要

---

## 3. ステップ2: FrontendRedirectController作成

### 3.1 ファイル作成

**ファイルパス**: `src/backend/main/java/com/example/demo/FrontendRedirectController.java`

### 3.2 実装コード

```java
package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * ルートパスへのアクセス時にVue開発サーバーへの案内ページを表示するController
 *
 * <p>このサーバーはバックエンドAPI専用であることを示し、
 * フロントエンドアプリケーション(Vue Dev Server)へのリンクを提供する。</p>
 *
 * @since 2025-12-25
 */
@Controller
public class FrontendRedirectController {

    /**
     * ルートパスへのアクセス時に案内ページ(HTML)を返す
     *
     * <p>Vue開発サーバー(http://localhost:5173)へのリンクを含む
     * シンプルなHTMLページを表示する。</p>
     *
     * @return HTML文字列
     */
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
}
```

### 3.3 コード解説

| 要素 | 説明 |
|------|------|
| `@Controller` | HTMLを返すController(JSON APIの`@RestController`ではない) |
| `@ResponseBody` | 戻り値をHTTPレスポンスボディに直接書き込む |
| `produces = "text/html; charset=UTF-8"` | Content-Typeを明示 |
| テキストブロック(`"""`) | Java 15+の文法、複数行文字列を簡潔に記述 |

---

## 4. ステップ3: 動作確認

### 4.1 ビルド確認

```bash
# Windows
.\mvnw.cmd clean compile

# Mac/Linux
./mvnw clean compile
```

**期待結果**: `BUILD SUCCESS`

### 4.2 アプリケーション起動

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

**期待結果**:
```
Started SimpleSpringApplication in X.XXX seconds
```

### 4.3 ブラウザ確認

#### テストケース1: ルートパスアクセス

1. ブラウザで `http://localhost:8080/` にアクセス
2. 案内ページが表示されることを確認
3. 以下の要素が含まれていることを確認:
   - タイトル: "Spring Boot API Server"
   - メッセージ: "このサーバーはREST APIのみを提供しています"
   - リンク: "Vueフロントエンドを開く (localhost:5173)"

#### テストケース2: リンク動作確認

1. 案内ページの「Vueフロントエンドを開く」リンクをクリック
2. 新しいタブで `http://localhost:5173` が開くことを確認

**注意**: Vue Dev Serverが起動していない場合、接続エラーになります。その場合は以下を実行:

```bash
cd src/frontend
npm run dev
```

#### テストケース3: 既存API動作確認

```bash
# GET /api/todos
curl http://localhost:8080/api/todos

# GET /api/message
curl http://localhost:8080/api/message
```

**期待結果**: 既存通りJSONレスポンスが返る

---

## 5. ステップ4: README更新

### 5.1 修正対象ファイル

`README.md` の「アクセス」セクション

### 5.2 修正内容

**修正前**:
```markdown
## アクセス

アプリケーション起動後、ブラウザで以下にアクセス:

| 画面 | URL |
|------|-----|
| ホーム | http://localhost:8080 |
| チケット管理 | http://localhost:8080/todos.html |
| 案件管理 | http://localhost:8080/projects.html |
| ユーザー管理 | http://localhost:8080/users.html |
```

**修正後**:
```markdown
## アクセス

### フロントエンド(Vue.js)

Vue開発サーバーを起動してアクセス:

```bash
cd src/frontend
npm run dev
```

| 画面 | URL |
|------|-----|
| ホーム | http://localhost:5173 |
| チケット管理 | http://localhost:5173/todos |
| 案件管理 | http://localhost:5173/projects |
| ユーザー管理 | http://localhost:5173/users |

### バックエンド(Spring Boot)

Spring Bootアプリを起動:

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

| エンドポイント | URL |
|--------------|-----|
| 案内ページ | http://localhost:8080 |
| REST API | http://localhost:8080/api/* |
```

---

## 6. Git操作

### 6.1 変更確認

```bash
git status
```

**期待される変更**:
- 削除: `src/backend/main/resources/static/index.html`
- 削除: `src/backend/main/resources/static/vite.svg`
- 削除: `src/backend/main/resources/static/assets/`
- 新規: `src/backend/main/java/com/example/demo/FrontendRedirectController.java`
- 変更: `README.md`

### 6.2 コミット

```bash
git add .
git commit -m "feat: Spring Boot静的リソース削除とVue案内ページ追加

- src/backend/main/resources/static/ を空にしてフロントエンドと完全分離
- FrontendRedirectController追加でルートパスにVue Dev Serverへの案内表示
- README更新してアクセス方法を明確化

🤖 Generated with Claude Code

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 7. 完了チェックリスト

### 7.1 実装

- [ ] `src/backend/main/resources/static/` が空になっている
- [ ] `FrontendRedirectController.java` が作成されている
- [ ] ビルドが成功する(`mvnw clean compile`)
- [ ] アプリケーションが起動する(`mvnw spring-boot:run`)

### 7.2 動作確認

- [ ] `http://localhost:8080/` で案内ページが表示される
- [ ] 案内ページにVue Dev ServerのURL(localhost:5173)が含まれる
- [ ] 既存API(`/api/todos`など)が正常に動作する
- [ ] Vue Dev Server(`npm run dev`)が正常に起動する

### 7.3 ドキュメント

- [ ] `README.md` が更新されている
- [ ] アクセス方法がフロントエンド/バックエンドで明確に分かれている

### 7.4 Git

- [ ] すべての変更がステージングされている
- [ ] コミットメッセージが適切に記載されている
- [ ] (必要に応じて)リモートリポジトリにプッシュされている

---

## 8. トラブルシューティング

### 8.1 ビルドエラー

**症状**: `mvnw clean compile` がエラーになる

**原因**: Java 17未満の環境でテキストブロックが使えない

**対策**: Java 17以上を使用しているか確認

```bash
java -version
```

### 8.2 ルートパスで404エラー

**症状**: `http://localhost:8080/` にアクセスすると404 Not Found

**原因**: FrontendRedirectControllerが読み込まれていない

**対策**:
1. クラスが正しいパッケージ(`com.example.demo`)に配置されているか確認
2. `@Controller` アノテーションが付いているか確認
3. アプリケーションを再起動

### 8.3 既存APIがJSONではなくHTMLを返す

**症状**: `/api/todos` などが案内ページのHTMLを返す

**原因**: `@GetMapping("/")` のマッピングが広すぎる設定になっている

**対策**:
- `value = "/"` を明示的に指定(実装コードは正しい)
- 既存Controllerとの競合がないか確認

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | Claude |
