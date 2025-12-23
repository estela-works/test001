# ヘルパー

テスト用ヘルパークラスを格納するフォルダ。

## ファイル構成

| ファイル | 説明 |
|---------|------|
| api-helper.ts | APIヘルパー（テストデータ操作） |

## APIヘルパー

テストデータの作成・削除をAPI経由で行うヘルパークラス。

### 主要メソッド

| メソッド | 説明 |
|---------|------|
| createTodo() | ToDoを作成 |
| createProject() | 案件を作成 |
| createUser() | ユーザーを作成 |
| deleteAllTodos() | 全ToDoを削除 |
| deleteAllProjects() | 全案件を削除 |
| deleteAllUsers() | 全ユーザーを削除 |
