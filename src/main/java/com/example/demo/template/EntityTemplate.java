package com.example.demo.template;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * {Entity}を表現するエンティティクラス（テンプレート）
 *
 * <p>このファイルをコピーして、{Entity}を実際のエンティティ名に置換して使用してください。</p>
 *
 * <h2>使い方</h2>
 * <ol>
 *   <li>このファイルをコピーして {Entity}.java にリネーム</li>
 *   <li>{Entity} を実際のエンティティ名（例: User, Todo, Project）に置換</li>
 *   <li>フィールドを実際のテーブル定義に合わせて修正</li>
 *   <li>Getter/Setterを生成（IDEの機能を使用）</li>
 *   <li>必要に応じてコンストラクタを追加</li>
 * </ol>
 *
 * <h2>命名規則</h2>
 * <ul>
 *   <li>フィールド名: キャメルケース（例: createdAt）</li>
 *   <li>DBカラム名: スネークケース（例: CREATED_AT）</li>
 *   <li>MyBatisのmap-underscore-to-camel-case設定で自動変換</li>
 * </ul>
 *
 * <h2>対応テーブル</h2>
 * <p>{TABLE_NAME}</p>
 *
 * @author テンプレート
 * @since 1.0.0
 */
public class EntityTemplate {

    // ========================================
    // 基本フィールド
    // ========================================

    /**
     * 主キー（自動採番）
     */
    private Long id;

    /**
     * 名前（必須）
     */
    private String name;

    /**
     * 説明（任意）
     */
    private String description;

    /**
     * 作成日時
     */
    private LocalDateTime createdAt;

    /**
     * 更新日時
     */
    private LocalDateTime updatedAt;

    // ========================================
    // 状態管理フィールド（例）
    // ========================================

    /**
     * 有効フラグ
     */
    private boolean active;

    /**
     * ステータス（例: PENDING, ACTIVE, COMPLETED）
     */
    private String status;

    // ========================================
    // 日付フィールド（例）
    // ========================================

    /**
     * 開始日
     */
    private LocalDate startDate;

    /**
     * 終了日
     */
    private LocalDate endDate;

    // ========================================
    // 関連エンティティ用フィールド（例）
    // ========================================

    /**
     * 親エンティティのID（外部キー）
     */
    private Long parentId;

    /**
     * 親エンティティの名前（JOINで取得）
     *
     * <p>DBには保存せず、SELECT時にJOINで取得する読み取り専用フィールド。</p>
     */
    private String parentName;

    /**
     * 担当者ID（外部キー）
     */
    private Long assigneeId;

    /**
     * 担当者名（JOINで取得）
     */
    private String assigneeName;

    // ========================================
    // コンストラクタ
    // ========================================

    /**
     * デフォルトコンストラクタ
     *
     * <p>作成日時を現在時刻で初期化。</p>
     */
    public EntityTemplate() {
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    /**
     * 名前と説明を指定するコンストラクタ
     *
     * @param name 名前
     * @param description 説明
     */
    public EntityTemplate(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }

    // ========================================
    // Getter / Setter
    // ========================================

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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    // ========================================
    // toString
    // ========================================

    /**
     * デバッグ用の文字列表現
     */
    @Override
    public String toString() {
        return "{Entity}{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", active=" + active +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", parentId=" + parentId +
                ", parentName='" + parentName + '\'' +
                ", assigneeId=" + assigneeId +
                ", assigneeName='" + assigneeName + '\'' +
                '}';
    }

    // ========================================
    // equals / hashCode（必要に応じて実装）
    // ========================================

    /**
     * IDベースの等価性チェック
     *
     * <p>永続化されたエンティティ同士の比較に使用。</p>
     */
    // @Override
    // public boolean equals(Object o) {
    //     if (this == o) return true;
    //     if (o == null || getClass() != o.getClass()) return false;
    //     {Entity} that = ({Entity}) o;
    //     return id != null && id.equals(that.id);
    // }

    // @Override
    // public int hashCode() {
    //     return getClass().hashCode();
    // }
}
