import React, { useEffect, useState } from 'react';
import { getGame } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballGame from '../assets/images/bball-game.jpg';
import GameDetails from '../components/game/game-details';
import { GamePlaceholder } from '../components/placeholders';
import { teamLogo } from '../utils/utils';

const Game = ({ route, navigation }) => {
  const [game, setGame] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [initialMount, setInitialMount] = useState(true);

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
          home_team_logo: teamLogo(
            game.data.home_team.id,
            game.data.home_team.full_name
          ),
          visitor_team_logo: teamLogo(
            game.data.visitor_team.id,
            game.data.visitor_team.full_name
          ),
        };
        // console.log('fetching game', obj);
        setGame(obj);
        setIsLoading(false);
        setInitialMount(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setInitialMount(false);
      });
  };

  // clear state when user leaves screen
  useEffect(() => {
    const clearState = navigation.addListener('blur', () => {
      setGame({});
      setInitialMount(true);
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
        <GameDetails game={game} initialMount={initialMount} />
      ) : (
        <GamePlaceholder />
      )}
    </ScreenContainer>
  );
};

export default Game;
