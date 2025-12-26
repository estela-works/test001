<script setup lang="ts">
  defineProps<{
    to: string
    icon: string
    title: string
    description: string
    colorClass: string
  }>()
</script>

<template>
  <router-link :to="to" class="nav-card" :class="colorClass">
    <div class="card-icon">
      <span>{{ icon }}</span>
    </div>
    <div class="card-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <div class="card-action">
      <span class="action-text">開く</span>
    </div>
  </router-link>
</template>

<style scoped>
  .nav-card {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: inherit;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .nav-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-decoration: none;
  }

  .card-icon {
    font-size: 2.5rem;
    margin-right: 20px;
  }

  .card-content {
    flex: 1;
  }

  .card-content h3 {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
  }

  .card-content p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }

  .card-action {
    margin-left: 20px;
  }

  .action-text {
    color: #007bff;
    font-weight: 500;
  }

  .card-todo {
    border-left: 4px solid #007bff;
  }

  .card-project {
    border-left: 4px solid #28a745;
  }

  .card-user {
    border-left: 4px solid #6f42c1;
  }

  .card-table {
    border-left: 4px solid #17a2b8;
  }
</style>
