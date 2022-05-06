import createDataContext from './create-data-context';
import * as Localization from 'expo-localization';

const localizationReducer = (state, action) => {
  switch (action.type) {
    case 'set_timezone_name':
      return { ...state, timezoneName: action.payload };

    default:
      return state;
  }
};

const setTimezoneName = (dispatch) => async (name) => {
  dispatch({
    timezoneName: name,
    type: 'set_timezone_name',
  });
};

export const { Provider, Context } = createDataContext(
  localizationReducer,
  { setTimezoneName },
  { timezoneName: Localization.timezone }
);
