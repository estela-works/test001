package com.example.demo;

import java.time.LocalDateTime;

/**
 * 案件を表現するエンティティクラス
 */
public class Project {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    // デフォルトコンストラクタ
    public Project() {
        this.createdAt = LocalDateTime.now();
    }

    // パラメータ付きコンストラクタ
    public Project(String name, String description) {
        this();
        this.name = name;
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
