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

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ProjectControllerのAPIテストクラス
 *
 * @see ProjectController
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("ProjectController APIテスト")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private TodoMapper todoMapper;

    @BeforeEach
    void setUp() {
        // テストデータをクリア
        todoMapper.deleteAll();
        List<Project> projects = projectMapper.selectAll();
        for (Project p : projects) {
            projectMapper.deleteById(p.getId());
        }
    }

    // ========================================
    // GET /api/projects テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/projects")
    class GetAllProjectsTest {

        @Test
        @DisplayName("IT-PC-001: 全案件取得で200 OKが返却される")
        void getAllProjects_Returns200OK() throws Exception {
            // テストデータ作成
            projectMapper.insert(new Project("案件A", "説明A"));
            projectMapper.insert(new Project("案件B", "説明B"));

            mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", notNullValue()))
                .andExpect(jsonPath("$[0].id", notNullValue()));
        }

        @Test
        @DisplayName("IT-PC-002: 案件0件で空配列が返却される")
        void getAllProjects_WhenEmpty_ReturnsEmptyArray() throws Exception {
            mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));
        }
    }

    // ========================================
    // GET /api/projects/{id} テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/projects/{id}")
    class GetProjectByIdTest {

        @Test
        @DisplayName("IT-PC-003: 存在するIDで200 OKと案件情報が返却される")
        void getProjectById_WhenExists_Returns200OK() throws Exception {
            Project project = new Project("テスト案件", "説明");
            projectMapper.insert(project);

            mockMvc.perform(get("/api/projects/{id}", project.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(project.getId().intValue())))
                .andExpect(jsonPath("$.name", is("テスト案件")))
                .andExpect(jsonPath("$.description", is("説明")));
        }

        @Test
        @DisplayName("IT-PC-004: 存在しないIDで404 Not Foundが返却される")
        void getProjectById_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(get("/api/projects/{id}", 999))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // POST /api/projects テスト
    // ========================================
    @Nested
    @DisplayName("POST /api/projects")
    class CreateProjectTest {

        @Test
        @DisplayName("IT-PC-005: 正常作成で201 Createdが返却される")
        void createProject_WhenValid_Returns201Created() throws Exception {
            Project newProject = new Project("新規案件", "新規説明");

            mockMvc.perform(post("/api/projects")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newProject)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("新規案件")))
                .andExpect(jsonPath("$.description", is("新規説明")))
                .andExpect(jsonPath("$.createdAt", notNullValue()));
        }

        @Test
        @DisplayName("IT-PC-005b: name空で400 Bad Requestが返却される")
        void createProject_WhenNameEmpty_Returns400BadRequest() throws Exception {
            Project newProject = new Project("", "説明");

            mockMvc.perform(post("/api/projects")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newProject)))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("IT-PC-005c: name nullで400 Bad Requestが返却される")
        void createProject_WhenNameNull_Returns400BadRequest() throws Exception {
            Project newProject = new Project();
            newProject.setDescription("説明");

            mockMvc.perform(post("/api/projects")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newProject)))
                .andExpect(status().isBadRequest());
        }
    }

    // ========================================
    // PUT /api/projects/{id} テスト
    // ========================================
    @Nested
    @DisplayName("PUT /api/projects/{id}")
    class UpdateProjectTest {

        @Test
        @DisplayName("IT-PC-006: 正常更新で200 OKが返却される")
        void updateProject_WhenValid_Returns200OK() throws Exception {
            Project project = new Project("元の名前", "元の説明");
            projectMapper.insert(project);

            Project updatedProject = new Project("更新後の名前", "更新後の説明");

            mockMvc.perform(put("/api/projects/{id}", project.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updatedProject)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("更新後の名前")))
                .andExpect(jsonPath("$.description", is("更新後の説明")));
        }

        @Test
        @DisplayName("IT-PC-006b: 存在しないIDで404 Not Foundが返却される")
        void updateProject_WhenNotExists_Returns404NotFound() throws Exception {
            Project updatedProject = new Project("更新", "説明");

            mockMvc.perform(put("/api/projects/{id}", 999)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updatedProject)))
                .andExpect(status().isNotFound());
        }
    }

    // ========================================
    // DELETE /api/projects/{id} テスト
    // ========================================
    @Nested
    @DisplayName("DELETE /api/projects/{id}")
    class DeleteProjectTest {

        @Test
        @DisplayName("IT-PC-007: 正常削除で204 No Contentが返却される")
        void deleteProject_WhenExists_Returns204NoContent() throws Exception {
            Project project = new Project("削除案件", "説明");
            projectMapper.insert(project);

            mockMvc.perform(delete("/api/projects/{id}", project.getId()))
                .andExpect(status().isNoContent());

            // 削除確認
            mockMvc.perform(get("/api/projects/{id}", project.getId()))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("IT-PC-007b: 存在しないIDで404 Not Foundが返却される")
        void deleteProject_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(delete("/api/projects/{id}", 999))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("IT-PC-007c: 配下チケットありでカスケード削除される")
        void deleteProject_WhenHasTodos_CascadeDeletes() throws Exception {
            // 案件を作成
            Project project = new Project("カスケード案件", "説明");
            projectMapper.insert(project);

            // 配下にチケットを作成
            Todo todo1 = new Todo("タスク1", "説明1");
            todo1.setProjectId(project.getId());
            todoMapper.insert(todo1);

            Todo todo2 = new Todo("タスク2", "説明2");
            todo2.setProjectId(project.getId());
            todoMapper.insert(todo2);

            // 案件を削除
            mockMvc.perform(delete("/api/projects/{id}", project.getId()))
                .andExpect(status().isNoContent());

            // 案件が削除されている
            mockMvc.perform(get("/api/projects/{id}", project.getId()))
                .andExpect(status().isNotFound());

            // 配下チケットも削除されている
            mockMvc.perform(get("/api/todos")
                    .param("projectId", project.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
        }
    }

    // ========================================
    // GET /api/projects/{id}/stats テスト
    // ========================================
    @Nested
    @DisplayName("GET /api/projects/{id}/stats")
    class GetProjectStatsTest {

        @Test
        @DisplayName("IT-PC-008: 統計取得で200 OKが返却される")
        void getProjectStats_Returns200OK() throws Exception {
            Project project = new Project("統計案件", "説明");
            projectMapper.insert(project);

            // 10件のチケットを作成し、3件を完了にする
            for (int i = 1; i <= 10; i++) {
                Todo todo = new Todo("タスク" + i, "説明");
                todo.setProjectId(project.getId());
                todo.setCompleted(i <= 3);
                todoMapper.insert(todo);
            }

            mockMvc.perform(get("/api/projects/{id}/stats", project.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.total", is(10)))
                .andExpect(jsonPath("$.completed", is(3)))
                .andExpect(jsonPath("$.pending", is(7)))
                .andExpect(jsonPath("$.progressRate", is(30)));
        }

        @Test
        @DisplayName("IT-PC-008b: チケット0件で統計取得")
        void getProjectStats_WhenNoTodos_ReturnsZeroStats() throws Exception {
            Project project = new Project("空の案件", "説明");
            projectMapper.insert(project);

            mockMvc.perform(get("/api/projects/{id}/stats", project.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total", is(0)))
                .andExpect(jsonPath("$.completed", is(0)))
                .andExpect(jsonPath("$.pending", is(0)))
                .andExpect(jsonPath("$.progressRate", is(0)));
        }

        @Test
        @DisplayName("IT-PC-008c: 存在しない案件IDで404 Not Found")
        void getProjectStats_WhenNotExists_Returns404NotFound() throws Exception {
            mockMvc.perform(get("/api/projects/{id}/stats", 999))
                .andExpect(status().isNotFound());
        }
    }
}
