import { createContext, useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

// NOTE :
// this context controll a view called Popup in popup-dialog.tsx in slider folder.
// learned a lesson that setting function in state is problematic, the passed function will get executed asap. set fake setter in the state declaration instead
// then use a built-in function to set the function in state. tried many things, didn't work. this is the simplest way i found. please save your time by following this pattern
// for setting function in a state hook
// - bayu

export const PopupDialogContext = createContext(null);

export const PopupDialogProvider = ({ children }) => {
  const [affirmativeText, setaffirmativeText] = useState('Ya');
  const [negativeText, setnegativeText] = useState('Tidak');
  const [affirmativeAction, setaffirmativeActionxx] = useState();
  const [negativeAction, setnegativeActionxx] = useState();
  const [text, settext] = useState('');
  const [isShown, setisShown] = useState(false);

  var setaffirmativeAction = (act) => {
    setaffirmativeActionxx(() => act);
  };
  var setnegativeAction = (act) => {
    setnegativeActionxx(() => act);
  };

  return (
    <PopupDialogContext.Provider
      value={{
        affirmativeText,
        setaffirmativeText,
        negativeText,
        setnegativeText,
        affirmativeAction,
        setaffirmativeAction,
        negativeAction,
        setnegativeAction,
        text,
        settext,
        isShown,
        setisShown,
      }}
    >
      {children}
    </PopupDialogContext.Provider>
  );
};

export const usePopupDialog = () => useContext(PopupDialogContext);
