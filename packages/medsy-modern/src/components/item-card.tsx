import { CURRENCY } from 'helpers/constants';
import {
  ItemCardBase,
  ItemCardImage,
  ItemCardContent,
  ItemCardPrice,
} from './utils/theme';

var numeral = require('numeral')

interface ItemProps {
  imgProduct: string;
  nameProduct: string;
  priceProduct: number;
}

interface ItemCardProps {
  item: ItemProps;
  onClick?: (e: any) => void;
}

// height uthay dite hobe

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  return (
    // <div className={ItemCardBase} onClick={onClick}>
    //   <div className={ItemCardImage}>
    //     <img
    //       className="object-cover"
    //       src={item.imgProduct}
    //       alt={' Alt ' + item.nameProduct}
    //     />
    //   </div>

    //   <div className={ItemCardContent}>
    //     <span className={ItemCardPrice}>
    //       {CURRENCY}
    //       {numeral(item.priceProduct).format(0,0)}
    //     </span>
    //     <span className="text-13px">{item.nameProduct}</span>
    //   </div>
    // </div>

    <div className='item-card-alt' onClick={onClick}>
      <div className='item-card-alt__img' style={{backgroundImage: `url(${item.imgProduct})`}}/>
      <div className='item-card-alt__info'>
        <span className='item-card-alt__info__name'>{item.nameProduct}</span>
        <span className={'item-card-alt__info__price '+ItemCardPrice}>{CURRENCY + numeral(item.priceProduct).format(0,0)}</span>
        <button className='item-card-alt__info__btn'>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
