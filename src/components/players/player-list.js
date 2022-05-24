import React, { useRef, useContext, useMemo, useState } from 'react';
import {
  Skeleton,
  Text,
  Box,
  Image,
  Spinner,
  Stack,
  Center,
  Icon,
  VStack,
  Flex,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BigList from 'react-native-big-list';
import { EvilIcons } from '@expo/vector-icons';
import { Context as PlayerContext } from '../../context/player-context';

const PlayerList = ({
  data,
  fetchPlayers,
  isFetchingMore,
  fetchMore,
  isLoading,
  page,
  pagesTotal,
  setPage,
  hasPagination,
  initialMount,
  playerlistRef,
}) => {
  const playerContext = useContext(PlayerContext);

  const [onViewItems, setOnViewItems] = useState([]);

  const navigation = useNavigation();

  const onViewRef = useRef((viewableItems) => {
    playerContext.setPlayerlistScrollPosition(
      viewableItems.viewableItems[0] && viewableItems.viewableItems[0].index
    );
    setOnViewItems(viewableItems);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item }) => {
    return (
      <Center
        shadow={2}
        m="1"
        p="2"
        rounded="sm"
        overflow="hidden"
        borderColor="coolGray.200"
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
        <VStack alignItems="center">
          <Stack alignItems="center" direction="column">
            <Image
              size={'100px'}
              resizeMode={'contain'}
              source={{ uri: item.playerImage }}
              alt="Alternate Text"
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Player', {
                  itemId: item.id,
                  fullName: `${item.first_name} ${item.last_name}`,
                  biometrics:
                    item.height_feet && item.height_inches && item.weight_pounds
                      ? `${item.height_feet}'${item.height_inches}",${item.weight_pounds}lbs`
                      : '',
                });
              }}
            >
              <Stack direction="row" space={2}>
                <Text fontFamily="Oswald-Bold">{item.first_name}</Text>
                <Text fontFamily="Oswald-Bold">{item.last_name}</Text>
              </Stack>
            </TouchableOpacity>
          </Stack>

          <Stack alignItems="center" space={2} direction="row">
            <Text
              color="warning.800"
              fontFamily="Oswald-Regular"
              _dark={{ color: 'warning.400' }}
            >
              {item.team.full_name}
            </Text>
            <Text fontFamily="Oswald-Regular">{item.position}</Text>
          </Stack>
        </VStack>
      </Center>
    );
  };

  const placeholderComponent = () => {
    return (
      <Box alignItems="center">
        {Array.from(Array(3).keys()).map((v, i) => (
          <Flex m="1" mx="2" h={170} key={i} direction="row">
            <Center
              m="1"
              w="50%"
              rounded="sm"
              borderWidth="1"
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
              <Skeleton h="40" startColor="coolGray.200" />
            </Center>

            <Center
              rounded="sm"
              borderWidth="1"
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
              m="1"
              w="50%"
            >
              <Skeleton h="40" startColor="coolGray.200" />
            </Center>
          </Flex>
        ))}
      </Box>
    );
  };

  const renderFooter = () => {
    return pagesTotal === page ? (
      <Center mt="4" p="2" borderRadius="md" bg="blueGray.300">
        <Text color="warning.700" fontFamily="Oswald-Regular">
          No More Players to show
        </Text>
      </Center>
    ) : (
      isFetchingMore && <Spinner size="sm" my="1" color="warning.500" pb="6" />
    );
  };

  const renderEmpty = () => {
    return (
      <>
        {!initialMount && (
          <Stack
            py="4"
            mx="2"
            rounded="sm"
            borderWidth="1"
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
            flex={1}
            mt="20%"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              source={{
                uri: 'https://cdn.statmuse.com/app/images/error/crying-jordan-5d4c26601d2272e1371e5a684b59d845.png?vsn=d',
              }}
              alt="Crying jordan"
              size="xl"
            />
            <Text color="error.400">Sorry, no players available..</Text>
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
            <Text fontSize="xs">or search another name.</Text>
          </Stack>
        )}
      </>
    );
  };

  const onEndReached = () => {
    if (hasPagination && page < pagesTotal) {
      fetchMore(page + 1);
    } else {
      console.log('No more data');
    }
  };

  const onRefresh = () => {
    fetchPlayers();
    setPage(1);
    playerContext.setPlayerlistScrollPosition(0);
    playerContext.setPlayerQuery('');
  };

  const numColumns = useMemo(() => {
    return data.length > 1 ? 2 : 1;
  }, [data]);

  const keyExtractor = (item) => item.id.toString();

  return (
    <BigList
      //to center emptylist component
      numColumns={numColumns}
      hideMarginalsOnEmpty={true}
      renderEmpty={renderEmpty}
      footerHeight={50}
      renderFooter={renderFooter}
      ref={playerlistRef}
      refreshing={isLoading}
      onRefresh={onRefresh}
      placeholder={true}
      placeholderComponent={placeholderComponent}
      onEndReachedThreshold={0.2}
      onEndReached={onEndReached}
      data={data}
      renderItem={renderItem}
      itemHeight={180}
      keyExtractor={keyExtractor}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={viewConfigRef.current}
    />
  );
};

export default PlayerList;
