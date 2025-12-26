import { test, expect } from '../../fixtures/custom-fixtures';

/**
 * 案件一覧画面 CRUDテスト
 * 画面ID: SCR-PROJECTS-001
 *
 * テストシナリオ: ../master/test-scenarios/projects-scenarios.md
 * 画面仕様: ../master/screen-spec/projects-screen.json
 *
 * Vue.js SPA対応版
 */
test.describe('案件一覧画面', () => {

  test.beforeEach(async ({ projectsPage }) => {
    // 案件一覧画面を開く
    await projectsPage.goto();
    await projectsPage.waitForLoadingComplete();
  });

  // ===================
  // 画面表示テスト
  // ===================

  test('TC-001: 画面初期表示確認', async ({ projectsPage }) => {
    // 案件作成フォームが表示される
    await expect(projectsPage.projectNameInput).toBeVisible();
    await expect(projectsPage.addProjectButton).toBeVisible();

    // 「案件なし」カードが表示される
    await expect(projectsPage.noProjectCard).toBeVisible();

    // ユーザー管理リンクが表示される
    await expect(projectsPage.userManagementLink).toBeVisible();

    // ホームに戻るリンクが表示される
    await expect(projectsPage.homeLink).toBeVisible();
  });

  // ===================
  // 追加テスト
  // ===================

  test('TC-010: 案件作成（正常系・最小入力）', async ({ projectsPage, cleanApiHelper }) => {
    // 初期状態の件数を取得
    const initialCount = await projectsPage.getProjectCount();

    // 案件を作成
    await projectsPage.createProject({ name: 'テスト案件' });

    // 入力欄がクリアされる
    await projectsPage.expectFormCleared();

    // 案件リストに追加される
    await projectsPage.expectProjectExists('テスト案件');

    // 件数が増加する
    const newCount = await projectsPage.getProjectCount();
    expect(newCount).toBe(initialCount + 1);
  });

  test('TC-011: 案件作成（正常系・全項目入力）', async ({ projectsPage, cleanApiHelper }) => {
    // 全項目を入力して案件を作成
    await projectsPage.createProject({
      name: '詳細テスト案件',
      description: 'テスト用の案件説明です',
    });

    // 案件リストに追加される
    await projectsPage.expectProjectExists('詳細テスト案件');
  });

  // ===================
  // 画面遷移テスト
  // ===================

  test('TC-020: チケット一覧への遷移', async ({ projectsPage, cleanApiHelper }) => {
    // 事前に案件を作成
    const project = await cleanApiHelper.createProject('遷移テスト案件');
    await projectsPage.goto();
    await projectsPage.waitForLoadingComplete();

    // チケット一覧ボタンをクリック
    await projectsPage.viewProjectTodos(0);

    // ToDo管理画面に遷移（Vue Router形式: /todos?projectId=xxx）
    await projectsPage.expectUrl(/\/todos\?projectId=\d+/);
  });

  test('TC-021: 案件なしチケット一覧への遷移', async ({ projectsPage }) => {
    // 案件なしチケット一覧ボタンをクリック
    await projectsPage.viewNoProjectTodos();

    // ToDo管理画面に遷移（Vue Router形式: /todos?projectId=none）
    await projectsPage.expectUrl(/\/todos\?projectId=none/);
  });

  // ===================
  // 削除テスト
  // ===================

  test('TC-030: 案件削除（確認OK）', async ({ projectsPage, cleanApiHelper, page }) => {
    // テスト用案件を作成
    await cleanApiHelper.createProject('削除テスト案件');
    await projectsPage.goto();
    await projectsPage.waitForLoadingComplete();

    // 案件カードが表示されるのを待機
    await expect(projectsPage.projectCards.first()).toBeVisible();

    // 初期状態の件数を取得
    const initialCount = await projectsPage.getProjectCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // 確認ダイアログのハンドラを設定
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    // 削除ボタンをクリック
    await projectsPage.projectCards.first().locator('.delete-btn').click();
    await projectsPage.waitForLoadingComplete();

    // 件数が減ることを待機して確認
    await expect(projectsPage.projectCards).toHaveCount(initialCount - 1);
  });

  test('TC-031: 案件削除（確認キャンセル）', async ({ projectsPage, cleanApiHelper, page }) => {
    // テスト用案件を作成
    await cleanApiHelper.createProject('削除キャンセルテスト案件');
    await projectsPage.goto();
    await projectsPage.waitForLoadingComplete();

    // 案件カードが表示されるのを待機
    await expect(projectsPage.projectCards.first()).toBeVisible();

    // 初期状態の件数を取得（少なくとも1件はある）
    const initialCount = await projectsPage.getProjectCount();
    expect(initialCount).toBeGreaterThanOrEqual(1);

    // 確認ダイアログのハンドラを設定（キャンセル）
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    // 削除ボタンをクリック
    await projectsPage.projectCards.first().locator('.delete-btn').click();

    // 少し待機（キャンセルの場合は即座に処理される）
    await page.waitForTimeout(500);

    // 件数は変わらない
    const newCount = await projectsPage.getProjectCount();
    expect(newCount).toBe(initialCount);
  });

  // ===================
  // 進捗表示テスト
  // ===================

  test('TC-040: 進捗表示の確認', async ({ projectsPage, cleanApiHelper }) => {
    // テストデータをセットアップ
    const project = await cleanApiHelper.createProject('進捗テスト案件');
    const todo1 = await cleanApiHelper.createTodo({ title: 'タスク1', projectId: project.id });
    const todo2 = await cleanApiHelper.createTodo({ title: 'タスク2', projectId: project.id });
    await cleanApiHelper.toggleTodo(todo2.id); // 1件を完了に

    await projectsPage.goto();
    await projectsPage.waitForLoadingComplete();

    // 統計を確認
    const stats = await projectsPage.getProjectStats(0);
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.progressRate).toBe(50);
  });

  // ===================
  // バリデーションテスト
  // ===================

  test('TC-100: バリデーション（案件名未入力）', async ({ projectsPage, page }) => {
    // Vue版ではalert()を使用するため、ダイアログハンドラを設定
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // 案件名未入力で作成ボタンをクリック
    await projectsPage.addProjectButton.click();

    // アラートメッセージを確認
    expect(alertMessage).toBe('案件名を入力してください');
  });

  // ===================
  // 画面遷移テスト（その他）
  // ===================

  test('TC-200: 画面遷移（ユーザー管理へ）', async ({ projectsPage }) => {
    // ユーザー管理リンクをクリック
    await projectsPage.navigateToUserManagement();

    // ユーザー管理画面に遷移（Vue Router形式）
    await projectsPage.expectUrl('/users');
  });

  test('TC-201: 画面遷移（ホームへ戻る）', async ({ projectsPage }) => {
    // ホームリンクをクリック
    await projectsPage.navigateToHome();

    // ホーム画面に遷移
    await projectsPage.expectUrl('/');
  });
});
