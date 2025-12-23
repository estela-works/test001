# 実装ガイド

Spring Boot + MyBatis プロジェクト向けの実装ガイドです。

## 目次

1. [実装テンプレートの使い方](#実装テンプレートの使い方)
2. [レイヤー構成](#レイヤー構成)
3. [新規エンティティ追加手順](#新規エンティティ追加手順)
4. [コーディング規約](#コーディング規約)
5. [よくあるパターン](#よくあるパターン)

---

## 実装テンプレートの使い方

### テンプレートファイル一覧

| ファイル | 用途 | 配置場所 |
|---------|------|---------|
| `EntityTemplate.java` | エンティティクラス | `src/main/java/.../template/` |
| `MapperTemplate.java` | Mapperインターフェース | `src/main/java/.../template/` |
| `MapperTemplate.xml` | Mapper XML | `src/main/resources/mapper/template/` |
| `ServiceTemplate.java` | Serviceクラス | `src/main/java/.../template/` |
| `ControllerTemplate.java` | Controllerクラス | `src/main/java/.../template/` |

### プレースホルダー置換ルール

| プレースホルダー | 置換内容 | 例 |
|----------------|---------|-----|
| `{Entity}` | エンティティ名（パスカルケース） | `User`, `Todo`, `Project` |
| `{entity}` | エンティティ名（キャメルケース） | `user`, `todo`, `project` |
| `{entities}` | APIパス名（複数形） | `users`, `todos`, `projects` |
| `{TABLE_NAME}` | テーブル名 | `APP_USER`, `TODO`, `PROJECT` |

---

## レイヤー構成

### アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                      Controller層                            │
│  - REST API エンドポイント                                    │
│  - リクエスト/レスポンスのハンドリング                          │
│  - バリデーション（入力チェック）                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service層                              │
│  - ビジネスロジック                                           │
│  - トランザクション管理                                        │
│  - バリデーション（業務ルール）                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Mapper層                               │
│  - データアクセス（SQL実行）                                   │
│  - エンティティへのマッピング                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                                │
│  - H2 Database                                               │
└─────────────────────────────────────────────────────────────┘
```

### 各層の責務

| 層 | 責務 | やること | やらないこと |
|---|------|---------|------------|
| Controller | HTTPハンドリング | ステータスコード返却、JSON変換 | ビジネスロジック |
| Service | ビジネスロジック | 業務ルール適用、トランザクション | SQL発行 |
| Mapper | データアクセス | SQL実行、マッピング | ビジネスロジック |
| Entity | データ表現 | フィールド保持、Getter/Setter | ロジック |

---

## 新規エンティティ追加手順

### Step 1: テーブル定義

`src/main/resources/schema.sql` にテーブルを追加:

```sql
-- 新規テーブル
CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    DESCRIPTION VARCHAR(1000),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP
);
```

### Step 2: Entity作成

1. `EntityTemplate.java` をコピー
2. `{Entity}.java` にリネーム
3. プレースホルダーを置換
4. フィールドをテーブル定義に合わせて修正

```java
// 例: User.java
public class User {
    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    // Getter/Setter...
}
```

### Step 3: Mapper作成

1. `MapperTemplate.java` をコピー → `{Entity}Mapper.java`
2. `MapperTemplate.xml` をコピー → `src/main/resources/mapper/{Entity}Mapper.xml`
3. プレースホルダーを置換
4. 必要なメソッドのコメントを解除

```java
// 例: UserMapper.java
@Mapper
public interface UserMapper {
    List<User> selectAll();
    User selectById(Long id);
    void insert(User user);
    void update(User user);
    void deleteById(Long id);
    int count();
}
```

### Step 4: Service作成

1. `ServiceTemplate.java` をコピー → `{Entity}Service.java`
2. プレースホルダーを置換
3. 必要なメソッドのコメントを解除
4. ビジネスロジックを実装

```java
// 例: UserService.java
@Service
public class UserService {
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public List<User> getAllUsers() {
        return userMapper.selectAll();
    }
    // 他のメソッド...
}
```

### Step 5: Controller作成

1. `ControllerTemplate.java` をコピー → `{Entity}Controller.java`
2. プレースホルダーを置換
3. 必要なエンドポイントのコメントを解除

```java
// 例: UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    // 他のエンドポイント...
}
```

### Step 6: テスト作成

[テストガイド](../testing/TEST_GUIDE.md) を参照してテストを作成:

1. `MapperTestTemplate.java` → `{Entity}MapperTest.java`
2. `ServiceTestTemplate.java` → `{Entity}ServiceTest.java`
3. `ControllerTestTemplate.java` → `{Entity}ControllerTest.java`

---

## コーディング規約

### 命名規則

| 対象 | 規則 | 例 |
|-----|------|-----|
| クラス名 | パスカルケース | `UserController`, `TodoService` |
| メソッド名 | キャメルケース | `getAllUsers`, `createTodo` |
| 変数名 | キャメルケース | `userId`, `createdAt` |
| 定数 | スネークケース（大文字） | `MAX_COUNT`, `DEFAULT_STATUS` |
| テーブル名 | スネークケース（大文字） | `APP_USER`, `TODO` |
| カラム名 | スネークケース（大文字） | `CREATED_AT`, `USER_ID` |

### Javadoc

```java
/**
 * ユーザーを作成
 *
 * <p>重複チェックを行った後、データを永続化。</p>
 *
 * @param user 作成するユーザー
 * @return 作成されたユーザー（IDが自動採番される）
 * @throws DuplicateException メールアドレスが重複している場合
 */
public User createUser(User user) {
    // 実装
}
```

### HTTPステータスコード

| 操作 | 成功時 | エラー時 |
|-----|-------|---------|
| GET (一覧) | 200 OK | - |
| GET (単体) | 200 OK | 404 Not Found |
| POST | 201 Created | 400 Bad Request, 409 Conflict |
| PUT | 200 OK | 400 Bad Request, 404 Not Found |
| PATCH | 200 OK | 404 Not Found |
| DELETE | 204 No Content | 404 Not Found |

---

## よくあるパターン

### バリデーション

```java
// Controller層: 入力チェック
@PostMapping
public ResponseEntity<User> createUser(@RequestBody User user) {
    if (user.getName() == null || user.getName().trim().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }
    // ...
}

// Service層: 業務ルールチェック
public User createUser(User user) {
    // 重複チェック
    if (userMapper.selectByEmail(user.getEmail()) != null) {
        throw new DuplicateException("メールアドレスが既に登録されています");
    }
    // ...
}
```

### 日付範囲チェック

```java
private void validateDateRange(LocalDate startDate, LocalDate endDate) {
    if (startDate != null && endDate != null) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("終了日は開始日以降である必要があります");
        }
    }
}
```

### 外部キーの存在チェック

```java
@PostMapping
public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
    // 担当者IDが指定されている場合、存在チェック
    if (todo.getAssigneeId() != null) {
        if (userService.getUserById(todo.getAssigneeId()) == null) {
            return ResponseEntity.badRequest().build();
        }
    }
    // ...
}
```

### カスケード削除

```java
public void deleteProject(Long id) {
    // 子エンティティを先に削除
    todoMapper.deleteByProjectId(id);
    // 親エンティティを削除
    projectMapper.deleteById(id);
}
```

### JOINによる関連データ取得

```xml
<!-- Mapper XML -->
<select id="selectById" resultType="com.example.demo.Todo">
    SELECT
        T.ID,
        T.TITLE,
        T.ASSIGNEE_ID,
        U.NAME AS ASSIGNEE_NAME
    FROM
        TODO T
    LEFT JOIN
        APP_USER U ON T.ASSIGNEE_ID = U.ID
    WHERE
        T.ID = #{id}
</select>
```

### 動的SQL

```xml
<select id="selectByCondition" resultType="com.example.demo.Todo">
    SELECT * FROM TODO
    <where>
        <if test="status != null">
            AND STATUS = #{status}
        </if>
        <if test="assigneeId != null">
            AND ASSIGNEE_ID = #{assigneeId}
        </if>
    </where>
    ORDER BY CREATED_AT DESC
</select>
```

---

## ファイル配置

```
src/
├── main/
│   ├── java/com/example/demo/
│   │   ├── template/                    # 実装テンプレート
│   │   │   ├── ControllerTemplate.java
│   │   │   ├── ServiceTemplate.java
│   │   │   ├── MapperTemplate.java
│   │   │   └── EntityTemplate.java
│   │   ├── {Entity}.java                # エンティティ
│   │   ├── {Entity}Mapper.java          # Mapper
│   │   ├── {Entity}Service.java         # Service
│   │   └── {Entity}Controller.java      # Controller
│   └── resources/
│       ├── mapper/
│       │   ├── template/
│       │   │   └── MapperTemplate.xml   # Mapper XMLテンプレート
│       │   └── {Entity}Mapper.xml       # Mapper XML
│       ├── schema.sql                   # テーブル定義
│       └── data.sql                     # 初期データ
└── test/
    └── java/com/example/demo/
        ├── template/                    # テストテンプレート
        └── {Entity}*Test.java           # テストクラス
```

---

## 関連ドキュメント

- [テストガイド](../testing/TEST_GUIDE.md) - テストテンプレートの使い方
- [アーキテクチャ仕様書](../specs/architecture.md) - 技術構成の詳細
- [API一覧](../specs/api-catalog.md) - 全APIエンドポイント
