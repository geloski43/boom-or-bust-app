import React, { useEffect, useState } from 'react';
import { getTeam } from '../api/ball-dont-lie-api';
import { getInfo } from '../api/web-search-api';
import ScreenContainer from '../components/screen-container';
import bballCourt from '../assets/images/bball-court.jpg';
import { teamsLogo } from '../constants/teams-logo';
import TeamProfile from '../components/team/team-profile';
import { TeamPlaceholder } from '../components/placeholders';

const Team = ({ route, navigation }) => {
  const [teamBasicInfo, setTeamBasicInfo] = useState({});
  const [teamDetailedInfo, setTeamDetailedInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialMount, setInitialMount] = useState(true);
  const { itemId, itemName } = route.params;

  const fetchTeam = () => {
    console.log('fetching team');
    if (!itemId) return;
    setIsLoading(true);
    let basic = {};
    getTeam(itemId)
      .then((team) => {
        const matchedLogo = teamsLogo.find((logo) => logo.id === team.data.id);
        basic = { ...team.data, logo: matchedLogo.logo };
        setTeamBasicInfo(basic);
        setIsLoading(false);
        setInitialMount(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setInitialMount(false);
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
        setInitialMount(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setInitialMount(false);
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
      setInitialMount(true);
      // run setParams to clear the route params so useEffect will run again if the same item is clicked
      navigation.setParams({ itemId: null, itemName: null });
    });
    return clearState;
  }, [navigation]);

  return (
    <ScreenContainer title={'Team'} navigation={navigation} image={bballCourt}>
      {!isLoading ? (
        <TeamProfile
          initialMount={initialMount}
          teamBasicInfo={teamBasicInfo}
          teamDetailedInfo={teamDetailedInfo}
        />
      ) : (
        <TeamPlaceholder />
      )}
    </ScreenContainer>
  );
};

export default Team;
