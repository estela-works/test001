[← 目次に戻る](./README.md)

# Controllerクラス設計

## 5.1 ProjectController（新規）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.ProjectController` |
| アノテーション | `@RestController`, `@RequestMapping("/api/projects")` |

### 依存関係

| フィールド | 型 | 注入方法 |
|-----------|-----|---------|
| projectService | ProjectService | コンストラクタインジェクション |

### メソッド一覧

| メソッド | アノテーション | 概要 |
|---------|---------------|------|
| getAllProjects() | @GetMapping | 全案件取得 |
| getProjectById(Long id) | @GetMapping("/{id}") | ID指定取得 |
| createProject(Project project) | @PostMapping | 新規作成 |
| updateProject(Long id, Project project) | @PutMapping("/{id}") | 更新 |
| deleteProject(Long id) | @DeleteMapping("/{id}") | 削除 |
| getProjectStats(Long id) | @GetMapping("/{id}/stats") | 統計取得 |

---

## 5.2 TodoController（変更）

| 項目 | 内容 |
|------|------|
| クラス名 | `com.example.demo.TodoController` |
| 変更内容 | getAllTodos, createTodo, updateTodoメソッドの変更 |

### 変更メソッド

| メソッド | 変更内容 |
|---------|---------|
| getAllTodos() | projectIdパラメータの追加 |
| createTodo() | projectId, startDate, dueDateの処理追加 |
| updateTodo() | projectId, startDate, dueDateの処理追加 |
