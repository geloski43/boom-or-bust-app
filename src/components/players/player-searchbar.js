import React, { useContext, useRef } from 'react';
import {
  Stack,
  Icon,
  Input,
  FormControl,
  WarningOutlineIcon,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Context as PlayerContext } from '../../context/player-context';
import PageProgress from '../../components/page-progress';

const PlayerSearchbar = ({
  searchPlayerByName,
  setPage,
  moveToIndex,
  progress,
  moveToTop,
  initialMount,
  players,
}) => {
  const playerContext = useContext(PlayerContext);
  const { query, playerSearchError } = playerContext.state;

  const handleSearchChange = (text) => {
    playerContext.handleSearchPlayerError(false);
    playerContext.setPlayerQuery(text);
  };
  const inputRef = useRef();

  return (
    <Stack
      borderRadius="lg"
      bg="blueGray.200"
      _dark={{ bg: 'blueGray.900' }}
      my="1"
      px="2"
      direction="row"
      justifyContent={players.length > 0 ? 'space-between' : 'center'}
    >
      <FormControl
        isInvalid={playerSearchError}
        w="55%"
        maxW="300px"
        h={playerSearchError ? '80px' : '46px'}
      >
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please enter a name
        </FormControl.ErrorMessage>
        <Input
          // only in ios
          h={playerSearchError ? (Platform.OS === 'ios' ? '45px' : '') : '40px'}
          onSubmitEditing={() => {
            setPage(1);
            searchPlayerByName(query);
          }}
          ref={inputRef}
          // this will prevent auto scroll top when the input is focused
          // instead move to index save to playerlistscrollposition state
          onPressIn={moveToIndex}
          bg="blueGray.300"
          _dark={{ bg: 'blueGray.600' }}
          value={query}
          onChangeText={handleSearchChange}
          placeholder="Search player"
          variant="filled"
          borderRadius="10"
          my="1"
          px="2"
          borderWidth="0"
          InputLeftElement={
            query.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  playerContext.setPlayerQuery('');
                  inputRef && inputRef.current.focus();
                }}
              >
                <Icon
                  mx="2"
                  size="4"
                  color="red.400"
                  as={<Ionicons name="close-circle-outline" />}
                />
              </TouchableOpacity>
            )
          }
          InputRightElement={
            <TouchableOpacity
              onPress={() => {
                setPage(1);
                searchPlayerByName(query);
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
      {!initialMount && players.length > 0 && (
        <PageProgress progress={progress} moveToTop={moveToTop} />
      )}
    </Stack>
  );
};

export default PlayerSearchbar;
