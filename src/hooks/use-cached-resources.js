import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export default function useCachedResources() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await Font.loadAsync({
          'Oswald-Bold': require('../assets/fonts/Oswald-Bold.ttf'),
          'Oswald-ExtraLight': require('../assets/fonts/Oswald-ExtraLight.ttf'),
          'Oswald-Light': require('../assets/fonts/Oswald-Light.ttf'),
          'Oswald-Medium': require('../assets/fonts/Oswald-Medium.ttf'),
          'Oswald-Regular': require('../assets/fonts/Oswald-Regular.ttf'),
          'Oswald-SemiBold': require('../assets/fonts/Oswald-SemiBold.ttf'),
        });
      } catch (err) {
        console.warn(err);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return fontsLoaded;
}
