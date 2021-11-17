import { useContext } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import ArrowLeft from 'assets/icons/arrow-left';
import SuccessIcon from 'assets/icons/success-tick';
import Button from 'components/button';

export default function RegisterSuccess() {
  const { dispatch } = useContext(DrawerContext);
  const hideRegister = () => {
    dispatch({
      type: 'TOGGLE_LOGIN_VIEW',
      payload: {
        showLogin: true,
      },
    });
  };

  return (
    <>
      <div className="w-full flex px-30px relative">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={hideRegister}
          aria-label="close"
        >
          <ArrowLeft />
        </button>
      </div>

      <div className="flex flex-col pb-60px flex-auto justify-center">
        <div className="flex items-center justify-center text-green">
          <SuccessIcon style={{ width: 60 }} />
        </div>

        <div className="flex flex-col items-center px-40px md:px-80px mt-15px">
          <h3 className="text-center text-18px font-semibold text-gray-900 mb-40px">
            Daftar Berhasil
          </h3>
          <p className="text-center text-14px font-semibold text-gray-900 mb-1">
            Terimakasih sudah mendaftar member KF Mobile.
          </p>
          <p className="text-center text-13px text-gray-700">
            Silahkan masuk menggunakan akun yang sudah anda daftarkan
          </p>
            <Button className="big w-full mt-15px" onClick={hideRegister}>
                Masuk
            </Button>
        </div>
      </div>
    </>
  );
}
