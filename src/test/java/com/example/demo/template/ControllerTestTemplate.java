package com.example.demo.template;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * {Entity}ControllerのAPIテストクラス（テンプレート）
 *
 * <p>このファイルをコピーして、{Entity}を実際のエンティティ名に置換して使用してください。</p>
 *
 * <h2>使い方</h2>
 * <ol>
 *   <li>このファイルをコピーして {Entity}ControllerTest.java にリネーム</li>
 *   <li>{Entity} を実際のエンティティ名（例: User, Todo, Project）に置換</li>
 *   <li>{entity} を小文字のエンティティ名に置換</li>
 *   <li>{entities} をAPIパス名（複数形）に置換</li>
 *   <li>{ENTITY} を大文字のエンティティ略称（例: USR, TODO, PRJ）に置換</li>
 *   <li>テストデータの初期化処理を実装</li>
 * </ol>
 *
 * <h2>テスト仕様書番号</h2>
 * <p>CT-{ENTITY}-001 ~ CT-{ENTITY}-XXX</p>
 *
 * <h2>テスト対象エンドポイント</h2>
 * <ul>
 *   <li>GET /api/{entities} - 一覧取得</li>
 *   <li>GET /api/{entities}/{id} - ID指定取得</li>
 *   <li>POST /api/{entities} - 新規作成</li>
 *   <li>PUT /api/{entities}/{id} - 更新</li>
 *   <li>DELETE /api/{entities}/{id} - 削除</li>
 * </ul>
 *
 * @author テンプレート
 * @since 1.0.0
 * @see {Entity}Controller
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("{Entity}Controller APIテスト")
class ControllerTestTemplate {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // TODO: 必要なMapperをインジェクション
    // @Autowired
    // private {Entity}Mapper {entity}Mapper;

    // ========================================
    // モック使用時（単体テスト形式）
    // Serviceをモックに置き換える場合はコメントを解除
    // ========================================
    // @MockBean
    // private {Entity}Service {entity}Service;

    /**
     * 各テスト実行前のセットアップ
     *
     * <p>テストデータの初期化を行います。</p>
     */
    @BeforeEach
    void setUp() {
        // TODO: テストデータの初期化処理を実装
        // 例:
        // {entity}Mapper.deleteAll();
        // {Entity} entity1 = new {Entity}("テストデータ1");
        // {entity}Mapper.insert(entity1);
    }

    // ========================================
    // GET /api/{entities} テスト（一覧取得）
    // ========================================
    @Nested
    @DisplayName("GET /api/{entities}")
    class GetAllTest {

        /**
         * CT-{ENTITY}-001: 一覧取得の正常系テスト
         *
         * <p>前提条件: テストデータが存在する</p>
         * <p>期待結果: 200 OK、JSON配列が返却される</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-001: 一覧取得で200 OKが返却される")
        void getAll_Returns200OK() throws Exception {
            mockMvc.perform(get("/api/{entities}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(0))))
                .andExpect(jsonPath("$[0].id", notNullValue()));
        }

        /**
         * CT-{ENTITY}-002: データ0件時のテスト
         *
         * <p>前提条件: データが存在しない</p>
         * <p>期待結果: 200 OK、空配列が返却される</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-002: 0件で空配列が返却される")
        void getAll_WhenEmpty_ReturnsEmptyArray() throws Exception {
            // TODO: テストデータを全削除
            // {entity}Mapper.deleteAll();

            mockMvc.perform(get("/api/{entities}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
        }
    }

    // ========================================
    // GET /api/{entities}/{id} テスト（ID指定取得）
    // ========================================
    @Nested
    @DisplayName("GET /api/{entities}/{id}")
    class GetByIdTest {

        /**
         * CT-{ENTITY}-003: 存在するIDでの取得テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: 200 OK、該当データが返却される</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-003: 存在するIDで200 OKが返却される")
        void getById_WhenExists_Returns200OK() throws Exception {
            // TODO: 存在するIDを取得
            Long existingId = 1L;

            mockMvc.perform(get("/api/{entities}/{id}", existingId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(existingId.intValue())));
        }

        /**
         * CT-{ENTITY}-E001: 存在しないIDでの取得テスト（エラー系）
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: 404 Not Found</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-E001: 存在しないIDで404 Not Foundが返却される")
        void getById_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(get("/api/{entities}/{id}", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // POST /api/{entities} テスト（新規作成）
    // ========================================
    @Nested
    @DisplayName("POST /api/{entities}")
    class CreateTest {

        /**
         * CT-{ENTITY}-004: 正常作成テスト
         *
         * <p>前提条件: 有効なリクエストボディ</p>
         * <p>期待結果: 201 Created、作成されたデータが返却される</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-004: 正常作成で201 Createdが返却される")
        void create_WhenValid_Returns201Created() throws Exception {
            String json = """
                {
                    "name": "テストデータ"
                }
                """;

            mockMvc.perform(post("/api/{entities}")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("テストデータ")));
        }

        /**
         * CT-{ENTITY}-E002: 必須項目未入力テスト（エラー系）
         *
         * <p>前提条件: 必須項目が空</p>
         * <p>期待結果: 400 Bad Request</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-E002: 必須項目空で400 Bad Requestが返却される")
        void create_WhenNameEmpty_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "name": ""
                }
                """;

            mockMvc.perform(post("/api/{entities}")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        /**
         * CT-{ENTITY}-E003: 必須項目nullテスト（エラー系）
         *
         * <p>前提条件: 必須項目がnull</p>
         * <p>期待結果: 400 Bad Request</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-E003: 必須項目nullで400 Bad Requestが返却される")
        void create_WhenNameNull_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "name": null
                }
                """;

            mockMvc.perform(post("/api/{entities}")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        /**
         * CT-{ENTITY}-E004: 重複データ作成テスト（エラー系）
         *
         * <p>前提条件: 同名データが既に存在する（一意制約がある場合）</p>
         * <p>期待結果: 409 Conflict</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-E004: 重複データで409 Conflictが返却される")
        void create_WhenDuplicate_Returns409Conflict() throws Exception {
            // TODO: 一意制約がある場合のみ実装
            // 既存データと同名のデータを作成
            String json = """
                {
                    "name": "既存データ"
                }
                """;

            mockMvc.perform(post("/api/{entities}")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isConflict());
        }
    }

    // ========================================
    // PUT /api/{entities}/{id} テスト（更新）
    // ========================================
    @Nested
    @DisplayName("PUT /api/{entities}/{id}")
    class UpdateTest {

        /**
         * CT-{ENTITY}-005: 正常更新テスト
         *
         * <p>前提条件: 指定IDのデータが存在し、有効なリクエストボディ</p>
         * <p>期待結果: 200 OK、更新されたデータが返却される</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-005: 正常更新で200 OKが返却される")
        void update_WhenValid_Returns200OK() throws Exception {
            // TODO: 存在するIDを取得
            Long existingId = 1L;

            String json = """
                {
                    "name": "更新後データ"
                }
                """;

            mockMvc.perform(put("/api/{entities}/{id}", existingId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("更新後データ")));
        }

        /**
         * CT-{ENTITY}-E005: 存在しないIDでの更新テスト（エラー系）
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: 404 Not Found</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-E005: 存在しないIDで404 Not Foundが返却される")
        void update_WhenNotExists_Returns404NotFound() throws Exception {
            String json = """
                {
                    "name": "更新データ"
                }
                """;

            mockMvc.perform(put("/api/{entities}/{id}", 999)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // DELETE /api/{entities}/{id} テスト（削除）
    // ========================================
    @Nested
    @DisplayName("DELETE /api/{entities}/{id}")
    class DeleteTest {

        /**
         * CT-{ENTITY}-006: 正常削除テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: 204 No Content、削除後は404</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-006: 正常削除で204 No Contentが返却される")
        void delete_WhenExists_Returns204NoContent() throws Exception {
            // TODO: 存在するIDを取得
            Long existingId = 1L;

            mockMvc.perform(delete("/api/{entities}/{id}", existingId))
                .andExpect(status().isNoContent());

            // 削除確認
            mockMvc.perform(get("/api/{entities}/{id}", existingId))
                .andExpect(status().isNotFound());
        }

        /**
         * CT-{ENTITY}-E006: 存在しないIDでの削除テスト（エラー系）
         *
         * <p>前提条件: 指定IDのデータが存在しない</p>
         * <p>期待結果: 404 Not Found</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-E006: 存在しないIDで404 Not Foundが返却される")
        void delete_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(delete("/api/{entities}/{id}", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // モック使用例（Controllerの単体テスト形式）
    // ========================================
    @Nested
    @DisplayName("モック使用テスト例")
    class MockExampleTest {

        /**
         * CT-{ENTITY}-M001: Serviceが例外をスローする場合のテスト
         *
         * <p>MockBeanを使用してServiceの動作をモックする例です。</p>
         * <p>使用する場合は、クラス上部の@MockBeanのコメントを解除してください。</p>
         */
        // @Test
        // @DisplayName("CT-{ENTITY}-M001: Service例外時に500が返却される")
        // void test_WhenServiceThrowsException_Returns500() throws Exception {
        //     // Arrange: Serviceが例外をスローするよう設定
        //     when({entity}Service.get{Entity}ById(any()))
        //         .thenThrow(new RuntimeException("DB接続エラー"));
        //
        //     // Act & Assert
        //     mockMvc.perform(get("/api/{entities}/{id}", 1))
        //         .andExpect(status().isInternalServerError());
        //
        //     // Verify: Serviceが呼び出されたことを確認
        //     verify({entity}Service, times(1)).get{Entity}ById(1L);
        // }

        /**
         * CT-{ENTITY}-M002: Serviceの戻り値をモックするテスト
         *
         * <p>Serviceの戻り値をモックして、特定の状態をテストする例です。</p>
         */
        // @Test
        // @DisplayName("CT-{ENTITY}-M002: Serviceの戻り値をモック")
        // void test_WhenServiceReturnsData_ReturnsExpected() throws Exception {
        //     // Arrange: Serviceの戻り値を設定
        //     {Entity} mock{Entity} = new {Entity}();
        //     mock{Entity}.setId(1L);
        //     mock{Entity}.setName("モックデータ");
        //     when({entity}Service.get{Entity}ById(1L)).thenReturn(mock{Entity});
        //
        //     // Act & Assert
        //     mockMvc.perform(get("/api/{entities}/{id}", 1))
        //         .andExpect(status().isOk())
        //         .andExpect(jsonPath("$.name", is("モックデータ")));
        //
        //     // Verify
        //     verify({entity}Service, times(1)).get{Entity}ById(1L);
        // }
    }

    // ========================================
    // パラメータ付きGETテスト例（クエリパラメータ）
    // ========================================
    @Nested
    @DisplayName("GET /api/{entities} パラメータ付き")
    class GetWithParamsTest {

        /**
         * CT-{ENTITY}-007: クエリパラメータによるフィルタリングテスト
         *
         * <p>前提条件: フィルタ条件に一致するデータが存在する</p>
         * <p>期待結果: フィルタ条件に一致するデータのみ返却される</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-007: パラメータでフィルタリングされる")
        void getAll_WithParams_ReturnsFiltered() throws Exception {
            mockMvc.perform(get("/api/{entities}")
                    .param("status", "active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].status", everyItem(is("active"))));
        }
    }

    // ========================================
    // PATCH テスト例（部分更新）
    // ========================================
    @Nested
    @DisplayName("PATCH /api/{entities}/{id}")
    class PatchTest {

        /**
         * CT-{ENTITY}-008: 部分更新テスト
         *
         * <p>前提条件: 指定IDのデータが存在する</p>
         * <p>期待結果: 200 OK、指定フィールドのみ更新される</p>
         */
        @Test
        @DisplayName("CT-{ENTITY}-008: 部分更新で200 OKが返却される")
        void patch_WhenValid_Returns200OK() throws Exception {
            Long existingId = 1L;

            mockMvc.perform(patch("/api/{entities}/{id}/toggle", existingId))
                .andExpect(status().isOk());
        }
    }
}
