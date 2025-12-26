<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  keyword: string
}>()

const emit = defineEmits<{
  search: [keyword: string]
}>()

const localKeyword = ref(props.keyword)

// 親からの変更を反映
watch(
  () => props.keyword,
  (newVal) => {
    localKeyword.value = newVal
  }
)

// 入力時に即座に検索
function handleInput(): void {
  emit('search', localKeyword.value)
}

// クリアボタン
function handleClear(): void {
  localKeyword.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="todo-search-form">
    <div class="search-input-wrapper">
      <span class="search-icon">&#x1F50D;</span>
      <input
        v-model="localKeyword"
        type="text"
        class="search-input"
        placeholder="タイトル・説明で検索..."
        @input="handleInput"
      />
      <button v-if="localKeyword" class="clear-btn" @click="handleClear" title="クリア">
        &times;
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-search-form {
  flex: 1;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 8px 36px 8px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1976d2;
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  position: absolute;
  right: 8px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: #999;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background: #666;
}
</style>
