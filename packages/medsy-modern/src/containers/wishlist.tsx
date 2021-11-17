import ItemCard from "components/item-card";
import NoWishlist from "components/no-wishlist";
import { DrawerBottomContext } from "contexts/drawer/drawer-bottom.provider";
import { DrawerContext } from "contexts/drawer/drawer.provider";
import { useSession } from "contexts/session/session";
import { useWishlist } from "contexts/wishlist/wishlist";
import { useContext, useEffect, useState } from "react";

export default function Wishlist(){
    const { dispatchBottom }: any = useContext(DrawerBottomContext);
    const { dispatch } = useContext(DrawerContext);
    const { sessionState, getSession } = useSession();
    const { wishlistState, getWishlist } = useWishlist();

    useEffect(() => {
      getWishlist()
    }, [])

    const closeWishlist = () => {
        dispatchBottom({
          type: 'SLIDE_DRAWER_BOTTOM',
          payload: {
            open: false,
          },
        });
        setTimeout(() => {
          dispatchBottom({
            type: 'TOGGLE_WISHLIST_DETAIL',
            payload: {
              showWishlist: false,
            },
          });
        }, 300)
      };

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

    return(
        <div>
            <button className='wishlist__close-btn' onClick={closeWishlist}></button>

            <h2 className='mb-40px text-center'>Wishlist Saya</h2>
            <hr className='mb-20px'/>
            <div className='wishlist__product-wrap'>
                  {
                    wishlistState && wishlistState.length > 0 ? 
                      <div className="mb-40px grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 md:gap-x-4 md:gap-y-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10 xxl:grid-cols-5 xxl:gap-x-4 xxl:gap-y-12 2xxl:grid-cols-7 2xxl:gap-x-5 2xxl:gap-y-12">  
                      {
                        wishlistState.map((item) => (
                          <ItemCard
                            key={item.idWishlist}
                            item={item.product}
                            onClick={() => showDetails(item.product)}
                          />
                        ))
                      } 
                      </div>
                      : 
                      <NoWishlist/>
                  }
            </div>
        </div>
    );
}