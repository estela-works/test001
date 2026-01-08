# ストアテストケース

[← 目次に戻る](./README.md)

---

## 1. todoStore テストケース

> **ファイル**: `src/frontend/src/stores/todoStore.spec.ts`

### 1.1 初期状態

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-001 | 初期状態が正しく設定されている | 正常系 | todos=[], loading=false, error=null, filter='all', currentProjectId=null |

### 1.2 getters - filteredTodos

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-002 | filter=allの場合、すべてのToDoを返す | 正常系 | 全件返却 |
| TS-003 | filter=pendingの場合、未完了のToDoのみを返す | 正常系 | 未完了のみ返却 |
| TS-004 | filter=completedの場合、完了済みのToDoのみを返す | 正常系 | 完了済みのみ返却 |

### 1.3 getters - stats

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-005 | 統計情報を正しく計算する | 正常系 | total, completed, pending が正確 |
| TS-006 | ToDoがない場合、すべて0を返す | 境界値 | total=0, completed=0, pending=0 |

### 1.4 actions - fetchTodos

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-007 | ToDoリストを取得して状態を更新する | 正常系 | todos更新、loading=false、error=null |
| TS-008 | projectIdを指定してToDoを取得する | 正常系 | getAll(projectId)呼出、currentProjectId更新 |
| TS-009 | エラー時にエラーメッセージを設定する | 異常系 | error設定、loading=false |

### 1.5 actions - addTodo

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-010 | 新しいToDoを追加してリストを更新する | 正常系 | create呼出、getAll呼出 |
| TS-011 | エラー時にエラーメッセージを設定する | 異常系 | error='ToDoの追加に失敗しました' |

### 1.6 actions - toggleTodo

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-012 | ToDoの完了状態を切り替える | 正常系 | toggle(id)呼出 |

### 1.7 actions - deleteTodo

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-013 | ToDoを削除する | 正常系 | delete(id)呼出 |

### 1.8 actions - setFilter

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-014 | フィルターをpendingに変更する | 正常系 | filter='pending' |
| TS-015 | フィルターをcompletedに変更する | 正常系 | filter='completed' |
| TS-016 | フィルターをallに変更する | 正常系 | filter='all' |

### 1.9 actions - clearError

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| TS-017 | エラーをクリアする | 正常系 | error=null |

---

## 2. projectStore テストケース

> **ファイル**: `src/frontend/src/stores/projectStore.spec.ts`

### 2.1 初期状態

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| PS-001 | 初期状態が正しく設定されている | 正常系 | projects=[], loading=false, error=null, projectStats={}, noProjectStats初期値 |

### 2.2 actions - fetchProjects

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| PS-002 | 案件リストを取得して状態を更新する | 正常系 | projects更新、loading=false、error=null |
| PS-003 | エラー時にエラーメッセージを設定する | 異常系 | error='案件リストの読み込みに失敗しました' |

### 2.3 actions - createProject

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| PS-004 | 新しい案件を作成してリストを更新する | 正常系 | create呼出、getAll呼出 |
| PS-005 | エラー時にエラーメッセージを設定する | 異常系 | error='案件の作成に失敗しました' |

### 2.4 actions - deleteProject

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| PS-006 | 案件を削除してリストを更新する | 正常系 | delete(id)呼出、getAll呼出 |
| PS-007 | エラー時にエラーメッセージを設定する | 異常系 | error='案件の削除に失敗しました' |

### 2.5 actions - fetchProjectStats

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| PS-008 | 特定案件の統計を取得する | 正常系 | projectStats[id]更新 |
| PS-009 | エラー時にデフォルト値を設定する | 異常系 | projectStats[id]={total:0, completed:0, progressRate:0} |

### 2.6 actions - fetchNoProjectStats

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| PS-010 | 未分類チケットの統計を取得する | 正常系 | noProjectStats更新 |
| PS-011 | エラー時にデフォルト値を設定する | 異常系 | noProjectStats初期値 |

### 2.7 actions - clearError

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| PS-012 | エラーをクリアする | 正常系 | error=null |

---

## 3. userStore テストケース

> **ファイル**: `src/frontend/src/stores/userStore.spec.ts`

### 3.1 初期状態

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| US-001 | 初期状態が正しく設定されている | 正常系 | users=[], loading=false, error=null |

### 3.2 getters - userCount

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| US-002 | ユーザー数を正しく返す | 正常系 | users.length |
| US-003 | ユーザーがいない場合は0を返す | 境界値 | 0 |

### 3.3 actions - fetchUsers

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| US-004 | ユーザーリストを取得して状態を更新する | 正常系 | users更新、loading=false、error=null |
| US-005 | 読み込み中はloadingがtrueになる | 正常系 | loading=true（読込中）→false（完了後） |
| US-006 | エラー時にエラーメッセージを設定する | 異常系 | error='ユーザーリストの読み込みに失敗しました' |

### 3.4 actions - addUser

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| US-007 | 新しいユーザーを追加してリストを更新する | 正常系 | create呼出、getAll呼出 |
| US-008 | 重複エラー時に専用のエラーメッセージを設定する | 異常系 | error='同じ名前のユーザーが既に存在します' |
| US-009 | その他のエラー時に一般的なエラーメッセージを設定する | 異常系 | error='ユーザーの追加に失敗しました' |

### 3.5 actions - deleteUser

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| US-010 | ユーザーを削除してリストを更新する | 正常系 | delete(id)呼出、getAll呼出 |
| US-011 | エラー時にエラーメッセージを設定する | 異常系 | error='ユーザーの削除に失敗しました' |

### 3.6 actions - clearError

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| US-012 | エラーをクリアする | 正常系 | error=null |

---

[← 目次に戻る](./README.md)
