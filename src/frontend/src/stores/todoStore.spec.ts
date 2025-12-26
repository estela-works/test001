import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from './todoStore'
import * as todoService from '@/services/todoService'
import type { Todo } from '@/types'

vi.mock('@/services/todoService')

// テスト用のTodoを作成するヘルパー関数
function createMockTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 1,
    title: 'タスク',
    description: null,
    completed: false,
    startDate: null,
    dueDate: null,
    projectId: null,
    assigneeId: null,
    assigneeName: null,
    createdAt: '',
    ...overrides
  }
}

describe('todoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('初期状態', () => {
    it('初期状態が正しく設定されている', () => {
      const store = useTodoStore()

      expect(store.todos).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.filter).toBe('all')
      expect(store.currentProjectId).toBeNull()
    })
  })

  describe('getters', () => {
    describe('filteredTodos', () => {
      it('filter=allの場合、すべてのToDoを返す', () => {
        const store = useTodoStore()
        store.todos = [
          createMockTodo({ id: 1, title: 'タスク1', completed: false }),
          createMockTodo({ id: 2, title: 'タスク2', completed: true })
        ]
        store.filter = 'all'

        expect(store.filteredTodos).toHaveLength(2)
      })

      it('filter=pendingの場合、未完了のToDoのみを返す', () => {
        const store = useTodoStore()
        store.todos = [
          createMockTodo({ id: 1, title: 'タスク1', completed: false }),
          createMockTodo({ id: 2, title: 'タスク2', completed: true })
        ]
        store.filter = 'pending'

        expect(store.filteredTodos).toHaveLength(1)
        expect(store.filteredTodos[0].completed).toBe(false)
      })

      it('filter=completedの場合、完了済みのToDoのみを返す', () => {
        const store = useTodoStore()
        store.todos = [
          createMockTodo({ id: 1, title: 'タスク1', completed: false }),
          createMockTodo({ id: 2, title: 'タスク2', completed: true })
        ]
        store.filter = 'completed'

        expect(store.filteredTodos).toHaveLength(1)
        expect(store.filteredTodos[0].completed).toBe(true)
      })
    })

    describe('stats', () => {
      it('統計情報を正しく計算する', () => {
        const store = useTodoStore()
        store.todos = [
          createMockTodo({ id: 1, title: 'タスク1', completed: false }),
          createMockTodo({ id: 2, title: 'タスク2', completed: true }),
          createMockTodo({ id: 3, title: 'タスク3', completed: false })
        ]

        expect(store.stats).toEqual({
          total: 3,
          completed: 1,
          pending: 2
        })
      })

      it('ToDoがない場合、すべて0を返す', () => {
        const store = useTodoStore()
        store.todos = []

        expect(store.stats).toEqual({
          total: 0,
          completed: 0,
          pending: 0
        })
      })
    })
  })

  describe('actions', () => {
    describe('fetchTodos', () => {
      it('ToDoリストを取得して状態を更新する', async () => {
        const mockTodos = [createMockTodo({ id: 1, title: 'テストタスク', createdAt: '2025-01-01' })]
        vi.mocked(todoService.getAll).mockResolvedValue(mockTodos)

        const store = useTodoStore()
        await store.fetchTodos()

        expect(store.todos).toEqual(mockTodos)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('projectIdを指定してToDoを取得する', async () => {
        vi.mocked(todoService.getAll).mockResolvedValue([])

        const store = useTodoStore()
        await store.fetchTodos('123')

        expect(todoService.getAll).toHaveBeenCalledWith('123')
        expect(store.currentProjectId).toBe('123')
      })

      it('エラー時にエラーメッセージを設定する', async () => {
        vi.mocked(todoService.getAll).mockRejectedValue(new Error('API Error'))

        const store = useTodoStore()

        await expect(store.fetchTodos()).rejects.toThrow()
        expect(store.error).toBe('ToDoリストの読み込みに失敗しました')
        expect(store.loading).toBe(false)
      })
    })

    describe('addTodo', () => {
      it('新しいToDoを追加してリストを更新する', async () => {
        vi.mocked(todoService.create).mockResolvedValue(createMockTodo())
        vi.mocked(todoService.getAll).mockResolvedValue([])

        const store = useTodoStore()
        await store.addTodo({ title: '新しいタスク' })

        expect(todoService.create).toHaveBeenCalledWith({ title: '新しいタスク' })
        expect(todoService.getAll).toHaveBeenCalled()
      })

      it('エラー時にエラーメッセージを設定する', async () => {
        vi.mocked(todoService.create).mockRejectedValue(new Error('API Error'))

        const store = useTodoStore()

        await expect(store.addTodo({ title: 'テスト' })).rejects.toThrow()
        expect(store.error).toBe('ToDoの追加に失敗しました')
      })
    })

    describe('toggleTodo', () => {
      it('ToDoの完了状態を切り替える', async () => {
        vi.mocked(todoService.toggle).mockResolvedValue(createMockTodo({ completed: true }))
        vi.mocked(todoService.getAll).mockResolvedValue([])

        const store = useTodoStore()
        await store.toggleTodo(1)

        expect(todoService.toggle).toHaveBeenCalledWith(1)
      })
    })

    describe('deleteTodo', () => {
      it('ToDoを削除する', async () => {
        vi.mocked(todoService.delete).mockResolvedValue(undefined)
        vi.mocked(todoService.getAll).mockResolvedValue([])

        const store = useTodoStore()
        await store.deleteTodo(1)

        expect(todoService.delete).toHaveBeenCalledWith(1)
      })
    })

    describe('setFilter', () => {
      it('フィルターを変更する', () => {
        const store = useTodoStore()

        store.setFilter('pending')
        expect(store.filter).toBe('pending')

        store.setFilter('completed')
        expect(store.filter).toBe('completed')

        store.setFilter('all')
        expect(store.filter).toBe('all')
      })
    })

    describe('clearError', () => {
      it('エラーをクリアする', () => {
        const store = useTodoStore()
        store.error = 'テストエラー'

        store.clearError()

        expect(store.error).toBeNull()
      })
    })
  })
})
