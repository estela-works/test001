package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * シンプルなRESTコントローラー
 * @RestControllerアノテーションでRESTエンドポイントを定義
 */
@RestController
public class HelloController {

    /**
     * Hello Worldを返すシンプルなGETエンドポイント
     * @return 挨拶メッセージ
     */
    @GetMapping("/")
    public String hello() {
        return "こんにちは！Spring Bootアプリケーションへようこそ！🌸<br>" +
               "<a href='/todos.html'>ToDoリストを見る</a><br>" +
               "<a href='/api/todos'>ToDo API (JSON)</a>";
    }

    /**
     * JSON形式でメッセージを返すエンドポイント
     * @return JSON形式のメッセージ
     */
    @GetMapping("/api/message")
    public String getMessage() {
        return "{\"message\": \"Spring BootでToDoリストを作成しました！\", \"status\": \"success\"}";
    }
}