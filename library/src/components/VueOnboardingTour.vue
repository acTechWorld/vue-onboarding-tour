<template>
  <div
    v-if="displayOnboardingTour"
    data-test="onboardingTour"
    class="vueOnboardingTour"
    :class="{ 'fixed z-[9999] h-full w-full': overlay }"
  >
    <!-- Overlay Background -->
    <div v-if="overlay" :style="styleOverlay" data-test="overlay" class="overlay"></div>

    <!-- Popup Container -->
    <div
      ref="popup"
      :style="stylePopup"
      :class="[targetElementVisible ? 'opacity-100' : 'opacity-0']"
      class="popupContainer z-[9999] fixed"
      data-test="popupContainer"
    >
      <!-- Slot for Custom Content -->
      <slot :currentStep="currentStep" :currentStepIndex="currentStepIndex"></slot>

      <!-- Default Template Content -->
      <div
        v-if="defaultTemplate"
        class="defaultTemplateContent flex w-[320px] flex-col gap-4 rounded-lg bg-white p-6 shadow-lg border border-gray-200 relative max-w-full"
        data-test="defaultTemplateContent"
      >
        <!-- Chevron (Arrow Pointer) -->
        <span
          class="chevronPointer w-4 h-4 absolute bg-white rotate-45"
          :class="styleChevron"
          data-test="chevronPointer"
        ></span>

        <!-- Step Tag (Optional) -->
        <div
          v-if="currentStep?.tag"
          class="stepTag text-xs font-medium text-gray-500 uppercase tracking-wider"
          data-test="stepTag"
        >
          {{ currentStep.tag }}
        </div>

        <!-- Close Icon -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 384 512"
          class="closeIcon absolute top-4 right-4 cursor-pointer w-5 h-5 fill-gray-500 hover:fill-gray-700 transition-colors"
          @click="endTour"
          data-test="closeIcon"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
        </svg>

        <!-- Step Title -->
        <div
          v-if="currentStep?.title"
          v-html="DOMPurify.sanitize(currentStep.title)"
          class="stepTitle text-lg font-semibold text-gray-900"
          data-test="stepTitle"
        />

        <!-- Step Description -->
        <div
          v-if="currentStep?.description"
          v-html="DOMPurify.sanitize(currentStep.description)"
          class="stepDescription text-sm text-gray-600 leading-relaxed"
          data-test="stepDescription"
        />

        <!-- Navigation and Control -->
        <div class="navigationControls flex w-full items-center mt-4" data-test="navigationControls">
          <!-- Previous Step Icon -->
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 320 512"
            v-if="isPreviousStepEnabled"
            class="previousStepIcon mr-auto cursor-pointer fill-gray-500 hover:fill-gray-700 transition-colors w-4 h-4"
            @click="goPreviousStep"
            data-test="previousStepIcon"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
          </svg>

          <!-- Step Indicators (Dots) -->
          <div class="stepIndicators flex flex-1 justify-center gap-2" data-test="stepIndicators">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512"
              v-for="(_, idx) in steps.length"
              :key="`dot_step_${idx}`"
              :class=" `stepIndicator_${idx}`"
              class="cursor-pointer w-2 h-2"
              @click="setStep(idx)"
              :data-test="`stepIndicator_${idx}`"
            >
              <path :fill="idx === currentStepIndex ? '#3b82f6' : '#d1d5db'" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
            </svg>
          </div>

          <!-- Next Step Icon / End Tour -->
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 320 512"
            v-if="isNextStepEnabled"
            class="nextStepIcon ml-auto cursor-pointer fill-gray-500 hover:fill-gray-700 transition-colors w-4 h-4"
            @click="goNextStep"
            data-test="nextStepIcon"
          >
            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
          </svg>
          <span
            v-else
            class="terminateTourButton ml-auto cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition-colors"
            @click="endTour"
            data-test="terminateTourButton"
          >
            {{ props.labelTerminate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type MaybeElement, useElementBounding } from '@vueuse/core'
import { ref, onMounted, watch, computed, nextTick, onUnmounted, type Ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import DOMPurify from 'dompurify'

export type OnboardingTourStep = {
  target: string
  title: string
  description: string
  tag?: string
  beforeScript?: () => void
  afterScript?: () => void
}

export type OnboardingTourProps = {
  tourId: string | number
  defaultTemplate?: boolean
  overlay?: boolean
  startEvent?: string
  scrollableContainerSelector?: string
  cookieStorage?: boolean
  endDate?: Date
  labelTerminate?: string
  steps: OnboardingTourStep[]
}

const props = withDefaults(
  defineProps<OnboardingTourProps>(),

  {
    overlay: true,
    cookieStorage: false,
    defaultTemplate: true,
    startEvent: undefined,
    endDate: undefined,
    scrollableContainerSelector: undefined,
    labelTerminate: 'close',
  },
)

const displayTour = ref(false)

const currentStepIndex = ref(0)

const stylePopup = ref({})

const styleOverlay = ref({})

const popupPosition = ref('left')

const popup: Ref<HTMLDivElement | null> = ref(null)

const cookies = useCookies()

const emits = defineEmits(['startTour', 'endTour'])

let domObserverTarget: MutationObserver
let domObserverScrollable: MutationObserver

const targetElement: Ref<Element | null> = ref(null)
const scrollableContainerElement: Ref<Element | null> = ref(null)

/** COMPUTED */
const currentStep = computed(() =>
  props.steps?.length > 0 ? props.steps[currentStepIndex.value] : undefined,
)

const targetElementBound = computed(() => useElementBounding(targetElement.value as MaybeElement))

const scrollableContainerBound = computed(
  () => scrollableContainerElement.value && useElementBounding(scrollableContainerElement.value as MaybeElement),
)

const targetElementVisible = computed(() => {
  return (
    targetElementBound.value &&
    ((targetElementBound.value.top.value >= 0 &&
      targetElementBound.value.top.value <= window.innerHeight) ||
      (targetElementBound.value.bottom.value >= 0 &&
        targetElementBound.value.bottom.value <= window.innerHeight) ||
      (targetElementBound.value.bottom.value >= window.innerHeight &&
        targetElementBound.value.top.value <= 0)) &&
    ((targetElementBound.value.left.value >= 0 &&
      targetElementBound.value.left.value <= window.innerWidth) ||
      (targetElementBound.value.right.value >= 0 &&
        targetElementBound.value.right.value <= window.innerWidth) ||
      (targetElementBound.value.right.value >= window.innerWidth &&
        targetElementBound.value.left.value <= 0))
  )
})

const styleChevron = computed(() => {
  switch (popupPosition.value) {
    case 'left':
      return '-right-2 top-3'
    case 'right':
      return '-left-2 top-3'
    case 'top':
      return 'left-3 -bottom-2'
    case 'bottom':
      return 'left-3 -top-2'
    default:
      return '-right-2 top-3'
  }
})

const isNextStepEnabled = computed(() => currentStepIndex.value < props.steps?.length - 1)

const isPreviousStepEnabled = computed(() => currentStepIndex.value > 0)

const displayOnboardingTour = computed(
  () => displayTour.value && props.steps && props.steps.length > 0 && targetElement.value,
)

/** METHODS */

const updateStylePopupLeftRight = (left: number, targetTop: number, popupPos: DOMRect) => {
  let top
  if (targetTop + popupPos.height > window.innerHeight) {
    top = window.innerHeight - popupPos.height
  } else if (targetTop <= 0) {
    top = 0
  } else {
    top = targetTop
  }
  stylePopup.value = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

const getStyles = () => {
  const targetElPos = currentStep.value?.target && document.querySelector(currentStep.value?.target)?.getBoundingClientRect()
  const popupPos = popup.value?.getBoundingClientRect()

  if (targetElPos && popupPos) {
    const {
      top: targetTop,
      left: targetLeft,
      bottom: targetBottom,
      right: targetRight,
      width: targetWidth,
      height: targetHeight,
    } = targetElPos

    styleOverlay.value = {
      position: 'fixed',
      width: `${targetWidth + 24}px`,
      height: `${targetHeight + 24}px`,
      top: `${targetTop - 12}px`,
      left: `${targetLeft - 12}px`,
      boxShadow: 'inset 0px 0px 10px 0px rgba(255, 255, 255, 1), 0px 0px 0px 9999px rgba(0, 0, 0, 0.5)',
      userEvent: 'none',
      borderRadius: '10px',
      zIndex: 9999,
    }

    if (targetLeft - popupPos.width - 40 > 0) {
      //LEFT
      updateStylePopupLeftRight(targetLeft - popupPos.width - 40, targetTop, popupPos)
      popupPosition.value = 'left'
    } else if (targetRight + popupPos.width + 40 < window.innerWidth) {
      //RIGHT
      updateStylePopupLeftRight(targetRight + 40, targetTop, popupPos)
      popupPosition.value = 'right'
    } else if (targetTop - popupPos.height - 40 > 0) {
      //TOP
      stylePopup.value = {
        top: `${targetTop - popupPos.height - 40}px`,
        left: `${targetLeft}px`,
        width: targetLeft + popupPos.width >= window.innerWidth - 10 ? `${window.innerWidth - targetLeft -10}px` : 'auto'
      }
      popupPosition.value = 'top'
    } else {
      //BOTTOM
      stylePopup.value = {
        top:
          targetBottom + popupPos.height + 40 < window.innerHeight
            ? `${targetBottom + 40}px`
            : `${window.innerHeight - popupPos.height}px`,
        left: `${targetLeft}px`,
        width: targetLeft + popupPos.width >= window.innerWidth - 10 ? `${window.innerWidth - targetLeft -10}px` : 'auto'
      }
      popupPosition.value = 'bottom'
    }
  }
}

const goNextStep = () => {
  if (currentStepIndex.value < props.steps?.length - 1) currentStepIndex.value += 1
}

const goPreviousStep = () => {
  if (currentStepIndex.value > 0) currentStepIndex.value -= 1
}

const setStep = (index: number) => {
  if (index >= 0 && index <= props.steps?.length) currentStepIndex.value = index
}

const validateStartTour = () => {
  if (props.endDate) {
    if (new Date() <= props.endDate) {
      return !(props.cookieStorage && cookies.get(`vue_onboarding_tour_${props.tourId}`))
    } else {
      return false
    }
  } else {
    return !(props.cookieStorage && cookies.get(`vue_onboarding_tour_${props.tourId}`))
  }
}

const startTour = () => {
  if (validateStartTour()) {
    displayTour.value = true
    emits('startTour')
  }
}

const endTour = () => {
  if (props.cookieStorage) {
    const options = {
      expires: props.endDate
        ? props.endDate
        : (() => {
            const date = new Date()

            date.setDate(date.getDate() + 365)

            return date
          })(),
    }
    cookies.set(`vue_onboarding_tour_${props.tourId}`, true, options)
  }
  displayTour.value = false
  currentStepIndex.value = 0
  stylePopup.value = {}
  styleOverlay.value = {}
  targetElement.value = null
  emits('endTour')
}

const checkAutoScroll = () => {
  if(currentStep.value?.target) {
    const { top: targetTop, left: targetLeft } =
    document.querySelector(currentStep.value?.target)?.getBoundingClientRect() ?? {}
    const popupPos = popup.value?.getBoundingClientRect()
    if (
      targetTop !== undefined &&
      targetLeft !== undefined &&
      popupPos &&
      (targetTop < 0 ||
        targetTop > window.innerHeight ||
        targetLeft < 0 ||
        targetLeft > window.innerWidth)
    ) {
      const top =
        targetTop < 0 || targetTop > window.innerHeight ? targetTop - popupPos.height - 60 : undefined
      const left = targetLeft < 0 || targetLeft > window.innerWidth ? targetLeft : undefined
      if (scrollableContainerElement.value) {
        scrollableContainerElement.value.scrollBy({
          left: left && scrollableContainerBound.value?.left ? left - scrollableContainerBound.value?.left?.value: undefined,
          top: top && scrollableContainerBound.value?.left ? top - scrollableContainerBound.value?.left?.value: undefined,
          behavior: 'smooth',
        })
      } else {
        window.scrollBy({
          left: left,
          top: top,
          behavior: 'smooth',
        })
      }
    }
  }
}

const getTargetElement = () => {
  if(currentStep.value?.target) {
    //Add observer to wait for dom generation if element not directly in DOM
    if (document.querySelector(currentStep.value?.target)) {
      targetElement.value = document.querySelector(currentStep.value?.target)
    } else {
      const targetNode = document.body
      const config = { childList: true, subtree: true }
      domObserverTarget = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const externalElement = currentStep.value?.target && document.querySelector(currentStep.value?.target)
            if (externalElement) {
              targetElement.value = externalElement
              domObserverTarget.disconnect()
            }
          }
        }
      })

      domObserverTarget.observe(targetNode, config) // Start observing
    }
  }
}

const getScrollableContainerElement = () => {
  if(props.scrollableContainerSelector) {
    //Add observer to wait for dom generation if element not directly in DOM
    if (document.querySelector(props.scrollableContainerSelector)) {
      scrollableContainerElement.value = document.querySelector(props.scrollableContainerSelector)
    } else {
      const targetNode = document.body
      const config = { childList: true, subtree: true }
      domObserverScrollable = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const externalElement = props.scrollableContainerSelector && document.querySelector(props.scrollableContainerSelector)
            if (externalElement) {
              scrollableContainerElement.value = externalElement
              domObserverScrollable.disconnect()
            }
          }
        }
      })

      domObserverScrollable.observe(targetNode, config) // Start observing
    }
  }
}

const resizeEventListener = () => {
  if (displayOnboardingTour.value) {
    getStyles()

    checkAutoScroll()
  }
}

const scrollEventListener = () => {
  if (displayOnboardingTour.value) {
    getStyles()
  }
}

defineExpose({ startTour, endTour, goNextStep, goPreviousStep, setStep })

/** LIFECYCLE */
onMounted(() => {
  nextTick(() => getStyles())
  window.addEventListener('resize', resizeEventListener)
  window.addEventListener('scroll', scrollEventListener)
  if (props.startEvent) window.addEventListener(props.startEvent, startTour)
  getTargetElement()
  getScrollableContainerElement()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEventListener)
  window.removeEventListener('scroll', scrollEventListener)
  if (props.startEvent) window.removeEventListener(props.startEvent, startTour)
  if (domObserverTarget) {
    domObserverTarget.disconnect() // Clean up when component is destroyed
  }
  if (domObserverScrollable) {
    domObserverScrollable.disconnect() // Clean up when component is destroyed
  }
})

/** WATCH */
watch(
  [targetElementBound, scrollableContainerBound, displayTour],
  () => {
    if (displayTour.value) {
      nextTick(() => {
        getStyles()
      })
    }
  },
  { deep: true },
)

watch([currentStepIndex, displayTour], () => {
  if (displayTour.value) {
    if (currentStep.value?.beforeScript) {
      currentStep.value?.beforeScript()
    }
    getTargetElement()
    if (currentStep.value?.afterScript) {
      currentStep.value?.afterScript()
    }
  }
})

watch(targetElement, () => {
  if (displayTour.value) {
    nextTick(() => {
      checkAutoScroll()
    })
  }
})
</script>
