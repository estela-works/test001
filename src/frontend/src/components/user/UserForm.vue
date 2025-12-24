<script setup lang="ts">
  import { ref } from 'vue'

  const emit = defineEmits<{
    (e: 'submit', name: string): void
  }>()

  const name = ref('')

  const handleSubmit = () => {
    const trimmedName = name.value.trim()
    if (!trimmedName) {
      alert('ユーザー名を入力してください')
      return
    }
    if (trimmedName.length > 100) {
      alert('100文字以内で入力してください')
      return
    }

    emit('submit', trimmedName)
    name.value = ''
  }
</script>

<template>
  <div class="add-form card">
    <h3>新しいユーザーを追加</h3>
    <input
      v-model="name"
      type="text"
      placeholder="ユーザー名を入力してください"
      maxlength="100"
      @keypress.enter="handleSubmit"
    />
    <button class="btn-primary" @click="handleSubmit">追加</button>
  </div>
</template>

<style scoped>
  .add-form h3 {
    margin-top: 0;
    margin-bottom: 16px;
  }

  .add-form input {
    width: 100%;
    margin-bottom: 12px;
  }
</style>
