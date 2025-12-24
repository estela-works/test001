# services

バックエンドAPIとの通信を担当するサービス層。

## ファイル一覧

| ファイル | 説明 |
|---------|------|
| `apiClient.ts` | Axios HTTPクライアント設定 |
| `todoService.ts` | ToDo API通信サービス |
| `projectService.ts` | プロジェクトAPI通信サービス |
| `userService.ts` | ユーザーAPI通信サービス |

## API構成

- ベースURL: `/api`
- 各サービスはCRUD操作を提供
