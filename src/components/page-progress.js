import React, { useContext } from 'react';
import {
  Text,
  Stack,
  ZStack,
  IconButton,
  PresenceTransition,
  Center,
  Icon,
} from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { AntDesign } from '@expo/vector-icons';
import { Context as PlayerContext } from '../context/player-context';
import { Context as GameContext } from '../context/game-context';

const PageProgress = ({ progress, moveToTop }) => {
  const gameContext = useContext(GameContext);
  const playerContext = useContext(PlayerContext);
  const { playerlistScrollPosition } = playerContext.state;
  const { gamelistScrollPosition } = gameContext.state;

  const visibleArrowUp =
    playerlistScrollPosition >= 3 || gamelistScrollPosition >= 5;

  return (
    <Stack
      w="100px"
      my="1"
      px="2"
      borderRadius="sm"
      bg="blueGray.300"
      _dark={{ bg: 'blueGray.800' }}
      direction="row"
      alignSelf="flex-end"
      justifyContent="space-between"
    >
      <PresenceTransition
        alignSelf="center"
        visible={visibleArrowUp}
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            duration: 250,
          },
        }}
      >
        <IconButton
          onPress={moveToTop}
          borderRadius="full"
          icon={
            <Icon
              mt="5px"
              ml="-10px"
              as={AntDesign}
              size="5"
              name="arrowup"
              color="lightBlue.800"
            />
          }
        />
      </PresenceTransition>
      <ZStack mx="3" justifyContent="center" alignItems="center" mb="-1" pt="1">
        <Text
          alignSelf="center"
          bg="muted.300"
          fontSize="10px"
          fontFamily="Oswald-Bold"
          borderRadius="md"
          _dark={{ bg: 'warning.800' }}
        >
          {progress}%
        </Text>
        <AnimatedCircularProgress
          size={38}
          width={2}
          backgroundWidth={5}
          fill={progress}
          tintColor="#00ff00"
          tintColorSecondary="#ff0000"
          backgroundColor="#43688f"
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
        />
      </ZStack>
    </Stack>
  );
};
export default PageProgress;
