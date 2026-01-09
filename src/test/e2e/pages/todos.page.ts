import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ToDo管理画面ページオブジェクト
 * 画面ID: SCR-TODOS-001
 *
 * Vue.js SPA対応版
 */
export class TodosPage extends BasePage {
  protected readonly url = '/todos';

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
  readonly statsContainer: Locator;

  // === リスト ===
  readonly todoList: Locator;
  readonly todoItems: Locator;

  // === その他 ===
  readonly projectName: Locator;
  readonly backLink: Locator;
  readonly errorMessage: Locator;
  readonly loadingIndicator: Locator;

  // === モーダル関連 ===
  readonly modalOverlay: Locator;
  readonly modalContainer: Locator;
  readonly modalCloseButton: Locator;
  readonly modalEditButton: Locator;
  readonly modalToggleButton: Locator;

  // === 編集フォーム関連 ===
  readonly editTitleInput: Locator;
  readonly editDescriptionInput: Locator;
  readonly editStartDateInput: Locator;
  readonly editDueDateInput: Locator;
  readonly editAssigneeSelect: Locator;
  readonly editSaveButton: Locator;
  readonly editCancelButton: Locator;
  readonly editErrorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // 入力要素の初期化（Vue: TodoForm.vue）
    this.titleInput = page.locator('.add-todo input[type="text"]');
    this.descriptionInput = page.locator('.add-todo textarea');
    this.startDateInput = page.locator('.add-todo .date-field:first-child input[type="date"]');
    this.dueDateInput = page.locator('.add-todo .date-field:last-child input[type="date"]');
    this.assigneeSelect = page.locator('.add-todo .assignee-field select');
    this.addButton = page.locator('.add-todo button.btn-primary');

    // フィルタボタンの初期化（Vue: TodoFilter.vue）
    this.allFilterButton = page.locator('.filter-buttons button:has-text("すべて")');
    this.pendingFilterButton = page.locator('.filter-buttons button:has-text("未完了")');
    this.completedFilterButton = page.locator('.filter-buttons button:has-text("完了済み")');

    // 統計の初期化（Vue: TodoStats.vue）
    this.statsContainer = page.locator('.stats');

    // リストの初期化（Vue: TodoItem.vue）
    this.todoList = page.locator('.todo-list');
    this.todoItems = page.locator('.todo-item');

    // その他
    this.projectName = page.locator('.project-subtitle');
    this.backLink = page.locator('.back-link a');
    this.errorMessage = page.locator('.error');
    this.loadingIndicator = page.locator('.loading');

    // モーダル関連（TodoDetailModal.vue）
    this.modalOverlay = page.locator('.modal-overlay');
    this.modalContainer = page.locator('.modal-container');
    this.modalCloseButton = page.locator('.close-button');
    this.modalEditButton = page.locator('.btn-edit');
    this.modalToggleButton = page.locator('.btn-toggle');

    // 編集フォーム関連（TodoEditForm.vue）
    this.editTitleInput = page.locator('#edit-title');
    this.editDescriptionInput = page.locator('#edit-description');
    this.editStartDateInput = page.locator('#edit-startDate');
    this.editDueDateInput = page.locator('#edit-dueDate');
    this.editAssigneeSelect = page.locator('#edit-assignee');
    this.editSaveButton = page.locator('.btn-save');
    this.editCancelButton = page.locator('.btn-cancel');
    this.editErrorMessage = page.locator('.edit-form .error-message');
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
   * 統計を取得（Vue: TodoStats.vue）
   */
  async getStats(): Promise<{ total: number; completed: number; pending: number }> {
    const statsText = await this.statsContainer.textContent() || '';

    // "総数: X 完了: Y 未完了: Z" 形式をパース
    const totalMatch = statsText.match(/総数:\s*(\d+)/);
    const completedMatch = statsText.match(/完了:\s*(\d+)/);
    const pendingMatch = statsText.match(/未完了:\s*(\d+)/);

    return {
      total: totalMatch ? parseInt(totalMatch[1]) : 0,
      completed: completedMatch ? parseInt(completedMatch[1]) : 0,
      pending: pendingMatch ? parseInt(pendingMatch[1]) : 0,
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

  /**
   * 案件一覧へ戻る
   */
  async navigateToProjects(): Promise<void> {
    await this.backLink.click();
  }

  // === チケット詳細モーダル関連メソッド ===

  /**
   * チケット詳細モーダルを開く
   */
  async openTodoDetail(index: number = 0): Promise<void> {
    const todoItem = this.todoItems.nth(index);
    // ToDoアイテムのカードのタイトル（h3）をクリック（actionsボタンを避ける）
    await todoItem.locator('h3').click();
    await expect(this.modalOverlay).toBeVisible();
  }

  /**
   * チケット詳細モーダルを閉じる
   */
  async closeTodoDetail(): Promise<void> {
    await this.modalCloseButton.click();
    await expect(this.modalOverlay).not.toBeVisible();
  }

  /**
   * 編集モードに切り替える
   */
  async enterEditMode(): Promise<void> {
    await this.modalEditButton.click();
    await expect(this.editTitleInput).toBeVisible();
  }

  /**
   * 編集をキャンセルする
   */
  async cancelEdit(): Promise<void> {
    await this.editCancelButton.click();
    await expect(this.editTitleInput).not.toBeVisible();
    await expect(this.modalEditButton).toBeVisible();
  }

  /**
   * チケットを編集して保存する
   */
  async editTodo(options: {
    title?: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    assigneeId?: number | null;
  }): Promise<void> {
    // タイトルを編集
    if (options.title !== undefined) {
      await this.editTitleInput.clear();
      await this.editTitleInput.fill(options.title);
    }

    // 説明を編集
    if (options.description !== undefined) {
      await this.editDescriptionInput.clear();
      await this.editDescriptionInput.fill(options.description);
    }

    // 開始日を編集
    if (options.startDate !== undefined) {
      await this.editStartDateInput.fill(options.startDate);
    }

    // 期限日を編集
    if (options.dueDate !== undefined) {
      await this.editDueDateInput.fill(options.dueDate);
    }

    // 担当者を編集
    if (options.assigneeId !== undefined) {
      if (options.assigneeId === null) {
        await this.editAssigneeSelect.selectOption({ value: '' });
      } else {
        await this.editAssigneeSelect.selectOption({ value: String(options.assigneeId) });
      }
    }

    // 保存
    await this.editSaveButton.click();
    await this.waitForLoadingComplete();
  }

  /**
   * モーダルが表示されていることを確認
   */
  async expectModalVisible(): Promise<void> {
    await expect(this.modalOverlay).toBeVisible();
  }

  /**
   * モーダルが非表示であることを確認
   */
  async expectModalHidden(): Promise<void> {
    await expect(this.modalOverlay).not.toBeVisible();
  }

  /**
   * 編集モードであることを確認
   */
  async expectInEditMode(): Promise<void> {
    await expect(this.editTitleInput).toBeVisible();
    await expect(this.editSaveButton).toBeVisible();
    await expect(this.editCancelButton).toBeVisible();
  }

  /**
   * 表示モードであることを確認
   */
  async expectInViewMode(): Promise<void> {
    await expect(this.editTitleInput).not.toBeVisible();
    await expect(this.modalEditButton).toBeVisible();
  }

  /**
   * 編集フォームにエラーメッセージが表示されていることを確認
   */
  async expectEditError(message: string): Promise<void> {
    await expect(this.editErrorMessage).toContainText(message);
  }

  /**
   * 保存ボタンが無効化されていることを確認
   */
  async expectSaveButtonDisabled(): Promise<void> {
    await expect(this.editSaveButton).toBeDisabled();
  }

  /**
   * 保存ボタンが有効であることを確認
   */
  async expectSaveButtonEnabled(): Promise<void> {
    await expect(this.editSaveButton).toBeEnabled();
  }

  /**
   * モーダル内のチケット情報を確認
   */
  async expectTodoDetailContains(text: string): Promise<void> {
    await expect(this.modalContainer).toContainText(text);
  }
}
