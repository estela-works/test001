<script setup lang="ts">
  defineProps<{
    total: number
    completed: number
    pending: number
  }>()
</script>

<template>
  <div class="stats card">
    <span
      >総数: <strong>{{ total }}</strong></span
    >
    <span
      >完了: <strong>{{ completed }}</strong></span
    >
    <span
      >未完了: <strong>{{ pending }}</strong></span
    >
  </div>
</template>

<style scoped>
  .stats {
    display: flex;
    gap: 24px;
    justify-content: center;
  }

  .stats span {
    color: #666;
  }

  .stats strong {
    color: #333;
  }
</style>
