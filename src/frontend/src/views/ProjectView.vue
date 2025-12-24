<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useProjectStore } from '@/stores/projectStore'
  import type { CreateProjectRequest, ProjectStats } from '@/types'
  import ProjectForm from '@/components/project/ProjectForm.vue'
  import ProjectCard from '@/components/project/ProjectCard.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  import ErrorMessage from '@/components/common/ErrorMessage.vue'

  const router = useRouter()
  const projectStore = useProjectStore()

  const projects = computed(() => projectStore.projects)
  const projectStats = computed(() => projectStore.projectStats)
  const noProjectStats = computed(() => projectStore.noProjectStats)
  const loading = computed(() => projectStore.loading)
  const error = computed(() => projectStore.error)

  const defaultStats: ProjectStats = { total: 0, completed: 0, progressRate: 0 }

  const handleCreate = async (data: CreateProjectRequest) => {
    try {
      await projectStore.createProject(data)
    } catch {
      // エラーはストアで処理される
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await projectStore.deleteProject(id)
    } catch {
      // エラーはストアで処理される
    }
  }

  const navigateToTodos = (projectId: number | string) => {
    router.push({ path: '/todos', query: { projectId: String(projectId) } })
  }

  onMounted(async () => {
    await projectStore.fetchProjects()
  })
</script>

<template>
  <div class="container">
    <h1>案件一覧</h1>

    <ProjectForm @submit="handleCreate" />

    <ErrorMessage :message="error" />
    <LoadingSpinner v-if="loading" />

    <div v-else>
      <p v-if="projects.length === 0" class="empty-message">案件がありません。</p>
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        :stats="projectStats[project.id] || defaultStats"
        @view="navigateToTodos"
        @delete="handleDelete"
      />

      <ProjectCard
        :project="{ id: 'none', name: '案件なし（未分類）', description: '案件に紐づかないチケット', createdAt: '' }"
        :stats="noProjectStats"
        :is-no-project="true"
        @view="navigateToTodos('none')"
      />
    </div>

    <div class="back-link">
      <router-link to="/users">ユーザー管理</router-link> |
      <router-link to="/">← ホームに戻る</router-link>
    </div>
  </div>
</template>

<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 24px;
  }

  .empty-message {
    text-align: center;
    color: #666;
    padding: 40px 20px;
  }

  .back-link {
    margin-top: 40px;
    text-align: center;
  }
</style>
