import React, { useEffect, useState } from 'react';
import { getTeam } from '../api/ball-dont-lie-api';
import { getInfo } from '../api/web-search-api';
import ScreenContainer from '../components/screen-container';
import bballCourt from '../assets/images/bball-court.jpg';
import { teamsLogo } from '../constants/teams-logo';
import { Skeleton, VStack, Box } from 'native-base';
import TeamProfile from '../components/team-profile';

const Team = ({ route, navigation }) => {
  const [teamBasicInfo, setTeamBasicInfo] = useState({});
  const [teamDetailedInfo, setTeamDetailedInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { itemId, itemName } = route.params;

  const fetchTeam = () => {
    setIsLoading(true);
    let basic = {};
    getTeam(itemId)
      .then((team) => {
        const matchedLogo = teamsLogo.find((logo) => logo.id === team.data.id);
        basic = { ...team.data, logo: matchedLogo.logo };
        setTeamBasicInfo(basic);
        console.log('fetching team', basic);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const fetchInfo = () => {
    setIsLoading(true);
    getInfo(itemName)
      .then((response) => response.json())
      .then((data) => {
        setTeamDetailedInfo(data.Infobox.content);
        console.log('team info', data.Infobox.content);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTeam();
    fetchInfo();
  }, [itemId, itemName]);

  return (
    <ScreenContainer title={'Team'} navigation={navigation} image={bballCourt}>
      {!isLoading ? (
        <TeamProfile
          teamBasicInfo={teamBasicInfo}
          teamDetailedInfo={teamDetailedInfo}
        />
      ) : (
        <Box flex={1} my="5" alignItems="center">
          <VStack
            w="90%"
            maxW="400"
            borderWidth="1"
            space={8}
            overflow="hidden"
            rounded="md"
            _dark={{
              borderColor: 'coolGray.500',
            }}
            _light={{
              borderColor: 'coolGray.200',
            }}
          >
            <VStack alignItems="flex-end">
              <Skeleton
                m="4"
                borderWidth={1}
                borderColor="coolGray.200"
                endColor="warmGray.50"
                size="20"
                rounded="md"
              />
              <Skeleton.Text mx="4" mb="4" lines={1} w="24" />
            </VStack>

            <Skeleton h="xs" />
          </VStack>
        </Box>
      )}
    </ScreenContainer>
  );
};

export default Team;
