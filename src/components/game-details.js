import React, { useContext } from 'react';
import { Text, Box, Image, Badge, Stack, Center, Icon } from 'native-base';
import { dayToShow, parseDate } from '../utils/day-to-show';
import { Entypo } from '@expo/vector-icons';
import { Context as LocalizationContext } from '../context/localization-context';
import BackButton from '../components/back-button';

const GameDetails = ({ navigation, game }) => {
  const localeContext = useContext(LocalizationContext);
  const timeZone = localeContext.state.timezoneName;

  return (
    <>
      <BackButton route={'Games'} text={'Back to Games'} />
      <Box rounded="sm" borderWidth="1" p="2">
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
              opacity={game.home_team_score > game.visitor_team_score ? 1 : 0.5}
            >
              {game.visitor_team && game.visitor_team.full_name}
            </Text>
            <Text
              fontFamily="Oswald-Bold"
              opacity={game.visitor_team_score < game.home_team_score ? 1 : 0.5}
            >
              {game.home_team_score}
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
              opacity={game.home_team_score < game.visitor_team_score ? 1 : 0.5}
            >
              {game.home_team && game.home_team.full_name}
            </Text>
            <Text
              fontFamily="Oswald-Bold"
              opacity={game.visitor_team_score > game.home_team_score ? 1 : 0.5}
            >
              {game.visitor_team_score}
            </Text>
          </Stack>
        </Stack>
        <Center mx="2">
          {game.status &&
          game.status !== 'Final' &&
          timeZone.includes('Asia') ? (
            <Text>{`${game.status.slice(0, 5)}${
              game.status.includes('PM') ? 'AM GMT+8' : 'PM GMT+8'
            }`}</Text>
          ) : (
            <Text>{game.status}</Text>
          )}
          <Text>{game.time}</Text>
        </Center>
        {timeZone.includes('Asia') ? (
          <Stack space={2} justifyContent="center" mt="2" direction="row">
            <Text
              _dark={{ color: 'warning.300' }}
              color="warning.800"
              fontFamily="Oswald-Regular"
            >
              {dayToShow(game.phDate && game.phDate)}
            </Text>

            <Text alignSelf="flex-end">
              {game.phDate && game.phDate.toLocaleDateString()}
            </Text>
          </Stack>
        ) : (
          <Stack space={2} justifyContent="center" mt="2" direction="row">
            <Text
              _dark={{ color: 'warning.300' }}
              color="warning.800"
              fontFamily="Oswald-Regular"
            >
              {dayToShow(game.date && game.date.slice(0, 10))}
            </Text>

            <Text alignSelf="flex-end">
              {game.date &&
                parseDate(game.date.slice(0, 10)).toLocaleDateString()}
            </Text>
          </Stack>
        )}
        <Text
          alignSelf="center"
          color="warning.800"
          fontFamily="Oswald-Regular"
          _dark={{ color: 'warning.300' }}
        >
          @{game.home_team && game.home_team.city}
        </Text>
      </Box>
      {game.status !== 'Final' && (
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
