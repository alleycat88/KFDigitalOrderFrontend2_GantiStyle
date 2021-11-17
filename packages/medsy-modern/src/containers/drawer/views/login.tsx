// import { sessionContext } from "contexts/session/session";
// import { useContext } from "react";

// export default function LoginPopup(){
//     const { isLoggedIn, setIsLoggedIn } = useContext(sessionContext);
//     return(
//         <div className={`login ${isLoggedIn ? '' : 'open'}`} onClick={() => setIsLoggedIn(true)}>
//             {isLoggedIn.toString()}
//         </div>
//     );
// }

import { useContext, useState } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import { Scrollbar } from 'components/scrollbar';
import ArrowLeft from 'assets/icons/arrow-left';
import Input from 'components/input';
import Button from 'components/button';
import OrderSubmit from './order-submit';
import { useSession } from 'contexts/session/session';
import { useCart } from 'contexts/cart/cart.provider';

const initialState = {
  emailorphone: '',
  password: '',
  nameGuest: '',
};

export default function Login() {
  const { sessionState, login } = useSession();
  const { dispatch } = useContext(DrawerContext);
  const [formData, setFormData] = useState(initialState);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessageLoginGuest, setErrorMessageLoginGuest] = useState(null);

  const { addNameToAnonymousCart } = useCart();

  const hideCart = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    });
  };

  const showCart = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: true,
      },
    });
    dispatch({
      type: 'TOGGLE_CART_VIEW',
      payload: {
        showCart: true,
      },
    });
  };

  const hideLogin = () => {
    // dispatch({
    //   type: 'TOGGLE_LOGIN_VIEW',
    //   payload: {
    //     showLogin: false,
    //   },
    // });
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    });
  };

  const showRegister = () => {
    dispatch({
      type: 'TOGGLE_REGISTER_VIEW',
      payload: {
        showRegister: true,
      },
    });
  };

  const submitLoginAsGuest = async () => {
    const { nameGuest } = formData;

    var res = await addNameToAnonymousCart(nameGuest);
    if (res.success) {
      hideLogin();
      showCart();
    } else setErrorMessageLoginGuest(res.message);
  };

  const submitLogin = async () => {
    const { emailorphone, password } = formData;

    setLoading(true);

    fetch('https://digitalorderbackend.sprintmanager.id/api/Session/Login', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrPhone: emailorphone,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(formData));
        if (data.success) {
          console.log('Success:', data);
          setSuccess(true);

          login(null, data.data.idSession, data.data.user);
          hideLogin();
          showCart();
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
          setError(true);
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError(true);
        setErrorMessage(error);
      });

    setLoading(false);

    // const res = await fetch('/api/order', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     emailorphone: emailorphone,
    //     password: password
    //   }),
    // });
    // if (res.status === 200) {
    //   setSuccess(true);
    // } else {
    //   setError(true);
    // }
    // setLoading(false);
  };

  const onChange = (e) => {
    const { value, name } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ backgroundColor: '#F1EFF0' }}
    >
      <div className="w-full flex justify-center relative px-30px py-20px">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={hideLogin}
          aria-label="close"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-bold text-24px m-0">Masuk</h2>
      </div>

      <Scrollbar className="checkout-scrollbar flex-grow">
        <div className="flex flex-col px-30px pt-20px">
          {/* <div className="flex flex-col mb-15px">
            <p className='text-center'>Daftar untuk mendapatkan poin reward KF Mobile yang bisa kamu gunakan untuk keperluan kesehatanmu</p>
            <Button className="big w-full mt-15px" onClick={() => {
                showRegister();
            }}>
                Daftar KF Mobile
            </Button>
          </div> */}
          {/* <h5 className='separator-text'>atau</h5> */}
          <div className="flex flex-col mb-15px mt-15px">
            {/* <span className="flex font-semibold text-gray-900 text-18px mb-15px">
              Masuk Dengan Akun KF Mobile
            </span> */}
            <p className="text-center">
              Masuk dengan akun KF Mobile untuk mendapatkan loyalty poin dari
              belanjamu
            </p>
            <Input
              placeholder="Alamat Email atau Nomor Telepon"
              name="emailorphone"
              value={formData.emailorphone}
              onChange={onChange}
              className="mt-15px"
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              className="mt-15px"
            />
            {errorMessage ? (
              <p className="text-red mt-20px text-center">{errorMessage}</p>
            ) : null}
            <Button
              className="big w-full mt-15px"
              loading={loading}
              onClick={submitLogin}
            >
              Masuk
            </Button>
          </div>
          <h5 className="separator-text">atau</h5>
          <Button
            className="big w-full mt-15px"
            onClick={() => {
              showRegister();
            }}
          >
            Daftar KF Mobile
          </Button>
          {/* <div className="flex flex-col mb-15px mt-15px">
            <span className="flex font-semibold text-gray-900 text-18px mb-15px">
              Masuk Sebagai Tamu
            </span>
            <Input
              placeholder="Nama Anda"
              name="nameGuest"
              value={formData.nameGuest}
              onChange={onChange}
              className="mt-15px"
            />
            {
              errorMessageLoginGuest ? <p className='text-red mt-20px text-center'>{errorMessageLoginGuest}</p> : null
            }
            <Button className="big w-full mt-15px" loading={loading} onClick={submitLoginAsGuest}>
                Masuk
            </Button>
          </div> */}
        </div>
      </Scrollbar>

      {/* <div className="flex flex-col p-30px">
        <Button className="big w-full" onClick={submitLogin} loading={loading}>
          Login
        </Button>
      </div> */}
    </div>
  );
}
