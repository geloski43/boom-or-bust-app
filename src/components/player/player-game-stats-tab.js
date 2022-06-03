import React, { useCallback } from 'react';
import {
  HStack,
  Text,
  Box,
  Image,
  Spinner,
  Stack,
  Center,
  VStack,
  Divider,
  Flex,
  useColorMode,
  WarningOutlineIcon,
  PresenceTransition,
} from 'native-base';
import { parseDate, responsiveWidth } from '../../utils/utils';
import { TouchableOpacity } from 'react-native';
import Pagination from '../../components/pagination';
import * as Localization from 'expo-localization';

const PlayerGameStatsTab = ({
  initialMount,
  isLoading,
  season,
  isPostSeason,
  teamData,
  subLoading,
  totalGamesPlayed,
  stats,
  groupedStats,
  statsTabPage,
  setStatsTabPage,
  statsByTeamIndex,
  setStatsByTeamIndex,
}) => {
  const pageSize = 5;

  const timeZone = Localization.timezone;

  const { colorMode } = useColorMode();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const opacity = (firstScore, secondScore) => {
    if (firstScore === secondScore) {
      return 0.5;
    } else if (firstScore > secondScore) {
      return 1;
    }
    return 0.5;
  };

  const selectedStats = useCallback(() => {
    const firstPageIndex = (statsTabPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    if (statsByTeamIndex === null) {
      return stats.slice(firstPageIndex, lastPageIndex);
    }
    return (
      groupedStats[statsByTeamIndex] &&
      groupedStats[statsByTeamIndex].length > 0 &&
      groupedStats[statsByTeamIndex].slice(firstPageIndex, lastPageIndex)
    );
  }, [
    stats,
    groupedStats,
    statsByTeamIndex,
    statsTabPage,
    season,
    isPostSeason,
  ]);

  const statColumn = (title, value) => {
    return (
      <VStack
        my="3px"
        alignItems="center"
        w="45px"
        rounded="sm"
        overflow="hidden"
        borderColor="coolGray.400"
        borderWidth="1"
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
        <Text fontSize="10px" fontFamily="Oswald-Bold" m="1">
          {title}
        </Text>
        <Divider thickness="1" bg="coolGray.400" />
        <Text
          fontSize="10px"
          color={colorMode === 'dark' ? 'amber.500' : 'orange.900'}
          fontFamily="Oswald-Medium"
          m="1"
        >
          {value}
        </Text>
      </VStack>
    );
  };

  const renderEmpty = () => {
    return (
      <>
        {!initialMount && (
          <Stack py={'25%'}>
            <Stack direction="row" justifyContent="center" space={2}>
              <WarningOutlineIcon mt="1" size="xs" color="red.400" />
              <Text fontSize="15px" fontFamily="Oswald-Regular" color="red.400">
                No data available
              </Text>
            </Stack>
            <Text
              alignSelf="center"
              fontSize="15px"
              fontFamily="Oswald-Regular"
              color="red.400"
            >
              Set the season to get game stats.
            </Text>
          </Stack>
        )}
      </>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <Stack mb="2" mt="10" direction="column" space={1}>
          {teamData
            .filter((v) => v.totalGamesPlayed !== 0)
            .map((team, indx) => (
              <TouchableOpacity
                disabled={
                  statsByTeamIndex === indx ||
                  teamData.filter((v) => v.totalGamesPlayed !== 0).length === 1
                }
                key={team.teamId}
                onPress={() => {
                  setStatsTabPage(1);
                  setStatsByTeamIndex(indx);
                }}
                style={{ width: responsiveWidth(35) }}
              >
                <Stack
                  _dark={{ borderColor: 'coolGray.500' }}
                  borderColor="coolGray.400"
                  borderWidth="1"
                  borderRadius="lg"
                  bg={
                    statsByTeamIndex === indx ||
                    teamData.filter((v) => v.totalGamesPlayed !== 0).length ===
                      1
                      ? colorMode === 'dark'
                        ? 'amber.900'
                        : 'amber.400'
                      : 'transparent'
                  }
                  direction="row"
                  space={3}
                >
                  <Image
                    bg="blueGray.100"
                    borderRadius="full"
                    size={'6'}
                    resizeMode={'contain'}
                    source={team.teamLogo}
                    alt="team logo"
                  />
                  <Text
                    alignSelf="flex-end"
                    fontSize="14px"
                    fontFamily="Oswald-Regular"
                  >
                    {team.teamAbbr} ({team.totalGamesPlayed}{' '}
                    {team.totalGamesPlayed === 1 ? 'game' : 'games'})
                  </Text>
                </Stack>
              </TouchableOpacity>
            ))}
          {teamData.filter((v) => v.totalGamesPlayed !== 0).length > 1 && (
            <TouchableOpacity
              disabled={statsByTeamIndex === null}
              style={{ width: responsiveWidth(35) }}
              onPress={() => {
                setStatsTabPage(1);
                setStatsByTeamIndex(null);
              }}
            >
              <Stack
                _dark={{ borderColor: 'coolGray.500' }}
                borderColor="coolGray.400"
                borderWidth="1"
                borderRadius="lg"
                bg={
                  statsByTeamIndex === null
                    ? colorMode === 'dark'
                      ? 'amber.900'
                      : 'amber.400'
                    : 'transparent'
                }
                space={3}
                px="2"
              >
                <Text fontSize="14px" fontFamily="Oswald-Regular">
                  Total ({totalGamesPlayed} games)
                </Text>
              </Stack>
            </TouchableOpacity>
          )}
        </Stack>
        <Text mb="1" fontSize="14px" fontFamily="Oswald-Bold">
          {season}-{parseInt(season) + 1}{' '}
          {isPostSeason ? 'Playoffs' : 'Regular Season'}
        </Text>
      </>
    );
  };

  // transition when stats data changes
  const RenderWithTransition = useCallback(
    ({ children }) => {
      return (
        <PresenceTransition
          visible={statsTabPage}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 250,
            },
          }}
        >
          {children}
        </PresenceTransition>
      );
    },
    [statsTabPage, statsByTeamIndex]
  );

  const renderList = () => {
    return (
      <>
        {selectedStats() &&
          selectedStats().map((item) => {
            const localeDate = () => {
              return timeZone.includes('Asia') && item.game.date
                ? new Date(
                    parseDate(item.game.date.slice(0, 10)).setDate(
                      parseDate(item.game.date.slice(0, 10)).getDate() + 1
                    )
                  )
                    .toISOString()
                    .slice(0, 10)
                : item.game.date && item.game.date.slice(0, 10);
            };
            return (
              <>
                <Box
                  key={item.id}
                  mb="10"
                  rounded="sm"
                  p="2"
                  overflow="hidden"
                  borderColor="coolGray.200"
                  borderWidth="1"
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
                  <Center>
                    <Text fontSize="12px" fontFamily="Oswald-Regular">
                      {days[parseDate(localeDate()).getDay()]} {localeDate()}
                    </Text>
                    <Text
                      fontSize="12px"
                      color="warning.800"
                      fontFamily="Oswald-Regular"
                      _dark={{ color: 'warning.300' }}
                    >
                      @{item.homeTeamCity}
                    </Text>
                  </Center>
                  <Stack justifyContent="space-between" direction="row">
                    <Stack
                      alignItems="center"
                      mx="2"
                      direction="column"
                      space={1}
                    >
                      <Image
                        size={'10'}
                        resizeMode={'contain'}
                        borderRadius="sm"
                        source={item.visitor_team_logo}
                        alt="Alternate Text"
                      />

                      <Text
                        opacity={opacity(
                          item.game.visitor_team_score,
                          item.game.home_team_score
                        )}
                      >
                        {item.visitor_team_name}
                      </Text>
                      <Text
                        fontFamily="Oswald-Bold"
                        opacity={opacity(
                          item.game.visitor_team_score,
                          item.game.home_team_score
                        )}
                      >
                        {item.game.visitor_team_score}
                      </Text>
                      {item.team.id === item.game.visitor_team_id ? (
                        <Text
                          fontSize="9px"
                          color={
                            colorMode === 'dark' ? 'amber.500' : 'orange.900'
                          }
                          fontFamily="Oswald-Medium"
                        >
                          ({item.min || 0})
                        </Text>
                      ) : null}
                    </Stack>
                    <Stack
                      rounded="sm"
                      alignItems="center"
                      space={1}
                      mx="2"
                      direction="column"
                    >
                      <Image
                        key={item.game.id}
                        size={'10'}
                        resizeMode={'contain'}
                        borderRadius="sm"
                        source={item.home_team_logo}
                        alt="Alternate Text"
                      />
                      <Text
                        opacity={opacity(
                          item.game.home_team_score,
                          item.game.visitor_team_score
                        )}
                      >
                        {item.home_team_name}
                      </Text>
                      <Text
                        fontFamily="Oswald-Bold"
                        opacity={opacity(
                          item.game.home_team_score,
                          item.game.visitor_team_score
                        )}
                      >
                        {item.game.home_team_score}
                      </Text>
                      {item.team.id === item.game.home_team_id ? (
                        <Text
                          fontSize="9px"
                          color={
                            colorMode === 'dark' ? 'amber.500' : 'orange.900'
                          }
                          fontFamily="Oswald-Medium"
                        >
                          ({item.min || 0})
                        </Text>
                      ) : null}
                    </Stack>
                  </Stack>
                  <Center mx="2">
                    <Text>{item.game.status}</Text>
                  </Center>
                  <Stack
                    space={2}
                    justifyContent="center"
                    mt="2"
                    direction="row"
                  ></Stack>

                  <Flex
                    mx="auto"
                    w={responsiveWidth(75)}
                    direction="row"
                    alignSelf="center"
                    justifyContent="center"
                    wrap="wrap"
                  >
                    {statColumn('FGM', item.fgm || 0)}
                    {statColumn('FGA', item.fga || 0)}
                    {statColumn('3PM', item.fg3m || 0)}
                    {statColumn('3PA', item.fg3a || 0)}
                    {statColumn('FTM', item.ftm || 0)}
                    {statColumn('FTA', item.fta || 0)}
                    {statColumn('ORB', item.oreb || 0)}
                    {statColumn('DRB', item.dreb || 0)}
                    {statColumn('REB', item.reb || 0)}
                    {statColumn('AST', item.ast || 0)}
                    {statColumn('STL', item.stl || 0)}
                    {statColumn('BLK', item.blk || 0)}
                    {statColumn('TOV', item.turnover || 0)}
                    {statColumn('PF', item.pf || 0)}
                    {statColumn('PTS', item.pts || 0)}
                    {statColumn(
                      'FG%',
                      ((item.fgm / item.fga || 0) * 100).toFixed(1)
                    )}
                    {statColumn(
                      '3P%',
                      ((item.fg3m / item.fg3a || 0) * 100).toFixed(1)
                    )}
                    {statColumn(
                      'FT%',
                      ((item.ftm / item.fta || 0) * 100).toFixed(1)
                    )}
                  </Flex>
                </Box>
              </>
            );
          })}
      </>
    );
  };

  return (
    <>
      {!isLoading && !subLoading ? (
        <>
          {selectedStats() && selectedStats().length > 0 ? (
            <>
              {renderHeader()}
              <RenderWithTransition>{renderList()}</RenderWithTransition>
              <Pagination
                currentPage={statsTabPage}
                totalCount={
                  statsByTeamIndex === null
                    ? stats.length
                    : groupedStats && groupedStats[statsByTeamIndex].length
                }
                pageSize={pageSize}
                onPageChange={(page) => setStatsTabPage(page)}
              />
            </>
          ) : (
            renderEmpty()
          )}
        </>
      ) : (
        <Center py={'25%'}>
          <HStack space={2} justifyContent="center">
            <Spinner color="blueGray.700" _dark={{ color: 'blueGray.200' }} />
            <Text
              fontFamily="Oswald-Bold"
              color="blueGray.700"
              _dark={{ color: 'blueGray.200' }}
              fontSize="md"
            >
              Loading game stats
            </Text>
          </HStack>
        </Center>
      )}
    </>
  );
};

export default PlayerGameStatsTab;
