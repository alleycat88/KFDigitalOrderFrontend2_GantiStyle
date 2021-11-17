import React, { useReducer, createContext } from 'react';
export const DrawerBottomContext = createContext<{
  state?: any;
  dispatchBottom?: React.Dispatch<any>;
}>({});

const INITIAL_STATE = {
  showDetails: false,
  menu: false,
  open: false,
  item: [],
};

type ActionType =
  | { type: 'TOGGLE_WISHLIST_DETAIL'; payload: any }
  | { type: 'SLIDE_DRAWER_BOTTOM'; payload: any };

type StateType = typeof INITIAL_STATE;

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'TOGGLE_WISHLIST_DETAIL':
      return {
        ...state,
        showWishlist: action.payload.showWishlist,
      };
    case 'SLIDE_DRAWER_BOTTOM':
      return {
        ...state,
        open: action.payload.open,
      };
    default:
      return state;
  }
}

export const DrawerBottomProvider = ({ children }) => {
  const [state, dispatchBottom] = useReducer(reducer, INITIAL_STATE);
  return (
    <DrawerBottomContext.Provider value={{ state, dispatchBottom }}>
      {children}
    </DrawerBottomContext.Provider>
  );
};
