import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import * as userService from '@/services/userService'

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    userCount: (state): number => state.users.length
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        this.users = await userService.getAll()
      } catch (e) {
        this.error = 'ユーザーリストの読み込みに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async addUser(name: string) {
      this.error = null
      try {
        await userService.create(name)
        await this.fetchUsers()
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'status' in e && e.status === 409) {
          this.error = '同じ名前のユーザーが既に存在します'
        } else {
          this.error = 'ユーザーの追加に失敗しました'
        }
        throw e
      }
    },

    async deleteUser(id: number) {
      this.error = null
      try {
        await userService.delete(id)
        await this.fetchUsers()
      } catch (e) {
        this.error = 'ユーザーの削除に失敗しました'
        throw e
      }
    },

    clearError() {
      this.error = null
    }
  }
})
