/**
 * サンプルデータ投入スクリプト（大量版）
 */
const http = require('http');

const BASE_URL = 'http://localhost:8080';

async function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
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
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
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

async function seedData() {
  console.log('🚀 サンプルデータを投入します...\n');

  const today = new Date();
  const formatDate = (d) => d.toISOString().split('T')[0];
  const addDays = (d, days) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

  // ========================================
  // ユーザー作成（10名）
  // ========================================
  console.log('=== ユーザー作成 ===');
  const users = [
    { name: '田中太郎' },
    { name: '佐藤花子' },
    { name: '鈴木一郎' },
    { name: '高橋美咲' },
    { name: '伊藤健太' },
    { name: '渡辺さくら' },
    { name: '山本大輔' },
    { name: '中村あかり' },
    { name: '小林誠' },
    { name: '加藤めぐみ' },
  ];

  const createdUsers = [];
  for (const user of users) {
    const result = await request('POST', '/api/users', user);
    console.log(`  ✓ ${result.name}`);
    createdUsers.push(result);
  }

  // ========================================
  // 案件作成（8件）
  // ========================================
  console.log('\n=== 案件作成 ===');
  const projects = [
    { name: 'ECサイト構築', description: 'オンラインショッピングサイトの新規構築プロジェクト' },
    { name: 'モバイルアプリ開発', description: 'iOS/Android対応のネイティブアプリ開発' },
    { name: '社内ポータル刷新', description: '社内情報共有ポータルサイトのリニューアル' },
    { name: 'AI チャットボット導入', description: 'カスタマーサポート向けAIチャットボットの開発・導入' },
    { name: 'データ分析基盤構築', description: 'ビッグデータ分析のためのインフラ構築' },
    { name: 'セキュリティ強化', description: '全社的なセキュリティ対策の強化プロジェクト' },
    { name: 'レガシーシステム移行', description: '旧基幹システムのクラウド移行' },
    { name: 'マーケティングオートメーション', description: 'MA ツールの導入と運用体制構築' },
  ];

  const createdProjects = [];
  for (const project of projects) {
    const result = await request('POST', '/api/projects', project);
    console.log(`  ✓ ${result.name}`);
    createdProjects.push(result);
  }

  // ========================================
  // チケット作成（50件以上）
  // ========================================
  console.log('\n=== チケット作成 ===');

  const todos = [
    // ========== ECサイト構築 ==========
    { title: '要件定義書作成', description: '機能要件・非機能要件の洗い出しと文書化', projectId: 0, assigneeId: 0, startOffset: -20, dueOffset: -10 },
    { title: '競合サイト調査', description: '主要競合3社のECサイト機能分析', projectId: 0, assigneeId: 1, startOffset: -18, dueOffset: -12 },
    { title: 'ワイヤーフレーム作成', description: '主要画面のワイヤーフレーム設計', projectId: 0, assigneeId: 1, startOffset: -12, dueOffset: -5 },
    { title: 'デザインカンプ作成', description: 'UIデザインの作成（トップ・商品一覧・詳細・カート・決済）', projectId: 0, assigneeId: 1, startOffset: -5, dueOffset: 3 },
    { title: 'フロントエンド実装', description: 'Vue.js でのフロントエンド開発', projectId: 0, assigneeId: 2, startOffset: 0, dueOffset: 14 },
    { title: 'バックエンドAPI開発', description: 'Spring Boot での REST API 開発', projectId: 0, assigneeId: 0, startOffset: 0, dueOffset: 14 },
    { title: '決済システム連携', description: 'Stripe/PayPay との決済連携実装', projectId: 0, assigneeId: 4, startOffset: 10, dueOffset: 20 },
    { title: '在庫管理システム連携', description: '既存在庫システムとのAPI連携', projectId: 0, assigneeId: 2, startOffset: 12, dueOffset: 22 },
    { title: '負荷テスト', description: '想定アクセス数での負荷テスト実施', projectId: 0, assigneeId: 8, startOffset: 20, dueOffset: 25 },
    { title: 'セキュリティ診断', description: '脆弱性診断の実施と対策', projectId: 0, assigneeId: 8, startOffset: 22, dueOffset: 28 },

    // ========== モバイルアプリ開発 ==========
    { title: 'アプリ企画書作成', description: 'アプリのコンセプトと機能一覧の策定', projectId: 1, assigneeId: 3, startOffset: -15, dueOffset: -10 },
    { title: 'UI/UXデザイン', description: 'Figma でのモバイルUI設計', projectId: 1, assigneeId: 5, startOffset: -10, dueOffset: -3 },
    { title: 'iOS アプリ開発', description: 'Swift でのiOSアプリ開発', projectId: 1, assigneeId: 6, startOffset: -3, dueOffset: 20 },
    { title: 'Android アプリ開発', description: 'Kotlin でのAndroidアプリ開発', projectId: 1, assigneeId: 4, startOffset: -3, dueOffset: 20 },
    { title: 'プッシュ通知実装', description: 'FCM を使用したプッシュ通知機能', projectId: 1, assigneeId: 6, startOffset: 15, dueOffset: 22 },
    { title: 'アプリ内課金実装', description: 'App Store / Google Play 課金連携', projectId: 1, assigneeId: 4, startOffset: 18, dueOffset: 28 },
    { title: 'App Store 申請準備', description: 'スクリーンショット・説明文の準備', projectId: 1, assigneeId: 3, startOffset: 25, dueOffset: 30 },

    // ========== 社内ポータル刷新 ==========
    { title: '現行システム分析', description: '既存ポータルの機能・課題の洗い出し', projectId: 2, assigneeId: 7, startOffset: -25, dueOffset: -18 },
    { title: '社員アンケート実施', description: '改善要望のヒアリング', projectId: 2, assigneeId: 9, startOffset: -22, dueOffset: -15 },
    { title: '新ポータル設計', description: 'IA設計とページ構成の策定', projectId: 2, assigneeId: 7, startOffset: -15, dueOffset: -8 },
    { title: 'SharePoint 環境構築', description: 'Microsoft 365 環境のセットアップ', projectId: 2, assigneeId: 8, startOffset: -8, dueOffset: 0 },
    { title: 'コンテンツ移行', description: '既存コンテンツの移行作業', projectId: 2, assigneeId: 9, startOffset: 0, dueOffset: 10 },
    { title: '社員向け説明会', description: '新ポータルの使い方説明会開催', projectId: 2, assigneeId: 7, startOffset: 10, dueOffset: 12 },

    // ========== AI チャットボット導入 ==========
    { title: 'FAQ データ整備', description: 'チャットボット学習用FAQデータの整理', projectId: 3, assigneeId: 9, startOffset: -10, dueOffset: -3 },
    { title: 'チャットボット選定', description: 'ベンダー比較と製品選定', projectId: 3, assigneeId: 3, startOffset: -12, dueOffset: -5 },
    { title: 'シナリオ設計', description: '会話フローとシナリオの設計', projectId: 3, assigneeId: 5, startOffset: -3, dueOffset: 5 },
    { title: 'チャットボット実装', description: 'Dialogflow での実装と学習', projectId: 3, assigneeId: 4, startOffset: 5, dueOffset: 18 },
    { title: 'Webサイト組み込み', description: '公式サイトへのウィジェット埋め込み', projectId: 3, assigneeId: 2, startOffset: 15, dueOffset: 20 },
    { title: '運用マニュアル作成', description: '管理者向け運用手順書の作成', projectId: 3, assigneeId: 9, startOffset: 18, dueOffset: 23 },

    // ========== データ分析基盤構築 ==========
    { title: 'データソース調査', description: '分析対象データの洗い出し', projectId: 4, assigneeId: 8, startOffset: -20, dueOffset: -12 },
    { title: 'アーキテクチャ設計', description: 'データパイプラインの設計', projectId: 4, assigneeId: 0, startOffset: -12, dueOffset: -5 },
    { title: 'AWS 環境構築', description: 'S3/Redshift/Glue のセットアップ', projectId: 4, assigneeId: 8, startOffset: -5, dueOffset: 8 },
    { title: 'ETL パイプライン開発', description: 'データ取り込み・変換処理の実装', projectId: 4, assigneeId: 0, startOffset: 5, dueOffset: 20 },
    { title: 'BIダッシュボード作成', description: 'Tableau でのダッシュボード構築', projectId: 4, assigneeId: 7, startOffset: 18, dueOffset: 28 },
    { title: 'データガバナンス策定', description: 'データ管理ポリシーの策定', projectId: 4, assigneeId: 3, startOffset: 20, dueOffset: 30 },

    // ========== セキュリティ強化 ==========
    { title: 'セキュリティ現状診断', description: '現行システムの脆弱性評価', projectId: 5, assigneeId: 8, startOffset: -15, dueOffset: -8 },
    { title: 'ISMS 文書整備', description: '情報セキュリティポリシーの更新', projectId: 5, assigneeId: 3, startOffset: -10, dueOffset: 0 },
    { title: 'EDR 導入', description: 'エンドポイント検知・対応ツールの導入', projectId: 5, assigneeId: 8, startOffset: -5, dueOffset: 10 },
    { title: 'SIEM 構築', description: 'セキュリティログ統合監視基盤の構築', projectId: 5, assigneeId: 0, startOffset: 5, dueOffset: 20 },
    { title: 'セキュリティ研修', description: '全社員向けセキュリティ教育の実施', projectId: 5, assigneeId: 9, startOffset: 15, dueOffset: 25 },
    { title: 'インシデント対応訓練', description: 'セキュリティインシデント対応の模擬訓練', projectId: 5, assigneeId: 8, startOffset: 22, dueOffset: 28 },

    // ========== レガシーシステム移行 ==========
    { title: '現行システム調査', description: 'レガシーシステムの機能・データ調査', projectId: 6, assigneeId: 0, startOffset: -30, dueOffset: -20 },
    { title: '移行計画策定', description: '段階的移行計画の立案', projectId: 6, assigneeId: 3, startOffset: -20, dueOffset: -12 },
    { title: 'クラウド環境設計', description: 'AWS/Azure でのインフラ設計', projectId: 6, assigneeId: 8, startOffset: -12, dueOffset: -5 },
    { title: 'アプリケーション移植', description: 'アプリケーションのリファクタリングと移植', projectId: 6, assigneeId: 2, startOffset: -5, dueOffset: 25 },
    { title: 'データ移行', description: '本番データの移行とバリデーション', projectId: 6, assigneeId: 0, startOffset: 20, dueOffset: 28 },
    { title: '並行稼働テスト', description: '新旧システムの並行稼働と検証', projectId: 6, assigneeId: 4, startOffset: 25, dueOffset: 35 },
    { title: '本番切り替え', description: '本番環境への切り替え作業', projectId: 6, assigneeId: 8, startOffset: 35, dueOffset: 38 },

    // ========== マーケティングオートメーション ==========
    { title: 'MAツール選定', description: 'HubSpot/Marketo/Pardot の比較検討', projectId: 7, assigneeId: 5, startOffset: -18, dueOffset: -10 },
    { title: 'カスタマージャーニー設計', description: '顧客接点とシナリオの設計', projectId: 7, assigneeId: 5, startOffset: -10, dueOffset: -3 },
    { title: 'HubSpot 環境構築', description: 'HubSpot の初期セットアップ', projectId: 7, assigneeId: 9, startOffset: -3, dueOffset: 5 },
    { title: 'リードスコアリング設計', description: 'リード評価基準の策定', projectId: 7, assigneeId: 5, startOffset: 3, dueOffset: 10 },
    { title: 'メール配信設定', description: 'ステップメールのシナリオ実装', projectId: 7, assigneeId: 9, startOffset: 8, dueOffset: 18 },
    { title: 'CRM 連携', description: 'Salesforce との連携設定', projectId: 7, assigneeId: 4, startOffset: 15, dueOffset: 22 },
    { title: 'レポート設計', description: 'KPI ダッシュボードの構築', projectId: 7, assigneeId: 7, startOffset: 20, dueOffset: 28 },

    // ========== 案件なし（未分類・全社タスク） ==========
    { title: '週次進捗報告書作成', description: '全プロジェクトの週次進捗まとめ', assigneeId: 3, startOffset: 0, dueOffset: 2 },
    { title: '新人研修カリキュラム更新', description: '来期の新人研修内容の見直し', assigneeId: 9, startOffset: -5, dueOffset: 10 },
    { title: '開発環境ドキュメント整備', description: '開発環境セットアップ手順の最新化', assigneeId: 2, startOffset: 0, dueOffset: 7 },
    { title: 'ライブラリバージョンアップ調査', description: '主要ライブラリの更新影響調査', assigneeId: 0, startOffset: 5, dueOffset: 12 },
    { title: 'コードレビューガイドライン策定', description: 'チーム共通のレビュー基準の策定', assigneeId: 4, startOffset: 3, dueOffset: 15 },
    { title: '技術ブログ記事執筆', description: '社内技術ブログへの投稿', assigneeId: 6, startOffset: 0, dueOffset: 14 },
    { title: '勉強会資料作成', description: '次回社内勉強会の発表資料準備', assigneeId: 1, startOffset: 7, dueOffset: 20 },
    { title: 'OSS コントリビュート', description: '使用OSSへのバグ修正PR作成', assigneeId: 2, startOffset: 10, dueOffset: 25 },
  ];

  const createdTodos = [];
  for (const todo of todos) {
    const data = {
      title: todo.title,
      description: todo.description,
      projectId: todo.projectId !== undefined ? createdProjects[todo.projectId].id : undefined,
      assigneeId: todo.assigneeId !== undefined ? createdUsers[todo.assigneeId].id : undefined,
      startDate: todo.startOffset !== undefined ? formatDate(addDays(today, todo.startOffset)) : undefined,
      dueDate: todo.dueOffset !== undefined ? formatDate(addDays(today, todo.dueOffset)) : undefined,
    };
    const result = await request('POST', '/api/todos', data);
    console.log(`  ✓ ${result.title}`);
    createdTodos.push(result);
  }

  // ========================================
  // 完了状態に変更（約30%を完了に）
  // ========================================
  console.log('\n=== 完了状態に変更 ===');
  // 過去の開始日のタスクを完了に
  const completedIndices = [0, 1, 2, 10, 11, 17, 18, 19, 23, 24, 29, 30, 35, 36, 42, 43, 44, 49, 50];
  for (const idx of completedIndices) {
    if (createdTodos[idx]) {
      const todo = createdTodos[idx];
      await request('PATCH', `/api/todos/${todo.id}/toggle`);
      console.log(`  ✓ 完了: ${todo.title}`);
    }
  }

  // ========================================
  // サマリー表示
  // ========================================
  console.log('\n' + '='.repeat(50));
  console.log('✅ サンプルデータの投入が完了しました！');
  console.log('='.repeat(50));
  console.log(`   👤 ユーザー: ${createdUsers.length}名`);
  console.log(`   📁 案件: ${createdProjects.length}件`);
  console.log(`   🎫 チケット: ${createdTodos.length}件（うち${completedIndices.length}件完了）`);
  console.log('\n📊 案件別チケット数:');

  const projectCounts = {};
  let noProjectCount = 0;
  for (const todo of todos) {
    if (todo.projectId !== undefined) {
      const pName = projects[todo.projectId].name;
      projectCounts[pName] = (projectCounts[pName] || 0) + 1;
    } else {
      noProjectCount++;
    }
  }
  for (const [name, count] of Object.entries(projectCounts)) {
    console.log(`   - ${name}: ${count}件`);
  }
  console.log(`   - 未分類: ${noProjectCount}件`);
}

seedData().catch(console.error);
