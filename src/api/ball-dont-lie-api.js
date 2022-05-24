import axios from 'axios';

export const getPlayers = async (page) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/players?page=${
      page ? page : 1
    }&per_page=50`
  );

export const getPlayer = async (id) =>
  await axios.get(`https://www.balldontlie.io/api/v1/players/${id}`);

export const searchPlayer = async (query) =>
  await axios.get(`https://www.balldontlie.io/api/v1/players?search=${query}`);

export const getAverages = async (season, playerId) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/season_averages?season=${season}&player_ids[]=${playerId}`
  );

export const getStats = async (season, playerId, isPostSeason) =>
  await axios.get(
    `https://www.balldontlie.io/api/v1/stats?&seasons[]=${season}&player_ids[]=${playerId}&postseason=${isPostSeason}&per_page=100`
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
