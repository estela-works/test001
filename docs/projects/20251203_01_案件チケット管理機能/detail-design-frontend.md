# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 案件チケット管理機能 |
| 案件ID | 20251201_案件チケット管理機能 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

フロントエンドの画面実装詳細（DOM構造、状態管理、イベント処理、JavaScript関数）を定義する。

### 1.2 対象コンポーネント

| コンポーネント/ファイル | 種別 | 責務 |
|----------------------|------|------|
| projects.html | HTML | 案件一覧画面のマークアップ |
| projects.js | JS | 案件一覧画面のロジック |
| todos.html | HTML | ToDoリスト画面のマークアップ（改修） |
| todos.js | JS | ToDoリスト画面のロジック（改修） |
| index.html | HTML | ホーム画面（リンク追加） |

---

## 2. ファイル構成

### 2.1 ファイル一覧

| ファイル | パス | 役割 | 種別 |
|---------|------|------|------|
| projects.html | src/main/resources/static/projects.html | 案件一覧画面 | 新規 |
| projects.js | src/main/resources/static/js/projects.js | 案件一覧画面ロジック | 新規 |
| todos.html | src/main/resources/static/todos.html | ToDoリスト画面 | 変更 |
| index.html | src/main/resources/static/index.html | ホーム画面 | 変更 |

---

## 3. 画面詳細設計

### 3.1 SC-003: 案件一覧画面（新規）

#### 3.1.1 DOM構造

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>案件一覧 - Spring Boot App</title>
    <link rel="stylesheet" href="/css/common.css">
</head>
<body>
    <div class="container">
        <!-- ヘッダー -->
        <h1 id="page-title">案件一覧</h1>

        <!-- 案件追加フォーム -->
        <div class="add-form" id="add-project-form">
            <h3>新しい案件を作成</h3>
            <input type="text" id="project-name-input" placeholder="案件名を入力してください" required>
            <textarea id="project-description-input" rows="2" placeholder="説明を入力してください（オプション）"></textarea>
            <button id="add-project-btn">作成</button>
        </div>

        <!-- エラーメッセージ -->
        <div id="error-message" class="error" style="display: none;"></div>

        <!-- ローディング -->
        <div id="loading" class="loading">読み込み中...</div>

        <!-- 案件リスト -->
        <div id="project-list"></div>

        <!-- 案件なしカード（固定） -->
        <div id="no-project-card" class="project-card no-project">
            <h3>案件なし（未分類）</h3>
            <p class="stats">チケット: <span id="no-project-total">0</span>件 / 完了: <span id="no-project-completed">0</span>件</p>
            <div class="actions">
                <button class="view-btn" onclick="viewTodos('none')">チケット一覧</button>
            </div>
        </div>

        <!-- フッター -->
        <div class="back-link">
            <a href="/">← ホームに戻る</a>
        </div>
    </div>
    <script src="/js/projects.js"></script>
</body>
</html>
```

#### 3.1.2 状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| projects | Array | [] | 案件リストのキャッシュ |

#### 3.1.3 イベント処理

| イベント | 要素 | 処理内容 |
|---------|------|----------|
| DOMContentLoaded | window | loadProjects(), loadNoProjectStats() |
| click | #add-project-btn | createProject() |
| keypress(Enter) | #project-name-input | createProject() |
| click | .view-btn | viewTodos(projectId) |
| click | .delete-btn | deleteProject(projectId) |

---

### 3.2 SC-002: ToDoリスト画面（改修）

#### 3.2.1 DOM構造（変更部分）

```html
<!-- ヘッダー変更 -->
<h1 id="page-title">ToDoリスト</h1>
<p id="project-name" class="project-subtitle"></p>

<!-- 追加フォーム変更（日付入力追加） -->
<div class="add-todo">
    <h3>新しいToDoを追加</h3>
    <input type="text" id="title-input" placeholder="タイトルを入力してください" required>
    <textarea id="description-input" rows="3" placeholder="説明を入力してください（オプション）"></textarea>
    <div class="date-inputs">
        <div class="date-field">
            <label for="start-date-input">開始日:</label>
            <input type="date" id="start-date-input">
        </div>
        <div class="date-field">
            <label for="due-date-input">終了日:</label>
            <input type="date" id="due-date-input">
        </div>
    </div>
    <button onclick="addTodo()">追加</button>
</div>

<!-- ToDoカード変更（期間表示追加） -->
<div class="todo-item">
    <h3>タイトル</h3>
    <p>説明</p>
    <p class="date-range">期間: 2025/01/01 〜 2025/01/15</p>
    <p><small>作成日: 2025/01/01 12:00:00</small></p>
    <div class="actions">
        <button class="toggle-btn">完了にする</button>
        <button class="delete-btn">削除</button>
    </div>
</div>

<!-- フッター変更 -->
<div class="back-link">
    <a href="/projects.html">← 案件一覧に戻る</a>
</div>
```

#### 3.2.2 状態管理（追加）

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| todos | Array | [] | ToDoリストのキャッシュ（既存） |
| currentFilter | String | 'all' | 現在のフィルタ状態（既存） |
| currentProjectId | String/null | null | 現在表示中の案件ID（追加） |
| currentProjectName | String | '' | 現在表示中の案件名（追加） |

#### 3.2.3 イベント処理（追加・変更）

| イベント | 要素 | 処理内容 | 種別 |
|---------|------|----------|------|
| DOMContentLoaded | window | parseProjectId(), loadProjectInfo(), loadTodos() | 変更 |
| click | #add-todo-btn | addTodo()（日付データ含む） | 変更 |

---

## 4. JavaScript関数設計

### 4.1 案件一覧画面（projects.js）

#### 4.1.1 loadProjects()

| 項目 | 内容 |
|------|------|
| 関数名 | `loadProjects()` |
| 概要 | 案件一覧をAPIから取得して表示 |
| 引数 | なし |
| 戻り値 | なし（async/await） |

**処理フロー**:

1. ローディング表示を有効化
2. `GET /api/projects` を呼び出し
3. 各案件に対して `GET /api/projects/{id}/stats` を呼び出し
4. 案件カードをレンダリング
5. ローディング表示を無効化

#### 4.1.2 loadNoProjectStats()

| 項目 | 内容 |
|------|------|
| 関数名 | `loadNoProjectStats()` |
| 概要 | 案件なしチケットの統計を取得 |
| 引数 | なし |
| 戻り値 | なし（async/await） |

**処理フロー**:

1. `GET /api/todos?projectId=none` を呼び出し
2. 統計情報を計算（total, completed）
3. 「案件なし」カードの統計を更新

#### 4.1.3 createProject()

| 項目 | 内容 |
|------|------|
| 関数名 | `createProject()` |
| 概要 | 新しい案件を作成 |
| 引数 | なし |
| 戻り値 | なし（async/await） |

**処理フロー**:

1. 入力値を取得（name, description）
2. バリデーション（name必須チェック）
3. `POST /api/projects` を呼び出し
4. 成功時：フォームクリア、リスト再読込
5. 失敗時：エラーメッセージ表示

#### 4.1.4 deleteProject(id)

| 項目 | 内容 |
|------|------|
| 関数名 | `deleteProject(id)` |
| 概要 | 案件を削除（確認あり） |
| 引数 | id: Long - 案件ID |
| 戻り値 | なし（async/await） |

**処理フロー**:

1. 確認ダイアログを表示
2. キャンセル時：処理終了
3. `DELETE /api/projects/{id}` を呼び出し
4. 成功時：リスト再読込
5. 失敗時：エラーメッセージ表示

#### 4.1.5 viewTodos(projectId)

| 項目 | 内容 |
|------|------|
| 関数名 | `viewTodos(projectId)` |
| 概要 | 案件のチケット一覧画面へ遷移 |
| 引数 | projectId: Long/'none' - 案件ID |
| 戻り値 | なし |

**処理フロー**:

1. `/todos.html?projectId={projectId}` へ遷移

#### 4.1.6 renderProjectCard(project, stats)

| 項目 | 内容 |
|------|------|
| 関数名 | `renderProjectCard(project, stats)` |
| 概要 | 案件カードのHTMLを生成 |
| 引数 | project: Object, stats: Object |
| 戻り値 | String - HTML文字列 |

**出力HTML**:

```html
<div class="project-card">
    <h3>{project.name}</h3>
    <p>{project.description}</p>
    <p class="stats">チケット: {stats.total}件 / 完了: {stats.completed}件 / 進捗: {stats.progressRate}%</p>
    <div class="progress-bar">
        <div class="progress" style="width: {stats.progressRate}%"></div>
    </div>
    <div class="actions">
        <button class="view-btn" onclick="viewTodos({project.id})">チケット一覧</button>
        <button class="delete-btn" onclick="deleteProject({project.id})">削除</button>
    </div>
</div>
```

---

### 4.2 ToDoリスト画面（todos.js）変更

#### 4.2.1 parseProjectId()（新規）

| 項目 | 内容 |
|------|------|
| 関数名 | `parseProjectId()` |
| 概要 | URLパラメータから案件IDを取得 |
| 引数 | なし |
| 戻り値 | String/null - 案件ID |

**処理フロー**:

1. URLSearchParamsでprojectIdパラメータを取得
2. currentProjectIdに設定
3. 値を返却

#### 4.2.2 loadProjectInfo()（新規）

| 項目 | 内容 |
|------|------|
| 関数名 | `loadProjectInfo()` |
| 概要 | 案件情報を取得してヘッダーに表示 |
| 引数 | なし |
| 戻り値 | なし（async/await） |

**処理フロー**:

1. currentProjectIdが'none'の場合：「案件なし（未分類）」を表示
2. それ以外：`GET /api/projects/{id}` で案件名を取得
3. ヘッダーに案件名を表示

#### 4.2.3 loadTodos()（変更）

| 項目 | 内容 |
|------|------|
| 関数名 | `loadTodos()` |
| 概要 | 案件別ToDoリストを取得して表示 |
| 引数 | なし |
| 戻り値 | なし（async/await） |

**処理フロー（変更後）**:

1. ローディング表示を有効化
2. currentProjectIdに応じてAPI呼び出し
   - 'none': `GET /api/todos?projectId=none`
   - その他: `GET /api/todos?projectId={id}`
3. ToDoカードをレンダリング（期間表示含む）
4. ローディング表示を無効化

#### 4.2.4 addTodo()（変更）

| 項目 | 内容 |
|------|------|
| 関数名 | `addTodo()` |
| 概要 | 新しいToDoを作成（期間情報含む） |
| 引数 | なし |
| 戻り値 | なし（async/await） |

**処理フロー（変更後）**:

1. 入力値を取得（title, description, startDate, dueDate）
2. バリデーション
   - title必須チェック
   - 期間整合性チェック（dueDate >= startDate）
3. リクエストボディを構築（projectId含む）
4. `POST /api/todos` を呼び出し
5. 成功時：フォームクリア、リスト・統計再読込
6. 失敗時：エラーメッセージ表示

#### 4.2.5 validateDateRange(startDate, dueDate)（新規）

| 項目 | 内容 |
|------|------|
| 関数名 | `validateDateRange(startDate, dueDate)` |
| 概要 | 開始日・終了日の整合性をチェック |
| 引数 | startDate: String, dueDate: String |
| 戻り値 | Boolean - 妥当性 |

**処理フロー**:

1. 両方空の場合：true
2. 片方のみ設定：true
3. 両方設定：dueDate >= startDateならtrue

#### 4.2.6 formatDateRange(startDate, dueDate)（新規）

| 項目 | 内容 |
|------|------|
| 関数名 | `formatDateRange(startDate, dueDate)` |
| 概要 | 期間表示用の文字列を生成 |
| 引数 | startDate: String, dueDate: String |
| 戻り値 | String - 期間表示文字列 |

**出力例**:

| startDate | dueDate | 出力 |
|-----------|---------|------|
| 2025-01-01 | 2025-01-15 | 2025/01/01 〜 2025/01/15 |
| 2025-01-01 | null | 2025/01/01 〜 |
| null | 2025-01-15 | 〜 2025/01/15 |
| null | null | （空文字） |

#### 4.2.7 displayTodos()（変更）

**変更点**:

- ToDoカードに期間表示を追加

```javascript
// 期間表示の追加
const dateRange = formatDateRange(todo.startDate, todo.dueDate);
const dateRangeHtml = dateRange ? `<p class="date-range">期間: ${dateRange}</p>` : '';
```

---

## 5. API連携

### 5.1 API呼び出し一覧

| 画面 | 操作 | API | メソッド | 呼び出し元 |
|------|------|-----|---------|-----------|
| 案件一覧 | 一覧取得 | /api/projects | GET | loadProjects() |
| 案件一覧 | 統計取得 | /api/projects/{id}/stats | GET | loadProjects() |
| 案件一覧 | 作成 | /api/projects | POST | createProject() |
| 案件一覧 | 削除 | /api/projects/{id} | DELETE | deleteProject() |
| 案件一覧 | 未分類取得 | /api/todos?projectId=none | GET | loadNoProjectStats() |
| ToDoリスト | 案件情報取得 | /api/projects/{id} | GET | loadProjectInfo() |
| ToDoリスト | 案件別取得 | /api/todos?projectId={id} | GET | loadTodos() |
| ToDoリスト | 作成 | /api/todos | POST | addTodo() |

### 5.2 エラーハンドリング

| エラー | 対応 |
|--------|------|
| ネットワークエラー | 「ネットワークエラーが発生しました。」を表示 |
| APIエラー (400) | 「入力内容を確認してください。」を表示 |
| APIエラー (404) | 「データが見つかりませんでした。」を表示 |
| APIエラー (500) | 「サーバーエラーが発生しました。」を表示 |

---

## 6. スタイル設計

### 6.1 主要クラス（追加）

| クラス名 | 用途 |
|---------|------|
| .project-card | 案件カードのコンテナ |
| .project-card.no-project | 案件なしカード |
| .progress-bar | 進捗バーのコンテナ |
| .progress | 進捗バーの塗りつぶし部分 |
| .date-inputs | 日付入力エリアのコンテナ |
| .date-field | 日付入力フィールド |
| .date-range | 期間表示テキスト |
| .project-subtitle | 案件名サブタイトル |

### 6.2 状態別スタイル

| 状態 | 適用スタイル |
|------|-------------|
| 案件カード通常 | background: white, border: 1px solid #ddd |
| 案件カードホバー | box-shadow: 0 4px 12px rgba(0,0,0,0.15) |
| 進捗バー（0%） | background: #e9ecef |
| 進捗バー（100%） | background: #28a745 |
| 期限超過チケット | border-left: 4px solid #dc3545 |

---

## 7. バリデーション

### 7.1 入力チェック（案件一覧画面）

| 項目 | ルール | エラー表示 |
|------|--------|-----------|
| 案件名 | 必須、空文字不可 | 「案件名を入力してください。」 |

### 7.2 入力チェック（ToDoリスト画面）追加

| 項目 | ルール | エラー表示 |
|------|--------|-----------|
| 開始日 | 任意、日付形式 | ブラウザネイティブバリデーション |
| 終了日 | 任意、日付形式 | ブラウザネイティブバリデーション |
| 期間整合性 | 終了日 >= 開始日 | 「終了日は開始日以降を指定してください。」 |

---

## 8. ホーム画面変更（index.html）

### 8.1 追加要素

```html
<!-- 案件一覧へのリンクを追加 -->
<div class="menu-item">
    <a href="/projects.html">案件一覧</a>
    <p>案件ごとにチケットを管理</p>
</div>
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
