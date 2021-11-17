import React, { ReactElement } from 'react';
import Image from 'next/image';
import { useCategory } from 'contexts/category/use-category';
import { useProduct } from 'contexts/products/products';
interface Props {
  imageUrl: string;
  name: string;
  id: string;
  style?: {} ;
}

export default function CategoryCard({
  imageUrl,
  name,
  id,
  style,
}: Props): ReactElement {
  const { idProductCategory, getProduct } = useProduct();

  // const { category, setCategory } = useCategory();
  function handleCategoryClick() {
    if (idProductCategory !== id) {
      // setCategory(id);
      getProduct({idProductCategory: id})
    } else {
      // setCategory('');
      getProduct({idProductCategory: 0})
    }
  }
  return (
    <div
      className={`category-card p-4 flex flex-col border rounded-md text-center ${
        idProductCategory === id ? 'active' : ''
      }`}
      onClick={handleCategoryClick}
      role="button"
      style={style}
    >
      {/* <Image src={imageUrl} alt={name} width={120} height={120} unoptimized /> */}
      <img src={imageUrl} style={{width: '90px', height: '90px', margin: '0 auto'}} />
      <p className="font-semibold text-gray-900 truncate">{name}</p>
    </div>
  );
}
