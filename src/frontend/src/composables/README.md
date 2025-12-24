# composables

Vue 3 Composition APIで使用するカスタムフック（Composables）。

## ファイル一覧

| ファイル | 説明 |
|---------|------|
| `useError.ts` | エラーハンドリング用composable |

## 使用例

```typescript
import { useError } from '@/composables/useError'

const { error, setError, clearError } = useError()
```
