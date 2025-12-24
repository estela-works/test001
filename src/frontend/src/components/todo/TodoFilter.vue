<script setup lang="ts">
  defineProps<{
    modelValue: 'all' | 'pending' | 'completed'
  }>()

  defineEmits<{
    (e: 'update:modelValue', value: 'all' | 'pending' | 'completed'): void
  }>()

  const filters = [
    { value: 'all' as const, label: 'すべて' },
    { value: 'pending' as const, label: '未完了' },
    { value: 'completed' as const, label: '完了済み' }
  ]
</script>

<template>
  <div class="filter-buttons">
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="{ active: modelValue === filter.value }"
      @click="$emit('update:modelValue', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<style scoped>
  .filter-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin: 16px 0;
  }

  .filter-buttons button {
    background-color: #e9ecef;
    color: #495057;
    border: 1px solid #dee2e6;
    padding: 8px 16px;
  }

  .filter-buttons button:hover {
    background-color: #dee2e6;
  }

  .filter-buttons button.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
</style>
