# SC-005: チケット一覧画面 - イベント詳細

> **ドキュメント種別**: 最新仕様（継続的にメンテナンス）

## イベント一覧

| イベントID | イベント名 | トリガー |
|-----------|-----------|---------|
| EV-005-01 | 初期読込 | ページロード |
| EV-005-02 | キーワード検索 | 検索フォーム入力 |
| EV-005-03 | フィルタパネル開閉 | フィルタボタン |
| EV-005-04 | フィルタ条件変更 | フィルタ項目変更 |
| EV-005-05 | フィルタリセット | リセットボタン |
| EV-005-06 | ソート変更 | カラムヘッダークリック |
| EV-005-07 | 完了状態切替 | 完了ボタン |
| EV-005-08 | チケット削除 | 削除ボタン |

---

## EV-005-01: 初期読込

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-01 |
| イベント名 | 初期読込 |
| トリガー | ページロード（onMounted） |
| 処理概要 | チケット・ユーザー・案件一覧を並列で取得 |

### 処理フロー

```
1. onMounted発火
2. 並列でデータ取得
   ├── userStore.fetchUsers()
   └── projectStore.fetchProjects()
3. URLパラメータ確認
   ├── projectId あり → filter.projectId設定 + todoStore.fetchTodos(projectId)
   └── projectId なし → todoStore.fetchTodos()
4. 取得完了、画面表示
```

### 使用API

| API | メソッド | 条件 |
|-----|---------|------|
| /api/users | GET | 常に |
| /api/projects | GET | 常に |
| /api/todos | GET | projectIdなし |
| /api/todos?projectId={id} | GET | projectIdあり |

---

## EV-005-02: キーワード検索

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-02 |
| イベント名 | キーワード検索 |
| トリガー | TodoSearchFormからのsearchイベント |
| 処理概要 | タイトル・説明でフィルタリング |

### 処理フロー

```
1. TodoSearchFormからキーワード受信
2. searchKeyword.value を更新
3. computed（filteredAndSortedTodos）が再計算
   - keyword.toLowerCase()で正規化
   - title.toLowerCase().includes(keyword) でマッチ判定
   - description?.toLowerCase().includes(keyword) でマッチ判定
4. 表示更新
```

### フィルタ条件

- 大文字小文字区別なし
- 部分一致
- タイトルまたは説明のいずれかにマッチ

---

## EV-005-03: フィルタパネル開閉

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-03 |
| イベント名 | フィルタパネル開閉 |
| トリガー | フィルタボタンクリック |
| 処理概要 | フィルタパネルの表示/非表示を切替 |

### 処理フロー

```
1. フィルタボタンクリック
2. showFilter.value = !showFilter.value
3. v-if="showFilter" でパネル表示切替
```

---

## EV-005-04: フィルタ条件変更

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-04 |
| イベント名 | フィルタ条件変更 |
| トリガー | TodoTableFilterからのupdate:filterイベント |
| 処理概要 | フィルタ条件を更新してリスト再計算 |

### 処理フロー

```
1. TodoTableFilterから新しいフィルタ条件受信
2. handleFilterChange(newFilter) 実行
3. filter.value = { ...newFilter }
4. computed（filteredAndSortedTodos）が再計算
   - 完了状態フィルタ適用
   - 担当者フィルタ適用
   - 案件フィルタ適用
   - 開始日期間フィルタ適用
   - 終了日期間フィルタ適用
5. 表示更新
```

### フィルタ適用順序

1. キーワード検索
2. 完了状態（all / pending / completed）
3. 担当者（assigneeId）
4. 案件（projectId）
5. 開始日From（startDate >= 指定日）
6. 開始日To（startDate <= 指定日）
7. 終了日From（dueDate >= 指定日）
8. 終了日To（dueDate <= 指定日）

---

## EV-005-05: フィルタリセット

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-05 |
| イベント名 | フィルタリセット |
| トリガー | TodoTableFilterからのresetイベント |
| 処理概要 | 全フィルタ条件を初期状態に戻す |

### 処理フロー

```
1. TodoTableFilterからresetイベント受信
2. handleFilterReset() 実行
3. filter.value = { ...initialFilterState }
4. computed（filteredAndSortedTodos）が再計算
5. 表示更新（全件表示）
```

### 初期状態

```typescript
{
  completed: 'all',
  assigneeId: null,
  projectId: null,
  startDateFrom: null,
  startDateTo: null,
  dueDateFrom: null,
  dueDateTo: null
}
```

---

## EV-005-06: ソート変更

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-06 |
| イベント名 | ソート変更 |
| トリガー | TodoTableからのsortイベント（カラムヘッダークリック） |
| 処理概要 | ソート順を変更してリスト再計算 |

### 処理フロー

```
1. TodoTableからソートキー受信
2. handleSortChange(key) 実行
3. 同じカラムの場合
   - sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
4. 別カラムの場合
   - sortKey.value = key
   - sortOrder.value = 'asc'
5. computed（filteredAndSortedTodos）が再計算
6. 表示更新
```

### ソートキー

| キー | 対象フィールド |
|------|---------------|
| id | todo.id |
| title | todo.title |
| assigneeName | todo.assigneeName |
| projectName | todo.projectName |
| startDate | todo.startDate |
| dueDate | todo.dueDate |

### null値の扱い

- null/undefined値は常に末尾に配置

---

## EV-005-07: 完了状態切替

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-07 |
| イベント名 | 完了状態切替 |
| トリガー | TodoTableからのtoggleイベント |
| 処理概要 | チケットの完了状態をトグル |

### 処理フロー

```
1. TodoTableからチケットID受信
2. handleToggle(id) 実行
3. todoStore.toggleTodo(id) 呼び出し
4. PATCH /api/todos/{id}/toggle 実行
5. ストア更新、表示更新
```

### 使用API

| API | メソッド |
|-----|---------|
| /api/todos/{id}/toggle | PATCH |

### エラー処理

- console.error でエラーログ出力
- ユーザーへの通知なし（サイレント）

---

## EV-005-08: チケット削除

### 概要

| 項目 | 内容 |
|------|------|
| イベントID | EV-005-08 |
| イベント名 | チケット削除 |
| トリガー | TodoTableからのdeleteイベント |
| 処理概要 | 確認後、チケットを削除 |

### 処理フロー

```
1. TodoTableからチケットID受信
2. handleDelete(id) 実行
3. confirm('このチケットを削除しますか？') 表示
4. キャンセル → 処理終了
5. OK → todoStore.deleteTodo(id) 呼び出し
6. DELETE /api/todos/{id} 実行
7. ストア更新、表示更新
```

### 使用API

| API | メソッド |
|-----|---------|
| /api/todos/{id} | DELETE |

### 確認ダイアログ

- ブラウザ標準のconfirmダイアログ使用
- メッセージ: 「このチケットを削除しますか？」

### エラー処理

- console.error でエラーログ出力
- ユーザーへの通知なし（サイレント）

---

## 更新履歴

| 日付 | 変更内容 | 関連案件 |
|------|----------|----------|
| 2025-12-26 | 初版作成 | 20251226_チケット一覧画面 |
