import 'rc-collapse/assets/index.css';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import 'assets/styles/scrollbar.css';
import 'assets/styles/rc-collapse.css';
import 'assets/styles/index.css';
import { CartProvider } from 'contexts/cart/cart.provider';
import { DrawerProvider } from 'contexts/drawer/drawer.provider';
import { SearchProvider } from 'contexts/search/use-search';
import 'typeface-open-sans';
import { CategoryProvider } from 'contexts/category/use-category';
import { SessionProvider } from 'contexts/session/session';
import { DrawerBottomProvider } from 'contexts/drawer/drawer-bottom.provider';
import { WishlistProvider } from 'contexts/wishlist/wishlist';
import { ProductProvider } from 'contexts/products/products';
import { MQTTProvider } from 'contexts/mqtt/mqtt';
import { PopupDialogProvider } from 'contexts/popup/popup-dialog';

export default function CustomApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <MQTTProvider>
        <PopupDialogProvider>
          <ProductProvider>
            <SearchProvider>
              <CategoryProvider>
                <DrawerProvider>
                  <DrawerBottomProvider>
                    <CartProvider>
                      <WishlistProvider>
                        <Component {...pageProps} />
                      </WishlistProvider>
                    </CartProvider>
                  </DrawerBottomProvider>
                </DrawerProvider>
              </CategoryProvider>
            </SearchProvider>
          </ProductProvider>
        </PopupDialogProvider>
      </MQTTProvider>
    </SessionProvider>
  );
}
