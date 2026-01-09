# フロントエンドテスト仕様書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | チケット詳細編集機能 |
| 案件ID | 20260108_01_チケット詳細編集機能 |
| 作成日 | 2026-01-08 |
| 作成者 | Claude |
| 関連詳細設計書 | [detail-design-frontend.md](./detail-design-frontend.md) |
| 関連型定義設計書 | [detail-design-types.md](./detail-design-types.md) |
| 関連ストア設計書 | [detail-design-store.md](./detail-design-store.md) |

---

## 1. テスト概要

### 1.1 テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| TodoEditForm.vue | 新規 | チケット編集フォームコンポーネント |
| TodoDetailModal.vue | 変更 | 編集モード切替機能の追加 |
| todoStore.ts | 変更 | updateTodoアクションの追加 |

### 1.2 テスト方針

- **コンポーネントテスト**: Vue Testing Libraryを使用し、ユーザー視点のテストを実施
- **ストアテスト**: Piniaのテスティングユーティリティを使用、APIはモック
- **バリデーションテスト**: フォームのバリデーションロジックを網羅的にテスト
- **イベント発火テスト**: 親子コンポーネント間のイベント通信をテスト

### 1.3 ストア診断結果

| 診断項目 | 結果 | 備考 |
|---------|------|------|
| ストアの複雑さ | ケース2（シンプルな状態管理） | 単純なCRUD操作、副作用はAPI呼び出しのみ |
| 推奨テスト戦略 | Mock | APIをモックしてストアの状態変更を検証 |

---

## 2. 単体テスト

### 2.1 TodoEditForm.vue テスト

**テスト対象**: `src/frontend/src/components/todo/TodoEditForm.vue`

**テストファイル**: `src/frontend/src/components/todo/TodoEditForm.spec.ts`

#### FT-001: TodoEditForm - 初期表示（todoの値で初期化）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-001 |
| テスト観点 | propsで渡されたtodoの値でフォームが初期化されること |
| 分類 | 正常系 |
| Props | `todo: { id: 1, title: 'テスト', description: '説明', startDate: '2026-01-01', dueDate: '2026-01-31', assigneeId: 1 }`, `users: [...]`, `saving: false` |
| 期待結果 | 各入力欄にtodoの値が表示される |
| 確認方法 | `expect(titleInput.value).toBe('テスト')` 等 |

#### FT-002: TodoEditForm - 初期表示（descriptionがnull）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-002 |
| テスト観点 | descriptionがnullの場合、空文字で初期化されること |
| 分類 | 境界値 |
| Props | `todo: { ..., description: null }` |
| 期待結果 | 説明欄が空文字で表示される |
| 確認方法 | `expect(descriptionInput.value).toBe('')` |

#### FT-003: TodoEditForm - 担当者セレクト表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-003 |
| テスト観点 | 担当者セレクトにユーザー一覧が表示されること |
| 分類 | 正常系 |
| Props | `users: [{ id: 1, name: '山田太郎' }, { id: 2, name: '鈴木花子' }]` |
| 期待結果 | 「未割当」+ ユーザー一覧がオプションとして表示される |
| 確認方法 | `expect(options).toHaveLength(3)` |

#### FT-004: TodoEditForm - タイトル空バリデーション

| 項目 | 内容 |
|------|------|
| テストケースID | FT-004 |
| テスト観点 | タイトルが空の場合、エラーメッセージが表示されること |
| 分類 | 異常系 |
| ユーザー操作 | タイトル入力欄を空にする |
| 期待結果 | 「タイトルを入力してください」エラーが表示、保存ボタン無効化 |
| 確認方法 | `expect(errorMessage.text()).toBe('タイトルを入力してください')` |

#### FT-005: TodoEditForm - タイトル空白のみバリデーション

| 項目 | 内容 |
|------|------|
| テストケースID | FT-005 |
| テスト観点 | タイトルが空白のみの場合もエラーになること |
| 分類 | 異常系 |
| ユーザー操作 | タイトル入力欄に「   」を入力 |
| 期待結果 | バリデーションエラーが表示される |
| 確認方法 | `expect(errorMessage.exists()).toBe(true)` |

#### FT-006: TodoEditForm - 日付バリデーション（開始日 > 期限日）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-006 |
| テスト観点 | 開始日が期限日より後の場合、エラーメッセージが表示されること |
| 分類 | 異常系 |
| ユーザー操作 | 開始日: 2026-02-01, 期限日: 2026-01-01 を設定 |
| 期待結果 | 「開始日は期限日以前にしてください」エラーが表示 |
| 確認方法 | `expect(errorMessage.text()).toContain('開始日は期限日以前')` |

#### FT-007: TodoEditForm - 日付バリデーション（同日はOK）

| 項目 | 内容 |
|------|------|
| テストケースID | FT-007 |
| テスト観点 | 開始日と期限日が同じ日付でもエラーにならないこと |
| 分類 | 境界値 |
| ユーザー操作 | 開始日・期限日を同じ日付に設定 |
| 期待結果 | エラーが表示されない |
| 確認方法 | 日付エラーメッセージが存在しないこと |

#### FT-008: TodoEditForm - 保存イベント発火

| 項目 | 内容 |
|------|------|
| テストケースID | FT-008 |
| テスト観点 | 保存ボタンクリックでsaveイベントが発火すること |
| 分類 | 正常系 |
| ユーザー操作 | フォームをsubmit |
| 期待結果 | saveイベントがUpdateTodoRequestと共に発火 |
| 確認方法 | `expect(wrapper.emitted('save')).toBeTruthy()` |

#### FT-009: TodoEditForm - タイトルトリミング

| 項目 | 内容 |
|------|------|
| テストケースID | FT-009 |
| テスト観点 | 保存時にタイトルの前後空白がトリミングされること |
| 分類 | 正常系 |
| ユーザー操作 | タイトルに「  新しいタイトル  」を入力して保存 |
| 期待結果 | emitされるデータのtitleが「新しいタイトル」 |
| 確認方法 | `expect(emittedData.title).toBe('新しいタイトル')` |

#### FT-010: TodoEditForm - 説明が空の場合undefined

| 項目 | 内容 |
|------|------|
| テストケースID | FT-010 |
| テスト観点 | 説明が空の場合、undefinedが送信されること |
| 分類 | 境界値 |
| ユーザー操作 | 説明欄を空にして保存 |
| 期待結果 | emitされるデータのdescriptionがundefined |
| 確認方法 | `expect(emittedData.description).toBeUndefined()` |

#### FT-011: TodoEditForm - キャンセルイベント発火

| 項目 | 内容 |
|------|------|
| テストケースID | FT-011 |
| テスト観点 | キャンセルボタンクリックでcancelイベントが発火すること |
| 分類 | 正常系 |
| ユーザー操作 | キャンセルボタンをクリック |
| 期待結果 | cancelイベントが発火 |
| 確認方法 | `expect(wrapper.emitted('cancel')).toBeTruthy()` |

#### FT-012: TodoEditForm - 担当者変更

| 項目 | 内容 |
|------|------|
| テストケースID | FT-012 |
| テスト観点 | 担当者を変更できること |
| 分類 | 正常系 |
| ユーザー操作 | 担当者セレクトで別のユーザーを選択 |
| 期待結果 | emitされるデータのassigneeIdが変更される |
| 確認方法 | `expect(emittedData.assigneeId).toBe(2)` |

#### FT-013: TodoEditForm - 担当者を未割当に変更

| 項目 | 内容 |
|------|------|
| テストケースID | FT-013 |
| テスト観点 | 担当者を未割当に変更できること |
| 分類 | 正常系 |
| ユーザー操作 | 担当者セレクトで「未割当」を選択 |
| 期待結果 | emitされるデータのassigneeIdがnull |
| 確認方法 | `expect(emittedData.assigneeId).toBeNull()` |

#### FT-014: TodoEditForm - 保存中の無効化

| 項目 | 内容 |
|------|------|
| テストケースID | FT-014 |
| テスト観点 | saving=trueの場合、フォーム要素が無効化されること |
| 分類 | 正常系 |
| Props | `saving: true` |
| 期待結果 | 全入力要素とボタンがdisabled |
| 確認方法 | `expect(input.attributes('disabled')).toBeDefined()` |

#### FT-015: TodoEditForm - 保存中の表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-015 |
| テスト観点 | saving=trueの場合、保存ボタンに「保存中...」と表示されること |
| 分類 | 正常系 |
| Props | `saving: true` |
| 期待結果 | 保存ボタンのテキストが「保存中...」 |
| 確認方法 | `expect(saveButton.text()).toBe('保存中...')` |

#### FT-016: TodoEditForm - todo変更時の再初期化

| 項目 | 内容 |
|------|------|
| テストケースID | FT-016 |
| テスト観点 | propsのtodoが変更されるとフォームが再初期化されること |
| 分類 | 正常系 |
| ユーザー操作 | propsのtodoを別のデータに変更 |
| 期待結果 | フォームの値が新しいtodoの値に更新される |
| 確認方法 | `expect(titleInput.value).toBe('タスク2')` |

#### FT-017: TodoEditForm - 開始日のみ設定

| 項目 | 内容 |
|------|------|
| テストケースID | FT-017 |
| テスト観点 | 開始日のみを設定できること |
| 分類 | 正常系 |
| ユーザー操作 | 開始日のみ入力、期限日は空 |
| 期待結果 | エラーなしで保存可能、dueDateはnull |
| 確認方法 | `expect(emittedData.dueDate).toBeNull()` |

#### FT-018: TodoEditForm - 期限日のみ設定

| 項目 | 内容 |
|------|------|
| テストケースID | FT-018 |
| テスト観点 | 期限日のみを設定できること |
| 分類 | 正常系 |
| ユーザー操作 | 期限日のみ入力、開始日は空 |
| 期待結果 | エラーなしで保存可能、startDateはnull |
| 確認方法 | `expect(emittedData.startDate).toBeNull()` |

---

### 2.2 TodoDetailModal.vue テスト（編集機能関連）

**テスト対象**: `src/frontend/src/components/todo/TodoDetailModal.vue`

**テストファイル**: `src/frontend/src/components/todo/TodoDetailModal.spec.ts`

#### FT-020: TodoDetailModal - 表示モード初期表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-020 |
| テスト観点 | モーダル表示時に表示モードで開くこと |
| 分類 | 正常系 |
| Props | `todoId: 1`, `isOpen: true` |
| 期待結果 | チケット情報が表示され、編集フォームは表示されない |
| 確認方法 | `expect(TodoEditForm.exists()).toBe(false)` |

#### FT-021: TodoDetailModal - 編集ボタン表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-021 |
| テスト観点 | 表示モードで編集ボタンが表示されること |
| 分類 | 正常系 |
| Props | `todoId: 1`, `isOpen: true` |
| 期待結果 | 「編集」ボタンが表示される |
| 確認方法 | `expect(editButton.exists()).toBe(true)` |

#### FT-022: TodoDetailModal - 編集モード切替

| 項目 | 内容 |
|------|------|
| テストケースID | FT-022 |
| テスト観点 | 編集ボタンクリックで編集モードに切り替わること |
| 分類 | 正常系 |
| ユーザー操作 | 編集ボタンをクリック |
| 期待結果 | TodoEditFormが表示され、編集ボタンが非表示 |
| 確認方法 | `expect(TodoEditForm.exists()).toBe(true)` |

#### FT-023: TodoDetailModal - 編集キャンセル

| 項目 | 内容 |
|------|------|
| テストケースID | FT-023 |
| テスト観点 | 編集モードでキャンセルすると表示モードに戻ること |
| 分類 | 正常系 |
| ユーザー操作 | 編集モード → キャンセルボタンクリック |
| 期待結果 | 表示モードに戻り、編集ボタンが再表示 |
| 確認方法 | `expect(editButton.exists()).toBe(true)` |

#### FT-024: TodoDetailModal - 保存処理実行

| 項目 | 内容 |
|------|------|
| テストケースID | FT-024 |
| テスト観点 | 保存時にupdateTodoアクションが呼ばれること |
| 分類 | 正常系 |
| ユーザー操作 | 編集モード → 保存ボタンクリック |
| 期待結果 | todoStore.updateTodoが正しいパラメータで呼ばれる |
| 確認方法 | `expect(mockStore.updateTodo).toHaveBeenCalledWith(1, request)` |

#### FT-025: TodoDetailModal - 保存成功時のイベント

| 項目 | 内容 |
|------|------|
| テストケースID | FT-025 |
| テスト観点 | 保存成功時にtodoUpdatedイベントが発火すること |
| 分類 | 正常系 |
| ユーザー操作 | 編集モード → 保存成功 |
| 期待結果 | todoUpdatedイベントが発火 |
| 確認方法 | `expect(wrapper.emitted('todoUpdated')).toBeTruthy()` |

#### FT-026: TodoDetailModal - モーダルを閉じる

| 項目 | 内容 |
|------|------|
| テストケースID | FT-026 |
| テスト観点 | 閉じるボタンでcloseイベントが発火すること |
| 分類 | 正常系 |
| ユーザー操作 | 閉じるボタンをクリック |
| 期待結果 | closeイベントが発火 |
| 確認方法 | `expect(wrapper.emitted('close')).toBeTruthy()` |

#### FT-027: TodoDetailModal - オーバーレイクリック

| 項目 | 内容 |
|------|------|
| テストケースID | FT-027 |
| テスト観点 | オーバーレイクリックでモーダルが閉じること |
| 分類 | 正常系 |
| ユーザー操作 | モーダル背景をクリック |
| 期待結果 | closeイベントが発火 |
| 確認方法 | `expect(wrapper.emitted('close')).toBeTruthy()` |

#### FT-028: TodoDetailModal - コンテナクリックは閉じない

| 項目 | 内容 |
|------|------|
| テストケースID | FT-028 |
| テスト観点 | モーダルコンテナクリックでは閉じないこと |
| 分類 | 正常系 |
| ユーザー操作 | モーダルコンテナをクリック |
| 期待結果 | closeイベントが発火しない |
| 確認方法 | `expect(wrapper.emitted('close')).toBeFalsy()` |

#### FT-029: TodoDetailModal - 編集モード中のモーダル閉じる

| 項目 | 内容 |
|------|------|
| テストケースID | FT-029 |
| テスト観点 | 編集モード中にモーダルを閉じると編集モードが終了すること |
| 分類 | 正常系 |
| ユーザー操作 | 編集モード → 閉じるボタンクリック |
| 期待結果 | closeイベントが発火 |
| 確認方法 | `expect(wrapper.emitted('close')).toBeTruthy()` |

---

### 2.3 todoStore.ts テスト

**テスト対象**: `src/frontend/src/stores/todoStore.ts`

**テストファイル**: `src/frontend/src/stores/todoStore.spec.ts`（既存ファイルに追加）

#### FT-ST-001: todoStore - updateTodo正常系

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-001 |
| テスト観点 | updateTodoがAPI呼び出しと一覧再取得を行うこと |
| 分類 | 正常系 |
| 初期状態 | todos: [] |
| アクション | `updateTodo(1, { title: '更新後' })` |
| 期待結果 | todoService.updateが呼ばれ、fetchTodosで一覧再取得 |

#### FT-ST-002: todoStore - updateTodoエラー時

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-002 |
| テスト観点 | updateTodoがエラー時にエラーメッセージを設定すること |
| 分類 | 異常系 |
| 初期状態 | todos: [] |
| アクション | `updateTodo(1, { title: '更新後' })` (API失敗) |
| 期待結果 | error: 'ToDoの更新に失敗しました'、例外がthrowされる |

---

## 3. E2Eテスト

### 3.1 概要

E2Eテストでは、実際のブラウザ環境でユーザーシナリオを通してチケット編集機能の動作を検証する。

### 3.2 テストシナリオ

#### E2E-001: チケット編集の基本フロー

| 項目 | 内容 |
|------|------|
| テストケースID | E2E-001 |
| テスト観点 | チケット編集の基本的な操作フローが正常に動作すること |
| 前提条件 | ToDoリスト画面が表示されている、チケットが1件以上存在 |
| 操作手順 | 1. チケットカードをクリック → 詳細モーダル表示<br/>2. 「編集」ボタンをクリック → 編集フォーム表示<br/>3. タイトルを変更<br/>4. 「保存」ボタンをクリック → 表示モードに戻る<br/>5. 変更後のタイトルが表示される |
| 期待結果 | タイトルが更新され、一覧画面にも反映される |
| 優先度 | 高 |

#### E2E-002: チケット編集のキャンセル

| 項目 | 内容 |
|------|------|
| テストケースID | E2E-002 |
| テスト観点 | 編集をキャンセルすると変更が破棄されること |
| 前提条件 | チケット詳細モーダルが表示されている |
| 操作手順 | 1. 「編集」ボタンをクリック<br/>2. タイトルを変更<br/>3. 「キャンセル」ボタンをクリック<br/>4. 表示モードに戻る |
| 期待結果 | 元のタイトルが表示される（変更は破棄） |
| 優先度 | 高 |

#### E2E-003: 担当者の変更

| 項目 | 内容 |
|------|------|
| テストケースID | E2E-003 |
| テスト観点 | 担当者を変更できること |
| 前提条件 | ユーザーが複数登録されている |
| 操作手順 | 1. チケット詳細モーダルを開く<br/>2. 「編集」ボタンをクリック<br/>3. 担当者セレクトで別のユーザーを選択<br/>4. 「保存」ボタンをクリック |
| 期待結果 | 新しい担当者名が表示される |
| 優先度 | 中 |

#### E2E-004: 期限日の変更

| 項目 | 内容 |
|------|------|
| テストケースID | E2E-004 |
| テスト観点 | 期限日を変更できること |
| 前提条件 | チケット詳細モーダルが表示されている |
| 操作手順 | 1. 「編集」ボタンをクリック<br/>2. 期限日を変更<br/>3. 「保存」ボタンをクリック |
| 期待結果 | 新しい期限日が表示される |
| 優先度 | 中 |

#### E2E-005: バリデーションエラーの表示

| 項目 | 内容 |
|------|------|
| テストケースID | E2E-005 |
| テスト観点 | バリデーションエラーが正しく表示されること |
| 前提条件 | チケット編集モードが表示されている |
| 操作手順 | 1. タイトル入力欄を空にする<br/>2. エラーメッセージを確認<br/>3. 保存ボタンが無効化されていることを確認 |
| 期待結果 | 「タイトルを入力してください」エラーが表示、保存ボタンが無効 |
| 優先度 | 中 |

#### E2E-006: 日付バリデーション

| 項目 | 内容 |
|------|------|
| テストケースID | E2E-006 |
| テスト観点 | 開始日が期限日より後の場合にエラーが表示されること |
| 前提条件 | チケット編集モードが表示されている |
| 操作手順 | 1. 開始日を期限日より後に設定<br/>2. エラーメッセージを確認 |
| 期待結果 | 「開始日は期限日以前にしてください」エラーが表示 |
| 優先度 | 中 |

### 3.3 E2Eテスト環境

| ツール | 用途 |
|--------|------|
| Playwright | E2Eテスト実行 |
| バックエンドAPI | 実際のAPIを使用（テスト用DB） |

### 3.4 E2Eテスト実行コマンド

```bash
# プロジェクトルートで実行
npm run test:e2e

# 特定のテストのみ
npm run test:e2e -- --grep "チケット編集"
```

### 3.5 E2Eテストケース一覧

| ID | シナリオ | 分類 | 優先度 | ステータス |
|----|---------|------|--------|-----------|
| E2E-001 | チケット編集の基本フロー | 正常系 | 高 | 未実施 |
| E2E-002 | チケット編集のキャンセル | 正常系 | 高 | 未実施 |
| E2E-003 | 担当者の変更 | 正常系 | 中 | 未実施 |
| E2E-004 | 期限日の変更 | 正常系 | 中 | 未実施 |
| E2E-005 | バリデーションエラーの表示 | 異常系 | 中 | 未実施 |
| E2E-006 | 日付バリデーション | 異常系 | 中 | 未実施 |

---

## 4. テストケース一覧

| ID | 対象 | テスト観点 | 分類 | 優先度 | ステータス |
|----|------|-----------|------|--------|-----------|
| FT-001 | TodoEditForm | 初期表示 | 正常系 | 高 | 実装済 |
| FT-002 | TodoEditForm | descriptionがnull | 境界値 | 中 | 実装済 |
| FT-003 | TodoEditForm | 担当者セレクト表示 | 正常系 | 高 | 実装済 |
| FT-004 | TodoEditForm | タイトル空バリデーション | 異常系 | 高 | 実装済 |
| FT-005 | TodoEditForm | タイトル空白のみ | 異常系 | 中 | 実装済 |
| FT-006 | TodoEditForm | 日付バリデーション | 異常系 | 高 | 実装済 |
| FT-007 | TodoEditForm | 日付同日OK | 境界値 | 中 | 実装済 |
| FT-008 | TodoEditForm | 保存イベント発火 | 正常系 | 高 | 実装済 |
| FT-009 | TodoEditForm | タイトルトリミング | 正常系 | 中 | 実装済 |
| FT-010 | TodoEditForm | 説明空でundefined | 境界値 | 中 | 実装済 |
| FT-011 | TodoEditForm | キャンセルイベント | 正常系 | 高 | 実装済 |
| FT-012 | TodoEditForm | 担当者変更 | 正常系 | 高 | 実装済 |
| FT-013 | TodoEditForm | 担当者未割当 | 正常系 | 中 | 実装済 |
| FT-014 | TodoEditForm | 保存中無効化 | 正常系 | 高 | 実装済 |
| FT-015 | TodoEditForm | 保存中表示 | 正常系 | 中 | 実装済 |
| FT-016 | TodoEditForm | todo変更時再初期化 | 正常系 | 中 | 実装済 |
| FT-017 | TodoEditForm | 開始日のみ設定 | 正常系 | 中 | 実装済 |
| FT-018 | TodoEditForm | 期限日のみ設定 | 正常系 | 中 | 実装済 |
| FT-020 | TodoDetailModal | 表示モード初期表示 | 正常系 | 高 | 実装済 |
| FT-021 | TodoDetailModal | 編集ボタン表示 | 正常系 | 高 | 実装済 |
| FT-022 | TodoDetailModal | 編集モード切替 | 正常系 | 高 | 実装済 |
| FT-023 | TodoDetailModal | 編集キャンセル | 正常系 | 高 | 実装済 |
| FT-024 | TodoDetailModal | 保存処理実行 | 正常系 | 高 | 実装済 |
| FT-025 | TodoDetailModal | 保存成功イベント | 正常系 | 高 | 実装済 |
| FT-026 | TodoDetailModal | モーダルを閉じる | 正常系 | 高 | 実装済 |
| FT-027 | TodoDetailModal | オーバーレイクリック | 正常系 | 中 | 実装済 |
| FT-028 | TodoDetailModal | コンテナクリック | 正常系 | 中 | 実装済 |
| FT-029 | TodoDetailModal | 編集中のモーダル閉じる | 正常系 | 中 | 実装済 |
| FT-ST-001 | todoStore | updateTodo正常系 | 正常系 | 高 | 実装済 |
| FT-ST-002 | todoStore | updateTodoエラー | 異常系 | 高 | 未実施 |

---

## 4. テストデータ

### 4.1 モックデータ

#### Todo（テスト用）

```typescript
const mockTodo: Todo = {
  id: 1,
  title: 'テストタスク',
  description: 'テスト説明',
  completed: false,
  startDate: '2026-01-01',
  dueDate: '2026-01-31',
  projectId: null,
  assigneeId: 1,
  assigneeName: '山田太郎',
  createdAt: '2026-01-08T10:00:00'
}
```

#### User（テスト用）

```typescript
const mockUsers: User[] = [
  { id: 1, name: '山田太郎', createdAt: '2026-01-01T00:00:00' },
  { id: 2, name: '鈴木花子', createdAt: '2026-01-01T00:00:00' }
]
```

---

## 5. テスト環境

### 5.1 テストフレームワーク

| ツール | 用途 |
|--------|------|
| Vitest | テストランナー |
| @vue/test-utils | コンポーネントテスト |
| @pinia/testing | ストアモック |

### 5.2 テスト実行コマンド

```bash
# フロントエンドディレクトリで実行
cd src/frontend
npm run test

# 特定のテストファイルのみ
npm run test -- TodoEditForm
npm run test -- TodoDetailModal
npm run test -- todoStore
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2026-01-08 | 初版作成 | Claude |
