import { useContext, useState } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import { Scrollbar } from 'components/scrollbar';
import ArrowLeft from 'assets/icons/arrow-left';
import Input from 'components/input';
import Button from 'components/button';
import InputSelect from 'components/input-select';
import RegisterSuccess from './register-success';
import { useCart } from 'contexts/cart/cart.provider';

const initialState = {
  email: '',
  phone: '',
  password: '',
  name: '',
  repeatPassword: '',
  gender: 0,
  nameGuest: '',
};

export default function Register() {
  const { dispatch } = useContext(DrawerContext);
  const [formData, setFormData] = useState(initialState);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { addNameToAnonymousCart } = useCart();
  const [errorMessageLoginGuest, setErrorMessageLoginGuest] = useState(null);

  const hideRegister = () => {
    dispatch({
      type: 'TOGGLE_REGISTER_VIEW',
      payload: {
        showRegister: false,
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

  const submitRegister = async () => {
    const { phone, email, password, name, repeatPassword, gender } = formData;

    setErrorMessage(null);

    setLoading(true);

    fetch('https://digitalorderbackend.sprintmanager.id/api/User', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneUser: phone,
        emailUser: email,
        nameUser: name,
        passwordUser: password,
        repeatPasswordUser: repeatPassword,
        genderUser: parseInt(gender.toString()),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(formData));
        if (data.success) {
          console.log('Success:', data);
          setSuccess(true);
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
  };

  const onChange = (e) => {
    const { value, name } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  if (success) {
    return <RegisterSuccess />;
  }

  const submitLoginAsGuest = async () => {
    const { nameGuest } = formData;

    if (nameGuest) {
      var res = await addNameToAnonymousCart(nameGuest);
      if (res.success) {
        showCart();
      } else setErrorMessageLoginGuest(res.message);
    } else {
      setErrorMessageLoginGuest('Nama Tidak Boleh Kosong');
    }
  };

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ backgroundColor: '#F1EFF0' }}
    >
      <div className="w-full flex justify-center relative px-30px py-20px">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={() => {
            hideRegister();
            showLogin();
          }}
          aria-label="close"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-bold text-24px m-0">Daftar KF Mobile</h2>
      </div>

      <Scrollbar className="checkout-scrollbar flex-grow">
        <div className="flex flex-col px-30px pt-20px">
          <div className="flex flex-col mb-45px">
            <Input
              placeholder="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={onChange}
              className="mt-15px"
            />
            <Input
              placeholder="Nomor Telepon"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="mt-15px"
            />
            {/* <Input
              placeholder="Alamat Email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="mt-15px"
            /> */}
            <Input
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={onChange}
              type="password"
              className="mt-15px"
            />
            <Input
              placeholder="Ulangi Password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={onChange}
              type="password"
              className="mt-15px"
            />
            {/* <InputSelect
              placeholder="Jenis Kelamin"
              name="gender"
              value={formData.gender}
              onChange={onChange}
              className="mt-15px"
              options={[
                {name: 'Pilih Jenis Kelamin', value: 0, isDefault: true, isDisabled: true},
                {name: 'Pria', value: 1},
                {name: 'Wanita', value: 2}
              ]}
            /> */}
            {errorMessage ? (
              <p className="text-red mt-20px text-center">{errorMessage}</p>
            ) : null}
            <Button
              className="big w-full mt-15px"
              loading={loading}
              onClick={submitRegister}
            >
              Daftar
            </Button>
            <h5 className="separator-text">atau</h5>
            <div className="flex flex-col mb-15px mt-15px">
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
              {errorMessageLoginGuest ? (
                <p className="text-red mt-20px text-center">
                  {errorMessageLoginGuest}
                </p>
              ) : null}
              <Button
                className="big w-full mt-15px"
                loading={loading}
                onClick={submitLoginAsGuest}
              >
                Masuk
              </Button>
            </div>
          </div>
        </div>
      </Scrollbar>

      {/* <div className="flex flex-col p-30px">
        <Button className="big w-full" onClick={submitRegister} loading={loading}>
          Register
        </Button>
      </div> */}
    </div>
  );
}
