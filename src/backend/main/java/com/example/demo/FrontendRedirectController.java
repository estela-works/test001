package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * ルートパスへのアクセス時にVue開発サーバーへの案内ページを表示するController
 *
 * <p>このサーバーはバックエンドAPI専用であることを示し、
 * フロントエンドアプリケーション(Vue Dev Server)へのリンクを提供する。</p>
 *
 * @since 2025-12-25
 */
@Controller
public class FrontendRedirectController {

    /**
     * ルートパスへのアクセス時に案内ページ(HTML)を返す
     *
     * <p>Vue開発サーバー(http://localhost:5173)へのリンクを含む
     * シンプルなHTMLページを表示する。</p>
     *
     * @return HTML文字列
     */
    @GetMapping(value = "/", produces = "text/html; charset=UTF-8")
    @ResponseBody
    public String showFrontendInfo() {
        return """
            <!DOCTYPE html>
            <html lang="ja">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Spring Boot - API Server</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 100px auto;
                        padding: 20px;
                        text-align: center;
                    }
                    h1 {
                        color: #6db33f;
                    }
                    .info {
                        background-color: #f0f0f0;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #42b883;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                    }
                    a:hover {
                        background-color: #35a372;
                    }
                    code {
                        background-color: #f4f4f4;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-family: monospace;
                    }
                </style>
            </head>
            <body>
                <h1>Spring Boot API Server</h1>
                <div class="info">
                    <p>このサーバーはREST APIのみを提供しています。</p>
                    <p><strong>フロントエンドアプリケーションは別サーバーで動作しています。</strong></p>
                </div>
                <a href="http://localhost:5173" target="_blank">Vueフロントエンドを開く (localhost:5173)</a>
                <p style="margin-top: 40px; color: #666;">
                    API Endpoint: <code>/api/*</code>
                </p>
            </body>
            </html>
            """;
    }
}
