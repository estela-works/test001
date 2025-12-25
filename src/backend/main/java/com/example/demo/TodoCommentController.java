package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TODOコメントコントローラー
 * コメントに関するREST APIエンドポイントを提供
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TodoCommentController {

    private final TodoCommentService todoCommentService;

    public TodoCommentController(TodoCommentService todoCommentService) {
        this.todoCommentService = todoCommentService;
    }

    /**
     * GET /api/todos/{todoId}/comments
     * 指定されたToDoIDに紐づくコメント一覧を取得
     *
     * @param todoId ToDoID
     * @return コメント一覧（作成日時の降順）
     */
    @GetMapping("/todos/{todoId}/comments")
    public ResponseEntity<List<TodoComment>> getCommentsByTodoId(@PathVariable Long todoId) {
        List<TodoComment> comments = todoCommentService.getCommentsByTodoId(todoId);
        return ResponseEntity.ok(comments);
    }

    /**
     * POST /api/todos/{todoId}/comments
     * コメントを作成
     *
     * @param todoId ToDoID
     * @param request コメント作成リクエスト
     * @return 作成されたコメント（201 Created）
     */
    @PostMapping("/todos/{todoId}/comments")
    public ResponseEntity<TodoComment> createComment(
            @PathVariable Long todoId,
            @RequestBody CreateCommentRequest request) {
        TodoComment createdComment = todoCommentService.createComment(todoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    /**
     * DELETE /api/comments/{id}
     * コメントを削除
     *
     * @param id コメントID
     * @return 204 No Content
     */
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        todoCommentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
