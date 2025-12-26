import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectStore } from './projectStore'
import * as projectService from '@/services/projectService'
import type { Project } from '@/types'

vi.mock('@/services/projectService')

// テスト用のProjectを作成するヘルパー関数
function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 1,
    name: 'テスト案件',
    description: null,
    createdAt: '2025-01-01T00:00:00Z',
    ...overrides
  }
}

describe('projectStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('初期状態', () => {
    it('初期状態が正しく設定されている', () => {
      const store = useProjectStore()

      expect(store.projects).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.projectStats).toEqual({})
      expect(store.noProjectStats).toEqual({ total: 0, completed: 0, progressRate: 0 })
    })
  })

  describe('actions', () => {
    describe('fetchProjects', () => {
      it('案件リストを取得して状態を更新する', async () => {
        const mockProjects = [
          { id: 1, name: 'テスト案件', description: '説明', createdAt: '2025-01-01' }
        ]
        vi.mocked(projectService.getAll).mockResolvedValue(mockProjects)
        vi.mocked(projectService.getStats).mockResolvedValue({
          total: 5,
          completed: 2,
          progressRate: 40
        })
        vi.mocked(projectService.getNoProjectStats).mockResolvedValue({
          total: 3,
          completed: 1,
          progressRate: 33
        })

        const store = useProjectStore()
        await store.fetchProjects()

        expect(store.projects).toEqual(mockProjects)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('エラー時にエラーメッセージを設定する', async () => {
        vi.mocked(projectService.getAll).mockRejectedValue(new Error('API Error'))

        const store = useProjectStore()

        await expect(store.fetchProjects()).rejects.toThrow()
        expect(store.error).toBe('案件リストの読み込みに失敗しました')
        expect(store.loading).toBe(false)
      })
    })

    describe('createProject', () => {
      it('新しい案件を作成してリストを更新する', async () => {
        vi.mocked(projectService.create).mockResolvedValue(createMockProject())
        vi.mocked(projectService.getAll).mockResolvedValue([])
        vi.mocked(projectService.getNoProjectStats).mockResolvedValue({
          total: 0,
          completed: 0,
          progressRate: 0
        })

        const store = useProjectStore()
        await store.createProject({ name: '新規案件', description: '説明' })

        expect(projectService.create).toHaveBeenCalledWith({
          name: '新規案件',
          description: '説明'
        })
        expect(projectService.getAll).toHaveBeenCalled()
      })

      it('エラー時にエラーメッセージを設定する', async () => {
        vi.mocked(projectService.create).mockRejectedValue(new Error('API Error'))

        const store = useProjectStore()

        await expect(
          store.createProject({ name: 'テスト', description: '' })
        ).rejects.toThrow()
        expect(store.error).toBe('案件の作成に失敗しました')
      })
    })

    describe('deleteProject', () => {
      it('案件を削除してリストを更新する', async () => {
        vi.mocked(projectService.delete).mockResolvedValue(undefined)
        vi.mocked(projectService.getAll).mockResolvedValue([])
        vi.mocked(projectService.getNoProjectStats).mockResolvedValue({
          total: 0,
          completed: 0,
          progressRate: 0
        })

        const store = useProjectStore()
        await store.deleteProject(1)

        expect(projectService.delete).toHaveBeenCalledWith(1)
        expect(projectService.getAll).toHaveBeenCalled()
      })

      it('エラー時にエラーメッセージを設定する', async () => {
        vi.mocked(projectService.delete).mockRejectedValue(new Error('API Error'))

        const store = useProjectStore()

        await expect(store.deleteProject(1)).rejects.toThrow()
        expect(store.error).toBe('案件の削除に失敗しました')
      })
    })

    describe('fetchProjectStats', () => {
      it('特定案件の統計を取得する', async () => {
        const mockStats = { total: 10, completed: 5, progressRate: 50 }
        vi.mocked(projectService.getStats).mockResolvedValue(mockStats)

        const store = useProjectStore()
        await store.fetchProjectStats(1)

        expect(projectService.getStats).toHaveBeenCalledWith(1)
        expect(store.projectStats[1]).toEqual(mockStats)
      })

      it('エラー時にデフォルト値を設定する', async () => {
        vi.mocked(projectService.getStats).mockRejectedValue(new Error('API Error'))

        const store = useProjectStore()
        await store.fetchProjectStats(1)

        expect(store.projectStats[1]).toEqual({ total: 0, completed: 0, progressRate: 0 })
      })
    })

    describe('fetchNoProjectStats', () => {
      it('未分類チケットの統計を取得する', async () => {
        const mockStats = { total: 3, completed: 1, progressRate: 33 }
        vi.mocked(projectService.getNoProjectStats).mockResolvedValue(mockStats)

        const store = useProjectStore()
        await store.fetchNoProjectStats()

        expect(store.noProjectStats).toEqual(mockStats)
      })

      it('エラー時にデフォルト値を設定する', async () => {
        vi.mocked(projectService.getNoProjectStats).mockRejectedValue(
          new Error('API Error')
        )

        const store = useProjectStore()
        await store.fetchNoProjectStats()

        expect(store.noProjectStats).toEqual({ total: 0, completed: 0, progressRate: 0 })
      })
    })

    describe('clearError', () => {
      it('エラーをクリアする', () => {
        const store = useProjectStore()
        store.error = 'テストエラー'

        store.clearError()

        expect(store.error).toBeNull()
      })
    })
  })
})
