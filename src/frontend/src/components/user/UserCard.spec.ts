import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  const mockUser = {
    id: 1,
    name: 'テストユーザー',
    createdAt: '2025-01-15T10:30:00'
  }

  it('ユーザー名を表示する', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    expect(wrapper.find('h3').text()).toBe('テストユーザー')
  })

  it('登録日をフォーマットして表示する', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    expect(wrapper.text()).toContain('登録日:')
    expect(wrapper.text()).toContain('2025')
  })

  it('削除ボタンが表示される', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    const deleteButton = wrapper.find('.delete-btn')
    expect(deleteButton.exists()).toBe(true)
    expect(deleteButton.text()).toBe('削除')
  })

  it('確認ダイアログでOKを押すとdeleteイベントが発火する', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    await wrapper.find('.delete-btn').trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')![0]).toEqual([1])

    vi.restoreAllMocks()
  })

  it('確認ダイアログでキャンセルを押すとdeleteイベントは発火しない', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      }
    })

    await wrapper.find('.delete-btn').trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(wrapper.emitted('delete')).toBeFalsy()

    vi.restoreAllMocks()
  })
})
