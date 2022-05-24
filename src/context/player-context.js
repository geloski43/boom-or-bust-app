import createDataContext from './create-data-context';

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'search_player_query':
      return { ...state, query: action.payload };
    case 'set_player_search_error':
      return { ...state, playerSearchError: action.payload };
    case 'set_playerlist_scroll_position':
      return { ...state, playerlistScrollPosition: action.payload };
    default:
      return state;
  }
};

const setPlayerQuery = (dispatch) => async (text) => {
  dispatch({
    type: 'search_player_query',
    payload: text,
  });
};

const handleSearchPlayerError = (dispatch) => async (error) => {
  dispatch({
    type: 'set_player_search_error',
    payload: error,
  });
};

const setPlayerlistScrollPosition = (dispatch) => async (index) => {
  dispatch({
    type: 'set_playerlist_scroll_position',
    payload: index,
  });
};

export const { Provider, Context } = createDataContext(
  playerReducer,
  { setPlayerQuery, handleSearchPlayerError, setPlayerlistScrollPosition },
  { query: '', playerSearchError: false, playerlistScrollPosition: 0 }
);
