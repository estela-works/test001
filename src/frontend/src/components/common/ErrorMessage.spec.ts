import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorMessage from './ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('messageがnullの場合、何も表示しない', () => {
    const wrapper = mount(ErrorMessage, {
      props: {
        message: null
      }
    })

    expect(wrapper.find('.error').exists()).toBe(false)
  })

  it('messageがある場合、エラーメッセージを表示する', () => {
    const wrapper = mount(ErrorMessage, {
      props: {
        message: 'エラーが発生しました'
      }
    })

    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.text()).toContain('エラーが発生しました')
  })

  it('正しいスタイルクラスが適用される', () => {
    const wrapper = mount(ErrorMessage, {
      props: {
        message: 'テストエラー'
      }
    })

    expect(wrapper.find('.error').exists()).toBe(true)
  })
})
