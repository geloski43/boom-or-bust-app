import React from 'react';
import { NativeBaseProvider } from 'native-base';
import theme from '../theme';
import { Provider as MenuProvider } from '../context/menu-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colorModeManager = {
  get: async () => {
    try {
      let val = await AsyncStorage.getItem('@color-mode');
      return val === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem('@color-mode', value);
    } catch (e) {
      console.log(e);
    }
  },
};

const AppContainer = ({ children }) => {
  return (
    <NavigationContainer>
      <MenuProvider>
        <NativeBaseProvider colorModeManager={colorModeManager} theme={theme}>
          {children}
        </NativeBaseProvider>
      </MenuProvider>
    </NavigationContainer>
  );
};

export default AppContainer;
