# バックエンドテスト仕様書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 作成者 | システム管理者 |
| 関連詳細設計書 | [detail-design-api.md](./detail-design-api.md), [detail-design-logic.md](./detail-design-logic.md), [detail-design-sql.md](./detail-design-sql.md) |

---

## 1. テスト概要

### 1.1 テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| TodoCommentMapper | 新規 | コメントデータアクセス層 |
| TodoCommentService | 新規 | コメントビジネスロジック層 |
| TodoCommentController | 新規 | コメントREST API層 |
| TODOCOMMENTテーブル | 新規 | コメントデータ永続化 |

### 1.2 テスト方針

**TDD（テスト駆動開発）アプローチ**:
1. テストケースを先に作成
2. 最小限の実装でテストをパス
3. リファクタリング

**カバレッジ目標**:
- Mapper層: 100%（全SQLパターン）
- Service層: 90%以上（ビジネスロジック網羅）
- Controller層: 80%以上（主要APIパス網羅）

### 1.3 テスト戦略

| テストレベル | 対象 | 責務 | 実行タイミング |
|---------|------|------|---------------|
| 単体テスト | Mapper層 | SQL正常動作確認 | 開発中 |
| 統合テスト | Service + Mapper + DB | ビジネスロジック確認 | 開発中 |
| APIテスト | Controller + 全層 | REST API動作確認 | 統合後 |

---

## 2. 単体テスト（Mapper層）

### 2.1 TodoCommentMapperTest

**テスト対象**: `com.example.demo.TodoCommentMapper`

**ファイル**: `src/test/java/com/example/demo/TodoCommentMapperTest.java`

#### MT-COM-001: selectByTodoId - 正常系（コメント複数件）

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-001 |
| テスト観点 | ToDoIDでコメント一覧を取得、新しい順にソート |
| 分類 | 正常系 |
| 前提条件 | TODO(ID=1)が存在、TODOCOMMENT 3件（ID=1,2,3）が存在 |
| 入力値 | todoId: 1 |
| 期待結果 | 3件取得、新しい順（ID: 3, 2, 1）、userNameが結合済み |
| 確認方法 | `assertThat(comments).hasSize(3)`<br>`assertThat(comments.get(0).getId()).isEqualTo(3L)` |

#### MT-COM-002: selectByTodoId - 正常系（コメント0件）

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-002 |
| テスト観点 | コメントが存在しないToDoIDで空リスト取得 |
| 分類 | 正常系 |
| 前提条件 | TODO(ID=99)が存在、コメント0件 |
| 入力値 | todoId: 99 |
| 期待結果 | 空リスト（サイズ0） |
| 確認方法 | `assertThat(comments).isEmpty()` |

#### MT-COM-003: selectById - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-003 |
| テスト観点 | IDでコメントを1件取得、userNameがJOIN結合済み |
| 分類 | 正常系 |
| 前提条件 | TODOCOMMENT(ID=1)が存在、USER(ID=1, name="山田太郎")が存在 |
| 入力値 | id: 1 |
| 期待結果 | コメント取得、userName="山田太郎" |
| 確認方法 | `assertThat(comment.getId()).isEqualTo(1L)`<br>`assertThat(comment.getUserName()).isEqualTo("山田太郎")` |

#### MT-COM-004: selectById - 正常系（ユーザー削除済み）

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-004 |
| テスト観点 | ユーザーが削除されたコメントでもuserIdがnull、userNameがnullで取得 |
| 分類 | 正常系 |
| 前提条件 | TODOCOMMENT(ID=2, userId=null)が存在 |
| 入力値 | id: 2 |
| 期待結果 | コメント取得、userId=null、userName=null |
| 確認方法 | `assertThat(comment.getUserId()).isNull()`<br>`assertThat(comment.getUserName()).isNull()` |

#### MT-COM-005: selectById - 存在しないID

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-005 |
| テスト観点 | 存在しないIDでnull取得 |
| 分類 | 境界値 |
| 前提条件 | TODOCOMMENT(ID=999)が存在しない |
| 入力値 | id: 999 |
| 期待結果 | null |
| 確認方法 | `assertThat(comment).isNull()` |

#### MT-COM-006: insert - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-006 |
| テスト観点 | コメント挿入、ID自動採番、createdAt自動設定 |
| 分類 | 正常系 |
| 前提条件 | TODO(ID=1)が存在、USER(ID=1)が存在 |
| 入力値 | TodoComment(todoId=1, userId=1, content="テストコメント") |
| 期待結果 | 挿入成功、comment.idが自動採番、comment.createdAtが設定済み |
| 確認方法 | `assertThat(comment.getId()).isNotNull()`<br>`assertThat(comment.getCreatedAt()).isNotNull()` |

#### MT-COM-007: deleteById - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-007 |
| テスト観点 | ID指定でコメント削除 |
| 分類 | 正常系 |
| 前提条件 | TODOCOMMENT(ID=1)が存在 |
| 入力値 | id: 1 |
| 期待結果 | 削除成功（戻り値1）、selectById(1)でnull |
| 確認方法 | `assertThat(deletedCount).isEqualTo(1)`<br>`assertThat(mapper.selectById(1L)).isNull()` |

#### MT-COM-008: deleteById - 存在しないID

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-008 |
| テスト観点 | 存在しないID指定で削除件数0 |
| 分類 | 境界値 |
| 前提条件 | TODOCOMMENT(ID=999)が存在しない |
| 入力値 | id: 999 |
| 期待結果 | 削除件数0 |
| 確認方法 | `assertThat(deletedCount).isEqualTo(0)` |

#### MT-COM-009: countByTodoId - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | MT-COM-009 |
| テスト観点 | ToDoIDでコメント数を取得 |
| 分類 | 正常系 |
| 前提条件 | TODO(ID=1)に3件のコメントが存在 |
| 入力値 | todoId: 1 |
| 期待結果 | 3 |
| 確認方法 | `assertThat(count).isEqualTo(3)` |

---

## 3. 統合テスト（Service層）

### 3.1 TodoCommentServiceTest

**テスト対象**: `com.example.demo.TodoCommentService`

**ファイル**: `src/test/java/com/example/demo/TodoCommentServiceTest.java`

#### ST-COM-001: getCommentsByTodoId - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-001 |
| テスト観点 | 存在するToDoIDでコメント一覧を取得 |
| 分類 | 正常系 |
| 前提条件 | TODO(ID=1)が存在、TODOCOMMENT 2件が存在 |
| 入力値 | todoId: 1 |
| 期待結果 | 2件のコメント取得 |
| 確認方法 | `assertThat(comments).hasSize(2)` |

#### ST-COM-002: getCommentsByTodoId - ToDoが存在しない

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-002 |
| テスト観点 | 存在しないToDoIDで404エラー |
| 分類 | 異常系 |
| 前提条件 | TODO(ID=999)が存在しない |
| 入力値 | todoId: 999 |
| 期待結果 | ResponseStatusException (404) |
| 確認方法 | `assertThatThrownBy(...).isInstanceOf(ResponseStatusException.class)`<br>`.extracting("status").isEqualTo(HttpStatus.NOT_FOUND)` |

#### ST-COM-003: createComment - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-003 |
| テスト観点 | 正常なリクエストでコメント作成 |
| 分類 | 正常系 |
| 前提条件 | TODO(ID=1)が存在、USER(ID=1)が存在 |
| 入力値 | todoId: 1, CreateCommentRequest(userId=1, content="テスト") |
| 期待結果 | コメント作成成功、userName付きで返却 |
| 確認方法 | `assertThat(created.getId()).isNotNull()`<br>`assertThat(created.getUserName()).isEqualTo("山田太郎")` |

#### ST-COM-004: createComment - content未入力

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-004 |
| テスト観点 | content未入力で400エラー |
| 分類 | 異常系 |
| 前提条件 | TODO(ID=1)が存在 |
| 入力値 | todoId: 1, CreateCommentRequest(userId=1, content="") |
| 期待結果 | ResponseStatusException (400, "Content is required") |
| 確認方法 | `assertThatThrownBy(...).isInstanceOf(ResponseStatusException.class)`<br>`.extracting("status").isEqualTo(HttpStatus.BAD_REQUEST)` |

#### ST-COM-005: createComment - content2000文字超過

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-005 |
| テスト観点 | content2000文字超過で400エラー |
| 分類 | 異常系 |
| 前提条件 | TODO(ID=1)が存在 |
| 入力値 | todoId: 1, CreateCommentRequest(userId=1, content="a".repeat(2001)) |
| 期待結果 | ResponseStatusException (400, "Content must be 2000 characters or less") |
| 確認方法 | `assertThatThrownBy(...).message().contains("2000 characters")` |

#### ST-COM-006: createComment - userId未入力

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-006 |
| テスト観点 | userId未入力で400エラー |
| 分類 | 異常系 |
| 前提条件 | TODO(ID=1)が存在 |
| 入力値 | todoId: 1, CreateCommentRequest(userId=null, content="テスト") |
| 期待結果 | ResponseStatusException (400, "User ID is required") |
| 確認方法 | `assertThatThrownBy(...).message().contains("User ID")` |

#### ST-COM-007: createComment - 存在しないユーザーID

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-007 |
| テスト観点 | 存在しないuserIdで400エラー |
| 分類 | 異常系 |
| 前提条件 | TODO(ID=1)が存在、USER(ID=999)が存在しない |
| 入力値 | todoId: 1, CreateCommentRequest(userId=999, content="テスト") |
| 期待結果 | ResponseStatusException (400, "User not found") |
| 確認方法 | `assertThatThrownBy(...).message().contains("User not found")` |

#### ST-COM-008: createComment - 存在しないToDoID

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-008 |
| テスト観点 | 存在しないtodoIdで404エラー |
| 分類 | 異常系 |
| 前提条件 | TODO(ID=999)が存在しない、USER(ID=1)が存在 |
| 入力値 | todoId: 999, CreateCommentRequest(userId=1, content="テスト") |
| 期待結果 | ResponseStatusException (404, "Todo not found") |
| 確認方法 | `assertThatThrownBy(...).extracting("status").isEqualTo(HttpStatus.NOT_FOUND)` |

#### ST-COM-009: deleteComment - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-009 |
| テスト観点 | 存在するコメントIDで削除成功 |
| 分類 | 正常系 |
| 前提条件 | TODOCOMMENT(ID=1)が存在 |
| 入力値 | id: 1 |
| 期待結果 | 削除成功（例外なし） |
| 確認方法 | `assertThatCode(() -> service.deleteComment(1L)).doesNotThrowAnyException()` |

#### ST-COM-010: deleteComment - 存在しないID

| 項目 | 内容 |
|------|------|
| テストケースID | ST-COM-010 |
| テスト観点 | 存在しないコメントIDで404エラー |
| 分類 | 異常系 |
| 前提条件 | TODOCOMMENT(ID=999)が存在しない |
| 入力値 | id: 999 |
| 期待結果 | ResponseStatusException (404, "Comment not found") |
| 確認方法 | `assertThatThrownBy(...).extracting("status").isEqualTo(HttpStatus.NOT_FOUND)` |

---

## 4. APIテスト（Controller層）

### 4.1 TodoCommentControllerTest

**テスト対象**: `com.example.demo.TodoCommentController`

**ファイル**: `src/test/java/com/example/demo/TodoCommentControllerTest.java`

#### CT-COM-001: GET /api/todos/{todoId}/comments - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | CT-COM-001 |
| テスト観点 | コメント一覧取得API |
| エンドポイント | `GET /api/todos/1/comments` |
| 前提条件 | TODO(ID=1)が存在、TODOCOMMENT 2件が存在 |
| パスパラメータ | todoId: 1 |
| 期待結果 | ステータス: 200<br>レスポンス: 2件のコメント配列、新しい順 |
| 確認方法 | `mockMvc.perform(get(...)).andExpect(status().isOk())`<br>`.andExpect(jsonPath("$.length()").value(2))` |

#### CT-COM-002: GET /api/todos/{todoId}/comments - ToDoが存在しない

| 項目 | 内容 |
|------|------|
| テストケースID | CT-COM-002 |
| テスト観点 | 存在しないToDoIDで404エラー |
| 分類 | 異常系 |
| エンドポイント | `GET /api/todos/999/comments` |
| パスパラメータ | todoId: 999 |
| 期待結果 | ステータス: 404 |
| 確認方法 | `mockMvc.perform(get(...)).andExpect(status().isNotFound())` |

#### CT-COM-003: POST /api/todos/{todoId}/comments - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | CT-COM-003 |
| テスト観点 | コメント作成API |
| エンドポイント | `POST /api/todos/1/comments` |
| 前提条件 | TODO(ID=1)が存在、USER(ID=1)が存在 |
| リクエスト | `{"userId": 1, "content": "テストコメント"}` |
| 期待結果 | ステータス: 201<br>レスポンス: 作成されたコメント（id, userName付き） |
| 確認方法 | `mockMvc.perform(post(...)).andExpect(status().isCreated())`<br>`.andExpect(jsonPath("$.id").exists())`<br>`.andExpect(jsonPath("$.userName").value("山田太郎"))` |

#### CT-COM-E001: POST /api/todos/{todoId}/comments - content未入力

| 項目 | 内容 |
|------|------|
| テストケースID | CT-COM-E001 |
| テスト観点 | content未入力で400エラー |
| 分類 | 異常系 |
| エンドポイント | `POST /api/todos/1/comments` |
| リクエスト | `{"userId": 1, "content": ""}` |
| 期待結果 | ステータス: 400 |
| 確認方法 | `mockMvc.perform(post(...)).andExpect(status().isBadRequest())` |

#### CT-COM-E002: POST /api/todos/{todoId}/comments - 存在しないToDo

| 項目 | 内容 |
|------|------|
| テストケースID | CT-COM-E002 |
| テスト観点 | 存在しないToDoIDで404エラー |
| 分類 | 異常系 |
| エンドポイント | `POST /api/todos/999/comments` |
| リクエスト | `{"userId": 1, "content": "テスト"}` |
| 期待結果 | ステータス: 404 |
| 確認方法 | `mockMvc.perform(post(...)).andExpect(status().isNotFound())` |

#### CT-COM-004: DELETE /api/comments/{id} - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | CT-COM-004 |
| テスト観点 | コメント削除API |
| エンドポイント | `DELETE /api/comments/1` |
| 前提条件 | TODOCOMMENT(ID=1)が存在 |
| パスパラメータ | id: 1 |
| 期待結果 | ステータス: 204（No Content） |
| 確認方法 | `mockMvc.perform(delete(...)).andExpect(status().isNoContent())` |

#### CT-COM-E003: DELETE /api/comments/{id} - 存在しないID

| 項目 | 内容 |
|------|------|
| テストケースID | CT-COM-E003 |
| テスト観点 | 存在しないコメントIDで404エラー |
| 分類 | 異常系 |
| エンドポイント | `DELETE /api/comments/999` |
| パスパラメータ | id: 999 |
| 期待結果 | ステータス: 404 |
| 確認方法 | `mockMvc.perform(delete(...)).andExpect(status().isNotFound())` |

---

## 5. テストケース一覧

| ID | 対象 | テスト観点 | 分類 | 優先度 | ステータス |
|----|------|-----------|------|--------|-----------|
| MT-COM-001 | Mapper.selectByTodoId | 複数件取得、新しい順 | 正常系 | 高 | 未実施 |
| MT-COM-002 | Mapper.selectByTodoId | 0件取得 | 正常系 | 中 | 未実施 |
| MT-COM-003 | Mapper.selectById | 1件取得、JOIN結合 | 正常系 | 高 | 未実施 |
| MT-COM-004 | Mapper.selectById | ユーザー削除済み | 正常系 | 中 | 未実施 |
| MT-COM-005 | Mapper.selectById | 存在しないID | 境界値 | 中 | 未実施 |
| MT-COM-006 | Mapper.insert | 挿入、自動採番 | 正常系 | 高 | 未実施 |
| MT-COM-007 | Mapper.deleteById | 削除成功 | 正常系 | 高 | 未実施 |
| MT-COM-008 | Mapper.deleteById | 存在しないID | 境界値 | 低 | 未実施 |
| MT-COM-009 | Mapper.countByTodoId | 件数取得 | 正常系 | 中 | 未実施 |
| ST-COM-001 | Service.getComments | 一覧取得成功 | 正常系 | 高 | 未実施 |
| ST-COM-002 | Service.getComments | ToDo未存在 | 異常系 | 高 | 未実施 |
| ST-COM-003 | Service.createComment | 作成成功 | 正常系 | 高 | 未実施 |
| ST-COM-004 | Service.createComment | content未入力 | 異常系 | 高 | 未実施 |
| ST-COM-005 | Service.createComment | content超過 | 異常系 | 高 | 未実施 |
| ST-COM-006 | Service.createComment | userId未入力 | 異常系 | 高 | 未実施 |
| ST-COM-007 | Service.createComment | User未存在 | 異常系 | 高 | 未実施 |
| ST-COM-008 | Service.createComment | ToDo未存在 | 異常系 | 高 | 未実施 |
| ST-COM-009 | Service.deleteComment | 削除成功 | 正常系 | 高 | 未実施 |
| ST-COM-010 | Service.deleteComment | Comment未存在 | 異常系 | 高 | 未実施 |
| CT-COM-001 | GET /api/.../comments | 一覧取得 | 正常系 | 高 | 未実施 |
| CT-COM-002 | GET /api/.../comments | ToDo未存在 | 異常系 | 高 | 未実施 |
| CT-COM-003 | POST /api/.../comments | 作成成功 | 正常系 | 高 | 未実施 |
| CT-COM-E001 | POST /api/.../comments | content未入力 | 異常系 | 高 | 未実施 |
| CT-COM-E002 | POST /api/.../comments | ToDo未存在 | 異常系 | 高 | 未実施 |
| CT-COM-004 | DELETE /api/comments/{id} | 削除成功 | 正常系 | 高 | 未実施 |
| CT-COM-E003 | DELETE /api/comments/{id} | Comment未存在 | 異常系 | 高 | 未実施 |

**合計**: 26テストケース

---

## 6. テストデータ

### 6.1 テストデータ一覧

| データID | 用途 | 内容 |
|---------|------|------|
| BTD-TODO-001 | 正常系テスト用 | TODO(ID=1, title="テストToDo1") |
| BTD-TODO-002 | 正常系テスト用 | TODO(ID=2, title="テストToDo2") |
| BTD-USER-001 | 正常系テスト用 | USER(ID=1, name="山田太郎") |
| BTD-USER-002 | 正常系テスト用 | USER(ID=2, name="鈴木花子") |
| BTD-COM-001 | 正常系テスト用 | TODOCOMMENT(ID=1, todoId=1, userId=1, content="コメント1") |
| BTD-COM-002 | 正常系テスト用 | TODOCOMMENT(ID=2, todoId=1, userId=2, content="コメント2") |
| BTD-COM-003 | 正常系テスト用 | TODOCOMMENT(ID=3, todoId=1, userId=1, content="コメント3") |
| BTD-COM-DEL | ユーザー削除済み | TODOCOMMENT(ID=4, todoId=1, userId=null, content="削除されたユーザーのコメント") |

### 6.2 SQL初期化スクリプト

```sql
-- TODOテストデータ
DELETE FROM TODO;
INSERT INTO TODO (ID, TITLE, DESCRIPTION, COMPLETED) VALUES
(1, 'テストToDo1', 'テスト用のToDo', FALSE),
(2, 'テストToDo2', 'テスト用のToDo', FALSE);

-- USERテストデータ
DELETE FROM USER;
INSERT INTO USER (ID, NAME) VALUES
(1, '山田太郎'),
(2, '鈴木花子');

-- TODOCOMMENTテストデータ
DELETE FROM TODOCOMMENT;
INSERT INTO TODOCOMMENT (ID, TODO_ID, USER_ID, CONTENT, CREATED_AT) VALUES
(1, 1, 1, 'コメント1', '2025-12-25 10:00:00'),
(2, 1, 2, 'コメント2', '2025-12-25 11:00:00'),
(3, 1, 1, 'コメント3', '2025-12-25 12:00:00'),
(4, 1, NULL, '削除されたユーザーのコメント', '2025-12-25 09:00:00');
```

---

## 7. テスト環境

### 7.1 必要な環境

- JUnit 5
- Spring Boot Test
- MyBatis Test
- H2 インメモリデータベース
- AssertJ
- Mockito
- MockMvc

### 7.2 テスト用アノテーション

| レイヤー | アノテーション |
|---------|---------------|
| Mapper層 | `@MybatisTest`, `@AutoConfigureTestDatabase(replace = Replace.NONE)` |
| Service層 | `@SpringBootTest`, `@Transactional` |
| Controller層 | `@SpringBootTest`, `@AutoConfigureMockMvc`, `@Transactional` |

### 7.3 テスト用application.properties

```properties
# src/test/resources/application-test.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.sql.init.mode=always
logging.level.com.example.demo=DEBUG
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
