<script setup lang="ts">
  import { RouterLink, useRoute } from 'vue-router'
  import { computed } from 'vue'

  const route = useRoute()

  const isActive = (path: string) => {
    return computed(() => route.path === path)
  }
</script>

<template>
  <header class="header">
    <div class="header-content">
      <RouterLink to="/" class="logo">ToDo App</RouterLink>
      <nav class="nav">
        <RouterLink to="/todos" :class="{ active: isActive('/todos').value }">チケット</RouterLink>
        <RouterLink to="/projects" :class="{ active: isActive('/projects').value }"
          >案件</RouterLink
        >
        <RouterLink to="/users" :class="{ active: isActive('/users').value }">ユーザー</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
  .header {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0 20px;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    text-decoration: none;
  }

  .logo:hover {
    text-decoration: none;
  }

  .nav {
    display: flex;
    gap: 24px;
  }

  .nav a {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .nav a:hover {
    color: #007bff;
    text-decoration: none;
  }

  .nav a.active {
    color: #007bff;
    border-bottom-color: #007bff;
  }
</style>
