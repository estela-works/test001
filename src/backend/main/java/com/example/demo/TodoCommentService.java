package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

/**
 * TODOコメントサービス
 * コメントに関するビジネスロジックを提供
 */
@Service
public class TodoCommentService {

    private final TodoCommentMapper todoCommentMapper;
    private final TodoMapper todoMapper;
    private final UserMapper userMapper;

    public TodoCommentService(TodoCommentMapper todoCommentMapper, TodoMapper todoMapper, UserMapper userMapper) {
        this.todoCommentMapper = todoCommentMapper;
        this.todoMapper = todoMapper;
        this.userMapper = userMapper;
    }

    /**
     * 指定されたToDoIDに紐づくコメント一覧を取得
     *
     * @param todoId ToDoID
     * @return コメント一覧（作成日時の降順）
     * @throws ResponseStatusException ToDoが存在しない場合は404エラー
     */
    public List<TodoComment> getCommentsByTodoId(Long todoId) {
        // ToDoの存在確認
        Todo todo = todoMapper.selectById(todoId);
        if (todo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ToDo not found with id: " + todoId);
        }

        return todoCommentMapper.selectByTodoId(todoId);
    }

    /**
     * コメントを作成
     *
     * @param todoId ToDoID
     * @param request コメント作成リクエスト
     * @return 作成されたコメント
     * @throws ResponseStatusException ToDoが存在しない場合は404エラー、バリデーションエラーの場合は400エラー
     */
    @Transactional
    public TodoComment createComment(Long todoId, CreateCommentRequest request) {
        // ToDoの存在確認
        Todo todo = todoMapper.selectById(todoId);
        if (todo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ToDo not found with id: " + todoId);
        }

        // バリデーション
        validateCreateCommentRequest(request);

        // ユーザーの存在確認
        User user = userMapper.selectById(request.getUserId());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found with id: " + request.getUserId());
        }

        // コメントエンティティの作成
        TodoComment comment = new TodoComment();
        comment.setTodoId(todoId);
        comment.setUserId(request.getUserId());
        comment.setContent(request.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        // DB登録
        todoCommentMapper.insert(comment);

        // 登録されたコメントを取得して返却（userNameを含むため）
        return todoCommentMapper.selectById(comment.getId());
    }

    /**
     * コメントを削除
     *
     * @param id コメントID
     * @throws ResponseStatusException コメントが存在しない場合は404エラー
     */
    @Transactional
    public void deleteComment(Long id) {
        // コメントの存在確認
        TodoComment comment = todoCommentMapper.selectById(id);
        if (comment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found with id: " + id);
        }

        // 削除実行
        int deleted = todoCommentMapper.deleteById(id);
        if (deleted == 0) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete comment");
        }
    }

    /**
     * コメント作成リクエストのバリデーション
     *
     * @param request コメント作成リクエスト
     * @throws ResponseStatusException バリデーションエラーの場合は400エラー
     */
    private void validateCreateCommentRequest(CreateCommentRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }

        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content is required");
        }

        if (request.getContent().length() > 2000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "content must be 2000 characters or less");
        }
    }
}
