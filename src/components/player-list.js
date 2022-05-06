import React, { useRef } from 'react';
import {
  Skeleton,
  Text,
  Box,
  Image,
  Spinner,
  Stack,
  Center,
  ZStack,
  IconButton,
  Icon,
  VStack,
  Input,
  FormControl,
  WarningOutlineIcon,
  Flex,
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import BigList from 'react-native-big-list';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  searchPlayerByName,
  playerToSearch,
  setPlayerToSearch,
  searchError,
  setSearchError,
}) => {
  const width = Dimensions.get('window').width;

  let progress = Math.round((page / pagesTotal) * 100);
  const navigation = useNavigation();

  const flatList = useRef();
  const moveToTop = () =>
    flatList.current && flatList.current.scrollToTop({ animmated: true });

  const handleSearchChange = (text) => {
    setSearchError(false);
    setPlayerToSearch(text);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Player', {
            itemId: item.id,
            firsName: item.first_name,
            lastName: item.last_name,
          });
        }}
      >
        <Center m="1" rounded="sm" borderWidth="1" p="2">
          <VStack alignItems="center">
            <Stack alignItems="center" direction="column">
              <Image
                size={'100px'}
                resizeMode={'contain'}
                source={{ uri: item.playerImage }}
                alt="Alternate Text"
              />
              <Stack direction="row" space={2}>
                <Text fontFamily="Oswald-Bold">{item.first_name}</Text>
                <Text fontFamily="Oswald-Bold">{item.last_name}</Text>
              </Stack>
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
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = () => {
    return (
      <Stack
        borderRadius="lg"
        bg="blueGray.200"
        _dark={{ bg: 'blueGray.900' }}
        my="1"
        px="2"
        direction="row"
        justifyContent="space-between"
      >
        <FormControl isInvalid={searchError} w="50%" maxW="300px">
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please enter a name
          </FormControl.ErrorMessage>
          <Input
            bg="blueGray.300"
            _dark={{ bg: 'blueGray.600' }}
            value={playerToSearch}
            onChangeText={handleSearchChange}
            placeholder="Search player"
            variant="filled"
            borderRadius="10"
            my="1"
            px="2"
            borderWidth="0"
            InputRightElement={
              <TouchableOpacity
                onPress={() => {
                  setPage(1);
                  searchPlayerByName(playerToSearch);
                }}
              >
                <Icon
                  mr="2"
                  size="4"
                  color="gray.400"
                  as={<Ionicons name="ios-search" />}
                />
              </TouchableOpacity>
            }
          />
        </FormControl>
        <Stack
          my="1"
          px="2"
          borderRadius="sm"
          bg="blueGray.300"
          _dark={{ bg: 'blueGray.800' }}
          direction="row"
          alignSelf="flex-end"
        >
          <IconButton
            alignSelf="center"
            onPress={moveToTop}
            _icon={{
              as: AntDesign,
              name: 'arrowup',
              size: 'xs',
              color: 'lightBlue.800',
            }}
          />
          <ZStack mx="3" justifyContent="center" mb="-1" pt="1">
            <Text
              alignSelf="center"
              bg="muted.300"
              mt="8"
              fontSize="10px"
              fontFamily="Oswald-Bold"
              borderRadius="md"
              _dark={{ bg: 'warning.800' }}
            >
              {progress}%
            </Text>
            <AnimatedCircularProgress
              size={38}
              width={5}
              backgroundWidth={5}
              fill={progress}
              tintColor="#00ff00"
              tintColorSecondary="#ff0000"
              backgroundColor="#43688f"
              arcSweepAngle={240}
              rotation={240}
              lineCap="round"
            />
          </ZStack>
        </Stack>
      </Stack>
    );
  };

  const PlaceHolderComponent = () => {
    return (
      <Box alignItems="center">
        {Array.from(Array(3).keys()).map((v, i) => (
          <Flex m="1" mx="2" h={170} key={i} direction="row">
            <Center m="1" w="50%" rounded="sm" borderWidth="1">
              <Skeleton h="40" startColor="coolGray.200" />
            </Center>

            <Center m="1" w="50%" rounded="sm" borderWidth="1">
              <Skeleton h="40" startColor="coolGray.200" />
            </Center>
          </Flex>
        ))}
      </Box>
    );
  };

  const renderFooter = () => {
    return (
      pagesTotal === page && (
        <Center mt="4" p="2" borderRadius="md" bg="blueGray.300">
          <Text color="warning.700" fontFamily="Oswald-Regular">
            No More Players to show
          </Text>
        </Center>
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
          </Stack>
        )}
      </>
    );
  };

  return (
    <>
      <BigList
        //to center emptylist component
        numColumns={data.length > 1 ? 2 : 1}
        hideMarginalsOnEmpty={true}
        renderEmpty={renderEmpty}
        footerHeight={50}
        renderFooter={renderFooter}
        ref={flatList}
        refreshing={isLoading}
        onRefresh={() => {
          fetchPlayers();
          setPlayerToSearch('');
          setPage(1);
        }}
        sectionHeaderHeight={70}
        renderSectionHeader={renderSectionHeader}
        placeholder={true}
        placeholderComponent={<PlaceHolderComponent />}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (hasPagination && page < pagesTotal) {
            fetchMore(page + 1);
          } else {
            console.log('No more data');
          }
        }}
        data={data}
        renderItem={renderItem}
        itemHeight={180}
        keyExtractor={(item) => item.id.toString()}
      />

      {isFetchingMore && (
        <Spinner size="sm" my="1" color="warning.500" pb="6" />
      )}
    </>
  );
};

export default PlayerList;
