import React from 'react';
import { NativeBaseProvider } from 'native-base';
import theme from '../theme';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as ModalProvider } from '../context/modal-context';
import { Provider as LocalizationProvider } from '../context/localization-context';
import { Provider as StatsProvider } from '../context/stats-context';
import { Provider as PlayerProvider } from '../context/player-context';
import { Provider as GameProvider } from '../context/game-context';

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
      <GameProvider>
        <PlayerProvider>
          <StatsProvider>
            <ModalProvider>
              <LocalizationProvider>
                <NativeBaseProvider
                  colorModeManager={colorModeManager}
                  theme={theme}
                >
                  {children}
                </NativeBaseProvider>
              </LocalizationProvider>
            </ModalProvider>
          </StatsProvider>
        </PlayerProvider>
      </GameProvider>
    </NavigationContainer>
  );
};

export default AppContainer;
