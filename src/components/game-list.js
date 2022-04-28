import React, { useRef } from 'react';
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
  ZStack,
  Checkbox,
  IconButton,
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import BigList from 'react-native-big-list';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const GameList = ({
  data,
  fetchGames,
  isFetchingMore,
  fetchMore,
  isLoading,
  page,
  pagesTotal,
  dateToSearch,
  onDateChange,
  showDatepicker,
  showCalendar,
  isPostSeason,
  setIsPostSeason,
  setPage,
  hasPagination,
}) => {
  let progress = Math.round((page / pagesTotal) * 100);
  const navigation = useNavigation();

  const flatList = useRef();
  const moveToTop = () =>
    flatList.current && flatList.current.scrollToTop({ animmated: true });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Game', {
            itemId: item.id,
          });
        }}
      >
        <Box my="1" rounded="sm" borderWidth="1" p="2">
          {item.postseason && (
            <Badge colorScheme="warning" _dark={{ colorScheme: 'warmGray' }}>
              Playoffs
            </Badge>
          )}
          {!item.postseason && <Badge>Regular Season</Badge>}
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
                  opacity={
                    item.visitor_team_score > item.home_team_score ? 1 : 0.5
                  }
                >
                  {item.visitor_team.name}
                </Text>
                <Text
                  opacity={
                    item.visitor_team_score < item.home_team_score ? 1 : 0.5
                  }
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
                  opacity={
                    item.visitor_team_score > item.home_team_score ? 1 : 0.5
                  }
                >
                  {item.visitor_team_score}
                </Text>
                <Text
                  opacity={
                    item.visitor_team_score < item.home_team_score ? 1 : 0.5
                  }
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
                <Text>{item.status}</Text>
                <Text>{item.time}</Text>
              </Stack>
            </Stack>

            <Stack
              space={2}
              justifyContent="flex-end"
              mx="2"
              direction="column"
            >
              <Text alignSelf="flex-end">{item.date.slice(0, 10)}</Text>
              <Text
                alignSelf="flex-end"
                color="warning.800"
                fontFamily="Oswald-Regular"
              >
                @{item.home_team.city}
              </Text>
            </Stack>
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = () => {
    return (
      <>
        {hasPagination ? (
          <Stack my="1" px="2" direction="row" justifyContent="space-between">
            <Stack
              justifyContent="space-evenly"
              alignItems="center"
              borderRadius="sm"
              bg="blueGray.300"
              direction="row"
              space={2}
            >
              <IconButton
                onPress={showDatepicker}
                alignSelf="center"
                _icon={{
                  as: FontAwesome,
                  name: 'search',
                  size: 'sm',
                  color: 'lightBlue.800',
                }}
              />
              {showCalendar && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateToSearch}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </Stack>

            <Stack
              justifyContent="space-evenly"
              alignItems="center"
              borderRadius="sm"
              bg="blueGray.300"
              direction="row"
              space={2}
            >
              <Checkbox
                onChange={() => {
                  let isPlayoffs =
                    isPostSeason === 'false' || isPostSeason === null
                      ? 'true'
                      : null;
                  let currentPage = 1;
                  setIsPostSeason(isPlayoffs);
                  setPage(1);
                  fetchGames(currentPage, isPlayoffs);
                  console.log(isPostSeason);
                }}
                size="sm"
                value="Playoffs"
                colorScheme="danger"
                defaultIsChecked={
                  isPostSeason !== null && isPostSeason === 'true'
                }
              >
                <Text alignSelf="flex-end" fontSize="2xs">
                  Playoffs
                </Text>
              </Checkbox>
              <Checkbox
                onChange={() => {
                  let isPlayoffs =
                    isPostSeason === 'true' || isPostSeason === null
                      ? 'false'
                      : null;
                  let currentPage = 1;
                  setIsPostSeason(isPlayoffs);
                  setPage(1);
                  fetchGames(currentPage, isPlayoffs);
                  console.log(isPostSeason);
                }}
                size="sm"
                value="Regular Season"
                colorScheme="info"
                defaultIsChecked={
                  isPostSeason !== null && isPostSeason === 'false'
                }
              >
                <Text alignSelf="flex-end" fontSize="2xs">
                  Regular Season
                </Text>
              </Checkbox>
            </Stack>
            <Stack
              borderRadius="full"
              bg="blueGray.300"
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
                  fontSize="12px"
                  fontFamily="Oswald-Bold"
                  borderRadius="md"
                  _dark={{ bg: 'warning.800' }}
                >
                  {progress}%
                </Text>
                <AnimatedCircularProgress
                  size={50}
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
        ) : (
          <Stack
            justifyContent="space-between"
            alignItems="center"
            borderRadius="sm"
            direction="row"
            px="2"
          >
            <Stack
              alignItems="center"
              borderRadius="sm"
              bg="blueGray.300"
              mt="1"
            >
              <IconButton
                onPress={showDatepicker}
                alignSelf="center"
                _icon={{
                  as: FontAwesome,
                  name: 'search',
                  size: 'sm',
                  color: 'lightBlue.800',
                }}
              />
              {showCalendar && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateToSearch}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </Stack>
            <Stack mt="2" p="2" borderRadius="md" bg="blueGray.300">
              <Text>Games on {dateToSearch.toLocaleDateString()}</Text>
            </Stack>
          </Stack>
        )}
      </>
    );
  };

  const PlaceHolderComponent = () => {
    return Array.from(Array(6).keys()).map((v, i) => (
      <Box key={i} my="1" rounded="sm" borderWidth="1" p="2">
        <Skeleton h="20" startColor="coolGray.200" />
      </Box>
    ));
  };

  const renderFooter = () => {
    return (
      pagesTotal === page && (
        <Center mt="2" p="2" borderRadius="md" bg="blueGray.300">
          <Text color="warning.700" fontFamily="Oswald-Regular">
            No More Games to show
          </Text>
        </Center>
      )
    );
  };

  return (
    <>
      <BigList
        footerHeight={50}
        renderFooter={renderFooter}
        ref={flatList}
        refreshing={isLoading}
        onRefresh={() => {
          fetchGames();
          setIsPostSeason(null);
        }}
        sectionHeaderHeight={50}
        renderSectionHeader={renderSectionHeader}
        placeholder={true}
        placeholderComponent={<PlaceHolderComponent />}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (hasPagination && page < pagesTotal) {
            fetchMore(page + 1, isPostSeason);
          } else {
            console.log('No more data');
          }
        }}
        data={data}
        renderItem={renderItem}
        itemHeight={95}
        keyExtractor={(item) => item.id.toString()}
      />
      {isFetchingMore && <Spinner size="lg" my="2" color="warning.500" />}
    </>
  );
};

export default GameList;
