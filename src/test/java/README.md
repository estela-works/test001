# JUnitテスト

JUnit 5によるユニットテスト・統合テスト。

## パッケージ構成

```
com/example/demo/
├── *ControllerTest.java    # REST APIテスト
├── *ServiceTest.java       # ビジネスロジックテスト
├── *MapperTest.java        # データアクセス層テスト
└── template/               # テストテンプレート
```

## テスト実行

```bash
# Windows
mvnw.cmd test

# Mac/Linux
./mvnw test
```

## 関連ドキュメント

- [テストガイド](../../../docs/testing/TEST_GUIDE.md)
- [テストテンプレート](com/example/demo/template/)
