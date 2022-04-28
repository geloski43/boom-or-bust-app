import React, { useCallback } from 'react';
import {
  HStack,
  VStack,
  Center,
  Heading,
  IconButton,
  useColorModeValue,
  Box,
  Image,
  Pressable,
  Link,
  Icon,
  Avatar,
  Text,
} from 'native-base';
import ThemeToggle from './theme-toggle';
import MenuButton from './menu-button';
import { AntDesign } from '@expo/vector-icons';
import logo from '../assets/images/logo.png';
import { FontAwesome5 } from '@expo/vector-icons';

const Sidebar = (props) => {
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index];

  const icons = [
    {
      name: 'envelope',
      bg: 'red.600',
      href: 'mailto:ajgonzales43@gmail.com',
    },
    {
      name: 'github',
      bg: 'coolGray.600',
      href: 'https://github.com/geloski43',
    },
    {
      name: 'linkedin',
      bg: 'blue.400',
      href: 'https://www.linkedin.com/in/angelo-gonzales-6b58a0212',
    },
  ];

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer();
  }, [navigation]);
  const handlePressMenuLayout = useCallback(() => {
    navigation.navigate('Games');
  }, [navigation]);
  const handlePressMenuForms = useCallback(() => {
    navigation.navigate('Teams');
  }, [navigation]);

  return (
    <Box
      safeArea
      flex={1}
      bg={useColorModeValue('blue.50', 'darkBlue.800')}
      p={7}
    >
      <VStack flex={1} space={2}>
        <HStack justifyContent="flex-end">
          <IconButton
            onPress={handlePressBackButton}
            borderRadius={100}
            variant="outline"
            borderColor={useColorModeValue('blue.300', 'darkBlue.700')}
            _icon={{
              as: AntDesign,
              name: 'back',
              size: 4,
              color: useColorModeValue('blue.800', 'darkBlue.700'),
            }}
          />
        </HStack>
        <HStack justifyContent="space-between">
          <VStack>
            <Image
              size={50}
              resizeMode={'contain'}
              borderRadius="sm"
              source={logo}
              alt="App logo"
            />
            <Heading fontFamily="Oswald-Bold" mb={4} size="sm">
              Boom or Bust™
            </Heading>
          </VStack>
          <ThemeToggle />
        </HStack>

        <MenuButton
          active={currentRoute === 'Games'}
          onPress={handlePressMenuLayout}
        >
          Games
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Teams'}
          onPress={handlePressMenuForms}
        >
          Teams
        </MenuButton>
      </VStack>
      <Center>
        <HStack>
          <Pressable _pressed={{ opacity: 0.6 }}>
            <Link href="https://geloski-portfolio.vercel.app/">
              <Avatar
                mt="8px"
                mr="8px"
                size={31.5}
                bg="coolGray.300"
                source={{
                  uri: 'https://robohash.org/Kapitan%20Smiley?set=set2;size=100x100',
                }}
              />
            </Link>
          </Pressable>
          {icons.map((icon) => (
            <IconButton
              key={icon.name}
              m={'8px'}
              borderRadius="full"
              bg={icon.bg}
              variant="solid"
              p="2"
              icon={
                <Link href={icon.href}>
                  <Icon
                    color="white"
                    name={icon.name}
                    as={FontAwesome5}
                    size="xs"
                  />
                </Link>
              }
            />
          ))}
        </HStack>
        <Text textAlign={"center"} fontSize="11px" fontWeight="extrabold">
          &copy; {new Date().getFullYear()} Boom or Bust™. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
};

export default Sidebar;
