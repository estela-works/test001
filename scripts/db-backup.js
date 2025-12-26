/**
 * DBバックアップ・リストアスクリプト
 * E2Eテスト前後でデータを保存・復元する
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const BACKUP_DIR = path.join(__dirname, '../data/backup');
const BACKUP_FILE = path.join(BACKUP_DIR, 'db-backup.json');

async function request(method, urlPath, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// バックアップディレクトリの作成
function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

// 現在のデータを取得
async function fetchAllData() {
  const [usersRes, projectsRes, todosRes] = await Promise.all([
    request('GET', '/api/users'),
    request('GET', '/api/projects'),
    request('GET', '/api/todos'),
  ]);

  return {
    users: usersRes.data || [],
    projects: projectsRes.data || [],
    todos: todosRes.data || [],
    backupTime: new Date().toISOString(),
  };
}

// データをクリア
async function clearAllData() {
  console.log('  データをクリア中...');

  // Todosを先に削除（依存関係）
  const todosRes = await request('GET', '/api/todos');
  for (const todo of todosRes.data || []) {
    await request('DELETE', `/api/todos/${todo.id}`);
  }

  // Projectsを削除
  const projectsRes = await request('GET', '/api/projects');
  for (const project of projectsRes.data || []) {
    await request('DELETE', `/api/projects/${project.id}`);
  }

  // Usersを削除
  const usersRes = await request('GET', '/api/users');
  for (const user of usersRes.data || []) {
    await request('DELETE', `/api/users/${user.id}`);
  }
}

// データを復元
async function restoreData(backup) {
  console.log('  データを復元中...');

  // ユーザー作成（IDマッピング用）
  const userIdMap = {};
  for (const user of backup.users) {
    const res = await request('POST', '/api/users', { name: user.name });
    userIdMap[user.id] = res.data.id;
  }

  // 案件作成（IDマッピング用）
  const projectIdMap = {};
  for (const project of backup.projects) {
    const res = await request('POST', '/api/projects', {
      name: project.name,
      description: project.description,
    });
    projectIdMap[project.id] = res.data.id;
  }

  // Todo作成
  for (const todo of backup.todos) {
    const newTodo = {
      title: todo.title,
      description: todo.description,
      startDate: todo.startDate,
      dueDate: todo.dueDate,
    };

    if (todo.projectId && projectIdMap[todo.projectId]) {
      newTodo.projectId = projectIdMap[todo.projectId];
    }
    if (todo.assigneeId && userIdMap[todo.assigneeId]) {
      newTodo.assigneeId = userIdMap[todo.assigneeId];
    }

    const res = await request('POST', '/api/todos', newTodo);

    // 完了状態を復元
    if (todo.completed) {
      await request('PATCH', `/api/todos/${res.data.id}/toggle`);
    }
  }
}

// バックアップコマンド
async function backup() {
  console.log('📦 データベースをバックアップ中...\n');

  ensureBackupDir();
  const data = await fetchAllData();

  fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), 'utf8');

  console.log('✅ バックアップ完了！');
  console.log(`   ファイル: ${BACKUP_FILE}`);
  console.log(`   ユーザー: ${data.users.length}名`);
  console.log(`   案件: ${data.projects.length}件`);
  console.log(`   チケット: ${data.todos.length}件`);
  console.log(`   時刻: ${data.backupTime}`);
}

// リストアコマンド
async function restore() {
  console.log('🔄 データベースを復元中...\n');

  if (!fs.existsSync(BACKUP_FILE)) {
    console.log('❌ バックアップファイルが見つかりません: ' + BACKUP_FILE);
    console.log('   先に `node scripts/db-backup.js backup` を実行してください。');
    process.exit(1);
  }

  const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));

  console.log(`📂 バックアップ情報:`);
  console.log(`   時刻: ${backup.backupTime}`);
  console.log(`   ユーザー: ${backup.users.length}名`);
  console.log(`   案件: ${backup.projects.length}件`);
  console.log(`   チケット: ${backup.todos.length}件\n`);

  await clearAllData();
  await restoreData(backup);

  console.log('\n✅ 復元完了！');
}

// 状態確認コマンド
async function status() {
  console.log('📊 データベース状態確認\n');

  const data = await fetchAllData();

  console.log('現在のデータ:');
  console.log(`   ユーザー: ${data.users.length}名`);
  console.log(`   案件: ${data.projects.length}件`);
  console.log(`   チケット: ${data.todos.length}件`);

  const completedTodos = data.todos.filter(t => t.completed).length;
  console.log(`   (完了: ${completedTodos}件 / 未完了: ${data.todos.length - completedTodos}件)`);

  // 最小データ要件チェック
  const minUsers = 3;
  const minProjects = 2;
  const minTodos = 5;

  console.log('\n最小データ要件チェック:');
  const checks = [
    { name: 'ユーザー', current: data.users.length, min: minUsers },
    { name: '案件', current: data.projects.length, min: minProjects },
    { name: 'チケット', current: data.todos.length, min: minTodos },
  ];

  let allPassed = true;
  for (const check of checks) {
    const passed = check.current >= check.min;
    const icon = passed ? '✅' : '❌';
    console.log(`   ${icon} ${check.name}: ${check.current}/${check.min}`);
    if (!passed) allPassed = false;
  }

  if (allPassed) {
    console.log('\n✅ データは十分です。E2Eテストを実行できます。');
  } else {
    console.log('\n⚠️  データが不足しています。');
    console.log('   `node scripts/seed-data.js` でサンプルデータを投入してください。');
  }

  // バックアップ状態
  console.log('\nバックアップ状態:');
  if (fs.existsSync(BACKUP_FILE)) {
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
    console.log(`   ✅ バックアップあり (${backup.backupTime})`);
    console.log(`      ユーザー: ${backup.users.length}名 / 案件: ${backup.projects.length}件 / チケット: ${backup.todos.length}件`);
  } else {
    console.log('   ⚠️  バックアップなし');
  }
}

// メイン処理
const command = process.argv[2];

switch (command) {
  case 'backup':
    backup().catch(console.error);
    break;
  case 'restore':
    restore().catch(console.error);
    break;
  case 'status':
    status().catch(console.error);
    break;
  default:
    console.log('使用方法:');
    console.log('  node scripts/db-backup.js backup   - データをバックアップ');
    console.log('  node scripts/db-backup.js restore  - データを復元');
    console.log('  node scripts/db-backup.js status   - データ状態を確認');
    console.log('\nE2Eテスト前後の推奨フロー:');
    console.log('  1. node scripts/db-backup.js status  (データ確認)');
    console.log('  2. node scripts/db-backup.js backup  (バックアップ)');
    console.log('  3. npx playwright test               (E2Eテスト実行)');
    console.log('  4. node scripts/db-backup.js restore (データ復元)');
}
