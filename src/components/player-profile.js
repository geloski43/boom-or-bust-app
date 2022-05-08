import React, { useState } from 'react';
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
} from 'native-base';
import BackButton from '../components/back-button';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { getAverages, getStats } from '../api/ball-dont-lie-api';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { TabView, SceneMap, TabViewPagerPan } from 'react-native-tab-view';
import PlayerProfileTabs from '../components/player-profile-tabs';

const PlayerProfile = ({ player, playerDetailedInfo }) => {
  const [detailedInfoOpen, setDetailedInfoOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'first',
      title: 'Tab 1',
    },
    {
      key: 'second',
      title: 'Tab 2',
    },
    {
      key: 'third',
      title: 'Tab 3',
    },
    {
      key: 'fourth',
      title: 'Tab 4',
    },
  ]);

  const yearDrafted =
    playerDetailedInfo &&
    playerDetailedInfo.find((values) => values.label === 'NBA draft');
  const rookieSeason = yearDrafted
    ? yearDrafted.value.slice(0, 4)
    : new Date().getFullYear();
  const fetchAverage = () => {
    getAverages(rookieSeason, player.id)
      .then((res) => {
        console.log('avgs', res);
      })
      .catch((err) => console.log(err));
  };

  // const FirstRoute = () => {
  //   return (
  //     <ScrollView borderRadius="xl" bg="muted.100" _dark={{ bg: 'muted.600' }}>
  //       <PresenceTransition
  //         visible={detailedInfoOpen}
  //         initial={{
  //           opacity: 0,
  //         }}
  //         animate={{
  //           opacity: 1,
  //           transition: {
  //             duration: 250,
  //           },
  //         }}
  //       >
  //         {playerDetailedInfo ? (
  //           <VStack space={3}>
  //             {playerDetailedInfo.map((v, i) => (
  //               <Container p="2" flex={1} key={i} alignItems="flex-start">
  //                 {v.label !== 'Instance of' && (
  //                   <Text
  //                     color="coolGray.600"
  //                     _dark={{
  //                       color: 'warmGray.200',
  //                     }}
  //                     fontFamily="Oswald-SemiBold"
  //                   >
  //                     {v.label}:
  //                   </Text>
  //                 )}

  //                 {typeof v.value === 'string' &&
  //                 v.data_type !== 'instagram_profile' &&
  //                 v.data_type !== 'twitter_profile' &&
  //                 v.data_type !== 'official_website' &&
  //                 v.data_type !== 'facebook_profile' ? (
  //                   <Text
  //                     color="coolGray.600"
  //                     _dark={{
  //                       color: 'warmGray.200',
  //                     }}
  //                     fontWeight="400"
  //                   >
  //                     {v.value}
  //                   </Text>
  //                 ) : (
  //                   <Link
  //                     href={
  //                       v.data_type === 'instagram_profile'
  //                         ? `https://www.instagram.com/${v.value}`
  //                         : v.data_type === 'twitter_profile'
  //                         ? `https://twitter.com/${v.value}`
  //                         : v.data_type === 'facebook_profile'
  //                         ? `https://www.facebook.com/${v.value}`
  //                         : v.data_type === 'official_website'
  //                         ? v.value
  //                         : null
  //                     }
  //                   >
  //                     {v.data_type === 'instagram_profile'
  //                       ? `https://www.instagram.com/${v.value}`
  //                       : v.data_type === 'twitter_profile'
  //                       ? `https://twitter.com/${v.value}`
  //                       : v.data_type === 'facebook_profile'
  //                       ? `https://www.facebook.com/${v.value}`
  //                       : v.data_type === 'official_website'
  //                       ? v.value
  //                       : null}
  //                   </Link>
  //                 )}
  //               </Container>
  //             ))}
  //           </VStack>
  //         ) : (
  //           <Box px="2" my="20px" justifyContent="center">
  //             <Text color="red.400">No data available</Text>
  //           </Box>
  //         )}
  //       </PresenceTransition>
  //     </ScrollView>
  //   );
  // };
  const FirstRoute = () => {
    return (
      <Box key={'first'} flex={1} my="4">
        <Text>This is Tab 1</Text>
      </Box>
    );
  };

  const SecondRoute = () => (
    <Box key={'second'} flex={1} my="4">
      <Text>This is Tab 2</Text>
    </Box>
  );

  const ThirdRoute = () => (
    <Box key={'third'}>
      <Text color="amber.800">This is Tab 3</Text>
    </Box>
  );

  const FourthRoute = () => (
    <Box key={'fourth'} flex={1} my="4">
      This is Tab 4
    </Box>
  );

  const initialLayout = {
    width: Dimensions.get('window').width,
  };
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
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
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="3"
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
    <>
      <BackButton route={'Players'} text={'Back to Players'} />
      <VStack borderWidth="1" flex={1} rounded="sm" p="1">
        {/* <Stack direction="row" justifyContent="flex-end" space={2}>
          <Button onPress={() => fetchAverage()} size="xs">
            <Text fontFamily="Oswald-Regular" fontSize="10px">
              Averages
            </Text>
          </Button>
          <Button size="xs">
            <Text fontFamily="Oswald-Regular" fontSize="10px">
              Stats
            </Text>
          </Button>
        </Stack>
        <Stack alignItems="center" direction="column">
          <Image
            size={'150px'}
            resizeMode={'contain'}
            source={{ uri: player.playerImage }}
            alt="Alternate Text"
          />
          <Stack direction="row" space={1}>
            <Text fontFamily="Oswald-Bold">{player.first_name}</Text>
            <Text fontFamily="Oswald-Bold">{player.last_name}</Text>
          </Stack>
        </Stack>
        <Stack justifyContent="center" direction="row" space={1}>
          <Text
            color="warning.800"
            fontFamily="Oswald-Regular"
            _dark={{ color: 'warning.400' }}
          >
            {player.team && player.team.full_name}
          </Text>
          <Text fontFamily="Oswald-Regular">{player.position}</Text>
        </Stack> */}
        {/* <IconButton
          alignSelf="center"
          borderRadius="full"
          onPress={() => setDetailedInfoOpen(!detailedInfoOpen)}
          _icon={{
            as: MaterialIcons,
            name: 'expand-more',
          }}
        /> */}

        <PlayerProfileTabs />


        {/* {detailedInfoOpen && (
          <ScrollView
            borderRadius="xl"
            bg="muted.100"
            _dark={{ bg: 'muted.600' }}
          >
            <PresenceTransition
              visible={detailedInfoOpen}
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
              {playerDetailedInfo ? (
                <VStack space={3}>
                  {playerDetailedInfo.map((v, i) => (
                    <Container p="2" flex={1} key={i} alignItems="flex-start">
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
                <Box px="2" my="20px" justifyContent="center">
                  <Text color="red.400">No data available</Text>
                </Box>
              )}
            </PresenceTransition>
          </ScrollView>
        )} */}
      </VStack>
      {/* <Icon
        alignSelf="center"
        as={Entypo}
        name="dots-three-horizontal"
        color="muted.400"
      /> */}
    </>
  );
};

export default PlayerProfile;
