import { usePopupDialog } from 'contexts/popup/popup-dialog';
import React, { useState } from 'react';

// NOTE :
// this is a view controlled by context

export default function Popup(props) {
  const {
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
  } = usePopupDialog();

  return (
    <React.Fragment>
      {isShown ? (
        <div className="payment__popup-confirmation">
          <div className="payment__popup-confirmation__popup">
            <button
              className="payment__popup-confirmation__close-btn"
              onClick={() => {
                negativeAction();
              }}
            >
              X
            </button>
            {text}
            <div className="payment__popup-confirmation__popup__btns">
              <button
                onClick={() => {
                  affirmativeAction();
                }}
              >
                {affirmativeText}
              </button>
              <button
                onClick={() => {
                  negativeAction();
                }}
              >
                {negativeText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
