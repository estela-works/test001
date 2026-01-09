# テストメタ情報

> [← 目次に戻る](./README.md)

## 1. テストケース一覧

| ID | 対象 | テスト観点 | 分類 | 優先度 | ステータス |
|----|------|-----------|------|--------|-----------|
| TC-PS-001 | ProjectService.getAllProjects | 一覧取得 | 正常系 | 高 | 未実施 |
| TC-PS-002 | ProjectService.getAllProjects | 0件取得 | 境界値 | 中 | 未実施 |
| TC-PS-003 | ProjectService.getProjectById | 存在するID | 正常系 | 高 | 未実施 |
| TC-PS-004 | ProjectService.getProjectById | 存在しないID | 異常系 | 高 | 未実施 |
| TC-PS-005 | ProjectService.createProject | 正常作成 | 正常系 | 高 | 未実施 |
| TC-PS-006 | ProjectService.createProject | 説明なし | 正常系 | 中 | 未実施 |
| TC-PS-007 | ProjectService.updateProject | 正常更新 | 正常系 | 高 | 未実施 |
| TC-PS-008 | ProjectService.updateProject | 存在しないID | 異常系 | 高 | 未実施 |
| TC-PS-009 | ProjectService.deleteProject | 配下なし削除 | 正常系 | 高 | 未実施 |
| TC-PS-010 | ProjectService.deleteProject | カスケード削除 | 正常系 | 高 | 未実施 |
| TC-PS-011 | ProjectService.deleteProject | 存在しないID | 異常系 | 高 | 未実施 |
| TC-PS-012 | ProjectService.getProjectStats | 全て未完了 | 正常系 | 高 | 未実施 |
| TC-PS-013 | ProjectService.getProjectStats | 一部完了 | 正常系 | 高 | 未実施 |
| TC-PS-014 | ProjectService.getProjectStats | 全て完了 | 正常系 | 中 | 未実施 |
| TC-PS-015 | ProjectService.getProjectStats | 0件 | 境界値 | 中 | 未実施 |
| TC-PS-016 | ProjectService.getProjectStats | 進捗率切り捨て | 境界値 | 中 | 未実施 |
| TC-TS-001 | TodoService.getTodosByProjectId | 案件別取得 | 正常系 | 高 | 未実施 |
| TC-TS-002 | TodoService.getTodosByProjectId | 未分類取得 | 正常系 | 高 | 未実施 |
| TC-TS-003 | TodoService.getTodosByProjectId | 該当なし | 境界値 | 中 | 未実施 |
| TC-TS-004 | TodoService.validateDateRange | 両方null | 正常系 | 高 | 未実施 |
| TC-TS-005 | TodoService.validateDateRange | 開始日のみ | 正常系 | 中 | 未実施 |
| TC-TS-006 | TodoService.validateDateRange | 終了日のみ | 正常系 | 中 | 未実施 |
| TC-TS-007 | TodoService.validateDateRange | 開始日<終了日 | 正常系 | 高 | 未実施 |
| TC-TS-008 | TodoService.validateDateRange | 開始日=終了日 | 境界値 | 高 | 未実施 |
| TC-TS-009 | TodoService.validateDateRange | 開始日>終了日 | 異常系 | 高 | 未実施 |
| TC-TS-010 | TodoService.createTodo | 期間付き作成 | 正常系 | 高 | 未実施 |
| TC-TS-011 | TodoService.createTodo | 期間なし作成 | 正常系 | 高 | 未実施 |
| TC-TS-012 | TodoService.createTodo | 不正期間エラー | 異常系 | 高 | 未実施 |
| TC-TS-013 | TodoService.updateTodo | 期間更新 | 正常系 | 高 | 未実施 |
| TC-TS-014 | TodoService.updateTodo | 期間クリア | 正常系 | 中 | 未実施 |
| IT-PC-001 | GET /api/projects | 一覧取得 | 正常系 | 高 | 未実施 |
| IT-PC-002 | POST /api/projects | 作成成功 | 正常系 | 高 | 未実施 |
| IT-PC-003 | POST /api/projects | name未入力 | 異常系 | 高 | 未実施 |
| IT-PC-004 | GET /api/projects/{id} | 詳細取得 | 正常系 | 高 | 未実施 |
| IT-PC-005 | GET /api/projects/{id} | 存在しないID | 異常系 | 高 | 未実施 |
| IT-PC-006 | DELETE /api/projects/{id} | 削除成功 | 正常系 | 高 | 未実施 |
| IT-PC-007 | DELETE /api/projects/{id} | カスケード | 正常系 | 高 | 未実施 |
| IT-PC-008 | GET /api/projects/{id}/stats | 統計取得 | 正常系 | 高 | 未実施 |
| IT-TC-001 | GET /api/todos?projectId | 案件別取得 | 正常系 | 高 | 未実施 |
| IT-TC-002 | GET /api/todos?projectId=none | 未分類取得 | 正常系 | 高 | 未実施 |
| IT-TC-003 | POST /api/todos | 期間付き作成 | 正常系 | 高 | 未実施 |
| IT-TC-004 | POST /api/todos | 不正期間エラー | 異常系 | 高 | 未実施 |
| IT-TC-005 | PUT /api/todos/{id} | 期間更新 | 正常系 | 高 | 未実施 |

---

## 2. テストデータ

| データID | 用途 | 内容 |
|---------|------|------|
| TD-001 | 案件テスト用 | name="テスト案件A", description="説明A" |
| TD-002 | 案件テスト用 | name="テスト案件B", description=null |
| TD-003 | チケットテスト用 | title="タスク1", projectId=1, startDate=2025-01-01, dueDate=2025-01-15 |
| TD-004 | チケットテスト用 | title="タスク2", projectId=null（未分類） |
| TD-005 | 日付バリデーション用 | startDate=2025-01-15, dueDate=2025-01-01（不正） |

---

## 3. テスト環境

### 3.1 必要な環境

- Java 17
- Maven
- H2 Database（テスト用インメモリモード）
- Spring Boot Test
- JUnit 5
- AssertJ
- Mockito（必要に応じて）

### 3.2 テスト実行方法

```bash
# 全テスト実行
./mvnw test

# 特定クラスのテスト実行
./mvnw test -Dtest=ProjectServiceTest
./mvnw test -Dtest=TodoServiceTest

# 結合テスト実行
./mvnw test -Dtest=*ControllerTest
```

### 3.3 テストプロファイル

```properties
# application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.sql.init.mode=always
```
