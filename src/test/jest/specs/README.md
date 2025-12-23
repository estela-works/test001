# specs/

テストスペックファイルを配置するディレクトリ。

## 構成

```
specs/
├── components/     # Vueコンポーネントテスト
│   ├── todos/
│   ├── projects/
│   └── users/
├── stores/         # Piniaストアテスト
└── utils/          # ユーティリティ関数テスト
```

## 命名規則

- ファイル名: `{対象名}.spec.ts`
- テストID: `UT-{層}-{エンティティ}-{番号}`

## テスト実行

```bash
# 全テスト
npm test

# カテゴリ別
npm run test:utils
npm run test:components
npm run test:stores
```
