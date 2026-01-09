import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TodoEditForm from './TodoEditForm.vue'
import type { Todo, User } from '@/types'

// テスト用のTodoを作成するヘルパー関数
function createMockTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 1,
    title: 'テストタスク',
    description: 'テスト説明',
    completed: false,
    startDate: '2026-01-01',
    dueDate: '2026-01-31',
    projectId: null,
    assigneeId: 1,
    assigneeName: '山田太郎',
    createdAt: '2026-01-08T10:00:00',
    ...overrides
  }
}

// テスト用のユーザー一覧
const mockUsers: User[] = [
  { id: 1, name: '山田太郎', createdAt: '2026-01-01T00:00:00' },
  { id: 2, name: '鈴木花子', createdAt: '2026-01-01T00:00:00' }
]

describe('TodoEditForm', () => {
  describe('初期表示', () => {
    it('todoの値でフォームが初期化される', () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const titleInput = wrapper.find('#edit-title')
      const descriptionInput = wrapper.find('#edit-description')
      const startDateInput = wrapper.find('#edit-startDate')
      const dueDateInput = wrapper.find('#edit-dueDate')
      const assigneeSelect = wrapper.find('#edit-assignee')

      expect((titleInput.element as HTMLInputElement).value).toBe('テストタスク')
      expect((descriptionInput.element as HTMLTextAreaElement).value).toBe('テスト説明')
      expect((startDateInput.element as HTMLInputElement).value).toBe('2026-01-01')
      expect((dueDateInput.element as HTMLInputElement).value).toBe('2026-01-31')
      expect((assigneeSelect.element as HTMLSelectElement).value).toBe('1')
    })

    it('descriptionがnullの場合、空文字で初期化される', () => {
      const todo = createMockTodo({ description: null })
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const descriptionInput = wrapper.find('#edit-description')
      expect((descriptionInput.element as HTMLTextAreaElement).value).toBe('')
    })

    it('担当者セレクトにユーザー一覧が表示される', () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const options = wrapper.findAll('option')
      expect(options).toHaveLength(3) // 未割当 + 2ユーザー
      expect(options[0].text()).toBe('未割当')
      expect(options[1].text()).toBe('山田太郎')
      expect(options[2].text()).toBe('鈴木花子')
    })

    it('必須マークが表示される', () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const requiredMark = wrapper.find('.required')
      expect(requiredMark.exists()).toBe(true)
      expect(requiredMark.text()).toBe('*')
    })
  })

  describe('バリデーション', () => {
    it('タイトルが空の場合、エラーメッセージが表示される', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const titleInput = wrapper.find('#edit-title')
      await titleInput.setValue('')
      await flushPromises()

      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('タイトルを入力してください')
    })

    it('タイトルが空白のみの場合もエラーになる', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const titleInput = wrapper.find('#edit-title')
      await titleInput.setValue('   ')
      await flushPromises()

      const errorMessage = wrapper.find('.error-message')
      expect(errorMessage.exists()).toBe(true)
    })

    it('開始日が期限日より後の場合、エラーメッセージが表示される', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const startDateInput = wrapper.find('#edit-startDate')
      const dueDateInput = wrapper.find('#edit-dueDate')

      await startDateInput.setValue('2026-02-01')
      await dueDateInput.setValue('2026-01-01')
      await flushPromises()

      const errorMessages = wrapper.findAll('.error-message')
      const dateError = errorMessages.find(el => el.text().includes('開始日は期限日以前'))
      expect(dateError).toBeTruthy()
    })

    it('バリデーションエラーがある場合、保存ボタンが無効化される', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const titleInput = wrapper.find('#edit-title')
      await titleInput.setValue('')
      await flushPromises()

      const saveButton = wrapper.find('.btn-save')
      expect(saveButton.attributes('disabled')).toBeDefined()
    })

    it('有効な入力の場合、保存ボタンが有効になる', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      // 初期状態で有効なデータが設定されている
      await flushPromises()

      const saveButton = wrapper.find('.btn-save')
      expect(saveButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('イベント発火', () => {
    it('保存ボタンクリックでsaveイベントが発火する', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted('save')).toBeTruthy()
      const emittedData = wrapper.emitted('save')![0][0]
      expect(emittedData).toMatchObject({
        title: 'テストタスク',
        description: 'テスト説明',
        startDate: '2026-01-01',
        dueDate: '2026-01-31',
        assigneeId: 1
      })
    })

    it('フォーム送信時、タイトルの前後の空白がトリミングされる', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const titleInput = wrapper.find('#edit-title')
      await titleInput.setValue('  新しいタイトル  ')
      await flushPromises()

      await wrapper.find('form').trigger('submit.prevent')

      const emittedData = wrapper.emitted('save')![0][0]
      expect(emittedData.title).toBe('新しいタイトル')
    })

    it('説明が空の場合、undefinedが送信される', async () => {
      const todo = createMockTodo({ description: null })
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      await wrapper.find('form').trigger('submit.prevent')

      const emittedData = wrapper.emitted('save')![0][0]
      expect(emittedData.description).toBeUndefined()
    })

    it('キャンセルボタンクリックでcancelイベントが発火する', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const cancelButton = wrapper.find('.btn-cancel')
      await cancelButton.trigger('click')

      expect(wrapper.emitted('cancel')).toBeTruthy()
    })

    it('担当者を変更できる', async () => {
      const todo = createMockTodo({ assigneeId: 1 })
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const assigneeSelect = wrapper.find('#edit-assignee')
      await assigneeSelect.setValue('2')
      await wrapper.find('form').trigger('submit.prevent')

      const emittedData = wrapper.emitted('save')![0][0]
      expect(emittedData.assigneeId).toBe(2)
    })

    it('担当者を未割当に変更できる', async () => {
      // 未割当から開始するテスト
      const todo = createMockTodo({ assigneeId: null })
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      await wrapper.find('form').trigger('submit.prevent')

      const emittedData = wrapper.emitted('save')![0][0] as any
      expect(emittedData.assigneeId).toBeNull()
    })
  })

  describe('保存中の状態', () => {
    it('saving=trueの場合、フォーム要素が無効化される', () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: true
        }
      })

      const titleInput = wrapper.find('#edit-title')
      const descriptionInput = wrapper.find('#edit-description')
      const startDateInput = wrapper.find('#edit-startDate')
      const dueDateInput = wrapper.find('#edit-dueDate')
      const assigneeSelect = wrapper.find('#edit-assignee')
      const saveButton = wrapper.find('.btn-save')
      const cancelButton = wrapper.find('.btn-cancel')

      expect(titleInput.attributes('disabled')).toBeDefined()
      expect(descriptionInput.attributes('disabled')).toBeDefined()
      expect(startDateInput.attributes('disabled')).toBeDefined()
      expect(dueDateInput.attributes('disabled')).toBeDefined()
      expect(assigneeSelect.attributes('disabled')).toBeDefined()
      expect(saveButton.attributes('disabled')).toBeDefined()
      expect(cancelButton.attributes('disabled')).toBeDefined()
    })

    it('saving=trueの場合、保存ボタンに「保存中...」と表示される', () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: true
        }
      })

      const saveButton = wrapper.find('.btn-save')
      expect(saveButton.text()).toBe('保存中...')
    })

    it('saving=falseの場合、保存ボタンに「保存」と表示される', () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const saveButton = wrapper.find('.btn-save')
      expect(saveButton.text()).toBe('保存')
    })
  })

  describe('propsの変更', () => {
    it('todoが変更されるとフォームが再初期化される', async () => {
      const todo1 = createMockTodo({ title: 'タスク1' })
      const wrapper = mount(TodoEditForm, {
        props: {
          todo: todo1,
          users: mockUsers,
          saving: false
        }
      })

      const titleInput = wrapper.find('#edit-title')
      expect((titleInput.element as HTMLInputElement).value).toBe('タスク1')

      const todo2 = createMockTodo({ title: 'タスク2' })
      await wrapper.setProps({ todo: todo2 })
      await flushPromises()

      expect((titleInput.element as HTMLInputElement).value).toBe('タスク2')
    })
  })

  describe('日付の編集', () => {
    it('開始日のみを設定できる', async () => {
      const todo = createMockTodo({ startDate: null, dueDate: null })
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const startDateInput = wrapper.find('#edit-startDate')
      await startDateInput.setValue('2026-02-01')
      await wrapper.find('form').trigger('submit.prevent')

      const emittedData = wrapper.emitted('save')![0][0]
      expect(emittedData.startDate).toBe('2026-02-01')
      expect(emittedData.dueDate).toBeNull()
    })

    it('期限日のみを設定できる', async () => {
      const todo = createMockTodo({ startDate: null, dueDate: null })
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const dueDateInput = wrapper.find('#edit-dueDate')
      await dueDateInput.setValue('2026-02-28')
      await wrapper.find('form').trigger('submit.prevent')

      const emittedData = wrapper.emitted('save')![0][0]
      expect(emittedData.startDate).toBeNull()
      expect(emittedData.dueDate).toBe('2026-02-28')
    })

    it('開始日と期限日が同じでもエラーにならない', async () => {
      const todo = createMockTodo()
      const wrapper = mount(TodoEditForm, {
        props: {
          todo,
          users: mockUsers,
          saving: false
        }
      })

      const startDateInput = wrapper.find('#edit-startDate')
      const dueDateInput = wrapper.find('#edit-dueDate')

      await startDateInput.setValue('2026-02-01')
      await dueDateInput.setValue('2026-02-01')
      await flushPromises()

      const errorMessages = wrapper.findAll('.error-message')
      const dateError = errorMessages.find(el => el.text().includes('開始日は期限日以前'))
      expect(dateError).toBeFalsy()
    })
  })
})
