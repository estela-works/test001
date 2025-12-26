import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoSearchForm from './TodoSearchForm.vue'

describe('TodoSearchForm', () => {
  it('検索入力フィールドを表示する', () => {
    const wrapper = mount(TodoSearchForm, {
      props: {
        keyword: ''
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toContain('検索')
  })

  it('初期キーワードが入力フィールドに反映される', () => {
    const wrapper = mount(TodoSearchForm, {
      props: {
        keyword: 'テスト検索'
      }
    })

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('テスト検索')
  })

  it('入力時にsearchイベントが発火する', async () => {
    const wrapper = mount(TodoSearchForm, {
      props: {
        keyword: ''
      }
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('新しい検索')

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')![0]).toEqual(['新しい検索'])
  })

  it('キーワードがある時にクリアボタンが表示される', async () => {
    const wrapper = mount(TodoSearchForm, {
      props: {
        keyword: ''
      }
    })

    // 初期状態ではクリアボタンは非表示
    expect(wrapper.find('.clear-btn').exists()).toBe(false)

    // キーワードを入力
    await wrapper.find('input').setValue('テスト')

    // クリアボタンが表示される
    expect(wrapper.find('.clear-btn').exists()).toBe(true)
  })

  it('クリアボタンクリックでキーワードがクリアされる', async () => {
    const wrapper = mount(TodoSearchForm, {
      props: {
        keyword: 'テスト'
      }
    })

    // クリアボタンをクリック
    await wrapper.find('.clear-btn').trigger('click')

    // searchイベントが空文字列で発火
    const searchEvents = wrapper.emitted('search')
    expect(searchEvents).toBeTruthy()
    const lastEvent = searchEvents![searchEvents!.length - 1]
    expect(lastEvent).toEqual([''])
  })

  it('propsのkeywordが変更されると入力フィールドが更新される', async () => {
    const wrapper = mount(TodoSearchForm, {
      props: {
        keyword: '初期値'
      }
    })

    await wrapper.setProps({ keyword: '更新された値' })

    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('更新された値')
  })
})
