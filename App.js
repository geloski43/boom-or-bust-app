import React from 'react';
import AppContainer from './src/components/app-container';
import Navigator from './src/index';
import useCachedResources from './src/hooks/use-cached-resources';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreLogs(['NativeBase:']);
  const fontsLoaded = useCachedResources();

  return (
    <>
      {fontsLoaded ? (
        <AppContainer>
          <Navigator />
        </AppContainer>
      ) : null}
    </>
  );
}
