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
    if (!itemId) return;
    console.log('fetching team');
    setIsLoading(true);
    let basic = {};
    getTeam(itemId)
      .then((team) => {
        const matchedLogo = teamsLogo.find((logo) => logo.id === team.data.id);
        basic = { ...team.data, logo: matchedLogo.logo };
        setTeamBasicInfo(basic);
        // console.log('fetching team', basic);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const fetchInfo = () => {
    if (!itemName) return;
    console.log('fetching team info');
    setIsLoading(true);
    getInfo(itemName)
      .then((response) => response.json())
      .then((data) => {
        setTeamDetailedInfo(data.Infobox.content);
        // console.log('team info', data.Infobox.content);
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

  // we add a listener (blur) as the user leaves the screen
  // we will clear the state and route params so when the user navigates back
  // it wont show the previous data if different item is clicked
  useEffect(() => {
    const clearState = navigation.addListener('blur', () => {
      setTeamBasicInfo({});
      setTeamDetailedInfo([]);
      // run setParams to clear the route params so useEffect will run again if the same item is clicked
      navigation.setParams({ itemId: null, itemName: null });
    });
    return clearState;
  }, [navigation]);

  return (
    <ScreenContainer title={'Team'} navigation={navigation} image={bballCourt}>
      {!isLoading ? (
        <TeamProfile
          teamBasicInfo={teamBasicInfo}
          teamDetailedInfo={teamDetailedInfo}
          navigation={navigation}
        />
      ) : (
        <Box mt="10" alignItems="center">
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

            <Skeleton h="394px" />
          </VStack>
        </Box>
      )}
    </ScreenContainer>
  );
};

export default Team;
