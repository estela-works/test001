import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoTableRow from './TodoTableRow.vue'
import type { Todo, Project } from '@/types'

describe('TodoTableRow', () => {
  const mockTodo: Todo = {
    id: 1,
    title: 'テストタスク',
    description: 'これはテスト用の説明です',
    completed: false,
    startDate: '2024-01-15',
    dueDate: '2024-01-31',
    projectId: 1,
    assigneeId: 1,
    assigneeName: '田中太郎',
    createdAt: '2024-01-01T00:00:00Z'
  }

  const mockProjects: Project[] = [
    { id: 1, name: 'プロジェクトA', description: null, createdAt: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'プロジェクトB', description: null, createdAt: '2024-01-01T00:00:00Z' }
  ]

  it('チケット情報を表示する', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: mockTodo,
        projects: mockProjects
      }
    })

    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('テストタスク')
    expect(wrapper.text()).toContain('田中太郎')
    expect(wrapper.text()).toContain('プロジェクトA')
  })

  it('日付をYYYY/MM/DD形式で表示する', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: mockTodo,
        projects: mockProjects
      }
    })

    expect(wrapper.text()).toContain('2024/01/15')
    expect(wrapper.text()).toContain('2024/01/31')
  })

  it('未完了のチケットは「未完了」バッジを表示する', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: { ...mockTodo, completed: false },
        projects: mockProjects
      }
    })

    const badge = wrapper.find('.status-badge')
    expect(badge.text()).toBe('未完了')
    expect(badge.classes()).toContain('pending')
  })

  it('完了したチケットは「完了」バッジを表示する', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: { ...mockTodo, completed: true },
        projects: mockProjects
      }
    })

    const badge = wrapper.find('.status-badge')
    expect(badge.text()).toBe('完了')
    expect(badge.classes()).toContain('done')
  })

  it('完了したチケットの行にcompletedクラスが適用される', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: { ...mockTodo, completed: true },
        projects: mockProjects
      }
    })

    expect(wrapper.find('tr').classes()).toContain('completed')
  })

  it('チェックボックスクリックでtoggleイベントが発火する', async () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: mockTodo,
        projects: mockProjects
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.trigger('change')

    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')![0]).toEqual([1])
  })

  it('削除ボタンクリックでdeleteイベントが発火する', async () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: mockTodo,
        projects: mockProjects
      }
    })

    const deleteBtn = wrapper.find('.delete-btn')
    await deleteBtn.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([1])
  })

  it('説明が30文字を超える場合は省略表示する', () => {
    const longDescription = 'これは30文字を超える非常に長い説明文です。省略されるはずです。'
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: { ...mockTodo, description: longDescription },
        projects: mockProjects
      }
    })

    const descCell = wrapper.find('.col-description')
    expect(descCell.text()).toContain('...')
    // 30文字 + '...'(3文字) = 33文字以下
    expect(descCell.text().length).toBeLessThanOrEqual(33)
  })

  it('projectIdがnullの場合は「-」を表示する', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: { ...mockTodo, projectId: null },
        projects: mockProjects
      }
    })

    const projectCell = wrapper.find('.col-projectId')
    expect(projectCell.text()).toBe('-')
  })

  it('assigneeNameがnullの場合は「-」を表示する', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: { ...mockTodo, assigneeName: null },
        projects: mockProjects
      }
    })

    const assigneeCell = wrapper.find('.col-assigneeName')
    expect(assigneeCell.text()).toBe('-')
  })

  it('descriptionがnullの場合は「-」を表示する', () => {
    const wrapper = mount(TodoTableRow, {
      props: {
        todo: { ...mockTodo, description: null },
        projects: mockProjects
      }
    })

    const descCell = wrapper.find('.col-description')
    expect(descCell.text()).toBe('-')
  })
})
