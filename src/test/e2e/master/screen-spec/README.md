# 画面仕様JSON

画面から自動抽出した仕様JSONを格納するフォルダ。

## ファイル構成

| ファイル | 画面 |
|---------|------|
| todos-screen.json | ToDo管理画面 |
| projects-screen.json | 案件一覧画面 |
| users-screen.json | ユーザー管理画面 |

## 抽出方法

```bash
npm run extract-spec:all
```

## JSONの構造

| カテゴリ | 内容 |
|---------|------|
| inputs | 入力フィールド（input, textarea, select） |
| buttons | ボタン要素 |
| dynamicElements | 動的リスト要素 |
| stats | 統計表示要素 |
| messages | エラー・ローディング表示 |
| links | リンク要素 |
| waitConditions | 待機条件 |
| apiEndpoints | 推測されたAPIエンドポイント |
