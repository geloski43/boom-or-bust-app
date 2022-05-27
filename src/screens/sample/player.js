import React from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  Modal,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import { constants, colors, sizes } from './constants';
import styles from './player-screen-styles';
import PlayerProfileTab from '../../components/player/player-profile-tab';
import HeaderForeground from '../../components/player/header-foreground';
import PlayerHeaderPlaceholder from '../../components/placeholders';
import PlayerAveragesTab from '../../components/player/player-averages-tab';
import { useColorMode } from 'native-base';
import {
  findPlayerImage,
  genericPlayerImage,
  groupBy,
  teamLogo,
} from '../../utils/utils';
import { getInfo } from '../../api/web-search-api';
import { getPlayer, getStats } from '../../api/ball-dont-lie-api';

const { event, ValueXY } = Animated;
export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerLayout: {
        height: 0,
      },
      contentHeight: {},
      modalVisible: false,
      player: {},
      playerProfile: [],
      fetchPlayerLoading: false,
      fetchPlayerStatsLoading: false,
      subLoading: false,
      fetchPlayerProfileLoading: false,
      initialMount: true,
      groupedStats: [],
      stats: [],
      averages: [],
      season: new Date().getFullYear(),
      isPostSeason: false,
      totalGamesPlayed: 0,
      playerHeaderText: '',
      teamData: [],
    };
    this.scrollY = new ValueXY();
  }

  fetchPlayer = () => {
    const { itemId } = this.props.route.params;
    if (!itemId) return;
    this.setState({ fetchPlayerLoading: true });
    let obj = {};
    getPlayer(itemId)
      .then((res) => {
        obj = {
          ...res.data,
          playerImage:
            findPlayerImage(res.data.id) ||
            genericPlayerImage(res.data.team.full_name),
        };
        console.log('fetching player', obj);
        this.setState({ fetchPlayerLoading: false });
        this.setState({ player: obj });
      })
      .catch((error) => {
        this.setState({ fetchPlayerLoading: false });
        console.error(error);
      });
  };

  fetchStats = (year, id, postSeason) => {
    const returnLoading = (bool) => {
      if (this.state.initialMount) {
        this.setState({ fetchPlayerStatsLoading: bool });
      } else {
        this.setState({ subLoading: bool });
      }
    };
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
    returnLoading(true);
    getStats(year, id, postSeason)
      .then((res) => {
        resData = res.data.data;
        // get invalid games to be substracted from total games
        voidGames = res.data.data.filter(
          (game) => game.min === null || game.min === '0:00' || game.min === ''
        );
        totalGamesCount = res.data.meta.total_count - voidGames.length;
        // if no data reset some states and return early
        if (resData.length === 0 || totalGamesCount === 0) {
          returnLoading(false);
          this.setState({
            stats: [],
            groupedStats: [],
            totalGamesPlayed: 0,
            initialMount: false,
            averages: [],
          });
          console.log('zero data');
          return;
        }
        // else do all below
        this.setState({ totalGamesPlayed: totalGamesCount });
        // we convert min values from Min:Sec format to minutes only
        mins = resData.map((obj) => ({
          convertedMins:
            obj.min && obj.min.includes(':')
              ? parseInt(obj.min.slice(0, 2)) +
                  parseInt(obj.min.slice(-2)) / 60 || 0
              : parseInt(obj.min) || 0,
        }));
        // we add teamlogo and teamid props,
        // teamid which we will use to group games by same team if a player has multiple teams in a season
        gameStats = resData.map((obj) => ({
          ...obj,
          teamLogo: teamLogo(obj.team.id, obj.team.full_name),
          teamId: obj.team.id,
        }));
        // we will usee this to add team details in the accumulated totals object
        currentTeam = resData.map((obj) => ({
          teamId: obj.team.id,
          teamAbbr: obj.team.abbreviation,
          teamFullName: obj.team.full_name,
          teamLogo: teamLogo(obj.team.id, obj.team.full_name),
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
                  game.team.id === team.teamId ||
                  game.min !== null ||
                  game.min !== '0:00' ||
                  game.min !== ''
              ).length,
            };
          }),
        };

        // we need teamData so we can conditionally style when we select a team in the list
        // if a player has played on multiple teams
        this.setState({
          teamData: teams.map((team, i) => {
            return {
              ...team,
              totalGamesPlayed: gameStats.filter(
                (game) =>
                  game.team.id === team.teamId &&
                  game.min !== null &&
                  game.min !== '0:00' &&
                  game.min !== ''
              ).length,
            };
          }),
        });
        this.setState({
          averages: [
            {
              ...acccumulatedTotals,
              isPostSeason: this.state.isPostSeason,
              season: this.state.season,
              gamesPlayed: totalGamesCount,
            },
          ],
          groupedStats: groupBy(gameStats, 'teamId'),
          stats: gameStats,
        });
        returnLoading(false);
        this.setState({ initialMount: false });
        console.log('fetching stats', acccumulatedTotals);
      })
      .catch((err) => {
        returnLoading(false);
        console.log(err);
        this.setState({ initialMount: false });
      });
  };

  fetchProfile = () => {
    const { fullName, itemId } = this.props.route.params;
    console.log('fetching player info');
    let year = 0;
    let header = '';
    if (!fullName) return;
    this.setState({ fetchPlayerProfileLoading: true });
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
          this.setState({
            playerHeaderText: header,
            season: year,
            playerProfile: content,
          });
          this.fetchStats(year, itemId, this.state.isPostSeason);
        } else {
          console.log('there is no profile info listedweight is', listedWeight);
          this.setState({
            playerHeaderText: biometrics,
            season: this.state.season - 1,
          });
          this.fetchStats(
            this.state.season - 1,
            itemId,
            this.state.isPostSeason
          );
        }
        this.setState({ fetchPlayerProfileLoading: false });
      })
      .catch((error) => {
        console.log('player info fetch error', error);
        this.setState({ fetchPlayerProfileLoading: false });
      });
  };

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      console.log('mounting');
      this.scrollY.y.addListener(({ value }) => (this._value = value));
      this.fetchPlayer();
      this.fetchProfile();
    });

    this.props.navigation.addListener('blur', () => {
      console.log('unmounting');
      this.scrollY.y.removeListener();
      this.props.navigation.setParams({
        itemId: '',
        fullName: '',
        biometrics: '',
      });
      this.setState({
        playerProfile: [],
        stats: [],
        groupedStats: [],
        totalGamesPlayed: 0,
        initialMount: false,
        averages: [],
      });
    });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  setHeaderSize = (headerLayout) => this.setState({ headerLayout });

  openUserModal = (userSelected) => {
    this.setState({ userSelected }, () => this.setModalVisible(true));
  };

  scrollPosition = (value) => {
    const { headerLayout } = this.state;

    return constants.scrollPosition(headerLayout.height, value);
  };

  renderHeader = () => (
    <View style={[styles.headerWrapper, styles.homeScreenHeader]}>
      <TouchableOpacity
        hitSlop={sizes.hitSlop}
        onPress={() => {
          this.props.navigation.navigate('Players');
        }}
      >
        <Image
          style={styles.icon}
          resizeMode="contain"
          source={require('../../assets/icons/Icon-Arrow.png')}
        />
      </TouchableOpacity>
      <Text style={{ margin: 10 }}>Player</Text>
    </View>
  );

  renderForeground = () => {
    const {
      fetchPlayerStatsLoading,
      player,
      playerHeaderText,
      totalGamesPlayed,
      season,
      averages,
      contentHeight,
      subLoading,
      initialMount,
      isPostSeason,
    } = this.state;
    const { fullName } = this.props.route.params;
    return (
      <HeaderForeground
        contentHeight={contentHeight}
        scrollPosition={this.scrollPosition}
        averages={averages}
        scrollY={this.scrollY}
        fullName={fullName}
        player={player}
        playerHeaderText={playerHeaderText}
        gamesPlayed={totalGamesPlayed}
        season={season}
        isPostSeason={isPostSeason}
        isLoading={subLoading}
      />
    );
  };

  calcMargin = (title) => {
    const { contentHeight } = this.state;
    let marginBottom = 50;

    if (contentHeight[title]) {
      const padding = 24;
      const isBigContent = constants.deviceHeight - contentHeight[title] < 0;

      if (isBigContent) {
        return marginBottom;
      }

      marginBottom =
        constants.deviceHeight -
        padding * 2 -
        sizes.headerHeight -
        contentHeight[title];

      return marginBottom > 0 ? marginBottom : 0;
    }

    return marginBottom;
  };

  onLayoutContent = (e, title) => {
    const { contentHeight } = this.state;
    const contentHeightTmp = { ...contentHeight };
    contentHeightTmp[title] = e.nativeEvent.layout.height;
    console.log('onLayout', contentHeightTmp);
    this.setState({
      contentHeight: { ...contentHeightTmp },
    });
  };

  renderContent = (title) => {
    const marginBottom = Platform.select({
      ios: this.calcMargin(title),
      android: 0,
    });

    return (
      <View
        onLayout={(e) => this.onLayoutContent(e, title)}
        style={[styles.content, { marginBottom }]}
      >
        <Text style={styles.contentText}>{title}</Text>
      </View>
    );
  };

  renderProfile = (title) => {
    const { averages, playerProfile, fetchPlayerProfileLoading, initialMount } =
      this.state;
    const marginBottom = Platform.select({
      ios: this.calcMargin(title),
      android: 0,
    });

    return (
      <View
        onLayout={(e) => this.onLayoutContent(e, title)}
        style={[styles.content, { marginBottom }]}
      >
        <Text style={styles.contentText}>{title}</Text>
        <PlayerProfileTab
          averages={averages}
          playerProfile={playerProfile}
          isLoading={fetchPlayerProfileLoading}
          initialMount={initialMount}
        />
      </View>
    );
  };

  render() {
    const { itemId, fullName, biometrics } = this.props.route.params;
    return (
      <React.Fragment>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primaryGreen}
          translucent
        />
        <StickyParallaxHeader
          foreground={this.renderForeground()}
          header={this.renderHeader()}
          tabs={[
            {
              title: 'Profile',
              content: this.renderProfile('Player Profile'),
            },
            {
              title: 'id',
              content: this.renderContent(fullName),
            },
          ]}
          deviceWidth={constants.deviceWidth}
          parallaxHeight={sizes.homeScreenParallaxHeader}
          scrollEvent={event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY.y } } }],
            { useNativeDriver: false }
          )}
          headerSize={this.setHeaderSize}
          headerHeight={sizes.headerHeight}
          tabTextStyle={styles.tabText}
          tabTextContainerStyle={styles.tabTextContainerStyle}
          tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
          tabsContainerBackgroundColor={colors.primaryGreen}
          tabsWrapperStyle={styles.tabsWrapper}
        >
          {this.renderContent(this.state.fullName)}
        </StickyParallaxHeader>
      </React.Fragment>
    );
  }
}
