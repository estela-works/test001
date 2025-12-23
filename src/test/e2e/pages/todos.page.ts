import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ToDo管理画面ページオブジェクト
 * 画面ID: SCR-TODOS-001
 */
export class TodosPage extends BasePage {
  protected readonly url = '/todos.html';

  // === 入力要素 ===
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly startDateInput: Locator;
  readonly dueDateInput: Locator;
  readonly assigneeSelect: Locator;
  readonly addButton: Locator;

  // === フィルタボタン ===
  readonly allFilterButton: Locator;
  readonly pendingFilterButton: Locator;
  readonly completedFilterButton: Locator;

  // === 統計 ===
  readonly totalCount: Locator;
  readonly completedCount: Locator;
  readonly pendingCount: Locator;

  // === リスト ===
  readonly todoList: Locator;
  readonly todoItems: Locator;

  // === その他 ===
  readonly projectName: Locator;
  readonly backLink: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // 入力要素の初期化
    this.titleInput = page.locator('#title-input');
    this.descriptionInput = page.locator('#description-input');
    this.startDateInput = page.locator('#start-date-input');
    this.dueDateInput = page.locator('#due-date-input');
    this.assigneeSelect = page.locator('#assignee-input');
    this.addButton = page.locator('.add-todo button');

    // フィルタボタンの初期化
    this.allFilterButton = page.locator('#all-btn');
    this.pendingFilterButton = page.locator('#pending-btn');
    this.completedFilterButton = page.locator('#completed-btn');

    // 統計の初期化
    this.totalCount = page.locator('#total-count');
    this.completedCount = page.locator('#completed-count');
    this.pendingCount = page.locator('#pending-count');

    // リストの初期化
    this.todoList = page.locator('#todo-list');
    this.todoItems = page.locator('.todo-item');

    // その他
    this.projectName = page.locator('#project-name');
    this.backLink = page.locator('.back-link a');
    this.errorMessage = page.locator('#error-message');
    this.loadingIndicator = page.locator('#loading');
  }

  /**
   * 案件IDを指定してページを開く
   */
  async gotoWithProject(projectId: string | number): Promise<void> {
    await this.goto({ projectId: String(projectId) });
    await this.waitForLoadingComplete();
  }

  /**
   * ToDoを追加
   */
  async addTodo(options: {
    title: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    assigneeIndex?: number;
  }): Promise<void> {
    // タイトルを入力
    await this.titleInput.fill(options.title);

    // 説明を入力（オプション）
    if (options.description) {
      await this.descriptionInput.fill(options.description);
    }

    // 開始日を入力（オプション）
    if (options.startDate) {
      await this.startDateInput.fill(options.startDate);
    }

    // 終了日を入力（オプション）
    if (options.dueDate) {
      await this.dueDateInput.fill(options.dueDate);
    }

    // 担当者を選択（オプション）
    if (options.assigneeIndex !== undefined) {
      const options_list = await this.assigneeSelect.locator('option').all();
      if (options_list.length > options.assigneeIndex + 1) {
        await this.assigneeSelect.selectOption({ index: options.assigneeIndex + 1 });
      }
    }

    // 追加ボタンをクリック
    await this.addButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * ToDoの完了状態を切り替え
   */
  async toggleTodo(index: number = 0): Promise<void> {
    const todoItem = this.todoItems.nth(index);
    await todoItem.locator('.toggle-btn').click();
    await this.waitForLoadingComplete();
  }

  /**
   * ToDoを削除
   */
  async deleteTodo(index: number = 0, confirm: boolean = true): Promise<void> {
    const todoItem = this.todoItems.nth(index);
    await this.handleConfirmDialog(confirm);
    await todoItem.locator('.delete-btn').click();
    await this.waitForLoadingComplete();
  }

  /**
   * フィルタを適用
   */
  async applyFilter(filter: 'all' | 'pending' | 'completed'): Promise<void> {
    switch (filter) {
      case 'all':
        await this.allFilterButton.click();
        break;
      case 'pending':
        await this.pendingFilterButton.click();
        break;
      case 'completed':
        await this.completedFilterButton.click();
        break;
    }
  }

  /**
   * 統計を取得
   */
  async getStats(): Promise<{ total: number; completed: number; pending: number }> {
    return {
      total: parseInt(await this.totalCount.textContent() || '0'),
      completed: parseInt(await this.completedCount.textContent() || '0'),
      pending: parseInt(await this.pendingCount.textContent() || '0'),
    };
  }

  /**
   * ToDoの件数を取得
   */
  async getTodoCount(): Promise<number> {
    return await this.todoItems.count();
  }

  /**
   * 完了済みToDoの件数を取得
   */
  async getCompletedTodoCount(): Promise<number> {
    return await this.todoItems.filter({ has: this.page.locator('.completed') }).count();
  }

  /**
   * 特定のToDoが存在することを確認
   */
  async expectTodoExists(title: string): Promise<void> {
    await expect(this.todoItems.filter({ hasText: title })).toHaveCount(1);
  }

  /**
   * 特定のToDoが存在しないことを確認
   */
  async expectTodoNotExists(title: string): Promise<void> {
    await expect(this.todoItems.filter({ hasText: title })).toHaveCount(0);
  }

  /**
   * 特定のToDoが完了状態であることを確認
   */
  async expectTodoCompleted(index: number = 0): Promise<void> {
    await expect(this.todoItems.nth(index)).toHaveClass(/completed/);
  }

  /**
   * 特定のToDoが未完了状態であることを確認
   */
  async expectTodoNotCompleted(index: number = 0): Promise<void> {
    await expect(this.todoItems.nth(index)).not.toHaveClass(/completed/);
  }

  /**
   * フォームがクリアされていることを確認
   */
  async expectFormCleared(): Promise<void> {
    await expect(this.titleInput).toHaveValue('');
    await expect(this.descriptionInput).toHaveValue('');
    await expect(this.startDateInput).toHaveValue('');
    await expect(this.dueDateInput).toHaveValue('');
  }

  /**
   * フィルタボタンがアクティブであることを確認
   */
  async expectFilterActive(filter: 'all' | 'pending' | 'completed'): Promise<void> {
    const buttons = {
      all: this.allFilterButton,
      pending: this.pendingFilterButton,
      completed: this.completedFilterButton,
    };
    await expect(buttons[filter]).toHaveClass(/active/);
  }
}
