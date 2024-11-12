<template>
  <div
    v-if="displayPromotionalPopin"
    data-test="promotionalPopin"
    :class="{ 'fixed z-[9999] h-full w-full': overlay }"
  >
    <div v-if="overlay" :style="styleOverlay"></div>

    <div
      ref="popup"
      :style="stylePopup"
      :class="[targetElementVisible ? 'fixed' : 'hidden']"
      class="z-[9999]"
    >
      <slot :currentStep="currentStep" :currentStepIndex="currentStepIndex"></slot>
      <div
        v-if="defaultTemplate"
        class="flex w-[312px] flex-col gap-4 rounded-lg bg-white px-4 py-2 shadow"
      >
        <div class="flex">
          <span class="w-4 h-4 absolute bg-white rotate-45" :class="styleChevron"></span>

          <div v-if="currentStep?.tag" type="info">
            {{ currentStep.tag }}
          </div>

          <FontAwesomeIcon
            :icon="['fas', 'xmark']"
            class="ml-auto cursor-pointer w-5 h-5"
            @click="endTour"
          />
        </div>

        <div v-if="currentStep?.title" v-safe-html="currentStep.title" class="text-xl text-black" />

        <div
          v-if="currentStep?.description"
          v-safe-html="currentStep.description"
          class="text-system-content-small text-black"
        />

        <div class="flex w-full items-center">
          <FontAwesomeIcon
            v-if="isPreviousStepEnabled"
            :icon="['fas', 'chevron-left']"
            class="mr-auto cursor-pointer text-gray-600 hover:text-gray-800 w-4 h-4"
            @click="goPreviousStep"
          />

          <div class="flex flex-1 justify-center gap-2">
            <FontAwesomeIcon
              v-for="(_, idx) in steps.length"
              :key="`dot_step_${idx}`"
              :icon="['fas', 'circle']"
              :class="idx === currentStepIndex ? 'text-blue-400' : 'text-gray-400'"
              class="cursor-pointer w-2 h-2"
              @click="setStep(idx)"
            />
          </div>

          <FontAwesomeIcon
            v-if="isNextStepEnabled"
            :icon="['fas', 'chevron-right']"
            class="ml-auto cursor-pointer text-gray-600 hover:text-gray-800 w-4 h-4"
            @click="goNextStep"
          />

          <span
            v-else
            class="ml-auto cursor-pointer text-gray-600 hover:text-gray-800"
            @click="endTour"
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

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useCookies } from '@vueuse/integrations/useCookies'

const props = withDefaults(
  defineProps<{
    tourId: string | number
    defaultTemplate?: boolean
    overlay?: boolean
    startEvent?: string
    scrollableContainerSelector?: string
    cookieStorage?: boolean
    endDate?: Date
    labelTerminate?: string
    steps: {
      target: string
      title: string
      description: string
      tag?: string
      beforeScript?: () => void
      afterScript?: () => void
    }[]
  }>(),

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

let domObserver: MutationObserver

const targetElement: Ref<Element | null> = ref(null)

/** COMPUTED */

const currentStep = computed(() =>
  props.steps?.length > 0 ? props.steps[currentStepIndex.value] : undefined,
)

const targetElementBound = computed(() => useElementBounding(targetElement.value as MaybeElement))

const scrollableContainer = computed(
  () =>
    props.scrollableContainerSelector && document.querySelector(props.scrollableContainerSelector),
)

const scrollableContainerBound = computed(
  () => scrollableContainer.value && useElementBounding(scrollableContainer.value as MaybeElement),
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

const displayPromotionalPopin = computed(
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
  const targetElPos = document.querySelector(currentStep.value?.target)?.getBoundingClientRect()
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
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
      top: `${targetTop}px`,
      left: `${targetLeft}px`,
      boxShadow: 'inset 0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px 9999px rgba(0, 0, 0, 0.5)',
      userEvent: 'none',
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
      return !(props.cookieStorage && cookies.get(`promotional_popin_tour_${props.tourId}`))
    } else {
      return false
    }
  } else {
    return !(props.cookieStorage && cookies.get(`promotional_popin_tour_${props.tourId}`))
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
    cookies.set(`promotional_popin_tour_${props.tourId}`, true, options)
  }
  displayTour.value = false
  currentStepIndex.value = 0
  stylePopup.value = {}
  styleOverlay.value = {}
  targetElement.value = null
  emits('endTour')
}

const checkAutoScroll = () => {
  const { top: targetTop, left: targetLeft } =
    document.querySelector(currentStep.value?.target)?.getBoundingClientRect() ?? {}
  const popupPos = popup.value?.getBoundingClientRect()
  if (
    targetTop &&
    targetLeft &&
    popupPos &&
    (targetTop < 0 ||
      targetTop > window.innerHeight ||
      targetLeft < 0 ||
      targetLeft > window.innerWidth)
  ) {
    const top =
      targetTop < 0 || targetTop > window.innerHeight ? targetTop - popupPos.height - 60 : undefined
    const left = targetLeft < 0 || targetLeft > window.innerWidth ? targetLeft : undefined
    if (scrollableContainer.value) {
      scrollableContainer.value.scrollTo({
        left: left,
        top: top,
        behavior: 'smooth',
      })
    } else {
      window.scrollTo({
        left: left,
        top: top,
        behavior: 'smooth',
      })
    }
  }
}

const getTargetElement = () => {
  //Add observer to wait for dom generation if element not directly in DOM
  if (document.querySelector(currentStep.value?.target)) {
    targetElement.value = document.querySelector(currentStep.value?.target)
  } else {
    const targetNode = document.body
    const config = { childList: true, subtree: true }
    domObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const externalElement = document.querySelector(currentStep.value?.target)
          if (externalElement) {
            targetElement.value = externalElement
            domObserver.disconnect()
          }
        }
      }
    })

    domObserver.observe(targetNode, config) // Start observing
  }
}

const resizeEventListener = () => {
  if (displayPromotionalPopin.value) {
    getStyles()

    checkAutoScroll()
  }
}

const scrollEventListener = () => {
  if (displayPromotionalPopin.value) {
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
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEventListener)
  window.removeEventListener('scroll', scrollEventListener)
  if (props.startEvent) window.removeEventListener(props.startEvent, startTour)
  if (domObserver) {
    domObserver.disconnect() // Clean up when component is destroyed
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
