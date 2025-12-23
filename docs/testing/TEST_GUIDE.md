# テストガイド

Spring Boot + MyBatis プロジェクト向けのテストガイドです。

## 目次

1. [テストテンプレートの使い方](#テストテンプレートの使い方)
2. [テストID命名規則](#テストid命名規則)
3. [各層のテスト方針](#各層のテスト方針)
4. [AssertJ/Hamcrest パターン集](#assertjhamcrest-パターン集)
5. [Mockito の使い方](#mockito-の使い方)
6. [エラーハンドリングパターン](#エラーハンドリングパターン)

---

## テストテンプレートの使い方

### テンプレートファイル

| ファイル | 用途 | 配置場所 |
|---------|------|---------|
| `ControllerTestTemplate.java` | REST API テスト | `src/test/java/com/example/demo/template/` |
| `ServiceTestTemplate.java` | ビジネスロジックテスト | `src/test/java/com/example/demo/template/` |
| `MapperTestTemplate.java` | データアクセス層テスト | `src/test/java/com/example/demo/template/` |

### 使用手順

1. テンプレートファイルをコピー
2. ファイル名を `{Entity}XxxTest.java` にリネーム
3. 以下のプレースホルダーを置換:
   - `{Entity}` → エンティティ名（例: `User`, `Todo`, `Project`）
   - `{entity}` → 小文字のエンティティ名（例: `user`, `todo`, `project`）
   - `{entities}` → APIパス名（例: `users`, `todos`, `projects`）
   - `{ENTITY}` → エンティティ略称（例: `USR`, `TODO`, `PRJ`）
4. `@Autowired` のコメントを解除
5. `setUp()` メソッドにテストデータ初期化処理を実装
6. 各テストメソッドの TODO コメントを実装に置換

---

## テストID命名規則

### 基本形式

```
{層プレフィックス}-{エンティティ略称}-{連番}
```

### 層プレフィックス

| レイヤー | プレフィックス | 説明 |
|---------|---------------|------|
| Controller | `CT` | REST API テスト |
| Service | `ST` | ビジネスロジックテスト |
| Mapper | `MT` | データアクセス層テスト |

### エンティティ略称

| エンティティ | 略称 |
|-------------|------|
| User | USR |
| Todo | TODO |
| Project | PRJ |

### カテゴリサフィックス（オプション）

| カテゴリ | サフィックス | 説明 | 例 |
|---------|-------------|------|-----|
| 正常系 | (なし) | デフォルト | CT-USR-001 |
| 異常系 | E | エラー系テスト | CT-USR-E001 |
| 例外 | X | 例外スローテスト | ST-TODO-X001 |
| 境界値 | B | 境界値テスト | MT-PRJ-B001 |
| モック | M | モック使用テスト | ST-USR-M001 |

### 命名例

```
CT-USR-001    # Controller層 User 正常系テスト #1
CT-USR-E001   # Controller層 User エラー系テスト #1
ST-TODO-003   # Service層 Todo 正常系テスト #3
ST-TODO-X001  # Service層 Todo 例外テスト #1
MT-PRJ-005    # Mapper層 Project 正常系テスト #5
```

---

## 各層のテスト方針

### Controller層（API テスト）

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("XxxController APIテスト")
class XxxControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;
}
```

**テスト観点:**
- HTTPステータスコード（200, 201, 204, 400, 404, 409, 500）
- レスポンスボディの内容
- Content-Type
- バリデーションエラー

### Service層（統合テスト）

```java
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("XxxService 統合テスト")
class XxxServiceTest {
    @Autowired
    private XxxService xxxService;

    @Autowired
    private XxxMapper xxxMapper;
}
```

**テスト観点:**
- ビジネスロジックの正確性
- 戻り値の検証
- 例外のスロー
- データの永続化

### Mapper層（単体テスト）

```java
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@DisplayName("XxxMapper 単体テスト")
class XxxMapperTest {
    @Autowired
    private XxxMapper xxxMapper;
}
```

**テスト観点:**
- CRUD操作の正確性
- SQL結果の検証
- NULL処理
- ソート順

---

## AssertJ/Hamcrest パターン集

### AssertJ（Service/Mapper層）

```java
// 基本アサーション
assertThat(result).isNotNull();
assertThat(result).isNull();
assertThat(result).isEqualTo(expected);
assertThat(result).isNotEqualTo(unexpected);

// 数値
assertThat(count).isZero();
assertThat(count).isEqualTo(3);
assertThat(count).isGreaterThan(0);
assertThat(count).isBetween(1, 10);

// 文字列
assertThat(name).isEqualTo("テスト");
assertThat(name).contains("テ");
assertThat(name).startsWith("テ");
assertThat(name).isBlank();
assertThat(name).isNotBlank();

// コレクション
assertThat(list).isEmpty();
assertThat(list).isNotEmpty();
assertThat(list).hasSize(3);
assertThat(list).contains(item);
assertThat(list).containsExactly(item1, item2, item3);
assertThat(list).containsExactlyInAnyOrder(item1, item2, item3);

// 抽出
assertThat(todos).extracting(Todo::getTitle)
    .contains("タスク1", "タスク2");
assertThat(todos).extracting(Todo::getId, Todo::getTitle)
    .contains(tuple(1L, "タスク1"));

// 全要素マッチ
assertThat(todos).allMatch(todo -> !todo.isCompleted());
assertThat(todos).anyMatch(todo -> todo.isCompleted());
assertThat(todos).noneMatch(todo -> todo.getTitle() == null);

// 日時
assertThat(createdAt).isNotNull();
assertThat(createdAt).isBeforeOrEqualTo(LocalDateTime.now());
assertThat(startDate).isBefore(endDate);
```

### Hamcrest + MockMvc（Controller層）

```java
// ステータスコード
.andExpect(status().isOk())           // 200
.andExpect(status().isCreated())      // 201
.andExpect(status().isNoContent())    // 204
.andExpect(status().isBadRequest())   // 400
.andExpect(status().isNotFound())     // 404
.andExpect(status().isConflict())     // 409
.andExpect(status().isInternalServerError())  // 500

// Content-Type
.andExpect(content().contentType(MediaType.APPLICATION_JSON))

// JSON検証
.andExpect(jsonPath("$", hasSize(3)))
.andExpect(jsonPath("$.id", notNullValue()))
.andExpect(jsonPath("$.id", is(1)))
.andExpect(jsonPath("$.name", is("テスト")))
.andExpect(jsonPath("$.completed", is(true)))

// 配列要素
.andExpect(jsonPath("$[0].id", notNullValue()))
.andExpect(jsonPath("$[*].completed", everyItem(is(false))))

// 存在チェック
.andExpect(jsonPath("$.field").exists())
.andExpect(jsonPath("$.field").doesNotExist())

// 数値比較
.andExpect(jsonPath("$.count", greaterThan(0)))
.andExpect(jsonPath("$.count", greaterThanOrEqualTo(1)))
```

---

## Mockito の使い方

### 基本設定

```java
// クラスレベルでモックを宣言
@MockBean
private XxxService xxxService;

// または手動でモック作成
@Mock
private XxxMapper xxxMapper;

@InjectMocks
private XxxService xxxService;

@BeforeEach
void setUp() {
    MockitoAnnotations.openMocks(this);
}
```

### 戻り値の設定

```java
// 単一オブジェクトを返す
when(xxxMapper.selectById(1L)).thenReturn(mockEntity);

// リストを返す
when(xxxMapper.selectAll()).thenReturn(Arrays.asList(entity1, entity2));

// nullを返す
when(xxxMapper.selectById(999L)).thenReturn(null);

// 任意の引数にマッチ
when(xxxMapper.selectById(any())).thenReturn(mockEntity);
when(xxxMapper.selectById(anyLong())).thenReturn(mockEntity);

// 例外をスロー
when(xxxMapper.selectById(any()))
    .thenThrow(new RuntimeException("DB接続エラー"));

// 連続した呼び出しで異なる値を返す
when(xxxMapper.selectById(1L))
    .thenReturn(entity1)
    .thenReturn(entity2);
```

### 呼び出し検証

```java
// 呼び出し回数を検証
verify(xxxMapper, times(1)).selectById(1L);
verify(xxxMapper, times(2)).selectAll();
verify(xxxMapper, never()).deleteById(any());
verify(xxxMapper, atLeastOnce()).selectById(any());

// 引数を検証
verify(xxxMapper).insert(argThat(entity ->
    "テスト".equals(entity.getName())));

// 呼び出し順序を検証
InOrder inOrder = inOrder(xxxMapper);
inOrder.verify(xxxMapper).selectById(1L);
inOrder.verify(xxxMapper).deleteById(1L);
```

### ArgumentCaptor

```java
// 引数をキャプチャして検証
ArgumentCaptor<Entity> captor = ArgumentCaptor.forClass(Entity.class);
verify(xxxMapper).insert(captor.capture());

Entity captured = captor.getValue();
assertThat(captured.getName()).isEqualTo("テスト");
```

---

## エラーハンドリングパターン

### 例外テスト（AssertJ）

```java
// 例外がスローされることを検証
assertThatThrownBy(() -> service.method(invalidInput))
    .isInstanceOf(IllegalArgumentException.class);

// 例外メッセージを検証
assertThatThrownBy(() -> service.method(invalidInput))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessage("エラーメッセージ");

// 例外メッセージの一部を検証
assertThatThrownBy(() -> service.method(invalidInput))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessageContaining("終了日は開始日以降");

// 例外の原因を検証
assertThatThrownBy(() -> service.method(invalidInput))
    .isInstanceOf(ServiceException.class)
    .hasCauseInstanceOf(SQLException.class);

// 例外がスローされないことを検証
assertThatCode(() -> service.method(validInput))
    .doesNotThrowAnyException();
```

### HTTPエラーテスト（MockMvc）

```java
// 400 Bad Request
@Test
@DisplayName("CT-XXX-E001: バリデーションエラーで400が返却される")
void create_WhenInvalid_Returns400() throws Exception {
    String json = """
        {
            "name": ""
        }
        """;

    mockMvc.perform(post("/api/entities")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isBadRequest());
}

// 404 Not Found
@Test
@DisplayName("CT-XXX-E002: 存在しないIDで404が返却される")
void getById_WhenNotExists_Returns404() throws Exception {
    mockMvc.perform(get("/api/entities/{id}", 999))
        .andExpect(status().isNotFound());
}

// 409 Conflict
@Test
@DisplayName("CT-XXX-E003: 重複データで409が返却される")
void create_WhenDuplicate_Returns409() throws Exception {
    String json = """
        {
            "name": "既存データ"
        }
        """;

    mockMvc.perform(post("/api/entities")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json))
        .andExpect(status().isConflict());
}
```

### ビジネスルール違反テスト

```java
@Test
@DisplayName("ST-XXX-X001: 日付範囲が不正な場合に例外がスローされる")
void create_WhenInvalidDateRange_ThrowsException() {
    Entity entity = new Entity();
    entity.setName("テスト");
    entity.setStartDate(LocalDate.of(2025, 1, 31));
    entity.setDueDate(LocalDate.of(2025, 1, 1));  // 開始日より前

    assertThatThrownBy(() -> service.create(entity))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("終了日は開始日以降");
}
```

---

## テスト実行

### Maven コマンド

```bash
# 全テスト実行
./mvnw test

# 特定クラスのテスト実行
./mvnw test -Dtest=TodoControllerTest

# 特定メソッドのテスト実行
./mvnw test -Dtest=TodoControllerTest#createTodo_WhenValid_Returns201Created

# テストレポート生成
./mvnw surefire-report:report
```

### テストプロファイル

`src/test/resources/application-test.properties` でテスト環境を設定:

```properties
# H2 インメモリデータベース
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver

# MyBatis設定
mybatis.configuration.map-underscore-to-camel-case=true
```

---

## ベストプラクティス

1. **テストは独立して実行可能にする** - 他のテストに依存しない
2. **@BeforeEach で毎回データを初期化** - テスト間の干渉を防ぐ
3. **@Transactional で自動ロールバック** - テスト後のクリーンアップ不要
4. **@DisplayName で日本語説明** - テスト意図を明確に
5. **@Nested でグループ化** - 関連テストをまとめる
6. **テストIDを付与** - テスト仕様書との紐付け
7. **正常系と異常系を分離** - テストの意図を明確に
8. **境界値テストを忘れずに** - 0件、1件、MAX件など
