import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'ホーム'
    }
  },
  {
    path: '/todos',
    name: 'todos',
    component: () => import('@/views/TodoView.vue'),
    meta: {
      title: 'チケット管理'
    }
  },
  {
    path: '/todos/table',
    name: 'todos-table',
    component: () => import('@/views/TodoTableView.vue'),
    meta: {
      title: 'チケット一覧'
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectView.vue'),
    meta: {
      title: '案件管理'
    }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/UserView.vue'),
    meta: {
      title: 'ユーザー管理'
    }
  },
  {
    // 404 - 存在しないパスはホームへリダイレクト
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ページタイトル更新
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} - ToDo App` : 'ToDo App'
})

export default router
