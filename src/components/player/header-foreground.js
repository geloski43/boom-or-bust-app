import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { responsiveWidth } from '../../utils/utils';
import { Text, Skeleton, useColorMode } from 'native-base';

const HeaderForeground = ({
  scrollPosition,
  averages,
  scrollY,
  fullName,
  player,
  playerHeaderText,
  gamesPlayed,
  season,
  isPostSeason,
  isLoading,
  renderSeasonOption,
}) => {
  const { colorMode } = useColorMode();

  const lgTextSize = responsiveWidth(5);
  const smallTextSize = responsiveWidth(4);
  const textColor = colorMode === 'dark' ? 'white' : 'black';

  const startSize = responsiveWidth(23);
  const endSize = responsiveWidth(12);
  const [startImgAnimation, finishImgAnimation] = [
    scrollPosition(27),
    scrollPosition(32),
  ];
  const [startAuthorFade, finishAuthorFade] = [
    scrollPosition(40),
    scrollPosition(50),
  ];
  const imageOpacity = scrollY.y.interpolate({
    inputRange: [0, startImgAnimation, finishImgAnimation],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });
  const imageSize = scrollY.y.interpolate({
    inputRange: [0, startImgAnimation, finishImgAnimation],
    outputRange: [startSize, startSize, endSize],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.y.interpolate({
    inputRange: [0, startAuthorFade, finishAuthorFade],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const Placeholder = () => {
    return (
      <Animated.View>
        <Skeleton.Text startColor="warmGray.200" m="1" lines={1} w="170px" />
        <Skeleton.Text startColor="warmGray.200" m="1" lines={1} w="170px" />
      </Animated.View>
    );
  };

  const statColumn = (title, value) => {
    return (
      <Animated.View
        style={[
          styles.headerStatsContainer,
          { paddingRight: responsiveWidth(2) },
        ]}
      >
        <Text
          style={[
            styles.headerStatsTitle,
            { fontSize: smallTextSize, color: textColor },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.headerStatsTitle,
            { fontSize: smallTextSize, color: textColor },
          ]}
        >
          {value}
        </Text>
      </Animated.View>
    );
  };

  const renderAverages = () => {
    return (
      <>
        {averages &&
          averages.map((avg, indx) => {
            const tSPct = avg.pts / (2 * avg.fga + 0.88 * avg.fta);
            return (
              <Animated.View
                key={indx}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Animated.View
                  style={[
                    styles.headerStatsContainer,
                    { paddingRight: responsiveWidth(2) },
                  ]}
                >
                  <Text
                    style={[
                      styles.headerStatsTitle,
                      { fontSize: smallTextSize, color: textColor },
                    ]}
                  >
                    TM
                  </Text>
                  <Animated.View
                    style={{ display: 'flex', flexDirection: 'row' }}
                  >
                    {avg.team &&
                      avg.team.map((team, indx) => (
                        <Text
                          key={team.teamId}
                          style={[
                            styles.headerStatsTitle,
                            {
                              fontSize: smallTextSize,
                              color: textColor,
                            },
                          ]}
                        >
                          {team.teamAbbr}
                          {avg.team && avg.team.length - 1 === indx ? '' : '/'}
                        </Text>
                      ))}
                  </Animated.View>
                </Animated.View>
                {statColumn('PPG', ((avg.pts || 0) / gamesPlayed).toFixed(1))}
                {statColumn('RPG', ((avg.reb || 0) / gamesPlayed).toFixed(1))}
                {statColumn('APG', ((avg.ast || 0) / gamesPlayed).toFixed(1))}
                {statColumn('SPG', ((avg.stl || 0) / gamesPlayed).toFixed(1))}
                {statColumn('BPG', ((avg.blk || 0) / gamesPlayed).toFixed(1))}
                {statColumn('TS%', ((tSPct || 0) * 100).toFixed(1))}
              </Animated.View>
            );
          })}
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'flex-end',
      }}
    >
      <Animated.View style={{ opacity: imageOpacity }}>
        <Animated.Image
          source={{
            uri: player && player.playerImage,
          }}
          style={{
            width: imageSize,
            height: imageSize,
            backgroundColor: colorMode === 'dark' ? 'white' : 'orange',
            borderRadius: 5,
          }}
        />
      </Animated.View>
      <Animated.View
        style={{ opacity: titleOpacity, paddingTop: 24, paddingBottom: 24 }}
      >
        <>
          <Text
            style={[
              styles.headerText,
              { fontSize: lgTextSize, color: textColor },
            ]}
          >
            {fullName}
          </Text>

          {player.position && playerHeaderText ? (
            <Text
              style={[
                styles.headerText,
                { fontSize: smallTextSize, color: textColor },
              ]}
            >
              {playerHeaderText} &#8226; {player.team && player.team.name}{' '}
              &#8226; {player.position}
            </Text>
          ) : (
            <>
              {playerHeaderText ? (
                <Text
                  style={[
                    styles.headerText,
                    { fontSize: smallTextSize, color: textColor },
                  ]}
                >
                  {playerHeaderText} &#8226; {player.team && player.team.name}
                </Text>
              ) : (
                <>
                  {player.position ? (
                    <Text
                      style={[
                        styles.headerText,
                        { fontSize: lgTextSize, color: textColor },
                      ]}
                    >
                      {player.team && player.team.full_name} &#8226;{' '}
                      {player.position}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.headerText,
                        { fontSize: lgTextSize, color: textColor },
                      ]}
                    >
                      {player.team && player.team.full_name}
                    </Text>
                  )}
                </>
              )}
            </>
          )}
          {!isLoading ? (
            <>
              {gamesPlayed === 0 ? (
                <Animated.View>
                  <Text
                    style={{
                      lineHeight: 20,
                      letterSpacing: -1,
                      fontFamily: 'Oswald-Regular',
                    }}
                  >
                    No game logs available
                  </Text>
                </Animated.View>
              ) : (
                renderAverages()
              )}
            </>
          ) : (
            <Placeholder />
          )}
          <Animated.View
            style={{
              paddingRight: responsiveWidth(2),
              display: 'flex',
              flexDirection: 'row',
              justifyContent:
                averages.length !== 0 ? 'space-around' : 'space-between',
            }}
          >
            {!isLoading ? (
              <Text
                style={[
                  styles.altHeaderText,
                  {
                    fontSize: smallTextSize,
                    color: textColor,
                  },
                ]}
              >
                {season}-{parseInt(season) + 1}{' '}
                {isPostSeason ? 'Playoffs' : 'Reg. Season'}
              </Text>
            ) : (
              <Skeleton.Text
                startColor="warmGray.200"
                m="1"
                lines={1}
                w="105px"
              />
            )}
            {renderSeasonOption('30', '-12px', 'right bottom')}
          </Animated.View>
        </>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStatsTitle: {
    lineHeight: 25,
    letterSpacing: -1,
    fontFamily: 'Oswald-Regular',
    alignSelf: 'center',
  },
  headerText: {
    lineHeight: 25,
    fontFamily: 'Oswald-Regular',
  },
  altHeaderText: {
    lineHeight: 25,
    fontFamily: 'Oswald-Regular',
    letterSpacing: -1,
  },
  headerStatsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default HeaderForeground;
