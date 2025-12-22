package com.example.demo;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

/**
 * ToDoアイテムのデータアクセスを担当するMapperインターフェース
 */
@Mapper
public interface TodoMapper {

    /**
     * 全件取得（作成日時順）
     */
    List<Todo> selectAll();

    /**
     * ID指定取得
     */
    Todo selectById(Long id);

    /**
     * 完了状態フィルタ取得
     */
    List<Todo> selectByCompleted(boolean completed);

    /**
     * 新規作成
     */
    void insert(Todo todo);

    /**
     * 更新
     */
    void update(Todo todo);

    /**
     * ID指定削除
     */
    void deleteById(Long id);

    /**
     * 全件削除
     */
    void deleteAll();

    /**
     * 件数取得
     */
    int count();

    /**
     * 完了状態別件数取得
     */
    int countByCompleted(boolean completed);
}
