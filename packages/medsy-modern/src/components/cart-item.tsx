import Counter from './counter';
import { CURRENCY } from 'helpers/constants';
import { useCart } from 'contexts/cart/cart.provider';
import {
  CartItemBase,
  CartItemImage,
  CartItemContent,
  CartItemName,
  CartItemSinglePrice,
  CartItemTotalWrapper,
  CartItemTotalPrice,
} from './utils/theme';
import { useEffect, useState } from 'react';

var numeral = require('numeral');

type CartItemProps = {
  item: any;
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { editQuantityItem, cart } = useCart();

  const [ count, setCount ] = useState(0);
  const [ shouldEditQuantity, setShouldEditQuantity ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    setCount(item.quantityCart_Item);
  }, [item])

  var [timer, setTimer] = useState(null);
  const postQuantity = (isPlus) => {
    if(isPlus) setCount(count+1);
    else setCount(count-1 < 0 ? 0 : count-1);

    setShouldEditQuantity(true);
  }
  useEffect(() => {
    if(shouldEditQuantity){
      clearTimeout(timer);
      setTimer(setTimeout(() => {
        setIsLoading(true);
        editQuantityItem(item.product, count, () => {setIsLoading(false)})
        setShouldEditQuantity(false);
      }, 1000))
    }
  }, [count, shouldEditQuantity])

  return (
    <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
      <div className={'cart-item-card '+CartItemBase}>
        <div className={'cart-item-card__img '+CartItemImage}>
          <img src={item.product.imgProduct} alt={item.product.nameProduct} />
        </div>

        <div className={CartItemContent}>
          <span className={CartItemName}>{item.product.nameProduct}</span>
          <span className={CartItemSinglePrice}>
            Unit Price &nbsp;
            {CURRENCY}
            {numeral(item.product.priceProduct).format(0,0)}
          </span>

          <div className={CartItemTotalWrapper}>
            <Counter
              disabled={isLoading}
              value={count}
              onIncrement={() => postQuantity(true)}
              onDecrement={() => postQuantity(false)}
            />

            <span className={CartItemTotalPrice}>
              {CURRENCY}
              {numeral((item.product.priceProduct * item.quantityCart_Item).toFixed(2)).format(0,0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
