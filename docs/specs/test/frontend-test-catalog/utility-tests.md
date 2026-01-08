# ユーティリティテストケース

[← 目次に戻る](./README.md)

---

## 1. filter.ts テストケース

> **ファイル**: `src/frontend/src/types/filter.spec.ts`

### 1.1 initialFilterState

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| UF-001 | 初期値がすべてデフォルト値である | 正常系 | completed='all', その他null |

### 1.2 initialSortState

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| UF-002 | 初期値がid昇順である | 正常系 | key='id', order='asc' |

### 1.3 initialTableViewState

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| UF-003 | 初期値が空の検索キーワードと初期フィルタ・ソートである | 正常系 | searchKeyword='', filter/sort初期値 |

### 1.4 TODO_TABLE_COLUMNS

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| UF-004 | 9列の定義がある | 正常系 | length=9 |
| UF-005 | 各列にkey, label, width, sortableプロパティがある | 正常系 | 全列に必須プロパティ |
| UF-006 | descriptionはソート不可である | 正常系 | sortable=false |
| UF-007 | id, title, assigneeName, startDate, dueDate, completedはソート可能である | 正常系 | sortable=true |

### 1.5 COMPLETED_FILTER_OPTIONS

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| UF-008 | 3つのオプションがある | 正常系 | length=3 |
| UF-009 | all, pending, completedの値を持つ | 正常系 | 3つの値が存在 |
| UF-010 | 各オプションにlabelがある | 正常系 | 全オプションにlabel |

### 1.6 isFilterEmpty

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| UF-011 | 初期状態のフィルタでtrueを返す | 正常系 | true |
| UF-012 | completedがall以外の場合falseを返す | 正常系 | false |
| UF-013 | assigneeIdが設定されている場合falseを返す | 正常系 | false |
| UF-014 | projectIdが設定されている場合falseを返す | 正常系 | false |
| UF-015 | startDateFromが設定されている場合falseを返す | 正常系 | false |
| UF-016 | dueDateToが設定されている場合falseを返す | 正常系 | false |

### 1.7 resetFilter

| ID | テストケース | 分類 | 期待結果 |
|----|-------------|------|----------|
| UF-017 | 初期状態のフィルタを返す | 正常系 | initialFilterStateと同値 |
| UF-018 | 新しいオブジェクトを返す（参照が異なる） | 正常系 | 異なる参照 |

---

[← 目次に戻る](./README.md)
