import React, { useEffect, useState, useMemo } from 'react';
import { getTeams } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballCourt from '../assets/images/bball-court.jpg';
import { teamsLogo } from '../constants/teams-logo';
import { TeamsPlaceholder } from '../components/placeholders';
import TeamList from '../components/teams/team-list';

const Teams = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [toFilter, setToFilter] = useState({
    conference: 'All',
    division: 'All',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialMount, setInitialMount] = useState(true);

  const fetchTeams = () => {
    console.log('fetching teams');
    setIsLoading(true);
    let arr = [];
    getTeams()
      .then((teams) => {
        arr = teams.data.data.map((obj, index) => ({
          ...obj,
          logo: teamsLogo[index].logo,
        }));
        setTeams(arr);
        setIsLoading(false);
        setInitialMount(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setInitialMount(false);
      });
  };

  const filteredTeams = useMemo(() => {
    if (toFilter.conference !== 'All') {
      return teams.filter((team) => {
        return team.conference === toFilter.conference;
      });
    } else if (toFilter.division !== 'All') {
      return teams.filter((team) => {
        return team.division === toFilter.division;
      });
    } else {
      return [...teams];
    }
  }, [toFilter, teams]);

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <ScreenContainer title={'Teams'} navigation={navigation} image={bballCourt}>
      {!isLoading ? (
        <TeamList
          initialMount={initialMount}
          toFilter={toFilter}
          setToFilter={setToFilter}
          data={filteredTeams}
        />
      ) : (
        <TeamsPlaceholder />
      )}
    </ScreenContainer>
  );
};

export default Teams;
