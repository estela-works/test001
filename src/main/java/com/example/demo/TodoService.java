package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * ToDoアイテムの管理を担当するサービスクラス
 * H2 DatabaseとMyBatisを使用してデータを永続化します
 */
@Service
public class TodoService {

    private final TodoMapper todoMapper;

    @Autowired
    public TodoService(TodoMapper todoMapper) {
        this.todoMapper = todoMapper;
    }

    /**
     * すべてのToDoアイテムを取得
     * @return ToDoアイテムのリスト
     */
    public List<Todo> getAllTodos() {
        return todoMapper.selectAll();
    }

    /**
     * 完了状態でフィルタリングしたToDoアイテムを取得
     * @param completed 完了状態
     * @return フィルタリングされたToDoアイテムのリスト
     */
    public List<Todo> getTodosByCompleted(boolean completed) {
        return todoMapper.selectByCompleted(completed);
    }

    /**
     * IDでToDoアイテムを取得
     * @param id ToDoアイテムのID
     * @return ToDoアイテム（見つからない場合はnull）
     */
    public Todo getTodoById(Long id) {
        return todoMapper.selectById(id);
    }

    /**
     * 新しいToDoアイテムを作成
     * @param todo 作成するToDoアイテム
     * @return 作成されたToDoアイテム
     */
    public Todo createTodo(Todo todo) {
        todoMapper.insert(todo);
        return todo;
    }

    /**
     * ToDoアイテムを更新
     * @param id 更新するToDoアイテムのID
     * @param updatedTodo 更新内容
     * @return 更新されたToDoアイテム（見つからない場合はnull）
     */
    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo existingTodo = todoMapper.selectById(id);
        if (existingTodo != null) {
            existingTodo.setTitle(updatedTodo.getTitle());
            existingTodo.setDescription(updatedTodo.getDescription());
            existingTodo.setCompleted(updatedTodo.isCompleted());
            todoMapper.update(existingTodo);
            return existingTodo;
        }
        return null;
    }

    /**
     * ToDoアイテムの完了状態を切り替え
     * @param id ToDoアイテムのID
     * @return 更新されたToDoアイテム（見つからない場合はnull）
     */
    public Todo toggleComplete(Long id) {
        Todo todo = todoMapper.selectById(id);
        if (todo != null) {
            todo.setCompleted(!todo.isCompleted());
            todoMapper.update(todo);
            return todo;
        }
        return null;
    }

    /**
     * ToDoアイテムを削除
     * @param id 削除するToDoアイテムのID
     * @return 削除されたToDoアイテム（見つからない場合はnull）
     */
    public Todo deleteTodo(Long id) {
        Todo todo = todoMapper.selectById(id);
        if (todo != null) {
            todoMapper.deleteById(id);
            return todo;
        }
        return null;
    }

    /**
     * すべてのToDoアイテムを削除
     */
    public void deleteAllTodos() {
        todoMapper.deleteAll();
    }

    /**
     * ToDoアイテムの総数を取得
     * @return ToDoアイテムの総数
     */
    public int getTotalCount() {
        return todoMapper.count();
    }

    /**
     * 完了済みのToDoアイテム数を取得
     * @return 完了済みのToDoアイテム数
     */
    public int getCompletedCount() {
        return todoMapper.countByCompleted(true);
    }

    /**
     * 未完了のToDoアイテム数を取得
     * @return 未完了のToDoアイテム数
     */
    public int getPendingCount() {
        return getTotalCount() - getCompletedCount();
    }
}
