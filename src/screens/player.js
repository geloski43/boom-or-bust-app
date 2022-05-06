import React, { useEffect, useState } from 'react';
import { getPlayer } from '../api/ball-dont-lie-api';
import { getInfo } from '../api/web-search-api';
import ScreenContainer from '../components/screen-container';
import bballGame from '../assets/images/bball-game.jpg';
import { Skeleton, VStack, Stack, Center } from 'native-base';
import { playerImageData } from '../constants/player-image-data';
import PlayerProfile from '../components/player-profile';

const Player = ({ route, navigation }) => {
  const [playerBasicInfo, setPlayerBasicInfo] = useState({});
  const [playerDetailedInfo, setPlayerDetailedInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const genericImage = (string) => {
    if (string === 'LA Clippers') {
      return 'https://cdn.statmuse.com/img/nba/teams/Los-Angeles-Clippers-Silhouette.png';
    } else if (string === 'Portland Trail Blazers') {
      return 'https://cdn.statmuse.com/img/nba/teams/Portland-Trailblazers-Silhouette.png';
    } else if (string === 'Chicago Bulls') {
      return 'https://cdn.statmuse.com/img/nba/teams/chicago-bulls-silhouette.png';
    } else {
      string = string.replace(/\s+/g, '-');
      return `https://cdn.statmuse.com/img/nba/teams/${string}-Silhouette.png`;
    }
  };

  const findPlayerImage = (id) => {
    const player = playerImageData.find((p) => p.id === id);
    return player ? player.image : null;
  };

  const { itemId, firsName, lastName } = route.params;

  const fetchPlayer = () => {
    if (!itemId) return;
    console.log('fetching player');
    setIsLoading(true);
    let basic = {};
    getPlayer(itemId)
      .then((player) => {
        basic = {
          ...player.data,
          playerImage:
            findPlayerImage(player.data.id) ||
            genericImage(player.data.team.full_name),
        };
        // console.log('fetching player', lastName);
        setPlayerBasicInfo(basic);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const fetchInfo = () => {
    if (!firsName && !lastName) return;
    console.log('fetching player info');
    setIsLoading(true);
    getInfo(`${firsName} ${lastName}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('player info', data.Infobox.content);
        setPlayerDetailedInfo(data.Infobox.content);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('player info fetch error', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPlayer();
    fetchInfo();
  }, [itemId, firsName, lastName]);

  // we add a listener (blur) as the user leaves the screen
  // we will clear the state so when the user navigates back
  // it wont show the previous data
  useEffect(() => {
    const clearState = navigation.addListener('blur', () => {
      setPlayerBasicInfo({});
      setPlayerDetailedInfo([]);
      navigation.setParams({ itemId: null, firsName: null, lastName: null });
    });
    return clearState;
  }, [navigation]);

  return (
    <ScreenContainer title={'Player'} navigation={navigation} image={bballGame}>
      {!isLoading ? (
        <PlayerProfile
          player={playerBasicInfo}
          playerDetailedInfo={playerDetailedInfo}
        />
      ) : (
        <VStack
          mt="10"
          m="1"
          rounded="sm"
          borderWidth="1"
          p="2"
          justifyContent="center"
          alignItems="center"
        >
          <Center>
            <VStack space={2} alignItems="center">
              <Skeleton
                borderWidth={1}
                borderColor="coolGray.200"
                endColor="warmGray.50"
                size="190px"
                rounded="lg"
              />
              <Stack
                mt="2"
                mb="4"
                alignItems="center"
                space={2}
                direction="column"
              >
                <Skeleton.Text lines={1} w="80px" />
                <Skeleton.Text lines={1} w="100px" />
                <Skeleton.Text lines={1} w="20px" />
              </Stack>
            </VStack>
          </Center>
        </VStack>
      )}
    </ScreenContainer>
  );
};

export default Player;
