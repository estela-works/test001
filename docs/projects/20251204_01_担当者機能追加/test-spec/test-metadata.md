[← 目次に戻る](./README.md)

# テストメタデータ

## 6. テストケース一覧

| ID | 対象 | テスト観点 | 分類 | 優先度 |
|----|------|-----------|------|--------|
| TC-M01 | UserMapper.selectAll | データありで取得 | 正常系 | 高 |
| TC-M02 | UserMapper.selectAll | データなしで空リスト | 正常系 | 中 |
| TC-M03 | UserMapper.selectById | ID指定取得 | 正常系 | 高 |
| TC-M04 | UserMapper.selectById | 存在しないID | 異常系 | 高 |
| TC-M05 | UserMapper.selectByName | 名前指定取得 | 正常系 | 高 |
| TC-M06 | UserMapper.insert | 新規登録 | 正常系 | 高 |
| TC-M07 | UserMapper.deleteById | 削除 | 正常系 | 高 |
| TC-M10 | TodoMapper.selectAll | 担当者名取得 | 正常系 | 高 |
| TC-M11 | TodoMapper.selectAll | 担当者未設定 | 正常系 | 高 |
| TC-M12 | TodoMapper.insert | 担当者ID付き登録 | 正常系 | 高 |
| TC-M13 | TodoMapper.update | 担当者変更 | 正常系 | 高 |
| TC-S01 | UserService.getAllUsers | 一覧取得 | 正常系 | 高 |
| TC-S02 | UserService.getUserById | ID指定取得 | 正常系 | 高 |
| TC-S03 | UserService.createUser | 新規作成 | 正常系 | 高 |
| TC-S04 | UserService.existsByName | 存在チェック（存在） | 正常系 | 高 |
| TC-S05 | UserService.existsByName | 存在チェック（不在） | 正常系 | 高 |
| TC-S06 | UserService.deleteUser | 削除 | 正常系 | 高 |
| TC-S07 | UserService.deleteUser | 存在しないID | 異常系 | 高 |
| IT-01 | GET /api/users | 一覧取得 | 正常系 | 高 |
| IT-02 | GET /api/users/{id} | 単一取得 | 正常系 | 高 |
| IT-03 | GET /api/users/{id} | 存在しないID | 異常系 | 高 |
| IT-04 | POST /api/users | 新規登録 | 正常系 | 高 |
| IT-05 | POST /api/users | 名前空 | 異常系 | 高 |
| IT-06 | POST /api/users | 名前重複 | 異常系 | 高 |
| IT-07 | POST /api/users | 100文字 | 境界値 | 中 |
| IT-08 | POST /api/users | 101文字 | 境界値 | 中 |
| IT-09 | DELETE /api/users/{id} | 削除 | 正常系 | 高 |
| IT-10 | DELETE /api/users/{id} | 存在しないID | 異常系 | 高 |
| IT-11 | DELETE /api/users/{id} | ToDo担当者解除 | 正常系 | 高 |
| IT-20 | POST /api/todos | 担当者付き作成 | 正常系 | 高 |
| IT-21 | POST /api/todos | 担当者なし作成 | 正常系 | 高 |
| IT-22 | POST /api/todos | 存在しない担当者 | 異常系 | 高 |
| IT-23 | PUT /api/todos/{id} | 担当者変更 | 正常系 | 高 |
| IT-24 | PUT /api/todos/{id} | 担当者解除 | 正常系 | 中 |
| IT-25 | GET /api/todos | 担当者情報取得 | 正常系 | 高 |
| IT-30 | POST /api/todos | 既存機能（作成） | 後方互換 | 高 |
| IT-31 | PATCH /api/todos/{id}/toggle | 既存機能（完了切替） | 後方互換 | 高 |
| IT-32 | DELETE /api/todos/{id} | 既存機能（削除） | 後方互換 | 高 |

---

## 7. テストデータ

### 7.1 ユーザーテストデータ

| データID | 用途 | 内容 |
|---------|------|------|
| TD-U01 | 正常系テスト用 | User(id=1, name="山田太郎") |
| TD-U02 | 正常系テスト用 | User(id=2, name="鈴木花子") |
| TD-U03 | 正常系テスト用 | User(id=3, name="佐藤一郎") |
| TD-U04 | 境界値テスト用 | User(name="あ"×100) |

### 7.2 ToDoテストデータ

| データID | 用途 | 内容 |
|---------|------|------|
| TD-T01 | 担当者ありテスト | Todo(id=1, title="テスト1", assigneeId=1) |
| TD-T02 | 担当者なしテスト | Todo(id=2, title="テスト2", assigneeId=null) |

---

## 8. テスト環境

### 8.1 必要な環境

- Java 21
- Spring Boot 3.2.0
- H2 Database（インメモリモード）
- JUnit 5
- AssertJ
- MockMvc

### 8.2 テスト用プロファイル

```properties
# application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.sql.init.mode=always
```

### 8.3 モック・スタブ

| 対象 | モック/スタブ | 設定内容 |
|------|-------------|---------|
| UserMapper | @MockBean | Service単体テスト用 |
| UserService | @MockBean | Controller単体テスト用 |
