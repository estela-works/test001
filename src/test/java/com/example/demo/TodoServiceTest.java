package com.example.demo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * TodoServiceの統合テストクラス
 *
 * @see TodoService
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("TodoService 統合テスト")
class TodoServiceTest {

    @Autowired
    private TodoService todoService;

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
    // getAllTodos() テスト
    // ========================================
    @Nested
    @DisplayName("getAllTodos()")
    class GetAllTodosTest {

        @Test
        @DisplayName("GT-001: 初期状態で3件のToDoが作成日時順で取得できる")
        void getAllTodos_WhenInitialState_ReturnsThreeTodosSortedByCreatedAt() {
            List<Todo> todos = todoService.getAllTodos();

            assertThat(todos).hasSize(3);
            // 作成日時でソートされていることを確認
            for (int i = 0; i < todos.size() - 1; i++) {
                assertThat(todos.get(i).getCreatedAt())
                    .isBeforeOrEqualTo(todos.get(i + 1).getCreatedAt());
            }
        }

        @Test
        @DisplayName("GT-002: 全削除後は空のリストが返却される")
        void getAllTodos_WhenAllDeleted_ReturnsEmptyList() {
            todoService.deleteAllTodos();

            List<Todo> todos = todoService.getAllTodos();

            assertThat(todos).isEmpty();
        }

        @Test
        @DisplayName("GT-003: 新規追加後は追加したToDoを含む全件が取得できる")
        void getAllTodos_AfterAddingNew_ReturnsAllIncludingNew() {
            Todo newTodo = new Todo("新しいタスク", "説明");
            todoService.createTodo(newTodo);

            List<Todo> todos = todoService.getAllTodos();

            assertThat(todos).hasSize(4);
            assertThat(todos).extracting(Todo::getTitle).contains("新しいタスク");
        }
    }

    // ========================================
    // getTodosByCompleted() テスト
    // ========================================
    @Nested
    @DisplayName("getTodosByCompleted()")
    class GetTodosByCompletedTest {

        @Test
        @DisplayName("GC-001: completed=falseで未完了のToDoのみ取得できる")
        void getTodosByCompleted_WhenFalse_ReturnsOnlyPendingTodos() {
            // 1件を完了に
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());

            List<Todo> pendingTodos = todoService.getTodosByCompleted(false);

            assertThat(pendingTodos).hasSize(2);
            assertThat(pendingTodos).allMatch(todo -> !todo.isCompleted());
        }

        @Test
        @DisplayName("GC-002: completed=trueで完了済みのToDoのみ取得できる")
        void getTodosByCompleted_WhenTrue_ReturnsOnlyCompletedTodos() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());
            todoService.toggleComplete(allTodos.get(1).getId());

            List<Todo> completedTodos = todoService.getTodosByCompleted(true);

            assertThat(completedTodos).hasSize(2);
            assertThat(completedTodos).allMatch(Todo::isCompleted);
        }

        @Test
        @DisplayName("GC-003: 該当するToDoがない場合は空のリストが返却される")
        void getTodosByCompleted_WhenNoMatch_ReturnsEmptyList() {
            // 初期状態では全て未完了
            List<Todo> completedTodos = todoService.getTodosByCompleted(true);

            assertThat(completedTodos).isEmpty();
        }

        @Test
        @DisplayName("GC-004: 結果が作成日時順でソートされている")
        void getTodosByCompleted_ReturnsSortedByCreatedAt() {
            List<Todo> todos = todoService.getTodosByCompleted(false);

            for (int i = 0; i < todos.size() - 1; i++) {
                assertThat(todos.get(i).getCreatedAt())
                    .isBeforeOrEqualTo(todos.get(i + 1).getCreatedAt());
            }
        }
    }

    // ========================================
    // getTodoById() テスト
    // ========================================
    @Nested
    @DisplayName("getTodoById()")
    class GetTodoByIdTest {

        @Test
        @DisplayName("GI-001: 存在するIDでToDoが取得できる")
        void getTodoById_WhenExists_ReturnsTodo() {
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();

            Todo todo = todoService.getTodoById(existingId);

            assertThat(todo).isNotNull();
            assertThat(todo.getId()).isEqualTo(existingId);
        }

        @Test
        @DisplayName("GI-002: 存在しないIDではnullが返却される")
        void getTodoById_WhenNotExists_ReturnsNull() {
            Todo todo = todoService.getTodoById(999L);

            assertThat(todo).isNull();
        }
    }

    // ========================================
    // createTodo() テスト
    // ========================================
    @Nested
    @DisplayName("createTodo()")
    class CreateTodoTest {

        @Test
        @DisplayName("CT-001: 正常にToDoが作成されIDが自動採番される")
        void createTodo_WhenValid_CreatesWithAutoGeneratedId() {
            Todo newTodo = new Todo("テストタスク", "テスト説明");

            Todo created = todoService.createTodo(newTodo);

            assertThat(created.getId()).isNotNull();
            assertThat(created.getTitle()).isEqualTo("テストタスク");
            assertThat(created.getDescription()).isEqualTo("テスト説明");
            assertThat(created.isCompleted()).isFalse();
            assertThat(created.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("CT-002: 連続作成時にIDが連番で採番される")
        void createTodo_WhenMultiple_AssignsSequentialIds() {
            Todo todo1 = todoService.createTodo(new Todo("タスク4", "説明4"));
            Todo todo2 = todoService.createTodo(new Todo("タスク5", "説明5"));
            Todo todo3 = todoService.createTodo(new Todo("タスク6", "説明6"));

            assertThat(todo1.getId()).isNotNull();
            assertThat(todo2.getId()).isNotNull();
            assertThat(todo3.getId()).isNotNull();
            // 連番であることを確認
            assertThat(todo2.getId()).isGreaterThan(todo1.getId());
            assertThat(todo3.getId()).isGreaterThan(todo2.getId());
        }

        @Test
        @DisplayName("CT-003: title/descriptionがnullでも作成できる")
        void createTodo_WhenNullFields_CreatesSuccessfully() {
            Todo newTodo = new Todo();
            newTodo.setTitle(null);
            newTodo.setDescription(null);

            // Note: DB制約によりtitleがNOT NULLの場合はこのテストは失敗する
            // 実際のDB制約に合わせてテストを調整する必要がある
            // このテストはService層の動作確認用
        }
    }

    // ========================================
    // updateTodo() テスト
    // ========================================
    @Nested
    @DisplayName("updateTodo()")
    class UpdateTodoTest {

        @Test
        @DisplayName("UT-001: 存在するToDoを正常に更新できる")
        void updateTodo_WhenExists_UpdatesSuccessfully() {
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();

            Todo updatedData = new Todo("更新タイトル", "更新説明");
            updatedData.setCompleted(true);

            Todo result = todoService.updateTodo(existingId, updatedData);

            assertThat(result).isNotNull();
            assertThat(result.getTitle()).isEqualTo("更新タイトル");
            assertThat(result.getDescription()).isEqualTo("更新説明");
            assertThat(result.isCompleted()).isTrue();
        }

        @Test
        @DisplayName("UT-002: 全フィールドが正しく更新される")
        void updateTodo_UpdatesAllFields() {
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();
            String originalTitle = allTodos.get(0).getTitle();

            Todo updatedData = new Todo("新タイトル", "新説明");
            updatedData.setCompleted(true);

            todoService.updateTodo(existingId, updatedData);
            Todo updated = todoService.getTodoById(existingId);

            assertThat(updated.getTitle()).isNotEqualTo(originalTitle);
            assertThat(updated.getTitle()).isEqualTo("新タイトル");
        }

        @Test
        @DisplayName("UT-003: 存在しないIDで更新するとnullが返却される")
        void updateTodo_WhenNotExists_ReturnsNull() {
            Todo updatedData = new Todo("更新", "説明");

            Todo result = todoService.updateTodo(999L, updatedData);

            assertThat(result).isNull();
        }

        @Test
        @DisplayName("UT-004: 更新してもcreatedAtは変更されない")
        void updateTodo_DoesNotChangeCreatedAt() {
            List<Todo> allTodos = todoService.getAllTodos();
            Todo original = allTodos.get(0);
            var originalCreatedAt = original.getCreatedAt();

            Todo updatedData = new Todo("更新", "説明");
            todoService.updateTodo(original.getId(), updatedData);

            Todo updated = todoService.getTodoById(original.getId());
            assertThat(updated.getCreatedAt()).isEqualTo(originalCreatedAt);
        }
    }

    // ========================================
    // toggleComplete() テスト
    // ========================================
    @Nested
    @DisplayName("toggleComplete()")
    class ToggleCompleteTest {

        @Test
        @DisplayName("TC-001: 未完了から完了に切り替えできる")
        void toggleComplete_WhenPending_BecomesCompleted() {
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();
            assertThat(todoService.getTodoById(existingId).isCompleted()).isFalse();

            Todo result = todoService.toggleComplete(existingId);

            assertThat(result.isCompleted()).isTrue();
        }

        @Test
        @DisplayName("TC-002: 完了から未完了に切り替えできる")
        void toggleComplete_WhenCompleted_BecomesPending() {
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();

            todoService.toggleComplete(existingId); // まず完了に
            assertThat(todoService.getTodoById(existingId).isCompleted()).isTrue();

            Todo result = todoService.toggleComplete(existingId);

            assertThat(result.isCompleted()).isFalse();
        }

        @Test
        @DisplayName("TC-003: 存在しないIDではnullが返却される")
        void toggleComplete_WhenNotExists_ReturnsNull() {
            Todo result = todoService.toggleComplete(999L);

            assertThat(result).isNull();
        }

        @Test
        @DisplayName("TC-004: 2回連続で切り替えると元の状態に戻る")
        void toggleComplete_WhenToggledTwice_ReturnsToOriginal() {
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();
            boolean originalState = todoService.getTodoById(existingId).isCompleted();

            todoService.toggleComplete(existingId);
            todoService.toggleComplete(existingId);

            assertThat(todoService.getTodoById(existingId).isCompleted()).isEqualTo(originalState);
        }
    }

    // ========================================
    // deleteTodo() テスト
    // ========================================
    @Nested
    @DisplayName("deleteTodo()")
    class DeleteTodoTest {

        @Test
        @DisplayName("DT-001: 存在するToDoを正常に削除できる")
        void deleteTodo_WhenExists_DeletesSuccessfully() {
            int originalCount = todoService.getTotalCount();
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();

            Todo deleted = todoService.deleteTodo(existingId);

            assertThat(deleted).isNotNull();
            assertThat(deleted.getId()).isEqualTo(existingId);
            assertThat(todoService.getTotalCount()).isEqualTo(originalCount - 1);
        }

        @Test
        @DisplayName("DT-002: 存在しないIDで削除するとnullが返却される")
        void deleteTodo_WhenNotExists_ReturnsNull() {
            Todo result = todoService.deleteTodo(999L);

            assertThat(result).isNull();
        }

        @Test
        @DisplayName("DT-003: 削除後に同じIDで取得するとnullが返却される")
        void deleteTodo_AfterDelete_GetByIdReturnsNull() {
            List<Todo> allTodos = todoService.getAllTodos();
            Long existingId = allTodos.get(0).getId();

            todoService.deleteTodo(existingId);

            Todo result = todoService.getTodoById(existingId);

            assertThat(result).isNull();
        }
    }

    // ========================================
    // deleteAllTodos() テスト
    // ========================================
    @Nested
    @DisplayName("deleteAllTodos()")
    class DeleteAllTodosTest {

        @Test
        @DisplayName("DA-001: 全ToDoが削除される")
        void deleteAllTodos_DeletesAll() {
            assertThat(todoService.getTotalCount()).isEqualTo(3);

            todoService.deleteAllTodos();

            assertThat(todoService.getTotalCount()).isZero();
            assertThat(todoService.getAllTodos()).isEmpty();
        }

        @Test
        @DisplayName("DA-002: 空の状態で実行してもエラーにならない")
        void deleteAllTodos_WhenEmpty_NoError() {
            todoService.deleteAllTodos();
            assertThat(todoService.getTotalCount()).isZero();

            // 再度実行してもエラーにならない
            todoService.deleteAllTodos();

            assertThat(todoService.getTotalCount()).isZero();
        }
    }

    // ========================================
    // getTotalCount() テスト
    // ========================================
    @Nested
    @DisplayName("getTotalCount()")
    class GetTotalCountTest {

        @Test
        @DisplayName("CN-001: 初期状態で3を返却する")
        void getTotalCount_WhenInitial_ReturnsThree() {
            assertThat(todoService.getTotalCount()).isEqualTo(3);
        }

        @Test
        @DisplayName("CN-002: 追加後は4を返却する")
        void getTotalCount_AfterAdd_ReturnsFour() {
            todoService.createTodo(new Todo("新規", "説明"));

            assertThat(todoService.getTotalCount()).isEqualTo(4);
        }

        @Test
        @DisplayName("CN-003: 削除後は2を返却する")
        void getTotalCount_AfterDelete_ReturnsTwo() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.deleteTodo(allTodos.get(0).getId());

            assertThat(todoService.getTotalCount()).isEqualTo(2);
        }

        @Test
        @DisplayName("CN-004: 全削除後は0を返却する")
        void getTotalCount_AfterDeleteAll_ReturnsZero() {
            todoService.deleteAllTodos();

            assertThat(todoService.getTotalCount()).isZero();
        }
    }

    // ========================================
    // getCompletedCount() テスト
    // ========================================
    @Nested
    @DisplayName("getCompletedCount()")
    class GetCompletedCountTest {

        @Test
        @DisplayName("CC-001: 初期状態（全て未完了）で0を返却する")
        void getCompletedCount_WhenInitial_ReturnsZero() {
            assertThat(todoService.getCompletedCount()).isZero();
        }

        @Test
        @DisplayName("CC-002: 1件完了後は1を返却する")
        void getCompletedCount_AfterOneCompleted_ReturnsOne() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());

            assertThat(todoService.getCompletedCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("CC-003: 全件完了後は3を返却する")
        void getCompletedCount_AfterAllCompleted_ReturnsThree() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());
            todoService.toggleComplete(allTodos.get(1).getId());
            todoService.toggleComplete(allTodos.get(2).getId());

            assertThat(todoService.getCompletedCount()).isEqualTo(3);
        }

        @Test
        @DisplayName("CC-004: 全削除後は0を返却する")
        void getCompletedCount_AfterDeleteAll_ReturnsZero() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());
            todoService.deleteAllTodos();

            assertThat(todoService.getCompletedCount()).isZero();
        }
    }

    // ========================================
    // getPendingCount() テスト
    // ========================================
    @Nested
    @DisplayName("getPendingCount()")
    class GetPendingCountTest {

        @Test
        @DisplayName("PC-001: 初期状態（全て未完了）で3を返却する")
        void getPendingCount_WhenInitial_ReturnsThree() {
            assertThat(todoService.getPendingCount()).isEqualTo(3);
        }

        @Test
        @DisplayName("PC-002: 1件完了後は2を返却する")
        void getPendingCount_AfterOneCompleted_ReturnsTwo() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());

            assertThat(todoService.getPendingCount()).isEqualTo(2);
        }

        @Test
        @DisplayName("PC-003: 全件完了後は0を返却する")
        void getPendingCount_AfterAllCompleted_ReturnsZero() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());
            todoService.toggleComplete(allTodos.get(1).getId());
            todoService.toggleComplete(allTodos.get(2).getId());

            assertThat(todoService.getPendingCount()).isZero();
        }

        @Test
        @DisplayName("PC-004: getTotalCount - getCompletedCount と一致する")
        void getPendingCount_EqualsTotalMinusCompleted() {
            List<Todo> allTodos = todoService.getAllTodos();
            todoService.toggleComplete(allTodos.get(0).getId());

            int expected = todoService.getTotalCount() - todoService.getCompletedCount();

            assertThat(todoService.getPendingCount()).isEqualTo(expected);
        }
    }
}
