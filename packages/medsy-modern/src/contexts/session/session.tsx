import { eraseCookie, getCookie, setCookie } from 'helpers/cookie';
import { createContext, useState, useContext } from 'react';

export const SessionContext = createContext({} as any);

var CryptoJS = require('crypto-js');

const enckey =
  'KFSmartRetail2021ASLKDKJCZXNIUWEYjhashduiwuiY(&@*#&8979ujksdha98982173jbsandb2y1983JAHSJDHjkh';

const INITIAL_STATE = {
  isLoggedIn: false,
  user: {
    name: '',
    phone: '',
    img: '',
    point: 0,
    idSession: '',
  },
  isLoggedInAnonymously: false,
  userAnonymous: {
    idUserAnonymous: '',
    nameUserAnonymous: '',
  },
};

function useSessionAction() {
  const [sessionState, setSessionState] = useState(INITIAL_STATE);

  const login = (state, idSession, data) => {
    // login api request here
    var usr = {
      name: data.nameUser,
      phone: data.phoneUser,
      img: data.imgUser ? data.imgUser : 'http://via.placeholder.com/100x100',
      point: data.pointUser,
      idSession: idSession,
    };

    // set cookie for prolonged session keeping
    setCookie(
      'session',
      CryptoJS.AES.encrypt(JSON.stringify(usr), enckey).toString(),
      1
    );

    eraseCookie('sessionAnonymous');

    setSessionState((prevState) => ({
      ...prevState,
      isLoggedIn: true,
      user: usr,
      isLoggedInAnonymously: false,
      userAnonymous: null,
    }));
    return state;
  };

  const logout = (state) => {
    // login api request here
    eraseCookie('session');
    eraseCookie('sessionAnonymous');

    setSessionState((prevState) => ({
      ...prevState,
      isLoggedIn: false,
      user: null,
      isLoggedInAnonymously: false,
      userAnonymous: null,
    }));
    return state;
  };

  const getSession = () => {
    if (getCookie('session')) {
      var ses = JSON.parse(
        CryptoJS.AES.decrypt(getCookie('session'), enckey).toString(
          CryptoJS.enc.Utf8
        )
      );
      setSessionState((prevState) => ({
        ...prevState,
        isLoggedIn: true,
        user: ses,
        isLoggedInAnonymously: false,
        userAnonymous: null,
      }));
      return ses;
    }
    if (getCookie('sessionAnonymous') && getCookie('session') == null) {
      var ses = JSON.parse(
        CryptoJS.AES.decrypt(getCookie('sessionAnonymous'), enckey).toString(
          CryptoJS.enc.Utf8
        )
      );
      setSessionState((prevState) => ({
        ...prevState,
        isLoggedInAnonymously: true,
        userAnonymous: ses,
      }));
      return ses;
    } else return null;
  };

  const loginAnonymous = async () => {
    var f = await fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Session/GenerateRandomIdentifier',
      {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Success:', data);

          // login api request here
          var usrAnon = {
            idUserAnonymous: data.data.toString(),
            nameUserAnonymous: null,
          };

          // set cookie for prolonged session keeping
          setCookie(
            'sessionAnonymous',
            CryptoJS.AES.encrypt(JSON.stringify(usrAnon), enckey).toString(),
            1
          );

          setSessionState((prevState) => ({
            ...prevState,
            isLoggedInAnonymously: true,
            userAnonymous: usrAnon,
          }));

          // apapun yang di return dari sini bakal masuk ke line return di bawah
          return data.data.toString();
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

    return await f;
  };

  const addNameToAnonymousSession = async (id, name) => {
    // login api request here
    var usrAnon = {
      idUserAnonymous: id,
      nameUserAnonymous: name,
    };

    // set cookie for prolonged session keeping
    setCookie(
      'sessionAnonymous',
      CryptoJS.AES.encrypt(JSON.stringify(usrAnon), enckey).toString(),
      1
    );

    setSessionState((prevState) => ({
      ...prevState,
      isLoggedInAnonymously: true,
      userAnonymous: usrAnon,
    }));
  };

  return {
    sessionState,
    login,
    logout,
    getSession,
    loginAnonymous,
    addNameToAnonymousSession,
  };
}

export const SessionProvider = ({ children }) => {
  const {
    sessionState,
    login,
    logout,
    getSession,
    loginAnonymous,
    addNameToAnonymousSession,
  } = useSessionAction();

  return (
    <SessionContext.Provider
      value={{
        sessionState,
        login,
        logout,
        getSession,
        loginAnonymous,
        addNameToAnonymousSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
