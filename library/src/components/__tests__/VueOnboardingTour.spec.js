import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import VueOnboardingTour from '@/components/VueOnboardingTour.vue'

describe('VueOnboardingTour', () => {
  const sampleSteps = [
    {
      target: '.step1',
      title: 'Step 1 Title',
      description: 'Step 1 Description',
      tag: 'Intro',
    },
    {
      target: '.step2',
      title: 'Step 2 Title',
      description: 'Step 2 Description',
    },
  ]
  let step1Element
  let step2Element
  const defaultProps = {
    tourId: 1,
    steps: sampleSteps,
    defaultTemplate: true,
    overlay: true,
    labelTerminate: 'End Tour',
  }

  const factory = (props = {}) => {
    return mount(VueOnboardingTour, {
      props: {
        ...defaultProps,
        ...props,
      },
    })
  }

  beforeEach(() => {
    // Create mock elements in the DOM to represent step targets
    step1Element = document.createElement('div')
    step1Element.className = 'step1'
    step1Element.style.position = 'absolute'
    step1Element.style.top = '100px'
    step1Element.style.left = '100px'
    document.body.appendChild(step1Element)

    step2Element = document.createElement('div')
    step2Element.className = 'step2'
    step2Element.style.position = 'absolute'
    step2Element.style.top = '200px'
    step2Element.style.left = '200px'
    document.body.appendChild(step2Element)
  })

  afterEach(() => {
    // Remove mock elements from the DOM after each test
    document.body.removeChild(step1Element)
    document.body.removeChild(step2Element)
  })

  it('renders correctly when displayTour is true', async () => {
    const wrapper = factory()
    wrapper.vm.startTour()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="onboardingTour"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="stepTitle"]').text()).toBe(sampleSteps[0].title)
    expect(wrapper.find('[data-test="stepDescription"]').text()).toBe(sampleSteps[0].description)
  })

  it('renders next step when goNextStep is called', async () => {
    const wrapper = factory()
    wrapper.vm.startTour()
    await wrapper.vm.$nextTick()

    wrapper.vm.goNextStep()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.currentStepIndex).toBe(1)
    expect(wrapper.find('[data-test="stepTitle"]').text()).toBe(sampleSteps[1].title)
  })

  it('renders previous step when goPreviousStep is called', async () => {
    const wrapper = factory()
    wrapper.vm.startTour()
    wrapper.vm.setStep(1)
    await wrapper.vm.$nextTick()

    wrapper.vm.goPreviousStep()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.currentStepIndex).toBe(0)
    expect(wrapper.find('[data-test="stepTitle"]').text()).toBe(sampleSteps[0].title)
  })

  it('emits startTour event when startTour is called', async () => {
    const wrapper = factory()
    wrapper.vm.startTour()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('startTour')).toBeTruthy()
    expect(wrapper.vm.displayTour).toBe(true)
  })

  it('emits endTour event and hides tour when endTour is called', async () => {
    const wrapper = factory()
    wrapper.vm.startTour()
    await wrapper.vm.$nextTick()

    wrapper.vm.endTour()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('endTour')).toBeTruthy()
    expect(wrapper.vm.displayTour).toBe(false)
  })

  it('displays terminate label on last step and ends tour on click', async () => {
    const wrapper = factory()
    wrapper.vm.startTour()
    wrapper.vm.setStep(1)
    await wrapper.vm.$nextTick()

    const terminateButton = wrapper.find('[data-test="terminateTourButton"]')
    expect(terminateButton.exists()).toBe(true)
    expect(terminateButton.text()).toBe('End Tour')

    await terminateButton.trigger('click')
    expect(wrapper.vm.displayTour).toBe(false)
  })
})
