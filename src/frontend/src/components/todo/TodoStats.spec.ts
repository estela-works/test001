import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoStats from './TodoStats.vue'

describe('TodoStats', () => {
  it('統計情報を正しく表示する', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 10,
        completed: 4,
        pending: 6
      }
    })

    expect(wrapper.text()).toContain('総数: 10')
    expect(wrapper.text()).toContain('完了: 4')
    expect(wrapper.text()).toContain('未完了: 6')
  })

  it('すべて0の場合も正しく表示する', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 0,
        completed: 0,
        pending: 0
      }
    })

    expect(wrapper.text()).toContain('総数: 0')
    expect(wrapper.text()).toContain('完了: 0')
    expect(wrapper.text()).toContain('未完了: 0')
  })

  it('statsクラスが適用される', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 5,
        completed: 2,
        pending: 3
      }
    })

    expect(wrapper.find('.stats').exists()).toBe(true)
  })

  it('strong要素で数値が強調される', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 7,
        completed: 3,
        pending: 4
      }
    })

    const strongElements = wrapper.findAll('strong')
    expect(strongElements).toHaveLength(3)
    expect(strongElements[0].text()).toBe('7')
    expect(strongElements[1].text()).toBe('3')
    expect(strongElements[2].text()).toBe('4')
  })
})
