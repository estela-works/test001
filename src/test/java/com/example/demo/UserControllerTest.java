package com.example.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * UserControllerのAPIテストクラス
 * テスト仕様書: IT-01 ~ IT-11
 *
 * @see UserController
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("UserController APIテスト")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private TodoMapper todoMapper;

    @BeforeEach
    void setUp() {
        // テストデータは data.sql で初期投入済み
        // 必要に応じて追加のセットアップを行う
    }

    // ========================================
    // GET /api/users テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/users")
    class GetAllUsersTest {

        @Test
        @DisplayName("IT-01: ユーザー一覧が取得できること")
        void getAllUsers_Returns200OK() throws Exception {
            mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$[0].id", notNullValue()))
                .andExpect(jsonPath("$[0].name", notNullValue()));
        }
    }

    // ========================================
    // GET /api/users/{id} テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/users/{id}")
    class GetUserByIdTest {

        @Test
        @DisplayName("IT-02: 指定IDのユーザーが取得できること")
        void getUserById_WhenExists_Returns200OK() throws Exception {
            var users = userMapper.selectAll();
            Long existingId = users.get(0).getId();

            mockMvc.perform(get("/api/users/{id}", existingId))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(existingId.intValue())))
                .andExpect(jsonPath("$.name", notNullValue()));
        }

        @Test
        @DisplayName("IT-03: 存在しないIDで404が返却されること")
        void getUserById_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(get("/api/users/{id}", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // POST /api/users テスト
    // ========================================
    @Nested
    @DisplayName("POST /api/users")
    class CreateUserTest {

        @Test
        @DisplayName("IT-04: ユーザーが正常に登録されること")
        void createUser_WhenValid_Returns201Created() throws Exception {
            String json = """
                {
                    "name": "新規ユーザー"
                }
                """;

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("新規ユーザー")))
                .andExpect(jsonPath("$.createdAt", notNullValue()));
        }

        @Test
        @DisplayName("IT-05: 名前が空の場合に400が返却されること")
        void createUser_WhenNameEmpty_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "name": ""
                }
                """;

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("IT-05b: 名前がnullの場合に400が返却されること")
        void createUser_WhenNameNull_Returns400BadRequest() throws Exception {
            String json = """
                {
                }
                """;

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("IT-05c: 名前が空白のみの場合に400が返却されること")
        void createUser_WhenNameOnlySpaces_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "name": "   "
                }
                """;

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("IT-06: 名前重複時に409が返却されること")
        void createUser_WhenNameDuplicate_Returns409Conflict() throws Exception {
            String json = """
                {
                    "name": "山田太郎"
                }
                """;

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isConflict());
        }

        @Test
        @DisplayName("IT-07: 100文字の名前で登録できること")
        void createUser_WhenName100Chars_Returns201Created() throws Exception {
            String name100 = "あ".repeat(100);
            String json = String.format("""
                {
                    "name": "%s"
                }
                """, name100);

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is(name100)));
        }

        @Test
        @DisplayName("IT-08: 101文字の名前で400が返却されること")
        void createUser_WhenName101Chars_Returns400BadRequest() throws Exception {
            String name101 = "あ".repeat(101);
            String json = String.format("""
                {
                    "name": "%s"
                }
                """, name101);

            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }
    }

    // ========================================
    // DELETE /api/users/{id} テスト
    // ========================================
    @Nested
    @DisplayName("DELETE /api/users/{id}")
    class DeleteUserTest {

        @Test
        @DisplayName("IT-09: ユーザーが正常に削除されること")
        void deleteUser_WhenExists_Returns204NoContent() throws Exception {
            // 新規ユーザーを追加して削除テスト
            User newUser = new User();
            newUser.setName("削除テストユーザー");
            userMapper.insert(newUser);
            Long userId = newUser.getId();

            mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isNoContent());

            // 削除確認
            mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("IT-10: 存在しないIDで404が返却されること")
        void deleteUser_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(delete("/api/users/{id}", 999))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("IT-11: ユーザー削除時にToDoの担当者がNULLになること")
        void deleteUser_WhenHasTodos_SetsAssigneeToNull() throws Exception {
            // 新規ユーザーを作成
            User newUser = new User();
            newUser.setName("担当者解除テストユーザー");
            userMapper.insert(newUser);
            Long userId = newUser.getId();

            // ToDoを作成して担当者を設定
            Todo todo = new Todo("担当者テストToDo", "説明");
            todo.setAssigneeId(userId);
            todoMapper.insert(todo);
            Long todoId = todo.getId();

            // ユーザーを削除
            mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isNoContent());

            // ToDoの担当者がnullになっていることを確認
            mockMvc.perform(get("/api/todos/{id}", todoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assigneeId").doesNotExist());
        }
    }
}
