<script setup lang="ts">
  import NavCard from '@/components/common/NavCard.vue'
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>ToDo App</h1>
      <p class="subtitle">タスク管理アプリケーション</p>
    </header>

    <nav class="nav-cards">
      <NavCard
        to="/todos"
        icon="📋"
        title="チケット管理"
        description="チケットの作成・編集・進捗管理を行います。"
        color-class="card-todo"
      />
      <NavCard
        to="/todos/table"
        icon="📊"
        title="チケット一覧"
        description="テーブル形式でチケットを表示し、検索・フィルタリングできます。"
        color-class="card-table"
      />
      <NavCard
        to="/projects"
        icon="📁"
        title="案件管理"
        description="案件ごとにチケットをグループ化し、進捗状況を確認できます。"
        color-class="card-project"
      />
      <NavCard
        to="/users"
        icon="👥"
        title="ユーザー管理"
        description="チケットに割り当てる担当者を登録・管理します。"
        color-class="card-user"
      />
    </nav>

    <footer class="footer">
      <p>&copy; 2024 ToDo App</p>
    </footer>
  </div>
</template>

<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .page-header h1 {
    margin: 0 0 8px 0;
    font-size: 2.5rem;
  }

  .subtitle {
    color: #666;
    margin: 0;
  }

  .nav-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .footer {
    margin-top: 60px;
    text-align: center;
    color: #999;
    font-size: 0.9rem;
  }
</style>
