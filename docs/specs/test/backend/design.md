# バックエンドテスト設計方針

> **ドキュメント種別**: 設計ガイドライン（継続的にメンテナンス）

## 1. 概要

本ドキュメントは、Spring Boot + MyBatisで構成されるバックエンドのテスト設計方針を定義する。

| 項目 | 内容 |
|------|------|
| 最終更新日 | 2026-01-08 |
| テストフレームワーク | JUnit 5 |
| モックライブラリ | Mockito |
| テストDB | H2 Database（インメモリ） |

---

## 2. レイヤー別テスト方針

### 2.1 テストレイヤー構成

```
┌─────────────────────────────────────────────────────────────┐
│                    Controller層テスト                        │
│        MockMvc / @WebMvcTest / @SpringBootTest              │
│               API仕様・HTTPレスポンス検証                    │
├─────────────────────────────────────────────────────────────┤
│                     Service層テスト                          │
│           @SpringBootTest / Mockito                         │
│            ビジネスロジック・例外処理検証                     │
├─────────────────────────────────────────────────────────────┤
│                     Mapper層テスト                           │
│              @MybatisTest / @SpringBootTest                 │
│               SQLクエリ・データアクセス検証                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 レイヤー別責務

| レイヤー | テスト対象 | モック対象 | テスト種別 |
|---------|-----------|-----------|-----------|
| Controller | API仕様、HTTP応答、バリデーション | Service | 単体 / 統合 |
| Service | ビジネスロジック、例外処理、トランザクション | Mapper（単体時） | 単体 / 統合 |
| Mapper | SQLクエリ、データ変換 | なし | 統合 |

---

## 3. Controller層テスト

### 3.1 目的

- REST APIが仕様通りに動作することを検証
- HTTPステータスコード、レスポンスボディの検証
- リクエストバリデーションの検証

### 3.2 テスト構成

```java
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;
}
```

### 3.3 検証項目

| 分類 | 検証内容 | 例 |
|------|---------|-----|
| 正常系 | 成功レスポンス | 200, 201, 204 |
| 異常系 | エラーレスポンス | 400, 404, 500 |
| バリデーション | 入力検証 | 必須項目、形式 |
| パラメータ | リクエストパラメータ | クエリ、パス、ボディ |

### 3.4 コード例

```java
@DisplayName("正常系: Todo一覧を取得できる")
@Test
void getAllTodos_正常系() throws Exception {
    // Act & Assert
    mockMvc.perform(get("/api/todos"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$[0].id").exists())
        .andExpect(jsonPath("$[0].title").exists());
}

@DisplayName("異常系: 存在しないIDで404エラー")
@Test
void getTodoById_異常系_存在しないID() throws Exception {
    // Arrange
    Long nonExistentId = 99999L;

    // Act & Assert
    mockMvc.perform(get("/api/todos/{id}", nonExistentId))
        .andExpect(status().isNotFound());
}

@DisplayName("バリデーション: タイトル必須")
@Test
void createTodo_バリデーション_タイトル必須() throws Exception {
    // Arrange
    TodoCreateRequest request = new TodoCreateRequest();
    request.setTitle(""); // 空文字

    // Act & Assert
    mockMvc.perform(post("/api/todos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
}
```

---

## 4. Service層テスト

### 4.1 目的

- ビジネスロジックの正確性を検証
- 例外処理の動作を検証
- トランザクション境界の確認

### 4.2 テスト構成

#### 統合テスト（推奨）

```java
@SpringBootTest
@Transactional
class TodoServiceTest {

    @Autowired
    private TodoService todoService;

    @Autowired
    private TodoMapper todoMapper;
}
```

#### 単体テスト（Mapper モック）

```java
@ExtendWith(MockitoExtension.class)
class TodoServiceUnitTest {

    @Mock
    private TodoMapper todoMapper;

    @InjectMocks
    private TodoService todoService;
}
```

### 4.3 検証項目

| 分類 | 検証内容 | 例 |
|------|---------|-----|
| 正常系 | 期待する戻り値 | 登録成功、更新成功 |
| 異常系 | 例外発生 | EntityNotFoundException |
| 境界値 | 限界値での動作 | 0件、最大件数 |
| 状態変化 | データの変化 | ステータス変更 |

### 4.4 コード例

```java
@DisplayName("正常系: IDでTodoを取得できる")
@Test
void getTodoById_正常系_存在するID() {
    // Arrange
    Todo expected = todoMapper.findById(1L);

    // Act
    Todo actual = todoService.getTodoById(1L);

    // Assert
    assertThat(actual).isNotNull();
    assertThat(actual.getId()).isEqualTo(expected.getId());
    assertThat(actual.getTitle()).isEqualTo(expected.getTitle());
}

@DisplayName("異常系: 存在しないIDで例外発生")
@Test
void getTodoById_異常系_存在しないID() {
    // Arrange
    Long nonExistentId = 99999L;

    // Act & Assert
    assertThatThrownBy(() -> todoService.getTodoById(nonExistentId))
        .isInstanceOf(EntityNotFoundException.class)
        .hasMessageContaining("Todo not found");
}

@DisplayName("境界値: 0件のとき空リストを返す")
@Test
void getAllTodos_境界値_0件() {
    // Arrange - テストデータなし

    // Act
    List<Todo> todos = todoService.getAllTodos();

    // Assert
    assertThat(todos).isEmpty();
}
```

---

## 5. Mapper層テスト

### 5.1 目的

- SQLクエリの正確性を検証
- データのマッピングを検証
- 複雑なクエリ（JOIN、サブクエリ等）の動作確認

### 5.2 テスト構成

```java
@SpringBootTest
@Transactional
class TodoMapperTest {

    @Autowired
    private TodoMapper todoMapper;
}
```

### 5.3 検証項目

| 分類 | 検証内容 | 例 |
|------|---------|-----|
| CRUD | 基本操作 | insert, select, update, delete |
| 検索 | 条件検索 | findBy〇〇 |
| マッピング | Entity変換 | JOIN結果のマッピング |
| NULL | NULL処理 | NULL許容カラム |

### 5.4 コード例

```java
@DisplayName("正常系: 全件取得できる")
@Test
void findAll_正常系() {
    // Act
    List<Todo> todos = todoMapper.findAll();

    // Assert
    assertThat(todos).isNotEmpty();
}

@DisplayName("正常系: 新規Todoを登録できる")
@Test
void insert_正常系() {
    // Arrange
    Todo todo = new Todo();
    todo.setTitle("テストTodo");
    todo.setStatus(TodoStatus.NOT_STARTED);

    // Act
    todoMapper.insert(todo);

    // Assert
    assertThat(todo.getId()).isNotNull();

    Todo saved = todoMapper.findById(todo.getId());
    assertThat(saved.getTitle()).isEqualTo("テストTodo");
}

@DisplayName("正常系: ステータスで検索できる")
@Test
void findByStatus_正常系() {
    // Arrange
    TodoStatus status = TodoStatus.NOT_STARTED;

    // Act
    List<Todo> todos = todoMapper.findByStatus(status);

    // Assert
    assertThat(todos).allMatch(t -> t.getStatus() == status);
}
```

---

## 6. テストデータ管理

### 6.1 方針

| 方針 | 実装 |
|------|------|
| トランザクション管理 | @Transactional で自動ロールバック |
| 初期データ | data.sql または テスト内で準備 |
| テスト独立性 | 各テストは他テストのデータに依存しない |

### 6.2 テストデータ準備パターン

#### パターン1: SQLファイル

```sql
-- src/test/resources/data.sql
INSERT INTO todos (id, title, status) VALUES (1, 'テストTodo1', 'NOT_STARTED');
INSERT INTO todos (id, title, status) VALUES (2, 'テストTodo2', 'IN_PROGRESS');
```

#### パターン2: テスト内準備

```java
@BeforeEach
void setUp() {
    Todo todo = new Todo();
    todo.setTitle("テスト用Todo");
    todo.setStatus(TodoStatus.NOT_STARTED);
    todoMapper.insert(todo);
    testTodoId = todo.getId();
}
```

#### パターン3: ファクトリメソッド

```java
private Todo createTestTodo(String title, TodoStatus status) {
    Todo todo = new Todo();
    todo.setTitle(title);
    todo.setStatus(status);
    todoMapper.insert(todo);
    return todo;
}
```

---

## 7. アサーション方針

### 7.1 使用ライブラリ

| 用途 | ライブラリ | 例 |
|------|-----------|-----|
| 基本アサーション | AssertJ | assertThat(actual).isEqualTo(expected) |
| 例外検証 | AssertJ | assertThatThrownBy(() -> ...) |
| JSONパス | MockMvc + jsonPath | jsonPath("$.id").value(1) |

### 7.2 アサーション例

```java
// 値の比較
assertThat(actual).isEqualTo(expected);
assertThat(list).hasSize(3);
assertThat(list).contains(item1, item2);

// NULL検証
assertThat(result).isNotNull();
assertThat(result.getOptionalField()).isNull();

// 例外検証
assertThatThrownBy(() -> service.doSomething())
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessage("Invalid input");

// コレクション検証
assertThat(todos)
    .hasSize(2)
    .extracting(Todo::getStatus)
    .containsOnly(TodoStatus.NOT_STARTED);
```

---

## 8. テストカバレッジ目標

| 対象 | 目標 | 重点項目 |
|------|------|---------|
| Service層 | 80%以上 | ビジネスロジック、例外パス |
| Controller層 | 70%以上 | API仕様、バリデーション |
| Mapper層 | 60%以上 | 主要クエリ |

### 8.1 カバレッジ対象外

- getter/setter
- 設定クラス（@Configuration）
- DTOクラス

---

## 9. ベストプラクティス

### 9.1 推奨事項

| 項目 | 内容 |
|------|------|
| **AAA パターン** | Arrange-Act-Assert の構造を徹底 |
| **1テスト1検証** | 1つのテストで1つの振る舞いを検証 |
| **意味のある名前** | テスト名から意図が分かる |
| **テストデータ最小化** | 必要最小限のデータで検証 |
| **モック最小化** | 統合テストを優先、必要時のみモック |

### 9.2 アンチパターン

| 避けるべきこと | 理由 |
|--------------|------|
| テスト間の依存 | 実行順序で結果が変わる |
| 本番データベースの使用 | テストの安全性が損なわれる |
| 過度なモック | 実際の動作との乖離 |
| 魔法の数値 | テストの意図が不明確 |
| try-catch での例外検証 | assertThatThrownBy を使用 |

---

## 10. 関連ドキュメント

| ドキュメント | 説明 |
|--------------|------|
| [../philosophy.md](../philosophy.md) | テスト設計思想（全体） |
| [catalog/](catalog/) | バックエンドテストカタログ |
| [../../api/](../../api/) | API仕様 |

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2026-01-08 | 初版作成 |
