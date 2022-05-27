import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import {
  Text,
  VStack,
  Image,
  Stack,
  Box,
  IconButton,
  ScrollView,
  Container,
  Link,
  PresenceTransition,
  Icon,
  Button,
  useColorModeValue,
  Center,
  WarningOutlineIcon,
  Input,
  FormControl,
} from 'native-base';
import { Entypo } from '@expo/vector-icons';
import NumericInput from 'react-native-numeric-input';

const PlayerProfiletabs = ({
  playerDetailedInfo,
  fetchAverage,
  setSeason,
  averages,
  setAverages,
  season,
}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'profile', title: 'Profile' },
    { key: 'averages', title: 'Averages' },
    { key: 'stats', title: 'Game Stats' },
  ]);

  const handleChangeSeason = (text) => setSeason(text);

  const PlayerProfile = () => {
    return (
      <ScrollView borderRadius="xl" bg="muted.100" _dark={{ bg: 'muted.600' }}>
        {playerDetailedInfo ? (
          <VStack space={3}>
            {playerDetailedInfo.map((v, i) => (
              <Container p="2" key={i} alignItems="flex-start">
                {v.label !== 'Instance of' && (
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontFamily="Oswald-SemiBold"
                  >
                    {v.label}:
                  </Text>
                )}

                {typeof v.value === 'string' &&
                  v.data_type !== 'instagram_profile' &&
                  v.data_type !== 'twitter_profile' &&
                  v.data_type !== 'official_website' &&
                  v.data_type !== 'facebook_profile' ? (
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontWeight="400"
                  >
                    {v.value}
                  </Text>
                ) : (
                  <Link
                    href={
                      v.data_type === 'instagram_profile'
                        ? `https://www.instagram.com/${v.value}`
                        : v.data_type === 'twitter_profile'
                          ? `https://twitter.com/${v.value}`
                          : v.data_type === 'facebook_profile'
                            ? `https://www.facebook.com/${v.value}`
                            : v.data_type === 'official_website'
                              ? v.value
                              : null
                    }
                  >
                    {v.data_type === 'instagram_profile'
                      ? `https://www.instagram.com/${v.value}`
                      : v.data_type === 'twitter_profile'
                        ? `https://twitter.com/${v.value}`
                        : v.data_type === 'facebook_profile'
                          ? `https://www.facebook.com/${v.value}`
                          : v.data_type === 'official_website'
                            ? v.value
                            : null}
                  </Link>
                )}
              </Container>
            ))}
          </VStack>
        ) : (
          <Stack my="20px" direction="row" justifyContent="center" space={2}>
            <WarningOutlineIcon mt="1" size="xs" color="red.400" />
            <Text fontSize="15px" fontFamily="Oswald-Regular" color="red.400">
              No data available
            </Text>
          </Stack>
        )}
      </ScrollView>
    );
  };

  const PlayerAverages = () => (
    <ScrollView
      // keyboardShouldPersistTaps="always"
      borderRadius="xl"
      bg="muted.100"
      _dark={{ bg: 'muted.600' }}
    >
      <Stack
        my="2"

        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        {/* <NumericInput
          value={parseInt(season)}
          onChange={handleChangeSeason}
          onLimitReached={(isMax, msg) => console.log(isMax, msg)}
          totalWidth={240}
          totalHeight={50}
          iconSize={25}
          step={1}
          valueType="integer"
          rounded
          textColor="#B0228C"
          iconStyle={{ color: 'white' }}
          rightButtonBackgroundColor="#EA3788"
          leftButtonBackgroundColor="#E56B70"
        /> */}
        <Button onPress={() => fetchAverage()} size="xs">
          <Text fontFamily="Oswald-Regular" fontSize="14px">
            Get Averages
          </Text>
        </Button>
        <Input
          w={{
            base: '20%',
            md: '25%',
          }}
          InputRightElement={
            <Icon
              as={<Entypo name="plus" size="xs" />}
              size={5}
              mr="2"
              color="muted.400"
              onPress={() => setSeason((parseInt(season) + 1).toString())}
            />
          }
          onChangeText={handleChangeSeason}
          value={season}
          placeholder="Season"
        />
        {/* <VStack>
          <IconButton
            onPress={() => setSeason((parseInt(season) + 1).toString())}
            _icon={{
              as: Entypo,
              name: 'chevron-small-right',
              size: 'xs',
            }}
          />
          <IconButton
            _icon={{
              as: Entypo,
              name: 'chevron-small-down',
              size: 'xs',
            }}
          />
        </VStack> */}
      </Stack>
      {averages.length > 0 ? (
        <VStack>
          <Text>has data</Text>
        </VStack>
      ) : (
        <Stack my="20px" direction="row" justifyContent="center" space={2}>
          <WarningOutlineIcon mt="1" size="xs" color="red.400" />
          <Text fontSize="15px" fontFamily="Oswald-Regular" color="red.400">
            Set a season to get averages
          </Text>
        </Stack>
      )}
    </ScrollView>
  );

  const PlayerStats = () => (
    <Box>
      <Text color="amber.800">This is stats 3</Text>
    </Box>
  );

  const initialLayout = {
    width: Dimensions.get('window').width,
  };
  const renderScene = SceneMap({
    profile: PlayerProfile,
    averages: PlayerAverages,
    stats: PlayerStats,
  });

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const color =
            index === i
              ? useColorModeValue('#000', '#e5e5e5')
              : useColorModeValue('#1f2937', '#a1a1aa');
          const borderColor =
            index === i
              ? 'cyan.500'
              : useColorModeValue('coolGray.200', 'gray.400');
          return (
            <Box
              key={route.key}
              borderBottomWidth="3"
              borderColor={borderColor}

              alignItems="center"
              p="2"
            >
              <Pressable
                onPress={() => {
                  console.log(i);
                  setIndex(i);
                }}
              >
                <Animated.Text
                  style={{
                    color,
                    opacity,
                  }}
                >
                  {route.title}
                </Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box mt="-10px" >
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{ marginTop: StatusBar.currentHeight }}
      />
    </Box>
  );
};

export default PlayerProfiletabs;
