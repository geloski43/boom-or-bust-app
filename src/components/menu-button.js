import React from 'react';
import { Button } from 'native-base';

const MenuButton = ({ active, children, ...props }) => {
  return (
    <Button
      size="lg"
      _light={{
        colorScheme: 'blue',
        _pressed: {
          bg: 'primary.100',
        },
        _text: {
          color: active ? 'blue.50' : 'blue.500',
        },
      }}
      _dark={{
        colorScheme: 'darkBlue',
        _pressed: {
          bg: 'primary.600',
        },
        _text: {
          color: active ? 'blue.50' : undefined,
        },
      }}
      bg={active ? undefined : 'transparent'}
      variant="solid"
      justifyContent="flex-start"
      {...props}
    >
      {children}
    </Button>
  );
};

export default MenuButton;
