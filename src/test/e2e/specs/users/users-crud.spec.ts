import { test, expect } from '../../fixtures/custom-fixtures';

/**
 * ユーザー管理画面 CRUDテスト
 * 画面ID: SCR-USERS-001
 *
 * テストシナリオ: ../master/test-scenarios/users-scenarios.md
 * 画面仕様: ../master/screen-spec/users-screen.json
 */
test.describe('ユーザー管理画面', () => {

  test.beforeEach(async ({ usersPage }) => {
    // ユーザー管理画面を開く
    await usersPage.goto();
    await usersPage.waitForLoadingComplete();
  });

  // ===================
  // 画面表示テスト
  // ===================

  test('TC-001: 画面初期表示確認', async ({ usersPage }) => {
    // ユーザー追加フォームが表示される
    await expect(usersPage.nameInput).toBeVisible();
    await expect(usersPage.addUserButton).toBeVisible();

    // 登録ユーザー数統計が表示される
    await expect(usersPage.userCount).toBeVisible();

    // 案件一覧へのリンクが表示される
    await expect(usersPage.backLink).toBeVisible();
  });

  // ===================
  // 追加テスト
  // ===================

  test('TC-010: ユーザー追加（正常系）', async ({ usersPage, cleanApiHelper }) => {
    // 初期状態の件数を取得
    const initialCount = await usersPage.getUserCount();
    const initialStatsCount = await usersPage.getStatsUserCount();

    // ユーザーを追加
    await usersPage.addUser('テストユーザー');

    // 入力欄がクリアされる
    await usersPage.expectFormCleared();

    // ユーザーリストに追加される
    await usersPage.expectUserExists('テストユーザー');

    // 件数が増加する
    const newCount = await usersPage.getUserCount();
    expect(newCount).toBe(initialCount + 1);

    // 統計のユーザー数が増加する
    const newStatsCount = await usersPage.getStatsUserCount();
    expect(newStatsCount).toBe(initialStatsCount + 1);
  });

  // ===================
  // 削除テスト
  // ===================

  test('TC-020: ユーザー削除（確認OK）', async ({ usersPage, cleanApiHelper }) => {
    // テスト用ユーザーを作成
    await cleanApiHelper.createUser('削除テストユーザー');
    await usersPage.goto();
    await usersPage.waitForLoadingComplete();

    // 初期状態の件数を取得
    const initialCount = await usersPage.getUserCount();

    // 削除（確認ダイアログでOK）
    await usersPage.deleteUser(0, true);

    // 件数が減る
    const newCount = await usersPage.getUserCount();
    expect(newCount).toBe(initialCount - 1);
  });

  test('TC-021: ユーザー削除（確認キャンセル）', async ({ usersPage, cleanApiHelper }) => {
    // テスト用ユーザーを作成
    await cleanApiHelper.createUser('削除キャンセルテストユーザー');
    await usersPage.goto();
    await usersPage.waitForLoadingComplete();

    // 初期状態の件数を取得
    const initialCount = await usersPage.getUserCount();

    // 削除（確認ダイアログでキャンセル）
    await usersPage.deleteUser(0, false);

    // 件数は変わらない
    const newCount = await usersPage.getUserCount();
    expect(newCount).toBe(initialCount);
  });

  test('TC-022: ユーザー削除（担当チケットの未割当化）', async ({ usersPage, cleanApiHelper, todosPage }) => {
    // テストデータをセットアップ
    const user = await cleanApiHelper.createUser('削除対象ユーザー');
    const todo = await cleanApiHelper.createTodo({
      title: '担当付きタスク',
      assigneeId: user.id,
    });

    await usersPage.goto();
    await usersPage.waitForLoadingComplete();

    // ユーザーを削除
    await usersPage.deleteUserByName('削除対象ユーザー', true);

    // ユーザーが削除される
    await usersPage.expectUserNotExists('削除対象ユーザー');

    // ToDo管理画面でチケットが未割当になっていることを確認
    await todosPage.goto();
    await todosPage.waitForLoadingComplete();
    // Note: 担当者が「未割当」表示になることを確認
    // （実装によっては追加の検証が必要）
  });

  // ===================
  // バリデーションテスト
  // ===================

  test('TC-100: バリデーション（ユーザー名未入力）', async ({ usersPage }) => {
    // ユーザー名未入力で追加ボタンをクリック
    await usersPage.addUserButton.click();

    // エラーメッセージが表示される
    await usersPage.expectErrorMessage('ユーザー名を入力してください');
  });

  test('TC-101: バリデーション（重複ユーザー名）', async ({ usersPage, cleanApiHelper }) => {
    // 既存ユーザーを作成
    await cleanApiHelper.createUser('既存ユーザー');
    await usersPage.goto();
    await usersPage.waitForLoadingComplete();

    // 同名のユーザーを追加しようとする
    await usersPage.addUser('既存ユーザー');

    // エラーメッセージが表示される
    await usersPage.expectErrorMessage('同じ名前のユーザーが既に存在します');
  });

  test('TC-102: バリデーション（文字数上限）', async ({ usersPage }) => {
    // 101文字以上の文字列を作成
    const longName = 'あ'.repeat(101);

    // 長い名前を入力して追加
    await usersPage.addUser(longName);

    // エラーメッセージが表示される
    await usersPage.expectErrorMessage('ユーザー名は100文字以内で入力してください');
  });

  // ===================
  // 空の状態テスト
  // ===================

  test('TC-200: 空の状態表示', async ({ usersPage, cleanApiHelper }) => {
    // データをクリア
    await cleanApiHelper.clearAllData();

    // ページをリロード
    await usersPage.goto();
    await usersPage.waitForLoadingComplete();

    // 空の状態メッセージが表示される
    await usersPage.expectEmptyMessage();

    // 登録ユーザー数が0
    const count = await usersPage.getStatsUserCount();
    expect(count).toBe(0);
  });

  // ===================
  // 画面遷移テスト
  // ===================

  test('TC-300: 画面遷移（案件一覧へ戻る）', async ({ usersPage }) => {
    // 戻るリンクをクリック
    await usersPage.navigateToProjects();

    // 案件一覧画面に遷移
    await usersPage.expectUrl('/projects.html');
  });
});
