<template>
  <div class="comment-list">
    <div v-if="commentStore.loading" class="loading">
      読み込み中...
    </div>

    <div v-else-if="commentStore.error" class="error">
      {{ commentStore.error }}
    </div>

    <div v-else-if="!commentStore.hasComments" class="empty">
      コメントはまだありません
    </div>

    <div v-else class="comments">
      <CommentItem
        v-for="comment in commentStore.sortedComments"
        :key="comment.id"
        :comment="comment"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useCommentStore } from '@/stores/commentStore'
import CommentItem from './CommentItem.vue'

const props = defineProps<{
  todoId: number
}>()

const commentStore = useCommentStore()

onMounted(async () => {
  try {
    await commentStore.fetchComments(props.todoId)
  } catch (error) {
    // エラーはストアに保存済み
  }
})

onUnmounted(() => {
  commentStore.clearComments()
})

async function handleDelete(commentId: number) {
  if (!confirm('このコメントを削除してもよろしいですか?')) {
    return
  }

  try {
    await commentStore.deleteComment(commentId)
  } catch (error) {
    alert('コメントの削除に失敗しました')
  }
}
</script>

<style scoped>
.comment-list {
  margin-top: 1rem;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.error {
  padding: 1rem;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
