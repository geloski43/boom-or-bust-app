import React, { useContext, useState, useRef } from 'react';
import {
  Skeleton,
  HStack,
  Text,
  Box,
  Image,
  Badge,
  Spinner,
  Stack,
  Center,
  Icon,
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BigList from 'react-native-big-list';
import { parseDate } from '../../utils/utils';
import { Context as GameContext } from '../../context/game-context';
import { EvilIcons } from '@expo/vector-icons';
import * as Localization from 'expo-localization';

const GameList = ({
  data,
  fetchGames,
  isFetchingMore,
  fetchMore,
  isLoading,
  page,
  pagesTotal,
  isPostSeason,
  setIsPostSeason,
  hasPagination,
  initialMount,
  gamelistRef,
  navigation,
}) => {
  const timeZone = Localization.timezone;

  const gameContext = useContext(GameContext);
  const [onViewItems, setOnViewItems] = useState([]);

  const onViewRef = useRef((viewableItems) => {
    gameContext.setGamelistScrollPosition(
      viewableItems.viewableItems[0] && viewableItems.viewableItems[0].index
    );
    setOnViewItems(viewableItems);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const opacity = (firstScore, secondScore) => {
    if (firstScore === secondScore) {
      return 0.5;
    } else if (firstScore > secondScore) {
      return 1;
    }
    return 0.5;
  };

  const renderItem = ({ item }) => {
    const localeDate = () => {
      return timeZone.includes('Asia') && item.date
        ? new Date(
            parseDate(item.date.slice(0, 10)).setDate(
              parseDate(item.date.slice(0, 10)).getDate() + 1
            )
          )
            .toISOString()
            .slice(0, 10)
        : item.date && item.date.slice(0, 10);
    };

    return (
      <Box
        my="1"
        rounded="sm"
        borderWidth="1"
        p="2"
        overflow="hidden"
        borderColor="coolGray.200"
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Game', {
              itemId: item.id,
            });
          }}
        >
          {item.postseason && (
            <Badge
              borderColor="coolGray.400"
              rounded="sm"
              alignSelf={'center'}
              colorScheme="warning"
              variant={'outline'}
            >
              Playoffs
            </Badge>
          )}
          {!item.postseason && (
            <Badge
              borderColor="coolGray.400"
              rounded="sm"
              alignSelf={'center'}
              variant={'outline'}
            >
              Regular Season
            </Badge>
          )}
          <HStack justifyContent="space-between">
            <Stack direction="row">
              <Stack mx="2" direction="column" space={2}>
                <Image
                  size={25}
                  resizeMode={'contain'}
                  borderRadius="sm"
                  source={{ uri: item.visitor_team_logo }}
                  alt="Alternate Text"
                />
                <Image
                  key={item.id}
                  size={25}
                  resizeMode={'contain'}
                  borderRadius="sm"
                  source={{ uri: item.home_team_logo }}
                  alt="Alternate Text"
                />
              </Stack>
              <Stack
                space={2}
                justifyContent="flex-end"
                mx="2"
                direction="column"
              >
                <Text
                  opacity={opacity(
                    item.visitor_team_score,
                    item.home_team_score
                  )}
                >
                  {item.visitor_team.name}
                </Text>
                <Text
                  opacity={opacity(
                    item.home_team_score,
                    item.visitor_team_score
                  )}
                >
                  {item.home_team.name}
                </Text>
              </Stack>
              <Stack
                space={2}
                justifyContent="flex-end"
                mx="2"
                direction="column"
              >
                <Text
                  opacity={opacity(
                    item.visitor_team_score,
                    item.home_team_score
                  )}
                >
                  {item.visitor_team_score}
                </Text>
                <Text
                  opacity={opacity(
                    item.home_team_score,
                    item.visitor_team_score
                  )}
                >
                  {item.home_team_score}
                </Text>
              </Stack>

              <Stack
                space={2}
                justifyContent="flex-end"
                mx="2"
                direction="column"
              >
                {item.status &&
                item.status !== 'Final' &&
                !item.time &&
                timeZone.includes('Asia') ? (
                  <Text>{`${item.status.slice(0, 5)}${
                    item.status.includes('PM') ? 'AM GMT+8' : 'PM GMT+8'
                  }`}</Text>
                ) : (
                  <Text>{item.status}</Text>
                )}

                <Text>{item.time}</Text>
              </Stack>
            </Stack>

            <Stack
              space={2}
              justifyContent="flex-end"
              mx="2"
              direction="column"
            >
              <Text alignSelf="flex-end">{localeDate()}</Text>
              <Text
                alignSelf="flex-end"
                color="warning.800"
                fontFamily="Oswald-Regular"
                _dark={{ color: 'warning.400' }}
              >
                @{item.home_team.city}
              </Text>
            </Stack>
          </HStack>
        </TouchableOpacity>
      </Box>
    );
  };

  const placeholderComponent = () => {
    return Array.from(Array(6).keys()).map((v, i) => (
      <Box
        key={i}
        my="1"
        rounded="sm"
        borderWidth="1"
        p="2"
        overflow="hidden"
        borderColor="coolGray.200"
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
        <Skeleton h="20" startColor="coolGray.200" />
      </Box>
    ));
  };

  const renderFooter = () => {
    return pagesTotal === page ? (
      <Center mt="4" p="2" borderRadius="md" bg="blueGray.300">
        <Text color="warning.700" fontFamily="Oswald-Regular">
          No More Games to show
        </Text>
      </Center>
    ) : (
      isFetchingMore && (
        <Spinner size="sm" mt="4" my="1" color="warning.500" pb="6" />
      )
    );
  };

  const renderEmpty = () => {
    return (
      <>
        {!initialMount && (
          <Stack flex={1} mt="20%" justifyContent="center" alignItems="center">
            <Image
              source={{
                uri: 'https://cdn.statmuse.com/app/images/error/crying-jordan-5d4c26601d2272e1371e5a684b59d845.png?vsn=d',
              }}
              alt="Crying jordan"
              size="xl"
            />
            <Text color="error.400">Sorry, no games available..</Text>
            <Stack direction="row">
              <Text>Pull down to </Text>
              <Icon
                as={EvilIcons}
                color="warning.500"
                name="refresh"
                size={'sm'}
                variant="solid"
              />
            </Stack>
            <Text fontSize="xs">or search another game.</Text>
          </Stack>
        )}
      </>
    );
  };

  const onRefresh = () => {
    fetchGames();
    setIsPostSeason(null);
  };

  const onEndReached = () => {
    if (hasPagination && page < pagesTotal) {
      fetchMore(page + 1, isPostSeason);
    } else {
      console.log('No more data');
    }
  };

  return (
    <>
      <BigList
        //to center emptylist component
        hideMarginalsOnEmpty={true}
        renderEmpty={renderEmpty}
        footerHeight={50}
        renderFooter={renderFooter}
        ref={gamelistRef}
        refreshing={isLoading}
        onRefresh={onRefresh}
        placeholder={true}
        placeholderComponent={placeholderComponent}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        data={data}
        renderItem={renderItem}
        itemHeight={105}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  );
};

export default GameList;
