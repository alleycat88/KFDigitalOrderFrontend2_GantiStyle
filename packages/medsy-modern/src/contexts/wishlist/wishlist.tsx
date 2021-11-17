import { useSession } from 'contexts/session/session';
import { createContext, useState, useContext } from 'react';

export const WishlistContext = createContext({} as any);

const INITIAL_STATE = [
  {
    idWishlist: 0,
    product: {
      idProduct: '',
      nameProduct: '',
      descProduct: '',
      imgProduct: '',
      priceProduct: 0,
    },
  },
];

function useWishlistAction() {
  const [wishlistState, setWishlistState] = useState(INITIAL_STATE);
  const { sessionState } = useSession();

  const getWishlist = () => {
    fetch('https://digitalorderbackend.sprintmanager.id/api/Wishlist', {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        idSession: sessionState.user.idSession,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //   console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);
          // setSuccess(true)

          setWishlistState(data.data);
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
          // setError(true);
          // setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        //   setError(true);
        //   setErrorMessage(error);
      });
  };

  const addWishlist = (idProduct) => {
    fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Wishlist/' + idProduct,
      {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idSession: sessionState.user.idSession,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          setWishlistState((prevState) => [...prevState, data.data]);
          return data.data;
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const removeWishlist = (idProduct) => {
    fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Wishlist/' + idProduct,
      {
        method: 'DELETE', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idSession: sessionState.user.idSession,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          setWishlistState(
            wishlistState.filter((a) => a.idWishlist != data.data.idWishlist)
          );
          return data.data;
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const checkItemInWishlist = (idProduct) => {
    var w = wishlistState.find((a) => a.product.idProduct == idProduct);
    if (w == null) return false;
    else return true;
  };

  return {
    wishlistState,
    getWishlist,
    addWishlist,
    removeWishlist,
    checkItemInWishlist,
  };
}

export const WishlistProvider = ({ children }) => {
  const {
    wishlistState,
    getWishlist,
    addWishlist,
    removeWishlist,
    checkItemInWishlist,
  } = useWishlistAction();

  return (
    <WishlistContext.Provider
      value={{
        wishlistState,
        getWishlist,
        addWishlist,
        removeWishlist,
        checkItemInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
