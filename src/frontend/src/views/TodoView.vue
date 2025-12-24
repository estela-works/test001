<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useTodoStore } from '@/stores/todoStore'
  import { useUserStore } from '@/stores/userStore'
  import * as projectService from '@/services/projectService'
  import type { CreateTodoRequest } from '@/types'
  import TodoForm from '@/components/todo/TodoForm.vue'
  import TodoList from '@/components/todo/TodoList.vue'
  import TodoStats from '@/components/todo/TodoStats.vue'
  import TodoFilter from '@/components/todo/TodoFilter.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  import ErrorMessage from '@/components/common/ErrorMessage.vue'

  const route = useRoute()
  const todoStore = useTodoStore()
  const userStore = useUserStore()

  const projectId = ref<string | null>(null)
  const projectName = ref('すべてのチケット')

  const filteredTodos = computed(() => todoStore.filteredTodos)
  const stats = computed(() => todoStore.stats)
  const loading = computed(() => todoStore.loading)
  const error = computed(() => todoStore.error)
  const users = computed(() => userStore.users)
  const filter = computed({
    get: () => todoStore.filter,
    set: (value) => todoStore.setFilter(value)
  })

  const loadProjectName = async () => {
    const id = projectId.value
    if (!id) {
      projectName.value = 'すべてのチケット'
    } else if (id === 'none') {
      projectName.value = '案件なし（未分類）'
    } else {
      try {
        const project = await projectService.getById(Number(id))
        projectName.value = project.name
      } catch {
        projectName.value = '不明な案件'
      }
    }
  }

  const handleAddTodo = async (data: CreateTodoRequest) => {
    try {
      await todoStore.addTodo(data)
    } catch {
      // エラーはストアで処理される
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await todoStore.toggleTodo(id)
    } catch {
      // エラーはストアで処理される
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await todoStore.deleteTodo(id)
    } catch {
      // エラーはストアで処理される
    }
  }

  onMounted(async () => {
    projectId.value = (route.query.projectId as string) || null
    await Promise.all([
      todoStore.fetchTodos(projectId.value),
      userStore.fetchUsers(),
      loadProjectName()
    ])
  })

  watch(
    () => route.query.projectId,
    async (newProjectId) => {
      projectId.value = (newProjectId as string) || null
      await Promise.all([todoStore.fetchTodos(projectId.value), loadProjectName()])
    }
  )
</script>

<template>
  <div class="container">
    <h1>ToDoリスト</h1>
    <p class="project-subtitle">{{ projectName }}</p>

    <TodoStats :total="stats.total" :completed="stats.completed" :pending="stats.pending" />

    <TodoForm :users="users" :project-id="projectId" @submit="handleAddTodo" />

    <TodoFilter v-model="filter" />

    <ErrorMessage :message="error" />
    <LoadingSpinner v-if="loading" />

    <TodoList v-else :todos="filteredTodos" @toggle="handleToggle" @delete="handleDelete" />

    <div class="back-link">
      <router-link to="/projects">← 案件一覧に戻る</router-link>
    </div>
  </div>
</template>

<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 4px;
  }

  .project-subtitle {
    color: #666;
    margin-top: 0;
    margin-bottom: 24px;
  }

  .back-link {
    margin-top: 40px;
    text-align: center;
  }
</style>
