# テストスペック

Playwrightテストスペックを格納するフォルダ。

## フォルダ構成

```
specs/
├── home/            # ホーム画面テスト
├── todos/           # ToDo管理画面テスト
├── projects/        # 案件一覧画面テスト
└── users/           # ユーザー管理画面テスト
```

## テスト実行

```bash
# 全テスト実行
npm test

# 特定のテストフォルダを実行
npx playwright test specs/home/
npx playwright test specs/todos/
npx playwright test specs/projects/
npx playwright test specs/users/
```
