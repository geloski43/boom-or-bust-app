import React, { useContext } from 'react';
import { Text, Stack, Checkbox, IconButton } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Context as LocalizationContext } from '../../context/localization-context';
import PageProgress from '../../components/page-progress';

const GamelistFilter = ({
  hasPagination,
  onDateChange,
  isPostSeason,
  setIsPostSeason,
  setPage,
  fetchGames,
  showCalendar,
  progress,
  moveToTop,
  initialMount,
  games,
  showDatepicker,
  dateToSearch,
}) => {
  const localeContext = useContext(LocalizationContext);
  const timeZone = localeContext.state.timezoneName;

  return (
    <>
      {hasPagination ? (
        <Stack
          borderRadius="lg"
          bg="blueGray.200"
          _dark={{ bg: 'blueGray.900' }}
          my="1"
          px="2"
          direction="row"
          justifyContent="space-between"
        >
          {Platform.OS === 'android' && (
            <IconButton
              my="1"
              px="2"
              onPress={showDatepicker}
              alignSelf="center"
              _icon={{
                as: FontAwesome,
                name: 'search',
                size: 'xs',
                color: 'lightBlue.800',
              }}
            />
          )}
          {showCalendar && Platform.OS === 'android' && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateToSearch}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {Platform.OS === 'ios' && (
            <DateTimePicker
              style={{ width: 78, backgroundColor: 'white', marginTop: 5 }}
              value={dateToSearch}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <Stack
            my="1"
            px="2"
            justifyContent="space-evenly"
            alignItems="center"
            borderRadius="sm"
            bg="blueGray.300"
            _dark={{ bg: 'blueGray.800' }}
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
              }}
              size="sm"
              value="Regular Season"
              colorScheme="info"
              defaultIsChecked={
                isPostSeason !== null && isPostSeason === 'false'
              }
            >
              <Text alignSelf="flex-end" fontSize="2xs">
                Reg Season
              </Text>
            </Checkbox>
          </Stack>
          {!initialMount && games.length > 0 && (
            <PageProgress progress={progress} moveToTop={moveToTop} />
          )}
        </Stack>
      ) : (
        <Stack
          borderRadius="lg"
          bg="blueGray.200"
          _dark={{ bg: 'blueGray.900' }}
          my="1"
          px="2"
          direction="row"
          justifyContent="space-between"
        >
          {Platform.OS === 'android' && (
            <IconButton
              my="1"
              px="2"
              onPress={showDatepicker}
              alignSelf="center"
              _icon={{
                as: FontAwesome,
                name: 'search',
                size: 'xs',
                color: 'lightBlue.800',
              }}
            />
          )}
          {showCalendar && Platform.OS === 'android' && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateToSearch}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {Platform.OS === 'ios' && (
            <DateTimePicker
              style={{ width: 74, backgroundColor: 'white', marginTop: 5 }}
              value={dateToSearch}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <Stack
            _dark={{ bg: 'blueGray.800' }}
            my="1"
            p="2"
            borderRadius="md"
            bg="blueGray.300"
          >
            <Text>
              {games.length > 0 ? games.length : 'No'}{' '}
              {games.length > 1 ? 'Games' : 'Game'} on{' '}
              {dateToSearch && dateToSearch.toISOString().slice(0, 10)}
            </Text>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default GamelistFilter;
