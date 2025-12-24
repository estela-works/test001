<script setup lang="ts">
  import type { Project, ProjectStats } from '@/types'

  const props = defineProps<{
    project: Project | { id: string; name: string; description: string }
    stats: ProjectStats
    isNoProject?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'view', id: number | string): void
    (e: 'delete', id: number): void
  }>()

  const handleDelete = () => {
    if (confirm('この案件を削除しますか？紐づいたチケットは未分類になります。')) {
      emit('delete', props.project.id as number)
    }
  }
</script>

<template>
  <div class="project-card card" :class="{ 'no-project': isNoProject }">
    <h3>{{ project.name }}</h3>
    <p v-if="project.description">{{ project.description }}</p>
    <p class="stats-info">
      チケット: {{ stats.total }}件 / 完了: {{ stats.completed }}件 / 進捗:
      {{ stats.progressRate }}%
    </p>
    <div v-if="!isNoProject" class="progress-bar">
      <div class="progress" :style="{ width: stats.progressRate + '%' }"></div>
    </div>
    <div class="actions">
      <button class="view-btn btn-primary" @click="$emit('view', project.id)">チケット一覧</button>
      <button v-if="!isNoProject" class="delete-btn btn-danger" @click="handleDelete">削除</button>
    </div>
  </div>
</template>

<style scoped>
  .project-card h3 {
    margin-top: 0;
    margin-bottom: 8px;
  }

  .project-card p {
    margin: 4px 0;
    color: #666;
  }

  .stats-info {
    font-size: 0.9rem;
    margin-bottom: 12px !important;
  }

  .progress-bar {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background-color: #28a745;
    transition: width 0.3s;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .no-project {
    border-left: 4px solid #6c757d;
    background-color: #f8f9fa;
  }
</style>
