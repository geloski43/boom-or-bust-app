import React, { useState } from 'react';
import { Text, View, Animated, StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight } from '../../utils/utils';
import BackButton from '../back-button';

const Header = ({
  player,
  fullName,
  scrollY,
  colorMode,
  scrollPosition,
  renderSeasonOption,
}) => {
  const [imageStatus, setImageStatus] = useState('Not Loaded');

  const [beforeFadeImg, startFadeImg, finishFadeImg] = [
    scrollPosition(30),
    scrollPosition(40),
    scrollPosition(70),
  ];
  const [beforeFadeName, startFadeName, finishFadeName] = [
    scrollPosition(50),
    scrollPosition(60),
    scrollPosition(75),
  ];

  const imageOpacity = scrollY.y.interpolate({
    inputRange: [0, beforeFadeImg, startFadeImg, finishFadeImg],
    outputRange: [0, 0, 0.5, 1],
    extrapolate: 'clamp',
  });
  const nameOpacity = scrollY.y.interpolate({
    inputRange: [0, beforeFadeName, startFadeName, finishFadeName],
    outputRange: [0, 0, 0.5, 1],
    extrapolate: 'clamp',
  });
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colorMode === 'dark' ? '#002851' : '#e0f2fe',
        paddingTop: responsiveHeight(5),
      }}
    >
      <Animated.View>
        <BackButton route={'Players'} />
      </Animated.View>
      <Animated.View style={{ paddingHorizontal: 22, opacity: imageOpacity }}>
        <Animated.Image
          source={player.playerImage}
          style={[
            styles.headerPic,
            {
              opacity: imageOpacity,
              backgroundColor: colorMode === 'dark' ? 'white' : 'orange',
              borderRadius: 5,
            },
          ]}
        />
      </Animated.View>
      <Animated.View
        style={{
          opacity: nameOpacity,
          paddingTop: 20,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            color: colorMode === 'dark' ? 'white' : 'black',
            fontSize: 17,
            lineHeight: 24,
            letterSpacing: -1,
            fontFamily: 'Oswald-Regular',
          }}
        >
          {fullName}
        </Text>
      </Animated.View>
      <Animated.View
        style={{
          opacity: nameOpacity,
        }}
      >
        {renderSeasonOption('25', '22px', 'right top')}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerPic: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginTop: -15,
  },
});

export default Header;
