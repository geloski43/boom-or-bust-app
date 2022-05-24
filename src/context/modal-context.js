import createDataContext from './create-data-context';

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'open_season_option_modal':
      return { ...state, showSeasonOptionModal: true };
    case 'close_season_option_modal':
      return { ...state, showSeasonOptionModal: false };
    default:
      return state;
  }
};

const openSeasonOptionModal = (dispatch) => async () => {
  dispatch({
    type: 'open_season_option_modal',
  });
};

const closeSeasonOptionModal = (dispatch) => async () => {
  dispatch({ type: 'close_season_option_modal' });
};

export const { Provider, Context } = createDataContext(
  modalReducer,
  { openSeasonOptionModal, closeSeasonOptionModal },
  { showSeasonOptionModal: false }
);
