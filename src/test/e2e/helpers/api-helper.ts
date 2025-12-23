import { APIRequestContext, expect } from '@playwright/test';

/**
 * ユーザーデータ型
 */
export interface User {
  id: number;
  name: string;
  createdAt?: string;
}

/**
 * 案件データ型
 */
export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

/**
 * ToDoデータ型
 */
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  projectId?: number;
  assigneeId?: number;
  assigneeName?: string;
  startDate?: string;
  dueDate?: string;
  createdAt?: string;
}

/**
 * APIヘルパー
 * テストデータのセットアップ・クリーンアップに使用
 */
export class ApiHelper {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = 'http://localhost:8080') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  // ===================
  // ユーザー関連
  // ===================

  /**
   * ユーザーを作成
   */
  async createUser(name: string): Promise<User> {
    const response = await this.request.post(`${this.baseUrl}/api/users`, {
      data: { name },
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * ユーザー一覧を取得
   */
  async getUsers(): Promise<User[]> {
    const response = await this.request.get(`${this.baseUrl}/api/users`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * ユーザーを削除
   */
  async deleteUser(id: number): Promise<void> {
    const response = await this.request.delete(`${this.baseUrl}/api/users/${id}`);
    expect(response.ok()).toBeTruthy();
  }

  /**
   * 全ユーザーを削除
   */
  async deleteAllUsers(): Promise<void> {
    const users = await this.getUsers();
    for (const user of users) {
      await this.request.delete(`${this.baseUrl}/api/users/${user.id}`);
    }
  }

  // ===================
  // 案件関連
  // ===================

  /**
   * 案件を作成
   */
  async createProject(name: string, description?: string): Promise<Project> {
    const response = await this.request.post(`${this.baseUrl}/api/projects`, {
      data: { name, description },
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * 案件一覧を取得
   */
  async getProjects(): Promise<Project[]> {
    const response = await this.request.get(`${this.baseUrl}/api/projects`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * 案件を削除
   */
  async deleteProject(id: number): Promise<void> {
    const response = await this.request.delete(`${this.baseUrl}/api/projects/${id}`);
    expect(response.ok()).toBeTruthy();
  }

  /**
   * 全案件を削除
   */
  async deleteAllProjects(): Promise<void> {
    const projects = await this.getProjects();
    for (const project of projects) {
      await this.request.delete(`${this.baseUrl}/api/projects/${project.id}`);
    }
  }

  // ===================
  // ToDo関連
  // ===================

  /**
   * ToDoを作成
   */
  async createTodo(options: {
    title: string;
    description?: string;
    projectId?: number;
    assigneeId?: number;
    startDate?: string;
    dueDate?: string;
  }): Promise<Todo> {
    const response = await this.request.post(`${this.baseUrl}/api/todos`, {
      data: options,
    });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * ToDo一覧を取得
   */
  async getTodos(projectId?: string): Promise<Todo[]> {
    let url = `${this.baseUrl}/api/todos`;
    if (projectId) {
      url += `?projectId=${projectId}`;
    }
    const response = await this.request.get(url);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * ToDoを削除
   */
  async deleteTodo(id: number): Promise<void> {
    const response = await this.request.delete(`${this.baseUrl}/api/todos/${id}`);
    expect(response.ok()).toBeTruthy();
  }

  /**
   * ToDoの完了状態を切り替え
   */
  async toggleTodo(id: number): Promise<Todo> {
    const response = await this.request.patch(`${this.baseUrl}/api/todos/${id}/toggle`);
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  /**
   * 全ToDoを削除
   */
  async deleteAllTodos(): Promise<void> {
    const todos = await this.getTodos();
    for (const todo of todos) {
      await this.request.delete(`${this.baseUrl}/api/todos/${todo.id}`);
    }
  }

  // ===================
  // クリーンアップ
  // ===================

  /**
   * テストデータを全てクリア
   * 依存関係を考慮した順序で削除
   */
  async clearAllData(): Promise<void> {
    // ToDoを先に削除（案件・ユーザーに依存）
    await this.deleteAllTodos();
    // 次に案件を削除
    await this.deleteAllProjects();
    // 最後にユーザーを削除
    await this.deleteAllUsers();
  }

  // ===================
  // テストデータセットアップ
  // ===================

  /**
   * 基本的なテストデータをセットアップ
   * - ユーザー2名
   * - 案件2件
   * - ToDo4件（各案件に2件ずつ、うち1件は完了）
   */
  async setupBasicTestData(): Promise<{
    users: User[];
    projects: Project[];
    todos: Todo[];
  }> {
    // ユーザー作成
    const user1 = await this.createUser('テストユーザー1');
    const user2 = await this.createUser('テストユーザー2');

    // 案件作成
    const project1 = await this.createProject('テスト案件1', '案件1の説明');
    const project2 = await this.createProject('テスト案件2', '案件2の説明');

    // ToDo作成
    const todo1 = await this.createTodo({
      title: 'タスク1-1',
      description: '案件1のタスク1',
      projectId: project1.id,
      assigneeId: user1.id,
    });
    const todo2 = await this.createTodo({
      title: 'タスク1-2',
      description: '案件1のタスク2（完了）',
      projectId: project1.id,
      assigneeId: user2.id,
    });
    await this.toggleTodo(todo2.id); // 完了にする

    const todo3 = await this.createTodo({
      title: 'タスク2-1',
      description: '案件2のタスク1',
      projectId: project2.id,
      assigneeId: user1.id,
    });
    const todo4 = await this.createTodo({
      title: 'タスク2-2',
      description: '案件2のタスク2（完了）',
      projectId: project2.id,
      assigneeId: user2.id,
    });
    await this.toggleTodo(todo4.id); // 完了にする

    return {
      users: [user1, user2],
      projects: [project1, project2],
      todos: [todo1, todo2, todo3, todo4],
    };
  }
}
