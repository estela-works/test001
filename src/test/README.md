# テストガイド

## 概要

このプロジェクトでは、JUnit 5 + AssertJ を使用してテストを実装しています。

## テスト作成の運用フロー

```
テンプレート + 新テスト仕様書 → 新テスト
```

1. テストテンプレートをコピーして新規テストクラスを作成
2. プレースホルダーを実際の値に置換
3. `./mvnw test` で動作確認

## テストテンプレート

テスト作成時は以下のテンプレートを活用してください。

| テンプレート | 用途 | 配置場所 |
|-------------|------|---------|
| [ControllerTestTemplate.java](java/com/example/demo/template/ControllerTestTemplate.java) | REST API テスト | Controller層 |
| [ServiceTestTemplate.java](java/com/example/demo/template/ServiceTestTemplate.java) | ビジネスロジックテスト | Service層 |
| [MapperTestTemplate.java](java/com/example/demo/template/MapperTestTemplate.java) | データアクセス層テスト | Mapper層 |

詳細な使い方は [TEST_GUIDE.md](../../docs/testing/TEST_GUIDE.md) を参照してください。

## テスト構成

```
src/test/
├── java/com/example/demo/
│   ├── template/                    # テストテンプレート
│   │   ├── ControllerTestTemplate.java
│   │   ├── ServiceTestTemplate.java
│   │   └── MapperTestTemplate.java
│   ├── TodoControllerTest.java      # Controller層テスト
│   ├── TodoServiceTest.java         # Service層テスト
│   ├── TodoMapperTest.java          # Mapper層テスト
│   ├── UserControllerTest.java
│   ├── UserServiceTest.java
│   ├── UserMapperTest.java
│   ├── ProjectControllerTest.java
│   └── ProjectServiceTest.java
└── README.md                        # このファイル
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

| クラス | 対象 | レイヤー |
|--------|------|---------|
| TodoControllerTest | TodoController | Controller |
| TodoServiceTest | TodoService | Service |
| TodoMapperTest | TodoMapper | Mapper |
| UserControllerTest | UserController | Controller |
| UserServiceTest | UserService | Service |
| UserMapperTest | UserMapper | Mapper |
| ProjectControllerTest | ProjectController | Controller |
| ProjectServiceTest | ProjectService | Service |

## テストケースID体系

### 統一命名規則

```
{層プレフィックス}-{エンティティ略称}-{連番}
```

| レイヤー | プレフィックス | 例 |
|---------|---------------|-----|
| Controller | CT | CT-USR-001 |
| Service | ST | ST-TODO-001 |
| Mapper | MT | MT-PRJ-001 |

### カテゴリサフィックス

| サフィックス | 説明 | 例 |
|-------------|------|-----|
| (なし) | 正常系 | CT-USR-001 |
| E | エラー系 | CT-USR-E001 |
| X | 例外テスト | ST-TODO-X001 |

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

- [TEST_GUIDE.md](../../docs/testing/TEST_GUIDE.md) - テストテンプレート使用ガイド
- [ドキュメントトップ](../../docs/README.md) - 全ドキュメント一覧

## 依存ライブラリ

`spring-boot-starter-test` に含まれる:
- JUnit 5 (Jupiter)
- AssertJ
- Mockito
- Hamcrest
