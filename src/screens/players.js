import React, { useEffect, useState } from 'react';
import { getPlayers, searchPlayer } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballGame from '../assets/images/bball-game.jpg';
import { Skeleton, VStack, Box, Flex, Stack, Center } from 'native-base';
import { playerImageData } from '../constants/player-image-data';
import PlayerList from '../components/player-list';

const Players = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [playerToSearch, setPlayerToSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState(null);
  const [hasPagination, setHasPagination] = useState(true);
  const [initialMount, setInitialMount] = useState(true);
  const [searchError, setSearchError] = useState(false);

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

  // searching player by name
  const searchPlayerByName = (query) => {
    if (!query) {
      setSearchError(true);
    } else {
      let arr = [];
      setIsLoading(true);
      let totalPages = null;
      searchPlayer(query)
        .then((res) => {
          // console.log('search by name', res.data.data);
          arr = res.data.data.map((obj) => ({
            ...obj,
            playerImage:
              findPlayerImage(obj.id) || genericImage(obj.team.full_name),
          }));
          totalPages = res.data.meta.total_pages;
          setPagesTotal(totalPages);
          setPlayers(arr);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  };

  const fetchPlayers = (pageVar) => {
    setInitialMount(false);
    setHasPagination(true);
    setIsLoading(true);
    let totalPages = null;
    getPlayers(pageVar)
      .then((res) => {
        totalPages = res.data.meta.total_pages;
        let arr = [];
        getPlayers(pageVar)
          .then((res) => {
            arr = res.data.data.map((obj) => ({
              ...obj,
              playerImage:
                findPlayerImage(obj.id) || genericImage(obj.team.full_name),
            }));
            // console.log('fetching players', arr);
            setPagesTotal(totalPages);
            setPlayers(arr);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchMore = (pageVar) => {
    setHasPagination(true);
    if (page === pagesTotal) {
      return;
    }
    console.log('fetching more', page);
    setIsFetchingMore(true);
    let arr = [];
    let currentPage = page + 1;
    getPlayers(pageVar)
      .then((res) => {
        // console.log('fetching more players', res.data.data);
        arr = res.data.data.map((obj) => ({
          ...obj,
          playerImage:
            findPlayerImage(obj.id) || genericImage(obj.team.full_name),
        }));
        setPage(currentPage);
        setPlayers([...players, ...arr]);
        setIsFetchingMore(false);
      })
      .catch((error) => {
        setIsFetchingMore(false);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <ScreenContainer
      title={'Players'}
      navigation={navigation}
      image={bballGame}
    >
      {!isLoading ? (
        <PlayerList
          setSearchError={setSearchError}
          searchError={searchError}
          setPlayerToSearch={setPlayerToSearch}
          playerToSearch={playerToSearch}
          data={players}
          fetchPlayers={fetchPlayers}
          isFetchingMore={isFetchingMore}
          fetchMore={fetchMore}
          isLoading={isLoading}
          page={page}
          pagesTotal={pagesTotal}
          setPage={setPage}
          hasPagination={hasPagination}
          initialMount={initialMount}
          searchPlayerByName={searchPlayerByName}
        />
      ) : (
        <Box mt="16" alignItems="center">
          {Array.from(Array(3).keys()).map((v, i) => (
            <Flex m="1" mx="2" h={170} key={i} direction="row">
              <Center m="1" w="50%" rounded="sm" borderWidth="1">
                <VStack space={2} alignItems="center">
                  <Skeleton
                    borderWidth={1}
                    borderColor="coolGray.200"
                    endColor="warmGray.50"
                    size="70px"
                    rounded="lg"
                  />
                  <Stack
                    mt="5"
                    alignItems="center"
                    space={2}
                    direction="column"
                  >
                    <Skeleton.Text lines={1} w="80px" />
                    <Skeleton.Text lines={1} w="100px" />
                  </Stack>
                </VStack>
              </Center>

              <Center m="1" w="50%" rounded="sm" borderWidth="1">
                <VStack space={2} alignItems="center">
                  <Skeleton
                    borderWidth={1}
                    borderColor="coolGray.200"
                    endColor="warmGray.50"
                    size="70px"
                    rounded="lg"
                  />

                  <Stack
                    mt="5"
                    alignItems="center"
                    space={2}
                    direction="column"
                  >
                    <Skeleton.Text lines={1} w="80px" />
                    <Skeleton.Text lines={1} w="100px" />
                  </Stack>
                </VStack>
              </Center>
            </Flex>
          ))}
        </Box>
      )}
    </ScreenContainer>
  );
};

export default Players;
