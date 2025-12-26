import { describe, it, expect } from 'vitest'
import {
  initialFilterState,
  initialSortState,
  initialTableViewState,
  TODO_TABLE_COLUMNS,
  COMPLETED_FILTER_OPTIONS,
  isFilterEmpty,
  resetFilter
} from './filter'
import type { FilterState } from './filter'

describe('filter.ts', () => {
  describe('initialFilterState', () => {
    it('初期値がすべてデフォルト値である', () => {
      expect(initialFilterState.completed).toBe('all')
      expect(initialFilterState.assigneeId).toBeNull()
      expect(initialFilterState.projectId).toBeNull()
      expect(initialFilterState.startDateFrom).toBeNull()
      expect(initialFilterState.startDateTo).toBeNull()
      expect(initialFilterState.dueDateFrom).toBeNull()
      expect(initialFilterState.dueDateTo).toBeNull()
    })
  })

  describe('initialSortState', () => {
    it('初期値がid昇順である', () => {
      expect(initialSortState.key).toBe('id')
      expect(initialSortState.order).toBe('asc')
    })
  })

  describe('initialTableViewState', () => {
    it('初期値が空の検索キーワードと初期フィルタ・ソートである', () => {
      expect(initialTableViewState.searchKeyword).toBe('')
      expect(initialTableViewState.filter).toEqual(initialFilterState)
      expect(initialTableViewState.sort).toEqual(initialSortState)
    })
  })

  describe('TODO_TABLE_COLUMNS', () => {
    it('9列の定義がある', () => {
      expect(TODO_TABLE_COLUMNS).toHaveLength(9)
    })

    it('各列にkey, label, width, sortableプロパティがある', () => {
      TODO_TABLE_COLUMNS.forEach((column) => {
        expect(column).toHaveProperty('key')
        expect(column).toHaveProperty('label')
        expect(column).toHaveProperty('width')
        expect(column).toHaveProperty('sortable')
      })
    })

    it('descriptionはソート不可である', () => {
      const descriptionColumn = TODO_TABLE_COLUMNS.find((c) => c.key === 'description')
      expect(descriptionColumn?.sortable).toBe(false)
    })

    it('id, title, assigneeName, startDate, dueDate, completedはソート可能である', () => {
      const sortableKeys = ['id', 'title', 'assigneeName', 'startDate', 'dueDate', 'completed']
      sortableKeys.forEach((key) => {
        const column = TODO_TABLE_COLUMNS.find((c) => c.key === key)
        expect(column?.sortable).toBe(true)
      })
    })
  })

  describe('COMPLETED_FILTER_OPTIONS', () => {
    it('3つのオプションがある', () => {
      expect(COMPLETED_FILTER_OPTIONS).toHaveLength(3)
    })

    it('all, pending, completedの値を持つ', () => {
      const values = COMPLETED_FILTER_OPTIONS.map((o) => o.value)
      expect(values).toContain('all')
      expect(values).toContain('pending')
      expect(values).toContain('completed')
    })

    it('各オプションにlabelがある', () => {
      COMPLETED_FILTER_OPTIONS.forEach((option) => {
        expect(option.label).toBeTruthy()
      })
    })
  })

  describe('isFilterEmpty', () => {
    it('初期状態のフィルタでtrueを返す', () => {
      expect(isFilterEmpty(initialFilterState)).toBe(true)
    })

    it('completedがall以外の場合falseを返す', () => {
      const filter: FilterState = { ...initialFilterState, completed: 'pending' }
      expect(isFilterEmpty(filter)).toBe(false)
    })

    it('assigneeIdが設定されている場合falseを返す', () => {
      const filter: FilterState = { ...initialFilterState, assigneeId: 1 }
      expect(isFilterEmpty(filter)).toBe(false)
    })

    it('projectIdが設定されている場合falseを返す', () => {
      const filter: FilterState = { ...initialFilterState, projectId: 1 }
      expect(isFilterEmpty(filter)).toBe(false)
    })

    it('startDateFromが設定されている場合falseを返す', () => {
      const filter: FilterState = { ...initialFilterState, startDateFrom: '2024-01-01' }
      expect(isFilterEmpty(filter)).toBe(false)
    })

    it('dueDateToが設定されている場合falseを返す', () => {
      const filter: FilterState = { ...initialFilterState, dueDateTo: '2024-12-31' }
      expect(isFilterEmpty(filter)).toBe(false)
    })
  })

  describe('resetFilter', () => {
    it('初期状態のフィルタを返す', () => {
      const result = resetFilter()
      expect(result).toEqual(initialFilterState)
    })

    it('新しいオブジェクトを返す（参照が異なる）', () => {
      const result = resetFilter()
      expect(result).not.toBe(initialFilterState)
    })
  })
})
