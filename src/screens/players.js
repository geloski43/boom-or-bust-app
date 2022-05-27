import React, { useEffect, useState, useRef, useContext } from 'react';
import { getPlayers, searchPlayer } from '../api/ball-dont-lie-api';
import ScreenContainer from '../components/screen-container';
import bballGame from '../assets/images/bball-game.jpg';
import PlayerList from '../components/players/player-list';
import { PlayersPlaceholder } from '../components/placeholders';
import { genericPlayerImage, findPlayerImage } from '../utils/utils';
import { Context as PlayerContext } from '../context/player-context';
import PlayerSearchbar from '../components/players/player-searchbar';

const Players = ({ navigation }) => {
  const playerContext = useContext(PlayerContext);
  const { playerlistScrollPosition } = playerContext.state;

  const [players, setPlayers] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagesTotal, setPagesTotal] = useState(null);
  const [hasPagination, setHasPagination] = useState(true);
  const [initialMount, setInitialMount] = useState(true);

  const playerlistRef = useRef();

  const moveToTop = () =>
    playerlistRef.current &&
    playerlistRef.current.scrollToTop({ animmated: true });

  const moveToIndex = () =>
    playerlistRef.current &&
    playerlistRef.current.scrollToIndex({
      animated: true,
      index: playerlistScrollPosition,
    });

  let progress = Math.round((page / pagesTotal) * 100);

  // searching player by name
  const searchPlayerByName = (text) => {
    console.log('search by name');
    if (!text) {
      playerContext.handleSearchPlayerError(true);
    } else {
      let arr = [];
      setIsLoading(true);
      let totalPages = null;
      searchPlayer(text)
        .then((res) => {
          arr = res.data.data.map((obj) => ({
            ...obj,
            playerImage:
              findPlayerImage(obj.id) || genericPlayerImage(obj.team.full_name),
          }));
          totalPages = res.data.meta.total_pages;
          setPagesTotal(totalPages);
          setPlayers(arr);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  };

  const fetchPlayers = (pageVar) => {
    console.log('fetching players');
    setHasPagination(true);
    setIsLoading(true);
    let totalPages = null;
    getPlayers(pageVar)
      .then((res) => {
        totalPages = res.data.meta.total_pages;
        let arr = [];
        getPlayers(pageVar)
          .then((res) => {
            arr = res.data.data.map((obj) => ({
              ...obj,
              playerImage:
                findPlayerImage(obj.id) ||
                genericPlayerImage(obj.team.full_name),
            }));

            setPagesTotal(totalPages);
            setPlayers(arr);
            setIsLoading(false);
            setInitialMount(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
            setInitialMount(false);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchMore = (pageVar) => {
    console.log('fetching more players page is', page);
    setHasPagination(true);
    if (page === pagesTotal) {
      return;
    }
    setIsFetchingMore(true);
    let arr = [];
    let currentPage = page + 1;
    getPlayers(pageVar)
      .then((res) => {
        // console.log('fetching more players', res.data.data);
        arr = res.data.data.map((obj) => ({
          ...obj,
          playerImage:
            findPlayerImage(obj.id) || genericPlayerImage(obj.team.full_name),
        }));
        setPage(currentPage);
        setPlayers([...players, ...arr]);
        setIsFetchingMore(false);
      })
      .catch((error) => {
        setIsFetchingMore(false);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <ScreenContainer
      title={'Players'}
      navigation={navigation}
      image={bballGame}
    >
      {!isLoading && !initialMount ? (
        <>
          <PlayerSearchbar
            progress={progress}
            searchPlayerByName={searchPlayerByName}
            setPage={setPage}
            moveToIndex={moveToIndex}
            moveToTop={moveToTop}
            initialMount={initialMount}
            players={players}
          />
          <PlayerList
            data={players}
            fetchPlayers={fetchPlayers}
            isFetchingMore={isFetchingMore}
            fetchMore={fetchMore}
            isLoading={isLoading}
            page={page}
            pagesTotal={pagesTotal}
            setPage={setPage}
            hasPagination={hasPagination}
            initialMount={initialMount}
            playerlistRef={playerlistRef}
          />
        </>
      ) : (
        <PlayersPlaceholder />
      )}
    </ScreenContainer>
  );
};

export default Players;
