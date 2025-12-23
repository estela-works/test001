# ページオブジェクト

Page Object Patternによるページクラスを格納するフォルダ。

## ファイル構成

| ファイル | 説明 |
|---------|------|
| base.page.ts | ベースページクラス |
| todos.page.ts | ToDo管理画面ページオブジェクト |
| projects.page.ts | 案件一覧画面ページオブジェクト |
| users.page.ts | ユーザー管理画面ページオブジェクト |

## ベースページクラス

全ページオブジェクトの基底クラス。共通メソッドを提供する。

### 主要メソッド

| メソッド | 説明 |
|---------|------|
| goto() | 画面に遷移 |
| waitForLoadingComplete() | ローディング完了を待機 |
| getVueAwareLocator() | Vue対応のロケータを取得 |
