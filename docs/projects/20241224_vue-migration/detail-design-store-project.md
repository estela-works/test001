# ストア詳細設計書 - projectStore

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |
| 親文書 | [detail-design-store.md](./detail-design-store.md) |

---

## 3. projectStore

### 3.1 ファイル

`src/frontend/src/stores/projectStore.ts`

### 3.2 状態定義

```typescript
interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  projectStats: Record<number, ProjectStats>
  noProjectStats: ProjectStats
}
```

| 状態 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| projects | Project[] | [] | 案件リスト |
| loading | boolean | false | ローディング状態 |
| error | string \| null | null | エラーメッセージ |
| projectStats | Record<number, ProjectStats> | {} | 案件別統計 |
| noProjectStats | ProjectStats | { total: 0, completed: 0, progressRate: 0 } | 未分類統計 |

### 3.3 アクション

| アクション | 引数 | 説明 |
|-----------|------|------|
| fetchProjects | - | 案件一覧取得 |
| createProject | data: CreateProjectRequest | 案件作成 |
| deleteProject | id: number | 案件削除 |
| fetchProjectStats | id: number | 案件統計取得 |
| fetchAllStats | - | 全案件統計取得 |
| fetchNoProjectStats | - | 未分類統計取得 |

### 3.4 完全実装

```typescript
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
        ...this.projects.map(p => this.fetchProjectStats(p.id)),
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
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
