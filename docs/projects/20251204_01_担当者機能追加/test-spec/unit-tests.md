[← 目次に戻る](./README.md)

# 単体テスト

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
