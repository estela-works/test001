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
 * TodoCommentControllerのAPIテストクラス
 *
 * @see TodoCommentController
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("TodoCommentController APIテスト")
class TodoCommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TodoMapper todoMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private TodoCommentMapper todoCommentMapper;

    private Long testTodoId;
    private Long testUserId;

    @BeforeEach
    void setUp() {
        // テストデータをクリア
        todoMapper.deleteAll();

        // テスト用ToDoを作成
        Todo todo = new Todo("テストチケット", "テスト説明");
        todoMapper.insert(todo);
        testTodoId = todo.getId();

        // テスト用ユーザーを取得
        var users = userMapper.selectAll();
        testUserId = users.get(0).getId();
    }

    // ========================================
    // GET /api/todos/{todoId}/comments テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/todos/{todoId}/comments")
    class GetCommentsTest {

        @Test
        @DisplayName("C-001: コメントなしで空配列が返却される")
        void getComments_WhenNoComments_ReturnsEmptyArray() throws Exception {
            mockMvc.perform(get("/api/todos/{todoId}/comments", testTodoId))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
        }

        @Test
        @DisplayName("C-002: コメントが新しい順にソートされて返却される")
        void getComments_ReturnsSortedByCreatedAtDesc() throws Exception {
            // 3件のコメントを作成
            TodoComment comment1 = new TodoComment();
            comment1.setTodoId(testTodoId);
            comment1.setUserId(testUserId);
            comment1.setContent("最初のコメント");
            todoCommentMapper.insert(comment1);

            Thread.sleep(10); // タイムスタンプの差を確保

            TodoComment comment2 = new TodoComment();
            comment2.setTodoId(testTodoId);
            comment2.setUserId(testUserId);
            comment2.setContent("2番目のコメント");
            todoCommentMapper.insert(comment2);

            Thread.sleep(10);

            TodoComment comment3 = new TodoComment();
            comment3.setTodoId(testTodoId);
            comment3.setUserId(testUserId);
            comment3.setContent("3番目のコメント");
            todoCommentMapper.insert(comment3);

            mockMvc.perform(get("/api/todos/{todoId}/comments", testTodoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].content", is("3番目のコメント")))
                .andExpect(jsonPath("$[1].content", is("2番目のコメント")))
                .andExpect(jsonPath("$[2].content", is("最初のコメント")));
        }

        @Test
        @DisplayName("C-003: コメントにユーザー名が含まれる")
        void getComments_ReturnsWithUserName() throws Exception {
            // コメントを作成
            TodoComment comment = new TodoComment();
            comment.setTodoId(testTodoId);
            comment.setUserId(testUserId);
            comment.setContent("テストコメント");
            todoCommentMapper.insert(comment);

            var user = userMapper.selectById(testUserId);

            mockMvc.perform(get("/api/todos/{todoId}/comments", testTodoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userName", is(user.getName())));
        }

        @Test
        @DisplayName("C-004: 存在しないToDoIDで404 Not Foundが返却される")
        void getComments_WhenTodoNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(get("/api/todos/{todoId}/comments", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // POST /api/todos/{todoId}/comments テスト
    // ========================================
    @Nested
    @DisplayName("POST /api/todos/{todoId}/comments")
    class CreateCommentTest {

        @Test
        @DisplayName("C-005: 正常にコメントが作成される")
        void createComment_WhenValid_Returns201Created() throws Exception {
            String json = String.format("""
                {
                    "userId": %d,
                    "content": "これはテストコメントです"
                }
                """, testUserId);

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.todoId", is(testTodoId.intValue())))
                .andExpect(jsonPath("$.userId", is(testUserId.intValue())))
                .andExpect(jsonPath("$.content", is("これはテストコメントです")))
                .andExpect(jsonPath("$.userName", notNullValue()))
                .andExpect(jsonPath("$.createdAt", notNullValue()));
        }

        @Test
        @DisplayName("C-006: 日本語コメントが正常に作成される")
        void createComment_WithJapanese_Returns201Created() throws Exception {
            String json = String.format("""
                {
                    "userId": %d,
                    "content": "とても良い実装ですね！素晴らしいです。"
                }
                """, testUserId);

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8")
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content", is("とても良い実装ですね！素晴らしいです。")));
        }

        @Test
        @DisplayName("C-007: userIdがnullで400 Bad Requestが返却される")
        void createComment_WhenUserIdNull_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "content": "テストコメント"
                }
                """;

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("C-008: contentが空で400 Bad Requestが返却される")
        void createComment_WhenContentEmpty_Returns400BadRequest() throws Exception {
            String json = String.format("""
                {
                    "userId": %d,
                    "content": ""
                }
                """, testUserId);

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("C-009: contentがnullで400 Bad Requestが返却される")
        void createComment_WhenContentNull_Returns400BadRequest() throws Exception {
            String json = String.format("""
                {
                    "userId": %d
                }
                """, testUserId);

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("C-010: contentが2000文字超過で400 Bad Requestが返却される")
        void createComment_WhenContentTooLong_Returns400BadRequest() throws Exception {
            String longContent = "あ".repeat(2001);
            String json = String.format("""
                {
                    "userId": %d,
                    "content": "%s"
                }
                """, testUserId, longContent);

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("C-011: contentが2000文字ちょうどで正常作成される")
        void createComment_WhenContentExactly2000_Returns201Created() throws Exception {
            String exactContent = "あ".repeat(2000);
            String json = String.format("""
                {
                    "userId": %d,
                    "content": "%s"
                }
                """, testUserId, exactContent);

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content", hasLength(2000)));
        }

        @Test
        @DisplayName("C-012: 存在しないToDoIDで404 Not Foundが返却される")
        void createComment_WhenTodoNotExists_Returns404NotFound() throws Exception {
            String json = String.format("""
                {
                    "userId": %d,
                    "content": "テストコメント"
                }
                """, testUserId);

            mockMvc.perform(post("/api/todos/{todoId}/comments", 999)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("C-013: 存在しないユーザーIDで400 Bad Requestが返却される")
        void createComment_WhenUserNotExists_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "userId": 999,
                    "content": "テストコメント"
                }
                """;

            mockMvc.perform(post("/api/todos/{todoId}/comments", testTodoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }
    }

    // ========================================
    // DELETE /api/comments/{id} テスト
    // ========================================
    @Nested
    @DisplayName("DELETE /api/comments/{id}")
    class DeleteCommentTest {

        @Test
        @DisplayName("C-014: 正常にコメントが削除される")
        void deleteComment_WhenExists_Returns204NoContent() throws Exception {
            // コメントを作成
            TodoComment comment = new TodoComment();
            comment.setTodoId(testTodoId);
            comment.setUserId(testUserId);
            comment.setContent("削除テストコメント");
            todoCommentMapper.insert(comment);
            Long commentId = comment.getId();

            mockMvc.perform(delete("/api/comments/{id}", commentId))
                .andExpect(status().isNoContent());

            // 削除確認
            var deletedComment = todoCommentMapper.selectById(commentId);
            assert deletedComment == null;
        }

        @Test
        @DisplayName("C-015: 存在しないコメントIDで404 Not Foundが返却される")
        void deleteComment_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(delete("/api/comments/{id}", 999))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("C-016: コメント削除後、一覧から除外される")
        void deleteComment_RemovedFromList() throws Exception {
            // 2件のコメントを作成
            TodoComment comment1 = new TodoComment();
            comment1.setTodoId(testTodoId);
            comment1.setUserId(testUserId);
            comment1.setContent("コメント1");
            todoCommentMapper.insert(comment1);

            TodoComment comment2 = new TodoComment();
            comment2.setTodoId(testTodoId);
            comment2.setUserId(testUserId);
            comment2.setContent("コメント2");
            todoCommentMapper.insert(comment2);

            // 1件削除
            mockMvc.perform(delete("/api/comments/{id}", comment1.getId()))
                .andExpect(status().isNoContent());

            // 一覧確認（1件になっている）
            mockMvc.perform(get("/api/todos/{todoId}/comments", testTodoId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].content", is("コメント2")));
        }
    }

    // ========================================
    // カスケード削除テスト
    // ========================================
    @Nested
    @DisplayName("カスケード削除テスト")
    class CascadeDeleteTest {

        @Test
        @DisplayName("C-017: ToDo削除時にコメントもカスケード削除される")
        void deleteTodo_CascadeDeletesComments() throws Exception {
            // コメントを作成
            TodoComment comment = new TodoComment();
            comment.setTodoId(testTodoId);
            comment.setUserId(testUserId);
            comment.setContent("カスケードテスト");
            todoCommentMapper.insert(comment);
            Long commentId = comment.getId();

            // ToDoを削除
            mockMvc.perform(delete("/api/todos/{id}", testTodoId))
                .andExpect(status().isNoContent());

            // コメントも削除されていることを確認
            var deletedComment = todoCommentMapper.selectById(commentId);
            assert deletedComment == null;
        }
    }

}
