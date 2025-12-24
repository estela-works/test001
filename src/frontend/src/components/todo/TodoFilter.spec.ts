import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoFilter from './TodoFilter.vue'

describe('TodoFilter', () => {
  it('3つのフィルタボタンを表示する', () => {
    const wrapper = mount(TodoFilter, {
      props: {
        modelValue: 'all'
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].text()).toBe('すべて')
    expect(buttons[1].text()).toBe('未完了')
    expect(buttons[2].text()).toBe('完了済み')
  })

  it('選択中のフィルタにactiveクラスが適用される', () => {
    const wrapper = mount(TodoFilter, {
      props: {
        modelValue: 'pending'
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).not.toContain('active')
    expect(buttons[1].classes()).toContain('active')
    expect(buttons[2].classes()).not.toContain('active')
  })

  it('ボタンクリックでupdate:modelValueイベントが発火する', async () => {
    const wrapper = mount(TodoFilter, {
      props: {
        modelValue: 'all'
      }
    })

    const buttons = wrapper.findAll('button')

    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['pending'])

    await buttons[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')![1]).toEqual(['completed'])

    await buttons[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')![2]).toEqual(['all'])
  })

  it('completedが選択されている場合、完了済みボタンがアクティブ', () => {
    const wrapper = mount(TodoFilter, {
      props: {
        modelValue: 'completed'
      }
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[2].classes()).toContain('active')
  })
})
