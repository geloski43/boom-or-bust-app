import React from 'react';
import { useColorMode, IconButton, Icon, useColorModeValue } from 'native-base';
import { Feather } from '@expo/vector-icons';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      alignSelf="flex-end"
      w="50px"
      style={{
        transform: [{ rotate: colorMode === 'light' ? '180deg' : '0deg' }],
      }}
      aria-label={
        colorMode === 'light' ? 'switch to dark mode' : 'switch to light mode'
      }
      onPress={toggleColorMode}
      mb="3.5"
      bg={useColorModeValue('warmGray.200', 'warmGray.700')}
      borderRadius="full"
      icon={
        <Icon
          as={Feather}
          size="4"
          name={colorMode === 'light' ? 'sun' : 'moon'}
          color={useColorModeValue('amber.500', 'amber.50')}
        />
      }
    />
  );
};

export default ThemeToggle;
