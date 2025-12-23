import { test as base } from '@playwright/test';
import { TodosPage } from '../pages/todos.page';
import { ProjectsPage } from '../pages/projects.page';
import { UsersPage } from '../pages/users.page';
import { ApiHelper } from '../helpers/api-helper';

/**
 * カスタムフィクスチャ定義
 */
type CustomFixtures = {
  /** ToDo管理画面ページオブジェクト */
  todosPage: TodosPage;
  /** 案件一覧画面ページオブジェクト */
  projectsPage: ProjectsPage;
  /** ユーザー管理画面ページオブジェクト */
  usersPage: UsersPage;
  /** APIヘルパー */
  apiHelper: ApiHelper;
  /** クリーンな状態のAPIヘルパー（テスト前後でデータクリア） */
  cleanApiHelper: ApiHelper;
};

/**
 * 拡張テストインスタンス
 */
export const test = base.extend<CustomFixtures>({
  // ToDo管理画面ページオブジェクト
  todosPage: async ({ page }, use) => {
    const todosPage = new TodosPage(page);
    await use(todosPage);
  },

  // 案件一覧画面ページオブジェクト
  projectsPage: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page);
    await use(projectsPage);
  },

  // ユーザー管理画面ページオブジェクト
  usersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);
    await use(usersPage);
  },

  // APIヘルパー（データクリアなし）
  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  // クリーンな状態のAPIヘルパー（テスト前後でデータクリア）
  cleanApiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    // テスト前にデータをクリア
    await apiHelper.clearAllData();
    await use(apiHelper);
    // テスト後にデータをクリア
    await apiHelper.clearAllData();
  },
});

export { expect } from '@playwright/test';
