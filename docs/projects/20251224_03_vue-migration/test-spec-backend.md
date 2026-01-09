# バックエンドテスト方針書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 作成者 | - |
| 関連詳細設計書 | [basic-design-backend.md](./basic-design-backend.md) |

---

## 1. テスト概要

### 1.1 テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| CorsConfig | 新規 | CORS設定クラス |
| ディレクトリ構成 | 変更 | src/main → src/backend/main への移動 |
| 既存API | **変更なし** | 全API機能は維持 |
| 既存Service | **変更なし** | ビジネスロジックは維持 |
| 既存Mapper | **変更なし** | データアクセスは維持 |

### 1.2 テスト方針

本案件ではバックエンドのビジネスロジック・API仕様に変更はない。テストの主目的は:

1. **リグレッション確認**: ディレクトリ移動後も既存機能が正常動作することを確認
2. **CORS動作確認**: 新規追加のCORS設定が正しく機能することを確認
3. **ビルド確認**: Maven設定変更後のビルドが成功することを確認

### 1.3 テスト戦略

| テストレベル | 対象 | 目的 | 実行タイミング |
|-------------|------|------|---------------|
| 既存単体テスト | 全Mapper/Service/Controller | リグレッション確認 | ディレクトリ移動後 |
| CORS設定テスト | CorsConfig | CORS動作確認 | 新規追加 |
| E2Eテスト | 全画面 | 統合動作確認 | Vue移行後 |

---

## 2. リグレッションテスト

### 2.1 テスト方針

既存のJUnitテストをすべて実行し、パスすることを確認する。

### 2.2 実行方法

```bash
# ディレクトリ移動・pom.xml更新後に実行
mvnw.cmd test
```

### 2.3 確認項目

| 確認項目 | 期待結果 |
|---------|---------|
| 全テストがパスする | Tests run: XX, Failures: 0, Errors: 0 |
| コンパイルエラーなし | BUILD SUCCESS |

### 2.4 既存テスト一覧（参考）

| テストクラス | 対象 | テスト数 |
|-------------|------|---------|
| TodoMapperTest | TodoMapper | 複数 |
| TodoServiceTest | TodoService | 複数 |
| TodoControllerTest | TodoController | 複数 |
| ProjectMapperTest | ProjectMapper | 複数 |
| ProjectServiceTest | ProjectService | 複数 |
| ProjectControllerTest | ProjectController | 複数 |
| UserMapperTest | UserMapper | 複数 |
| UserServiceTest | UserService | 複数 |
| UserControllerTest | UserController | 複数 |

---

## 3. CORS設定テスト

### 3.1 テスト対象

**新規クラス**: `com.example.demo.config.CorsConfig`

### 3.2 テストケース

#### CT-CORS-001: OPTIONS プリフライトリクエスト

| 項目 | 内容 |
|------|------|
| テストケースID | CT-CORS-001 |
| テスト観点 | OPTIONSリクエストが許可される |
| エンドポイント | `OPTIONS /api/todos` |
| リクエストヘッダー | Origin: http://localhost:5173 |
| 期待結果 | ステータス: 200, Access-Control-Allow-Origin ヘッダーあり |

#### CT-CORS-002: 許可オリジンからのGETリクエスト

| 項目 | 内容 |
|------|------|
| テストケースID | CT-CORS-002 |
| テスト観点 | 許可オリジンからのリクエストにCORSヘッダーが付与される |
| エンドポイント | `GET /api/todos` |
| リクエストヘッダー | Origin: http://localhost:5173 |
| 期待結果 | Access-Control-Allow-Origin: http://localhost:5173 |

#### CT-CORS-003: 許可オリジンからのPOSTリクエスト

| 項目 | 内容 |
|------|------|
| テストケースID | CT-CORS-003 |
| テスト観点 | POSTリクエストにCORSヘッダーが付与される |
| エンドポイント | `POST /api/todos` |
| リクエストヘッダー | Origin: http://localhost:5173, Content-Type: application/json |
| リクエストボディ | `{ "title": "テスト" }` |
| 期待結果 | ステータス: 201, Access-Control-Allow-Origin ヘッダーあり |

#### CT-CORS-004: 非許可オリジンからのリクエスト

| 項目 | 内容 |
|------|------|
| テストケースID | CT-CORS-004 |
| テスト観点 | 非許可オリジンにはCORSヘッダーが付与されない |
| エンドポイント | `GET /api/todos` |
| リクエストヘッダー | Origin: http://evil.example.com |
| 期待結果 | Access-Control-Allow-Origin ヘッダーなし |

### 3.3 テスト実装例

```java
@SpringBootTest
@AutoConfigureMockMvc
class CorsConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("CT-CORS-001: OPTIONSプリフライトリクエストが許可される")
    void preflight_allowed() throws Exception {
        mockMvc.perform(options("/api/todos")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET"))
            .andExpect(status().isOk())
            .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    @Test
    @DisplayName("CT-CORS-002: 許可オリジンからのGETにCORSヘッダー付与")
    void get_with_allowed_origin() throws Exception {
        mockMvc.perform(get("/api/todos")
                .header("Origin", "http://localhost:5173"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    @DisplayName("CT-CORS-003: 許可オリジンからのPOSTにCORSヘッダー付与")
    void post_with_allowed_origin() throws Exception {
        mockMvc.perform(post("/api/todos")
                .header("Origin", "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\": \"テスト\"}"))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    @Test
    @DisplayName("CT-CORS-004: 非許可オリジンにはCORSヘッダーなし")
    void get_with_disallowed_origin() throws Exception {
        mockMvc.perform(get("/api/todos")
                .header("Origin", "http://evil.example.com"))
            .andExpect(status().isOk())
            .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
```

---

## 4. ビルド確認テスト

### 4.1 確認項目

| 確認項目 | コマンド | 期待結果 |
|---------|---------|---------|
| クリーンビルド | `mvnw.cmd clean compile` | BUILD SUCCESS |
| テスト実行 | `mvnw.cmd test` | BUILD SUCCESS |
| パッケージング | `mvnw.cmd package` | BUILD SUCCESS |
| アプリケーション起動 | `mvnw.cmd spring-boot:run` | 正常起動 |

### 4.2 pom.xml変更確認

変更後のpom.xml設定が正しいことを確認:

```xml
<build>
    <sourceDirectory>src/backend/main/java</sourceDirectory>
    <resources>
        <resource>
            <directory>src/backend/main/resources</directory>
        </resource>
    </resources>
    <testSourceDirectory>src/backend/test/java</testSourceDirectory>
    <testResources>
        <testResource>
            <directory>src/backend/test/resources</directory>
        </testResource>
    </testResources>
</build>
```

---

## 5. E2Eテスト（リグレッション）

### 5.1 テスト方針

Vue移行完了後、既存のPlaywright E2Eテストを実行してリグレッションを確認する。

### 5.2 実行方法

```bash
cd src/test/e2e
npm install
npx playwright test
```

### 5.3 確認項目

| 確認項目 | 期待結果 |
|---------|---------|
| 全E2Eテストがパスする | すべてのテストがpass |
| 画面遷移が正常 | Vue Routerでの遷移が動作 |
| API連携が正常 | データ取得・更新が動作 |

---

## 6. テストケース一覧

| ID | 対象 | テスト観点 | 分類 | 優先度 | ステータス |
|----|------|-----------|------|--------|-----------|
| - | 全既存テスト | リグレッション確認 | 正常系 | 高 | 未実施 |
| CT-CORS-001 | CorsConfig | OPTIONSプリフライト | 正常系 | 高 | 未実施 |
| CT-CORS-002 | CorsConfig | GET + CORS | 正常系 | 高 | 未実施 |
| CT-CORS-003 | CorsConfig | POST + CORS | 正常系 | 高 | 未実施 |
| CT-CORS-004 | CorsConfig | 非許可オリジン | 異常系 | 中 | 未実施 |
| - | ビルド | clean compile | 正常系 | 高 | 未実施 |
| - | ビルド | test | 正常系 | 高 | 未実施 |
| - | ビルド | package | 正常系 | 高 | 未実施 |
| - | E2E | 全シナリオ | 正常系 | 高 | 未実施 |

---

## 7. テスト環境

### 7.1 必要な環境

- JUnit 5
- Spring Boot Test
- MockMvc
- H2 インメモリデータベース

### 7.2 テスト用アノテーション

| テスト種別 | アノテーション |
|-----------|---------------|
| CORSテスト | `@SpringBootTest`, `@AutoConfigureMockMvc` |
| 既存テスト | 変更なし（そのまま実行） |

---

## 8. テスト実行順序

### 8.1 推奨順序

```
1. ディレクトリ移動
   └─→ src/main → src/backend/main

2. pom.xml更新
   └─→ sourceDirectory等を更新

3. ビルド確認
   └─→ mvnw.cmd clean compile

4. 既存テスト実行（リグレッション）
   └─→ mvnw.cmd test

5. CORS設定追加
   └─→ CorsConfig.java作成

6. CORSテスト実行
   └─→ CorsConfigTest.java実行

7. フロントエンド実装・統合

8. E2Eテスト実行
   └─→ npx playwright test
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
