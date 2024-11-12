# VueProductTour

**VueProductTour** is a Vue.js component that creates guided, step-by-step product tours to help users navigate your app intuitively.

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
npm install @acTechWorld/vue-product-tour
```

Or, using **yarn**:

```bash
yarn add @acTechWorld/vue-product-tour
```

### 2. Import and Register the Library in Your Project

After installation, import **vue-product-tour** in your main JavaScript file and register it as a Vue plugin.

#### For Vue 2:

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import VueProductTour from '@acTechWorld/vue-product-tour'

Vue.use(VueProductTour)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
```

#### For Vue 3:

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import VueProductTour from '@acTechWorld/vue-product-tour'

const app = createApp(App)
app.use(VueProductTour)
app.mount('#app')
```

## Documentation

The `VueProductTour` component allows for creating an interactive, step-by-step tour within a Vue application. Here is a detailed breakdown of the props to customize your tour.

### Props

#### `tourId`

- **Type:** `String | Number`
- **Required:** `true`
- **Description:** A unique identifier for the tour. If `cookieStorage` is enabled, this ID is used to store a cookie, ensuring the tour is only shown once per user.

  **Usage:**

  ```html
  <VueProductTour :tourId="123" :steps="steps" />
  ```

#### `defaultTemplate`

- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Controls whether the default tour template is used. Set to `false` to design a custom template for the tour steps.

  **Usage:**

  ```html
  <VueProductTour :tourId="123" :steps="steps" :defaultTemplate="false" />
  ```

#### `overlay`

- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Enables or disables the overlay mask that highlights the area around the target element during each step.

  **Usage:**

  ```html
  <VueProductTour :tourId="123" :steps="steps" :overlay="false" />
  ```

### `startEvent`

- **Type:** `String`
- **Default:** `undefined`
- **Description:** A custom event name that, when triggered, will start the tour. This is useful if you want the tour to start based on a specific user action or event.

#### Usage:

```html
<VueProductTour :tourId="123" :steps="steps" startEvent="showTour" />
```

#### Example:

To start the tour from a parent component, you can emit a custom event and pass the event name to the `startEvent` prop. Below is an example of how to trigger the tour using the custom event.

**Parent Component (ParentComponent.vue):**

```html
<template>
  <div>
    <button @click="startTour">Start Tour</button>
    <VueProductTour
      :tourId="123"
      :steps="steps"
      startEvent="showTour"
      labelTerminate="Finish Tour"
    />
  </div>
</template>

<script>
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
        this.$emit('showTour')
      },
    },
  }
</script>
```

In this example, the `ParentComponent` contains a button that triggers the `startTour` method when clicked. This method emits the `showTour` event to start the product tour in the `VueProductTour` component.

#### `scrollableContainerSelector`

- **Type:** `String`
- **Default:** `undefined`
- **Description:** A CSS selector for a scrollable container within which the target elements are located. If set, the component will scroll this container to bring target elements into view instead of scrolling the entire page.

  **Usage:**

  ```html
  <VueProductTour :tourId="123" :steps="steps" scrollableContainerSelector="#main-container" />
  ```

#### `cookieStorage`

- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Determines whether to store a cookie once the tour is completed, so it only shows once per user.

  **Usage:**

  ```html
  <VueProductTour :tourId="123" :steps="steps" :cookieStorage="true" />
  ```

#### `endDate`

- **Type:** `Date`
- **Default:** `undefined`
- **Description:** Sets an expiration date for the tour cookie, used when `cookieStorage` is enabled. After this date, the tour can be shown again to the user.

  **Usage:**

  ```html
  <VueProductTour
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
  <VueProductTour :tourId="123" :steps="steps" labelTerminate="Finish" />
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
  <VueProductTour :tourId="123" :steps="steps" />
  ```

## Cookie Storage

### What is Cookie Storage?

The `cookieStorage` prop allows you to persist the state of the tour using cookies in the user's browser. When enabled, it ensures that the product tour is only shown to the user once. After the user completes the tour, a cookie is set on their device, marking the tour as completed. The next time the user visits the site, the tour will not be displayed unless the cookie expires or is cleared.

### How does it work?

1. **Setting the Cookie:** When `cookieStorage` is enabled, a cookie with the name `vue-tour-{tourId}` is created. The value of the cookie is a JSON object that stores the date the tour was completed.
2. **Checking the Cookie:** On subsequent visits, the component checks if the cookie exists and whether the user has already completed the tour. If the cookie exists and is valid (not expired), the tour will not be shown again.
3. **Expiration (Optional):** You can also set an expiration date for the cookie using the `endDate` prop. After this date, the cookie is no longer valid, and the tour will not be shown again to the user unless the cookie is cleared or the `endDate` is extended.

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
<VueProductTour
  :tourId="123"
  :steps="steps"
  :cookieStorage="true"
  :endDate="new Date('2025-01-01')"
/>
```

In this example:

- The `cookieStorage` prop is set to `true`, so a cookie will be stored when the tour is completed.
- The `endDate` is set to January 1, 2025. After this date, the cookie will be considered expired
