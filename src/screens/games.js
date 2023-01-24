import React, { useEffect, useState, useRef } from 'react';
import { getGames, searchGameByDate } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballGame from '../assets/images/bball-game.jpg';
import GameList from '../components/games/game-list';
import { GamesPlaceholder } from '../components/placeholders';
import { teamLogo, parseDate } from '../utils/utils';
import GamelistFilter from '../components/games/game-list-filter';
import * as Localization from 'expo-localization';

const Games = ({ navigation }) => {
  const timeZone = Localization.timezone;

  const [games, setGames] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [dateToSearch, setDateToSearch] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState(null);
  const [isPostSeason, setIsPostSeason] = useState(null);
  const [hasPagination, setHasPagination] = useState(true);
  const [initialMount, setInitialMount] = useState(true);

  let progress = Math.round((page / pagesTotal) * 100);

  const gamelistRef = useRef();
  const moveToTop = () =>
    gamelistRef.current && gamelistRef.current.scrollToTop({ animated: true });

  // fetching game by date
  const fetchGameByDate = (selectedDate) => {
    let arr = [];
    setIsLoading(true);
    let totalPages = null;
    searchGameByDate(selectedDate)
      .then((res) => {
        arr = res.data.data.map((obj) => ({
          ...obj,
          home_team_logo: teamLogo(obj.home_team.id, obj.home_team.full_name),
          visitor_team_logo: teamLogo(
            obj.visitor_team.id,
            obj.visitor_team.full_name
          ),
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
    console.log('onDateChange event', timeZone);
    setShowCalendar(false);
    const timestamp = event.nativeEvent.timestamp;
    const dateSelect = selectedDate || dateToSearch;
    const localeDate = () => {
      return timeZone.includes('Asia') && dateSelect
        ? new Date(
            parseDate(
              dateSelect && dateSelect.toISOString().slice(0, 10)
            ).setDate(
              parseDate(
                dateSelect && dateSelect.toISOString().slice(0, 10)
              ).getDate() - 1
            )
          )
            .toISOString()
            .slice(0, 10)
        : dateSelect && dateSelect.toISOString().slice(0, 10);
    };

    if (!timestamp) {
      setShowCalendar(false);
      console.log('no date selected');
    }
    // else call the fetchGameByDate function
    else {
      console.log('date selected', typeof localeDate());
      setShowCalendar(false);
      setPage(1);
      setIsPostSeason(null);
      setDateToSearch(dateSelect);
      // set hasPagination to false so we can show alternate section header and prevent fetching more data
      setHasPagination(false);
      fetchGameByDate(localeDate());
    }
  };

  const showDatepicker = () => {
    setShowCalendar(true);
  };

  const fetchGames = (pageVar, postseason) => {
    console.log('fetching games');
    setHasPagination(true);
    setIsLoading(true);
    let totalPages = null;
    let arr = [];
    getGames(pageVar, postseason)
      .then((res) => {
        console.log('fetching games', res.data.data);
        totalPages = res.data.meta.total_pages;
        arr = res.data.data.map((obj) => ({
          ...obj,
          home_team_logo: teamLogo(obj.home_team.id, obj.home_team.full_name),
          visitor_team_logo: teamLogo(
            obj.visitor_team.id,
            obj.visitor_team.full_name
          ),
        }));
        setPagesTotal(totalPages);
        setGames(arr);
        setIsLoading(false);
        setInitialMount(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setInitialMount(false);
      });
  };

  const fetchMore = (pageVar, postseason) => {
    console.log('fetching more games current page is', page);
    setHasPagination(true);
    if (page === pagesTotal) {
      return;
    }
    setIsFetchingMore(true);
    let arr = [];
    let currentPage = page + 1;
    getGames(pageVar, postseason)
      .then((res) => {
        arr = res.data.data.map((obj) => ({
          ...obj,
          home_team_logo: teamLogo(obj.home_team.id, obj.home_team.full_name),
          visitor_team_logo: teamLogo(
            obj.visitor_team.id,
            obj.visitor_team.full_name
          ),
        }));
        setPage(currentPage);
        setGames([...games, ...arr]);
        setIsFetchingMore(false);
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
      {!isLoading && !initialMount ? (
        <>
          <GamelistFilter
            hasPagination={hasPagination}
            onDateChange={onDateChange}
            isPostSeason={isPostSeason}
            setIsPostSeason={setIsPostSeason}
            setPage={setPage}
            fetchGames={fetchGames}
            progress={progress}
            showCalendar={showCalendar}
            moveToTop={moveToTop}
            initialMount={initialMount}
            games={games}
            showDatepicker={showDatepicker}
            dateToSearch={dateToSearch}
          />
          <GameList
            gamelistRef={gamelistRef}
            initialMount={initialMount}
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
            setShowCalendar={setShowCalendar}
            navigation={navigation}
          />
        </>
      ) : (
        <GamesPlaceholder />
      )}
    </ScreenContainer>
  );
};

export default Games;
