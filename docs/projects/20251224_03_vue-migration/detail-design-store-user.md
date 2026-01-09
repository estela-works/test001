# ストア詳細設計書 - userStore

## 案件情報

| 項目 | 内容 |
|------|------|
| 案件名 | Vue.js移行・フロントエンド/バックエンド分離 |
| 案件ID | 20241224_vue-migration |
| 作成日 | 2024-12-24 |
| 関連基本設計書 | [basic-design-frontend.md](./basic-design-frontend.md) |
| 親文書 | [detail-design-store.md](./detail-design-store.md) |

---

## 4. userStore

### 4.1 ファイル

`src/frontend/src/stores/userStore.ts`

### 4.2 状態定義

```typescript
interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}
```

| 状態 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| users | User[] | [] | ユーザーリスト |
| loading | boolean | false | ローディング状態 |
| error | string \| null | null | エラーメッセージ |

### 4.3 ゲッター

| ゲッター | 戻り値 | 説明 |
|---------|--------|------|
| userCount | number | ユーザー数 |

### 4.4 アクション

| アクション | 引数 | 説明 |
|-----------|------|------|
| fetchUsers | - | ユーザー一覧取得 |
| addUser | name: string | ユーザー追加 |
| deleteUser | id: number | ユーザー削除 |

### 4.5 完全実装

```typescript
import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import * as userService from '@/services/userService'

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    userCount: (state): number => state.users.length
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        this.users = await userService.getAll()
      } catch (e) {
        this.error = 'ユーザーリストの読み込みに失敗しました'
        throw e
      } finally {
        this.loading = false
      }
    },

    async addUser(name: string) {
      this.error = null
      try {
        await userService.create(name)
        await this.fetchUsers()
      } catch (e: any) {
        if (e.status === 409) {
          this.error = '同じ名前のユーザーが既に存在します'
        } else {
          this.error = 'ユーザーの追加に失敗しました'
        }
        throw e
      }
    },

    async deleteUser(id: number) {
      this.error = null
      try {
        await userService.delete(id)
        await this.fetchUsers()
      } catch (e) {
        this.error = 'ユーザーの削除に失敗しました'
        throw e
      }
    },

    clearError() {
      this.error = null
    }
  }
})
```

---

## 改版履歴

| 版数 | 日付 | 変更内容 | 変更者 |
|------|------|----------|--------|
| 1.0 | 2024-12-24 | 初版作成 | - |
