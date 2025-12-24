<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useUserStore } from '@/stores/userStore'
  import UserForm from '@/components/user/UserForm.vue'
  import UserCard from '@/components/user/UserCard.vue'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
  import ErrorMessage from '@/components/common/ErrorMessage.vue'

  const userStore = useUserStore()

  const users = computed(() => userStore.users)
  const loading = computed(() => userStore.loading)
  const error = computed(() => userStore.error)

  const handleAdd = async (name: string) => {
    try {
      await userStore.addUser(name)
    } catch {
      // エラーはストアで処理される
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await userStore.deleteUser(id)
    } catch {
      // エラーはストアで処理される
    }
  }

  onMounted(async () => {
    await userStore.fetchUsers()
  })
</script>

<template>
  <div class="container">
    <h1>ユーザー管理</h1>

    <div class="stats card">
      <span
        >登録ユーザー数: <strong>{{ users.length }}</strong
        >人</span
      >
    </div>

    <UserForm @submit="handleAdd" />

    <ErrorMessage :message="error" />
    <LoadingSpinner v-if="loading" />

    <div v-else>
      <p v-if="users.length === 0" class="empty-message">ユーザーが登録されていません。</p>
      <UserCard v-for="user in users" :key="user.id" :user="user" @delete="handleDelete" />
    </div>

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
    margin-bottom: 24px;
  }

  .stats {
    text-align: center;
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
