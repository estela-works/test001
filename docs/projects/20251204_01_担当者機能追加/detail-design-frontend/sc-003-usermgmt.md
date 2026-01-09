[← 目次に戻る](./README.md)

# SC-003: ユーザー管理画面（新規）

## 1. 完全なHTMLファイル

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

---

## 2. 状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| users | Array | [] | ユーザー一覧 |

---

## 3. JavaScript関数一覧

| 関数名 | 概要 |
|--------|------|
| loadUsers() | ユーザー一覧を取得して表示 |
| updateStats() | ユーザー数を更新 |
| displayUsers() | ユーザーリストをDOMに描画 |
| addUser() | 新しいユーザーを登録 |
| deleteUser(id, name) | ユーザーを削除 |
| showError(message) | エラーメッセージを表示 |
| escapeHtml(text) | HTMLエスケープ |
