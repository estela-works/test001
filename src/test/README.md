# テストガイド

## 概要

このプロジェクトでは、JUnit 5 + AssertJ を使用して単体テストを実装しています。

## テスト作成の運用フロー

```
テンプレート + 新テスト仕様書 → 新テスト
```

1. [test-spec-template.md](../../docs/test/template/test-spec-template.md) をコピーして仕様書を作成
2. [test-template.md](../../docs/test/template/test-template.md) を参照してテストクラスを実装
3. `./mvnw test` で動作確認

## テスト構成

```
src/test/
├── java/com/example/demo/
│   └── TodoServiceTest.java    # TodoServiceの単体テスト（38ケース）
└── README.md                   # このファイル
```

## テスト実行方法

### 全テスト実行

```bash
./mvnw test
```

### 特定クラスのテスト実行

```bash
./mvnw test -Dtest=TodoServiceTest
```

### 特定メソッドのテスト実行

```bash
# getAllTodosのテストのみ実行
./mvnw test -Dtest=TodoServiceTest#getAllTodos*

# 特定のテストメソッドを実行
./mvnw test -Dtest="TodoServiceTest\$GetAllTodosTest#getAllTodos_WhenInitialState_ReturnsThreeTodosSortedByCreatedAt"
```

### テストレポート出力

```bash
./mvnw test
# レポートは target/surefire-reports/ に出力されます
```

## テストクラス一覧

| クラス | 対象 | テスト数 |
|--------|------|---------|
| TodoServiceTest | TodoService | 38 |

## テストケースID体系

| プレフィックス | メソッド |
|---------------|----------|
| GT | getAllTodos |
| GC | getTodosByCompleted |
| GI | getTodoById |
| CT | createTodo |
| UT | updateTodo |
| TC | toggleComplete |
| DT | deleteTodo |
| DA | deleteAllTodos |
| CN | getTotalCount |
| CC | getCompletedCount |
| PC | getPendingCount |

## テスト設計方針

### 独立性
- 各テストは `@BeforeEach` で新しいインスタンスを生成
- テスト間の状態干渉を防止

### 構造
- `@Nested` でメソッドごとにグループ化
- `@DisplayName` で日本語テスト名を記述

### アサーション
- AssertJ を使用（流暢なAPIで可読性向上）

## 関連ドキュメント

- [単体テスト仕様書](../../docs/test/unit-test-spec.md) - 詳細なテストケース定義
- [ドキュメントトップ](../../docs/README.md) - 全ドキュメント一覧

## 依存ライブラリ

`spring-boot-starter-test` に含まれる:
- JUnit 5 (Jupiter)
- AssertJ
- Mockito
- Hamcrest
