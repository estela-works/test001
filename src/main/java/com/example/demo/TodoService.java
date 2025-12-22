package com.example.demo;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * ToDoアイテムの管理を担当するサービスクラス
 * メモリ内でToDoアイテムを管理します（簡単な実装のため）
 */
@Service
public class TodoService {
    
    private final Map<Long, Todo> todos = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public TodoService() {
        // サンプルデータの追加
        createTodo(new Todo("Spring Bootの学習", "Spring Bootアプリケーションの基本を理解する"));
        createTodo(new Todo("ToDoリストの実装", "REST APIとフロントエンドを実装する"));
        createTodo(new Todo("プロジェクトのテスト", "作成したアプリケーションの動作確認"));
    }

    /**
     * すべてのToDoアイテムを取得
     * @return ToDoアイテムのリスト
     */
    public List<Todo> getAllTodos() {
        return new ArrayList<>(todos.values()).stream()
                .sorted(Comparator.comparing(Todo::getCreatedAt))
                .collect(Collectors.toList());
    }

    /**
     * 完了状態でフィルタリングしたToDoアイテムを取得
     * @param completed 完了状態
     * @return フィルタリングされたToDoアイテムのリスト
     */
    public List<Todo> getTodosByCompleted(boolean completed) {
        return todos.values().stream()
                .filter(todo -> todo.isCompleted() == completed)
                .sorted(Comparator.comparing(Todo::getCreatedAt))
                .collect(Collectors.toList());
    }

    /**
     * IDでToDoアイテムを取得
     * @param id ToDoアイテムのID
     * @return ToDoアイテム（見つからない場合はnull）
     */
    public Todo getTodoById(Long id) {
        return todos.get(id);
    }

    /**
     * 新しいToDoアイテムを作成
     * @param todo 作成するToDoアイテム
     * @return 作成されたToDoアイテム
     */
    public Todo createTodo(Todo todo) {
        Long id = idGenerator.getAndIncrement();
        todo.setId(id);
        todos.put(id, todo);
        return todo;
    }

    /**
     * ToDoアイテムを更新
     * @param id 更新するToDoアイテムのID
     * @param updatedTodo 更新内容
     * @return 更新されたToDoアイテム（見つからない場合はnull）
     */
    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo existingTodo = todos.get(id);
        if (existingTodo != null) {
            existingTodo.setTitle(updatedTodo.getTitle());
            existingTodo.setDescription(updatedTodo.getDescription());
            existingTodo.setCompleted(updatedTodo.isCompleted());
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
        Todo todo = todos.get(id);
        if (todo != null) {
            todo.setCompleted(!todo.isCompleted());
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
        return todos.remove(id);
    }

    /**
     * すべてのToDoアイテムを削除
     */
    public void deleteAllTodos() {
        todos.clear();
    }

    /**
     * ToDoアイテムの総数を取得
     * @return ToDoアイテムの総数
     */
    public int getTotalCount() {
        return todos.size();
    }

    /**
     * 完了済みのToDoアイテム数を取得
     * @return 完了済みのToDoアイテム数
     */
    public int getCompletedCount() {
        return (int) todos.values().stream()
                .filter(Todo::isCompleted)
                .count();
    }

    /**
     * 未完了のToDoアイテム数を取得
     * @return 未完了のToDoアイテム数
     */
    public int getPendingCount() {
        return getTotalCount() - getCompletedCount();
    }
}