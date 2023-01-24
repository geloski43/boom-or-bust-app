import React, { useEffect, useState } from 'react';
import { getPlayer, getStats } from '../api/ball-dont-lie-api';
import { getInfo } from '../api/web-search-api';
import { Text, View, Animated, StyleSheet, Platform } from 'react-native';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import { useColorMode, Box } from 'native-base';
import SeasonOption from '../components/player/season-option';
import PlayerProfileTab from '../components/player/player-profile-tab';
import PlayerAveragesTab from '../components/player/player-averages-tab';
import HeaderForeground from '../components/player/header-foreground';
import Header from '../components/player/header';
import { PlayerHeaderPlaceholder } from '../components/placeholders';
import {
  genericPlayerImage,
  findPlayerImage,
  width,
  height,
  responsiveHeight,
  responsiveWidth,
  ifIphoneX,
  groupBy,
  matchedTeam,
} from '../utils/utils';
import PlayerGameStatsTab from '../components/player/player-game-stats-tab';

const { event, ValueXY } = Animated;
const Player = ({ route, navigation }) => {
  const { itemId, fullName, biometrics } = route.params;
  const { colorMode, toggleColorMode } = useColorMode();
  // parallax states
  const [headerLayout, setHeaderLayout] = useState({ height: 0 });
  const [contentHeight, setContentHeight] = useState({});
  const [scrollY, setScrollY] = useState(new ValueXY());
  // parallax states

  const [initialMount, setInitialMount] = useState(true);
  const [player, setPlayer] = useState({});
  const [playerProfile, setPlayerProfile] = useState([]);
  // we created 3 loading states to prevent re render of sub components
  const [subLoading, setSubLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  // grouped stats will be used when a player has played on multiple teams in a season
  const [groupedStats, setGroupedStats] = useState([]);
  const [stats, setStats] = useState([]);
  const [averages, setAverages] = useState([]);
  const [season, setSeason] = useState(new Date().getFullYear());
  const [isPostSeason, setIsPostSeason] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [playerHeaderText, setPlayerHeaderText] = useState(biometrics);
  const [teamData, setTeamData] = useState([]);

  //game stats tab states
  const [statsTabPage, setStatsTabPage] = useState(1);
  const [statsByTeamIndex, setStatsByTeamIndex] = useState(null);

  // averages tab state
  const [averagesByTeamIndex, setAveragesByTeamIndex] = useState(null);

  // we need this to show season data inside the option pop up
  const [num, setNum] = useState(parseInt(new Date().getFullYear()));
  const [truthy, setTruthy] = useState(false);

  const fetchPlayer = () => {
    if (!itemId) {
      console.log('route params and state have been reset');
      return;
    }
    setQuickLoading(true);
    let obj = {};
    getPlayer(itemId)
      .then((res) => {
        obj = {
          ...res.data,
          playerImage:
            findPlayerImage(res.data.id) ||
            genericPlayerImage(res.data.team.full_name),
        };
        setPlayer(obj);
        setQuickLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setQuickLoading(false);
      });
  };

  const fetchStats = (year, id, postSeason) => {
    setStatsTabPage(1);
    setStatsByTeamIndex(null);
    setAveragesByTeamIndex(null);
    console.log('fetching stats');
    let resData = [];
    let gameStats = [];
    let totalGamesCount = 0;
    let acccumulatedTotals = {};
    let mins = [];
    let voidGames = [];
    let currentTeam = [];
    let teams = [];
    //  we update subLoading after first mount
    // to prevent re render of sub components
    if (initialMount) {
      setSlowLoading(true);
    } else {
      setSubLoading(true);
    }
    getStats(year, id, postSeason)
      .then((res) => {
        resData = res.data.data;
        // get invalid games to be substracted from total games
        voidGames = res.data.data.filter(
          (game) =>
            game.min === null ||
            game.min === '0:00' ||
            game.min === '' ||
            game.min === '0'
        );
        totalGamesCount = res.data.meta.total_count - voidGames.length;
        // if no data reset some states and return early
        if (resData.length === 0 || totalGamesCount === 0) {
          if (initialMount) {
            setSlowLoading(false);
          } else {
            setSubLoading(false);
          }
          setInitialMount(false);
          setGamesPlayed(0);
          setAverages([]);
          setGroupedStats([]);
          setStats([]);
          console.log('zero data');
          return;
        }
        // else do all below
        setGamesPlayed(totalGamesCount);
        // we convert min values from Min:Sec format to minutes only
        mins = resData.map((obj) => ({
          convertedMins:
            obj.min && obj.min.includes(':')
              ? parseInt(obj.min.slice(0, 2)) +
                  parseInt(obj.min.slice(-2)) / 60 || 0
              : parseInt(obj.min) || 0,
        }));
        // we add team details(logo, home city etc.) in each item
        // teamid which we will use to group games by same team if a player has multiple teams in a season
        // and filter out void games data from the api
        gameStats = resData
          .filter(
            (item) =>
              item.min !== null &&
              item.min !== '0:00' &&
              item.min !== '' &&
              item.min !== '0'
          )
          .map((obj) => ({
            ...obj,
            teamId: obj.team.id,
            visitor_team_logo: matchedTeam(obj.game.visitor_team_id).logo,
            visitor_team_name: matchedTeam(obj.game.visitor_team_id).name,
            home_team_logo: matchedTeam(obj.game.home_team_id).logo,
            home_team_name: matchedTeam(obj.game.home_team_id).name,
            homeTeamCity: matchedTeam(obj.game.home_team_id).city,
          }));

        // we will usee this to add team details in the accumulated totals object
        currentTeam = resData.map((obj) => ({
          teamId: obj.team.id,
          teamAbbr: obj.team.abbreviation,
          teamFullName: obj.team.full_name,
          teamLogo: matchedTeam(obj.team.id).logo,
        }));
        teams =
          currentTeam &&
          currentTeam.reduce((acc, current) => {
            const x = acc.find((item) => item.teamId === current.teamId);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

        // accumulated totals
        acccumulatedTotals = {
          pts: resData.reduce(function (prev, cur) {
            return prev + cur.pts;
          }, 0),
          reb: resData.reduce(function (prev, cur) {
            return prev + cur.reb;
          }, 0),
          ast: resData.reduce(function (prev, cur) {
            return prev + cur.ast;
          }, 0),
          blk: resData.reduce(function (prev, cur) {
            return prev + cur.blk;
          }, 0),
          turnover: resData.reduce(function (prev, cur) {
            return prev + cur.turnover;
          }, 0),
          stl: resData.reduce(function (prev, cur) {
            return prev + cur.stl;
          }, 0),

          fga: resData.reduce(function (prev, cur) {
            return prev + cur.fga;
          }, 0),
          fgm: resData.reduce(function (prev, cur) {
            return prev + cur.fgm;
          }, 0),

          fg3a: resData.reduce(function (prev, cur) {
            return prev + cur.fg3a;
          }, 0),
          fg3m: resData.reduce(function (prev, cur) {
            return prev + cur.fg3m;
          }, 0),

          fta: resData.reduce(function (prev, cur) {
            return prev + cur.fta;
          }, 0),
          ftm: resData.reduce(function (prev, cur) {
            return prev + cur.ftm;
          }, 0),

          pf: resData.reduce(function (prev, cur) {
            return prev + cur.pf;
          }, 0),
          oreb: resData.reduce(function (prev, cur) {
            return prev + cur.oreb;
          }, 0),
          dreb: resData.reduce(function (prev, cur) {
            return prev + cur.dreb;
          }, 0),
          min:
            mins &&
            mins.reduce(function (prev, cur) {
              return prev + cur.convertedMins;
            }, 0),
          team: teams.map((team, i) => {
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

        // we need teamData so we can conditionally style when we select a team in the list
        // if a player has played on multiple teams
        setTeamData(
          teams.map((team, i) => {
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
          })
        );
        // we use this on header foreground
        setAverages([
          {
            ...acccumulatedTotals,
            isPostSeason,
            season,
            gamesPlayed: totalGamesCount,
          },
        ]);
        // we use this to group stats by team so we can easily select data for a single team
        setGroupedStats(groupBy(gameStats, 'teamId'));
        console.log('has data first index', totalGamesCount);
        // we use this to display total stats if there are multiple teams
        setStats(gameStats);
        if (initialMount) {
          setSlowLoading(false);
        } else {
          setSubLoading(false);
        }
        setInitialMount(false);
      })
      .catch((err) => {
        if (initialMount) {
          setSlowLoading(false);
        } else {
          setSubLoading(false);
        }
        console.log(err);
        setInitialMount(false);
      });
  };

  const fetchProfile = () => {
    let year = 0;
    let header = '';
    if (!fullName) {
      console.log('route params and state have been reset');
      return;
    }
    setQuickLoading(true);
    getInfo(fullName)
      .then((response) => response.json())
      .then((data) => {
        const content = data.Infobox.content;
        const yearDrafted =
          content && content.find((values) => values.label === 'NBA draft');
        const listedHeight =
          content && content.find((values) => values.label === 'Listed height');
        const listedWeight =
          content && content.find((values) => values.label === 'Listed weight');
        console.log('content info is', content && content);
        setQuickLoading(false);
        if (yearDrafted && listedHeight && listedWeight) {
          console.log('there is profile info listedHeight is', listedHeight);
          // test if value has a number in it
          header =
            /\d/.test(listedHeight.value.slice(0, 1)) &&
            /\d/.test(listedHeight.value.slice(5, -3)) &&
            /\d/.test(listedWeight.value)
              ? `${listedHeight.value.slice(0, 1)}'${listedHeight.value.slice(
                  5,
                  -3
                )}",${listedWeight.value}s`
              : biometrics;
          year = /\d/.test(parseInt(yearDrafted.value.slice(0, 4)))
            ? parseInt(yearDrafted.value.slice(0, 4))
            : season - 1;
          setPlayerHeaderText(header);
          setSeason(year);
          setNum(year);
          setPlayerProfile(data.Infobox.content);
          fetchStats(year, itemId, isPostSeason);
        } else {
          console.log('there is no profile info listedweight is', listedWeight);
          setPlayerHeaderText(biometrics);
          setSeason(season - 1);
          setNum(season - 1);
          fetchStats(season - 1, itemId, isPostSeason);
        }
      })
      .catch((error) => {
        console.log('player info fetch error', error);
        setQuickLoading(false);
      });
  };

  // header parallax functions and variables and components

  const textColor = colorMode === 'dark' ? 'white' : 'black';
  const lgTextSize = 17;
  const headerHeight = ifIphoneX(92, responsiveHeight(13));
  const contentBackground = colorMode === 'dark' ? '#525252' : '#d6d3d1';

  const setHeaderSize = (headerLayout) =>
    setHeaderLayout({ height: headerLayout.height });

  // for parallax scroll position
  const position = (scrollHeight, x) => x * 0.01 * scrollHeight;
  const scrollPosition = (value) => {
    return position(headerLayout.height, value);
  };

  const onLayoutContent = (e, title) => {
    const contentHeightTmp = { ...contentHeight };
    contentHeightTmp[title] = e.nativeEvent.layout.height;

    setContentHeight({
      ...contentHeightTmp,
    });
  };

  // for ios marginBottom
  const calcMargin = (title) => {
    let marginBottom = 50;

    if (contentHeight[title]) {
      const padding = 24;
      const isBigContent = height - contentHeight[title] < 0;

      if (isBigContent) {
        return marginBottom;
      }

      marginBottom = height - padding * 2 - headerHeight - contentHeight[title];

      return marginBottom > 0 ? marginBottom : 0;
    }
    return marginBottom;
  };

  const renderSeasonOption = (size, margin, placement) => {
    return (
      <SeasonOption
        placement={placement}
        margin={margin}
        size={size}
        setSeason={setSeason}
        fetchStats={fetchStats}
        setIsPostSeason={setIsPostSeason}
        player={player}
        num={num}
        setNum={setNum}
        truthy={truthy}
        setTruthy={setTruthy}
      />
    );
  };

  const renderProfile = (title) => {
    const marginBottom = Platform.select({
      ios: calcMargin(title),
      android: 0,
    });

    return (
      <Box
        onLayout={(e) => onLayoutContent(e, title)}
        style={[
          Platform.OS === 'android'
            ? styles.contentContainer
            : styles.contentContainerIos,
          {
            marginBottom,
            backgroundColor: contentBackground,
          },
        ]}
      >
        {playerProfile.length > 0 && (
          <Text style={[styles.contentTitle, { color: textColor }]}>
            {title}
          </Text>
        )}

        <PlayerProfileTab
          playerProfile={playerProfile}
          isLoading={quickLoading}
          initialMount={initialMount}
        />
      </Box>
    );
  };

  const renderAverages = (title) => {
    const marginBottom = Platform.select({
      ios: calcMargin(title),
      android: 0,
    });

    const showTitle = stats.length > 0 && groupedStats.length > 0;

    return (
      <Box
        onLayout={(e) => onLayoutContent(e, title)}
        style={[
          Platform.OS === 'android'
            ? styles.contentContainer
            : styles.contentContainerIos,
          {
            marginBottom,
            backgroundColor: contentBackground,
          },
        ]}
      >
        {showTitle && (
          <Text style={[styles.contentTitle, { color: textColor }]}>
            {title}
          </Text>
        )}
        <PlayerAveragesTab
          stats={stats}
          groupedStats={groupedStats}
          season={season}
          isLoading={subLoading}
          initialMount={initialMount}
          isPostSeason={isPostSeason}
          subLoading={subLoading}
          teamData={teamData}
          totalGamesPlayed={gamesPlayed}
          averagesByTeamIndex={averagesByTeamIndex}
          setAveragesByTeamIndex={setAveragesByTeamIndex}
        />
      </Box>
    );
  };

  const renderGameStats = (title) => {
    const marginBottom = Platform.select({
      ios: calcMargin(title),
      android: 0,
    });

    return (
      <Box
        onLayout={(e) => onLayoutContent(e, title)}
        style={[
          Platform.OS === 'android'
            ? styles.contentContainer
            : styles.contentContainerIos,
          {
            marginBottom,
            backgroundColor: contentBackground,
          },
        ]}
      >
        {stats.length !== 0 && !slowLoading && !subLoading && !initialMount && (
          <Text style={[styles.contentTitle, { color: textColor }]}>
            {title}
          </Text>
        )}
        <PlayerGameStatsTab
          initialMount={initialMount}
          isLoading={slowLoading}
          season={season}
          isPostSeason={isPostSeason}
          teamData={teamData}
          subLoading={subLoading}
          totalGamesPlayed={gamesPlayed}
          stats={stats}
          groupedStats={groupedStats}
          statsTabPage={statsTabPage}
          setStatsTabPage={setStatsTabPage}
          statsByTeamIndex={statsByTeamIndex}
          setStatsByTeamIndex={setStatsByTeamIndex}
        />
      </Box>
    );
  };

  // background of parallax header
  const renderBackground = () => {
    const headerBorderRadius = scrollY.y.interpolate({
      inputRange: [0, height],
      outputRange: [80, 0],
      extrapolate: 'extend',
    });

    return (
      <Animated.View
        style={[
          Platform.OS === 'android' ? styles.background : styles.backgroundIos,
          {
            borderBottomRightRadius: headerBorderRadius,
            backgroundColor: colorMode === 'dark' ? '#002851' : '#e0f2fe',
          },
        ]}
      />
    );
  };

  // parallax top header
  const renderHeader = () => (
    <>
      {!slowLoading && !initialMount ? (
        <Header
          renderSeasonOption={renderSeasonOption}
          player={player}
          fullName={fullName}
          scrollY={scrollY}
          colorMode={colorMode}
          scrollPosition={scrollPosition}
        />
      ) : null}
    </>
  );

  // parallax header foreground
  const renderForeground = () => (
    <>
      {!slowLoading && !initialMount ? (
        <HeaderForeground
          renderSeasonOption={renderSeasonOption}
          scrollPosition={scrollPosition}
          averages={averages}
          scrollY={scrollY}
          fullName={fullName}
          player={player}
          playerHeaderText={playerHeaderText}
          gamesPlayed={gamesPlayed}
          season={season}
          isPostSeason={isPostSeason}
          isLoading={subLoading}
        />
      ) : (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'flex-end',
            paddingBottom: 24,
          }}
        >
          <PlayerHeaderPlaceholder />
        </View>
      )}
    </>
  );

  //  this will run every mount with route.params as deps
  useEffect(() => {
    scrollY.y.addListener(({ value }) => (value = value));
    fetchPlayer();
    fetchProfile();
  }, [itemId, fullName, biometrics]);

  // we add a listener (blur) as the user leaves the screen
  // we will clear the state so when the user navigates back
  // it wont show the previous data
  useEffect(() => {
    const clearState = navigation.addListener('blur', () => {
      console.log('unmounting...');
      setPlayer({});
      setPlayerProfile([]);
      setStats([]);
      setGroupedStats([]);
      setAverages([]);
      setIsPostSeason(false);
      setSeason(new Date().getFullYear());
      setNum(new Date().getFullYear());
      setTruthy(false);
      setGamesPlayed(0);
      setInitialMount(true);
      setPlayerHeaderText('');
      setAveragesByTeamIndex(null);
      setStatsTabPage(1);
      setStatsByTeamIndex(null);
      scrollY.y.removeListener();
      navigation.setParams({ itemId: null, fullName: null, biometrics: null });
    });
    return clearState;
  }, [navigation]);

  return (
    <>
      <StickyParallaxHeader
        foreground={renderForeground()}
        header={renderHeader()}
        tabs={[
          {
            title: 'Profile',
            content: renderProfile('Player profile'),
          },
          {
            title: 'Averages',
            content: renderAverages('Player averages'),
          },
          {
            title: 'Game Stats',
            content: renderGameStats('Game stats'),
          },
        ]}
        background={renderBackground()}
        deviceWidth={width}
        parallaxHeight={responsiveHeight(50)}
        scrollEvent={event(
          [{ nativeEvent: { contentOffset: { y: scrollY.y } } }],
          { useNativeDriver: false }
        )}
        headerSize={setHeaderSize}
        headerHeight={responsiveHeight(13)}
        tabTextStyle={[styles.tabText, { fontSize: lgTextSize }]}
        tabTextContainerStyle={{
          backgroundColor: 'transparent',
          borderRadius: 18,
        }}
        tabTextContainerActiveStyle={{
          backgroundColor: colorMode === 'dark' ? '#374151' : '#e5e7eb',
        }}
        tabsWrapperStyle={{ paddingVertical: 12 }}
      >
        {renderProfile('Player profile')}
      </StickyParallaxHeader>
    </>
  );
};

const styles = StyleSheet.create({
  tabText: {
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f97316',
    fontFamily: 'Oswald-Regular',
  },
  background: {
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#eff6ff',
    height: '100%',
    shadowColor: '#171717',
    elevation: 20,
  },
  backgroundIos: {
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: '#eff6ff',
    height: '100%',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  contentTitle: {
    fontSize: 20,
    lineHeight: 20,
    alignSelf: 'flex-start',
    letterSpacing: -0.2,
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 5,
    fontFamily: 'Oswald-Medium',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderRadius: 10,
    shadowColor: '#171717',
    elevation: 10,
  },
  contentContainerIos: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Player;
