import { test, expect } from '../../fixtures/custom-fixtures';

/**
 * チケット編集機能 E2Eテスト
 * 案件ID: 20260108_01_チケット詳細編集機能
 *
 * テスト仕様: docs/projects/20260108_01_チケット詳細編集機能/test-spec-frontend.md
 */
test.describe('チケット編集機能', () => {

  test.beforeEach(async ({ todosPage, cleanApiHelper }) => {
    // データをクリアしてからテスト開始
    await cleanApiHelper.clearAllData();
    await todosPage.goto();
    await todosPage.waitForLoadingComplete();
  });

  // ===================
  // E2E-001: チケット編集の基本フロー
  // ===================

  test('E2E-001: チケット編集の基本フロー', async ({ todosPage }) => {
    // UIからToDoを作成
    await todosPage.addTodo({ title: '編集前のタスク' });
    await todosPage.expectTodoExists('編集前のタスク');

    // 1. チケットカードをクリック → 詳細モーダル表示
    await todosPage.openTodoDetail(0);
    await todosPage.expectModalVisible();
    await todosPage.expectTodoDetailContains('編集前のタスク');

    // 2. 「編集」ボタンをクリック → 編集フォーム表示
    await todosPage.enterEditMode();
    await todosPage.expectInEditMode();

    // 3. タイトルを変更
    await todosPage.editTodo({ title: '編集後のタスク' });

    // 4. 保存後、表示モードに戻る
    await todosPage.expectInViewMode();

    // 5. 変更後のタイトルが表示される
    await todosPage.expectTodoDetailContains('編集後のタスク');

    // モーダルを閉じて一覧でも確認
    await todosPage.closeTodoDetail();
    await todosPage.expectTodoExists('編集後のタスク');
    await todosPage.expectTodoNotExists('編集前のタスク');
  });

  // ===================
  // E2E-002: チケット編集のキャンセル
  // ===================

  test('E2E-002: チケット編集のキャンセル', async ({ todosPage }) => {
    // UIからToDoを作成
    await todosPage.addTodo({ title: '元のタスク' });
    await todosPage.expectTodoExists('元のタスク');

    // チケット詳細モーダルを開く
    await todosPage.openTodoDetail(0);
    await todosPage.expectModalVisible();

    // 1. 「編集」ボタンをクリック
    await todosPage.enterEditMode();
    await todosPage.expectInEditMode();

    // 2. タイトルを変更（まだ保存しない）
    await todosPage.editTitleInput.clear();
    await todosPage.editTitleInput.fill('変更したタスク');

    // 3. 「キャンセル」ボタンをクリック
    await todosPage.cancelEdit();

    // 4. 表示モードに戻る
    await todosPage.expectInViewMode();

    // 元のタイトルが表示される（変更は破棄）
    await todosPage.expectTodoDetailContains('元のタスク');

    // モーダルを閉じて一覧でも確認
    await todosPage.closeTodoDetail();
    await todosPage.expectTodoExists('元のタスク');
  });

  // ===================
  // E2E-003: 担当者の変更
  // ===================

  test('E2E-003: 担当者の変更', async ({ todosPage, cleanApiHelper }) => {
    // テスト用ユーザーを作成
    const user1 = await cleanApiHelper.createUser('山田太郎');
    const user2 = await cleanApiHelper.createUser('鈴木花子');

    // ページをリロードしてユーザーリストを更新
    await todosPage.goto(undefined, { forceReload: true });
    await todosPage.waitForLoadingComplete();

    // UIからToDoを作成
    await todosPage.addTodo({ title: '担当者変更テスト' });
    await todosPage.expectTodoExists('担当者変更テスト');

    // 1. チケット詳細モーダルを開く
    await todosPage.openTodoDetail(0);
    await todosPage.expectModalVisible();

    // 2. 「編集」ボタンをクリック
    await todosPage.enterEditMode();

    // 3. 担当者セレクトで別のユーザーを選択
    await todosPage.editTodo({ assigneeId: user2.id });

    // 4. 新しい担当者名が表示される
    await todosPage.expectInViewMode();
    await todosPage.expectTodoDetailContains('鈴木花子');
  });

  // ===================
  // E2E-004: 期限日の変更
  // ===================

  test('E2E-004: 期限日の変更', async ({ todosPage }) => {
    // UIからToDoを作成（日付付き）
    await todosPage.addTodo({
      title: '期限日変更テスト',
      startDate: '2026-01-01',
      dueDate: '2026-01-31'
    });
    await todosPage.expectTodoExists('期限日変更テスト');

    // 1. チケット詳細モーダルを開く
    await todosPage.openTodoDetail(0);
    await todosPage.expectModalVisible();

    // 2. 「編集」ボタンをクリック
    await todosPage.enterEditMode();

    // 3. 期限日を変更
    await todosPage.editTodo({ dueDate: '2026-02-28' });

    // 4. 表示モードに戻る
    await todosPage.expectInViewMode();

    // 新しい期限日が表示される（フォーマットはロケールに依存）
    await todosPage.expectTodoDetailContains('2026/2/28');
  });

  // ===================
  // E2E-005: バリデーションエラーの表示
  // ===================

  test('E2E-005: バリデーションエラーの表示', async ({ todosPage }) => {
    // UIからToDoを作成
    await todosPage.addTodo({ title: 'バリデーションテスト' });
    await todosPage.expectTodoExists('バリデーションテスト');

    // チケット詳細モーダルを開く
    await todosPage.openTodoDetail(0);
    await todosPage.enterEditMode();

    // 1. タイトル入力欄を空にする
    await todosPage.editTitleInput.clear();

    // 2. エラーメッセージを確認
    await todosPage.expectEditError('タイトルを入力してください');

    // 3. 保存ボタンが無効化されていることを確認
    await todosPage.expectSaveButtonDisabled();
  });

  // ===================
  // E2E-006: 日付バリデーション
  // ===================

  test('E2E-006: 日付バリデーション', async ({ todosPage }) => {
    // UIからToDoを作成（日付付き）
    await todosPage.addTodo({
      title: '日付バリデーションテスト',
      startDate: '2026-01-01',
      dueDate: '2026-01-31'
    });
    await todosPage.expectTodoExists('日付バリデーションテスト');

    // チケット詳細モーダルを開く
    await todosPage.openTodoDetail(0);
    await todosPage.enterEditMode();

    // 1. 開始日を期限日より後に設定
    await todosPage.editStartDateInput.fill('2026-02-01');
    await todosPage.editDueDateInput.fill('2026-01-01');

    // 2. エラーメッセージを確認
    await todosPage.expectEditError('開始日は期限日以前');

    // 保存ボタンが無効化されていることを確認
    await todosPage.expectSaveButtonDisabled();
  });

  // ===================
  // 追加テスト: 説明の編集
  // ===================

  test('E2E-007: 説明の編集', async ({ todosPage }) => {
    // UIからToDoを作成（説明付き）
    await todosPage.addTodo({
      title: '説明編集テスト',
      description: '元の説明文'
    });
    await todosPage.expectTodoExists('説明編集テスト');

    // チケット詳細モーダルを開く
    await todosPage.openTodoDetail(0);
    await todosPage.expectModalVisible();
    await todosPage.expectTodoDetailContains('元の説明文');

    // 編集モードに入り、説明を変更
    await todosPage.enterEditMode();
    await todosPage.editTodo({ description: '新しい説明文' });

    // 表示モードに戻り、新しい説明が表示される
    await todosPage.expectInViewMode();
    await todosPage.expectTodoDetailContains('新しい説明文');
  });

  // ===================
  // 追加テスト: 全項目の編集
  // ===================

  test('E2E-008: 全項目の一括編集', async ({ todosPage, cleanApiHelper }) => {
    // テスト用ユーザーを作成
    const user = await cleanApiHelper.createUser('テスト担当者');

    // ページをリロードしてユーザーリストを更新
    await todosPage.goto(undefined, { forceReload: true });
    await todosPage.waitForLoadingComplete();

    // UIからToDoを作成
    await todosPage.addTodo({
      title: '全項目編集テスト',
      description: '元の説明',
      startDate: '2026-01-01',
      dueDate: '2026-01-31'
    });
    await todosPage.expectTodoExists('全項目編集テスト');

    // チケット詳細モーダルを開く
    await todosPage.openTodoDetail(0);
    await todosPage.enterEditMode();

    // 全項目を編集
    await todosPage.editTitleInput.clear();
    await todosPage.editTitleInput.fill('更新されたタスク');
    await todosPage.editDescriptionInput.clear();
    await todosPage.editDescriptionInput.fill('更新された説明');
    await todosPage.editStartDateInput.fill('2026-02-01');
    await todosPage.editDueDateInput.fill('2026-02-28');
    await todosPage.editAssigneeSelect.selectOption({ value: String(user.id) });

    // 保存
    await todosPage.editSaveButton.click();
    await todosPage.waitForLoadingComplete();

    // 全項目が更新されていることを確認
    await todosPage.expectInViewMode();
    await todosPage.expectTodoDetailContains('更新されたタスク');
    await todosPage.expectTodoDetailContains('更新された説明');
    await todosPage.expectTodoDetailContains('テスト担当者');
  });
});
