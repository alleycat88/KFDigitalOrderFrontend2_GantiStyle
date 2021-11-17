import { useContext, useEffect, useState } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import { Scrollbar } from 'components/scrollbar';
import ArrowLeft from 'assets/icons/arrow-left';
import Input from 'components/input';
import Button from 'components/button';
import OrderSubmit from './order-submit';
import { useCart } from 'contexts/cart/cart.provider';
import { clear } from 'localforage';
import { useSession } from 'contexts/session/session';

const initialState = {
  phone: '',
  password: '',
  name: '',
  repeatPassword: '',
};

export default function QueueNumber() {
  const { dispatch, state } = useContext(DrawerContext);
  const { logout, sessionState } = useSession();
  const { clearCart, cart } = useCart();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hideQueueNumber = () => {
    dispatch({
      type: 'TOGGLE_QUEUENUMBER_VIEW',
      payload: {
        showQueueNumber: false,
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

  const showCart = () => {
    dispatch({
      type: 'TOGGLE_CART_VIEW',
      payload: {
        showCart: true,
      },
    });
  };

  const clearSession = () => {
    hideDrawer();
    clearCart();
    logout();
  };
  useEffect(() => {
    if (!state.open) clearSession();
  }, [state.open]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex justify-center relative px-30px py-20px">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={clearSession}
          aria-label="close"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-bold text-24px m-0">Nomor Antrian</h2>
      </div>

      <Scrollbar className="checkout-scrollbar flex-grow">
        <div className="flex flex-col px-30px pt-20px">
          <div className="flex flex-col mb-45px text-center">
            <p>
              Terimakasih sudah memesan melalui Digital Order Kiosk by Kimia
              Farma.
            </p>
            <p className="mt-20px">
              Nomor antrian anda sudah di print,{' '}
              <span className="text-bold text-red">
                mohon bawa nomor antrian
              </span>{' '}
              ke meja pembayaran saat nomor antrian anda di panggil oleh petugas
              apoteker
            </p>
            <h1
              className="text-bold mt-20px mb-20px"
              style={{ letterSpacing: '5px' }}
            >
              {cart?.codeCart ? cart.codeCart : '....'}
            </h1>
            <h3 className="text-center">
              {sessionState?.isLoggedIn
                ? sessionState.user?.name
                : sessionState.userAnonymous?.nameUserAnonymous}
            </h3>
            <Button
              className="big w-full mt-15px"
              loading={loading}
              onClick={clearSession}
            >
              Selesai
            </Button>
          </div>
        </div>
      </Scrollbar>

      {/* <div className="flex flex-col p-30px">
        <Button className="big w-full" onClick={submitQueueNumber} loading={loading}>
          QueueNumber
        </Button>
      </div> */}
    </div>
  );
}
