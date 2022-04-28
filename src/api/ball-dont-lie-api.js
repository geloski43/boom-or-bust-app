import axios from 'axios';

export const getPlayers = async (page, perPage) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/players?page=${page}&per_page=${perPage}`
  );

export const searchPlayer = async (query) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/players?search=${query}&per_page=1`
  );

export const getAverages = async (season, playerIds) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/season_averages?${
      season ? `season=${season}&` : ''
    }player_ids[]=${playerIds}`
  );

export const getStats = async (
  season,
  playerIds,
  page,
  perPage,
  isPostSeason
) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/stats?seasons[]=${season}&player_ids[]=${playerIds}&page=${page}&per_page=${perPage}&postseason=${isPostSeason}`
  );

export const getTeams = async () =>
  await axios.get(`https://www.balldontlie.io/api/v1/teams`);

export const getTeam = async (id) =>
  await axios.get(`https://www.balldontlie.io/api/v1/teams/${id}`);

export const getGames = async (page, isPostSeason) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/games?page=${
      page ? page : 1
    }&per_page=100${isPostSeason ? `&postseason=${isPostSeason}` : ''}`
  );

export const getGame = async (id) =>
  await axios.get(`https://www.balldontlie.io/api/v1/games/${id}`);

export const searchGameByDate = async (date) =>
  await axios.get(`https://www.balldontlie.io/api/v1/games?dates[]=${date}`);
