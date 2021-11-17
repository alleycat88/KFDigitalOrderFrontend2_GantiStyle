import React, {
  useReducer,
  useContext,
  createContext,
  useState,
  useEffect,
} from 'react';
import { reducer, cartItemsTotalPrice } from './cart.reducer';
import { useStorage } from 'helpers/use-storage';
import { useSession } from 'contexts/session/session';
import { getCookie, setCookie } from 'helpers/cookie';

var CryptoJS = require('crypto-js');

const enckey =
  "njasdijna8a7ywidy3872ye7hasjhd839y98h4w3ughihfuhaef98yal,m/.v,z'ksgoikopjijseo8937y9872hjdsf";

const CartContext = createContext({} as any);
const INITIAL_STATE = {
  isOpen: false,
  items: [],
  coupon: null,
};

const INITIAL_STATE_CARTNEW = {
  idCart: 0,
  totalPriceCart: 0,
  cart_Items: [
    // {
    //   idCart_Items: 0,
    //   product: {
    //     idProduct: 0,
    //     nameProduct: '',
    //     priceProduct: 0
    //   }
    // }
  ],
};

const useCartActions = (initialCart = INITIAL_STATE) => {
  const [state, dispatch] = useReducer(reducer, initialCart);
  const [cart, setCart] = useState(INITIAL_STATE_CARTNEW);
  const [paymentData, setpaymentData] = useState(null);
  const {
    sessionState,
    loginAnonymous,
    addNameToAnonymousSession,
  } = useSession();

  // clear cart on logout
  useEffect(() => {
    if (!sessionState.isLoggedIn && !sessionState.isLoggedInAnonymously) {
      clearCartHandler();
    }
  }, [sessionState.isLoggedIn, sessionState.isLoggedInAnonymously]);

  const getCart = async () => {
    fetch('https://digitalorderbackend.sprintmanager.id/api/Cart', {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        idSession: sessionState.isLoggedIn ? sessionState.user.idSession : '',
        idUserAnonymous:
          !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
            ? await loginAnonymous()
            : sessionState.userAnonymous?.idUserAnonymous
            ? sessionState.userAnonymous.idUserAnonymous
            : '',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          setCart(data.data);
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

  const editQuantityItemHandler = async (
    item,
    quantity = 1,
    onSuccess = null
  ) => {
    fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Cart/EditQuantity/' +
        item.idProduct +
        '/' +
        (quantity < 1 ? -1 : quantity),
      {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idSession: sessionState.isLoggedIn ? sessionState.user.idSession : '',
          idUserAnonymous:
            !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
              ? await loginAnonymous()
              : sessionState.userAnonymous?.idUserAnonymous
              ? sessionState.userAnonymous.idUserAnonymous
              : '',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          // var ncart = cart;
          // var availableitem = ncart.cart_Items.indexOf(a => a.product.idProduct == item.idProduct);
          // if(availableitem > -1) ncart.cart_Items[availableitem].quantityCart_Item = data.data.cart_Items.find(a => a.product.idProduct == item.idProduct).quantityCart_Item;
          // else ncart.cart_Items.push(data.data.cart_Items.find(a => a.product.idProduct == item.idProduct))
          // setCart(ncart);
          setCart(data.data);
          if (onSuccess) onSuccess();
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity, idSession } });
  };

  const addItemHandler = async (item, onSuccess = null, onError = null) => {
    fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Cart/AddToCart/' +
        item.idProduct,
      {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idSession: sessionState.isLoggedIn ? sessionState.user.idSession : '',
          idUserAnonymous:
            !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
              ? await loginAnonymous()
              : sessionState.userAnonymous?.idUserAnonymous
              ? sessionState.userAnonymous.idUserAnonymous
              : '',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          // var ncart = cart;
          // var availableitem = ncart.cart_Items.indexOf(a => a.product.idProduct == item.idProduct);
          // if(availableitem > -1) ncart.cart_Items[availableitem].quantityCart_Item = data.data.cart_Items.find(a => a.product.idProduct == item.idProduct).quantityCart_Item;
          // else ncart.cart_Items.push(data.data.cart_Items.find(a => a.product.idProduct == item.idProduct))
          // setCart(ncart);
          setCart(data.data);
          if (onSuccess) onSuccess(data.data);
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
          if (onError) onError(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (onError) onError(error);
      });
  };

  const removeItemHandler = async (item) => {
    fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Cart/DeductToCart/' +
        item.idProduct,
      {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idSession: sessionState.isLoggedIn ? sessionState.user.idSession : '',
          idUserAnonymous:
            !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
              ? await loginAnonymous()
              : sessionState.userAnonymous?.idUserAnonymous
              ? sessionState.userAnonymous.idUserAnonymous
              : '',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          // var ncart = cart;
          // var availableitem = ncart.cart_Items.indexOf(a => a.product.idProduct == item.idProduct);
          // if(availableitem > -1) ncart.cart_Items[availableitem].quantityCart_Item = data.data.cart_Items.find(a => a.product.idProduct == item.idProduct).quantityCart_Item;
          // else ncart.cart_Items.push(data.data.cart_Items.find(a => a.product.idProduct == item.idProduct))
          // setCart(ncart);
          setCart(data.data);
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // dispatch({ type: 'REMOVE_ITEM', payload: { ...item, quantity } });
  };

  const addNameToAnonymousCartHandler = async (name) => {
    var f = fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Cart/AddAnonymousNameToCart/' +
        name,
      {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idUserAnonymous:
            !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
              ? await loginAnonymous()
              : sessionState.userAnonymous?.idUserAnonymous
              ? sessionState.userAnonymous.idUserAnonymous
              : '',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          addNameToAnonymousSession(
            data.data.idUserAnonymous,
            data.data.nameUserAnonymous
          );

          return { success: true, data: data.data.nameUserAnonymous };
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);

          return { success: false, data: name, message: data.message };
        }
      })
      .catch((error) => {
        console.error('Error:', error);

        return { success: false, data: name, message: error.toString() };
      });

    return await f;
  };

  const checkout = async (onSuccess = null, onFailed = null) => {
    fetch('https://digitalorderbackend.sprintmanager.id/api/Cart/Checkout', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        idSession: sessionState.isLoggedIn ? sessionState.user.idSession : '',
        idUserAnonymous:
          !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
            ? await loginAnonymous()
            : sessionState.userAnonymous?.idUserAnonymous
            ? sessionState.userAnonymous.idUserAnonymous
            : '',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          setCart(data.data.cart);
          if (onSuccess) onSuccess(data.data);
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
          if (onFailed) onFailed(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (onFailed) onFailed(error);
      });
  };

  const cancelCheckout = async (onSuccess = null, onFailed = null) => {
    if (!cart) return;
    fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Cart/CancelCheckout/' +
        cart?.idCart,
      {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idSession: sessionState.isLoggedIn ? sessionState.user.idSession : '',
          idUserAnonymous:
            !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
              ? await loginAnonymous()
              : sessionState.userAnonymous?.idUserAnonymous
              ? sessionState.userAnonymous.idUserAnonymous
              : '',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          setCart(data.data);
          if (onSuccess) onSuccess(data.data);
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
          if (onFailed) onFailed(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (onFailed) onFailed(error);
      });
  };

  const setPaymentData = async (pydt) => {
    setpaymentData(pydt);

    setCookie(
      'paymentData',
      CryptoJS.AES.encrypt(JSON.stringify(pydt), enckey).toString(),
      1
    );

    return pydt;
  };
  const getPaymentData = async () => {
    var pydt = JSON.parse(
      CryptoJS.AES.decrypt(getCookie('paymentData'), enckey).toString(
        CryptoJS.enc.Utf8
      )
    );

    setpaymentData(pydt);

    return pydt;
  };

  const checkPaymentDataValidity = async (
    idCart,
    isSuccess = null,
    isError = null
  ) => {
    fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Cart/CheckPaymentDataValidity/' +
        idCart,
      {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
          idSession: sessionState.isLoggedIn ? sessionState.user.idSession : '',
          idUserAnonymous:
            !sessionState.isLoggedInAnonymously && !sessionState.isLoggedIn
              ? await loginAnonymous()
              : sessionState.userAnonymous?.idUserAnonymous
              ? sessionState.userAnonymous.idUserAnonymous
              : '',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);

          setCart(data.data);
          if (isSuccess) isSuccess(data.data);
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);

          if (isError) isError(data.data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        if (isError) isError(error);
      });
  };

  const clearItemFromCartHandler = (item) => {
    dispatch({ type: 'CLEAR_ITEM_FROM_CART', payload: item });
  };

  const clearCartHandler = () => {
    setCart(INITIAL_STATE_CARTNEW);
    // dispatch({ type: 'CLEAR_CART' });
  };
  const toggleCartHandler = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  const couponHandler = (coupon) => {
    dispatch({ type: 'APPLY_COUPON', payload: coupon });
  };
  const removeCouponHandler = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };
  const rehydrateLocalState = (payload) => {
    dispatch({ type: 'REHYDRATE', payload });
  };
  const isInCartHandler = (id) => {
    return state.items?.some((item) => item.idProduct === id);
  };
  const getItemHandler = (id) => {
    return state.items?.find((item) => item.idProduct === id);
  };
  const getCartItemsPrice = () =>
    cartItemsTotalPrice(cart.cart_Items).toFixed(2);
  const getCartItemsTotalPrice = () =>
    cartItemsTotalPrice(cart.cart_Items, state.coupon).toFixed(2);

  const getDiscount = () => {
    const total = cartItemsTotalPrice(state.items);
    const discount = state.coupon
      ? (total * Number(state.coupon?.discountInPercent)) / 100
      : 0;
    return discount.toFixed(2);
  };
  const getItemsCount = cart.cart_Items?.reduce(
    (acc, item) => acc + item.quantityCart_Item,
    0
  );
  return {
    state,
    getItemsCount,
    rehydrateLocalState,
    editQuantityItemHandler,
    addItemHandler,
    removeItemHandler,
    clearItemFromCartHandler,
    checkout,
    cancelCheckout: cancelCheckout,
    paymentData,
    setPaymentData,
    getPaymentData,
    checkPaymentDataValidity,
    clearCartHandler,
    isInCartHandler,
    getItemHandler,
    toggleCartHandler,
    getCartItemsTotalPrice,
    getCartItemsPrice,
    couponHandler,
    removeCouponHandler,
    getDiscount,
    cart,
    getCart,
    addNameToAnonymousCartHandler,
  };
};

export const CartProvider = ({ children }) => {
  const {
    state,
    rehydrateLocalState,
    getItemsCount,
    editQuantityItemHandler,
    addItemHandler,
    removeItemHandler,
    clearItemFromCartHandler,
    checkout,
    cancelCheckout: cancelCheckout,
    paymentData,
    setPaymentData,
    getPaymentData,
    checkPaymentDataValidity,
    clearCartHandler,
    isInCartHandler,
    getItemHandler,
    toggleCartHandler,
    getCartItemsTotalPrice,
    couponHandler,
    removeCouponHandler,
    getCartItemsPrice,
    getDiscount,
    cart,
    getCart,
    addNameToAnonymousCartHandler,
  } = useCartActions();
  const { rehydrated, error } = useStorage(state, rehydrateLocalState);

  return (
    <CartContext.Provider
      value={{
        isOpen: state.isOpen,
        items: state.items,
        coupon: state.coupon,
        cartItemsCount: state.items?.length,
        itemsCount: getItemsCount,
        editQuantityItem: editQuantityItemHandler,
        addItem: addItemHandler,
        removeItem: removeItemHandler,
        checkout: checkout,
        cancelCheckout: cancelCheckout,
        paymentData: paymentData,
        setPaymentData: setPaymentData,
        getPaymentData: getPaymentData,
        checkPaymentDataValidity: checkPaymentDataValidity,
        removeItemFromCart: clearItemFromCartHandler,
        clearCart: clearCartHandler,
        isInCart: isInCartHandler,
        getItem: getItemHandler,
        toggleCart: toggleCartHandler,
        calculatePrice: getCartItemsTotalPrice,
        calculateSubTotalPrice: getCartItemsPrice,
        applyCoupon: couponHandler,
        removeCoupon: removeCouponHandler,
        calculateDiscount: getDiscount,
        cart,
        getCart,
        addNameToAnonymousCart: addNameToAnonymousCartHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
