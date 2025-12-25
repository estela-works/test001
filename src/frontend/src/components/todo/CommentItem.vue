<template>
  <div class="comment-item">
    <div class="comment-header">
      <span class="author">{{ comment.userName || '削除されたユーザー' }}</span>
      <span class="separator">•</span>
      <span class="timestamp">{{ formattedDate }}</span>
      <button class="btn-delete" @click="handleDelete" aria-label="削除">
        削除
      </button>
    </div>
    <div class="comment-content">{{ comment.content }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '@/types'

const props = defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  delete: [commentId: number]
}>()

const formattedDate = computed(() => {
  return formatRelativeTime(props.comment.createdAt)
})

function formatRelativeTime(isoDate: string): string {
  const now = new Date()
  const past = new Date(isoDate)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'たった今'
  if (diffMins < 60) return `${diffMins}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`

  return past.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleDelete() {
  emit('delete', props.comment.id)
}
</script>

<style scoped>
.comment-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: white;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.author {
  font-weight: 600;
  color: #1f2937;
}

.separator {
  color: #9ca3af;
}

.timestamp {
  color: #6b7280;
}

.btn-delete {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.comment-content {
  color: #374151;
  white-space: pre-wrap;
  line-height: 1.5;
}
</style>
