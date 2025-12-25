# フロントエンドテスト方針書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | ToDoチケット詳細モーダル＋コメント機能 |
| 案件ID | 20251225_チケット詳細コメント機能 |
| 作成日 | 2025-12-25 |
| 作成者 | システム管理者 |
| 関連詳細設計書 | [detail-design-frontend.md](./detail-design-frontend.md), [detail-design-store.md](./detail-design-store.md), [detail-design-types.md](./detail-design-types.md) |

---

## 1. テスト概要

### 1.1 テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| TodoDetailModal.vue | 新規 | チケット詳細とコメント機能を表示するモーダルコンポーネント |
| CommentList.vue | 新規 | コメント一覧を表示するコンポーネント |
| CommentForm.vue | 新規 | コメント投稿フォームコンポーネント |
| CommentItem.vue | 新規 | 個別コメント表示コンポーネント |
| commentStore.ts | 新規 | コメント状態管理Piniaストア |
| comment.ts | 新規 | TypeScript型定義（Comment, CreateCommentRequest等） |

### 1.2 テスト方針

**基本方針**:
- Vue Testing Libraryを使用したコンポーネント単体テスト
- Vitestを使用したストア単体テスト
- MSW (Mock Service Worker) によるAPIモック
- ユーザー視点でのインタラクションテスト重視

**カバレッジ目標**:
- コンポーネント: 80%以上
- ストア: 90%以上
- 型定義: 100%（型ガード関数、バリデーション関数）

### 1.3 ストア診断結果

| 診断項目 | 結果 | 備考 |
|---------|------|------|
| ストアの複雑さ | ケース2（ロジック分離型） | API通信とシンプルな状態管理が中心、複雑なビジネスロジックは少ない |
| 推奨テスト戦略 | ロジック分離 + MSW | 型ガード・バリデーション関数を純粋関数としてテスト、ストアはMSWで統合テスト |

**戦略選択理由**:
- コメントストアは主にCRUD操作が中心でロジックがシンプル
- バリデーション関数や型ガードは純粋関数として分離されている
- API通信部分はMSWでモックして実際のフローをテスト

---

## 2. 単体テスト

### 2.1 コンポーネントテスト

#### TodoDetailModal.vue

**テスト対象**: `src/frontend/src/components/todo/TodoDetailModal.vue`

##### FT-TDM-001: TodoDetailModal - モーダルが開く

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-001 |
| テスト観点 | isOpen=trueの時、モーダルが表示される |
| 分類 | 正常系 |
| ストア状態 | todoStore: todoあり、commentStore: 初期状態 |
| Props | `todoId: 1, isOpen: true` |
| 期待結果 | モーダルオーバーレイとコンテナが表示される、「チケット詳細」ヘッダーが表示される |
| 確認方法 | `screen.getByText('チケット詳細')` が存在する |

##### FT-TDM-002: TodoDetailModal - モーダルが閉じる

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-002 |
| テスト観点 | isOpen=falseの時、モーダルが表示されない |
| 分類 | 正常系 |
| ストア状態 | 初期状態 |
| Props | `todoId: 1, isOpen: false` |
| 期待結果 | モーダルが表示されない |
| 確認方法 | `screen.queryByText('チケット詳細')` が null |

##### FT-TDM-003: TodoDetailModal - Escキーで閉じる

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

##### FT-TDM-004: TodoDetailModal - オーバーレイクリックで閉じる

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

##### FT-TDM-005: TodoDetailModal - チケット情報表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TDM-005 |
| テスト観点 | チケット詳細情報が正しく表示される |
| 分類 | 正常系 |
| ストア状態 | todoStore: { id: 1, title: 'テストタスク', description: 'テスト説明', completed: false } |
| Props | `todoId: 1, isOpen: true` |
| 期待結果 | タイトル、説明、ステータスバッジが表示される |
| 確認方法 | `screen.getByText('テストタスク')`, `screen.getByText('テスト説明')`, `screen.getByText('未完了')` が存在 |

##### FT-TDM-006: TodoDetailModal - 完了ボタン押下

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

##### FT-TDM-007: TodoDetailModal - 閉じるボタン

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

#### CommentList.vue

**テスト対象**: `src/frontend/src/components/todo/CommentList.vue`

##### FT-CL-001: CommentList - 読み込み中表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-001 |
| テスト観点 | ローディング中は「読み込み中...」が表示される |
| 分類 | 正常系 |
| ストア状態 | commentStore: { loading: true, comments: [] } |
| Props | `todoId: 1` |
| 期待結果 | 「読み込み中...」が表示される |
| 確認方法 | `screen.getByText('読み込み中...')` が存在 |

##### FT-CL-002: CommentList - 空状態表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-002 |
| テスト観点 | コメントが0件の時、空メッセージが表示される |
| 分類 | 正常系 |
| ストア状態 | commentStore: { loading: false, comments: [], error: null } |
| Props | `todoId: 1` |
| 期待結果 | 「コメントはまだありません」が表示される |
| 確認方法 | `screen.getByText('コメントはまだありません')` が存在 |

##### FT-CL-003: CommentList - コメント一覧表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-003 |
| テスト観点 | コメント一覧が正しく表示される |
| 分類 | 正常系 |
| ストア状態 | commentStore: { comments: [{ id: 1, content: 'テストコメント1', userName: 'ユーザー1' }, { id: 2, content: 'テストコメント2', userName: 'ユーザー2' }] } |
| Props | `todoId: 1` |
| 期待結果 | 2件のCommentItemが表示される |
| 確認方法 | `screen.getAllByRole('article')` の長さが2 |

##### FT-CL-004: CommentList - エラー表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-004 |
| テスト観点 | エラー発生時、エラーメッセージが表示される |
| 分類 | 異常系 |
| ストア状態 | commentStore: { loading: false, error: 'コメントの取得に失敗しました', comments: [] } |
| Props | `todoId: 1` |
| 期待結果 | エラーメッセージが赤背景で表示される |
| 確認方法 | `screen.getByText('コメントの取得に失敗しました')` が存在、親要素に `.error` クラス |

##### FT-CL-005: CommentList - マウント時にコメント取得

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-005 |
| テスト観点 | コンポーネントマウント時、fetchComments が呼ばれる |
| 分類 | 正常系 |
| ストア状態 | commentStore: 初期状態 |
| Props | `todoId: 1` |
| 期待結果 | commentStore.fetchComments(1) が呼ばれる |
| 確認方法 | MSWでGET /api/todos/1/comments のリクエストを検証 |

##### FT-CL-006: CommentList - アンマウント時にクリア

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CL-006 |
| テスト観点 | アンマウント時、clearComments が呼ばれる |
| 分類 | 正常系 |
| ストア状態 | commentStore: { comments: [...] } |
| Props | `todoId: 1` |
| 期待結果 | アンマウント後、commentStore.clearComments() が呼ばれる |
| 確認方法 | `unmount()` 後、ストアの状態が初期化されている |

##### FT-CL-007: CommentList - 削除確認ダイアログ

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

#### CommentForm.vue

**テスト対象**: `src/frontend/src/components/todo/CommentForm.vue`

##### FT-CF-001: CommentForm - 初期表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-001 |
| テスト観点 | フォームが正しく表示される |
| 分類 | 正常系 |
| ストア状態 | userStore: { users: [{ id: 1, name: 'テストユーザー' }] } |
| Props | `todoId: 1` |
| 期待結果 | コメント入力欄、投稿者選択、投稿ボタンが表示される |
| 確認方法 | `screen.getByLabelText('コメント')`, `screen.getByLabelText('投稿者')`, `screen.getByRole('button', { name: '投稿' })` が存在 |

##### FT-CF-002: CommentForm - 文字数カウント

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

##### FT-CF-003: CommentForm - 投稿ボタン活性/非活性

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-003 |
| テスト観点 | コンテンツと投稿者が未入力の場合、投稿ボタンが非活性 |
| 分類 | 正常系 |
| ストア状態 | 初期状態 |
| Props | `todoId: 1` |
| 期待結果 | 投稿ボタンが disabled 状態 |
| 確認方法 | `screen.getByRole('button', { name: '投稿' }).disabled` が true |

##### FT-CF-004: CommentForm - バリデーションエラー（空コンテンツ）

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

##### FT-CF-005: CommentForm - バリデーションエラー（投稿者未選択）

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

##### FT-CF-006: CommentForm - バリデーションエラー（文字数超過）

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

##### FT-CF-007: CommentForm - コメント投稿成功

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

##### FT-CF-008: CommentForm - 投稿中はボタンが非活性

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CF-008 |
| テスト観点 | 投稿中は投稿ボタンが非活性になる |
| 分類 | 正常系 |
| ストア状態 | commentStore: { submitting: true } |
| Props | `todoId: 1` |
| 期待結果 | 投稿ボタンが disabled、ボタンテキストが「投稿中...」 |
| 確認方法 | `screen.getByRole('button', { name: '投稿中...' }).disabled` が true |

##### FT-CF-009: CommentForm - ユーザー一覧取得

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

#### CommentItem.vue

**テスト対象**: `src/frontend/src/components/todo/CommentItem.vue`

##### FT-CI-001: CommentItem - コメント表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-001 |
| テスト観点 | コメント情報が正しく表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, userName: 'テストユーザー', content: 'テストコメント', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | ユーザー名、コンテンツ、相対時間が表示される |
| 確認方法 | `screen.getByText('テストユーザー')`, `screen.getByText('テストコメント')` が存在 |

##### FT-CI-002: CommentItem - 削除されたユーザー表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-002 |
| テスト観点 | userName が null の時、「削除されたユーザー」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, userName: null, content: 'テストコメント', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | 「削除されたユーザー」が表示される |
| 確認方法 | `screen.getByText('削除されたユーザー')` が存在 |

##### FT-CI-003: CommentItem - 相対時間表示（分前）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-003 |
| テスト観点 | 1時間以内のコメントは「○分前」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '現在時刻から30分前のISO文字列' }` |
| 期待結果 | 「30分前」と表示される |
| 確認方法 | `screen.getByText(/30分前/)` が存在 |

##### FT-CI-004: CommentItem - 相対時間表示（時間前）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-004 |
| テスト観点 | 1日以内のコメントは「○時間前」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '現在時刻から5時間前のISO文字列' }` |
| 期待結果 | 「5時間前」と表示される |
| 確認方法 | `screen.getByText(/5時間前/)` が存在 |

##### FT-CI-005: CommentItem - 相対時間表示（日前）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-005 |
| テスト観点 | 7日以内のコメントは「○日前」と表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '現在時刻から3日前のISO文字列' }` |
| 期待結果 | 「3日前」と表示される |
| 確認方法 | `screen.getByText(/3日前/)` が存在 |

##### FT-CI-006: CommentItem - 絶対時間表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-CI-006 |
| テスト観点 | 7日以上前のコメントは絶対時間で表示される |
| 分類 | 正常系 |
| ストア状態 | なし |
| Props | `comment: { id: 1, createdAt: '2025-12-10T10:00:00' }` |
| 期待結果 | 「2025/12/10 10:00」形式で表示される |
| 確認方法 | `screen.getByText(/2025\/12\/10/)` が存在 |

##### FT-CI-007: CommentItem - 削除ボタン押下

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

---

### 2.2 ストアテスト

**テスト対象**: `src/frontend/src/stores/commentStore.ts`

##### FT-ST-001: commentStore - 初期状態

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-001 |
| テスト観点 | ストアの初期状態が正しい |
| 分類 | 正常系 |
| 初期状態 | 新規Piniaインスタンス |
| アクション | なし |
| 期待結果 | comments=[], loading=false, error=null, currentTodoId=null |

##### FT-ST-002: commentStore - fetchComments成功

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-002 |
| テスト観点 | コメント取得成功時、commentsに値が設定される |
| 分類 | 正常系 |
| 初期状態 | comments=[] |
| アクション | fetchComments(1) |
| 期待結果 | comments=[{...}], loading=false, currentTodoId=1 |

##### FT-ST-003: commentStore - fetchComments失敗（404）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-003 |
| テスト観点 | チケットが存在しない場合、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[] |
| アクション | fetchComments(999) → 404エラー |
| 期待結果 | error='チケットが見つかりません', comments=[] |

##### FT-ST-004: commentStore - fetchComments失敗（ネットワークエラー）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-004 |
| テスト観点 | ネットワークエラー時、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[] |
| アクション | fetchComments(1) → ネットワークエラー |
| 期待結果 | error='コメントの取得に失敗しました', comments=[] |

##### FT-ST-005: commentStore - createComment成功

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-005 |
| テスト観点 | コメント作成成功時、新しいコメントが先頭に追加される |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}] |
| アクション | createComment(1, { userId: 1, content: 'テスト' }) |
| 期待結果 | comments=[{id: 2, content: 'テスト'}, {id: 1}], loading=false |

##### FT-ST-006: commentStore - createComment失敗（400）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-006 |
| テスト観点 | バリデーションエラー時、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[] |
| アクション | createComment(1, { userId: null, content: '' }) → 400エラー |
| 期待結果 | error='入力内容に誤りがあります' |

##### FT-ST-007: commentStore - deleteComment成功

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-007 |
| テスト観点 | コメント削除成功時、commentsから該当コメントが削除される |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}, {id: 2}, {id: 3}] |
| アクション | deleteComment(2) |
| 期待結果 | comments=[{id: 1}, {id: 3}], loading=false |

##### FT-ST-008: commentStore - deleteComment失敗（404）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-008 |
| テスト観点 | コメントが存在しない場合、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[{id: 1}] |
| アクション | deleteComment(999) → 404エラー |
| 期待結果 | error='コメントが見つかりません' |

##### FT-ST-009: commentStore - clearComments

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-009 |
| テスト観点 | clearComments()実行で状態がクリアされる |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}], error='エラー', currentTodoId=1 |
| アクション | clearComments() |
| 期待結果 | comments=[], error=null, currentTodoId=null |

##### FT-ST-010: commentStore - $reset

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-010 |
| テスト観点 | $reset()実行で全状態が初期化される |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}], loading=true, error='エラー', currentTodoId=1 |
| アクション | $reset() |
| 期待結果 | comments=[], loading=false, error=null, currentTodoId=null |

---

### 2.3 純粋関数テスト

**テスト対象**: `src/frontend/src/types/comment.ts`

##### FT-PF-001: validateCreateCommentRequest - 正常入力

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-001 |
| テスト観点 | 正しい入力値でエラーなし |
| 分類 | 正常系 |
| 入力値 | `{ userId: 1, content: 'テストコメント' }` |
| 期待結果 | `{}` (空オブジェクト) |

##### FT-PF-002: validateCreateCommentRequest - userId未指定

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-002 |
| テスト観点 | userIdが未指定の場合、エラーが返る |
| 分類 | 異常系 |
| 入力値 | `{ content: 'テストコメント' }` |
| 期待結果 | `{ userId: '投稿者を選択してください' }` |

##### FT-PF-003: validateCreateCommentRequest - content空文字

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-003 |
| テスト観点 | contentが空文字の場合、エラーが返る |
| 分類 | 異常系 |
| 入力値 | `{ userId: 1, content: '' }` |
| 期待結果 | `{ content: 'コメントを入力してください（最大2000文字）' }` |

##### FT-PF-004: validateCreateCommentRequest - content文字数超過

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-004 |
| テスト観点 | contentが2000文字を超える場合、エラーが返る |
| 分類 | 異常系 |
| 入力値 | `{ userId: 1, content: 'a'.repeat(2001) }` |
| 期待結果 | `{ content: 'コメントは2000文字以内で入力してください' }` |

##### FT-PF-005: isComment - 正しいComment型

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-005 |
| テスト観点 | 正しいComment型の場合、trueが返る |
| 分類 | 正常系 |
| 入力値 | `{ id: 1, todoId: 1, userId: 1, userName: 'テスト', content: 'テスト', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | `true` |

##### FT-PF-006: isComment - 不正な型（idが文字列）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-006 |
| テスト観点 | idが文字列の場合、falseが返る |
| 分類 | 異常系 |
| 入力値 | `{ id: '1', todoId: 1, userId: 1, userName: 'テスト', content: 'テスト', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | `false` |

##### FT-PF-007: isComment - 不正な型（フィールド欠落）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-007 |
| テスト観点 | 必須フィールドが欠落している場合、falseが返る |
| 分類 | 異常系 |
| 入力値 | `{ id: 1, todoId: 1 }` |
| 期待結果 | `false` |

##### FT-PF-008: isCommentList - 正しいComment配列

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-008 |
| テスト観点 | 正しいComment配列の場合、trueが返る |
| 分類 | 正常系 |
| 入力値 | `[{ id: 1, ... }, { id: 2, ... }]` |
| 期待結果 | `true` |

##### FT-PF-009: isCommentList - 不正な配列（1件でも不正）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-009 |
| テスト観点 | 1件でも不正なComment型が含まれる場合、falseが返る |
| 分類 | 異常系 |
| 入力値 | `[{ id: 1, ... }, { id: 'invalid', ... }]` |
| 期待結果 | `false` |

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

---

## 6. テスト環境

### 6.1 テストフレームワーク

| ツール | バージョン | 用途 |
|--------|----------|------|
| Vitest | ^2.1.8 | テストランナー |
| Vue Testing Library | ^9.2.1 | コンポーネントテスト |
| @testing-library/user-event | ^14.5.2 | ユーザー操作シミュレーション |
| MSW (Mock Service Worker) | ^2.4.5 | APIモック |
| happy-dom | ^15.11.7 | DOMシミュレーション環境 |

### 6.2 テスト戦略別設定

| 戦略 | 設定内容 |
|------|---------|
| Pinia Mock | `createTestingPinia({ stubActions: false })` でストアをテスト環境に設定 |
| MSW | `server.use(http.get('/api/todos/:id/comments', ...))` でAPIモック設定 |
| Component Render | `render(Component, { global: { plugins: [createTestingPinia()] } })` でコンポーネントレンダリング |

### 6.3 テストセットアップ例

```typescript
// vitest.setup.ts
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// MSWサーバーのセットアップ
export const server = setupServer(
  http.get('/api/todos/:todoId/comments', () => {
    return HttpResponse.json([
      {
        id: 1,
        todoId: 1,
        userId: 1,
        userName: 'テストユーザー',
        content: 'テストコメント',
        createdAt: '2025-12-25T10:00:00'
      }
    ])
  }),
  http.post('/api/todos/:todoId/comments', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      {
        id: 2,
        todoId: 1,
        userId: body.userId,
        userName: 'テストユーザー',
        content: body.content,
        createdAt: new Date().toISOString()
      },
      { status: 201 }
    )
  }),
  http.delete('/api/comments/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'テストユーザー1' },
      { id: 2, name: 'テストユーザー2' }
    ])
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## 7. テスト実行

### 7.1 コマンド

```bash
# 全テスト実行
npm run test

# ウォッチモード
npm run test:watch

# カバレッジ
npm run test:coverage

# 特定ファイルのみ
npm run test CommentForm.spec.ts
```

### 7.2 カバレッジ目標

| 対象 | 目標カバレッジ |
|------|--------------|
| コンポーネント | 80%以上 |
| ストア | 90%以上 |
| 純粋関数 | 100% |
| 全体 | 85%以上 |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2025-12-25 | 初版作成 | システム管理者 |
