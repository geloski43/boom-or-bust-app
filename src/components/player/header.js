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
          onLoad={(e) => {
            e.target.onload = null;
            setTimeout(() => {
              setImageStatus('Loaded');
            }, 300);
          }}
          source={
            imageStatus !== 'Loaded'
              ? {
                uri: 'https://via.placeholder.com/32/BBC2CC/BBC2CC?text=.....',
              }
              : {
                uri: player && player.playerImage,
              }
          }
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
            fontSize: responsiveWidth(5),
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
<<<<<<< HEAD
<Button
  _pressed={{ colorScheme: 'dark', borderRadius: 'full' }}
  variant="ghost"
  onPress={() => {
    setTimeout(() => {
      modalContext.openSeasonOptionModal();
    }, 900)
  }}
  _dark={{ colorScheme: 'blueGray' }}
  m="1"
  leftIcon={
    <Icon
      mt="5"
      mr={width * 0.05}
      size="23px"
      as={Ionicons}
      name="options-outline"
      color="darkBlue.500"
      _dark={{
        color: 'warmGray.50',
      }}
    />
  }
/>


=======
        {renderSeasonOption('25', '22px', 'right top')}
>>>>>>> 4dfdd50573e07f658303ad63cfbd1064cbead92f
      </Animated.View >
    </View >
  );
};

const styles = StyleSheet.create({
  headerPic: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
});

export default Header;
