import axios from 'axios';

export const getImage = async (query) =>
  await axios.request({
    method: 'GET',
    url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI',
    params: {
      q: query,
      pageNumber: '1',
      pageSize: '10',
      autoCorrect: 'false',
      safeSearch: 'false',
    },
    headers: {
      'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
      'X-RapidAPI-Key': 'b267774d42msh75f4c7308751f8cp13debfjsn781f605c78e6',
    },
  });

export const getInfo = async (query) =>
  await fetch(
    `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_html=1&skip_disambig=1`
  );
