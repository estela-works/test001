# フロントエンドテスト仕様書 - ストア・型定義テスト

[← 目次に戻る](./test-spec-frontend.md)

---

## 2. 単体テスト - ストア

### 2.1 commentStore

**テスト対象**: `src/frontend/src/stores/commentStore.ts`

#### FT-ST-001: commentStore - 初期状態

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-001 |
| テスト観点 | ストアの初期状態が正しい |
| 分類 | 正常系 |
| 初期状態 | 新規Piniaインスタンス |
| アクション | なし |
| 期待結果 | comments=[], loading=false, error=null, currentTodoId=null |

#### FT-ST-002: commentStore - fetchComments成功

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-002 |
| テスト観点 | コメント取得成功時、commentsに値が設定される |
| 分類 | 正常系 |
| 初期状態 | comments=[] |
| アクション | fetchComments(1) |
| 期待結果 | comments=[{...}], loading=false, currentTodoId=1 |

#### FT-ST-003: commentStore - fetchComments失敗（404）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-003 |
| テスト観点 | チケットが存在しない場合、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[] |
| アクション | fetchComments(999) → 404エラー |
| 期待結果 | error='チケットが見つかりません', comments=[] |

#### FT-ST-004: commentStore - fetchComments失敗（ネットワークエラー）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-004 |
| テスト観点 | ネットワークエラー時、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[] |
| アクション | fetchComments(1) → ネットワークエラー |
| 期待結果 | error='コメントの取得に失敗しました', comments=[] |

#### FT-ST-005: commentStore - createComment成功

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-005 |
| テスト観点 | コメント作成成功時、新しいコメントが先頭に追加される |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}] |
| アクション | createComment(1, { userId: 1, content: 'テスト' }) |
| 期待結果 | comments=[{id: 2, content: 'テスト'}, {id: 1}], loading=false |

#### FT-ST-006: commentStore - createComment失敗（400）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-006 |
| テスト観点 | バリデーションエラー時、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[] |
| アクション | createComment(1, { userId: null, content: '' }) → 400エラー |
| 期待結果 | error='入力内容に誤りがあります' |

#### FT-ST-007: commentStore - deleteComment成功

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-007 |
| テスト観点 | コメント削除成功時、commentsから該当コメントが削除される |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}, {id: 2}, {id: 3}] |
| アクション | deleteComment(2) |
| 期待結果 | comments=[{id: 1}, {id: 3}], loading=false |

#### FT-ST-008: commentStore - deleteComment失敗（404）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-008 |
| テスト観点 | コメントが存在しない場合、適切なエラーメッセージが設定される |
| 分類 | 異常系 |
| 初期状態 | comments=[{id: 1}] |
| アクション | deleteComment(999) → 404エラー |
| 期待結果 | error='コメントが見つかりません' |

#### FT-ST-009: commentStore - clearComments

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-009 |
| テスト観点 | clearComments()実行で状態がクリアされる |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}], error='エラー', currentTodoId=1 |
| アクション | clearComments() |
| 期待結果 | comments=[], error=null, currentTodoId=null |

#### FT-ST-010: commentStore - $reset

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-010 |
| テスト観点 | $reset()実行で全状態が初期化される |
| 分類 | 正常系 |
| 初期状態 | comments=[{id: 1}], loading=true, error='エラー', currentTodoId=1 |
| アクション | $reset() |
| 期待結果 | comments=[], loading=false, error=null, currentTodoId=null |

---

## 2. 単体テスト - 純粋関数

### 2.2 型定義・バリデーション

**テスト対象**: `src/frontend/src/types/comment.ts`

#### FT-PF-001: validateCreateCommentRequest - 正常入力

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-001 |
| テスト観点 | 正しい入力値でエラーなし |
| 分類 | 正常系 |
| 入力値 | `{ userId: 1, content: 'テストコメント' }` |
| 期待結果 | `{}` (空オブジェクト) |

#### FT-PF-002: validateCreateCommentRequest - userId未指定

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-002 |
| テスト観点 | userIdが未指定の場合、エラーが返る |
| 分類 | 異常系 |
| 入力値 | `{ content: 'テストコメント' }` |
| 期待結果 | `{ userId: '投稿者を選択してください' }` |

#### FT-PF-003: validateCreateCommentRequest - content空文字

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-003 |
| テスト観点 | contentが空文字の場合、エラーが返る |
| 分類 | 異常系 |
| 入力値 | `{ userId: 1, content: '' }` |
| 期待結果 | `{ content: 'コメントを入力してください（最大2000文字）' }` |

#### FT-PF-004: validateCreateCommentRequest - content文字数超過

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-004 |
| テスト観点 | contentが2000文字を超える場合、エラーが返る |
| 分類 | 異常系 |
| 入力値 | `{ userId: 1, content: 'a'.repeat(2001) }` |
| 期待結果 | `{ content: 'コメントは2000文字以内で入力してください' }` |

#### FT-PF-005: isComment - 正しいComment型

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-005 |
| テスト観点 | 正しいComment型の場合、trueが返る |
| 分類 | 正常系 |
| 入力値 | `{ id: 1, todoId: 1, userId: 1, userName: 'テスト', content: 'テスト', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | `true` |

#### FT-PF-006: isComment - 不正な型（idが文字列）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-006 |
| テスト観点 | idが文字列の場合、falseが返る |
| 分類 | 異常系 |
| 入力値 | `{ id: '1', todoId: 1, userId: 1, userName: 'テスト', content: 'テスト', createdAt: '2025-12-25T10:00:00' }` |
| 期待結果 | `false` |

#### FT-PF-007: isComment - 不正な型（フィールド欠落）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-007 |
| テスト観点 | 必須フィールドが欠落している場合、falseが返る |
| 分類 | 異常系 |
| 入力値 | `{ id: 1, todoId: 1 }` |
| 期待結果 | `false` |

#### FT-PF-008: isCommentList - 正しいComment配列

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-008 |
| テスト観点 | 正しいComment配列の場合、trueが返る |
| 分類 | 正常系 |
| 入力値 | `[{ id: 1, ... }, { id: 2, ... }]` |
| 期待結果 | `true` |

#### FT-PF-009: isCommentList - 不正な配列（1件でも不正）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PF-009 |
| テスト観点 | 1件でも不正なComment型が含まれる場合、falseが返る |
| 分類 | 異常系 |
| 入力値 | `[{ id: 1, ... }, { id: 'invalid', ... }]` |
| 期待結果 | `false` |
