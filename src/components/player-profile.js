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
} from 'native-base';
import BackButton from '../components/back-button';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { getAverages, getStats } from '../api/ball-dont-lie-api';

const PlayerProfile = ({ player, playerDetailedInfo }) => {
  const [detailedInfoOpen, setDetailedInfoOpen] = useState(false);

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

  return (
    <>
      <BackButton route={'Players'} text={'Back to Players'} />
      <VStack
        borderWidth="1"
        flex={detailedInfoOpen && playerDetailedInfo ? 1 : 0}
        rounded="sm"
        p="1"
      >
        <Stack direction="row" justifyContent="flex-end" space={2}>
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
        </Stack>

        <IconButton
          alignSelf="center"
          borderRadius="full"
          onPress={() => setDetailedInfoOpen(!detailedInfoOpen)}
          _icon={{
            as: MaterialIcons,
            name: 'expand-more',
          }}
        />

        {detailedInfoOpen && (
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
        )}
      </VStack>
      <Icon
        alignSelf="center"
        as={Entypo}
        name="dots-three-horizontal"
        color="muted.400"
      />
    </>
  );
};

export default PlayerProfile;
