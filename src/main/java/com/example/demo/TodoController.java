package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ToDoリストのREST APIコントローラー
 */
@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    /**
     * すべてのToDoアイテムを取得
     * @param completed 完了状態でフィルタリング（オプション）
     * @param projectId 案件IDでフィルタリング（オプション、"none"で未分類）
     * @return ToDoアイテムのリスト
     */
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String projectId) {
        List<Todo> todos;

        // projectIdパラメータが指定されている場合
        if (projectId != null) {
            if ("none".equals(projectId)) {
                todos = todoService.getTodosByProjectId(null);
            } else {
                try {
                    Long projectIdLong = Long.parseLong(projectId);
                    todos = todoService.getTodosByProjectId(projectIdLong);
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().build();
                }
            }
        } else if (completed != null) {
            todos = todoService.getTodosByCompleted(completed);
        } else {
            todos = todoService.getAllTodos();
        }
        return ResponseEntity.ok(todos);
    }

    /**
     * 指定されたIDのToDoアイテムを取得
     * @param id ToDoアイテムのID
     * @return ToDoアイテム
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        Todo todo = todoService.getTodoById(id);
        if (todo != null) {
            return ResponseEntity.ok(todo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 新しいToDoアイテムを作成
     * @param todo 作成するToDoアイテム
     * @return 作成されたToDoアイテム
     */
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        if (todo.getTitle() == null || todo.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Todo createdTodo = todoService.createTodo(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    /**
     * ToDoアイテムを更新
     * @param id 更新するToDoアイテムのID
     * @param todo 更新内容
     * @return 更新されたToDoアイテム
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        if (todo.getTitle() == null || todo.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Todo updatedTodo = todoService.updateTodo(id, todo);
        if (updatedTodo != null) {
            return ResponseEntity.ok(updatedTodo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * ToDoアイテムの完了状態を切り替え
     * @param id ToDoアイテムのID
     * @return 更新されたToDoアイテム
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleComplete(@PathVariable Long id) {
        Todo updatedTodo = todoService.toggleComplete(id);
        if (updatedTodo != null) {
            return ResponseEntity.ok(updatedTodo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * ToDoアイテムを削除
     * @param id 削除するToDoアイテムのID
     * @return 削除された結果
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        Todo deletedTodo = todoService.deleteTodo(id);
        if (deletedTodo != null) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * すべてのToDoアイテムを削除
     * @return 削除された結果
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllTodos() {
        todoService.deleteAllTodos();
        return ResponseEntity.noContent().build();
    }

    /**
     * ToDoリストの統計情報を取得
     * @return 統計情報
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getStats() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", todoService.getTotalCount());
        stats.put("completed", todoService.getCompletedCount());
        stats.put("pending", todoService.getPendingCount());
        return ResponseEntity.ok(stats);
    }
}