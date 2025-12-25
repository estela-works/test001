package com.example.demo;

import java.time.LocalDateTime;

/**
 * TODOコメントエンティティ
 * チケットに対するコメント情報を表現
 */
public class TodoComment {

    /** コメントID */
    private Long id;

    /** ToDoID（外部キー） */
    private Long todoId;

    /** 投稿者のユーザーID（外部キー、削除されている場合はnull） */
    private Long userId;

    /** 投稿者名（JOINで取得、ユーザーが削除されている場合はnull） */
    private String userName;

    /** コメント内容（最大2000文字） */
    private String content;

    /** 投稿日時 */
    private LocalDateTime createdAt;

    // Constructors
    public TodoComment() {
    }

    public TodoComment(Long id, Long todoId, Long userId, String userName, String content, LocalDateTime createdAt) {
        this.id = id;
        this.todoId = todoId;
        this.userId = userId;
        this.userName = userName;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTodoId() {
        return todoId;
    }

    public void setTodoId(Long todoId) {
        this.todoId = todoId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "TodoComment{" +
                "id=" + id +
                ", todoId=" + todoId +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", content='" + content + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
