import { defineStore } from 'pinia'
import type { Project, CreateProjectRequest, ProjectStats } from '@/types/project'
import * as projectService from '@/services/projectService'

interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  projectStats: Record<number, ProjectStats>
  noProjectStats: ProjectStats
}

const defaultStats: ProjectStats = { total: 0, completed: 0, progressRate: 0 }

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    projects: [],
    loading: false,
    error: null,
    projectStats: {},
    noProjectStats: { ...defaultStats }
  }),

  actions: {
    async fetchProjects() {
      this.loading = true
      this.error = null

      try {
        this.projects = await projectService.getAll()
        await this.fetchAllStats()
      } catch (e) {
        this.error = '案件リストの読み込みに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async createProject(data: CreateProjectRequest) {
      this.error = null
      try {
        await projectService.create(data)
        await this.fetchProjects()
      } catch (e) {
        this.error = '案件の作成に失敗しました'
        throw e
      }
    },

    async deleteProject(id: number) {
      this.error = null
      try {
        await projectService.delete(id)
        await this.fetchProjects()
      } catch (e) {
        this.error = '案件の削除に失敗しました'
        throw e
      }
    },

    async fetchProjectStats(id: number) {
      try {
        const stats = await projectService.getStats(id)
        this.projectStats[id] = stats
      } catch (e) {
        this.projectStats[id] = { ...defaultStats }
      }
    },

    async fetchAllStats() {
      await Promise.all([
        ...this.projects.map((p) => this.fetchProjectStats(p.id)),
        this.fetchNoProjectStats()
      ])
    },

    async fetchNoProjectStats() {
      try {
        this.noProjectStats = await projectService.getNoProjectStats()
      } catch (e) {
        this.noProjectStats = { ...defaultStats }
      }
    },

    clearError() {
      this.error = null
    }
  }
})
