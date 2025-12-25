# ソースコード

アプリケーションのソースコードを格納するフォルダです。

## フォルダ構成

```
src/
├── main/                   # 本番コード
│   ├── java/               # Javaソースコード
│   └── resources/          # 設定ファイル・静的リソース
└── test/                   # テストコード
    ├── java/               # JUnitテスト
    ├── resources/          # テスト用設定ファイル
    └── e2e/                # Playwright E2Eテスト
```

## 関連ドキュメント

- [実装ガイド](../docs/implementation/IMPLEMENTATION_GUIDE.md)
- [テストガイド](../docs/testing/TEST_GUIDE.md)
- [E2Eテスト README](test/e2e/README.md)
