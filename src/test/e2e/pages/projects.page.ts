import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * 案件一覧画面ページオブジェクト
 * 画面ID: SCR-PROJECTS-001
 */
export class ProjectsPage extends BasePage {
  protected readonly url = '/projects.html';

  // === 入力要素 ===
  readonly projectNameInput: Locator;
  readonly projectDescriptionInput: Locator;
  readonly addProjectButton: Locator;

  // === リスト ===
  readonly projectList: Locator;
  readonly projectCards: Locator;
  readonly noProjectCard: Locator;

  // === その他 ===
  readonly userManagementLink: Locator;
  readonly homeLink: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // 入力要素の初期化
    this.projectNameInput = page.locator('#project-name-input');
    this.projectDescriptionInput = page.locator('#project-description-input');
    this.addProjectButton = page.locator('#add-project-btn');

    // リストの初期化
    this.projectList = page.locator('#project-list');
    this.projectCards = page.locator('.project-card:not(.no-project)');
    this.noProjectCard = page.locator('#no-project-card');

    // その他
    this.userManagementLink = page.locator("a[href='/users.html']");
    this.homeLink = page.locator("a[href='/']");
    this.errorMessage = page.locator('#error-message');
    this.loadingIndicator = page.locator('#loading');
  }

  /**
   * 案件を作成
   */
  async createProject(options: {
    name: string;
    description?: string;
  }): Promise<void> {
    // 案件名を入力
    await this.projectNameInput.fill(options.name);

    // 説明を入力（オプション）
    if (options.description) {
      await this.projectDescriptionInput.fill(options.description);
    }

    // 作成ボタンをクリック
    await this.addProjectButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * 案件を削除
   */
  async deleteProject(index: number = 0, confirm: boolean = true): Promise<void> {
    const projectCard = this.projectCards.nth(index);
    await this.handleConfirmDialog(confirm);
    await projectCard.locator('.delete-btn').click();
    await this.waitForLoadingComplete();
  }

  /**
   * 案件のチケット一覧を開く
   */
  async viewProjectTodos(index: number = 0): Promise<void> {
    const projectCard = this.projectCards.nth(index);
    await projectCard.locator('.view-btn').click();
  }

  /**
   * 案件なしのチケット一覧を開く
   */
  async viewNoProjectTodos(): Promise<void> {
    await this.noProjectCard.locator('.view-btn').click();
  }

  /**
   * 案件の件数を取得
   */
  async getProjectCount(): Promise<number> {
    return await this.projectCards.count();
  }

  /**
   * 特定の案件が存在することを確認
   */
  async expectProjectExists(name: string): Promise<void> {
    await expect(this.projectCards.filter({ hasText: name })).toHaveCount(1);
  }

  /**
   * 特定の案件が存在しないことを確認
   */
  async expectProjectNotExists(name: string): Promise<void> {
    await expect(this.projectCards.filter({ hasText: name })).toHaveCount(0);
  }

  /**
   * 案件の進捗を取得
   */
  async getProjectStats(index: number = 0): Promise<{
    total: number;
    completed: number;
    progressRate: number;
  }> {
    const projectCard = this.projectCards.nth(index);
    const statsText = await projectCard.locator('.stats').textContent() || '';

    // "チケット: 2件 / 完了: 1件 / 進捗: 50%" 形式をパース
    const totalMatch = statsText.match(/チケット:\s*(\d+)件/);
    const completedMatch = statsText.match(/完了:\s*(\d+)件/);
    const progressMatch = statsText.match(/進捗:\s*(\d+)%/);

    return {
      total: totalMatch ? parseInt(totalMatch[1]) : 0,
      completed: completedMatch ? parseInt(completedMatch[1]) : 0,
      progressRate: progressMatch ? parseInt(progressMatch[1]) : 0,
    };
  }

  /**
   * 案件なしカードの統計を取得
   */
  async getNoProjectStats(): Promise<{ total: number; completed: number }> {
    const totalText = await this.noProjectCard.locator('#no-project-total').textContent() || '0';
    const completedText = await this.noProjectCard.locator('#no-project-completed').textContent() || '0';

    return {
      total: parseInt(totalText),
      completed: parseInt(completedText),
    };
  }

  /**
   * フォームがクリアされていることを確認
   */
  async expectFormCleared(): Promise<void> {
    await expect(this.projectNameInput).toHaveValue('');
    await expect(this.projectDescriptionInput).toHaveValue('');
  }

  /**
   * ユーザー管理画面へ遷移
   */
  async navigateToUserManagement(): Promise<void> {
    await this.userManagementLink.click();
  }

  /**
   * ホームへ遷移
   */
  async navigateToHome(): Promise<void> {
    await this.homeLink.click();
  }
}
