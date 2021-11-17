import Plus from 'assets/icons/plus-icon';
import Minus from 'assets/icons/minus-icon';
import Trash from 'assets/icons/trash';
import IconButton from './icon-button';
import { CounterSizes } from './utils/prop-types';
import { CounterBase, CounterValue, CounterSize } from './utils/theme';

type CounterProps = {
  className?: string;
  value: number;
  size?: CounterSizes;
  onDecrement: (e: any) => void;
  onIncrement: (e: any) => void;
  disabled: boolean;
};

const Counter: React.FC<CounterProps> = ({
  onDecrement,
  onIncrement,
  disabled = false,
  value,
  size = 'normal',
  className = '',
}) => {
  const classNames = CounterBase + ' ' + CounterSize[size] + ' ' + className;
  return (
    <div className={classNames}>
      <IconButton
        disabled={disabled}
        onClick={onDecrement}
        className={`h-full ${
          size === 'big' ? 'w-60px' : 'w-35px'
        } text-white bg-gray-900 transition duration-300 hover:bg-gray-3a focus:outline-none ${disabled ? 'counter-btn-disabled' : ''}`}
      >
        {value > 1 ? <Minus /> : <Trash />}
      </IconButton>

      <span className={CounterValue}>{value}</span>

      <IconButton
        disabled={disabled}
        onClick={onIncrement}
        className={`h-full ${
          size === 'big' ? 'w-60px' : 'w-35px'
        } text-white bg-gray-900 transition duration-300 hover:bg-gray-3a focus:outline-none ${disabled ? 'counter-btn-disabled' : ''}`}
      >
        <Plus />
      </IconButton>
    </div>
  );
};

export default Counter;
