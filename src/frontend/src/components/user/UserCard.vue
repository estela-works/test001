<script setup lang="ts">
  import { computed } from 'vue'
  import type { User } from '@/types'

  const props = defineProps<{
    user: User
  }>()

  const emit = defineEmits<{
    (e: 'delete', id: number): void
  }>()

  const formattedCreatedAt = computed(() => {
    const date = new Date(props.user.createdAt)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  })

  const handleDelete = () => {
    if (confirm('このユーザーを削除しますか？紐づいたチケットの担当者は未割当になります。')) {
      emit('delete', props.user.id)
    }
  }
</script>

<template>
  <div class="user-card card">
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>登録日: {{ formattedCreatedAt }}</p>
    </div>
    <div class="actions">
      <button class="delete-btn btn-danger" @click="handleDelete">削除</button>
    </div>
  </div>
</template>

<style scoped>
  .user-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-info h3 {
    margin: 0 0 4px 0;
  }

  .user-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
</style>
