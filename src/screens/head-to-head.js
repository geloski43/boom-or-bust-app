import React, { useEffect, useState, useContext } from 'react';
import { searchPlayer, comparePlayerStats } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballCourt from '../assets/images/bball-court.jpg';
import {
  Text,
  Flex,
  Center,
  Box,
  VStack,
  Badge,
  Icon,
  Image,
  FormControl,
  Button,
  WarningOutlineIcon,
  Stack,
  Switch,
  Popover,
  CheckIcon,
  Select,
  ScrollView,
  Skeleton,
  Divider,
  PresenceTransition,
} from 'native-base';
import {
  genericPlayerImage,
  findPlayerImage,
  responsiveHeight,
  matchedTeam,
} from '../utils/utils';
import { playerIcon } from '../components/custom-icons';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import SetPlayerModal from '../components/head-to-head/set-player-modal';
import { Context as StatsContext } from '../context/stats-context';
import { Context as PlayerContext } from '../context/player-context';
import NumericInput from 'react-native-numeric-input';
import PlayerStatsTotal from '../components/head-to-head/player-stats-total';

const HeadToHead = ({ navigation }) => {
  const playerContext = useContext(PlayerContext);
  const { playerOneQuery, playerTwoQuery, playerOneId, playerTwoId } =
    playerContext.state;

  const statsContext = useContext(StatsContext);
  const avgTotals = statsContext.state.avgTotals;

  const [isLoading, setIsLoading] = useState(false);
  const [initialMount, setInitialMount] = useState(true);
  const [season, setSeason] = useState(new Date().getFullYear());
  const [isPostSeason, setIsPostSeason] = useState(false);
  const [stats, setStats] = useState([]);
  const [playerOne, setPlayerOne] = useState([]);
  const [playerTwo, setPlayerTwo] = useState([]);
  const [playerOneTeamData, setPlayerOneTeamData] = useState([]);
  const [playerTwoTeamData, setPlayerTwoTeamData] = useState([]);

  const [showplayerOneSearchModal, setshowplayerOneSearchModal] =
    useState(false);
  const [showplayerTwoSearchModal, setshowplayerTwoSearchModal] =
    useState(false);

  const [showPopover, setShowPopover] = useState(false);

  const fetchStatstoCompare = (page, year, idOne, idTwo, seasonType) => {
    setIsLoading(true);
    let shouldFetchMore;
    // for initial page of data
    let playerOneStats = [];
    let playerTwoStats = [];
    let playerOneCurrentTeam = [];
    let playerTwoCurrentTeam = [];
    let playerOneTeams = [];
    let playerTwoTeams = [];
    // for next page of data which is max 2nd page
    let morePlayerOneStats = [];
    let morePlayerTwoStats = [];
    let morePlayerOneCurrentTeam = [];
    let morePlayerTwoCurrentTeam = [];
    let morePlayerOneTeams = [];
    let morePlayerTwoTeams = [];
    comparePlayerStats(page, year, idOne, idTwo, seasonType)
      .then((res) => {
        setIsLoading(false);
        shouldFetchMore = res.data.meta.next_page;
        playerOneStats = res.data.data
          .filter((obj) => obj.player.id === playerOneId)
          .filter(
            (item) =>
              item.min !== null &&
              item.min !== '0:00' &&
              item.min !== '' &&
              item.min !== '0'
          );
        playerTwoStats = res.data.data
          .filter((obj) => obj.player.id === playerTwoId)
          .filter(
            (item) =>
              item.min !== null &&
              item.min !== '0:00' &&
              item.min !== '' &&
              item.min !== '0'
          );
        console.log(playerOneStats.length);
        playerOneCurrentTeam = playerOneStats.map((obj) => ({
          teamId: obj.team.id,
          teamAbbr: obj.team.abbreviation,
          teamFullName: obj.team.full_name,
          teamLogo: matchedTeam(obj.team.id).logo,
        }));
        playerTwoCurrentTeam = playerTwoStats.map((obj) => ({
          teamId: obj.team.id,
          teamAbbr: obj.team.abbreviation,
          teamFullName: obj.team.full_name,
          teamLogo: matchedTeam(obj.team.id).logo,
        }));

        playerOneTeams =
          playerOneCurrentTeam &&
          playerOneCurrentTeam.reduce((acc, current) => {
            const x = acc.find((item) => item.teamId === current.teamId);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

        playerTwoTeams =
          playerTwoCurrentTeam &&
          playerTwoCurrentTeam.reduce((acc, current) => {
            const x = acc.find((item) => item.teamId === current.teamId);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

        setPlayerOneTeamData(
          playerOneTeams.map((team, i) => {
            return {
              ...team,
              totalGamesPlayed: playerOneStats.filter(
                (game) =>
                  game.team.id === team.teamId &&
                  game.min !== null &&
                  game.min !== '0:00' &&
                  game.min !== '' &&
                  game.min !== '0'
              ).length,
            };
          })
        );

        setPlayerTwoTeamData(
          playerTwoTeams.map((team, i) => {
            return {
              ...team,
              totalGamesPlayed: playerTwoStats.filter(
                (game) =>
                  game.team.id === team.teamId &&
                  game.min !== null &&
                  game.min !== '0:00' &&
                  game.min !== '' &&
                  game.min !== '0'
              ).length,
            };
          })
        );

        setPlayerOne({ ...playerOne, stats: [...playerOneStats] });
        setPlayerTwo({ ...playerTwo, stats: [...playerTwoStats] });
        if (shouldFetchMore === null) {
          console.log('no more data');
          return;
        } else {
          console.log('more data');
          // we just repeat the same process for the next page
          // and concat the results
          comparePlayerStats(
            shouldFetchMore,
            year,
            idOne,
            idTwo,
            seasonType
          ).then((res) => {
            morePlayerOneStats = res.data.data
              .filter((obj) => obj.player.id === playerOneId)
              .filter(
                (item) =>
                  item.min !== null &&
                  item.min !== '0:00' &&
                  item.min !== '' &&
                  item.min !== '0'
              );
            morePlayerTwoStats = res.data.data
              .filter((obj) => obj.player.id === playerTwoId)
              .filter(
                (item) =>
                  item.min !== null &&
                  item.min !== '0:00' &&
                  item.min !== '' &&
                  item.min !== '0'
              );
            setPlayerOne({
              ...playerOne,
              stats: [...playerOneStats, ...morePlayerOneStats],
            });
            setPlayerTwo({
              ...playerTwo,
              stats: [...playerTwoStats, ...morePlayerTwoStats],
            });

            morePlayerOneCurrentTeam = morePlayerOneStats.map((obj) => ({
              teamId: obj.team.id,
              teamAbbr: obj.team.abbreviation,
              teamFullName: obj.team.full_name,
              teamLogo: matchedTeam(obj.team.id).logo,
            }));
            morePlayerTwoCurrentTeam = morePlayerTwoStats.map((obj) => ({
              teamId: obj.team.id,
              teamAbbr: obj.team.abbreviation,
              teamFullName: obj.team.full_name,
              teamLogo: matchedTeam(obj.team.id).logo,
            }));

            morePlayerOneTeams =
              morePlayerOneCurrentTeam &&
              morePlayerOneCurrentTeam.reduce((acc, current) => {
                const x = acc.find((item) => item.teamId === current.teamId);
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
              }, []);

            morePlayerTwoTeams =
              morePlayerTwoCurrentTeam &&
              morePlayerTwoCurrentTeam.reduce((acc, current) => {
                const x = acc.find((item) => item.teamId === current.teamId);
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
              }, []);

            // console.log('morePlayerOneTeams', morePlayerOneTeams);
            // console.log('morePlayerTwoTeams', morePlayerTwoTeams);

            if (morePlayerOneTeams && morePlayerOneTeams.length > 0) {
              setPlayerOneTeamData(
                morePlayerOneTeams.map((team, i) => {
                  return {
                    ...team,
                    totalGamesPlayed:
                      playerOneStats.filter(
                        (game) =>
                          game.team.id === team.teamId &&
                          game.min !== null &&
                          game.min !== '0:00' &&
                          game.min !== '' &&
                          game.min !== '0'
                      ).length +
                      morePlayerOneStats.filter(
                        (game) =>
                          game.team.id === team.teamId &&
                          game.min !== null &&
                          game.min !== '0:00' &&
                          game.min !== '' &&
                          game.min !== '0'
                      ).length,
                  };
                })
              );
            }
            if (morePlayerTwoTeams && morePlayerTwoTeams.length > 0) {
              setPlayerTwoTeamData(
                morePlayerTwoTeams.map((team, i) => {
                  return {
                    ...team,
                    totalGamesPlayed:
                      playerTwoStats.filter(
                        (game) =>
                          game.team.id === team.teamId &&
                          game.min !== null &&
                          game.min !== '0:00' &&
                          game.min !== '' &&
                          game.min !== '0'
                      ).length +
                      morePlayerTwoStats.filter(
                        (game) =>
                          game.team.id === team.teamId &&
                          game.min !== null &&
                          game.min !== '0:00' &&
                          game.min !== '' &&
                          game.min !== '0'
                      ).length,
                  };
                })
              );
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handlePlayerOneSearchChange = (text) => {
    playerContext.setPlayerOneQuery(text);
  };

  const handlePlayerTwoSearchChange = (text) => {
    playerContext.setPlayerTwoQuery(text);
  };

  const searchPlayerOne = (query, perPage) => {
    let obj = {};
    searchPlayer(query, perPage)
      .then((res) => {
        const response = res.data.data[0];
        console.log('player one res', response);
        obj = {
          ...response,
          playerImage:
            findPlayerImage(response && response.id) ||
            genericPlayerImage(response.team && response.team.full_name),
        };
        setPlayerOne(obj);
        playerContext.setPlayerOneId(response && response.id);
      })
      .catch((err) => console.log(err));
  };

  const searchPlayerTwo = (query, perPage) => {
    let obj = {};
    searchPlayer(query, perPage)
      .then((res) => {
        const response = res.data.data[0];
        obj = {
          ...response,
          playerImage:
            findPlayerImage(response && response.id) ||
            genericPlayerImage(response.team && response.team.full_name),
        };
        setPlayerTwo(obj);
        playerContext.setPlayerTwoId(response && response.id);
      })
      .catch((err) => console.log(err));
  };

  const clearPlayerOneQuery = () => {
    playerContext.setPlayerOneQuery('');
  };

  const clearPlayerTwoQuery = () => {
    playerContext.setPlayerTwoQuery('');
  };

  const toggleSeason = () => setIsPostSeason(!isPostSeason);

  const playerOneSearchModal = () => {
    return (
      <SetPlayerModal
        isOpen={showplayerOneSearchModal}
        setIsOpen={setshowplayerOneSearchModal}
        header="Set Player one"
        placeholder="Player one"
        query={playerOneQuery}
        searchPlayer={searchPlayerOne}
        handleSearchChange={handlePlayerOneSearchChange}
        clearQuery={clearPlayerOneQuery}
      />
    );
  };

  const playerTwoSearchModal = () => {
    return (
      <SetPlayerModal
        isOpen={showplayerTwoSearchModal}
        setIsOpen={setshowplayerTwoSearchModal}
        header="Set Player two"
        placeholder="Player two"
        query={playerTwoQuery}
        searchPlayer={searchPlayerTwo}
        handleSearchChange={handlePlayerTwoSearchChange}
        clearQuery={clearPlayerTwoQuery}
      />
    );
  };

  const renderHeader = () => {
    return (
      <>
        <VStack alignSelf="center" mt={responsiveHeight(2)}>
          <Select
            dropdownIcon={
              <Icon name="chevron-small-down" as={Entypo} size="sm" />
            }
            shadow={2}
            selectedValue={avgTotals}
            minWidth="95"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            _light={{
              bg: 'coolGray.100',
            }}
            _dark={{
              bg: 'coolGray.800',
            }}
            onValueChange={(itemValue) =>
              statsContext.setAverageType(itemValue)
            }
          >
            {['Totals', 'Per Game'].map((item) => (
              <Select.Item key={item} shadow={2} label={item} value={item} />
            ))}
          </Select>
          <Text alignSelf="center" fontSize="14px" fontFamily="Oswald-Bold">
            {season}-{parseInt(season) + 1}{' '}
            {isPostSeason ? 'Playoffs' : 'Regular Season'}
          </Text>
        </VStack>
      </>
    );
  };

  // we add a listener (blur) as the user leaves the screen
  // we will clear the state and route params so when the user navigates back
  // it wont show the previous data if different item is clicked
  useEffect(() => {
    const clearState = navigation.addListener('blur', () => {
      console.log('blur');
    });
    return clearState;
  }, [navigation]);

  const renderComponent = () => {
    return (
      <>
        <Popover
          placement="right top"
          trigger={(triggerProps) => {
            return (
              <Stack
                w="full"
                bg="warmGray.200"
                direction="row"
                justifyContent="space-between"
              >
                <Text mx="5" alignSelf="center" fontFamily="Oswald-Bold">
                  Head to Head by season
                </Text>
                <Button
                  p="4"
                  {...triggerProps}
                  _pressed={{ colorScheme: 'dark', borderRadius: 'full' }}
                  variant="ghost"
                  onPress={() => setShowPopover(true)}
                  _dark={{ colorScheme: 'blueGray' }}
                  leftIcon={
                    <Icon
                      size="sm"
                      as={Ionicons}
                      name="options-outline"
                      color="warning.800"
                    />
                  }
                />
              </Stack>
            );
          }}
          isOpen={showPopover}
          onClose={() => setShowPopover(!showPopover)}
        >
          <Popover.Content w="195px">
            <Popover.Arrow />
            <Popover.CloseButton onPress={() => setShowPopover(false)} />
            <Popover.Header>Season options</Popover.Header>
            <Popover.Body>
              <VStack space={4}>
                <FormControl isInvalid={!playerOneId || !playerTwoId}>
                  <FormControl.Label>
                    <Text fontFamily="Oswald-Regular">Year</Text>
                  </FormControl.Label>
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Press icon to select players
                  </FormControl.ErrorMessage>
                  <NumericInput
                    type="plus-minus"
                    value={season}
                    onChange={(value) => setSeason(value)}
                    totalWidth={130}
                    totalHeight={40}
                    step={1}
                    valueType="real"
                    rounded
                  />
                </FormControl>
                <FormControl.Label>
                  <Text fontFamily="Oswald-Regular">
                    {isPostSeason ? 'Playoffs' : 'Regular season'}
                  </Text>
                </FormControl.Label>
                <Switch
                  alignSelf="flex-start"
                  isChecked={isPostSeason}
                  onToggle={toggleSeason}
                  aria-label={
                    !isPostSeason
                      ? 'switch to playoffs'
                      : 'switch to regular season'
                  }
                  size="md"
                  offTrackColor="orange.100"
                  onTrackColor="orange.200"
                  onThumbColor="orange.500"
                  offThumbColor="muted.500"
                />
              </VStack>
            </Popover.Body>
            <Popover.Footer justifyContent="flex-end">
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowPopover(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  isDisabled={!playerOneId || !playerTwoId}
                  colorScheme="warning"
                  onPress={() => {
                    console.log('get stats');
                    fetchStatstoCompare(
                      1,
                      season,
                      playerOneId,
                      playerTwoId,
                      isPostSeason
                    );
                    setTimeout(() => {
                      setShowPopover(false);
                    }, 900);
                  }}
                >
                  Get stats
                </Button>
              </Button.Group>
            </Popover.Footer>
          </Popover.Content>
        </Popover>

        {playerOne.stats && playerTwo.stats && renderHeader()}
        <ScrollView flex={1}>
          <Box mt="10" alignItems="center">
            {playerOneSearchModal()}
            {playerTwoSearchModal()}
            <Flex
              w="full"
              bg="warmGray.200"
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Center
                w="50%"
                rounded="sm"
                borderWidth="1"
                overflow="hidden"
                borderColor="coolGray.200"
                backgroundColor="gray.200"
                _dark={{
                  borderColor: 'coolGray.600',
                  backgroundColor: 'gray.500',
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0,
                }}
              >
                <Badge
                  alignSelf="flex-start"
                  colorScheme="blueGray"
                  _dark={{ colorScheme: 'warmGray' }}
                >
                  Player one
                </Badge>
                <PresenceTransition
                  visible={playerOne.playerImage || !playerOne.playerImage}
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: 'timing',
                      duration: 250,
                    },
                  }}
                >
                  {!playerOne.playerImage ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setshowplayerOneSearchModal(true);
                        }}
                      >
                        {playerIcon('35px')}
                      </TouchableOpacity>
                      <Stack alignSelf="center" p="1" direction="row" space={2}>
                        <Text fontFamily="Oswald-Regular" color="warning.700">
                          No Player selected
                        </Text>
                      </Stack>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setshowplayerOneSearchModal(true);
                        }}
                      >
                        <Image
                          alignSelf="center"
                          source={{
                            uri: playerOne.playerImage,
                          }}
                          alt="Player one"
                          size="35px"
                        />
                      </TouchableOpacity>
                      <Stack alignSelf="center" direction="row" space={2}>
                        <Text fontFamily="Oswald-Regular">
                          {playerOne.first_name}
                        </Text>
                        <Text fontFamily="Oswald-Regular">
                          {playerOne.last_name}
                        </Text>
                      </Stack>
                      <Stack alignSelf="center" space={2} direction="row">
                        <Text
                          color="warning.800"
                          fontFamily="Oswald-Regular"
                          _dark={{ color: 'warning.400' }}
                        >
                          {playerOne.team.full_name}
                        </Text>
                        <Text fontFamily="Oswald-Regular">
                          {playerOne.position}
                        </Text>
                      </Stack>
                    </>
                  )}
                </PresenceTransition>
              </Center>
              <Divider thickness="2" bg="warmGray.400" orientation="vertical" />
              <Center
                w="50%"
                rounded="sm"
                borderWidth="1"
                overflow="hidden"
                borderColor="coolGray.200"
                backgroundColor="gray.200"
                _dark={{
                  borderColor: 'coolGray.600',
                  backgroundColor: 'gray.500',
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0,
                }}
              >
                <Badge
                  alignSelf="flex-start"
                  colorScheme="blueGray"
                  _dark={{ colorScheme: 'warmGray' }}
                >
                  Player two
                </Badge>
                <PresenceTransition
                  visible={!playerTwo.playerImage || playerTwo.playerImage}
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: 'timing',
                      duration: 250,
                    },
                  }}
                >
                  {!playerTwo.playerImage ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setshowplayerTwoSearchModal(true);
                        }}
                      >
                        {playerIcon('35px')}
                      </TouchableOpacity>
                      <Stack alignSelf="center" p="1" direction="row" space={2}>
                        <Text fontFamily="Oswald-Regular" color="warning.700">
                          No Player selected
                        </Text>
                      </Stack>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setshowplayerTwoSearchModal(true);
                        }}
                      >
                        <Image
                          alignSelf="center"
                          source={{
                            uri: playerTwo.playerImage,
                          }}
                          alt="Player two"
                          size="35px"
                        />
                      </TouchableOpacity>
                      <Stack alignSelf="center" direction="row" space={2}>
                        <Text fontFamily="Oswald-Regular">
                          {playerTwo.first_name}
                        </Text>
                        <Text fontFamily="Oswald-Regular">
                          {playerTwo.last_name}
                        </Text>
                      </Stack>
                      <Stack alignSelf="center" space={2} direction="row">
                        <Text
                          color="warning.800"
                          fontFamily="Oswald-Regular"
                          _dark={{ color: 'warning.400' }}
                        >
                          {playerTwo.team.full_name}
                        </Text>
                        <Text fontFamily="Oswald-Regular">
                          {playerTwo.position}
                        </Text>
                      </Stack>
                    </>
                  )}
                </PresenceTransition>
              </Center>
            </Flex>

            <Flex m="1" mx="2" direction="row">
              <Box>
                {!isLoading ? (
                  <>
                    {playerOne.stats ? (
                      <PlayerStatsTotal
                        stats={playerOne.stats && playerOne.stats}
                        season={season}
                        isLoading={isLoading}
                        initialMount={initialMount}
                        isPostSeason={isPostSeason}
                        teamData={playerOneTeamData}
                        totalGamesPlayed={
                          playerOne.stats && playerOne.stats.length
                        }
                      />
                    ) : null}
                  </>
                ) : (
                  <Center p="5px" pt={'15%'}>
                    <Skeleton
                      borderRadius="sm"
                      alignSelf="center"
                      w="185px"
                      h="280px"
                      endColor="warmGray.400"
                      startColor="coolGray.300"
                    />
                  </Center>
                )}
              </Box>
              <Box>
                {!isLoading ? (
                  <>
                    {playerTwo.stats ? (
                      <PlayerStatsTotal
                        stats={playerTwo.stats && playerTwo.stats}
                        season={season}
                        isLoading={isLoading}
                        initialMount={initialMount}
                        isPostSeason={isPostSeason}
                        teamData={playerTwoTeamData}
                        totalGamesPlayed={
                          playerTwo.stats && playerTwo.stats.length
                        }
                      />
                    ) : null}
                  </>
                ) : (
                  <Center p="5px" pt={'15%'}>
                    <Skeleton
                      borderRadius="sm"
                      alignSelf="center"
                      w="185px"
                      h="280px"
                      endColor="warmGray.400"
                      startColor="coolGray.300"
                    />
                  </Center>
                )}
              </Box>
            </Flex>
          </Box>
        </ScrollView>
      </>
    );
  };

  return (
    <ScreenContainer
      title={'Head to Head'}
      navigation={navigation}
      image={bballCourt}
    >
      <>{renderComponent()}</>
    </ScreenContainer>
  );
};

export default HeadToHead;
