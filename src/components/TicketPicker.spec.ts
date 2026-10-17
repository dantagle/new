import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { TicketQuantities } from '@/domain/types'
import TicketPicker from './TicketPicker.vue'

const prices = { adult: 45000, child: 30000, senior: 35000 }
const none: TicketQuantities = { adult: 0, child: 0, senior: 0 }

// vs React: Vue Test Utils' mount() is like Testing Library's render(). v-model is just the
// `modelValue` prop plus the `onUpdate:modelValue` listener, so the test plays the parent and
// feeds every emitted value back in with setProps.
function mountPicker(quantities: TicketQuantities = none, maxTickets = 10) {
  const wrapper = mount(TicketPicker, {
    props: {
      modelValue: quantities,
      'onUpdate:modelValue': (value: TicketQuantities) => wrapper.setProps({ modelValue: value }),
      prices,
      maxTickets,
    },
  })
  return wrapper
}

describe('TicketPicker', () => {
  it('shows every ticket kind with its price', () => {
    const text = mountPicker().text()
    expect(text).toContain('Adulto $450.00')
    expect(text).toContain('Niño $300.00')
    expect(text).toContain('Adulto mayor $350.00')
  })

  it('emits new quantities without mutating the ones it received', async () => {
    const quantities = { ...none }
    const wrapper = mountPicker(quantities)

    await wrapper.get('[aria-label="Agregar Adulto"]').trigger('click')
    await wrapper.get('[aria-label="Agregar Adulto"]').trigger('click')

    const emitted = wrapper.emitted('update:modelValue') ?? []
    expect(emitted[emitted.length - 1]).toEqual([{ adult: 2, child: 0, senior: 0 }])
    expect(wrapper.get('[aria-label="Boletos Adulto"]').text()).toBe('2')
    expect(quantities).toEqual(none)
  })

  it('cannot go below zero', () => {
    const wrapper = mountPicker()
    expect(wrapper.get('[aria-label="Quitar Niño"]').attributes()).toHaveProperty('disabled')
  })

  it('disables every "+" once the total reaches maxTickets', () => {
    const wrapper = mountPicker({ adult: 2, child: 1, senior: 0 }, 3)
    const addButtons = wrapper.findAll('button[aria-label^="Agregar"]')
    expect(addButtons).toHaveLength(3)
    for (const button of addButtons) {
      expect(button.attributes()).toHaveProperty('disabled')
    }
    expect(wrapper.get('[aria-label="Quitar Adulto"]').attributes()).not.toHaveProperty('disabled')
  })
})
