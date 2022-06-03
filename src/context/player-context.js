import createDataContext from './create-data-context';

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'search_player_query':
      return { ...state, query: action.payload };
    case 'search_player_one_query':
      return { ...state, playerOneQuery: action.payload };
    case 'search_player_two_query':
      return { ...state, playerTwoQuery: action.payload };
    case 'set_player_search_error':
      return { ...state, playerSearchError: action.payload };
    case 'set_playerlist_scroll_position':
      return { ...state, playerlistScrollPosition: action.payload };
    case 'set_playerOne_id':
      return { ...state, playerOneId: action.payload };
    case 'set_playerTwo_id':
      return { ...state, playerTwoId: action.payload };
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

const setPlayerOneQuery = (dispatch) => async (text) => {
  dispatch({
    type: 'search_player_one_query',
    payload: text,
  });
};

const setPlayerTwoQuery = (dispatch) => async (text) => {
  dispatch({
    type: 'search_player_two_query',
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

const setPlayerOneId = (dispatch) => async (id) => {
  dispatch({
    type: 'set_playerOne_id',
    payload: id,
  });
};

const setPlayerTwoId = (dispatch) => async (id) => {
  dispatch({
    type: 'set_playerTwo_id',
    payload: id,
  });
};

export const { Provider, Context } = createDataContext(
  playerReducer,
  {
    setPlayerQuery,
    setPlayerOneQuery,
    setPlayerTwoQuery,
    handleSearchPlayerError,
    setPlayerlistScrollPosition,
    setPlayerOneId,
    setPlayerTwoId,
  },
  {
    query: '',
    playerOneQuery: '',
    playerTwoQuery: '',
    playerSearchError: false,
    playerlistScrollPosition: 0,
    playerOneId: null,
    playerTwoId: null,
  }
);
