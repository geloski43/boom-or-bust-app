import createDataContext from './create-data-context';

const statsReducer = (state, action) => {
  switch (action.type) {
    case 'set_avg_type':
      return { ...state, avgTotals: action.payload };
    default:
      return state;
  }
};

const setAverageType = (dispatch) => async (value) => {
  dispatch({
    type: 'set_avg_type',
    payload: value,
  });
};

export const { Provider, Context } = createDataContext(
  statsReducer,
  { setAverageType },
  { avgTotals: 'Totals' }
);
