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
import logo from '../assets/images/logo.png';
import { FontAwesome, Entypo, AntDesign } from '@expo/vector-icons';

const Sidebar = (props) => {
  const { state, navigation } = props;
  const currentRoute = state.routeNames[state.index];

  const icons = [
    {
      name: 'envelope-square',
      color: 'red.600',
      href: 'mailto:ajgonzales43@gmail.com',
    },
    {
      name: 'github',
      color: 'coolGray.600',
      href: 'https://github.com/geloski43',
    },
  ];

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer();
  }, [navigation]);
  const handlePressGames = useCallback(() => {
    navigation.navigate('Games');
  }, [navigation]);
  const handlePressTeams = useCallback(() => {
    navigation.navigate('Teams');
  }, [navigation]);

  const handlePressPlayers = useCallback(() => {
    navigation.navigate('Players');
  }, [navigation]);

  const handlePressHeadToHead = useCallback(() => {
    navigation.navigate('Head to Head');
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
          onPress={handlePressGames}
        >
          Games
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Teams'}
          onPress={handlePressTeams}
        >
          Teams
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Players'}
          onPress={handlePressPlayers}
        >
          Players
        </MenuButton>
        <MenuButton
          active={currentRoute === 'Head to Head'}
          onPress={handlePressHeadToHead}
        >
          Head to Head
        </MenuButton>
      </VStack>
      <Center>
        <HStack space={3} pt="1" mt="27%">
          <Pressable _pressed={{ opacity: 0.6 }}>
            <Link href="https://geloski-portfolio.vercel.app/">
              <Avatar
                size="sm"
                bg="coolGray.300"
                source={{
                  uri: 'https://robohash.org/Kapitan%20Smiley?set=set2;size=100x100',
                }}
              />
            </Link>
          </Pressable>
          {icons.map((icon) => (
            <Pressable key={icon.name} _pressed={{ opacity: 0.6 }}>
              <Link href={icon.href}>
                <Icon
                  size="9"
                  as={FontAwesome}
                  name={icon.name}
                  color={icon.color}
                />
              </Link>
            </Pressable>
          ))}

          <Pressable _pressed={{ opacity: 0.6 }}>
            <Link href="https://www.linkedin.com/in/angelo-gonzales-6b58a0212">
              <Icon
                size="9"
                as={Entypo}
                name="linkedin-with-circle"
                color="blue.400"
              />
            </Link>
          </Pressable>
        </HStack>
        <Text textAlign={'center'} fontSize="11px" fontWeight="extrabold">
          &copy; {new Date().getFullYear()} Boom or Bust™. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
};

export default Sidebar;
