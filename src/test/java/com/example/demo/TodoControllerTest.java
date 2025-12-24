package com.example.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
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
 * TodoControllerのAPIテストクラス
 *
 * @see TodoController
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("TodoController APIテスト")
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TodoMapper todoMapper;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private UserMapper userMapper;

    @BeforeEach
    void setUp() {
        // テストデータをクリアして初期データを投入
        todoMapper.deleteAll();

        Todo todo1 = new Todo("Spring Bootの学習", "説明1");
        todoMapper.insert(todo1);

        Todo todo2 = new Todo("ToDoリストの実装", "説明2");
        todoMapper.insert(todo2);

        Todo todo3 = new Todo("プロジェクトのテスト", "説明3");
        todoMapper.insert(todo3);
    }

    // ========================================
    // GET /api/todos テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/todos")
    class GetAllTodosTest {

        @Test
        @DisplayName("A-001: 全件取得で200 OKが返却される")
        void getAllTodos_Returns200OK() throws Exception {
            mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].title", notNullValue()))
                .andExpect(jsonPath("$[0].id", notNullValue()));
        }

        @Test
        @DisplayName("A-002: completed=trueで完了フィルタが適用される")
        void getAllTodos_WithCompletedTrue_ReturnsCompletedOnly() throws Exception {
            // 1件を完了にする
            var todos = todoMapper.selectAll();
            var todo = todos.get(0);
            todo.setCompleted(true);
            todoMapper.update(todo);

            mockMvc.perform(get("/api/todos").param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].completed", is(true)));
        }

        @Test
        @DisplayName("A-003: completed=falseで未完了フィルタが適用される")
        void getAllTodos_WithCompletedFalse_ReturnsPendingOnly() throws Exception {
            // 1件を完了にする
            var todos = todoMapper.selectAll();
            var todo = todos.get(0);
            todo.setCompleted(true);
            todoMapper.update(todo);

            mockMvc.perform(get("/api/todos").param("completed", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].completed", everyItem(is(false))));
        }
    }

    // ========================================
    // GET /api/todos/{id} テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/todos/{id}")
    class GetTodoByIdTest {

        @Test
        @DisplayName("A-004: 存在するIDで200 OKが返却される")
        void getTodoById_WhenExists_Returns200OK() throws Exception {
            var todos = todoMapper.selectAll();
            Long existingId = todos.get(0).getId();

            mockMvc.perform(get("/api/todos/{id}", existingId))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(existingId.intValue())))
                .andExpect(jsonPath("$.title", notNullValue()));
        }

        @Test
        @DisplayName("A-005: 存在しないIDで404 Not Foundが返却される")
        void getTodoById_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(get("/api/todos/{id}", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // POST /api/todos テスト
    // ========================================
    @Nested
    @DisplayName("POST /api/todos")
    class CreateTodoTest {

        @Test
        @DisplayName("A-006: 正常作成で201 Createdが返却される")
        void createTodo_WhenValid_Returns201Created() throws Exception {
            Todo newTodo = new Todo("新しいタスク", "新しい説明");

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newTodo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("新しいタスク")))
                .andExpect(jsonPath("$.description", is("新しい説明")))
                .andExpect(jsonPath("$.completed", is(false)));
        }

        @Test
        @DisplayName("A-007: title空で400 Bad Requestが返却される")
        void createTodo_WhenTitleEmpty_Returns400BadRequest() throws Exception {
            Todo newTodo = new Todo("", "説明");

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newTodo)))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("A-007b: title nullで400 Bad Requestが返却される")
        void createTodo_WhenTitleNull_Returns400BadRequest() throws Exception {
            Todo newTodo = new Todo();
            newTodo.setDescription("説明");

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newTodo)))
                .andExpect(status().isBadRequest());
        }
    }

    // ========================================
    // PUT /api/todos/{id} テスト
    // ========================================
    @Nested
    @DisplayName("PUT /api/todos/{id}")
    class UpdateTodoTest {

        @Test
        @DisplayName("A-008: 正常更新で200 OKが返却される")
        void updateTodo_WhenValid_Returns200OK() throws Exception {
            var todos = todoMapper.selectAll();
            Long existingId = todos.get(0).getId();

            Todo updatedTodo = new Todo("更新タイトル", "更新説明");
            updatedTodo.setCompleted(true);

            mockMvc.perform(put("/api/todos/{id}", existingId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updatedTodo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("更新タイトル")))
                .andExpect(jsonPath("$.description", is("更新説明")))
                .andExpect(jsonPath("$.completed", is(true)));
        }

        @Test
        @DisplayName("A-009: 存在しないIDで404 Not Foundが返却される")
        void updateTodo_WhenNotExists_Returns404NotFound() throws Exception {
            Todo updatedTodo = new Todo("更新タイトル", "更新説明");

            mockMvc.perform(put("/api/todos/{id}", 999)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updatedTodo)))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // PATCH /api/todos/{id}/toggle テスト
    // ========================================
    @Nested
    @DisplayName("PATCH /api/todos/{id}/toggle")
    class ToggleCompleteTest {

        @Test
        @DisplayName("A-010: 完了切替で200 OKが返却される")
        void toggleComplete_WhenExists_Returns200OK() throws Exception {
            var todos = todoMapper.selectAll();
            Long existingId = todos.get(0).getId();

            // 初期状態はfalse
            mockMvc.perform(patch("/api/todos/{id}/toggle", existingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed", is(true)));

            // 再度切替でfalseに戻る
            mockMvc.perform(patch("/api/todos/{id}/toggle", existingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed", is(false)));
        }

        @Test
        @DisplayName("A-011: 存在しないIDで404 Not Foundが返却される")
        void toggleComplete_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(patch("/api/todos/{id}/toggle", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // DELETE /api/todos/{id} テスト
    // ========================================
    @Nested
    @DisplayName("DELETE /api/todos/{id}")
    class DeleteTodoTest {

        @Test
        @DisplayName("A-012: 正常削除で204 No Contentが返却される")
        void deleteTodo_WhenExists_Returns204NoContent() throws Exception {
            var todos = todoMapper.selectAll();
            Long existingId = todos.get(0).getId();

            mockMvc.perform(delete("/api/todos/{id}", existingId))
                .andExpect(status().isNoContent());

            // 削除確認
            mockMvc.perform(get("/api/todos/{id}", existingId))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("A-013: 存在しないIDで404 Not Foundが返却される")
        void deleteTodo_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(delete("/api/todos/{id}", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // DELETE /api/todos テスト
    // ========================================
    @Nested
    @DisplayName("DELETE /api/todos")
    class DeleteAllTodosTest {

        @Test
        @DisplayName("A-014: 全件削除で204 No Contentが返却される")
        void deleteAllTodos_Returns204NoContent() throws Exception {
            mockMvc.perform(delete("/api/todos"))
                .andExpect(status().isNoContent());

            // 削除確認
            mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
        }
    }

    // ========================================
    // GET /api/todos/stats テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/todos/stats")
    class GetStatsTest {

        @Test
        @DisplayName("A-015: 統計取得で200 OKが返却される")
        void getStats_Returns200OK() throws Exception {
            // 1件を完了にする
            var todos = todoMapper.selectAll();
            var todo = todos.get(0);
            todo.setCompleted(true);
            todoMapper.update(todo);

            mockMvc.perform(get("/api/todos/stats"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.total", is(3)))
                .andExpect(jsonPath("$.completed", is(1)))
                .andExpect(jsonPath("$.pending", is(2)));
        }
    }

    // ========================================
    // GET /api/todos?projectId テスト（案件フィルタ）
    // ========================================
    @Nested
    @DisplayName("GET /api/todos?projectId")
    class GetTodosByProjectIdTest {

        @Test
        @DisplayName("IT-TC-001: projectIdで案件別チケット取得")
        void getTodos_WithProjectId_ReturnsFilteredTodos() throws Exception {
            // 案件を作成
            Project project = new Project("テスト案件", "説明");
            projectMapper.insert(project);

            // 案件に紐づくチケットを作成
            Todo todo1 = new Todo("案件タスク1", "説明1");
            todo1.setProjectId(project.getId());
            todoMapper.insert(todo1);

            Todo todo2 = new Todo("案件タスク2", "説明2");
            todo2.setProjectId(project.getId());
            todoMapper.insert(todo2);

            mockMvc.perform(get("/api/todos")
                    .param("projectId", project.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].projectId", everyItem(is(project.getId().intValue()))));
        }

        @Test
        @DisplayName("IT-TC-002: projectId=noneで未分類チケット取得")
        void getTodos_WithProjectIdNone_ReturnsUnassignedTodos() throws Exception {
            // 初期データは案件なし（projectId=null）
            mockMvc.perform(get("/api/todos")
                    .param("projectId", "none"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
        }

        @Test
        @DisplayName("IT-TC-003: 存在しない案件IDで空配列が返却される")
        void getTodos_WithNonExistentProjectId_ReturnsEmptyArray() throws Exception {
            mockMvc.perform(get("/api/todos")
                    .param("projectId", "999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
        }
    }

    // ========================================
    // POST /api/todos 日付バリデーションテスト
    // ========================================
    @Nested
    @DisplayName("POST /api/todos 日付バリデーション")
    class CreateTodoDateValidationTest {

        @Test
        @DisplayName("IT-TC-004: dueDate < startDateで400 Bad Requestが返却される")
        void createTodo_WithInvalidDateRange_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "title": "タスク",
                    "description": "説明",
                    "startDate": "2025-01-31",
                    "dueDate": "2025-01-01"
                }
                """;

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("IT-TC-005: 正常な日付範囲で201 Createdが返却される")
        void createTodo_WithValidDateRange_Returns201Created() throws Exception {
            String json = """
                {
                    "title": "タスク",
                    "description": "説明",
                    "startDate": "2025-01-01",
                    "dueDate": "2025-01-31"
                }
                """;

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.startDate", is("2025-01-01")))
                .andExpect(jsonPath("$.dueDate", is("2025-01-31")));
        }
    }

    // ========================================
    // 担当者関連テスト (IT-20 ~ IT-25, IT-30 ~ IT-32)
    // ========================================
    @Nested
    @DisplayName("担当者関連 POST/PUT/GET")
    class AssigneeTest {

        @Test
        @DisplayName("IT-20: 担当者付きでToDoが作成できること")
        void createTodo_WithAssignee_Returns201Created() throws Exception {
            var users = userMapper.selectAll();
            Long userId = users.get(0).getId();
            String userName = users.get(0).getName();

            String json = String.format("""
                {
                    "title": "担当者付きタスク",
                    "assigneeId": %d
                }
                """, userId);

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.assigneeId", is(userId.intValue())))
                .andExpect(jsonPath("$.assigneeName", is(userName)));
        }

        @Test
        @DisplayName("IT-21: 担当者なしでToDoが作成できること")
        void createTodo_WithoutAssignee_Returns201Created() throws Exception {
            String json = """
                {
                    "title": "担当者なしタスク"
                }
                """;

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.assigneeId").doesNotExist());
        }

        @Test
        @DisplayName("IT-22: 存在しない担当者IDで400が返却されること")
        void createTodo_WithInvalidAssignee_Returns400BadRequest() throws Exception {
            String json = """
                {
                    "title": "不正担当者タスク",
                    "assigneeId": 999
                }
                """;

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("IT-23: ToDoの担当者を変更できること")
        void updateTodo_ChangeAssignee_Returns200OK() throws Exception {
            var users = userMapper.selectAll();
            User user1 = users.get(0);
            User user2 = users.get(1);

            // 担当者1でToDoを作成
            Todo todo = new Todo("担当者変更タスク", "説明");
            todo.setAssigneeId(user1.getId());
            todoMapper.insert(todo);
            Long todoId = todo.getId();

            // 担当者を変更
            String json = String.format("""
                {
                    "title": "担当者変更タスク",
                    "assigneeId": %d
                }
                """, user2.getId());

            mockMvc.perform(put("/api/todos/{id}", todoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assigneeId", is(user2.getId().intValue())))
                .andExpect(jsonPath("$.assigneeName", is(user2.getName())));
        }

        @Test
        @DisplayName("IT-24: ToDoの担当者を解除できること")
        void updateTodo_RemoveAssignee_Returns200OK() throws Exception {
            var users = userMapper.selectAll();
            User user = users.get(0);

            // 担当者付きでToDoを作成
            Todo todo = new Todo("担当者解除タスク", "説明");
            todo.setAssigneeId(user.getId());
            todoMapper.insert(todo);
            Long todoId = todo.getId();

            // 担当者を解除
            String json = """
                {
                    "title": "担当者解除タスク",
                    "assigneeId": null
                }
                """;

            mockMvc.perform(put("/api/todos/{id}", todoId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assigneeId").doesNotExist());
        }

        @Test
        @DisplayName("IT-25: ToDo一覧に担当者名が含まれること")
        void getTodos_WithAssignee_ReturnsAssigneeName() throws Exception {
            var users = userMapper.selectAll();
            User user = users.get(0);

            // 担当者付きでToDoを作成
            Todo todo = new Todo("担当者情報確認タスク", "説明");
            todo.setAssigneeId(user.getId());
            todoMapper.insert(todo);

            mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.title == '担当者情報確認タスク')].assigneeName",
                    hasItem(user.getName())));
        }
    }

    // ========================================
    // 後方互換性テスト (IT-30 ~ IT-32)
    // ========================================
    @Nested
    @DisplayName("後方互換性テスト")
    class BackwardCompatibilityTest {

        @Test
        @DisplayName("IT-30: 既存のToDo作成が正常に動作すること")
        void createTodo_ExistingFormat_Returns201Created() throws Exception {
            String json = """
                {
                    "title": "テスト",
                    "description": "説明"
                }
                """;

            mockMvc.perform(post("/api/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("テスト")))
                .andExpect(jsonPath("$.description", is("説明")));
        }

        @Test
        @DisplayName("IT-31: 既存の完了切替が正常に動作すること")
        void toggleComplete_ExistingFunction_Returns200OK() throws Exception {
            var todos = todoMapper.selectAll();
            Long existingId = todos.get(0).getId();
            boolean originalCompleted = todos.get(0).isCompleted();

            mockMvc.perform(patch("/api/todos/{id}/toggle", existingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed", is(!originalCompleted)));
        }

        @Test
        @DisplayName("IT-32: 既存のToDo削除が正常に動作すること")
        void deleteTodo_ExistingFunction_Returns204NoContent() throws Exception {
            // 新しいToDoを作成して削除
            Todo todo = new Todo("削除テストタスク", "説明");
            todoMapper.insert(todo);
            Long todoId = todo.getId();

            mockMvc.perform(delete("/api/todos/{id}", todoId))
                .andExpect(status().isNoContent());

            // 削除確認
            mockMvc.perform(get("/api/todos/{id}", todoId))
                .andExpect(status().isNotFound());
        }
    }
}
