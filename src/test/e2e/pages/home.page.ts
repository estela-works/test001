import { Page, Locator } from '@playwright/test';

/**
 * ホーム画面ページオブジェクト
 * 画面ID: SC-001
 *
 * Vue.js SPA対応版
 */
export class HomePage {
  readonly page: Page;

  // ヘッダー要素
  readonly title: Locator;
  readonly subtitle: Locator;

  // ナビゲーションカード
  readonly todoCard: Locator;
  readonly projectCard: Locator;
  readonly userCard: Locator;

  // フッター
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;

    // ヘッダー（Vue: .page-header）
    this.title = page.locator('.page-header h1');
    this.subtitle = page.locator('.page-header .subtitle');

    // ナビゲーションカード（Vue: router-link with colorClass）
    this.todoCard = page.locator('.nav-card.card-todo');
    this.projectCard = page.locator('.nav-card.card-project');
    this.userCard = page.locator('.nav-card.card-user');

    // フッター
    this.footer = page.locator('.footer');
  }

  /**
   * ホーム画面に遷移
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * チケット管理カードをクリック
   */
  async clickTodoCard() {
    await this.todoCard.click();
  }

  /**
   * 案件管理カードをクリック
   */
  async clickProjectCard() {
    await this.projectCard.click();
  }

  /**
   * ユーザー管理カードをクリック
   */
  async clickUserCard() {
    await this.userCard.click();
  }

  /**
   * カードのタイトルを取得
   */
  async getCardTitle(card: 'todo' | 'project' | 'user'): Promise<string> {
    const cardLocator = {
      todo: this.todoCard,
      project: this.projectCard,
      user: this.userCard,
    }[card];
    return cardLocator.locator('h3').innerText();
  }

  /**
   * カードの説明を取得
   */
  async getCardDescription(card: 'todo' | 'project' | 'user'): Promise<string> {
    const cardLocator = {
      todo: this.todoCard,
      project: this.projectCard,
      user: this.userCard,
    }[card];
    return cardLocator.locator('.card-content p').innerText();
  }
}
