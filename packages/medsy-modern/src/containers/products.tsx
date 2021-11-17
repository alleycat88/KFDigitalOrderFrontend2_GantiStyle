import React, { useContext } from 'react';
import ItemCard from 'components/item-card';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
// import { useSearch } from 'contexts/search/use-search';
// import { useSearchable } from 'helpers/use-searchable';
import NotFound from 'assets/icons/not-found';
// import { useCategory } from 'contexts/category/use-category';
import { useEffect } from 'react';
import { useState } from 'react';
import { useProduct } from 'contexts/products/products';

const Products = React.forwardRef(
  ({ }: any, ref: React.RefObject<HTMLDivElement>) => {
    const { dispatch } = useContext(DrawerContext);
    const { productState, getProduct, page, maxPage } = useProduct();
    // const { searchTerm } = useSearch();
    // const { category } = useCategory();
    // const searchableItems = useSearchable(
    //   items,
    //   category,
    //   searchTerm,
    //   (item) => [item.nameProduct]
    // );

    const showDetails = (item) => {
      dispatch({
        type: 'STORE_PRODUCT_DETAIL',
        payload: {
          item: item,
        },
      });

      dispatch({
        type: 'SLIDE_CART',
        payload: {
          open: true,
        },
      });

      dispatch({
        type: 'TOGGLE_PRODUCT_DETAIL',
        payload: {
          showDetails: true,
        },
      });
    };

    useEffect(() => {
      getProduct();
    }, [])

    var scrollHandler = null;
    function initializeScrollToBottomListener (divName, onReached)  {
      var div = document.getElementById(divName);
      scrollHandler = function() {
        if(window.scrollY >= div.offsetTop + div.offsetHeight - window.innerHeight){
          if(onReached) onReached();
        }
      }
      window.addEventListener('scroll', scrollHandler)
    }
    function removeScollToBottomListener () {
      window.removeEventListener('scroll', scrollHandler);
    }
    
    var canFetch = true;
    // useEffect rule (HUGE FUTURE TIMESAVER) : https://stackoverflow.com/questions/56672935/react-hook-not-updated-in-function-listened-on-scroll-event
    useEffect(() => {
      initializeScrollToBottomListener('testidforscroll', () => {
        if(canFetch){
          canFetch = false;
          if(page+1 <= maxPage){
            // settimeout buat kasih delay biar ga auto fetch semua page sekaligus, plus buat animasi delay (loading etc)
            setTimeout(() => {
              getProduct({page: page+1, onSuccess: () => {
                canFetch = true;
              }})
            }, 1000)
          }
        }
      })
      return () => removeScollToBottomListener();
    })

    return (
      <div className="w-full py-10" ref={ref} id="myScrollToElement">
        <div id='testidforscroll'>
          {productState.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-4 md:gap-y-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10 xxl:grid-cols-5 xxl:gap-x-4 xxl:gap-y-12 2xxl:grid-cols-7 2xxl:gap-x-5 2xxl:gap-y-12">
              {productState.map((item) => (
                <ItemCard
                  key={item.idProduct}
                  item={item}
                  onClick={() => showDetails(item)}
                />
              ))}
            </div>
          ) : (
            <div className="pt-10px md:pt-40px lg:pt-20px pb-40px">
              <NotFound width="100%" />
              <h3 className="text-24px text-gray-900 font-bold mt-35px mb-0 text-center">
                Produk tidak ditemukan :(
              </h3>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Products;
