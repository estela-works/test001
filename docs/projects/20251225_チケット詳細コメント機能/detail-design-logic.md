# ロジック詳細設計書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 関連基本設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. 概要

### 1.1 本設計書の目的

コメント機能のビジネスロジック（Service層、Entity）の詳細仕様を定義する。

### 1.2 対象コンポーネント

| レイヤー | コンポーネント | 責務 |
|---------|---------------|------|
| Entity | TodoComment | コメントデータ構造定義 |
| Entity | CreateCommentRequest | コメント作成リクエストDTO |
| Mapper | TodoCommentMapper | データアクセスインターフェース |
| Service | TodoCommentService | コメントビジネスロジック |
| Controller | TodoCommentController | HTTPリクエスト処理 |

---

## 2. エンティティ設計

### 2.1 TodoComment

| 項目 | 内容 |
|------|------|
| パッケージ | `com.example.demo` |
| クラス名 | `TodoComment` |
| 種別 | Entity |
| 責務 | コメントデータ構造の定義 |

#### フィールド

| フィールド名 | 型 | 概要 | 初期値 | NULL許可 |
|-------------|-----|------|--------|---------|
| id | Long | コメントID | null | NO |
| todoId | Long | ToDoID | null | NO |
| userId | Long | 投稿者のユーザーID | null | YES |
| userName | String | 投稿者名（JOIN結果） | null | YES |
| content | String | コメント内容 | null | NO |
| createdAt | LocalDateTime | 投稿日時 | null | NO |

#### クラス定義

```java
package com.example.demo;

import java.time.LocalDateTime;

/**
 * ToDoコメントエンティティ
 */
public class TodoComment {

    /** コメントID */
    private Long id;

    /** ToDoID */
    private Long todoId;

    /** 投稿者のユーザーID */
    private Long userId;

    /** 投稿者名（JOIN結果、非永続化） */
    private String userName;

    /** コメント内容 */
    private String content;

    /** 投稿日時 */
    private LocalDateTime createdAt;

    // コンストラクタ
    public TodoComment() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTodoId() {
        return todoId;
    }

    public void setTodoId(Long todoId) {
        this.todoId = todoId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
```

---

### 2.2 CreateCommentRequest

| 項目 | 内容 |
|------|------|
| パッケージ | `com.example.demo` |
| クラス名 | `CreateCommentRequest` |
| 種別 | DTO（Data Transfer Object） |
| 責務 | コメント作成リクエストのデータ構造 |

#### フィールド

| フィールド名 | 型 | 概要 | 必須 |
|-------------|-----|------|------|
| userId | Long | 投稿者のユーザーID | 要 |
| content | String | コメント内容 | 要 |

#### クラス定義

```java
package com.example.demo;

/**
 * コメント作成リクエスト
 */
public class CreateCommentRequest {

    /** 投稿者のユーザーID */
    private Long userId;

    /** コメント内容 */
    private String content;

    // コンストラクタ
    public CreateCommentRequest() {
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
```

---

## 3. Mapperインターフェース設計

### 3.1 TodoCommentMapper

| 項目 | 内容 |
|------|------|
| パッケージ | `com.example.demo` |
| インターフェース名 | `TodoCommentMapper` |
| 種別 | Mapper（MyBatis） |
| 責務 | コメントデータアクセス |
| アノテーション | `@Mapper` |

#### メソッド一覧

| メソッド | 戻り値 | 引数 | 概要 |
|---------|--------|------|------|
| selectByTodoId | List\<TodoComment\> | Long todoId | ToDoIDでコメント一覧を取得 |
| selectById | TodoComment | Long id | IDでコメントを取得 |
| insert | void | TodoComment comment | コメントを挿入 |
| deleteById | int | Long id | IDでコメントを削除 |
| countByTodoId | int | Long todoId | ToDoIDでコメント数を取得 |

#### インターフェース定義

```java
package com.example.demo;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * ToDoコメントマッパー
 */
@Mapper
public interface TodoCommentMapper {

    /**
     * ToDoIDでコメント一覧を取得
     * @param todoId ToDoID
     * @return コメント一覧（新しい順）
     */
    List<TodoComment> selectByTodoId(Long todoId);

    /**
     * IDでコメントを取得
     * @param id コメントID
     * @return コメント（存在しない場合はnull）
     */
    TodoComment selectById(Long id);

    /**
     * コメントを挿入
     * @param comment コメント（idは自動採番される）
     */
    void insert(TodoComment comment);

    /**
     * IDでコメントを削除
     * @param id コメントID
     * @return 削除された行数
     */
    int deleteById(Long id);

    /**
     * ToDoIDでコメント数を取得
     * @param todoId ToDoID
     * @return コメント数
     */
    int countByTodoId(Long todoId);
}
```

---

## 4. Serviceクラス設計

### 4.1 TodoCommentService

| 項目 | 内容 |
|------|------|
| パッケージ | `com.example.demo` |
| クラス名 | `TodoCommentService` |
| 種別 | Service |
| 責務 | コメントビジネスロジック |
| アノテーション | `@Service` |

#### 依存関係

| フィールド名 | 型 | 注入方法 | 概要 |
|-------------|-----|---------|------|
| todoCommentMapper | TodoCommentMapper | コンストラクタインジェクション | コメントデータアクセス |
| todoMapper | TodoMapper | コンストラクタインジェクション | ToDoデータアクセス |
| userMapper | UserMapper | コンストラクタインジェクション | ユーザーデータアクセス |

#### メソッド詳細

##### getCommentsByTodoId

| 項目 | 内容 |
|------|------|
| シグネチャ | `List<TodoComment> getCommentsByTodoId(Long todoId)` |
| 概要 | ToDoIDでコメント一覧を取得 |
| 引数 | `todoId`: ToDoのID |
| 戻り値 | コメント一覧（新しい順） |
| 例外 | ResponseStatusException (404) - チケットが存在しない |

**処理フロー**:

1. `todoMapper.selectById(todoId)`でチケットの存在確認
2. チケットが存在しない場合は404エラーをスロー
3. `todoCommentMapper.selectByTodoId(todoId)`でコメント一覧を取得
4. コメント一覧を返却

**実装例**:

```java
public List<TodoComment> getCommentsByTodoId(Long todoId) {
    // チケットの存在確認
    Todo todo = todoMapper.selectById(todoId);
    if (todo == null) {
        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Todo not found"
        );
    }

    // コメント一覧を取得
    return todoCommentMapper.selectByTodoId(todoId);
}
```

##### createComment

| 項目 | 内容 |
|------|------|
| シグネチャ | `TodoComment createComment(Long todoId, CreateCommentRequest request)` |
| 概要 | コメントを作成 |
| 引数 | `todoId`: ToDoのID<br>`request`: コメント作成リクエスト |
| 戻り値 | 作成されたコメント |
| 例外 | ResponseStatusException (400) - バリデーションエラー<br>ResponseStatusException (404) - チケットまたはユーザーが存在しない |

**処理フロー**:

1. バリデーション実行
   - `content`が空またはnullの場合は400エラー
   - `content`が2000文字を超える場合は400エラー
   - `userId`がnullの場合は400エラー
2. `todoMapper.selectById(todoId)`でチケットの存在確認
   - 存在しない場合は404エラー
3. `userMapper.selectById(userId)`でユーザーの存在確認
   - 存在しない場合は400エラー
4. `TodoComment`オブジェクトを作成
5. `todoCommentMapper.insert(comment)`でコメントを挿入
6. `todoCommentMapper.selectById(comment.getId())`で作成されたコメントを取得（userName付き）
7. 作成されたコメントを返却

**実装例**:

```java
public TodoComment createComment(Long todoId, CreateCommentRequest request) {
    // バリデーション
    if (request.getContent() == null || request.getContent().trim().isEmpty()) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Content is required"
        );
    }
    if (request.getContent().length() > 2000) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Content must be 2000 characters or less"
        );
    }
    if (request.getUserId() == null) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "User ID is required"
        );
    }

    // チケットの存在確認
    Todo todo = todoMapper.selectById(todoId);
    if (todo == null) {
        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Todo not found"
        );
    }

    // ユーザーの存在確認
    User user = userMapper.selectById(request.getUserId());
    if (user == null) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "User not found"
        );
    }

    // コメントを作成
    TodoComment comment = new TodoComment();
    comment.setTodoId(todoId);
    comment.setUserId(request.getUserId());
    comment.setContent(request.getContent());

    // 挿入
    todoCommentMapper.insert(comment);

    // 作成されたコメントを取得（userName付き）
    return todoCommentMapper.selectById(comment.getId());
}
```

##### deleteComment

| 項目 | 内容 |
|------|------|
| シグネチャ | `void deleteComment(Long id)` |
| 概要 | コメントを削除 |
| 引数 | `id`: コメントID |
| 戻り値 | なし |
| 例外 | ResponseStatusException (404) - コメントが存在しない |

**処理フロー**:

1. `todoCommentMapper.selectById(id)`でコメントの存在確認
2. コメントが存在しない場合は404エラー
3. `todoCommentMapper.deleteById(id)`でコメントを削除

**実装例**:

```java
public void deleteComment(Long id) {
    // コメントの存在確認
    TodoComment comment = todoCommentMapper.selectById(id);
    if (comment == null) {
        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Comment not found"
        );
    }

    // 削除
    todoCommentMapper.deleteById(id);
}
```

#### 完全なクラス定義

```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * ToDoコメントサービス
 */
@Service
public class TodoCommentService {

    private final TodoCommentMapper todoCommentMapper;
    private final TodoMapper todoMapper;
    private final UserMapper userMapper;

    @Autowired
    public TodoCommentService(
            TodoCommentMapper todoCommentMapper,
            TodoMapper todoMapper,
            UserMapper userMapper) {
        this.todoCommentMapper = todoCommentMapper;
        this.todoMapper = todoMapper;
        this.userMapper = userMapper;
    }

    /**
     * ToDoIDでコメント一覧を取得
     * @param todoId ToDoのID
     * @return コメント一覧
     * @throws ResponseStatusException チケットが存在しない場合
     */
    public List<TodoComment> getCommentsByTodoId(Long todoId) {
        // チケットの存在確認
        Todo todo = todoMapper.selectById(todoId);
        if (todo == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Todo not found"
            );
        }

        return todoCommentMapper.selectByTodoId(todoId);
    }

    /**
     * コメントを作成
     * @param todoId ToDoのID
     * @param request コメント作成リクエスト
     * @return 作成されたコメント
     * @throws ResponseStatusException バリデーションエラー、またはリソース未発見
     */
    public TodoComment createComment(Long todoId, CreateCommentRequest request) {
        // バリデーション
        validateCreateCommentRequest(request);

        // チケットの存在確認
        validateTodoExists(todoId);

        // ユーザーの存在確認
        validateUserExists(request.getUserId());

        // コメントを作成
        TodoComment comment = new TodoComment();
        comment.setTodoId(todoId);
        comment.setUserId(request.getUserId());
        comment.setContent(request.getContent());

        todoCommentMapper.insert(comment);

        // 作成されたコメントを取得（userName付き）
        return todoCommentMapper.selectById(comment.getId());
    }

    /**
     * コメントを削除
     * @param id コメントID
     * @throws ResponseStatusException コメントが存在しない場合
     */
    public void deleteComment(Long id) {
        // コメントの存在確認
        TodoComment comment = todoCommentMapper.selectById(id);
        if (comment == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Comment not found"
            );
        }

        todoCommentMapper.deleteById(id);
    }

    // プライベートヘルパーメソッド

    private void validateCreateCommentRequest(CreateCommentRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Content is required"
            );
        }
        if (request.getContent().length() > 2000) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Content must be 2000 characters or less"
            );
        }
        if (request.getUserId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "User ID is required"
            );
        }
    }

    private void validateTodoExists(Long todoId) {
        Todo todo = todoMapper.selectById(todoId);
        if (todo == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Todo not found"
            );
        }
    }

    private void validateUserExists(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "User not found"
            );
        }
    }
}
```

---

## 5. ビジネスルール

### 5.1 ルール一覧

| ルールID | ルール内容 | 適用箇所 |
|---------|-----------|---------|
| BR-001 | コメント内容は必須 | TodoCommentService.createComment |
| BR-002 | コメント内容は最大2000文字 | TodoCommentService.createComment |
| BR-003 | 投稿者（userId）は必須 | TodoCommentService.createComment |
| BR-004 | 存在しないチケットにはコメント不可 | TodoCommentService.createComment |
| BR-005 | 存在しないユーザーでコメント不可 | TodoCommentService.createComment |
| BR-006 | 投稿日時は自動設定（変更不可） | TodoCommentMapper.insert (SQL) |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
