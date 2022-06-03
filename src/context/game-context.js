import createDataContext from './create-data-context';

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'set_game_date_query':
      return { showDatePicker: false, gameDate: action.payload };
    case 'show_datepicker':
      return { gameDate: state.gameDate, showDatePicker: action.payload };
    case 'set_gamelist_scroll_position':
      return { ...state, gamelistScrollPosition: action.payload };
    default:
      return state;
  }
};

const setGameDateQuery = (dispatch) => async (date) => {
  dispatch({
    type: 'set_game_date_query',
    payload: date,
  });
};

const setGamelistScrollPosition = (dispatch) => async (index) => {
  dispatch({
    type: 'set_gamelist_scroll_position',
    payload: index,
  });
};

const handleDatepickerOpen = (dispatch) => async (show) => {
  dispatch({
    type: 'show_datepicker',
    payload: show,
  });
};

export const { Provider, Context } = createDataContext(
  gameReducer,
  { setGameDateQuery, handleDatepickerOpen, setGamelistScrollPosition },
  { gameDate: new Date(), showDatePicker: false, gamelistScrollPosition: 0 }
);
