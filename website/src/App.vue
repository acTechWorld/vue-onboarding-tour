<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onMounted, ref } from 'vue'
import { VueOnboardingTour } from 'vue-onboarding-tour';
const configOnboardingTour = {
  tourId: 'tour1',
  steps: [
    {
      target: '.title-onboarding',
      title: 'Welcome to VueOnboardingTour!',
      description:
        'Take a guided tour through VueOnboardingTour, the ultimate tool for creating intuitive, in-app user guides for your Vue application.',
    },
    {
      target: '.seamless',
      title: 'What is it ?',
      description:
        'VueOnboardingTour enables you to build step-by-step user guides effortlessly, making it easy for users to navigate through your app and understand its features intuitively.',
      tag: 'New!',
    },
    {
      target: '.easy-to-use',
      title: 'Ready to use',
      description:
        'VueOnboardingTour is designed to be minimal and straightforward to use. With a ready-to-go default template, you can set up a fully functional tour in minutes.',
      tag: 'Easy to use',
    },
    {
      target: '.customizable',
      title: 'Open for customization',
      description:
        "With flexible customization options, VueOnboardingTour allows you to tailor each step of your tour to fit your app's unique design and brand identity.",
      tag: 'NEW Feature!',
    },
    {
      target: '.documentation',
      title: 'Start Now!',
      description:
        'Need help getting started or looking for advanced features? Our comprehensive documentation provides everything you need to make the most of VueOnboardingTour.',
      tag: 'Documentation',
    },
     {
      target: '',
      title: 'Disable',
      description: '',
      tag: 'Documentation',
      disable: true,
    },
  ],
}
const onboardingTourPoppin = ref(null)
const displayDocSubMenu = ref(false)
/** METHODS */
const goToGithubPage = (hash: string) => {
  window.open(
    `https://github.com/acTechWorld/vue-onboarding-tour/tree/master/library?tab=readme-ov-file#${hash}`,
  )
}
const goToStoryBook = () => {
  window.open(
    `https://vueonboardingtour.storybook.actechworld.com/?path=/story/lib-components-vueonboardingtour--default`,
  )
}
/** LIFECYCLE */
onMounted(() => {
  if(onboardingTourPoppin.value) {
      (onboardingTourPoppin.value as typeof VueOnboardingTour)?.startTour()
  }
})
</script>

<template>
  <main class="bg-black relative min-h-screen">
    <nav class="flex float-end p-5 relative z-10">
      <div 
        @mouseenter="displayDocSubMenu = true" 
        @mouseleave="displayDocSubMenu = false" 
        @click="displayDocSubMenu = !displayDocSubMenu" 
        aria-haspopup="true" 
        :aria-expanded="displayDocSubMenu" 
        aria-label="Documentation menu" 
      >
        <div id="nav-doc" class="cursor-pointer text-purple-400 text-xl mb-2">Documentation</div>
        <div
          id="nav-doc-sub-container"
          class="bg-purple-950/70 py-5 rounded-lg flex flex-col text-white absolute right-5 w-[220px] text-center"
          :aria-hidden="!displayDocSubMenu"
          v-if="displayDocSubMenu"
        >
          <p
            class="cursor-pointer hover:bg-purple-950 py-1"
            @click="goToGithubPage('installation')"
            aria-label="How to install VueOnboardingTour"
          >
            How to install
          </p>
          <p
            class="cursor-pointer hover:bg-purple-950 py-1"
            @click="goToGithubPage('documentation')"
            aria-label="View online documentation for VueOnboardingTour"
          >
            Online Documentation
          </p>
          <p 
            class="cursor-pointer hover:bg-purple-950 py-1" 
            @click="goToStoryBook" 
            aria-label="Explore VueOnboardingTour Storybook"
          >
            Storybook
          </p>
          <a
              class="cursor-pointer hover:bg-purple-950 py-1"
              target="_blank"
              href="https://www.linkedin.com/in/antoine-canard/"
              >My Linkedin</a
            >
        </div>
      </div>
    </nav>
    <VueOnboardingTour v-bind="configOnboardingTour" ref="onboardingTourPoppin" aria-label="Interactive onboarding tour for Vue application"/>
    <div class="lg:max-w-[1200px] mx-auto px-10 py-[10rem] relative">
      <div
        class="text-4xl md:text-5xl lg:text-6xl font-medium text-white text-balance py-2 text-center break-words"
      >
        <h1 class="title-onboarding">
          VueOnboardingTour – The Easiest Way to Guide Your Users in Your Vue App
        </h1>
      </div>
      <div class="mt-20">
        <div class="flex md:!flex-row flex-col text-center gap-10 md:gap-5 lg:gap-10 max-w-[500px] mx-auto md:max-w-full">
          <div class="seamless flex-1" tabindex="0" aria-label="Seamless user onboarding section">
            <h2>
              <span class="text-2xl font-bold text-white">Seamless User Onboarding</span>
            </h2>
            <p class="text-gray-300 mt-3">
              VueOnboardingTour is a Vue.js component that creates guided, step-by-step onboarding tours
              to help users navigate your app intuitively.
            </p>
          </div>
          <div class="easy-to-use flex-1" tabindex="0" aria-label="Lightweight and ready to use section">
            <h2>
              <span class="text-2xl font-bold text-white">Lightweight and Ready to Use</span>
            </h2>
            <p class="text-gray-300 mt-3">
              VueOnboardingTour is designed to be minimal and easy to implement, with a default
              template that’s ready to go out of the box. Get a fully functional tour set up in
              minutes!
            </p>
          </div>
          <div class="customizable flex-1" tabindex="0" aria-label="Customizable section">
            <h2>
              <span class="text-2xl font-bold text-white">Fully Customizable</span>
            </h2>
            <p class="text-gray-300 mt-3">
              Easily adapt VueOnboardingTour to your app’s unique design. With flexible options for
              styling, you can integrate custom elements, colors, and animations to match your
              brand.
            </p>
          </div>
        </div>
        <div
          aria-hidden="true"
          class="hidden lg:!block absolute top-[calc(50%-20rem)] transform-gpu blur-3xl"
        >
          <div
            style="
              clip-path: polygon(
                73.6% 51.7%,
                91.7% 11.8%,
                100% 46.4%,
                97.4% 82.2%,
                92.5% 84.9%,
                75.7% 64%,
                55.3% 47.5%,
                46.5% 49.4%,
                45% 62.9%,
                50.3% 87.2%,
                21.3% 64.1%,
                0.1% 100%,
                5.4% 51.1%,
                21.4% 63.9%,
                58.9% 0.2%,
                73.6% 51.7%
              );
            "
            class="aspect-[980/632] w-[980px] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          ></div>
        </div>
      </div>
      <div class="documentation flex md:!flex-row flex-col text-center gap-10 md:gap-5 lg:gap-10 max-w-[500px] mx-auto md:max-w-full text-gray-300 mt-20">
        <div class="bg-gradient-to-r from-red-500  via-yellow-500 to-violet-500 rounded-lg flex-1 p-[2px]" @click="goToGithubPage('installation')">
          <div class="bg-black flex flex-col gap-5 p-5 rounded-lg h-full">
            <h2 class="text-white text-xl font-bold">Start Using VueOnboardingTour</h2>
            <p>Jump right in and add VueOnboardingTour to your project with a few simple steps.</p>
            <span
              class="text-blue-400 leading-6 cursor-pointer hover:text-blue-600 group w-fit mx-auto relative items-center flex pr-4"
            >
              Start with the installation guide
              <FontAwesomeIcon
                class="absolute -right-2 group-hover:-right-4 transition-all"
                :icon="['fas', 'arrow-right']"
              />
            </span>
          </div>
        </div>
        <div class="bg-gradient-to-r from-red-500  via-yellow-500 to-violet-500 rounded-lg flex-1 p-[2px]" @click="goToGithubPage('documentation')">
          <div class="bg-black flex flex-col gap-5 p-5 rounded-lg h-full">
            <h2 class="text-white text-xl font-bold">Online Documentation</h2>
            <p>
              Access the full documentation for detailed guidance on setup, customization, and
              advanced features.
            </p>
            <span
              class="text-blue-400 leading-6 cursor-pointer hover:text-blue-600 group w-fit mx-auto relative items-center flex pr-4"
            >
              Explore the docs
              <FontAwesomeIcon
                class="absolute -right-2 group-hover:-right-4 transition-all"
                :icon="['fas', 'arrow-right']"
              />
            </span>
          </div>
        </div>
        <div class="bg-gradient-to-r from-red-500  via-yellow-500 to-violet-500 rounded-lg flex-1 p-[2px]" @click="goToStoryBook">
          <div class="bg-black flex flex-col gap-5 p-5 rounded-lg">
            <h2 class="text-white text-xl font-bold">Interactive Storybook</h2>
            <p>
              Explore VueOnboardingTour in action with our Storybook. See real-time demos and experiment
              with different configurations and styling options.
            </p>
            <span
              class="text-blue-400 leading-6 cursor-pointer hover:text-blue-600 group w-fit mx-auto relative items-center flex pr-4"
            >
              Check out the Storybook
              <FontAwesomeIcon
                class="absolute -right-2 group-hover:-right-4 transition-all"
                :icon="['fas', 'arrow-right']"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
  <footer class="bg-black">
    <div
      class="flex gap-5 py-10 flex-col lg:!flex-row lg:justify-between text-white px-10 max-w-[1600px] mx-auto items-center"
    >
      <div class="flex gap-5 sm:gap-10 sm:!flex-row flex-col w-full sm:!w-auto items-center">
        <p
          class="cursor-pointer"
          @click="goToGithubPage('installation')"
          aria-label="How to install VueOnboardingTour"
        >
          How to install
        </p>
        <p
          class="cursor-pointer"
          @click="goToGithubPage('documentation')"
          aria-label="View online documentation for VueOnboardingTour"
        >
          Online Documentation
        </p>
        <p
          class="cursor-pointer"
          @click="goToStoryBook"
          aria-label="Explore VueOnboardingTour Storybook"
        >
          Storybook
        </p>
      </div>
      <div class="flex gap-5 sm:gap-10 sm:!flex-row flex-col w-full sm:!w-auto items-center">
        <a class="flex gap-10" target="_blank" href="https://www.linkedin.com/in/antoine-canard/"
          >My Linkedin</a
        >
        <a class="flex gap-10" target="_blank" href="https://github.com/acTechWorld">My Github</a>
      </div>
    </div>
  </footer>
</template>
