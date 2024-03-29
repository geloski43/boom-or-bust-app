import React, { useMemo, useCallback, useContext } from 'react';
import {
  Text,
  Stack,
  WarningOutlineIcon,
  FlatList,
  Flex,
  VStack,
  Divider,
  HStack,
  Spinner,
  Center,
  Select,
  Icon,
  CheckIcon,
  Image,
  Skeleton,
  useColorMode,
} from 'native-base';
import { Entypo } from '@expo/vector-icons';
import { responsiveWidth, teamLogo, responsiveHeight } from '../../utils/utils';
import { TouchableOpacity } from 'react-native';
import { Context as StatsContext } from '../../context/stats-context';

const PlayerAveragesTab = ({
  stats,
  groupedStats,
  season,
  isLoading,
  initialMount,
  isPostSeason,
  subLoading,
  teamData,
  totalGamesPlayed,
  averagesByTeamIndex,
  setAveragesByTeamIndex,
}) => {
  const statsContext = useContext(StatsContext);
  const avgTotals = statsContext.state.avgTotals;

  const { colorMode } = useColorMode();

  // we select data if a player has  multiple teams in one season
  // by default we have total stats to display
  const selectedData = useCallback(() => {
    if (averagesByTeamIndex === null) {
      return stats;
    }
    return groupedStats && groupedStats[averagesByTeamIndex];
  }, [stats, groupedStats, averagesByTeamIndex, season, isPostSeason]);

  // filter out invalid games so we get accurate values of games played
  // we convert min values from Min:Sec format to minutes only
  let mins =
    selectedData() &&
    selectedData().map((obj) => ({
      convertedMins:
        obj.min && obj.min.includes(':')
          ? parseInt(obj.min.slice(0, 2)) + parseInt(obj.min.slice(-2)) / 60 ||
            0
          : parseInt(obj.min) || 0,
    }));
  // we add teamlogo and teamid props,
  // teamid which we will use to group games by same team if a player has multiple teams in a season
  let gameStats =
    selectedData() &&
    selectedData()
      .filter(
        (item) =>
          item.min !== null &&
          item.min !== '0:00' &&
          item.min !== '' &&
          item.min !== '0'
      )
      .map((obj) => ({
        ...obj,
        teamLogo: teamLogo(obj.team.id, obj.team.full_name),
        teamId: obj.team.id,
      }));

  // we will usee this to add team details in the accumulated totals object
  let currentTeam =
    selectedData() &&
    selectedData().map((obj) => ({
      teamId: obj.team.id,
      teamAbbr: obj.team.abbreviation,
      teamFullName: obj.team.full_name,
      teamLogo: teamLogo(obj.team.id, obj.team.full_name),
    }));
  // total games played
  let totalGamesCount = selectedData() && selectedData().length;
  // accumulated totals
  let acccumulatedTotals = {
    pts:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.pts;
      }, 0),
    reb:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.reb;
      }, 0),
    ast:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.ast;
      }, 0),
    blk:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.blk;
      }, 0),
    turnover:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.turnover;
      }, 0),
    stl:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.stl;
      }, 0),

    fga:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.fga;
      }, 0),
    fgm:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.fgm;
      }, 0),

    fg3a:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.fg3a;
      }, 0),
    fg3m:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.fg3m;
      }, 0),

    fta:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.fta;
      }, 0),
    ftm:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.ftm;
      }, 0),

    pf:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.pf;
      }, 0),
    oreb:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.oreb;
      }, 0),
    dreb:
      selectedData() &&
      selectedData().reduce(function (prev, cur) {
        return prev + cur.dreb;
      }, 0),
    min:
      mins &&
      mins.reduce(function (prev, cur) {
        return prev + cur.convertedMins;
      }, 0),
    team:
      currentTeam &&
      currentTeam
        .reduce((acc, current) => {
          const x = acc.find((item) => item.teamId === current.teamId);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [])
        .map((team, i) => {
          return {
            ...team,
            totalGamesPlayed: gameStats.filter(
              (game) =>
                game.team.id === team.teamId &&
                game.min !== null &&
                game.min !== '0:00' &&
                game.min !== '' &&
                game.min !== '0'
            ).length,
          };
        }),
  };

  // this is the final data we will use to display in the table
  // if index, stats and groupedState changes table values will update
  const dataArray = useMemo(() => {
    if (selectedData() && selectedData().length === 0) {
      return [];
    } else {
      return [
        {
          ...acccumulatedTotals,
          season,
          isPostSeason,
          gamesPlayed: totalGamesCount,
        },
      ];
    }
  }, [stats, groupedStats, averagesByTeamIndex, season, isPostSeason]);

  const Placeholder = () => {
    return (
      <HStack space={2} justifyContent="center">
        <Spinner color="blueGray.700" _dark={{ color: 'blueGray.200' }} />
        <Text
          fontFamily="Oswald-Bold"
          color="blueGray.700"
          _dark={{ color: 'blueGray.200' }}
          fontSize="md"
        >
          Loading averages
        </Text>
      </HStack>
    );
  };

  const statColumn = (title, value) => {
    return (
      <VStack
        my="1"
        alignItems="center"
        w="50px"
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
        <Text fontFamily="Oswald-Bold" m="1">
          {title}
        </Text>
        <Divider thickness="1" bg="coolGray.400" />
        <Text
          color={colorMode === 'dark' ? 'amber.500' : 'orange.900'}
          fontFamily="Oswald-Medium"
          m="1"
        >
          {value}
        </Text>
      </VStack>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <>
        {!subLoading ? (
          <>
            <Stack mt="10" direction="column" space={1} alignItems="center">
              {teamData
                .filter((v) => v.totalGamesPlayed !== 0)
                .map((team, indx) => (
                  <TouchableOpacity
                    disabled={
                      averagesByTeamIndex === indx ||
                      teamData.filter((v) => v.totalGamesPlayed !== 0)
                        .length === 1
                    }
                    key={team.teamId}
                    onPress={() => setAveragesByTeamIndex(indx)}
                    style={{ width: responsiveWidth(35) }}
                  >
                    <Stack
                      _dark={{ borderColor: 'coolGray.500' }}
                      borderColor="coolGray.400"
                      borderWidth="1"
                      borderRadius="lg"
                      bg={
                        averagesByTeamIndex === indx ||
                        teamData.filter((v) => v.totalGamesPlayed !== 0)
                          .length === 1
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
                  disabled={averagesByTeamIndex === null}
                  style={{ width: responsiveWidth(35) }}
                  onPress={() => setAveragesByTeamIndex(null)}
                >
                  <Stack
                    _dark={{ borderColor: 'coolGray.500' }}
                    borderColor="coolGray.400"
                    borderWidth="1"
                    borderRadius="lg"
                    bg={
                      averagesByTeamIndex === null
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
            <Flex
              mx="auto"
              w={responsiveWidth(65)}
              direction="row"
              justifyContent="center"
              alignItems="center"
              wrap="wrap"
            >
              {statColumn('GP', item.gamesPlayed)}
              {statColumn(
                'MP',
                avgTotals === 'Totals'
                  ? (item.min || 0).toFixed(0)
                  : ((item.min || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'FGM',
                avgTotals === 'Totals'
                  ? item.fgm || 0
                  : ((item.fgm || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'FGA',
                avgTotals === 'Totals'
                  ? item.fga || 0
                  : ((item.fga || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                '3PM',
                avgTotals === 'Totals'
                  ? item.fg3m || 0
                  : ((item.fg3m || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                '3PA',
                avgTotals === 'Totals'
                  ? item.fg3a || 0
                  : ((item.fg3a || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'FTM',
                avgTotals === 'Totals'
                  ? item.ftm || 0
                  : ((item.ftm || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'FTA',
                avgTotals === 'Totals'
                  ? item.fta || 0
                  : ((item.fta || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'ORB',
                avgTotals === 'Totals'
                  ? item.oreb || 0
                  : ((item.oreb || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'DRB',
                avgTotals === 'Totals'
                  ? item.dreb || 0
                  : ((item.dreb || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'REB',
                avgTotals === 'Totals'
                  ? item.reb || 0
                  : ((item.reb || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'AST',
                avgTotals === 'Totals'
                  ? item.ast || 0
                  : ((item.ast || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'STL',
                avgTotals === 'Totals'
                  ? item.stl || 0
                  : ((item.stl || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'BLK',
                avgTotals === 'Totals'
                  ? item.blk || 0
                  : ((item.blk || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'TOV',
                avgTotals === 'Totals'
                  ? item.turnover || 0
                  : ((item.turnover || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'PF',
                avgTotals === 'Totals'
                  ? item.pf || 0
                  : ((item.pf || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn(
                'PTS',
                avgTotals === 'Totals'
                  ? item.pts || 0
                  : ((item.pts || 0) / item.gamesPlayed).toFixed(1)
              )}
              {statColumn('FG%', ((item.fgm / item.fga || 0) * 100).toFixed(1))}
              {statColumn(
                '3FG%',
                ((item.fg3m / item.fg3a || 0) * 100).toFixed(1)
              )}
              {statColumn('FT%', ((item.ftm / item.fta || 0) * 100).toFixed(1))}
            </Flex>
          </>
        ) : (
          <Center pt={'15%'}>
            <Skeleton
              borderRadius="sm"
              alignSelf="center"
              w="240px"
              h="280px"
              endColor="warmGray.200"
            />
          </Center>
        )}
      </>
    );
  };

  const renderEmpty = () => {
    return (
      <>
        {!initialMount && !isLoading && (
          <Stack py="25%">
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
              Set the season to get averages.
            </Text>
          </Stack>
        )}
      </>
    );
  };

  const renderHeader = () => {
    return (
      <>
        {!initialMount && dataArray.length > 0 && (
          <VStack
            alignSelf="flex-end"
            mt={responsiveHeight(2)}
            px={responsiveWidth(18)}
          >
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
            <Text alignSelf="flex-end" fontSize="14px" fontFamily="Oswald-Bold">
              {season}-{parseInt(season) + 1}{' '}
              {isPostSeason ? 'Playoffs' : 'Regular Season'}
            </Text>
          </VStack>
        )}
      </>
    );
  };

  return (
    <>
      {!isLoading ? (
        <FlatList
          scrollEnabled={false}
          data={dataArray}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Center py="25%">
          <Placeholder />
        </Center>
      )}
    </>
  );
};

export default PlayerAveragesTab;
