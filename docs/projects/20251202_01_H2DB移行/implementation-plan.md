# 実装計画（作業想定）

## 概要

このドキュメントは、H2 Database移行の実装計画（作業想定）を記載したものです。
実際の実装時の参考資料として活用してください。

---

## 選択技術

| 項目 | 選択 |
|------|------|
| データベース | H2 Database |
| 永続化 | ファイルモード（`./data/tododb`） |
| ORM | Spring Data JPA |

---

## 実装手順

### Step 1: 依存関係の追加

**ファイル**: `pom.xml`

```xml
<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- H2 Database -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

### Step 2: 設定ファイルの作成

**新規作成**: `src/main/resources/application.properties`

```properties
# H2 Database（ファイル永続化）
spring.datasource.url=jdbc:h2:file:./data/tododb;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA設定
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console（開発用）
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

---

### Step 3: Todo.javaのJPAエンティティ化

**ファイル**: `src/main/java/com/example/demo/Todo.java`

追加するアノテーション:

```java
import jakarta.persistence.*;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 既存のコンストラクタ、getter/setterはそのまま維持
}
```

---

### Step 4: TodoRepositoryの作成

**新規作成**: `src/main/java/com/example/demo/TodoRepository.java`

```java
package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByCompletedOrderByCreatedAtAsc(boolean completed);

    List<Todo> findAllByOrderByCreatedAtAsc();

    long countByCompleted(boolean completed);
}
```

---

### Step 5: TodoServiceの修正

**ファイル**: `src/main/java/com/example/demo/TodoService.java`

変更内容:
- `ConcurrentHashMap` / `AtomicLong` を削除
- `TodoRepository` をコンストラクタインジェクション
- 各メソッドを Repository 呼び出しに置き換え
- `@Transactional` アノテーション追加

```java
@Service
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional(readOnly = true)
    public List<Todo> getAllTodos() {
        return todoRepository.findAllByOrderByCreatedAtAsc();
    }

    @Transactional(readOnly = true)
    public List<Todo> getTodosByCompleted(boolean completed) {
        return todoRepository.findByCompletedOrderByCreatedAtAsc(completed);
    }

    @Transactional(readOnly = true)
    public Todo getTodoById(Long id) {
        return todoRepository.findById(id).orElse(null);
    }

    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Todo updatedTodo) {
        return todoRepository.findById(id)
            .map(existing -> {
                existing.setTitle(updatedTodo.getTitle());
                existing.setDescription(updatedTodo.getDescription());
                existing.setCompleted(updatedTodo.isCompleted());
                return todoRepository.save(existing);
            })
            .orElse(null);
    }

    public Todo toggleComplete(Long id) {
        return todoRepository.findById(id)
            .map(todo -> {
                todo.setCompleted(!todo.isCompleted());
                return todoRepository.save(todo);
            })
            .orElse(null);
    }

    public Todo deleteTodo(Long id) {
        return todoRepository.findById(id)
            .map(todo -> {
                todoRepository.deleteById(id);
                return todo;
            })
            .orElse(null);
    }

    public void deleteAllTodos() {
        todoRepository.deleteAll();
    }

    @Transactional(readOnly = true)
    public int getTotalCount() {
        return (int) todoRepository.count();
    }

    @Transactional(readOnly = true)
    public int getCompletedCount() {
        return (int) todoRepository.countByCompleted(true);
    }

    @Transactional(readOnly = true)
    public int getPendingCount() {
        return (int) todoRepository.countByCompleted(false);
    }
}
```

---

### Step 6: DataInitializerの作成

**新規作成**: `src/main/java/com/example/demo/DataInitializer.java`

```java
package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final TodoRepository todoRepository;

    public DataInitializer(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public void run(String... args) {
        if (todoRepository.count() == 0) {
            todoRepository.save(new Todo("Spring Bootの学習",
                "Spring Bootアプリケーションの基本を理解する"));
            todoRepository.save(new Todo("ToDoリストの実装",
                "REST APIとフロントエンドを実装する"));
            todoRepository.save(new Todo("プロジェクトのテスト",
                "作成したアプリケーションの動作確認"));

            System.out.println("初期データを投入しました（3件）");
        }
    }
}
```

---

### Step 7: テスト設定の追加

**新規作成**: `src/test/resources/application-test.properties`

```properties
# テスト用H2設定（インメモリモード）
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA設定（テスト用）
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# H2 Console無効化
spring.h2.console.enabled=false
```

---

### Step 8: TodoServiceTestの修正

**ファイル**: `src/test/java/com/example/demo/TodoServiceTest.java`

変更内容:
- `@SpringBootTest`, `@ActiveProfiles("test")`, `@Transactional` 追加
- `@Autowired` で TodoService / TodoRepository 注入
- `@BeforeEach` でデータ初期化

```java
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("TodoService 統合テスト")
class TodoServiceTest {

    @Autowired
    private TodoService todoService;

    @Autowired
    private TodoRepository todoRepository;

    @BeforeEach
    void setUp() {
        todoRepository.deleteAll();
        todoRepository.save(new Todo("Spring Bootの学習", "説明1"));
        todoRepository.save(new Todo("ToDoリストの実装", "説明2"));
        todoRepository.save(new Todo("プロジェクトのテスト", "説明3"));
    }

    // 各テストケースは既存のものをベースに修正
    // 注意: ID固定のテストは自動採番のため修正が必要
}
```

---

## 修正対象ファイル一覧

| ファイル | 操作 |
|---------|------|
| `pom.xml` | 修正 |
| `src/main/resources/application.properties` | 新規 |
| `src/main/java/com/example/demo/Todo.java` | 修正 |
| `src/main/java/com/example/demo/TodoRepository.java` | 新規 |
| `src/main/java/com/example/demo/TodoService.java` | 修正 |
| `src/main/java/com/example/demo/DataInitializer.java` | 新規 |
| `src/test/resources/application-test.properties` | 新規 |
| `src/test/java/com/example/demo/TodoServiceTest.java` | 修正 |

---

## 変更しないファイル

- `TodoController.java` - REST APIインターフェースは維持
- `HelloController.java`
- `static/todos.html`

---

## 動作確認手順

1. `mvnw spring-boot:run` でアプリ起動
2. http://localhost:8080/h2-console でDBコンソール確認
   - JDBC URL: `jdbc:h2:file:./data/tododb`
   - User: `sa`
   - Password: （空）
3. http://localhost:8080/todos.html で動作確認
4. アプリ再起動後もデータが保持されることを確認
5. `mvnw test` でテスト実行

---

## 注意事項

### テスト修正時の注意

- **ID固定テストの修正**: 自動採番のため `id=4` などの固定ID期待は削除し、`isNotNull()` で検証
- **NullPointerExceptionテスト**: JPAでは `Optional.empty()` を返すため、テストケースの修正または削除が必要

### データファイル

- `./data/tododb.mv.db` - H2のデータファイル
- `.gitignore` に追加を推奨

---

## 改版履歴

| 版数 | 日付 | 変更内容 |
|------|------|----------|
| 1.0 | 2025-12-22 | 初版作成 |
