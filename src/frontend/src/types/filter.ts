/**
 * フィルタ条件の状態
 * チケット一覧画面のフィルタパネルで使用
 */
export interface FilterState {
  /** 完了状態フィルタ: 'all' | 'pending' | 'completed' */
  completed: CompletedFilter

  /** 担当者IDフィルタ: null = すべて */
  assigneeId: number | null

  /** 案件IDフィルタ: null = すべて */
  projectId: number | null

  /** 開始日フィルタ（開始）: YYYY-MM-DD形式 */
  startDateFrom: string | null

  /** 開始日フィルタ（終了）: YYYY-MM-DD形式 */
  startDateTo: string | null

  /** 終了日フィルタ（開始）: YYYY-MM-DD形式 */
  dueDateFrom: string | null

  /** 終了日フィルタ（終了）: YYYY-MM-DD形式 */
  dueDateTo: string | null
}

/**
 * 完了状態フィルタの値
 */
export type CompletedFilter = 'all' | 'pending' | 'completed'

/**
 * ソート可能な列キー
 */
export type SortKey =
  | 'id'
  | 'title'
  | 'description'
  | 'assigneeName'
  | 'projectId'
  | 'startDate'
  | 'dueDate'
  | 'completed'
  | 'createdAt'

/**
 * ソート順序
 */
export type SortOrder = 'asc' | 'desc'

/**
 * ソート状態
 */
export interface SortState {
  /** ソートキー */
  key: SortKey

  /** ソート順序 */
  order: SortOrder
}

/**
 * テーブル列定義
 */
export interface TableColumn {
  /** 列キー（データフィールド名） */
  key: SortKey

  /** 列ラベル（表示名） */
  label: string

  /** 列幅 */
  width: string

  /** ソート可能か */
  sortable: boolean
}

/**
 * 検索・フィルタ・ソート統合状態
 * チケット一覧画面のビューで使用
 */
export interface TableViewState {
  /** 検索キーワード */
  searchKeyword: string

  /** フィルタ条件 */
  filter: FilterState

  /** ソート状態 */
  sort: SortState
}

/**
 * フィルタ初期状態
 */
export const initialFilterState: FilterState = {
  completed: 'all',
  assigneeId: null,
  projectId: null,
  startDateFrom: null,
  startDateTo: null,
  dueDateFrom: null,
  dueDateTo: null
}

/**
 * ソート初期状態
 */
export const initialSortState: SortState = {
  key: 'id',
  order: 'asc'
}

/**
 * テーブルビュー初期状態
 */
export const initialTableViewState: TableViewState = {
  searchKeyword: '',
  filter: initialFilterState,
  sort: initialSortState
}

/**
 * チケット一覧テーブルの列定義
 */
export const TODO_TABLE_COLUMNS: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px', sortable: true },
  { key: 'title', label: 'タイトル', width: 'auto', sortable: true },
  { key: 'description', label: '説明', width: '200px', sortable: false },
  { key: 'assigneeName', label: '担当者', width: '100px', sortable: true },
  { key: 'projectId', label: '案件', width: '120px', sortable: true },
  { key: 'startDate', label: '開始日', width: '100px', sortable: true },
  { key: 'dueDate', label: '終了日', width: '100px', sortable: true },
  { key: 'completed', label: '状態', width: '80px', sortable: true },
  { key: 'createdAt', label: '作成日', width: '100px', sortable: true }
]

/**
 * 完了状態フィルタの選択肢
 */
export const COMPLETED_FILTER_OPTIONS = [
  { value: 'all' as const, label: 'すべて' },
  { value: 'pending' as const, label: '未完了' },
  { value: 'completed' as const, label: '完了済み' }
]

/**
 * フィルタが初期状態かどうかを判定する
 * @param filter - フィルタ状態
 * @returns 初期状態の場合true
 */
export function isFilterEmpty(filter: FilterState): boolean {
  return (
    filter.completed === 'all' &&
    filter.assigneeId === null &&
    filter.projectId === null &&
    filter.startDateFrom === null &&
    filter.startDateTo === null &&
    filter.dueDateFrom === null &&
    filter.dueDateTo === null
  )
}

/**
 * フィルタをリセットする
 * @returns 初期状態のフィルタ
 */
export function resetFilter(): FilterState {
  return { ...initialFilterState }
}
