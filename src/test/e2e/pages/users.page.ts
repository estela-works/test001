import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ユーザー管理画面ページオブジェクト
 * 画面ID: SCR-USERS-001
 */
export class UsersPage extends BasePage {
  protected readonly url = '/users.html';

  // === 入力要素 ===
  readonly nameInput: Locator;
  readonly addUserButton: Locator;

  // === 統計 ===
  readonly userCount: Locator;

  // === リスト ===
  readonly userList: Locator;
  readonly userCards: Locator;

  // === その他 ===
  readonly backLink: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // 入力要素の初期化
    this.nameInput = page.locator('#name-input');
    this.addUserButton = page.locator('.add-form button');

    // 統計の初期化
    this.userCount = page.locator('#user-count');

    // リストの初期化
    this.userList = page.locator('#user-list');
    this.userCards = page.locator('.user-card');

    // その他
    this.backLink = page.locator('.back-link a');
    this.errorMessage = page.locator('#error-message');
    this.loadingIndicator = page.locator('#loading');
  }

  /**
   * ユーザーを追加
   */
  async addUser(name: string): Promise<void> {
    // ユーザー名を入力
    await this.nameInput.fill(name);

    // 追加ボタンをクリック
    await this.addUserButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * ユーザーを削除
   */
  async deleteUser(index: number = 0, confirm: boolean = true): Promise<void> {
    const userCard = this.userCards.nth(index);
    await this.handleConfirmDialog(confirm);
    await userCard.locator('.delete-btn').click();
    await this.waitForLoadingComplete();
  }

  /**
   * 特定の名前のユーザーを削除
   */
  async deleteUserByName(name: string, confirm: boolean = true): Promise<void> {
    const userCard = this.userCards.filter({ hasText: name });
    await this.handleConfirmDialog(confirm);
    await userCard.locator('.delete-btn').click();
    await this.waitForLoadingComplete();
  }

  /**
   * ユーザーの件数を取得
   */
  async getUserCount(): Promise<number> {
    return await this.userCards.count();
  }

  /**
   * 統計のユーザー数を取得
   */
  async getStatsUserCount(): Promise<number> {
    const text = await this.userCount.textContent() || '0';
    return parseInt(text);
  }

  /**
   * 特定のユーザーが存在することを確認
   */
  async expectUserExists(name: string): Promise<void> {
    await expect(this.userCards.filter({ hasText: name })).toHaveCount(1);
  }

  /**
   * 特定のユーザーが存在しないことを確認
   */
  async expectUserNotExists(name: string): Promise<void> {
    await expect(this.userCards.filter({ hasText: name })).toHaveCount(0);
  }

  /**
   * フォームがクリアされていることを確認
   */
  async expectFormCleared(): Promise<void> {
    await expect(this.nameInput).toHaveValue('');
  }

  /**
   * 空の状態メッセージが表示されていることを確認
   */
  async expectEmptyMessage(): Promise<void> {
    await expect(this.page.locator('#user-list p')).toContainText('ユーザーが登録されていません');
  }

  /**
   * 案件一覧画面へ遷移
   */
  async navigateToProjects(): Promise<void> {
    await this.backLink.click();
  }
}
