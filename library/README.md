# VueOnboardingTour

**VueOnboardingTour** is a Vue.js component that creates guided, step-by-step onboarding tours to help users navigate your app intuitively.

## Quick Links
- 🌐 [Live Demo](https://vueonboardingtour.actechworld.com/)  
  Explore a live example of the component in action.
- 📦 [Npm package](https://www.npmjs.com/package/vue-onboarding-tour)  
  Here is the npm package
  Dive into detailed component stories and configurations.
- 📚 [Storybook Documentation](https://vueonboardingtour.storybook.actechworld.com/?path=/story/lib-components-vueonboardingtour--default)  
  Dive into detailed component stories and configurations.
- 💼 [LinkedIn](https://www.linkedin.com/in/antoine-canard/)  
  Here is my linkedin if you want to contact, me I'm always open for new challenges !


## Table of Contents

- [Installation](#installation)
- [Documentation](#documentation)
  - [Props](#props)
    - [tourId](#tourid)
    - [defaultTemplate](#defaulttemplate)
    - [overlay](#overlay)
    - [startEvent](#startevent)
    - [scrollableContainerSelector](#scrollablecontainerselector)
    - [cookieStorage](#cookiestorage)
    - [endDate](#enddate)
    - [labelTerminate](#labelterminate)
    - [steps](#steps)
  - [Exposed Methods](#exposed-methods)
    - [startTour()](#starttour)
    - [endTour()](#endtour)
    - [goNextStep()](#gonextstep)
    - [goPreviousStep()](#gopreviousstep)
    - [setStep(index)](#setstepindex)
  - [Cookie Storage](#cookie-storage)
    - [What is Cookie Storage?](#what-is-cookie-storage)
    - [How does it work?](#how-does-it-work)
    - [Cookie Format](#cookie-format)
    - [Example Setup](#example-setup)
    - [Clearing Cookies](#clearing-cookies)
  - [Example Usage](#example-usage)

## Installation

### Prerequisites

- **Vue.js** (Vue 2 or Vue 3) must be installed in your project.

### 1. Install the Package

Using **npm**:

```bash
npm install vue-onboarding-tour
```

Or, using **yarn**:

```bash
yarn add vue-onboarding-tour
```

### 2. Import and Register the Library in Your Project

After installation, import **vue-onboarding-tour** in your main JavaScript file and register it as a Vue plugin.

#### For Vue 2:

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import VueOnboardingTour from 'vue-onboarding-tour'

Vue.use(VueOnboardingTour)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
```

#### For Vue 3:

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import VueOnboardingTour from 'vue-onboarding-tour'

const app = createApp(App)
app.use(VueOnboardingTour)
app.mount('#app')
```

## Documentation

The `VueOnboardingTour` component allows for creating an interactive, step-by-step tour within a Vue application. Here is a detailed breakdown of the props to customize your tour.

### Props

#### `tourId`

- **Type:** `String | Number`
- **Required:** `true`
- **Description:** A unique identifier for the tour. If `cookieStorage` is enabled, this ID is used to store a cookie, ensuring the tour is only shown once per user.

  **Usage:**

  ```html
  <VueOnboardingTour :tourId="123" :steps="steps" />
  ```

#### `defaultTemplate`

- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Controls whether the default tour template is used. Set to `false` to design a custom template for the tour steps.

  **Usage:**

  ```html
  <VueOnboardingTour :tourId="123" :steps="steps" :defaultTemplate="false" />
  ```

#### `overlay`

- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Enables or disables the overlay mask that highlights the area around the target element during each step.

  **Usage:**

  ```html
  <VueOnboardingTour :tourId="123" :steps="steps" :overlay="false" />
  ```

#### `startEvent`

- **Type:** `String`
- **Default:** `undefined`
- **Description:** A custom event name that, when triggered, will start the tour. This is useful if you want the tour to start based on a specific user action or event.

#### Usage:

```html
<VueOnboardingTour :tourId="123" :steps="steps" startEvent="showTour" />
```

#### Example:

To start the tour from a parent component, you can emit a custom event and pass the event name to the `startEvent` prop. Below is an example of how to trigger the tour using the custom event.

**Parent Component (ParentComponent.vue):**

```html
<template>
  <div>
    <button @click="startTour">Start Tour</button>
    <VueOnboardingTour
      :tourId="123"
      :steps="steps"
      startEvent="showTour"
      labelTerminate="Finish Tour"
    />
    <div id="step1"></div>
    <div id="step2"></div>
  </div>
</template>

<script lang="ts">
  export default {
    data() {
      return {
        steps: [
          {
            target: '#step1',
            title: 'Welcome',
            description: 'This is the first step of the tour.',
          },
          {
            target: '#step2',
            title: 'Features',
            description: 'This is where you can find features overview.',
          },
        ],
      }
    },
    methods: {
      startTour() {
        // Emit the custom event to start the tour
        window.dispatchEvent(new CustomEvent('showTour'))
      },
    },
  }
</script>
```

In this example, the `ParentComponent` contains a button that triggers the `startTour` method when clicked. This method emits the `showTour` event to start the onboarding tour in the `VueOnboardingTour` component.

#### `scrollableContainerSelector`

- **Type:** `String`
- **Default:** `undefined`
- **Description:** A CSS selector for a scrollable container within which the target elements are located. If set, the component will scroll this container to bring target elements into view instead of scrolling the entire page.

  **Usage:**

  ```html
  <VueOnboardingTour :tourId="123" :steps="steps" scrollableContainerSelector="#main-container" />
  ```

#### `cookieStorage`

- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Determines whether to store a cookie once the tour is completed, so it only shows once per user.

  **Usage:**

  ```html
  <VueOnboardingTour :tourId="123" :steps="steps" :cookieStorage="true" />
  ```

#### `endDate`

- **Type:** `Date`
- **Default:** `undefined`
- **Description:** The `endDate` prop allows you to set an expiration date for the tour. After this date, the tour will not be shown again, even if the cookie is not present. Additionally, all cookies set by this component (such as those used for `cookieStorage`) will have an expiration date equal to this `endDate`. As a result, these cookies will be automatically cleared from the user's browser once the expiration date is reached.

  **Usage:**

  ```html
  <VueOnboardingTour
    :tourId="123"
    :steps="steps"
    :cookieStorage="true"
    :endDate="new Date('2025-01-01')"
  />
  ```

#### `labelTerminate`

- **Type:** `String`
- **Default:** `'close'`
- **Description:** The label for the button or text used to close the tour at the last step. Customize this label to suit your app's language or tone.

  **Usage:**

  ```html
  <VueOnboardingTour :tourId="123" :steps="steps" labelTerminate="Finish" />
  ```

#### `steps`

- **Type:** `Array`
- **Required:** `true`
- **Description:** An array of objects defining each step in the tour. Each step object has the following fields:

  - `target` (String): A CSS selector for the element to highlight.
  - `title` (String, optional): The title text for the step.
  - `description` (String, optional): A description for the step.
  - `tag` (String, optional): Additional text or label to be shown in the step (e.g., a category or type label).
  - `beforeScript` (Function, optional): A function to be executed before showing the step.
  - `afterScript` (Function, optional): A function to be executed after displaying the step.

  **Example Steps Array:**

  ```javascript
  const steps = [
    {
      target: '#step1',
      title: 'Welcome',
      description: 'This is the starting point of the tour.',
      tag: 'Step 1',
      beforeScript: () => console.log('Preparing for Step 1'),
      afterScript: () => console.log('Completed Step 1'),
    },
    {
      target: '#step2',
      title: 'Feature Overview',
      description: 'Here you can learn about the main features of our app.',
      tag: 'Step 2',
    },
  ]
  ```

  **Usage:**

  ```html
  <VueOnboardingTour :tourId="123" :steps="steps" />
  ```

## Exposed Methods

### `startTour()`

**Purpose:**  
Starts the onboarding tour programmatically.

**Usage:**  
Trigger the tour when needed,

e.g., after a button click or other user action.

```javascript
this.$refs.onboardingTour.startTour()
```

### `endTour()`

**Purpose:**  
Ends the onboarding tour programmatically.

**Usage:**  
Call this method to finish the tour prematurely.

```javascript
this.$refs.onboardingTour.endTour()
```

### `goNextStep()`

**Purpose:**  
Moves to the next step of the tour.

**Usage:**  
Use this method to skip to the next tour step programmatically.

```javascript
this.$refs.onboardingTour.goNextStep()
```

### `goPreviousStep()`

**Purpose:**  
Moves to the previous step of the tour.

**Usage:**  
Use this method to go back to the previous step in the tour.

```javascript
this.$refs.onboardingTour.goPreviousStep()
```

### `setStep(index)`

**Purpose:**  
Sets the tour to a specific step based on its index.

**Usage:**  
Programmatically jump to a specific step.

```javascript
this.$refs.onboardingTour.setStep(2) // Jumps to the third step
```

## Cookie Storage

### What is Cookie Storage?

The `cookieStorage` prop allows you to persist the state of the tour using cookies in the user's browser. When enabled, it ensures that the onboarding tour is only shown to the user once. After the user completes the tour, a cookie is set on their device, marking the tour as completed. The next time the user visits the site, the tour will not be displayed unless the cookie expires or is cleared.

### How does it work?

1. **Setting the Cookie:** When `cookieStorage` is enabled, a cookie with the name `vue_onboarding_tour_{tourId}` is created. The value of the cookie is a JSON object that stores the date the tour was completed.
2. **Checking the Cookie:** On subsequent visits, the component checks if the cookie exists and whether the user has already completed the tour. If the cookie exists and is valid (not expired), the tour will not be shown again.
3. **Expiration (Optional):** You can also set an expiration date for the tour. The `endDate` prop allows you to set an expiration date for the tour. After this date, the tour will not be shown again, even if the cookie is not present. Additionally, all cookies set by this component (such as those used for `cookieStorage`) will have an expiration date equal to this `endDate`. As a result, these cookies will be automatically cleared from the user's browser once the expiration date is reached.

### Cookie Format

The cookie stored is a JSON object with the following format:

```json
{
  "tourId": "123",
  "completedAt": "2024-11-12T12:00:00Z"
}
```

Where:

- `tourId`: The unique ID of the tour (matching the `tourId` prop).
- `completedAt`: The date and time when the tour was completed, stored in ISO 8601 format.

### Example Setup

To enable cookie storage and set an expiration date, you can use the following configuration:

```html
<VueOnboardingTour
  :tourId="123"
  :steps="steps"
  :cookieStorage="true"
  :endDate="new Date('2025-01-01')"
/>
```

In this example:

- The `cookieStorage` prop is set to `true`, so a cookie will be stored when the tour is completed.
- The `endDate` is set to January 1, 2025. After this date, the cookie will be considered expired, and the tour will no longer appear, regardless of the user's previous completion.
