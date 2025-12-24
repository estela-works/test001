<script setup lang="ts">
  defineProps<{
    message: string | null
  }>()
</script>

<template>
  <div v-if="message" class="error">
    {{ message }}
  </div>
</template>

<style scoped>
  .error {
    color: #dc3545;
    text-align: center;
    padding: 10px;
    background-color: #f8d7da;
    border-radius: 4px;
    margin-bottom: 20px;
  }
</style>
