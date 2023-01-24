import React from 'react';
import { Button, Icon, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const BackButton = ({ text, route }) => {
  const navigation = useNavigation();

  return (
    <Button
      _pressed={{ colorScheme: 'dark', borderRadius: 'full' }}
      variant="ghost"
      onPress={() => {
        navigation.navigate(route);
      }}
      _dark={{ colorScheme: 'blueGray' }}
      m="1"
      alignSelf="flex-start"
      leftIcon={
        <Icon
          color="warning.500"
          as={MaterialIcons}
          name="keyboard-backspace"
          size="xl"
        />
      }
    >
      {text && (
        <Text fontSize="10px" color="warning.500">
          {text}
        </Text>
      )}
    </Button>
  );
};

export default BackButton;
