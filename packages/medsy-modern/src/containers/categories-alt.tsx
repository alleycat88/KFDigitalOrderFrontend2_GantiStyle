import CategoryCard from 'components/category-card';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';

import 'swiper/swiper-bundle.min.css';
import {
  ArrowButtonBase,
  ButtonGroupBase,
  NextButtonRadius,
  PrevButtonRadius,
} from 'components/utils/theme';
import ChevronLeft from 'assets/icons/chevron-left';
import ChevronRight from 'assets/icons/chevron-right';
interface Props {
  data: any;
}
SwiperCore.use([Navigation]);
const breakpoints = {
  600: {
    slidesPerView: 3,
  },
  768: {
    slidesPerView: 4,
  },
  1024: {
    slidesPerView: 5,
  },
  1200: {
    slidesPerView: 6,
  },
  1400: {
    slidesPerView: 8,
  },
  1900: {
    slidesPerView: 10,
  },
};
const CategoriesAlt = React.forwardRef(
  ({ data }: Props, ref: React.RefObject<HTMLDivElement>) => {
    return (
      <div style={{}}>
          <SwiperSlide key={0} style={{marginBottom: '15px'}}>
            <CategoryCard
              id={"0"}
              imageUrl={'https://files.sijisolusidigital.com/kimiafarma/ftp/AllProduct_200x200.webp'}
              name={'Semua Produk'}
              style={{margin: '0 auto'}}
            />
          </SwiperSlide>
          {data?.map((current) => (
            <SwiperSlide key={current.idProductCategory} style={{marginBottom: '15px'}}>
              <CategoryCard
                id={current.idProductCategory}
                imageUrl={current.imgProductCategory}
                name={current.nameProductCategory}
                style={{margin: '0 auto'}}
              />
            </SwiperSlide>
          ))}
      </div>
    );
  }
);

export default CategoriesAlt;
