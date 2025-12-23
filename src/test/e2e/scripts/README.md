# ユーティリティスクリプト

E2Eテスト用のユーティリティスクリプトを格納するフォルダ。

## スクリプト一覧

| スクリプト | 説明 |
|-----------|------|
| extract-screen-spec.ts | 画面仕様JSON自動抽出 |

## 画面仕様抽出

実際の画面から画面仕様JSONを自動生成するスクリプト。

### 実行方法

```bash
# 特定の画面を抽出
npm run extract-spec -- /todos.html
npm run extract-spec -- /projects.html
npm run extract-spec -- /users.html

# 全画面を一括抽出
npm run extract-spec:all
```

### 出力先

抽出されたJSONは `master/screen-spec/` フォルダに保存される。
