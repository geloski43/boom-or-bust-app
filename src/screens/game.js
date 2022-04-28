import React, { useEffect, useState } from 'react';
import { getGame } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballCourt from '../assets/images/bball-court.jpg';
import {
  Skeleton,
  HStack,
  Text,
  Box,
  Image,
  Badge,
  Spinner,
  Stack,
  Center,
  ZStack,
  Checkbox,
  IconButton,
  VStack,
  Icon,
} from 'native-base';
import { dayToShow } from '../utils/day-to-show';
import { Entypo } from '@expo/vector-icons';

const Game = ({ route, navigation }) => {
  const [game, setGame] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { itemId } = route.params;

  const parseDate = (input) => {
    return new Date(input);
  };

  const fetchGame = () => {
    let obj = {};
    setIsLoading(true);
    getGame(itemId)
      .then((game) => {
        obj = {
          ...game.data,
          home_team_logo:
            game.data.home_team.id === 13
              ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
              : `https://cdn.statmuse.com/img/nba/teams/nba_${game.data.home_team.full_name
                  .replace(/ /g, '_')
                  .toLowerCase()}_secondary.png`,
          visitor_team_logo:
            game.data.visitor_team.id === 13
              ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
              : `https://cdn.statmuse.com/img/nba/teams/nba_${game.data.visitor_team.full_name
                  .replace(/ /g, '_')
                  .toLowerCase()}_secondary.png`,
        };
        console.log('fetching game', obj);
        setGame(obj);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchGame();
  }, [itemId]);

  return (
    <ScreenContainer title={'Game'} navigation={navigation} image={bballCourt}>
      {!isLoading && game ? (
        <>
          <Box m="1" rounded="sm" borderWidth="1" p="2">
            <Center>
              {game.postseason && (
                <Badge
                  colorScheme="warning"
                  _dark={{ colorScheme: 'warmGray' }}
                >
                  Playoff Game
                </Badge>
              )}
              {!game.postseason && <Badge>Regular Season Game</Badge>}
            </Center>
            <Stack justifyContent="space-between" direction="row">
              <Stack alignItems="center" mx="2" direction="column" space={1}>
                <Image
                  size={'20'}
                  resizeMode={'contain'}
                  borderRadius="sm"
                  source={{ uri: game.visitor_team_logo }}
                  alt="Alternate Text"
                />
                <Text
                  opacity={
                    game.home_team_score > game.visitor_team_score ? 1 : 0.5
                  }
                >
                  {game.visitor_team && game.visitor_team.full_name}
                </Text>
                <Text
                  fontFamily="Oswald-Bold"
                  opacity={
                    game.visitor_team_score < game.home_team_score ? 1 : 0.5
                  }
                >
                  {game.home_team_score}
                </Text>
              </Stack>
              <Stack alignItems="center" space={1} mx="2" direction="column">
                <Image
                  key={game.id}
                  size={'20'}
                  resizeMode={'contain'}
                  borderRadius="sm"
                  source={{ uri: game.home_team_logo }}
                  alt="Alternate Text"
                />
                <Text
                  opacity={
                    game.home_team_score < game.visitor_team_score ? 1 : 0.5
                  }
                >
                  {game.home_team && game.home_team.full_name}
                </Text>
                <Text
                  fontFamily="Oswald-Bold"
                  opacity={
                    game.visitor_team_score > game.home_team_score ? 1 : 0.5
                  }
                >
                  {game.visitor_team_score}
                </Text>
              </Stack>
            </Stack>
            <Center mx="2">
              <Text>{game.status}</Text>
              <Text>{game.time}</Text>
            </Center>
            <Stack space={2} justifyContent="center" mt="2" direction="row">
              <Text
                _dark={{ color: 'warning.300' }}
                color="warning.800"
                fontFamily="Oswald-Regular"
              >
                {dayToShow(game.date && game.date.slice(0, 10))}
              </Text>

              <Text alignSelf="flex-end">
                {game.date &&
                  parseDate(game.date.slice(0, 10)).toLocaleDateString()}
              </Text>
            </Stack>
            <Text
              alignSelf="center"
              color="warning.800"
              fontFamily="Oswald-Regular"
              _dark={{ color: 'warning.300' }}
            >
              @{game.home_team && game.home_team.city}
            </Text>
          </Box>
          <Icon
            alignSelf="center"
            as={Entypo}
            name="dots-three-horizontal"
            color="coolGray.800"
            _dark={{
              color: 'warmGray.50',
            }}
          />
        </>
      ) : (
        <Box flex={1} my="5" alignItems="center">
          <VStack
            w="90%"
            maxW="400"
            borderWidth="1"
            space={8}
            overflow="hidden"
            rounded="md"
            _dark={{
              borderColor: 'coolGray.500',
            }}
            _light={{
              borderColor: 'coolGray.200',
            }}
          >
            <VStack alignItems="flex-end">
              <Skeleton
                m="4"
                borderWidth={1}
                borderColor="coolGray.200"
                endColor="warmGray.50"
                size="20"
                rounded="md"
              />
              <Skeleton.Text mx="4" mb="4" lines={1} w="24" />
            </VStack>

            <Skeleton h="xs" />
          </VStack>
        </Box>
      )}
    </ScreenContainer>
  );
};

export default Game;
