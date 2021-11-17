import React, { useState, useContext, useEffect } from 'react';
import { Scrollbar } from 'components/scrollbar';
import { useCart } from 'contexts/cart/cart.provider';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import CartItem from 'components/cart-item';
import Button from 'components/button';
import NoItem from './no-item';
import ArrowLeft from 'assets/icons/arrow-left';
import { CURRENCY } from 'helpers/constants';
import { useSession } from 'contexts/session/session';

var numeral = require('numeral');

export default function Cart() {
  const { dispatch } = useContext(DrawerContext);
  const { sessionState } = useSession();
  
  const [ isAskingCheckoutConfirmation, setIsAskingCheckoutConfirmation ] = useState(false);
  const [ isCheckoutLoading, setisCheckoutLoading ] = useState(false);
  const [ checkoutErrorMessage, setcheckoutErrorMessage ] = useState(false);

  const { calculatePrice, cart, checkout, getPaymentData, setPaymentData } = useCart();

  const showCheckout = () => {
    dispatch({
      type: 'TOGGLE_CHECKOUT_VIEW',
      payload: {
        showCheckout: true,
      },
    });
  };

  const showLogin = () => {
    dispatch({
      type: 'TOGGLE_LOGIN_VIEW',
      payload: {
        showLogin: true,
      },
    });
  };

  const checkoutOrder = () => {
    setisCheckoutLoading(true);

    checkout(
      // if success
      (data) => {
        setisCheckoutLoading(false);

        setPaymentData(data.payment);
        
        setTimeout(() => {
          dispatch({
            type: 'TOGGLE_PAYMENT_VIEW',
            payload: {
              showPayment: true,
            },
          });
        }, 500);

      }, 
      // if failed
      (msg) => {
        setcheckoutErrorMessage(msg); 
        setisCheckoutLoading(false);
      }
    )
  };

  const hideCart = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    });
  };

  return (
    <div className="flex flex-col w-full h-full" style={{backgroundColor: '#F0EEEF'}}>
      {cart?.cart_Items.length ? (
        <>
          <div className="w-full flex justify-center relative px-30px py-20px border-b border-gray-200">
            <button
              className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
              onClick={hideCart}
              aria-label="close"
            >
              <ArrowLeft />
            </button>

            <h2 className="font-bold text-24px m-0">Keranjang Belanja</h2>
          </div>

          <Scrollbar className="cart-scrollbar flex-grow">
            {cart.cart_Items.map((item) => (
              <CartItem item={item} key={item.idCart_Item} />
            ))}
          </Scrollbar>
        </>
      ) : (
        <NoItem />
      )}

      <div className="flex flex-col p-30px">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">
            Subtotal &nbsp;
            <span className="font-normal text-gray-700 text-13px">
              (Termasuk Pajak)
            </span>
          </span>

          <span className="font-semibold text-18px text-gray-900">
            {CURRENCY}
            {numeral(calculatePrice()).format(0,0)}
          </span>
        </div>

        {
          isAskingCheckoutConfirmation ? 
            <div className='mt-20px'>
              <div style={{width: '50%', display: 'inline-block'}}>
                <Button disabled={isCheckoutLoading} style={{width: '100%', marginRight: '10px', backgroundColor: '#EC5454'}} onClick={() => setIsAskingCheckoutConfirmation(false)}>Batal</Button>
              </div>
              <div style={{width: '50%', display: 'inline-block'}}>
                <Button disabled={isCheckoutLoading} style={{width: '100%', marginLeft: '10px', backgroundColor: ''}} onClick={() => checkoutOrder()}>Checkout</Button>
              </div>
            </div>
            :
            <Button
              className="big w-full mt-20px"
              disabled={!cart?.cart_Items.length ? true : false}
              onClick={sessionState.isLoggedIn || (sessionState.isLoggedInAnonymously && sessionState.userAnonymous.nameUserAnonymous) ? () => setIsAskingCheckoutConfirmation(true) : showLogin}
            >
              Checkout
            </Button>
        }
      </div>
    </div>
  );
}
