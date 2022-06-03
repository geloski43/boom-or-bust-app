import React from 'react';
import { Text, Box, Image, Badge, Stack, Center, Icon } from 'native-base';
import { dayToShow } from '../../utils/utils';
import { Entypo } from '@expo/vector-icons';
import BackButton from '../back-button';
import { parseDate } from '../../utils/utils';
import * as Localization from 'expo-localization';

const GameDetails = ({ initialMount, game }) => {
  const timeZone = Localization.timezone;

  const opacity = (firstScore, secondScore) => {
    if (firstScore === secondScore) {
      return 0.5;
    } else if (firstScore > secondScore) {
      return 1;
    }
    return 0.5;
  };

  const localeDate = () => {
    return timeZone.includes('Asia') && game.date
      ? new Date(
          parseDate(game.date.slice(0, 10)).setDate(
            parseDate(game.date.slice(0, 10)).getDate() + 1
          )
        )
          .toISOString()
          .slice(0, 10)
      : game.date && game.date.slice(0, 10);
  };

  return (
    <>
      {!initialMount && <BackButton route={'Games'} text={'Back to Games'} />}
      <Box
        rounded="sm"
        p="2"
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
        <Center>
          {game.postseason && (
            <Badge colorScheme="warning" _dark={{ colorScheme: 'warmGray' }}>
              Playoff Game
            </Badge>
          )}
          {!game.postseason && <Badge>Regular Season Game</Badge>}
        </Center>
        <Stack justifyContent="space-between" direction="row">
          <Stack alignItems="center" mx="2" direction="column" space={1}>
            <Image
              size={'20'}
              resizeMode={'contain'}
              borderRadius="sm"
              source={{ uri: game.visitor_team_logo }}
              alt="Alternate Text"
            />

            <Text
              opacity={opacity(game.visitor_team_score, game.home_team_score)}
            >
              {game.visitor_team && game.visitor_team.full_name}
            </Text>
            <Text
              fontFamily="Oswald-Bold"
              opacity={opacity(game.visitor_team_score, game.home_team_score)}
            >
              {game.visitor_team_score}
            </Text>
          </Stack>
          <Stack alignItems="center" space={1} mx="2" direction="column">
            <Image
              key={game.id}
              size={'20'}
              resizeMode={'contain'}
              borderRadius="sm"
              source={{ uri: game.home_team_logo }}
              alt="Alternate Text"
            />
            <Text
              opacity={opacity(game.home_team_score, game.visitor_team_score)}
            >
              {game.home_team && game.home_team.full_name}
            </Text>
            <Text
              fontFamily="Oswald-Bold"
              opacity={opacity(game.home_team_score, game.visitor_team_score)}
            >
              {game.home_team_score}
            </Text>
          </Stack>
        </Stack>
        <Center mx="2">
          {game.status &&
          game.status !== 'Final' &&
          !game.time &&
          timeZone.includes('Asia') ? (
            <Text>{`${game.status.slice(0, 5)}${
              game.status.includes('PM') ? 'AM GMT+8' : 'PM GMT+8'
            }`}</Text>
          ) : (
            <Text>{game.status}</Text>
          )}
          <Text>{game.time}</Text>
        </Center>
        <Stack space={2} justifyContent="center" mt="2" direction="row">
          <Text
            _dark={{ color: 'warning.300' }}
            color="warning.800"
            fontFamily="Oswald-Regular"
          >
            {dayToShow(localeDate(), timeZone)}
          </Text>
          <Text alignSelf="flex-end">{localeDate()}</Text>
        </Stack>
        <Text
          alignSelf="center"
          color="warning.800"
          fontFamily="Oswald-Regular"
          _dark={{ color: 'warning.300' }}
        >
          @{game.home_team && game.home_team.city}
        </Text>
      </Box>
      {!game.time && game.status !== 'Final' && (
        <Text color="muted.400" fontSize="10px" ml="2">
          {`${
            timeZone.includes('Asia')
              ? 'Time is in Philippine Standard Time'
              : 'Time is in Eastern Standard Time'
          }`}
        </Text>
      )}
      <Icon
        alignSelf="center"
        as={Entypo}
        name="dots-three-horizontal"
        color="muted.400"
      />
    </>
  );
};

export default GameDetails;
