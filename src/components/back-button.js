import React from 'react';
import { Button, Icon, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const BackButton = ({ text, route }) => {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        navigation.navigate(route);
      }}
      colorScheme="coolGray"
      _dark={{ colorScheme: 'blueGray' }}
      m="1"
      alignSelf="flex-start"
      leftIcon={
        <Icon
          color="warning.200"
          _dark={{ color: 'coolGray.100' }}
          as={Entypo}
          name="back"
          size="xs"
        />
      }
    >
      <Text
        _dark={{ color: 'coolGray.100' }}
        fontSize="10px"
        color="warning.200"
      >
        {text}
      </Text>
    </Button>
  );
};

export default BackButton;
