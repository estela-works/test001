package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * シンプルなRESTコントローラー
 * @RestControllerアノテーションでRESTエンドポイントを定義
 */
@RestController
public class HelloController {

    // ルートパス("/")は static/index.html で配信されるため、マッピング削除

    /**
     * JSON形式でメッセージを返すエンドポイント
     * @return JSON形式のメッセージ
     */
    @GetMapping("/api/message")
    public String getMessage() {
        return "{\"message\": \"Spring BootでToDoリストを作成しました！\", \"status\": \"success\"}";
    }
}