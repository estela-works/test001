# テスト仕様書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | 担当者機能追加 |
| 案件ID | 202512_担当者機能追加 |
| 作成日 | 2025-12-22 |
| 作成者 | - |
| 関連詳細設計書 | [detail-design-api.md](./detail-design-api.md), [detail-design-logic.md](./detail-design-logic.md) |

---

## 1. テスト概要

### 1.1 テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| User | 新規 | ユーザーエンティティ |
| UserMapper | 新規 | ユーザーデータアクセス |
| UserService | 新規 | ユーザービジネスロジック |
| UserController | 新規 | ユーザーAPI |
| Todo | 変更 | assigneeId, assigneeNameフィールド追加 |
| TodoMapper | 変更 | ASSIGNEE_ID対応 |
| TodoService | 変更 | 担当者対応 |
| TodoController | 変更 | 担当者ID検証追加 |

### 1.2 テスト方針

| 方針 | 内容 |
|------|------|
| テストレベル | 単体テスト、結合テスト（API） |
| テストフレームワーク | JUnit 5 + AssertJ |
| DBテスト | @MybatisTest（インメモリH2） |
| APIテスト | @SpringBootTest + MockMvc |
| カバレッジ目標 | 新規コード80%以上 |

### 1.3 テスト観点

| 観点 | 説明 |
|------|------|
| 正常系 | 期待通りの入力で正しく動作すること |
| 異常系 | 不正入力・エラー時に適切に処理されること |
| 境界値 | 文字数制限等の境界条件で正しく動作すること |
| 後方互換性 | 既存のToDo機能が正常に動作すること |

---

## 2. 単体テスト（Mapper層）

### 2.1 UserMapperTest

**テスト対象**: `com.example.demo.UserMapper`

#### TC-M01: selectAll - 正常系（データあり）

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M01 |
| テスト観点 | 全ユーザーが作成日時昇順で取得できること |
| 分類 | 正常系 |
| 前提条件 | ユーザーが3件登録されている |
| 入力値 | なし |
| 期待結果 | 3件のユーザーがcreatedAt昇順で返却される |
| 確認方法 | assertThat(result).hasSize(3) |

#### TC-M02: selectAll - 正常系（データなし）

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M02 |
| テスト観点 | データがない場合に空リストが返却されること |
| 分類 | 正常系 |
| 前提条件 | ユーザーが0件 |
| 入力値 | なし |
| 期待結果 | 空のリストが返却される |
| 確認方法 | assertThat(result).isEmpty() |

#### TC-M03: selectById - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M03 |
| テスト観点 | 指定IDのユーザーが取得できること |
| 分類 | 正常系 |
| 前提条件 | ID=1のユーザーが存在する |
| 入力値 | id=1 |
| 期待結果 | ID=1のユーザーが返却される |
| 確認方法 | assertThat(result.getId()).isEqualTo(1L) |

#### TC-M04: selectById - 異常系（存在しないID）

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M04 |
| テスト観点 | 存在しないIDでnullが返却されること |
| 分類 | 異常系 |
| 前提条件 | ID=999のユーザーは存在しない |
| 入力値 | id=999 |
| 期待結果 | nullが返却される |
| 確認方法 | assertThat(result).isNull() |

#### TC-M05: selectByName - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M05 |
| テスト観点 | 指定名のユーザーが取得できること |
| 分類 | 正常系 |
| 前提条件 | 名前「山田太郎」のユーザーが存在する |
| 入力値 | name="山田太郎" |
| 期待結果 | 該当ユーザーが返却される |
| 確認方法 | assertThat(result.getName()).isEqualTo("山田太郎") |

#### TC-M06: insert - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M06 |
| テスト観点 | ユーザーが正常に登録されること |
| 分類 | 正常系 |
| 前提条件 | なし |
| 入力値 | User(name="テストユーザー") |
| 期待結果 | IDが自動採番され、データが登録される |
| 確認方法 | assertThat(user.getId()).isNotNull() |

#### TC-M07: deleteById - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M07 |
| テスト観点 | ユーザーが正常に削除されること |
| 分類 | 正常系 |
| 前提条件 | ID=1のユーザーが存在する |
| 入力値 | id=1 |
| 期待結果 | ユーザーが削除される |
| 確認方法 | selectById(1)がnullを返す |

---

### 2.2 TodoMapperTest（変更分）

**テスト対象**: `com.example.demo.TodoMapper`

#### TC-M10: selectAll - 担当者名取得

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M10 |
| テスト観点 | ToDoに紐付く担当者名が取得できること |
| 分類 | 正常系 |
| 前提条件 | ToDoにASSIGNEE_ID=1が設定されている |
| 入力値 | なし |
| 期待結果 | assigneeNameに「山田太郎」が設定される |
| 確認方法 | assertThat(todo.getAssigneeName()).isEqualTo("山田太郎") |

#### TC-M11: selectAll - 担当者未設定

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M11 |
| テスト観点 | 担当者未設定のToDoでassigneeNameがnullになること |
| 分類 | 正常系 |
| 前提条件 | ToDoのASSIGNEE_IDがNULL |
| 入力値 | なし |
| 期待結果 | assigneeId, assigneeNameがnull |
| 確認方法 | assertThat(todo.getAssigneeId()).isNull() |

#### TC-M12: insert - 担当者ID付き

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M12 |
| テスト観点 | 担当者ID付きでToDoが登録できること |
| 分類 | 正常系 |
| 前提条件 | ID=1のユーザーが存在する |
| 入力値 | Todo(title="テスト", assigneeId=1) |
| 期待結果 | ASSIGNEE_ID=1で登録される |
| 確認方法 | assertThat(todo.getAssigneeId()).isEqualTo(1L) |

#### TC-M13: update - 担当者変更

| 項目 | 内容 |
|------|------|
| テストケースID | TC-M13 |
| テスト観点 | 担当者を変更できること |
| 分類 | 正常系 |
| 前提条件 | ASSIGNEE_ID=1のToDoが存在する |
| 入力値 | assigneeId=2に変更 |
| 期待結果 | ASSIGNEE_ID=2に更新される |
| 確認方法 | assertThat(updated.getAssigneeId()).isEqualTo(2L) |

---

## 3. 単体テスト（Service層）

### 3.1 UserServiceTest

**テスト対象**: `com.example.demo.UserService`

#### TC-S01: getAllUsers - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-S01 |
| テスト観点 | 全ユーザー一覧が取得できること |
| 分類 | 正常系 |
| 前提条件 | UserMapperがユーザーリストを返す |
| 入力値 | なし |
| 期待結果 | ユーザーリストが返却される |
| 確認方法 | assertThat(result).isNotEmpty() |

#### TC-S02: getUserById - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-S02 |
| テスト観点 | 指定IDのユーザーが取得できること |
| 分類 | 正常系 |
| 前提条件 | UserMapperが該当ユーザーを返す |
| 入力値 | id=1 |
| 期待結果 | ユーザーが返却される |
| 確認方法 | assertThat(result).isNotNull() |

#### TC-S03: createUser - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-S03 |
| テスト観点 | ユーザーが正常に作成されること |
| 分類 | 正常系 |
| 前提条件 | なし |
| 入力値 | User(name="新規ユーザー") |
| 期待結果 | ユーザーが作成される |
| 確認方法 | verify(userMapper).insert(any()) |

#### TC-S04: existsByName - 正常系（存在する）

| 項目 | 内容 |
|------|------|
| テストケースID | TC-S04 |
| テスト観点 | 存在するユーザー名でtrueが返却されること |
| 分類 | 正常系 |
| 前提条件 | UserMapperがユーザーを返す |
| 入力値 | name="山田太郎" |
| 期待結果 | trueが返却される |
| 確認方法 | assertThat(result).isTrue() |

#### TC-S05: existsByName - 正常系（存在しない）

| 項目 | 内容 |
|------|------|
| テストケースID | TC-S05 |
| テスト観点 | 存在しないユーザー名でfalseが返却されること |
| 分類 | 正常系 |
| 前提条件 | UserMapperがnullを返す |
| 入力値 | name="存在しない" |
| 期待結果 | falseが返却される |
| 確認方法 | assertThat(result).isFalse() |

#### TC-S06: deleteUser - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | TC-S06 |
| テスト観点 | ユーザーが正常に削除されること |
| 分類 | 正常系 |
| 前提条件 | ID=1のユーザーが存在する |
| 入力値 | id=1 |
| 期待結果 | ユーザーが削除される |
| 確認方法 | verify(userMapper).deleteById(1L) |

#### TC-S07: deleteUser - 異常系（存在しない）

| 項目 | 内容 |
|------|------|
| テストケースID | TC-S07 |
| テスト観点 | 存在しないIDでnullが返却されること |
| 分類 | 異常系 |
| 前提条件 | ID=999のユーザーは存在しない |
| 入力値 | id=999 |
| 期待結果 | nullが返却される |
| 確認方法 | assertThat(result).isNull() |

---

## 4. 結合テスト（API）

### 4.1 UserController APIテスト

#### IT-01: GET /api/users - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | IT-01 |
| テスト観点 | ユーザー一覧が取得できること |
| エンドポイント | `GET /api/users` |
| 前提条件 | ユーザーが3件登録されている |
| リクエスト | なし |
| 期待結果 | ステータス: 200, 3件のユーザー配列 |

#### IT-02: GET /api/users/{id} - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | IT-02 |
| テスト観点 | 指定IDのユーザーが取得できること |
| エンドポイント | `GET /api/users/1` |
| 前提条件 | ID=1のユーザーが存在する |
| リクエスト | なし |
| 期待結果 | ステータス: 200, ユーザー情報 |

#### IT-03: GET /api/users/{id} - 異常系（404）

| 項目 | 内容 |
|------|------|
| テストケースID | IT-03 |
| テスト観点 | 存在しないIDで404が返却されること |
| エンドポイント | `GET /api/users/999` |
| 前提条件 | ID=999のユーザーは存在しない |
| リクエスト | なし |
| 期待結果 | ステータス: 404 |

#### IT-04: POST /api/users - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | IT-04 |
| テスト観点 | ユーザーが正常に登録されること |
| エンドポイント | `POST /api/users` |
| 前提条件 | なし |
| リクエスト | `{"name": "新規ユーザー"}` |
| 期待結果 | ステータス: 201, 作成されたユーザー情報 |

#### IT-05: POST /api/users - 異常系（名前空）

| 項目 | 内容 |
|------|------|
| テストケースID | IT-05 |
| テスト観点 | 名前が空の場合に400が返却されること |
| エンドポイント | `POST /api/users` |
| 前提条件 | なし |
| リクエスト | `{"name": ""}` |
| 期待結果 | ステータス: 400 |

#### IT-06: POST /api/users - 異常系（名前重複）

| 項目 | 内容 |
|------|------|
| テストケースID | IT-06 |
| テスト観点 | 名前重複時に409が返却されること |
| エンドポイント | `POST /api/users` |
| 前提条件 | 名前「山田太郎」のユーザーが存在する |
| リクエスト | `{"name": "山田太郎"}` |
| 期待結果 | ステータス: 409 |

#### IT-07: POST /api/users - 境界値（100文字）

| 項目 | 内容 |
|------|------|
| テストケースID | IT-07 |
| テスト観点 | 100文字の名前で登録できること |
| エンドポイント | `POST /api/users` |
| 前提条件 | なし |
| リクエスト | `{"name": "あ" × 100}` |
| 期待結果 | ステータス: 201 |

#### IT-08: POST /api/users - 境界値（101文字）

| 項目 | 内容 |
|------|------|
| テストケースID | IT-08 |
| テスト観点 | 101文字の名前で400が返却されること |
| エンドポイント | `POST /api/users` |
| 前提条件 | なし |
| リクエスト | `{"name": "あ" × 101}` |
| 期待結果 | ステータス: 400 |

#### IT-09: DELETE /api/users/{id} - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | IT-09 |
| テスト観点 | ユーザーが正常に削除されること |
| エンドポイント | `DELETE /api/users/1` |
| 前提条件 | ID=1のユーザーが存在する |
| リクエスト | なし |
| 期待結果 | ステータス: 204 |

#### IT-10: DELETE /api/users/{id} - 異常系（404）

| 項目 | 内容 |
|------|------|
| テストケースID | IT-10 |
| テスト観点 | 存在しないIDで404が返却されること |
| エンドポイント | `DELETE /api/users/999` |
| 前提条件 | ID=999のユーザーは存在しない |
| リクエスト | なし |
| 期待結果 | ステータス: 404 |

#### IT-11: DELETE /api/users/{id} - ToDo担当者解除

| 項目 | 内容 |
|------|------|
| テストケースID | IT-11 |
| テスト観点 | ユーザー削除時にToDoの担当者がNULLになること |
| エンドポイント | `DELETE /api/users/1` |
| 前提条件 | ID=1のユーザーがToDoに担当者として設定されている |
| リクエスト | なし |
| 期待結果 | ステータス: 204, ToDoのassigneeIdがnull |

---

### 4.2 TodoController APIテスト（変更分）

#### IT-20: POST /api/todos - 担当者付き作成

| 項目 | 内容 |
|------|------|
| テストケースID | IT-20 |
| テスト観点 | 担当者付きでToDoが作成できること |
| エンドポイント | `POST /api/todos` |
| 前提条件 | ID=1のユーザーが存在する |
| リクエスト | `{"title": "テスト", "assigneeId": 1}` |
| 期待結果 | ステータス: 201, assigneeId=1, assigneeName="山田太郎" |

#### IT-21: POST /api/todos - 担当者なし作成

| 項目 | 内容 |
|------|------|
| テストケースID | IT-21 |
| テスト観点 | 担当者なしでToDoが作成できること |
| エンドポイント | `POST /api/todos` |
| 前提条件 | なし |
| リクエスト | `{"title": "テスト"}` |
| 期待結果 | ステータス: 201, assigneeId=null |

#### IT-22: POST /api/todos - 異常系（存在しない担当者）

| 項目 | 内容 |
|------|------|
| テストケースID | IT-22 |
| テスト観点 | 存在しない担当者IDで400が返却されること |
| エンドポイント | `POST /api/todos` |
| 前提条件 | ID=999のユーザーは存在しない |
| リクエスト | `{"title": "テスト", "assigneeId": 999}` |
| 期待結果 | ステータス: 400 |

#### IT-23: PUT /api/todos/{id} - 担当者変更

| 項目 | 内容 |
|------|------|
| テストケースID | IT-23 |
| テスト観点 | ToDoの担当者を変更できること |
| エンドポイント | `PUT /api/todos/1` |
| 前提条件 | ID=1のToDo(assigneeId=1)が存在する |
| リクエスト | `{"title": "テスト", "assigneeId": 2}` |
| 期待結果 | ステータス: 200, assigneeId=2 |

#### IT-24: PUT /api/todos/{id} - 担当者解除

| 項目 | 内容 |
|------|------|
| テストケースID | IT-24 |
| テスト観点 | ToDoの担当者を解除できること |
| エンドポイント | `PUT /api/todos/1` |
| 前提条件 | ID=1のToDo(assigneeId=1)が存在する |
| リクエスト | `{"title": "テスト", "assigneeId": null}` |
| 期待結果 | ステータス: 200, assigneeId=null |

#### IT-25: GET /api/todos - 担当者情報取得

| 項目 | 内容 |
|------|------|
| テストケースID | IT-25 |
| テスト観点 | ToDo一覧に担当者名が含まれること |
| エンドポイント | `GET /api/todos` |
| 前提条件 | assigneeId=1のToDoが存在する |
| リクエスト | なし |
| 期待結果 | ステータス: 200, assigneeName="山田太郎" |

---

## 5. 後方互換性テスト

### 5.1 既存機能の動作確認

#### IT-30: 既存ToDo機能 - 作成

| 項目 | 内容 |
|------|------|
| テストケースID | IT-30 |
| テスト観点 | 既存のToDo作成が正常に動作すること |
| エンドポイント | `POST /api/todos` |
| 前提条件 | なし |
| リクエスト | `{"title": "テスト", "description": "説明"}` |
| 期待結果 | ステータス: 201 |

#### IT-31: 既存ToDo機能 - 完了切替

| 項目 | 内容 |
|------|------|
| テストケースID | IT-31 |
| テスト観点 | 既存の完了切替が正常に動作すること |
| エンドポイント | `PATCH /api/todos/1/toggle` |
| 前提条件 | ID=1のToDoが存在する |
| リクエスト | なし |
| 期待結果 | ステータス: 200, completedが反転 |

#### IT-32: 既存ToDo機能 - 削除

| 項目 | 内容 |
|------|------|
| テストケースID | IT-32 |
| テスト観点 | 既存のToDo削除が正常に動作すること |
| エンドポイント | `DELETE /api/todos/1` |
| 前提条件 | ID=1のToDoが存在する |
| リクエスト | なし |
| 期待結果 | ステータス: 204 |

---

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

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-22 | 初版作成 | - |
