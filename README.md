# Simple Spring Boot ToDo Application

Spring Boot 3.2 + Java 21 で構築されたシンプルなToDoアプリケーションです。

## 必要環境

- Java 21
- Maven（Maven Wrapperが同梱されているため、インストール不要）

## 起動方法

### Windows

```cmd
mvnw.cmd spring-boot:run
```

### Mac/Linux

```bash
./mvnw spring-boot:run
```

## アクセス

アプリケーション起動後、ブラウザで以下にアクセス:

- http://localhost:8080 - トップページ
- http://localhost:8080/todos.html - ToDo管理画面

## API エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/todos | ToDo一覧取得 |
| POST | /api/todos | ToDo作成 |
| PUT | /api/todos/{id} | ToDo更新 |
| DELETE | /api/todos/{id} | ToDo削除 |

## プロジェクト構成

```
src/main/java/com/example/demo/
├── SimpleSpringApplication.java  # メインクラス
├── HelloController.java          # トップページ
├── Todo.java                     # エンティティ
├── TodoController.java           # REST API
└── TodoService.java              # ビジネスロジック
```
