# バックエンド基本設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Spring Boot静的リソース削除とVueフロントエンドへのリダイレクト実装 |
| 案件ID | 20251225_Spring静的リソース削除 |
| 作成日 | 2025-12-25 |
| 関連要件整理書 | [requirements.md](./requirements.md) |

---

## 1. 概要

### 1.1 本設計書の目的

Spring Boot側の静的リソース削除とルートパスアクセス時の案内ページ表示機能の基本設計を定義する。

### 1.2 バックエンドの役割

| 責務 | 説明 |
|------|------|
| REST API提供 | 既存API(/api/*)を引き続き提供(変更なし) |
| 静的リソース管理 | static/配下を削除し、フロントエンドと完全分離 |
| 案内ページ表示 | ルートパス(/)にアクセス時、Vue開発サーバーへのリンクを表示 |

---

## 2. 機能要件

### 2.1 機能一覧

| ID | 機能名 | 概要 | 対応US |
|----|--------|------|--------|
| F-001 | 静的リソース削除 | src/backend/main/resources/static/ を空にする | US-001 |
| F-002 | ルートパス案内ページ表示 | `/` にアクセス時、Vueフロントエンドへのリンクを表示 | US-002 |
| F-003 | REST API維持 | `/api/*` は既存通り動作 | US-003 |

---

## 3. データ要件

### 3.1 データ構造

| データ名 | 概要 | 永続化 |
|---------|------|--------|
| なし | 本案件でデータ要件の変更なし | - |

### 3.2 エンティティ

変更なし。既存エンティティ(Todo, Project, User, TodoComment)をそのまま維持。

---

## 4. API要件

### 4.1 エンドポイント一覧

#### 新規追加

| メソッド | パス | 機能 | 対応機能 |
|---------|------|------|----------|
| GET | / | Vue開発サーバーへの案内ページを表示 | F-002 |

#### 既存API(変更なし)

| メソッド | パス | 機能 | 備考 |
|---------|------|------|------|
| GET | /api/todos | Todo一覧取得 | 既存維持 |
| POST | /api/todos | Todo作成 | 既存維持 |
| GET | /api/projects | 案件一覧取得 | 既存維持 |
| GET | /api/users | ユーザー一覧取得 | 既存維持 |
| ... | ... | ... | その他すべてのAPI維持 |

詳細は[docs/specs/api-catalog.md](../../specs/api-catalog.md)参照。

### 4.2 新規エンドポイント詳細

#### GET /

**概要**: Vue開発サーバーへの案内ページを返す

**リクエスト**:
- メソッド: GET
- パス: /
- パラメータ: なし

**レスポンス**:

**成功時(200 OK)**:
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

**Content-Type**: text/html; charset=UTF-8

### 4.3 エラーレスポンス

ルートパスへのGETリクエストは常に200を返す。エラーレスポンスは発生しない。

---

## 5. 実装設計

### 5.1 新規実装クラス

#### FrontendRedirectController

**パッケージ**: com.example.demo

**責務**: ルートパス(/)へのアクセスに対してVue開発サーバーへの案内HTMLを返す

**実装方針**:
- `@Controller` アノテーションを使用(JSONではなくHTMLを返すため)
- `@GetMapping("/")` でルートパスをマッピング
- HTMLレスポンスは文字列として直接返す(`produces = "text/html; charset=UTF-8"`)
- `@ResponseBody` を使用してViewResolverをバイパス

**メソッド**:

| メソッド名 | 説明 | 戻り値 |
|-----------|------|--------|
| showFrontendInfo() | Vue開発サーバーへの案内ページを返す | String(HTML) |

### 5.2 既存クラスの変更

#### HelloController

**変更内容**: なし(既存のまま維持)

**理由**: 既に `/api/message` エンドポイントのみを提供しており、ルートパスのマッピングは削除済み(コメント: `// ルートパス("/")は static/index.html で配信されるため、マッピング削除`)

#### その他Controller

**変更内容**: なし

---

## 6. 静的リソース削除

### 6.1 削除対象

```
src/backend/main/resources/static/
├── index.html         # 削除
├── vite.svg           # 削除
└── assets/            # ディレクトリごと削除
    ├── index-DBKnUi_6.js
    └── index-XgpwuAj1.css
```

### 6.2 削除後の状態

```
src/backend/main/resources/static/
(空ディレクトリとして残す)
```

**理由**: staticディレクトリ自体は残すが中身は空にする。これによりSpring Bootの設定変更は不要。

---

## 7. 非機能要件

### 7.1 性能要件

| 項目 | 要件 |
|------|------|
| 案内ページ応答時間 | 100ms以内(HTML文字列を返すのみのため) |
| API応答時間 | 既存API性能を維持 |

### 7.2 セキュリティ要件

| 項目 | 対応 |
|------|------|
| XSS対策 | 静的HTMLのため動的要素なし、対策不要 |
| 入力バリデーション | ルートパスはパラメータを受け取らないため不要 |
| 既存API | 既存のセキュリティ設定を維持 |

---

## 8. 制約条件

| 項目 | 制約 |
|------|------|
| フレームワーク | Spring Boot 3.2(既存維持) |
| 既存API | 仕様変更なし |
| 静的リソース配信 | 完全に停止(Vue Dev Serverへ移譲) |

---

## 9. アーキテクチャ図

### 9.1 変更前

```
┌─────────────────────┐
│ Browser             │
└──────────┬──────────┘
           │
           ├─ http://localhost:8080/
           │  └→ static/index.html (Vueビルド成果物)
           │
           └─ http://localhost:8080/api/*
              └→ Spring Boot REST API
```

### 9.2 変更後

```
┌─────────────────────┐
│ Browser             │
└──────┬──────────────┘
       │
       ├─ http://localhost:8080/
       │  └→ FrontendRedirectController
       │     └→ 案内ページ(Vue Dev Serverへのリンク)
       │
       ├─ http://localhost:8080/api/*
       │  └→ Spring Boot REST API
       │
       └─ http://localhost:5173/
          └→ Vue Dev Server (npm run dev)
```

---

## 10. 関連ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| [requirements.md](./requirements.md) | 要件整理書 |
| [docs/specs/api-catalog.md](../../specs/api-catalog.md) | 既存API仕様 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | Claude |
