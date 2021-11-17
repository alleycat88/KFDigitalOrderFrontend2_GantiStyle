import { useProduct } from "contexts/products/products";
import { useEffect } from "react";
import { useState } from "react";

const priceFilterInitial = {
    minPrice : '',
    maxPrice : ''
}

export default function ProductSortFilter(){
    const { productState, getProduct } = useProduct();

    const [onPriceFilterChangeTimeout, setonPriceFilterChangeTimeout] = useState(null);
    const [priceFilter, setpriceFilter] = useState(priceFilterInitial);
    const [isFirstHitAvoided, setisFirstHitAvoided] = useState(false);
    useEffect(() => {
        if(isFirstHitAvoided){
            if(onPriceFilterChangeTimeout) clearTimeout(onPriceFilterChangeTimeout);

            setonPriceFilterChangeTimeout(setTimeout(() => {
                getProduct({minPrice: priceFilter.minPrice ? priceFilter.minPrice : 0, maxPrice: priceFilter.maxPrice ? priceFilter.maxPrice : 0})
            }, 1000))
        }
        setisFirstHitAvoided(true);
    }, [priceFilter])

    const onSort = (orderbyandascending) => {
        var orderbyandascendingarray = orderbyandascending.split(' ');
        getProduct({order: orderbyandascendingarray[0], ascending: orderbyandascendingarray[1] == 'ascending' ? true : false});
    }

    const onChange = (e) => {
        const { value, name } = e.currentTarget;
        setpriceFilter({
          ...priceFilter,
          [name]: value,
        });
    };

    return(
        <div className='product-sort-filter'>

            <div className='product-sort-filter__price-filter'>
                <p className='product-sort-filter__price-filter__text'>Filter Harga</p>
                <div className='product-sort-filter__price-filter__inputs'>
                    <input onChange={e => onChange(e)} value={priceFilter.minPrice} name="minPrice" className='product-sort-filter__price-filter__input-min' placeholder='Harga Minimal' type='number'/>
                    <p className='product-sort-filter__price-filter__dash'>-</p>
                    <input onChange={e => onChange(e)} value={priceFilter.maxPrice} name="maxPrice" className='product-sort-filter__price-filter__input-max' placeholder='Harga Maksimal' type='number'/>
                </div>
            </div>

            <div className='product-sort-filter__sorts'>
                <select onChange={(e) => {onSort(e.currentTarget.value)}} className='product-sort-filter__sorts__general' defaultValue='' placeholder='Urutkan Berdasarkan'>
                    <option disabled value=''>Urutkan Berdasarkan</option>
                    <option value='priceProduct ascending'>Harga Termurah</option>
                    <option value='priceProduct descending'>Harga Termahal</option>
                    <option value='buyCountProduct descending'>Terlaku</option>
                    <option value='viewCountProduct descending'>Banyak Dilihat</option>
                    <option value='createdProduct descending'>Terbaru</option>
                </select>
            </div>

        </div>
    );
}