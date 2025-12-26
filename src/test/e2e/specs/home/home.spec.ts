import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';

/**
 * ホーム画面 E2Eテスト
 * 画面ID: SC-001
 *
 * テスト仕様: docs/projects/20251224_インデックスページ改善/test-spec-frontend.md
 *
 * Vue.js SPA対応版
 */
test.describe('ホーム画面', () => {

  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  // ===================
  // 画面表示テスト
  // ===================

  test('FT-E2E-001: ホーム画面 - 初期表示', async () => {
    // ヘッダーが表示される
    await expect(homePage.title).toBeVisible();
    await expect(homePage.subtitle).toBeVisible();

    // 3つのナビゲーションカードが表示される
    await expect(homePage.todoCard).toBeVisible();
    await expect(homePage.projectCard).toBeVisible();
    await expect(homePage.userCard).toBeVisible();

    // フッターが表示される
    await expect(homePage.footer).toBeVisible();
  });

  test('FT-E2E-002: ホーム画面 - ヘッダー表示', async () => {
    // タイトルが正しく表示される（Vue版: "ToDo App"）
    await expect(homePage.title).toHaveText('ToDo App');

    // サブタイトルが正しく表示される
    await expect(homePage.subtitle).toHaveText('タスク管理アプリケーション');
  });

  test('FT-E2E-003: ホーム画面 - ナビゲーションカード表示', async ({ page }) => {
    // チケット管理カード
    const todoTitle = await homePage.getCardTitle('todo');
    expect(todoTitle).toBe('チケット管理');

    // 案件管理カード
    const projectTitle = await homePage.getCardTitle('project');
    expect(projectTitle).toBe('案件管理');

    // ユーザー管理カード
    const userTitle = await homePage.getCardTitle('user');
    expect(userTitle).toBe('ユーザー管理');
  });

  // ===================
  // 画面遷移テスト
  // ===================

  test('FT-E2E-004: チケット管理への遷移', async ({ page }) => {
    // チケット管理カードをクリック
    await homePage.clickTodoCard();

    // チケット管理画面に遷移する（Vue Router形式）
    await expect(page).toHaveURL('/todos');
  });

  test('FT-E2E-005: 案件管理への遷移', async ({ page }) => {
    // 案件管理カードをクリック
    await homePage.clickProjectCard();

    // 案件管理画面に遷移する（Vue Router形式）
    await expect(page).toHaveURL('/projects');
  });

  test('FT-E2E-006: ユーザー管理への遷移', async ({ page }) => {
    // ユーザー管理カードをクリック
    await homePage.clickUserCard();

    // ユーザー管理画面に遷移する（Vue Router形式）
    await expect(page).toHaveURL('/users');
  });

  test('FT-E2E-007: ホームへの戻り遷移（案件管理から）', async ({ page }) => {
    // 案件管理画面に遷移
    await homePage.clickProjectCard();
    await expect(page).toHaveURL('/projects');

    // 「ホームに戻る」リンクをクリック
    await page.click('a[href="/"]');

    // ホーム画面に戻る
    await expect(page).toHaveURL('/');
    await expect(homePage.title).toBeVisible();
  });

});
