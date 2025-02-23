import { App, DefineComponent } from 'vue';

// Define prop types
export declare type OnboardingTourProps = {
  tourId: string | number;
  defaultTemplate?: boolean;
  overlay?: boolean;
  startTour?: boolean;
  startEvent?: string;
  scrollableContainerSelector?: string;
  cookieStorage?: boolean;
  endDate?: Date;
  labelTerminate?: string;
  steps: OnboardingTourStep[];
};

export declare type OnboardingTourStep = {
  target?: string
  title: string;
  description: string;
  tag?: string;
  beforeScript?: () => void;
  afterScript?: () => void;
};

// Define emits for custom events and v-model
export declare type OnboardingTourEmits = {
  'startTour': () => void
  'endTour': () => void
}

// Declare the Vue component itself
declare const VueOnboardingTour: DefineComponent<
  OnboardingTourProps, 
  object,
  object,
  Record<string, never>,
  Record<string, never>,
  object,
  object,
  OnboardingTourEmits
>;

// Declare the install function for the plugin system
declare const _default: {
  install(app: App): void;
};

// Export the default plugin object
export default _default;

// Export the Vue component for direct use
export { VueOnboardingTour };


