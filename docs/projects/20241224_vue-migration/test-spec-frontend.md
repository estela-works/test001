# フロントエンドテスト方針書

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 作成者 | - |
| 関連詳細設計書 | [detail-design-frontend.md](./detail-design-frontend.md), [detail-design-store.md](./detail-design-store.md) |

---

## 1. テスト概要

### 1.1 テスト対象

| 対象 | 変更種別 | 概要 |
|------|----------|------|
| Vueコンポーネント | 新規 | 全ページ・機能コンポーネント |
| Piniaストア | 新規 | todoStore, projectStore, userStore |
| APIサービス | 新規 | todoService, projectService, userService |
| Vue Router | 新規 | ルーティング設定 |

### 1.2 テスト方針

1. **コンポーネント単体テスト**: Vue Test Utilsを使用し、各コンポーネントを独立してテスト
2. **ストアテスト**: Piniaストアのアクション・ゲッターをテスト（APIはモック）
3. **APIサービステスト**: fetchのモックでAPIサービスをテスト
4. **E2Eテスト**: 既存Playwrightテストで画面全体の動作を確認

### 1.3 ストア診断結果

| 診断項目 | 結果 | 備考 |
|---------|------|------|
| ストアの複雑さ | ケース2（単純なCRUD） | API呼び出し + 状態管理のみ |
| 推奨テスト戦略 | Mock戦略 | APIをモックし、ストア動作を確認 |

---

## 2. 単体テスト

### 2.1 コンポーネントテスト

#### 2.1.1 共通コンポーネント

**テスト対象**: `src/components/common/`

##### FT-COM-001: LoadingSpinner - 表示確認

| 項目 | 内容 |
|------|------|
| テストケースID | FT-COM-001 |
| テスト観点 | ローディングスピナーが正しく表示される |
| 分類 | 正常系 |
| Props | なし |
| 期待結果 | 「読み込み中...」テキストが表示される |
| 確認方法 | `expect(wrapper.text()).toContain('読み込み中')` |

##### FT-COM-002: ErrorMessage - メッセージ表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-COM-002 |
| テスト観点 | エラーメッセージが正しく表示される |
| 分類 | 正常系 |
| Props | message: 'エラーが発生しました' |
| 期待結果 | エラーメッセージが表示される |
| 確認方法 | `expect(wrapper.text()).toContain('エラーが発生しました')` |

##### FT-COM-003: ErrorMessage - 空メッセージ時非表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-COM-003 |
| テスト観点 | メッセージが空の場合は非表示 |
| 分類 | 正常系 |
| Props | message: null |
| 期待結果 | コンポーネントが表示されない |
| 確認方法 | `expect(wrapper.find('.error').exists()).toBe(false)` |

##### FT-COM-004: NavCard - リンク遷移

| 項目 | 内容 |
|------|------|
| テストケースID | FT-COM-004 |
| テスト観点 | ナビカードが正しいリンクを持つ |
| 分類 | 正常系 |
| Props | to: '/todos', title: 'チケット管理', icon: '📋' |
| 期待結果 | router-linkのto属性が'/todos' |
| 確認方法 | `expect(wrapper.find('router-link-stub').attributes('to')).toBe('/todos')` |

---

#### 2.1.2 ToDoコンポーネント

**テスト対象**: `src/components/todo/`

##### FT-TODO-001: TodoForm - フォーム表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-001 |
| テスト観点 | フォーム要素が正しく表示される |
| 分類 | 正常系 |
| Props | users: [], projectId: null |
| 期待結果 | タイトル入力、説明入力、日付入力、担当者選択が表示 |
| 確認方法 | 各input/select/textareaの存在確認 |

##### FT-TODO-002: TodoForm - タイトル必須バリデーション

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-002 |
| テスト観点 | タイトル空で追加ボタン押下時にエラー |
| 分類 | 異常系 |
| Props | users: [], projectId: null |
| ユーザー操作 | タイトル空のまま追加ボタンクリック |
| 期待結果 | submitイベントが発火しない |
| 確認方法 | `expect(wrapper.emitted('submit')).toBeFalsy()` |

##### FT-TODO-003: TodoForm - 正常送信

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-003 |
| テスト観点 | 正しい入力で送信される |
| 分類 | 正常系 |
| Props | users: [{ id: 1, name: 'User1' }], projectId: '1' |
| ユーザー操作 | タイトル入力 → 追加ボタンクリック |
| 期待結果 | submitイベントがペイロード付きで発火 |
| 確認方法 | `expect(wrapper.emitted('submit')[0][0]).toMatchObject({ title: 'テスト' })` |

##### FT-TODO-004: TodoForm - 日付バリデーション

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-004 |
| テスト観点 | 終了日が開始日より前の場合エラー |
| 分類 | 異常系 |
| Props | users: [], projectId: null |
| ユーザー操作 | 開始日: 2024-12-31, 終了日: 2024-12-01 → 追加ボタン |
| 期待結果 | submitイベントが発火しない |
| 確認方法 | `expect(wrapper.emitted('submit')).toBeFalsy()` |

##### FT-TODO-005: TodoItem - 表示確認

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-005 |
| テスト観点 | ToDoアイテムが正しく表示される |
| 分類 | 正常系 |
| Props | todo: { id: 1, title: 'テスト', completed: false, ... } |
| 期待結果 | タイトル、ボタンが表示される |
| 確認方法 | `expect(wrapper.text()).toContain('テスト')` |

##### FT-TODO-006: TodoItem - 完了切替イベント

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-006 |
| テスト観点 | 完了ボタンでtoggleイベント発火 |
| 分類 | 正常系 |
| Props | todo: { id: 1, title: 'テスト', completed: false, ... } |
| ユーザー操作 | 「完了にする」ボタンクリック |
| 期待結果 | toggleイベントがID付きで発火 |
| 確認方法 | `expect(wrapper.emitted('toggle')[0]).toEqual([1])` |

##### FT-TODO-007: TodoItem - 削除イベント

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-007 |
| テスト観点 | 削除ボタンでdeleteイベント発火 |
| 分類 | 正常系 |
| Props | todo: { id: 1, title: 'テスト', completed: false, ... } |
| ユーザー操作 | 削除ボタンクリック → 確認OK |
| 期待結果 | deleteイベントがID付きで発火 |
| 確認方法 | `expect(wrapper.emitted('delete')[0]).toEqual([1])` |

##### FT-TODO-008: TodoList - 空リスト表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-008 |
| テスト観点 | リスト空の場合メッセージ表示 |
| 分類 | 正常系 |
| Props | todos: [] |
| 期待結果 | 「ToDoアイテムがありません」表示 |
| 確認方法 | `expect(wrapper.text()).toContain('ToDoアイテムがありません')` |

##### FT-TODO-009: TodoStats - 統計表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-009 |
| テスト観点 | 統計情報が正しく表示される |
| 分類 | 正常系 |
| Props | total: 10, completed: 3, pending: 7 |
| 期待結果 | 総数: 10, 完了: 3, 未完了: 7 が表示 |
| 確認方法 | 各数値の表示確認 |

##### FT-TODO-010: TodoFilter - フィルタ切替

| 項目 | 内容 |
|------|------|
| テストケースID | FT-TODO-010 |
| テスト観点 | フィルタボタンでイベント発火 |
| 分類 | 正常系 |
| Props | modelValue: 'all' |
| ユーザー操作 | 「未完了」ボタンクリック |
| 期待結果 | update:modelValueイベントが'pending'で発火 |
| 確認方法 | `expect(wrapper.emitted('update:modelValue')[0]).toEqual(['pending'])` |

---

#### 2.1.3 案件コンポーネント

**テスト対象**: `src/components/project/`

##### FT-PROJ-001: ProjectForm - 案件作成送信

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PROJ-001 |
| テスト観点 | 案件名入力で送信される |
| 分類 | 正常系 |
| ユーザー操作 | 案件名入力 → 作成ボタンクリック |
| 期待結果 | submitイベントが発火 |
| 確認方法 | `expect(wrapper.emitted('submit')[0][0]).toMatchObject({ name: 'テスト案件' })` |

##### FT-PROJ-002: ProjectCard - 案件情報表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PROJ-002 |
| テスト観点 | 案件カードが正しく表示される |
| 分類 | 正常系 |
| Props | project: { id: 1, name: 'テスト案件' }, stats: { total: 5, completed: 2, progressRate: 40 } |
| 期待結果 | 案件名、統計、プログレスバーが表示 |
| 確認方法 | 各要素の存在・値確認 |

##### FT-PROJ-003: ProjectCard - チケット一覧遷移

| 項目 | 内容 |
|------|------|
| テストケースID | FT-PROJ-003 |
| テスト観点 | チケット一覧ボタンでviewイベント発火 |
| 分類 | 正常系 |
| ユーザー操作 | チケット一覧ボタンクリック |
| 期待結果 | viewイベントがproject.id付きで発火 |
| 確認方法 | `expect(wrapper.emitted('view')[0]).toEqual([1])` |

---

#### 2.1.4 ユーザーコンポーネント

**テスト対象**: `src/components/user/`

##### FT-USER-001: UserForm - ユーザー追加送信

| 項目 | 内容 |
|------|------|
| テストケースID | FT-USER-001 |
| テスト観点 | ユーザー名入力で送信される |
| 分類 | 正常系 |
| ユーザー操作 | ユーザー名入力 → 追加ボタンクリック |
| 期待結果 | submitイベントが発火 |
| 確認方法 | `expect(wrapper.emitted('submit')[0]).toEqual(['テストユーザー'])` |

##### FT-USER-002: UserForm - 空入力バリデーション

| 項目 | 内容 |
|------|------|
| テストケースID | FT-USER-002 |
| テスト観点 | ユーザー名空で追加不可 |
| 分類 | 異常系 |
| ユーザー操作 | ユーザー名空のまま追加ボタンクリック |
| 期待結果 | submitイベントが発火しない |
| 確認方法 | `expect(wrapper.emitted('submit')).toBeFalsy()` |

##### FT-USER-003: UserCard - ユーザー情報表示

| 項目 | 内容 |
|------|------|
| テストケースID | FT-USER-003 |
| テスト観点 | ユーザーカードが正しく表示される |
| 分類 | 正常系 |
| Props | user: { id: 1, name: 'テストユーザー', createdAt: '2024-12-24T10:00:00' } |
| 期待結果 | ユーザー名、登録日が表示 |
| 確認方法 | `expect(wrapper.text()).toContain('テストユーザー')` |

---

### 2.2 ストアテスト

**テスト対象**: `src/stores/`

#### FT-ST-001: todoStore - fetchTodos正常系

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-001 |
| テスト観点 | ToDo一覧取得でストア更新 |
| 分類 | 正常系 |
| 初期状態 | todos: [], loading: false |
| モック | todoService.getAll → [{ id: 1, title: 'テスト' }] |
| アクション | fetchTodos() |
| 期待結果 | todos: [{ id: 1, title: 'テスト' }], loading: false |

#### FT-ST-002: todoStore - fetchTodosエラー

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-002 |
| テスト観点 | API失敗時にエラー設定 |
| 分類 | 異常系 |
| 初期状態 | todos: [], error: null |
| モック | todoService.getAll → throw Error |
| アクション | fetchTodos() |
| 期待結果 | error: 'ToDoリストの読み込みに失敗しました' |

#### FT-ST-003: todoStore - filteredTodos

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-003 |
| テスト観点 | フィルタが正しく適用される |
| 分類 | 正常系 |
| 初期状態 | todos: [完了1件, 未完了2件], filter: 'pending' |
| 期待結果 | filteredTodos.length === 2 |

#### FT-ST-004: todoStore - stats計算

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-004 |
| テスト観点 | 統計が正しく計算される |
| 分類 | 正常系 |
| 初期状態 | todos: [完了2件, 未完了3件] |
| 期待結果 | stats: { total: 5, completed: 2, pending: 3 } |

#### FT-ST-005: projectStore - fetchProjects

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-005 |
| テスト観点 | 案件一覧取得でストア更新 |
| 分類 | 正常系 |
| モック | projectService.getAll → [{ id: 1, name: '案件1' }] |
| アクション | fetchProjects() |
| 期待結果 | projects: [{ id: 1, name: '案件1' }] |

#### FT-ST-006: userStore - fetchUsers

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-006 |
| テスト観点 | ユーザー一覧取得でストア更新 |
| 分類 | 正常系 |
| モック | userService.getAll → [{ id: 1, name: 'User1' }] |
| アクション | fetchUsers() |
| 期待結果 | users: [{ id: 1, name: 'User1' }] |

#### FT-ST-007: userStore - userCount

| 項目 | 内容 |
|------|------|
| テストケースID | FT-ST-007 |
| テスト観点 | ユーザー数ゲッター |
| 分類 | 正常系 |
| 初期状態 | users: [3件] |
| 期待結果 | userCount === 3 |

---

### 2.3 APIサービステスト

**テスト対象**: `src/services/`

#### FT-API-001: todoService.getAll - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | FT-API-001 |
| テスト観点 | ToDo一覧取得API呼び出し |
| 分類 | 正常系 |
| モック | fetch → 200, [{ id: 1, title: 'テスト' }] |
| 入力値 | なし |
| 期待結果 | [{ id: 1, title: 'テスト' }] |

#### FT-API-002: todoService.getAll - projectId付き

| 項目 | 内容 |
|------|------|
| テストケースID | FT-API-002 |
| テスト観点 | 案件IDフィルタ付きAPI呼び出し |
| 分類 | 正常系 |
| 入力値 | projectId: '1' |
| 期待結果 | fetch('/api/todos?projectId=1')が呼ばれる |

#### FT-API-003: todoService.create - 正常系

| 項目 | 内容 |
|------|------|
| テストケースID | FT-API-003 |
| テスト観点 | ToDo作成API呼び出し |
| 分類 | 正常系 |
| モック | fetch → 201, { id: 1, title: 'テスト' } |
| 入力値 | { title: 'テスト' } |
| 期待結果 | POSTリクエストが正しいボディで送信される |

#### FT-API-004: apiClient - ネットワークエラー

| 項目 | 内容 |
|------|------|
| テストケースID | FT-API-004 |
| テスト観点 | ネットワークエラー時にApiException |
| 分類 | 異常系 |
| モック | fetch → throw TypeError |
| 期待結果 | ApiException(status: 0) がスローされる |

#### FT-API-005: apiClient - 400エラー

| 項目 | 内容 |
|------|------|
| テストケースID | FT-API-005 |
| テスト観点 | バリデーションエラー時にApiException |
| 分類 | 異常系 |
| モック | fetch → 400, 'Bad Request' |
| 期待結果 | ApiException(status: 400) がスローされる |

---

## 3. E2Eテスト

### 3.1 テスト方針

既存のPlaywright E2Eテストを活用し、Vue移行後の画面動作を確認する。

### 3.2 対象シナリオ

| ID | シナリオ | 内容 |
|----|---------|------|
| E2E-001 | ToDo追加・完了・削除 | 既存テストをVue版で実行 |
| E2E-002 | 案件作成・チケット紐付け | 既存テストをVue版で実行 |
| E2E-003 | ユーザー追加・削除 | 既存テストをVue版で実行 |

### 3.3 変更点

- URLは変更なし（Vue Routerでhistory modeを使用）
- セレクタの変更が必要な場合はテストを更新

---

## 4. テストケース一覧

| ID | 対象 | テスト観点 | 分類 | 優先度 | ステータス |
|----|------|-----------|------|--------|-----------|
| FT-COM-001 | LoadingSpinner | 表示確認 | 正常系 | 中 | 未実施 |
| FT-COM-002 | ErrorMessage | メッセージ表示 | 正常系 | 中 | 未実施 |
| FT-COM-003 | ErrorMessage | 空メッセージ非表示 | 正常系 | 中 | 未実施 |
| FT-COM-004 | NavCard | リンク遷移 | 正常系 | 中 | 未実施 |
| FT-TODO-001 | TodoForm | フォーム表示 | 正常系 | 高 | 未実施 |
| FT-TODO-002 | TodoForm | タイトル必須 | 異常系 | 高 | 未実施 |
| FT-TODO-003 | TodoForm | 正常送信 | 正常系 | 高 | 未実施 |
| FT-TODO-004 | TodoForm | 日付バリデーション | 異常系 | 中 | 未実施 |
| FT-TODO-005 | TodoItem | 表示確認 | 正常系 | 高 | 未実施 |
| FT-TODO-006 | TodoItem | 完了切替 | 正常系 | 高 | 未実施 |
| FT-TODO-007 | TodoItem | 削除 | 正常系 | 高 | 未実施 |
| FT-TODO-008 | TodoList | 空リスト | 正常系 | 中 | 未実施 |
| FT-TODO-009 | TodoStats | 統計表示 | 正常系 | 中 | 未実施 |
| FT-TODO-010 | TodoFilter | フィルタ切替 | 正常系 | 中 | 未実施 |
| FT-PROJ-001 | ProjectForm | 案件作成送信 | 正常系 | 高 | 未実施 |
| FT-PROJ-002 | ProjectCard | 案件情報表示 | 正常系 | 高 | 未実施 |
| FT-PROJ-003 | ProjectCard | チケット一覧遷移 | 正常系 | 高 | 未実施 |
| FT-USER-001 | UserForm | ユーザー追加 | 正常系 | 高 | 未実施 |
| FT-USER-002 | UserForm | 空入力バリデーション | 異常系 | 中 | 未実施 |
| FT-USER-003 | UserCard | ユーザー情報表示 | 正常系 | 中 | 未実施 |
| FT-ST-001 | todoStore | fetchTodos正常 | 正常系 | 高 | 未実施 |
| FT-ST-002 | todoStore | fetchTodosエラー | 異常系 | 高 | 未実施 |
| FT-ST-003 | todoStore | filteredTodos | 正常系 | 中 | 未実施 |
| FT-ST-004 | todoStore | stats計算 | 正常系 | 中 | 未実施 |
| FT-ST-005 | projectStore | fetchProjects | 正常系 | 高 | 未実施 |
| FT-ST-006 | userStore | fetchUsers | 正常系 | 高 | 未実施 |
| FT-ST-007 | userStore | userCount | 正常系 | 低 | 未実施 |
| FT-API-001 | todoService | getAll正常 | 正常系 | 高 | 未実施 |
| FT-API-002 | todoService | getAll+projectId | 正常系 | 中 | 未実施 |
| FT-API-003 | todoService | create正常 | 正常系 | 高 | 未実施 |
| FT-API-004 | apiClient | ネットワークエラー | 異常系 | 高 | 未実施 |
| FT-API-005 | apiClient | 400エラー | 異常系 | 高 | 未実施 |

---

## 5. テストデータ

### 5.1 モックデータ

| データID | 用途 | 内容 |
|---------|------|------|
| FTD-TODO-001 | 正常系テスト用 | `{ id: 1, title: 'テストToDo', completed: false, ... }` |
| FTD-TODO-002 | 完了済みテスト用 | `{ id: 2, title: '完了ToDo', completed: true, ... }` |
| FTD-PROJ-001 | 案件テスト用 | `{ id: 1, name: 'テスト案件', description: '説明' }` |
| FTD-USER-001 | ユーザーテスト用 | `{ id: 1, name: 'テストユーザー', createdAt: '...' }` |

### 5.2 ストア初期状態

| 状態ID | 用途 | ストア | 状態内容 |
|--------|------|--------|---------|
| FTS-001 | 正常系テスト用 | todoStore | `{ todos: [FTD-TODO-001, FTD-TODO-002], loading: false, error: null }` |
| FTS-002 | エラー状態テスト用 | todoStore | `{ todos: [], loading: false, error: 'エラー' }` |

---

## 6. テスト環境

### 6.1 テストフレームワーク

| ツール | 用途 |
|--------|------|
| Vitest | テストランナー |
| @vue/test-utils | Vueコンポーネントテスト |
| vi.mock | モック機能 |
| @pinia/testing | Piniaテスト支援 |

### 6.2 テスト戦略別設定

| 戦略 | 設定内容 |
|------|---------|
| コンポーネントテスト | `mount(Component, { global: { stubs: ['router-link'] } })` |
| ストアテスト | `setActivePinia(createPinia())` + サービスモック |
| APIテスト | `vi.mock('./apiClient')` |

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
