import React, { useEffect, useState, useMemo } from 'react';
import { getTeams } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballCourt from '../assets/images/bball-court.jpg';
import TeamList from '../components/team-list';
import { teamsLogo } from '../constants/teams-logo';
import { Skeleton, HStack, VStack } from 'native-base';

const Teams = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [toFilter, setToFilter] = useState({
    conference: 'All',
    division: 'All',
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeams = () => {
    setIsLoading(true);
    let arr = [];
    getTeams()
      .then((teams) => {
        arr = teams.data.data.map((obj, index) => ({
          ...obj,
          logo: teamsLogo[index].logo,
        }));
        setTeams(arr);
        console.log('fetching teams');
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
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
          toFilter={toFilter}
          setToFilter={setToFilter}
          data={filteredTeams}
        />
      ) : (
        <>
          <HStack justifyContent="flex-end">
            <Skeleton
              w="150px"
              px="1"
              my="2"
              rounded="md"
              startColor="warmGray.500"
            />
            <Skeleton
              w="150px"
              px="1"
              my="2"
              rounded="md"
              startColor="warmGray.500"
            />
          </HStack>
          {Array.from(Array(teams.length).keys()).map((v, i) => (
            <HStack
              py="2"
              key={i}
              px="4"
              borderWidth="1"
              space={6}
              rounded="md"
              alignItems="center"
              _dark={{
                borderColor: 'coolGray.500',
              }}
              _light={{
                borderColor: 'coolGray.200',
              }}
            >
              <Skeleton
                borderWidth={1}
                borderColor="coolGray.200"
                startColor="warmGray.500"
                size="50px"
                rounded="full"
              />
              <VStack flex="1" space="2">
                <Skeleton
                  w="100px"
                  h="3"
                  rounded="full"
                  startColor="warmGray.500"
                />
                <Skeleton
                  h="3"
                  w="50px"
                  rounded="full"
                  startColor="warmGray.500"
                />
              </VStack>
              <VStack alignItems="flex-end" flex="1" space="2">
                <Skeleton
                  w="100px"
                  h="3"
                  rounded="full"
                  startColor="warmGray.500"
                />
                <Skeleton
                  h="3"
                  w="50px"
                  rounded="full"
                  startColor="warmGray.500"
                />
              </VStack>
            </HStack>
          ))}
        </>
      )}
    </ScreenContainer>
  );
};

export default Teams;
