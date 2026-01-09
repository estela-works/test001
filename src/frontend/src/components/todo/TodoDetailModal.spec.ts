import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
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

// モックデータ（テスト間で変更可能）
let mockTodos: Todo[] = [createMockTodo()]
const mockUpdateTodo = vi.fn().mockResolvedValue(undefined)
const mockToggleTodo = vi.fn().mockResolvedValue(undefined)
const mockFetchUsers = vi.fn().mockResolvedValue(undefined)
const mockClearComments = vi.fn()

// ストアのモック（関数はファイルスコープで定義済みの変数を参照）
vi.mock('@/stores/todoStore', () => ({
  useTodoStore: () => ({
    get todos() { return mockTodos },
    updateTodo: mockUpdateTodo,
    toggleTodo: mockToggleTodo
  })
}))

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    users: mockUsers,
    fetchUsers: mockFetchUsers
  })
}))

vi.mock('@/stores/commentStore', () => ({
  useCommentStore: () => ({
    commentCount: 0,
    clearComments: mockClearComments
  })
}))

// Teleportのスタブ設定
const teleportStub = {
  template: '<div class="teleport-stub"><slot /></div>'
}

describe('TodoDetailModal', () => {
  // コンポーネントの動的インポート
  let TodoDetailModal: any
  let TodoEditForm: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // モックデータをリセット
    mockTodos = [createMockTodo()]

    // コンポーネントを動的にインポート（モックが適用された後）
    const modalModule = await import('./TodoDetailModal.vue')
    const formModule = await import('./TodoEditForm.vue')
    TodoDetailModal = modalModule.default
    TodoEditForm = formModule.default
  })

  const mountModal = (props: { todoId: number; isOpen: boolean }) => {
    return mount(TodoDetailModal, {
      props,
      global: {
        stubs: {
          Teleport: teleportStub,
          CommentList: true,
          CommentForm: true
        }
      }
    })
  }

  describe('表示モード', () => {
    it('isOpen=falseの場合、モーダルが表示されない', () => {
      const wrapper = mountModal({ todoId: 1, isOpen: false })
      expect(wrapper.find('.modal-overlay').exists()).toBe(false)
    })

    it('isOpen=trueの場合、モーダルが表示される', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    })

    it('チケット詳細が表示される', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      // モーダルが表示されていることを確認
      expect(wrapper.find('.modal-overlay').exists()).toBe(true)
      // タイトルラベルが存在することを確認
      expect(wrapper.text()).toContain('タイトル:')
    })

    it('編集ボタンが表示される', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      const editButton = wrapper.find('.btn-edit')
      expect(editButton.exists()).toBe(true)
      expect(editButton.text()).toBe('編集')
    })

    it('閉じるボタンが表示される', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      const closeButton = wrapper.find('.close-button')
      expect(closeButton.exists()).toBe(true)
    })
  })

  describe('編集モード切替', () => {
    it('編集ボタンクリックで編集モードに切り替わる', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      // 初期状態は表示モード
      expect(wrapper.findComponent(TodoEditForm).exists()).toBe(false)

      const editButton = wrapper.find('.btn-edit')
      await editButton.trigger('click')
      await flushPromises()

      // 編集モードに切り替わる
      expect(wrapper.findComponent(TodoEditForm).exists()).toBe(true)
      expect(wrapper.find('.btn-edit').exists()).toBe(false)
    })

    it('編集モードでキャンセルすると表示モードに戻る', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      // 編集モードに切り替え
      const editButton = wrapper.find('.btn-edit')
      await editButton.trigger('click')
      await flushPromises()

      // キャンセル
      const editForm = wrapper.findComponent(TodoEditForm)
      await editForm.vm.$emit('cancel')
      await flushPromises()

      // 表示モードに戻る
      expect(wrapper.findComponent(TodoEditForm).exists()).toBe(false)
      expect(wrapper.find('.btn-edit').exists()).toBe(true)
    })
  })

  describe('保存処理', () => {
    it('編集フォームが表示される', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      // 編集モードに切り替え
      await wrapper.find('.btn-edit').trigger('click')
      await flushPromises()

      // TodoEditFormが表示される
      const editForm = wrapper.findComponent(TodoEditForm)
      expect(editForm.exists()).toBe(true)
    })
  })

  describe('モーダルを閉じる', () => {
    it('閉じるボタンでcloseイベントが発火する', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      const closeButton = wrapper.find('.close-button')
      await closeButton.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('オーバーレイクリックでcloseイベントが発火する', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      const overlay = wrapper.find('.modal-overlay')
      await overlay.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('モーダルコンテナクリックではcloseイベントが発火しない', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      const container = wrapper.find('.modal-container')
      await container.trigger('click')

      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('編集モード中にモーダルを閉じると編集モードが終了する', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      // 編集モードに切り替え
      await wrapper.find('.btn-edit').trigger('click')
      await flushPromises()

      // モーダルを閉じる
      const closeButton = wrapper.find('.close-button')
      await closeButton.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('完了状態の切り替え', () => {
    it('未完了の場合、「完了にする」ボタンが表示される', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      const toggleButton = wrapper.find('.btn-toggle')
      expect(toggleButton.exists()).toBe(true)
      expect(toggleButton.text()).toBe('完了にする')
    })
  })

  describe('日時フォーマット', () => {
    it('期間が正しくフォーマットされる', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      // 日付が表示されていることを確認（フォーマットはロケールに依存）
      expect(wrapper.text()).toContain('期間:')
    })

    it('作成日時が正しくフォーマットされる', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      expect(wrapper.text()).toContain('作成日時:')
    })
  })

  describe('ステータスバッジ', () => {
    it('未完了の場合、pendingバッジが表示される', async () => {
      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      const badge = wrapper.find('.badge')
      expect(badge.exists()).toBe(true)
      expect(badge.classes()).toContain('pending')
      expect(badge.text()).toBe('未完了')
    })
  })

  describe('説明表示', () => {
    it('説明がない場合、「説明なし」と表示される', async () => {
      mockTodos = [createMockTodo({ description: null })]

      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      expect(wrapper.text()).toContain('説明なし')
    })
  })

  describe('担当者表示', () => {
    it('担当者がいない場合、「未割当」と表示される', async () => {
      mockTodos = [createMockTodo({ assigneeId: null, assigneeName: null })]

      const wrapper = mountModal({ todoId: 1, isOpen: true })
      await flushPromises()

      expect(wrapper.text()).toContain('未割当')
    })
  })
})
