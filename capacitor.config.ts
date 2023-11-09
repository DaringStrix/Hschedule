import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hschedule.app',
  appName: 'Hschedule',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "favicon",
      sound: "beep.wav",
    },
  },
};

export default config;
