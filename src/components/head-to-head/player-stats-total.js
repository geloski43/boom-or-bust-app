import React, { useMemo, useCallback, useContext } from 'react';
import {
  Text,
  Stack,
  WarningOutlineIcon,
  Flex,
  VStack,
  Divider,
  useColorMode,
} from 'native-base';
import { responsiveWidth, teamLogo } from '../../utils/utils';
import { Context as StatsContext } from '../../context/stats-context';

const PlayerStatsTotal = ({ stats, season, isPostSeason, teamData }) => {
  const statsContext = useContext(StatsContext);
  const avgTotals = statsContext.state.avgTotals;

  const { colorMode } = useColorMode();

  // we select data if a player has  multiple teams in one season
  // by default we have total stats to display
  const selectedData = useCallback(() => {
    return stats;
  }, [stats, season, isPostSeason]);

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
          stats: [{ ...acccumulatedTotals }],
          season,
          isPostSeason,
          gamesPlayed: totalGamesCount,
        },
      ];
    }
  }, [stats, season, isPostSeason]);

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

  const renderList = () => {
    return (
      <>
        {dataArray[0] ? (
          <Stack
            p="1"
            alignSelf="center"
            w={responsiveWidth(45)}
            direction="row"
            space={1}
            mb={teamData.length / 2}
            _dark={{ borderColor: 'coolGray.500' }}
            borderColor="coolGray.400"
            borderWidth="1"
            borderRadius="lg"
            bg={colorMode === 'dark' ? 'amber.900' : 'amber.400'}
          >
            {teamData
              .filter((v) => v.totalGamesPlayed !== 0)
              .map((team, indx) => (
                <Stack key={team.teamId} direction="row" space={3}>
                  <Text
                    alignSelf="flex-end"
                    fontSize="9px"
                    fontFamily="Oswald-Regular"
                  >
                    {/* {JSON.stringify(dataArray[0].gamesPlayed)} */}
                    {team.teamAbbr} ({team.totalGamesPlayed})
                    {teamData && teamData.length - 1 === indx ? '' : '/'}
                  </Text>
                </Stack>
              ))}
          </Stack>
        ) : (
          <Stack
            p="1"
            alignSelf="center"
            w={responsiveWidth(45)}
            direction="row"
            space={1}
            mb={teamData.length / 2}
            _dark={{ borderColor: 'coolGray.500' }}
            borderColor="coolGray.400"
            borderWidth="1"
            borderRadius="lg"
            bg={colorMode === 'dark' ? 'red.900' : 'red.500'}
          >
            <Stack direction="row" space={3}>
              <WarningOutlineIcon
                color={colorMode === 'dark' ? 'white' : 'white'}
                size="xs"
              />
              <Text
                color={colorMode === 'dark' ? 'white' : 'white'}
                alignSelf="flex-end"
                fontSize="9px"
                fontFamily="Oswald-Regular"
              >
                No games played
              </Text>
            </Stack>
          </Stack>
        )}
        {dataArray[0] &&
          dataArray[0].stats.map((item, index) => {
            let games = dataArray[0] && dataArray[0].gamesPlayed;

            return (
              <Flex
                key={index}
                mx="auto"
                w={responsiveWidth(50)}
                direction="row"
                justifyContent="center"
                alignItems="center"
                wrap="wrap"
              >
                {statColumn('GP', games)}
                {statColumn(
                  'MP',
                  avgTotals === 'Totals'
                    ? (item.min || 0).toFixed(0)
                    : ((item.min || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'FGM',
                  avgTotals === 'Totals'
                    ? item.fgm || 0
                    : ((item.fgm || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'FGA',
                  avgTotals === 'Totals'
                    ? item.fga || 0
                    : ((item.fga || 0) / games).toFixed(1)
                )}
                {statColumn(
                  '3PM',
                  avgTotals === 'Totals'
                    ? item.fg3m || 0
                    : ((item.fg3m || 0) / games).toFixed(1)
                )}
                {statColumn(
                  '3PA',
                  avgTotals === 'Totals'
                    ? item.fg3a || 0
                    : ((item.fg3a || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'FTM',
                  avgTotals === 'Totals'
                    ? item.ftm || 0
                    : ((item.ftm || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'FTA',
                  avgTotals === 'Totals'
                    ? item.fta || 0
                    : ((item.fta || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'ORB',
                  avgTotals === 'Totals'
                    ? item.oreb || 0
                    : ((item.oreb || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'DRB',
                  avgTotals === 'Totals'
                    ? item.dreb || 0
                    : ((item.dreb || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'REB',
                  avgTotals === 'Totals'
                    ? item.reb || 0
                    : ((item.reb || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'AST',
                  avgTotals === 'Totals'
                    ? item.ast || 0
                    : ((item.ast || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'STL',
                  avgTotals === 'Totals'
                    ? item.stl || 0
                    : ((item.stl || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'BLK',
                  avgTotals === 'Totals'
                    ? item.blk || 0
                    : ((item.blk || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'TOV',
                  avgTotals === 'Totals'
                    ? item.turnover || 0
                    : ((item.turnover || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'PF',
                  avgTotals === 'Totals'
                    ? item.pf || 0
                    : ((item.pf || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'PTS',
                  avgTotals === 'Totals'
                    ? item.pts || 0
                    : ((item.pts || 0) / games).toFixed(1)
                )}
                {statColumn(
                  'FG%',
                  ((item.fgm / item.fga || 0) * 100).toFixed(1)
                )}
                {statColumn(
                  '3FG%',
                  ((item.fg3m / item.fg3a || 0) * 100).toFixed(1)
                )}
                {statColumn(
                  'FT%',
                  ((item.ftm / item.fta || 0) * 100).toFixed(1)
                )}
              </Flex>
            );
          })}
      </>
    );
  };

  return renderList();
};

export default PlayerStatsTotal;
