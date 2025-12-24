<script setup lang="ts">
  import { reactive } from 'vue'
  import type { CreateProjectRequest } from '@/types'

  const emit = defineEmits<{
    (e: 'submit', data: CreateProjectRequest): void
  }>()

  const form = reactive({
    name: '',
    description: ''
  })

  const resetForm = () => {
    form.name = ''
    form.description = ''
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert('案件名を入力してください')
      return
    }

    emit('submit', {
      name: form.name.trim(),
      description: form.description.trim() || undefined
    })
    resetForm()
  }
</script>

<template>
  <div class="add-form card">
    <h3>新しい案件を作成</h3>
    <input
      v-model="form.name"
      type="text"
      placeholder="案件名を入力してください"
      @keypress.enter="handleSubmit"
    />
    <textarea
      v-model="form.description"
      rows="2"
      placeholder="説明を入力してください（オプション）"
    />
    <button class="btn-primary" @click="handleSubmit">作成</button>
  </div>
</template>

<style scoped>
  .add-form h3 {
    margin-top: 0;
    margin-bottom: 16px;
  }

  .add-form input,
  .add-form textarea {
    width: 100%;
    margin-bottom: 12px;
  }
</style>
