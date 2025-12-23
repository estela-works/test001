import { test, expect } from '@playwright/test';

/**
 * サンプルテストコード
 * このファイルの書き方・命名規則に従ってテストコードを生成してください
 *
 * 命名規則:
 * - test.describe: 画面名または機能グループ名
 * - test: 日本語で操作内容がわかるテスト名
 *
 * コーディング規約:
 * - 各操作の前に日本語コメントを記載
 * - セレクタは画面仕様JSONのものを使用
 * - 待機にはexpect().toBeVisible()を使用
 * - 入力にはfill()を使用（type()は使わない）
 */

test.describe('ToDo管理画面', () => {

  test.beforeEach(async ({ page }) => {
    // テスト前の共通処理: ToDo管理画面を開く
    await page.goto('/todos.html');

    // ローディング完了を待機
    await page.locator('#loading').waitFor({ state: 'hidden' });
  });

  test('ToDoを追加できる', async ({ page }) => {
    // タイトルを入力
    await page.locator('#title-input').fill('テストタスク');

    // 追加ボタンをクリック
    await page.locator('.add-todo button').click();

    // ToDoリストに追加されることを確認
    await expect(page.locator('.todo-item').filter({ hasText: 'テストタスク' })).toBeVisible();
  });

  test('ToDoの完了状態を切り替えられる', async ({ page }) => {
    // 事前にToDoを追加
    await page.locator('#title-input').fill('完了テスト用タスク');
    await page.locator('.add-todo button').click();
    await expect(page.locator('.todo-item')).toHaveCount(1);

    // 完了ボタンをクリック
    await page.locator('.todo-item .toggle-btn').click();

    // 完了状態になることを確認
    await expect(page.locator('.todo-item')).toHaveClass(/completed/);
  });

  test('ToDoを削除できる', async ({ page }) => {
    // 事前にToDoを追加
    await page.locator('#title-input').fill('削除テスト用タスク');
    await page.locator('.add-todo button').click();
    await expect(page.locator('.todo-item')).toHaveCount(1);

    // 削除ボタンをクリック（確認ダイアログを処理）
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await page.locator('.todo-item .delete-btn').click();

    // ToDoが削除されることを確認
    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('フィルタで未完了のみ表示できる', async ({ page }) => {
    // 事前にToDoを2件追加
    await page.locator('#title-input').fill('未完了タスク');
    await page.locator('.add-todo button').click();
    await page.locator('#title-input').fill('完了タスク');
    await page.locator('.add-todo button').click();

    // 2件目を完了にする
    await page.locator('.todo-item').nth(1).locator('.toggle-btn').click();

    // 未完了フィルタをクリック
    await page.locator('#pending-btn').click();

    // 未完了のみ表示されることを確認
    await expect(page.locator('.todo-item:not(.completed)')).toHaveCount(1);
    await expect(page.locator('.todo-item.completed')).toHaveCount(0);
  });

});

test.describe('案件一覧画面', () => {

  test.beforeEach(async ({ page }) => {
    // テスト前の共通処理: 案件一覧画面を開く
    await page.goto('/projects.html');

    // ローディング完了を待機
    await page.locator('#loading').waitFor({ state: 'hidden' });
  });

  test('案件を作成できる', async ({ page }) => {
    // 案件名を入力
    await page.locator('#project-name-input').fill('テスト案件');

    // 説明を入力
    await page.locator('#project-description-input').fill('テスト用の案件です');

    // 作成ボタンをクリック
    await page.locator('#add-project-btn').click();

    // 案件リストに追加されることを確認
    await expect(page.locator('.project-card').filter({ hasText: 'テスト案件' })).toBeVisible();
  });

  test('チケット一覧に遷移できる', async ({ page }) => {
    // 事前に案件を作成
    await page.locator('#project-name-input').fill('遷移テスト案件');
    await page.locator('#add-project-btn').click();
    await expect(page.locator('.project-card').filter({ hasText: '遷移テスト案件' })).toBeVisible();

    // チケット一覧ボタンをクリック
    await page.locator('.project-card').filter({ hasText: '遷移テスト案件' }).locator('.view-btn').click();

    // ToDo管理画面に遷移することを確認
    await expect(page).toHaveURL(/todos\.html\?projectId=\d+/);
  });

});

test.describe('ユーザー管理画面', () => {

  test.beforeEach(async ({ page }) => {
    // テスト前の共通処理: ユーザー管理画面を開く
    await page.goto('/users.html');

    // ローディング完了を待機
    await page.locator('#loading').waitFor({ state: 'hidden' });
  });

  test('ユーザーを追加できる', async ({ page }) => {
    // ユーザー名を入力
    await page.locator('#name-input').fill('テストユーザー');

    // 追加ボタンをクリック
    await page.locator('.add-form button').click();

    // ユーザーリストに追加されることを確認
    await expect(page.locator('.user-card').filter({ hasText: 'テストユーザー' })).toBeVisible();
  });

  test('ユーザーを削除できる', async ({ page }) => {
    // 事前にユーザーを追加
    await page.locator('#name-input').fill('削除テストユーザー');
    await page.locator('.add-form button').click();
    await expect(page.locator('.user-card').filter({ hasText: '削除テストユーザー' })).toBeVisible();

    // 削除ボタンをクリック（確認ダイアログを処理）
    page.once('dialog', async dialog => {
      await dialog.accept();
    });
    await page.locator('.user-card').filter({ hasText: '削除テストユーザー' }).locator('.delete-btn').click();

    // ユーザーが削除されることを確認
    await expect(page.locator('.user-card').filter({ hasText: '削除テストユーザー' })).toHaveCount(0);
  });

});
