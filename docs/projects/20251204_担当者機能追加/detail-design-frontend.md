# フロントエンド詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 担当者機能追加 |
| 案件ID | 202512_担当者機能追加 |
| 作成日 | 2025-12-22 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

担当者機能追加に伴うフロントエンドの画面実装詳細を定義する。

### 1.2 対象コンポーネント

| コンポーネント/ファイル | 種別 | 責務 | 変更種別 |
|----------------------|------|------|----------|
| todos.html | HTML/CSS/JS | ToDoリスト画面 | 変更 |
| users.html | HTML/CSS/JS | ユーザー管理画面 | 新規 |
| index.html | HTML | ホーム画面 | 変更 |

---

## 2. ファイル構成

### 2.1 ファイル一覧

| ファイル | パス | 役割 | 変更種別 |
|---------|------|------|----------|
| todos.html | src/main/resources/static/todos.html | ToDoリスト画面 | 変更 |
| users.html | src/main/resources/static/users.html | ユーザー管理画面 | 新規 |
| index.html | src/main/resources/static/index.html | ホーム画面 | 変更 |

---

## 3. SC-002: ToDoリスト画面（変更）

### 3.1 追加DOM構造

#### 担当者選択（add-todoセクション内に追加）

```html
<div class="assignee-field">
    <label for="assignee-select">担当者:</label>
    <select id="assignee-select">
        <option value="">選択してください</option>
        <!-- ユーザー一覧がここに動的に追加される -->
    </select>
</div>
```

#### ToDoカード内の担当者表示

```html
<p class="assignee">担当者: <span class="assignee-name">山田太郎</span></p>
<!-- または -->
<p class="assignee">担当者: <span class="assignee-name unassigned">未割当</span></p>
```

### 3.2 追加状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| users | Array | [] | ユーザー一覧（ドロップダウン用） |

### 3.3 追加CSS

```css
.assignee-field {
    margin: 10px 0;
}
.assignee-field label {
    display: block;
    margin-bottom: 5px;
    color: #555;
}
.assignee-field select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}
.todo-item .assignee {
    color: #17a2b8;
    font-size: 14px;
}
.todo-item .assignee .unassigned {
    color: #6c757d;
    font-style: italic;
}
```

### 3.4 追加イベント処理

| イベント | 要素 | 処理内容 |
|---------|------|----------|
| load | window | loadUsers()を追加で呼び出し |
| change | assignee-select | 選択値を保持 |

### 3.5 追加JavaScript関数

#### loadUsers()

| 項目 | 内容 |
|------|------|
| 関数名 | `loadUsers()` |
| 概要 | ユーザー一覧を取得してドロップダウンに反映 |
| 引数 | なし |
| 戻り値 | なし（async） |

**処理フロー**:

1. /api/users にGETリクエスト
2. 成功時、users変数に格納
3. populateAssigneeSelect()を呼び出し

```javascript
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        if (response.ok) {
            users = await response.json();
            populateAssigneeSelect();
        }
    } catch (error) {
        console.error('ユーザー一覧の取得に失敗しました');
    }
}
```

#### populateAssigneeSelect()

| 項目 | 内容 |
|------|------|
| 関数名 | `populateAssigneeSelect()` |
| 概要 | ドロップダウンにユーザー選択肢を反映 |
| 引数 | なし |
| 戻り値 | なし |

**処理フロー**:

1. assignee-select要素を取得
2. 「選択してください」オプションを設定
3. usersをループしてoptionを追加

```javascript
function populateAssigneeSelect() {
    const select = document.getElementById('assignee-select');
    select.innerHTML = '<option value="">選択してください</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
    });
}
```

#### addTodo()の変更

**変更内容**: assigneeIdをリクエストボディに追加

```javascript
async function addTodo() {
    const title = document.getElementById('title-input').value.trim();
    const description = document.getElementById('description-input').value.trim();
    const startDate = document.getElementById('start-date-input').value;
    const dueDate = document.getElementById('due-date-input').value;
    const assigneeId = document.getElementById('assignee-select').value;  // 追加

    // ... バリデーション ...

    const requestBody = {
        title: title,
        description: description,
        startDate: startDate || null,
        dueDate: dueDate || null,
        assigneeId: assigneeId ? parseInt(assigneeId) : null  // 追加
    };

    // ... 以降は既存と同じ ...
}
```

#### displayTodos()の変更

**変更内容**: ToDoカードに担当者表示を追加

```javascript
function displayTodos() {
    // ... 既存コード ...

    todoList.innerHTML = filteredTodos.map(todo => {
        const dateRange = formatDateRange(todo.startDate, todo.dueDate);
        const dateRangeHtml = dateRange ? `<p class="date-range">期間: ${dateRange}</p>` : '';

        // 担当者表示の追加
        const assigneeHtml = todo.assigneeName
            ? `<p class="assignee">担当者: <span class="assignee-name">${escapeHtml(todo.assigneeName)}</span></p>`
            : `<p class="assignee">担当者: <span class="assignee-name unassigned">未割当</span></p>`;

        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <h3>${escapeHtml(todo.title)}</h3>
                <p>${escapeHtml(todo.description || '')}</p>
                ${assigneeHtml}
                ${dateRangeHtml}
                <p><small>作成日: ${new Date(todo.createdAt).toLocaleString('ja-JP')}</small></p>
                <div class="actions">
                    <button class="toggle-btn" onclick="toggleTodo(${todo.id})">
                        ${todo.completed ? '未完了にする' : '完了にする'}
                    </button>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})">削除</button>
                </div>
            </div>
        `}).join('');
}
```

#### window.onloadの変更

```javascript
window.onload = function() {
    parseProjectId();
    loadProjectInfo();
    loadUsers();  // 追加
    loadTodos();
};
```

---

## 4. SC-003: ユーザー管理画面（新規）

### 4.1 完全なHTMLファイル

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ユーザー管理 - Spring Boot App</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }
        .stats {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .add-user {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .add-user input {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .add-user button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .add-user button:hover {
            background-color: #0056b3;
        }
        .user-item {
            border: 1px solid #ddd;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 5px;
            background-color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-info h3 {
            margin: 0 0 5px 0;
            color: #333;
        }
        .user-info p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        .delete-btn {
            background-color: #dc3545;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .delete-btn:hover {
            background-color: #c82333;
        }
        .back-link {
            text-align: center;
            margin-top: 20px;
        }
        .back-link a {
            color: #007bff;
            text-decoration: none;
        }
        .loading {
            text-align: center;
            color: #666;
        }
        .error {
            color: #dc3545;
            text-align: center;
            padding: 10px;
            background-color: #f8d7da;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .empty-message {
            text-align: center;
            color: #666;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ユーザー管理</h1>

        <div class="stats">
            <span>登録済みユーザー: <span id="user-count">0</span>件</span>
        </div>

        <div class="add-user">
            <h3>新しいユーザーを登録</h3>
            <input type="text" id="name-input" placeholder="ユーザー名を入力してください" maxlength="100" required>
            <button onclick="addUser()">登録</button>
        </div>

        <div id="error-message" class="error" style="display: none;"></div>
        <div id="loading" class="loading">読み込み中...</div>
        <div id="user-list"></div>

        <div class="back-link">
            <a href="/">← ホームに戻る</a>
        </div>
    </div>

    <script>
        let users = [];

        // ページ読み込み時にユーザーリストを取得
        window.onload = function() {
            loadUsers();
        };

        // エラーメッセージを表示
        function showError(message) {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        // ユーザーリストを取得
        async function loadUsers() {
            try {
                document.getElementById('loading').style.display = 'block';
                const response = await fetch('/api/users');
                if (response.ok) {
                    users = await response.json();
                    displayUsers();
                    updateStats();
                } else {
                    showError('ユーザーリストの読み込みに失敗しました。');
                }
            } catch (error) {
                showError('ネットワークエラーが発生しました。');
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        }

        // 統計を更新
        function updateStats() {
            document.getElementById('user-count').textContent = users.length;
        }

        // ユーザーリストを表示
        function displayUsers() {
            const userList = document.getElementById('user-list');

            if (users.length === 0) {
                userList.innerHTML = '<p class="empty-message">登録されているユーザーはありません。</p>';
                return;
            }

            userList.innerHTML = users.map(user => `
                <div class="user-item">
                    <div class="user-info">
                        <h3>${escapeHtml(user.name)}</h3>
                        <p>登録日: ${new Date(user.createdAt).toLocaleDateString('ja-JP')}</p>
                    </div>
                    <button class="delete-btn" onclick="deleteUser(${user.id}, '${escapeHtml(user.name)}')">削除</button>
                </div>
            `).join('');
        }

        // 新しいユーザーを追加
        async function addUser() {
            const name = document.getElementById('name-input').value.trim();

            if (!name) {
                showError('ユーザー名を入力してください。');
                return;
            }

            if (name.length > 100) {
                showError('ユーザー名は100文字以内で入力してください。');
                return;
            }

            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name })
                });

                if (response.ok) {
                    document.getElementById('name-input').value = '';
                    await loadUsers();
                } else if (response.status === 409) {
                    showError('このユーザー名は既に登録されています。');
                } else {
                    showError('ユーザーの登録に失敗しました。');
                }
            } catch (error) {
                showError('ネットワークエラーが発生しました。');
            }
        }

        // ユーザーを削除
        async function deleteUser(id, name) {
            if (!confirm(`ユーザー「${name}」を削除しますか？\n\nこのユーザーが担当しているToDoは「未割当」になります。`)) {
                return;
            }

            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    await loadUsers();
                } else if (response.status === 404) {
                    showError('ユーザーが見つかりませんでした。');
                } else {
                    showError('ユーザーの削除に失敗しました。');
                }
            } catch (error) {
                showError('ネットワークエラーが発生しました。');
            }
        }

        // HTMLエスケープ
        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Enterキーでの登録をサポート
        document.getElementById('name-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addUser();
            }
        });
    </script>
</body>
</html>
```

### 4.2 状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| users | Array | [] | ユーザー一覧 |

### 4.3 JavaScript関数一覧

| 関数名 | 概要 |
|--------|------|
| loadUsers() | ユーザー一覧を取得して表示 |
| updateStats() | ユーザー数を更新 |
| displayUsers() | ユーザーリストをDOMに描画 |
| addUser() | 新しいユーザーを登録 |
| deleteUser(id, name) | ユーザーを削除 |
| showError(message) | エラーメッセージを表示 |
| escapeHtml(text) | HTMLエスケープ |

---

## 5. ホーム画面（index.html）の変更

### 5.1 追加するリンク

```html
<a href="/users.html" class="link-button">ユーザー管理を開く</a>
```

### 5.2 追加CSS

```css
.link-button {
    display: block;
    text-align: center;
    margin: 10px auto;
    padding: 15px 30px;
    background-color: #17a2b8;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 18px;
    max-width: 300px;
}
.link-button:hover {
    background-color: #138496;
}
```

---

## 6. API連携

### 6.1 SC-002で使用するAPI

| 操作 | API | メソッド | 呼び出し元 |
|------|-----|---------|-----------|
| ユーザー一覧取得 | /api/users | GET | loadUsers() |
| ToDo作成 | /api/todos | POST | addTodo() |

### 6.2 SC-003で使用するAPI

| 操作 | API | メソッド | 呼び出し元 |
|------|-----|---------|-----------|
| ユーザー一覧取得 | /api/users | GET | loadUsers() |
| ユーザー登録 | /api/users | POST | addUser() |
| ユーザー削除 | /api/users/{id} | DELETE | deleteUser() |

### 6.3 エラーハンドリング

| エラー | 対応 |
|--------|------|
| ネットワークエラー | 「ネットワークエラーが発生しました。」を表示 |
| 400 Bad Request | 「〜に失敗しました。」を表示 |
| 404 Not Found | 「〜が見つかりませんでした。」を表示 |
| 409 Conflict | 「このユーザー名は既に登録されています。」を表示 |

---

## 7. バリデーション

### 7.1 入力チェック（SC-003）

| 項目 | ルール | エラー表示 |
|------|--------|-----------|
| ユーザー名 | 必須 | 「ユーザー名を入力してください。」 |
| ユーザー名 | 100文字以内 | 「ユーザー名は100文字以内で入力してください。」 |

### 7.2 フロントエンド制限

| 項目 | 制限 |
|------|------|
| ユーザー名入力欄 | maxlength="100" |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
