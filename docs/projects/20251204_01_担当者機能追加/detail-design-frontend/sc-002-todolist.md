[← 目次に戻る](./README.md)

# SC-002: ToDoリスト画面（変更）

## 1. 追加DOM構造

### 1.1 担当者選択（add-todoセクション内に追加）

```html
<div class="assignee-field">
    <label for="assignee-select">担当者:</label>
    <select id="assignee-select">
        <option value="">選択してください</option>
        <!-- ユーザー一覧がここに動的に追加される -->
    </select>
</div>
```

### 1.2 ToDoカード内の担当者表示

```html
<p class="assignee">担当者: <span class="assignee-name">山田太郎</span></p>
<!-- または -->
<p class="assignee">担当者: <span class="assignee-name unassigned">未割当</span></p>
```

---

## 2. 追加状態管理

| 変数名 | 型 | 初期値 | 用途 |
|--------|-----|--------|------|
| users | Array | [] | ユーザー一覧（ドロップダウン用） |

---

## 3. 追加CSS

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

---

## 4. 追加イベント処理

| イベント | 要素 | 処理内容 |
|---------|------|----------|
| load | window | loadUsers()を追加で呼び出し |
| change | assignee-select | 選択値を保持 |

---

## 5. 追加JavaScript関数

### 5.1 loadUsers()

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

### 5.2 populateAssigneeSelect()

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

### 5.3 addTodo()の変更

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

### 5.4 displayTodos()の変更

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

### 5.5 window.onloadの変更

```javascript
window.onload = function() {
    parseProjectId();
    loadProjectInfo();
    loadUsers();  // 追加
    loadTodos();
};
```

---

## 6. ホーム画面（index.html）の変更

### 6.1 追加するリンク

```html
<a href="/users.html" class="link-button">ユーザー管理を開く</a>
```

### 6.2 追加CSS

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
