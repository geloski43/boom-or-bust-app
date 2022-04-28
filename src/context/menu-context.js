import createDataContext from './create-data-context';

const menuReducer = (state, action) => {
  switch (action.type) {
    case 'toggle_menu_visible':
      return { ...state, menuVisible: !state.menuVisible };
    case 'set_menu_hidden':
      return { ...state, menuVisible: false };
    case 'set_scroll_position':
      return { ...state, scrollPosition: action.payload };
    default:
      return state;
  }
};

const setScrollPosition = (dispatch) => async (index) => {
  dispatch({
    type: 'set_scroll_position',
    payload: index,
  });
};

const toggleMenuVisible = (dispatch) => async () => {
  dispatch({ type: 'toggle_menu_visible' });
};

const setMenuHidden = (dispatch) => async () => {
  dispatch({ type: 'set_menu_hidden' });
};

export const { Provider, Context } = createDataContext(
  menuReducer,
  { toggleMenuVisible, setMenuHidden, setScrollPosition },
  { menuVisible: false, scrollPosition: 0 }
);
