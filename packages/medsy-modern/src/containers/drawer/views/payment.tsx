import React, { useContext, useEffect, useState } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import { Scrollbar } from 'components/scrollbar';
import ArrowLeft from 'assets/icons/arrow-left';
import Input from 'components/input';
import Button from 'components/button';
import OrderSubmit from './order-submit';
import { useCart } from 'contexts/cart/cart.provider';
import { clear } from 'localforage';
import { useSession } from 'contexts/session/session';
import {
  BadgeDana,
  BadgeGopay,
  BadgeLinkAja,
  BadgeMobileBanking,
  BadgeOvo,
  BadgeSecurePayment,
  BadgeShopeePay,
} from '../../../assets/icons/pay-method-badge';
import { useMQTT } from 'contexts/mqtt/mqtt';
import { usePopupDialog } from 'contexts/popup/popup-dialog';
import CancelPayment from 'assets/icons/cancel-payment';

const initialState = {
  phone: '',
  password: '',
  name: '',
  repeatPassword: '',
};

var numeral = require('numeral');

export default function Payment() {
  const { dispatch, state } = useContext(DrawerContext);
  // const { logout, sessionState } = useSession();
  const { paymentData, checkPaymentDataValidity, cancelCheckout } = useCart();
  // const [success, setSuccess] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { lastMQTTMessage } = useMQTT();
  const {
    setaffirmativeText,
    setnegativeText,
    setaffirmativeAction,
    setnegativeAction,
    settext,
    setisShown,
  } = usePopupDialog();

  // catch mqtt objects being sent from server to change status and proceed to queue number slider
  useEffect(() => {
    var parseddata = null;
    try {
      parseddata = JSON.parse(lastMQTTMessage);
    } catch {
      console.log('mqtt payload unparseable, ignoring payload');
      return;
    }

    if (parseddata) {
      if (
        `TR${parseddata.idCart}` == paymentData?.referenceNo &&
        parseddata.statusCart == 'Order'
      ) {
        checkPaymentDataValidity(
          parseddata.idCart,
          // onsuccess
          (data) => {
            if (data?.statusCart == 'Order' && data?.codeCart) {
              showQueueNumber();
            }
          }
        );
      }
    }
  }, [lastMQTTMessage]);

  // buat cancel kalo slider ditutup, pake popup
  useEffect(() => {
    if (state.open == false) {
      callPopupBox();
    }
  }, [state.open]);

  const callPopupBox = () => {
    setaffirmativeAction(() => {
      showDrawer();
      setisShown(false);
    });
    setaffirmativeText('Lanjut Bayar');
    setnegativeAction(() => {
      cancelCheckout(() => {
        hidePayment();
        showCart();
        showDrawer();
        setisShown(false);
      }, null);
    });
    setnegativeText('Kembali Ke Keranjang');
    settext(
      <div style={{ textAlign: 'center' }}>
        <CancelPayment width="200px" />
        <p style={{ marginTop: '15px' }}>
          Anda yakin ingin membatalkan order ini? Item yang ada di order ini
          akan di kembalikan ke keranjang belanja anda
        </p>
      </div>
    );
    setisShown(true);
  };

  const hidePayment = () => {
    dispatch({
      type: 'TOGGLE_PAYMENT_VIEW',
      payload: {
        showPayment: false,
      },
    });
  };

  const showQueueNumber = () => {
    dispatch({
      type: 'TOGGLE_QUEUENUMBER_VIEW',
      payload: {
        showQueueNumber: true,
      },
    });
  };

  const hideDrawer = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    });
  };
  const showDrawer = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: true,
      },
    });
  };

  const showCart = () => {
    dispatch({
      type: 'TOGGLE_CART_VIEW',
      payload: {
        showCart: true,
      },
    });
  };

  const submitPayment = async () => {};

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex justify-center relative px-30px py-20px">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={callPopupBox}
          aria-label="close"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-bold text-24px m-0">Pembayaran</h2>
      </div>

      <Scrollbar className="flex-grow">
        <div className="flex flex-col px-30px pt-20px">
          <div className="flex flex-col mb-45px text-center">
            <h5>
              Transaksi
              <span className="text-bold"> {paymentData?.referenceNo}</span>
            </h5>
            <h3>
              Total Belanja&nbsp;:&nbsp;
              <span className="text-bold">
                Rp.
                {paymentData?.amt ? numeral(paymentData?.amt).format(0, 0) : 0}
              </span>
            </h3>

            <p className="mt-15px">
              Silahkan lakukan pembayaran menggunakan QRIS pada aplikasi&nbsp;
              <span className="text-bold">Gojek</span>,&nbsp;
              <span className="text-bold">OVO</span>,&nbsp;
              <span className="text-bold">Link Aja</span>, atau&nbsp;
              <span className="text-bold">Shopee</span> dengan cara melakukan
              scan barcode dibawah
            </p>

            <div className="payment__pay-method-badge">
              <BadgeDana />
              <BadgeGopay />
              <BadgeLinkAja />
              <BadgeOvo />
              <BadgeShopeePay />
              <BadgeMobileBanking />
            </div>

            <img src={paymentData?.qrUrl} className="payment__qr-code" />

            <BadgeSecurePayment
              style={{ width: '100px', margin: '10px auto 30px auto' }}
            />

            {/* <button className="typical-button" style={{padding: '10px'}}>Cek Status Pembayaran</button> */}
            <h5>
              Pembayaran anda akan otomatis kami konfirmasi setelah anda selesai
              melakukan pembayaran
            </h5>
          </div>
        </div>
      </Scrollbar>

      {/* popup */}
      {/* {isCancelPopupOpen ? (
        <div className="payment__popup-confirmation">
          <div className="payment__popup-confirmation__popup">
            <button className="payment__popup-confirmation__close-btn">
              X
            </button>
            Anda yakin ingin membatalkan order ini? Item yang ada di order ini
            akan di kembalikan ke keranjang belanja anda
            <div className="payment__popup-confirmation__popup__btns">
              <button
                onClick={() => {
                  showDrawer();
                  setisCancelPopupOpen(false);
                }}
              >
                Lanjut Bayar
              </button>
              <button onClick={hidePayment}>Kembali Ke Keranjang</button>
            </div>
          </div>
        </div>
      ) : null} */}
    </div>
  );
}
