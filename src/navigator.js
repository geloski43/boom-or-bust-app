import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Games from './screens/games';
import Teams from './screens/teams';
import Stats from './screens/stats';
import Team from './screens/team';
import Sidebar from './components/sidebar';
import Game from './screens/game';
import Players from './screens/players';
import Player from './screens/player';

const Drawer = createDrawerNavigator();

const Navigator = () => {
  return (
    <Drawer.Navigator
      // prevents drawer from re-opening after navigating to new screen
      useLegacyImplementation={true}
      initialRouteName="Games"
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: '#00000000',
      }}
    >
      <Drawer.Screen name="Games" component={Games} />
      <Drawer.Screen name="Game" component={Game} />
      <Drawer.Screen name="Teams" component={Teams} />
      <Drawer.Screen name="Team" component={Team} />
      <Drawer.Screen name="Players" component={Players} />
      <Drawer.Screen name="Player" component={Player} />
    </Drawer.Navigator>
  );
};

export default Navigator;
