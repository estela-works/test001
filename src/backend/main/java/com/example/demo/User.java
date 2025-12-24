package com.example.demo;

import java.time.LocalDateTime;

/**
 * ユーザー（担当者）を表現するエンティティクラス
 */
public class User {
    private Long id;
    private String name;
    private LocalDateTime createdAt;

    // デフォルトコンストラクタ
    public User() {
        this.createdAt = LocalDateTime.now();
    }

    // パラメータ付きコンストラクタ
    public User(String name) {
        this();
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
