import React, { useContext } from 'react';
// import DrawerMenu from './views/menus';
import Wishlist from 'containers/wishlist';
import { DrawerBottomContext } from 'contexts/drawer/drawer-bottom.provider';

export const DrawerBottom = () => {
  const { state, dispatchBottom } = useContext(DrawerBottomContext);

  const handleClose = () =>
    dispatchBottom({
      type: 'SLIDE_DRAWER_BOTTOM',
      payload: {
        open: false,
      },
    });

  const drawerComponent = (state) => {
    if (state?.showWishlist === true) {
      return <Wishlist />;
    }

    return null;
  };

  return (
    <React.Fragment>
      {state?.open === true ? (
        <div className="overlay" role="button" style={{zIndex: 21}} onClick={handleClose} />
      ) : (
        ''
      )}
      <div
        className={`wishlist ${state?.open === true ? 'active' : ''}`}
      >
        {drawerComponent(state)}
      </div>
    </React.Fragment>
  );
};
