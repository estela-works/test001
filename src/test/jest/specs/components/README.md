# specs/components/

Vue.jsコンポーネントのテストを配置するディレクトリ。

## テストID プレフィックス

`UT-C-{エンティティ}-{番号}`

## 構成

```
components/
├── todos/      # ToDo関連コンポーネント
├── projects/   # 案件関連コンポーネント
└── users/      # ユーザー関連コンポーネント
```

## テスト方針

- `@vue/test-utils` の `mount` / `shallowMount` を使用
- `@pinia/testing` でストアをモック
- `data-testid` 属性でセレクタを指定
