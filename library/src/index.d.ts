import { App, DefineComponent } from 'vue';

// Define prop types
export declare type OnboardingTourProps = {
  tourId: string | number;
  defaultTemplate?: boolean;
  overlay?: boolean;
  startEvent?: string;
  scrollableContainerSelector?: string;
  cookieStorage?: boolean;
  endDate?: Date;
  labelTerminate?: string;
  steps: OnboardingTourStep[];
};

export declare type OnboardingTourStep = {
  target: string;
  title: string;
  description: string;
  tag?: string;
  beforeScript?: () => void;
  afterScript?: () => void;
};

// Declare the Vue component itself
declare const VueOnboardingTour: DefineComponent<OnboardingTourProps>;

// Declare the install function for the plugin system
declare const _default: {
  install(app: App): void;
};

// Export the default plugin object
export default _default;

// Export the Vue component for direct use
export { VueOnboardingTour };
