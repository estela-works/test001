import { defineStore } from 'pinia'
import type { Todo, CreateTodoRequest } from '@/types/todo'
import * as todoService from '@/services/todoService'

interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
  filter: 'all' | 'pending' | 'completed'
  currentProjectId: string | null
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    loading: false,
    error: null,
    filter: 'all',
    currentProjectId: null
  }),

  getters: {
    filteredTodos: (state): Todo[] => {
      switch (state.filter) {
        case 'pending':
          return state.todos.filter((t) => !t.completed)
        case 'completed':
          return state.todos.filter((t) => t.completed)
        default:
          return state.todos
      }
    },

    stats: (state) => {
      const total = state.todos.length
      const completed = state.todos.filter((t) => t.completed).length
      return {
        total,
        completed,
        pending: total - completed
      }
    }
  },

  actions: {
    async fetchTodos(projectId?: string | null) {
      this.loading = true
      this.error = null
      this.currentProjectId = projectId ?? null

      try {
        this.todos = await todoService.getAll(projectId)
      } catch (e) {
        this.error = 'ToDoリストの読み込みに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async addTodo(data: CreateTodoRequest) {
      this.error = null
      try {
        await todoService.create(data)
        await this.fetchTodos(this.currentProjectId)
      } catch (e) {
        this.error = 'ToDoの追加に失敗しました'
        throw e
      }
    },

    async toggleTodo(id: number) {
      this.error = null
      try {
        await todoService.toggle(id)
        await this.fetchTodos(this.currentProjectId)
      } catch (e) {
        this.error = 'ToDoの更新に失敗しました'
        throw e
      }
    },

    async deleteTodo(id: number) {
      this.error = null
      try {
        await todoService.delete(id)
        await this.fetchTodos(this.currentProjectId)
      } catch (e) {
        this.error = 'ToDoの削除に失敗しました'
        throw e
      }
    },

    setFilter(filter: 'all' | 'pending' | 'completed') {
      this.filter = filter
    },

    clearError() {
      this.error = null
    }
  }
})
