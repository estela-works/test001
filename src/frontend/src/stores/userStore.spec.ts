import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './userStore'
import * as userService from '@/services/userService'
import type { User } from '@/types'

vi.mock('@/services/userService')

// テスト用のUserを作成するヘルパー関数
function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'テストユーザー',
    createdAt: '2025-01-01T00:00:00Z',
    ...overrides
  }
}

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('初期状態', () => {
    it('初期状態が正しく設定されている', () => {
      const store = useUserStore()

      expect(store.users).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('getters', () => {
    describe('userCount', () => {
      it('ユーザー数を正しく返す', () => {
        const store = useUserStore()
        store.users = [
          { id: 1, name: 'ユーザー1', createdAt: '' },
          { id: 2, name: 'ユーザー2', createdAt: '' }
        ]

        expect(store.userCount).toBe(2)
      })

      it('ユーザーがいない場合は0を返す', () => {
        const store = useUserStore()
        store.users = []

        expect(store.userCount).toBe(0)
      })
    })
  })

  describe('actions', () => {
    describe('fetchUsers', () => {
      it('ユーザーリストを取得して状態を更新する', async () => {
        const mockUsers = [
          { id: 1, name: 'テストユーザー', createdAt: '2025-01-01' }
        ]
        vi.mocked(userService.getAll).mockResolvedValue(mockUsers)

        const store = useUserStore()
        await store.fetchUsers()

        expect(store.users).toEqual(mockUsers)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('読み込み中はloadingがtrueになる', async () => {
        let resolvePromise: (value: unknown[]) => void
        const promise = new Promise<unknown[]>((resolve) => {
          resolvePromise = resolve
        })
        vi.mocked(userService.getAll).mockReturnValue(promise as Promise<never>)

        const store = useUserStore()
        const fetchPromise = store.fetchUsers()

        expect(store.loading).toBe(true)

        resolvePromise!([])
        await fetchPromise

        expect(store.loading).toBe(false)
      })

      it('エラー時にエラーメッセージを設定する', async () => {
        vi.mocked(userService.getAll).mockRejectedValue(new Error('API Error'))

        const store = useUserStore()

        await expect(store.fetchUsers()).rejects.toThrow()
        expect(store.error).toBe('ユーザーリストの読み込みに失敗しました')
        expect(store.loading).toBe(false)
      })
    })

    describe('addUser', () => {
      it('新しいユーザーを追加してリストを更新する', async () => {
        vi.mocked(userService.create).mockResolvedValue(createMockUser())
        vi.mocked(userService.getAll).mockResolvedValue([])

        const store = useUserStore()
        await store.addUser('新規ユーザー')

        expect(userService.create).toHaveBeenCalledWith('新規ユーザー')
        expect(userService.getAll).toHaveBeenCalled()
      })

      it('重複エラー時に専用のエラーメッセージを設定する', async () => {
        const conflictError = { status: 409, message: 'Conflict' }
        vi.mocked(userService.create).mockRejectedValue(conflictError)

        const store = useUserStore()

        await expect(store.addUser('既存ユーザー')).rejects.toEqual(conflictError)
        expect(store.error).toBe('同じ名前のユーザーが既に存在します')
      })

      it('その他のエラー時に一般的なエラーメッセージを設定する', async () => {
        vi.mocked(userService.create).mockRejectedValue(new Error('API Error'))

        const store = useUserStore()

        await expect(store.addUser('テスト')).rejects.toThrow()
        expect(store.error).toBe('ユーザーの追加に失敗しました')
      })
    })

    describe('deleteUser', () => {
      it('ユーザーを削除してリストを更新する', async () => {
        vi.mocked(userService.delete).mockResolvedValue(undefined)
        vi.mocked(userService.getAll).mockResolvedValue([])

        const store = useUserStore()
        await store.deleteUser(1)

        expect(userService.delete).toHaveBeenCalledWith(1)
        expect(userService.getAll).toHaveBeenCalled()
      })

      it('エラー時にエラーメッセージを設定する', async () => {
        vi.mocked(userService.delete).mockRejectedValue(new Error('API Error'))

        const store = useUserStore()

        await expect(store.deleteUser(1)).rejects.toThrow()
        expect(store.error).toBe('ユーザーの削除に失敗しました')
      })
    })

    describe('clearError', () => {
      it('エラーをクリアする', () => {
        const store = useUserStore()
        store.error = 'テストエラー'

        store.clearError()

        expect(store.error).toBeNull()
      })
    })
  })
})
