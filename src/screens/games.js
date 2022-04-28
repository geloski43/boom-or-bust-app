import React, { useEffect, useState } from 'react';
import { getGames, searchGameByDate } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballGame from '../assets/images/bball-game.jpg';
import { Skeleton, HStack, VStack, Box } from 'native-base';
import GameList from '../components/game-list';

const Games = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [dateToSearch, setDateToSearch] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState(null);
  const [isPostSeason, setIsPostSeason] = useState(null);
  const [hasPagination, setHasPagination] = useState(true);

  // fetching game by date
  const fetchGameByDate = (selectedDate) => {
    let arr = [];
    setIsLoading(true);
    let totalPages = null;
    searchGameByDate(selectedDate)
      .then((res) => {
        arr = res.data.data.map((obj) => ({
          ...obj,
          home_team_logo:
            obj.home_team.id === 13
              ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
              : `https://cdn.statmuse.com/img/nba/teams/nba_${obj.home_team.full_name
                  .replace(/ /g, '_')
                  .toLowerCase()}_secondary.png`,
          visitor_team_logo:
            obj.visitor_team.id === 13
              ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
              : `https://cdn.statmuse.com/img/nba/teams/nba_${obj.visitor_team.full_name
                  .replace(/ /g, '_')
                  .toLowerCase()}_secondary.png`,
        }));
        totalPages = res.data.meta.total_pages;
        setPagesTotal(totalPages);
        setGames(arr);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const onDateChange = (event, selectedDate) => {
    // console.log('onDateChange', selectedDate);
    const dateSelect = selectedDate || dateToSearch;
    // if no date is selected just close the calendar
    if (!selectedDate) {
      console.log('no date selected');
      setShowCalendar(false);
    }
    // else call the fetchGameByDate function
    else {
      setPage(1);
      setIsPostSeason(null);
      setDateToSearch(dateSelect);
      let date = dateSelect.toISOString().slice(0, 10);
      // set hasPagination to false so we can show alternate section header and prevent fetching more data
      setHasPagination(false);
      fetchGameByDate(date);
      setShowCalendar(false);
    }
  };

  const showDatepicker = () => {
    setShowCalendar(true);
  };

  const fetchGames = (pageVar, postseason) => {
    setHasPagination(true);
    setIsLoading(true);
    let totalPages = null;
    getGames(pageVar, postseason)
      .then((res) => {
        totalPages = res.data.meta.total_pages;
        let arr = [];
        getGames(pageVar, postseason)
          .then((res) => {
            arr = res.data.data.map((obj) => ({
              ...obj,
              home_team_logo:
                obj.home_team.id === 13
                  ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
                  : `https://cdn.statmuse.com/img/nba/teams/nba_${obj.home_team.full_name
                      .replace(/ /g, '_')
                      .toLowerCase()}_secondary.png`,
              visitor_team_logo:
                obj.visitor_team.id === 13
                  ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
                  : `https://cdn.statmuse.com/img/nba/teams/nba_${obj.visitor_team.full_name
                      .replace(/ /g, '_')
                      .toLowerCase()}_secondary.png`,
            }));
            setPagesTotal(totalPages);
            setGames(arr);
            console.log('fetching games', totalPages);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchMore = (pageVar, postseason) => {
    setHasPagination(true);
    if (page === pagesTotal) {
      return;
    }
    console.log('fetching more', page);
    setIsFetchingMore(true);
    let arr = [];
    let currentPage = page + 1;
    getGames(pageVar, postseason)
      .then((res) => {
        arr = res.data.data.map((obj) => ({
          ...obj,
          home_team_logo:
            obj.home_team.id === 13
              ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
              : `https://cdn.statmuse.com/img/nba/teams/nba_${obj.home_team.full_name
                  .replace(/ /g, '_')
                  .toLowerCase()}_secondary.png`,
          visitor_team_logo:
            obj.visitor_team.id === 13
              ? `https://cdn.statmuse.com/img/nba/teams/nba_los_angeles_clippers_secondary.png`
              : `https://cdn.statmuse.com/img/nba/teams/nba_${obj.visitor_team.full_name
                  .replace(/ /g, '_')
                  .toLowerCase()}_secondary.png`,
        }));
        setPage(currentPage);
        setGames([...games, ...arr]);
        setIsFetchingMore(false);
        console.log('fetching games', res.data.meta);
      })
      .catch((error) => {
        setIsFetchingMore(false);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <ScreenContainer title={'Games'} navigation={navigation} image={bballGame}>
      {!isLoading ? (
        <GameList
          hasPagination={hasPagination}
          setPage={setPage}
          isPostSeason={isPostSeason}
          setIsPostSeason={setIsPostSeason}
          showCalendar={showCalendar}
          dateToSearch={dateToSearch}
          showDatepicker={showDatepicker}
          onDateChange={onDateChange}
          page={page}
          pagesTotal={pagesTotal}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
          fetchMore={fetchMore}
          fetchGames={fetchGames}
          data={games}
        />
      ) : (
        Array.from(Array(7).keys()).map((v, i) => (
          <Box key={i} my="1" rounded="sm" borderWidth="1" p="2">
            <Skeleton h="20px" endColor="warmGray.50" />
            <HStack justifyContent="space-between">
              <VStack space={2} px="2">
                <HStack space={3}>
                  <Skeleton
                    borderWidth={1}
                    borderColor="coolGray.200"
                    endColor="warmGray.50"
                    size={25}
                    rounded="md"
                  />
                  <Skeleton.Text alignSelf="flex-end" lines={1} w="10" />
                  <Skeleton.Text alignSelf="flex-end" lines={1} w="5" />
                </HStack>
                <HStack space={3}>
                  <Skeleton
                    borderWidth={1}
                    borderColor="coolGray.200"
                    endColor="warmGray.50"
                    size={25}
                    rounded="md"
                  />
                  <Skeleton.Text alignSelf="flex-end" lines={1} w="10" />
                  <Skeleton.Text alignSelf="flex-end" lines={1} w="5" />
                </HStack>
              </VStack>
              <VStack justifyContent="flex-end">
                <Skeleton.Text lines={2} w="20" />
              </VStack>
            </HStack>
          </Box>
        ))
      )}
    </ScreenContainer>
  );
};

export default Games;
