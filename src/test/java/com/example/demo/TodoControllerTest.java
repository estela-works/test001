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
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
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
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
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
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.total", is(3)))
                .andExpect(jsonPath("$.completed", is(1)))
                .andExpect(jsonPath("$.pending", is(2)));
        }
    }
}
