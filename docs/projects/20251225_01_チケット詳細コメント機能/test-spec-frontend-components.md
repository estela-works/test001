# フロントエンドテスト仕様書 - コンポーネントテスト

[← 目次に戻る](./test-spec-frontend.md)

---

## 2. 単体テスト - コンポーネント

### 2.1 TodoDetailModal.vue

**テスト対象**: `src/frontend/src/components/todo/TodoDetailModal.vue`

#### FT-TDM-001: TodoDetailModal - モーダルが開く

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-001 |
| テスト観点 | isOpen=trueの時、モーダルが表示される |
| 分類 | 正常系 |
| ストア状態 | todoStore: todoあり、commentStore: 初期状態 |
| Props | `todoId: 1, isOpen: true` |
| 期待結果 | モーダルオーバーレイとコンテナが表示される、「チケット詳細」ヘッダーが表示される |
| 確認方法 | `screen.getByText('チケット詳細')` が存在する |

#### FT-TDM-002: TodoDetailModal - モーダルが閉じる

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-002 |
| テスト観点 | isOpen=falseの時、モーダルが表示されない |
| 分類 | 正常系 |
| ストア状態 | 初期状態 |
| Props | `todoId: 1, isOpen: false` |
| 期待結果 | モーダルが表示されない |
| 確認方法 | `screen.queryByText('チケット詳細')` が null |

#### FT-TDM-003: TodoDetailModal - Escキーで閉じる

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-003 |
| テスト観点 | Escキー押下でモーダルが閉じる |
| 分類 | 正常系 |
| ストア状態 | todoStore: todoあり |
| Props | `todoId: 1, isOpen: true` |
| ユーザー操作 | Escキーを押下 |
| 期待結果 | close イベントが emit される |
| 確認方法 | `emitted().close` が存在する |

#### FT-TDM-004: TodoDetailModal - オーバーレイクリックで閉じる

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-004 |
| テスト観点 | オーバーレイクリックでモーダルが閉じる |
| 分類 | 正常系 |
| ストア状態 | todoStore: todoあり |
| Props | `todoId: 1, isOpen: true` |
| ユーザー操作 | `.modal-overlay` をクリック |
| 期待結果 | close イベントが emit される |
| 確認方法 | `emitted().close` が存在する |

#### FT-TDM-005: TodoDetailModal - チケット情報表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-005 |
| テスト観点 | チケット詳細情報が正しく表示される |
| 分類 | 正常系 |
| ストア状態 | todoStore: { id: 1, title: 'テストタスク', description: 'テスト説明', completed: false } |
| Props | `todoId: 1, isOpen: true` |
| 期待結果 | タイトル、説明、ステータスバッジが表示される |
| 確認方法 | `screen.getByText('テストタスク')`, `screen.getByText('テスト説明')`, `screen.getByText('未完了')` が存在 |

#### FT-TDM-006: TodoDetailModal - 完了ボタン押下

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-006 |
| テスト観点 | 「完了にする」ボタン押下で完了状態に変わる |
| 分類 | 正常系 |
| ストア状態 | todoStore: { id: 1, completed: false } |
| Props | `todoId: 1, isOpen: true` |
| ユーザー操作 | 「完了にする」ボタンをクリック |
| 期待結果 | todoStore.toggleTodo が呼ばれる、todoUpdated イベントが emit される |
| 確認方法 | ストアアクションのモック呼び出しを確認、`emitted().todoUpdated` が存在 |

#### FT-TDM-007: TodoDetailModal - 閉じるボタン

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-007 |
| テスト観点 | 「×」ボタン押下でモーダルが閉じる |
| 分類 | 正常系 |
| ストア状態 | 初期状態 |
| Props | `todoId: 1, isOpen: true` |
| ユーザー操作 | `.close-button` をクリック |
| 期待結果 | close イベントが emit される |
| 確認方法 | `emitted().close` が存在する |

---

### 2.2 CommentList.vue

**テスト対象**: `src/frontend/src/components/todo/CommentList.vue`

#### FT-CL-001: CommentList - 読み込み中表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-001 |
| テスト観点 | ローディング中は「読み込み中...」が表示される |
| 分類 | 正常系 |
| ストア状態 | commentStore: { loading: true, comments: [] } |
| Props | `todoId: 1` |
| 期待結果 | 「読み込み中...」が表示される |
| 確認方法 | `screen.getByText('読み込み中...')` が存在 |

#### FT-CL-002: CommentList - 空状態表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-002 |
| テスト観点 | コメントが0件の時、空メッセージが表示される |
| 分類 | 正常系 |
| ストア状態 | commentStore: { loading: false, comments: [], error: null } |
| Props | `todoId: 1` |
| 期待結果 | 「コメントはまだありません」が表示される |
| 確認方法 | `screen.getByText('コメントはまだありません')` が存在 |

#### FT-CL-003: CommentList - コメント一覧表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-003 |
| テスト観点 | コメント一覧が正しく表示される |
| 分類 | 正常系 |
| ストア状態 | commentStore: { comments: [{ id: 1, content: 'テストコメント1', userName: 'ユーザー1' }, { id: 2, content: 'テストコメント2', userName: 'ユーザー2' }] } |
| Props | `todoId: 1` |
| 期待結果 | 2件のCommentItemが表示される |
| 確認方法 | `screen.getAllByRole('article')` の長さが2 |

#### FT-CL-004: CommentList - エラー表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-004 |
| テスト観点 | エラー発生時、エラーメッセージが表示される |
| 分類 | 異常系 |
| ストア状態 | commentStore: { loading: false, error: 'コメントの取得に失敗しました', comments: [] } |
| Props | `todoId: 1` |
| 期待結果 | エラーメッセージが赤背景で表示される |
| 確認方法 | `screen.getByText('コメントの取得に失敗しました')` が存在、親要素に `.error` クラス |

#### FT-CL-005: CommentList - マウント時にコメント取得

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-005 |
| テスト観点 | コンポーネントマウント時、fetchComments が呼ばれる |
| 分類 | 正常系 |
| ストア状態 | commentStore: 初期状態 |
| Props | `todoId: 1` |
| 期待結果 | commentStore.fetchComments(1) が呼ばれる |
| 確認方法 | MSWでGET /api/todos/1/comments のリクエストを検証 |

#### FT-CL-006: CommentList - アンマウント時にクリア

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-006 |
| テスト観点 | アンマウント時、clearComments が呼ばれる |
| 分類 | 正常系 |
| ストア状態 | commentStore: { comments: [...] } |
| Props | `todoId: 1` |
| 期待結果 | アンマウント後、commentStore.clearComments() が呼ばれる |
| 確認方法 | `unmount()` 後、ストアの状態が初期化されている |

#### FT-CL-007: CommentList - 削除確認ダイアログ

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-007 |
| テスト観点 | 削除ボタン押下で確認ダイアログが表示される |
| 分類 | 正常系 |
| ストア状態 | commentStore: { comments: [{ id: 1, content: 'テスト' }] } |
| Props | `todoId: 1` |
| ユーザー操作 | 削除ボタンをクリック |
| 期待結果 | window.confirm が呼ばれる |
| 確認方法 | vi.spyOn(window, 'confirm') でモック検証 |

---

### 2.3 CommentForm.vue

**テスト対象**: `src/frontend/src/components/todo/CommentForm.vue`

#### FT-CF-001: CommentForm - 初期表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-001 |
| テスト観点 | フォームが正しく表示される |
| 分類 | 正常系 |
| ストア状態 | userStore: { users: [{ id: 1, name: 'テストユーザー' }] } |
| Props | `todoId: 1` |
| 期待結果 | コメント入力欄、投稿者選択、投稿ボタンが表示される |
| 確認方法 | `screen.getByLabelText('コメント')`, `screen.getByLabelText('投稿者')`, `screen.getByRole('button', { name: '投稿' })` が存在 |

#### FT-CF-002: CommentForm - 文字数カウント

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-002 |
| テスト観点 | 入力中の文字数が表示される |
| 分類 | 正常系 |
| ストア状態 | 初期状態 |
| Props | `todoId: 1` |
| ユーザー操作 | テキストエリアに「テスト」を入力 |
| 期待結果 | 「3 / 2000」と表示される |
| 確認方法 | `screen.getByText(/3 \/ 2000/)` が存在 |

#### FT-CF-003: CommentForm - 投稿ボタン活性/非活性

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-003 |
| テスト観点 | コンテンツと投稿者が未入力の場合、投稿ボタンが非活性 |
| 分類 | 正常系 |
| ストア状態 | 初期状態 |
| Props | `todoId: 1` |
| 期待結果 | 投稿ボタンが disabled 状態 |
| 確認方法 | `screen.getByRole('button', { name: '投稿' }).disabled` が true |

#### FT-CF-004: CommentForm - バリデーションエラー（空コンテンツ）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-004 |
| テスト観点 | コンテンツが空の場合、バリデーションエラーが表示される |
| 分類 | 異常系 |
| ストア状態 | userStore: { users: [{ id: 1, name: 'テストユーザー' }] } |
| Props | `todoId: 1` |
| ユーザー操作 | 投稿者のみ選択して投稿ボタンをクリック |
| 期待結果 | 「コメントを入力してください（最大2000文字）」エラーが表示される |
| 確認方法 | `screen.getByText('コメントを入力してください（最大2000文字）')` が存在 |

#### FT-CF-005: CommentForm - バリデーションエラー（投稿者未選択）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-005 |
| テスト観点 | 投稿者が未選択の場合、バリデーションエラーが表示される |
| 分類 | 異常系 |
| ストア状態 | userStore: { users: [{ id: 1, name: 'テストユーザー' }] } |
| Props | `todoId: 1` |
| ユーザー操作 | コンテンツのみ入力して投稿ボタンをクリック |
| 期待結果 | 「投稿者を選択してください」エラーが表示される |
| 確認方法 | `screen.getByText('投稿者を選択してください')` が存在 |

#### FT-CF-006: CommentForm - バリデーションエラー（文字数超過）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-006 |
| テスト観点 | コンテンツが2000文字を超える場合、バリデーションエラーが表示される |
| 分類 | 異常系 |
| ストア状態 | userStore: { users: [{ id: 1, name: 'テストユーザー' }] } |
| Props | `todoId: 1` |
| ユーザー操作 | 2001文字のテキストを入力して投稿 |
| 期待結果 | 「コメントは2000文字以内で入力してください」エラーが表示される |
| 確認方法 | `screen.getByText('コメントは2000文字以内で入力してください')` が存在 |

#### FT-CF-007: CommentForm - コメント投稿成功

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-007 |
| テスト観点 | 正しい入力でコメント投稿が成功する |
| 分類 | 正常系 |
| ストア状態 | userStore: { users: [{ id: 1, name: 'テストユーザー' }] }, commentStore: 初期状態 |
| Props | `todoId: 1` |
| ユーザー操作 | コンテンツに「テストコメント」を入力、投稿者を選択、投稿ボタンをクリック |
| 期待結果 | commentStore.createComment が呼ばれる、フォームがクリアされる、commentCreated イベントが emit される |
| 確認方法 | MSWでPOST /api/todos/1/comments のリクエストを検証、`emitted().commentCreated` が存在 |

#### FT-CF-008: CommentForm - 投稿中はボタンが非活性

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-008 |
| テスト観点 | 投稿中は投稿ボタンが非活性になる |
| 分類 | 正常系 |
| ストア状態 | commentStore: { submitting: true } |
| Props | `todoId: 1` |
| 期待結果 | 投稿ボタンが disabled、ボタンテキストが「投稿中...」 |
| 確認方法 | `screen.getByRole('button', { name: '投稿中...' }).disabled` が true |

#### FT-CF-009: CommentForm - ユーザー一覧取得

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-009 |
| テスト観点 | マウント時にユーザー一覧を取得する |
| 分類 | 正常系 |
| ストア状態 | userStore: 初期状態 |
| Props | `todoId: 1` |
| 期待結果 | userStore.fetchUsers() が呼ばれる |
| 確認方法 | MSWでGET /api/users のリクエストを検証 |

---

### 2.4 CommentItem.vue

**テスト対象**: `src/frontend/src/components/todo/CommentItem.vue`

#### FT-CI-001: CommentItem - コメント表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-001 |
| テスト観点 | コメント情報が正しく表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, userName: 'テストユーザー', content: 'テストコメント', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | ユーザー名、コンテンツ、相対時間が表示される |
| 確認方法 | `screen.getByText('テストユーザー')`, `screen.getByText('テストコメント')` が存在 |

#### FT-CI-002: CommentItem - 削除されたユーザー表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-002 |
| テスト観点 | userName が null の時、「削除されたユーザー」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, userName: null, content: 'テストコメント', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | 「削除されたユーザー」が表示される |
| 確認方法 | `screen.getByText('削除されたユーザー')` が存在 |

#### FT-CI-003: CommentItem - 相対時間表示（分前）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-003 |
| テスト観点 | 1時間以内のコメントは「○分前」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '現在時刻から30分前のISO文字列' }` |
| 期待結果 | 「30分前」と表示される |
| 確認方法 | `screen.getByText(/30分前/)` が存在 |

#### FT-CI-004: CommentItem - 相対時間表示（時間前）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-004 |
| テスト観点 | 1日以内のコメントは「○時間前」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '現在時刻から5時間前のISO文字列' }` |
| 期待結果 | 「5時間前」と表示される |
| 確認方法 | `screen.getByText(/5時間前/)` が存在 |

#### FT-CI-005: CommentItem - 相対時間表示（日前）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-005 |
| テスト観点 | 7日以内のコメントは「○日前」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '現在時刻から3日前のISO文字列' }` |
| 期待結果 | 「3日前」と表示される |
| 確認方法 | `screen.getByText(/3日前/)` が存在 |

#### FT-CI-006: CommentItem - 絶対時間表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-006 |
| テスト観点 | 7日以上前のコメントは絶対時間で表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '2025-12-10T10:00:00' }` |
| 期待結果 | 「2025/12/10 10:00」形式で表示される |
| 確認方法 | `screen.getByText(/2025\/12\/10/)` が存在 |

#### FT-CI-007: CommentItem - 削除ボタン押下

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-007 |
| テスト観点 | 削除ボタン押下でdeleteイベントが emit される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, userName: 'テスト', content: 'テスト', createdAt: '2025-12-25T10:00:00' }` |
| ユーザー操作 | 削除ボタンをクリック |
| 期待結果 | delete イベントが commentId=1 で emit される |
| 確認方法 | `emitted().delete[0]` が `[1]` |
