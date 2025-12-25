# フロントエンドテスト仕様書 - 統合テスト・一覧・データ

[← 目次に戻る](./test-spec-frontend.md)

---

## 3. 統合テスト

### 3.1 API統合テスト

#### FT-IT-001: TodoDetailModal - コメント一覧取得〜表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-IT-001 |
| テスト観点 | モーダル表示時、APIからコメント一覧を取得して表示する |
| エンドポイント | `GET /api/todos/1/comments` |
| MSWモック | `[{ id: 1, todoId: 1, userId: 1, userName: 'テストユーザー', content: 'テストコメント', createdAt: '2025-12-25T10:00:00' }]` |
| 期待結果 | モーダルにコメントが表示される、「コメント (1件)」と表示される |

#### FT-IT-002: CommentForm - コメント投稿〜一覧更新

| 項目 | 内容 |
|------|------|
| テストケースID | FT-IT-002 |
| テスト観点 | コメント投稿成功後、一覧が自動更新される |
| エンドポイント | `POST /api/todos/1/comments` |
| MSWモック | 201 Created, `{ id: 2, todoId: 1, userId: 1, userName: 'テストユーザー', content: '新規コメント', createdAt: '2025-12-25T11:00:00' }` |
| 期待結果 | 新しいコメントが一覧の先頭に追加される、フォームがクリアされる |

#### FT-IT-003: CommentList - コメント削除〜一覧更新

| 項目 | 内容 |
|------|------|
| テストケースID | FT-IT-003 |
| テスト観点 | コメント削除成功後、一覧から削除される |
| エンドポイント | `DELETE /api/comments/1` |
| MSWモック | 204 No Content |
| 期待結果 | 削除したコメントが一覧から消える、コメント件数が減る |

#### FT-IT-004: CommentForm - 投稿失敗（バリデーションエラー）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-IT-004 |
| テスト観点 | バリデーションエラー時、適切なエラーメッセージが表示される |
| エンドポイント | `POST /api/todos/1/comments` |
| MSWモック | 400 Bad Request, `{ message: '入力内容に誤りがあります' }` |
| 期待結果 | エラーメッセージが表示される、コメント一覧は変わらない |

---

## 4. テストケース一覧

| ID | 対象 | テスト観点 | 分類 | 優先度 | ステータス |
|----|------|-----------|------|--------|-----------|
| FT-TDM-001 | TodoDetailModal | モーダルが開く | 正常系 | 高 | 未実施 |
| FT-TDM-002 | TodoDetailModal | モーダルが閉じる | 正常系 | 高 | 未実施 |
| FT-TDM-003 | TodoDetailModal | Escキーで閉じる | 正常系 | 高 | 未実施 |
| FT-TDM-004 | TodoDetailModal | オーバーレイクリックで閉じる | 正常系 | 中 | 未実施 |
| FT-TDM-005 | TodoDetailModal | チケット情報表示 | 正常系 | 高 | 未実施 |
| FT-TDM-006 | TodoDetailModal | 完了ボタン押下 | 正常系 | 中 | 未実施 |
| FT-TDM-007 | TodoDetailModal | 閉じるボタン | 正常系 | 中 | 未実施 |
| FT-CL-001 | CommentList | 読み込み中表示 | 正常系 | 中 | 未実施 |
| FT-CL-002 | CommentList | 空状態表示 | 正常系 | 中 | 未実施 |
| FT-CL-003 | CommentList | コメント一覧表示 | 正常系 | 高 | 未実施 |
| FT-CL-004 | CommentList | エラー表示 | 異常系 | 高 | 未実施 |
| FT-CL-005 | CommentList | マウント時にコメント取得 | 正常系 | 高 | 未実施 |
| FT-CL-006 | CommentList | アンマウント時にクリア | 正常系 | 中 | 未実施 |
| FT-CL-007 | CommentList | 削除確認ダイアログ | 正常系 | 中 | 未実施 |
| FT-CF-001 | CommentForm | 初期表示 | 正常系 | 高 | 未実施 |
| FT-CF-002 | CommentForm | 文字数カウント | 正常系 | 低 | 未実施 |
| FT-CF-003 | CommentForm | 投稿ボタン活性/非活性 | 正常系 | 中 | 未実施 |
| FT-CF-004 | CommentForm | バリデーションエラー（空コンテンツ） | 異常系 | 高 | 未実施 |
| FT-CF-005 | CommentForm | バリデーションエラー（投稿者未選択） | 異常系 | 高 | 未実施 |
| FT-CF-006 | CommentForm | バリデーションエラー（文字数超過） | 異常系 | 高 | 未実施 |
| FT-CF-007 | CommentForm | コメント投稿成功 | 正常系 | 高 | 未実施 |
| FT-CF-008 | CommentForm | 投稿中はボタンが非活性 | 正常系 | 中 | 未実施 |
| FT-CF-009 | CommentForm | ユーザー一覧取得 | 正常系 | 高 | 未実施 |
| FT-CI-001 | CommentItem | コメント表示 | 正常系 | 高 | 未実施 |
| FT-CI-002 | CommentItem | 削除されたユーザー表示 | 正常系 | 中 | 未実施 |
| FT-CI-003 | CommentItem | 相対時間表示（分前） | 正常系 | 低 | 未実施 |
| FT-CI-004 | CommentItem | 相対時間表示（時間前） | 正常系 | 低 | 未実施 |
| FT-CI-005 | CommentItem | 相対時間表示（日前） | 正常系 | 低 | 未実施 |
| FT-CI-006 | CommentItem | 絶対時間表示 | 正常系 | 低 | 未実施 |
| FT-CI-007 | CommentItem | 削除ボタン押下 | 正常系 | 高 | 未実施 |
| FT-ST-001 | commentStore | 初期状態 | 正常系 | 高 | 未実施 |
| FT-ST-002 | commentStore | fetchComments成功 | 正常系 | 高 | 未実施 |
| FT-ST-003 | commentStore | fetchComments失敗（404） | 異常系 | 高 | 未実施 |
| FT-ST-004 | commentStore | fetchComments失敗（ネットワークエラー） | 異常系 | 中 | 未実施 |
| FT-ST-005 | commentStore | createComment成功 | 正常系 | 高 | 未実施 |
| FT-ST-006 | commentStore | createComment失敗（400） | 異常系 | 高 | 未実施 |
| FT-ST-007 | commentStore | deleteComment成功 | 正常系 | 高 | 未実施 |
| FT-ST-008 | commentStore | deleteComment失敗（404） | 異常系 | 中 | 未実施 |
| FT-ST-009 | commentStore | clearComments | 正常系 | 中 | 未実施 |
| FT-ST-010 | commentStore | $reset | 正常系 | 低 | 未実施 |
| FT-PF-001 | validateCreateCommentRequest | 正常入力 | 正常系 | 高 | 未実施 |
| FT-PF-002 | validateCreateCommentRequest | userId未指定 | 異常系 | 高 | 未実施 |
| FT-PF-003 | validateCreateCommentRequest | content空文字 | 異常系 | 高 | 未実施 |
| FT-PF-004 | validateCreateCommentRequest | content文字数超過 | 異常系 | 高 | 未実施 |
| FT-PF-005 | isComment | 正しいComment型 | 正常系 | 高 | 未実施 |
| FT-PF-006 | isComment | 不正な型（idが文字列） | 異常系 | 高 | 未実施 |
| FT-PF-007 | isComment | 不正な型（フィールド欠落） | 異常系 | 高 | 未実施 |
| FT-PF-008 | isCommentList | 正しいComment配列 | 正常系 | 中 | 未実施 |
| FT-PF-009 | isCommentList | 不正な配列（1件でも不正） | 異常系 | 中 | 未実施 |
| FT-IT-001 | TodoDetailModal | コメント一覧取得〜表示 | 正常系 | 高 | 未実施 |
| FT-IT-002 | CommentForm | コメント投稿〜一覧更新 | 正常系 | 高 | 未実施 |
| FT-IT-003 | CommentList | コメント削除〜一覧更新 | 正常系 | 高 | 未実施 |
| FT-IT-004 | CommentForm | 投稿失敗（バリデーションエラー） | 異常系 | 高 | 未実施 |

**合計**: 51件

---

## 5. テストデータ

### 5.1 MSWモックデータ

| データID | 用途 | エンドポイント | レスポンス |
|---------|------|---------------|-----------|
| FTD-001 | コメント一覧取得（正常） | GET /api/todos/1/comments | `[{ id: 1, todoId: 1, userId: 1, userName: 'テストユーザー', content: 'テストコメント', createdAt: '2025-12-25T10:00:00' }]` |
| FTD-002 | コメント一覧取得（空） | GET /api/todos/2/comments | `[]` |
| FTD-003 | コメント一覧取得（404） | GET /api/todos/999/comments | `404 Not Found` |
| FTD-004 | コメント作成（成功） | POST /api/todos/1/comments | `201 Created, { id: 2, todoId: 1, userId: 1, userName: 'テストユーザー', content: '新規コメント', createdAt: '2025-12-25T11:00:00' }` |
| FTD-005 | コメント作成（400） | POST /api/todos/1/comments | `400 Bad Request, { message: '入力内容に誤りがあります' }` |
| FTD-006 | コメント削除（成功） | DELETE /api/comments/1 | `204 No Content` |
| FTD-007 | コメント削除（404） | DELETE /api/comments/999 | `404 Not Found` |
| FTD-008 | ユーザー一覧取得 | GET /api/users | `[{ id: 1, name: 'テストユーザー1' }, { id: 2, name: 'テストユーザー2' }]` |

### 5.2 ストア初期状態

| 状態ID | 用途 | ストア | 状態内容 |
|--------|------|--------|---------|
| FTS-001 | コメントあり | commentStore | `{ comments: [{ id: 1, todoId: 1, userId: 1, userName: 'テストユーザー', content: 'テストコメント', createdAt: '2025-12-25T10:00:00' }], loading: false, error: null, currentTodoId: 1 }` |
| FTS-002 | エラー状態 | commentStore | `{ comments: [], loading: false, error: 'コメントの取得に失敗しました', currentTodoId: null }` |
| FTS-003 | ローディング中 | commentStore | `{ comments: [], loading: true, error: null, currentTodoId: 1 }` |
| FTS-004 | ユーザーあり | userStore | `{ users: [{ id: 1, name: 'テストユーザー1' }, { id: 2, name: 'テストユーザー2' }] }` |
