import React, { useEffect, useState } from 'react';
import { getGame } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballGame from '../assets/images/bball-game.jpg';
import { Skeleton, Box, Stack, Center } from 'native-base';
import { parseDate } from '../utils/day-to-show';
import GameDetails from '../components/game-details';

const Game = ({ route, navigation }) => {
  const [game, setGame] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { itemId } = route.params;

  const fetchGame = () => {
    if (!itemId) return;
    console.log('fetching game');
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
          phDate: new Date(
            parseDate(game.data.date.slice(0, 10)).setDate(
              parseDate(game.data.date.slice(0, 10)).getDate() + 1
            )
          ),
        };
        // console.log('fetching game', obj);
        setGame(obj);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  // clear state when user leaves screen
  useEffect(() => {
    const clearState = navigation.addListener('blur', () => {
      setGame({});
      navigation.setParams({ itemId: null });
    });
    return clearState;
  }, [navigation]);

  useEffect(() => {
    fetchGame();
  }, [itemId]);

  return (
    <ScreenContainer title={'Game'} navigation={navigation} image={bballGame}>
      {!isLoading && game ? (
        <GameDetails game={game} navigation={navigation} />
      ) : (
        <Box mt="10" rounded="sm" borderWidth="1" p="2">
          <Center>
            <Skeleton h="20px" w="100px" />
          </Center>
          <Stack justifyContent="space-between" direction="row">
            <Stack alignItems="center" mx="2" direction="column" space={3}>
              <Skeleton
                borderWidth={1}
                borderColor="coolGray.200"
                endColor="warmGray.50"
                size="100px"
                rounded="lg"
              />
              <Skeleton.Text lines={1} w="100px" />
              <Skeleton.Text lines={1} w="5" />
            </Stack>
            <Stack alignItems="center" space={3} mx="2" direction="column">
              <Skeleton
                borderWidth={1}
                borderColor="coolGray.200"
                endColor="warmGray.50"
                size="100px"
                rounded="lg"
              />
              <Skeleton.Text lines={1} w="100px" />
              <Skeleton.Text lines={1} w="5" />
            </Stack>
          </Stack>
          <Skeleton.Text alignSelf="center" lines={1} w="10" />

          <Stack space={2} alignItems="center" mt="6" direction="column">
            <Skeleton.Text lines={1} w="85px" />
            <Skeleton.Text lines={1} w="65px" />
          </Stack>
        </Box>
      )}
    </ScreenContainer>
  );
};

export default Game;
