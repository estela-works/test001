import { Page, Locator, expect } from '@playwright/test';

/**
 * 基底ページクラス
 * すべてのページオブジェクトの共通機能を提供
 */
export abstract class BasePage {
  protected page: Page;
  protected abstract readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * ページを開く
   */
  async goto(params?: Record<string, string>): Promise<void> {
    let url = this.url;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url = `${url}?${queryString}`;
    }
    await this.page.goto(url);
  }

  /**
   * ローディング完了を待機
   */
  async waitForLoadingComplete(): Promise<void> {
    const loading = this.page.locator('#loading, .loading');
    await loading.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * エラーメッセージを取得
   */
  async getErrorMessage(): Promise<string | null> {
    const errorLocator = this.page.locator('#error-message, .error');
    if (await errorLocator.isVisible()) {
      return await errorLocator.textContent();
    }
    return null;
  }

  /**
   * エラーメッセージが表示されていることを確認
   */
  async expectErrorMessage(expectedText: string): Promise<void> {
    const errorLocator = this.page.locator('#error-message, .error');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(expectedText);
  }

  /**
   * エラーメッセージが表示されていないことを確認
   */
  async expectNoErrorMessage(): Promise<void> {
    const errorLocator = this.page.locator('#error-message, .error');
    await expect(errorLocator).toBeHidden();
  }

  /**
   * 確認ダイアログを処理（Accept）
   */
  async acceptConfirmDialog(): Promise<void> {
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });
  }

  /**
   * 確認ダイアログを処理（Dismiss）
   */
  async dismissConfirmDialog(): Promise<void> {
    this.page.once('dialog', async dialog => {
      await dialog.dismiss();
    });
  }

  /**
   * 確認ダイアログを処理
   * @param accept true: OK, false: キャンセル
   */
  async handleConfirmDialog(accept: boolean = true): Promise<void> {
    this.page.once('dialog', async dialog => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * ページがURLに遷移したことを確認
   */
  async expectUrl(urlPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlPattern);
  }

  /**
   * セレクタ優先順位に従って要素を取得
   * 優先順位: #id > [name] > [placeholder] > .class > button:has-text()
   */
  protected getLocator(
    primarySelector: string,
    altSelectors?: string[]
  ): Locator {
    // 将来的にはaltSelectorsを使ったフォールバック処理も可能
    return this.page.locator(primarySelector);
  }

  /**
   * Vue.js用のdata-testid セレクタを優先的に使用
   * （現行HTML用セレクタにフォールバック）
   */
  protected getVueAwareLocator(
    vueSelector: string,
    fallbackSelector: string
  ): Locator {
    // Vue移行後は vueSelector を優先
    // 現時点では fallbackSelector を使用
    return this.page.locator(fallbackSelector);
  }

  /**
   * 要素が表示されるまで待機してからクリック
   */
  protected async waitAndClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * 入力フィールドをクリアして入力
   */
  protected async clearAndFill(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * リスト要素の件数を取得
   */
  protected async getItemCount(locator: Locator): Promise<number> {
    return await locator.count();
  }
}
