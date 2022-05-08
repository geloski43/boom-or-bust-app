import React, { useState } from 'react';
import { Text, VStack, Image, Stack } from 'native-base';
import BackButton from '../components/back-button';
import { getAverages, getStats } from '../api/ball-dont-lie-api';
import PlayerProfileTabs from '../components/player-profile-tabs';

const PlayerProfile = ({ player, playerDetailedInfo }) => {
  const yearDrafted =
    playerDetailedInfo &&
    playerDetailedInfo.find((values) => values.label === 'NBA draft');

  const [averages, setAverages] = useState([]);
  const [stats, setStats] = useState([]);
  const [season, setSeason] = useState(
    yearDrafted ? yearDrafted.value.slice(0, 4) : new Date().getFullYear()
  );

  const fetchAverage = () => {
    getAverages(season, player.id)
      .then((res) => {
        setAverages(res.data.data);
        console.log('avgs', res.data.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <BackButton route={'Players'} text={'Back to Players'} />
      <VStack borderWidth="1" flex={1} rounded="sm" p="1">
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
        <PlayerProfileTabs
          setSeason={setSeason}
          averages={averages}
          setAverages={setAverages}
          season={season}
          fetchAverage={fetchAverage}
          playerDetailedInfo={playerDetailedInfo}
        />
      </VStack>
    </>
  );
};

export default PlayerProfile;
