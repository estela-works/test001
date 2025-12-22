package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Bootアプリケーションのメインクラス
 * @SpringBootApplicationアノテーションで自動設定が有効になる
 */
@SpringBootApplication
public class SimpleSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimpleSpringApplication.class, args);
        System.out.println("Spring Bootアプリケーションが正常に起動しました！");
    }
}