import { ref } from 'vue'

export function useError() {
  const error = ref<string | null>(null)

  const showError = (message: string) => {
    error.value = message
    setTimeout(() => {
      error.value = null
    }, 5000)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    error,
    showError,
    clearError
  }
}
