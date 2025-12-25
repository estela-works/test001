package com.example.demo;

/**
 * コメント作成リクエストDTO
 */
public class CreateCommentRequest {

    /** 投稿者のユーザーID */
    private Long userId;

    /** コメント内容 */
    private String content;

    // Constructors
    public CreateCommentRequest() {
    }

    public CreateCommentRequest(Long userId, String content) {
        this.userId = userId;
        this.content = content;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "CreateCommentRequest{" +
                "userId=" + userId +
                ", content='" + content + '\'' +
                '}';
    }
}
