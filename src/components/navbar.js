import React, { useCallback } from 'react';
import { HStack, IconButton, Text, Box } from 'native-base';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NavBar = ({ title }) => {
  const navigation = useNavigation();
  const handlePressMenuButton = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  return (
    <HStack w="full" h={40} alignItems="center" mt="2" p={3} space={10}>
      <IconButton
        bg="warning.500"
        variant={'solid'}
        onPress={() => {
          handlePressMenuButton();
        }}
        borderRadius={100}
        _icon={{
          as: Feather,
          name: 'menu',
          size: 6,
          color: 'white',
        }}
      />
      <Box shadow="4" bg="muted.200" rounded="sm" px="1">
        <Text color="warning.700" fontSize="xl" fontFamily="Oswald-Bold">
          {title}
        </Text>
      </Box>
    </HStack>
  );
};

export default NavBar;
