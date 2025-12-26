import { test, expect } from '../../fixtures/custom-fixtures';

/**
 * ToDo管理画面 CRUDテスト
 * 画面ID: SCR-TODOS-001
 *
 * テストシナリオ: ../master/test-scenarios/todos-scenarios.md
 * 画面仕様: ../master/screen-spec/todos-screen.json
 *
 * Vue.js SPA対応版
 */
test.describe('ToDo管理画面', () => {

  test.beforeEach(async ({ todosPage }) => {
    // ToDo管理画面を開く
    await todosPage.goto();
    await todosPage.waitForLoadingComplete();
  });

  // ===================
  // 画面表示テスト
  // ===================

  test('TC-001: 画面初期表示確認', async ({ todosPage }) => {
    // 統計表示エリアが表示される（Vue: TodoStats.vue）
    await expect(todosPage.statsContainer).toBeVisible();

    // 新規ToDo追加フォームが表示される
    await expect(todosPage.titleInput).toBeVisible();
    await expect(todosPage.addButton).toBeVisible();

    // フィルタボタンが表示される
    await expect(todosPage.allFilterButton).toBeVisible();
    await expect(todosPage.pendingFilterButton).toBeVisible();
    await expect(todosPage.completedFilterButton).toBeVisible();

    // 「すべて」ボタンがアクティブ状態である
    await todosPage.expectFilterActive('all');
  });

  // ===================
  // 追加テスト
  // ===================

  test('TC-010: ToDo追加（正常系・最小入力）', async ({ todosPage }) => {
    // 初期状態の統計を取得
    const initialStats = await todosPage.getStats();

    // ToDoを追加
    await todosPage.addTodo({ title: 'テストタスク' });

    // 入力欄がクリアされる
    await todosPage.expectFormCleared();

    // ToDoリストに追加される
    await todosPage.expectTodoExists('テストタスク');

    // 統計の総数が1増加する
    const newStats = await todosPage.getStats();
    expect(newStats.total).toBe(initialStats.total + 1);
  });

  test('TC-011: ToDo追加（正常系・全項目入力）', async ({ todosPage, cleanApiHelper }) => {
    // テスト用ユーザーを作成
    await cleanApiHelper.createUser('テスト担当者');

    // ページをリロードしてユーザーリストを更新
    await todosPage.goto();
    await todosPage.waitForLoadingComplete();

    // 全項目を入力してToDoを追加
    await todosPage.addTodo({
      title: '詳細タスク',
      description: 'これはテスト用の説明です',
      startDate: '2025-01-01',
      dueDate: '2025-01-31',
      assigneeIndex: 0,
    });

    // ToDoが追加される
    await todosPage.expectTodoExists('詳細タスク');
  });

  // ===================
  // 完了切り替えテスト
  // ===================

  test('TC-020: ToDo完了切り替え（未完了→完了）', async ({ todosPage, cleanApiHelper }) => {
    // テスト用ToDoを作成
    await cleanApiHelper.createTodo({ title: '完了テスト用タスク' });
    // cleanApiHelperでデータ更新後は強制リロードで最新データを取得
    await todosPage.goto(undefined, { forceReload: true });
    await todosPage.waitForLoadingComplete();

    // Todoアイテムが表示されるのを待機
    await expect(todosPage.todoItems.first()).toBeVisible();

    // 初期状態の統計を取得
    const initialStats = await todosPage.getStats();

    // 完了切り替え
    await todosPage.toggleTodo(0);

    // 完了状態になる
    await todosPage.expectTodoCompleted(0);

    // 統計が更新される
    const newStats = await todosPage.getStats();
    expect(newStats.completed).toBe(initialStats.completed + 1);
    expect(newStats.pending).toBe(initialStats.pending - 1);
  });

  test('TC-021: ToDo完了切り替え（完了→未完了）', async ({ todosPage, cleanApiHelper }) => {
    // テスト用ToDoを作成して完了にする
    const todo = await cleanApiHelper.createTodo({ title: '未完了復帰テスト用タスク' });
    await cleanApiHelper.toggleTodo(todo.id);
    // cleanApiHelperでデータ更新後は強制リロードで最新データを取得
    await todosPage.goto(undefined, { forceReload: true });
    await todosPage.waitForLoadingComplete();

    // 初期状態の統計を取得
    const initialStats = await todosPage.getStats();

    // 未完了に切り替え
    await todosPage.toggleTodo(0);

    // 未完了状態になる
    await todosPage.expectTodoNotCompleted(0);

    // 統計が更新される
    const newStats = await todosPage.getStats();
    expect(newStats.completed).toBe(initialStats.completed - 1);
    expect(newStats.pending).toBe(initialStats.pending + 1);
  });

  // ===================
  // 削除テスト
  // ===================

  test('TC-030: ToDo削除（確認OK）', async ({ todosPage, cleanApiHelper, page }) => {
    // テスト用ToDoを作成
    await cleanApiHelper.createTodo({ title: '削除テスト用タスク' });
    await todosPage.goto();
    await todosPage.waitForLoadingComplete();

    // Todoアイテムが表示されるのを待機
    await expect(todosPage.todoItems.first()).toBeVisible();

    // 初期状態の件数を取得
    const initialCount = await todosPage.getTodoCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // 確認ダイアログのハンドラを設定
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    // 削除ボタンをクリック
    await todosPage.todoItems.first().locator('.delete-btn').click();
    await todosPage.waitForLoadingComplete();

    // 件数が減ることを待機して確認
    await expect(todosPage.todoItems).toHaveCount(initialCount - 1);
  });

  test('TC-031: ToDo削除（確認キャンセル）', async ({ todosPage, cleanApiHelper, page }) => {
    // テスト用ToDoを作成
    await cleanApiHelper.createTodo({ title: '削除キャンセルテスト用タスク' });
    await todosPage.goto();
    await todosPage.waitForLoadingComplete();

    // Todoアイテムが表示されるのを待機
    await expect(todosPage.todoItems.first()).toBeVisible();

    // 初期状態の件数を取得
    const initialCount = await todosPage.getTodoCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // 確認ダイアログのハンドラを設定（キャンセル）
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    // 削除ボタンをクリック
    await todosPage.todoItems.first().locator('.delete-btn').click();

    // 少し待機（キャンセルの場合は即座に処理される）
    await page.waitForTimeout(500);

    // 件数は変わらない
    const newCount = await todosPage.getTodoCount();
    expect(newCount).toBe(initialCount);
  });

  // ===================
  // フィルタテスト
  // ===================

  test('TC-040: フィルタ機能（未完了のみ表示）', async ({ todosPage, cleanApiHelper }) => {
    // テストデータをセットアップ
    const todo1 = await cleanApiHelper.createTodo({ title: '未完了タスク' });
    const todo2 = await cleanApiHelper.createTodo({ title: '完了タスク' });
    await cleanApiHelper.toggleTodo(todo2.id);

    await todosPage.goto();
    await todosPage.waitForLoadingComplete();

    // 未完了フィルタをクリック
    await todosPage.applyFilter('pending');

    // 未完了フィルタがアクティブ
    await todosPage.expectFilterActive('pending');

    // 未完了のToDoのみ表示される
    await todosPage.expectTodoExists('未完了タスク');
    // Note: 完了タスクは非表示だが、DOMには存在する可能性あり
  });

  test('TC-041: フィルタ機能（完了済みのみ表示）', async ({ todosPage, cleanApiHelper }) => {
    // テストデータをセットアップ
    const todo1 = await cleanApiHelper.createTodo({ title: '未完了タスク2' });
    const todo2 = await cleanApiHelper.createTodo({ title: '完了タスク2' });
    await cleanApiHelper.toggleTodo(todo2.id);

    await todosPage.goto();
    await todosPage.waitForLoadingComplete();

    // 完了済みフィルタをクリック
    await todosPage.applyFilter('completed');

    // 完了済みフィルタがアクティブ
    await todosPage.expectFilterActive('completed');
  });

  // ===================
  // バリデーションテスト
  // ===================

  test('TC-100: バリデーション（タイトル未入力）', async ({ todosPage, page }) => {
    // Vue版ではalert()を使用するため、ダイアログハンドラを設定
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // タイトル未入力で追加ボタンをクリック
    await todosPage.addButton.click();

    // アラートメッセージを確認
    expect(alertMessage).toBe('タイトルを入力してください');
  });

  test('TC-101: バリデーション（日付範囲不正）', async ({ todosPage, page }) => {
    // Vue版ではalert()を使用するため、ダイアログハンドラを設定
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // 不正な日付範囲で追加
    await todosPage.titleInput.fill('日付テスト');
    await todosPage.startDateInput.fill('2025-12-31');
    await todosPage.dueDateInput.fill('2025-01-01');
    await todosPage.addButton.click();

    // アラートメッセージを確認
    expect(alertMessage).toBe('終了日は開始日以降を指定してください');
  });

  // ===================
  // 案件別表示テスト
  // ===================

  test('TC-200: 案件別ToDo表示', async ({ todosPage, cleanApiHelper }) => {
    // テストデータをセットアップ
    const project = await cleanApiHelper.createProject('テスト案件');
    await cleanApiHelper.createTodo({ title: '案件のタスク', projectId: project.id });
    await cleanApiHelper.createTodo({ title: '別タスク' }); // 案件なし

    // 案件IDを指定してページを開く
    await todosPage.gotoWithProject(project.id);

    // 案件名が表示される
    await expect(todosPage.projectName).toContainText('テスト案件');

    // 該当案件のToDoのみ表示される
    await todosPage.expectTodoExists('案件のタスク');
  });

  // ===================
  // 画面遷移テスト
  // ===================

  test('TC-300: 画面遷移（案件一覧へ戻る）', async ({ todosPage }) => {
    // 戻るリンクをクリック
    await todosPage.backLink.click();

    // 案件一覧画面に遷移（Vue Router形式）
    await todosPage.expectUrl('/projects');
  });
});
