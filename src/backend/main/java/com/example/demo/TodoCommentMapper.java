package com.example.demo;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * TODOコメントMapperインターフェース
 * MyBatisによるDB操作
 */
@Mapper
public interface TodoCommentMapper {

    /**
     * 指定されたToDoIDに紐づくコメント一覧を取得
     *
     * @param todoId ToDoID
     * @return コメント一覧（作成日時の降順）
     */
    List<TodoComment> selectByTodoId(@Param("todoId") Long todoId);

    /**
     * コメントIDでコメントを取得
     *
     * @param id コメントID
     * @return コメント（存在しない場合はnull）
     */
    TodoComment selectById(@Param("id") Long id);

    /**
     * コメントを新規作成
     *
     * @param todoComment 作成するコメント
     * @return 挿入件数
     */
    int insert(TodoComment todoComment);

    /**
     * コメントを削除
     *
     * @param id 削除するコメントID
     * @return 削除件数
     */
    int deleteById(@Param("id") Long id);

    /**
     * 指定されたToDoIDに紐づくコメント件数を取得
     *
     * @param todoId ToDoID
     * @return コメント件数
     */
    int countByTodoId(@Param("todoId") Long todoId);
}
