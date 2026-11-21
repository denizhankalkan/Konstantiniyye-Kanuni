import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.denizhankalkan.konstantiniyye',
  appName: 'Konstantiniyye',
  webDir: 'dist/konstantiniyye-kanuni/browser',
  ios: { contentInset: 'never', backgroundColor: '#121829' },
  android: { backgroundColor: '#121829' },
  plugins: {
    SplashScreen: { launchShowDuration: 1200, backgroundColor: '#121829', showSpinner: false },
  },
};

export default config;
