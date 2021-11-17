import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  TextBoxCommonBase,
  InputBase,
  TextBoxDisable,
  TextBoxEnable,
} from 'components/utils/theme';

export interface option {
    name: '',
    value: '',
    isDefault: false,
    isDisabled: false
}

export interface Props {
  value?: string;
  initialValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  options?: Array<option>;
  id?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  [key: string]: unknown;
}

export const defaultProps = {
  disabled: false,
  readOnly: false,
  className: '',
  placeholder: '',
  initialValue: '',
  options: []
};

type NativeAttrs = Omit<React.InputHTMLAttributes<any>, keyof Props>;

export type InputPropsType = Props & NativeAttrs;

const InputSelect = React.forwardRef<
  HTMLSelectElement,
  React.PropsWithChildren<InputPropsType>
>(
  (
    {
      className,
      id,
      value,
      name,
      initialValue,
      disabled,
      readOnly,
      placeholder,
      options,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref: React.Ref<HTMLSelectElement | null>
  ) => {
    const inputRef = useRef<HTMLSelectElement>(null);
    useImperativeHandle(ref, () => inputRef.current);

    const [initValue, setInitValue] = useState<string>(initialValue);

    const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (disabled || readOnly) return;
      setInitValue(event.target.value);
      onChange && onChange(event);
    };

    const focusHandler = (e: React.FocusEvent<HTMLSelectElement>) => {
      onFocus && onFocus(e);
    };
    const blurHandler = (e: React.FocusEvent<HTMLSelectElement>) => {
      onBlur && onBlur(e);
    };

    useEffect(() => {
      if (value === undefined) return;
      setInitValue(value);
    }, [value]);

    const classNames =
      InputBase +
      ' ' +
      TextBoxCommonBase +
      ' ' +
      (disabled === true ? TextBoxDisable : TextBoxEnable) +
      ' ' +
      className;

    return (
      <React.Fragment>
        <label htmlFor={id} className="sr-only">
          {name}
        </label>
        <select
            ref={inputRef}
            placeholder={placeholder}
            className={classNames}
            id={name}
            value={initValue}
            disabled={disabled}
            onChange={changeHandler}
            onFocus={focusHandler}
            onBlur={blurHandler}
            autoComplete="off"
            name={name}
            defaultValue={options.find(a => a.isDefault).value}
            {...props}
        >
            {
                options.map((o) => (
                    <option key={o.value} value={o.value} disabled={o.isDisabled}>{o.name}</option>
                ))
            }
        </select>
      </React.Fragment>
    );
  }
);

InputSelect.defaultProps = defaultProps;

export default InputSelect;
