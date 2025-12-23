# テスト実行方法・設定

[← 目次に戻る](./README.md)

---

## 1. テスト実行方法

```bash
# 全テスト実行
./mvnw test

# 特定クラスのテスト実行
./mvnw test -Dtest=TodoMapperTest
./mvnw test -Dtest=TodoServiceTest
./mvnw test -Dtest=TodoControllerTest
./mvnw test -Dtest=UserMapperTest
./mvnw test -Dtest=UserServiceTest
./mvnw test -Dtest=UserControllerTest
./mvnw test -Dtest=ProjectServiceTest
./mvnw test -Dtest=ProjectControllerTest

# 特定メソッドのテスト実行
./mvnw test -Dtest=TodoServiceTest#getAllTodos*
```

---

## 2. テスト設定

### 2.1 テストプロファイル

| 設定ファイル | 用途 |
|-------------|------|
| application-test.properties | テスト用H2インメモリDB設定 |

### 2.2 テストアノテーション

| アノテーション | 用途 | 適用クラス |
|--------------|------|-----------|
| @MybatisTest | Mapper単体テスト | TodoMapperTest, UserMapperTest |
| @SpringBootTest | 統合テスト | TodoServiceTest, UserServiceTest, ProjectServiceTest |
| @SpringBootTest + @AutoConfigureMockMvc | APIテスト | TodoControllerTest, UserControllerTest, ProjectControllerTest |
| @ActiveProfiles("test") | テストプロファイル有効化 | 全テストクラス |
| @Transactional | テスト後ロールバック | 全テストクラス |

---

[← 目次に戻る](./README.md)
