import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tailorssuite.app',
  appName: 'Tailors Suite',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For live reload during local dev, temporarily use:
    // url: 'http://192.168.1.100:5173',
    // cleartext: true,
  },
};

export default config;
