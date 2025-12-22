package com.example.demo;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ToDoアイテムを表現するエンティティクラス
 */
public class Todo {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    private LocalDateTime createdAt;
    private Long projectId;
    private LocalDate startDate;
    private LocalDate dueDate;

    // デフォルトコンストラクタ
    public Todo() {
        this.createdAt = LocalDateTime.now();
        this.completed = false;
    }

    // パラメータ付きコンストラクタ
    public Todo(String title, String description) {
        this();
        this.title = title;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", completed=" + completed +
                ", createdAt=" + createdAt +
                ", projectId=" + projectId +
                ", startDate=" + startDate +
                ", dueDate=" + dueDate +
                '}';
    }
}