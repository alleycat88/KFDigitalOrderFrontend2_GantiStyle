import { useEffect } from 'react';
import Head from 'next/head';
import Layout from 'containers/layout/layout';
import Products from 'containers/products';
import HowItWorks from 'containers/how-it-works';
import { useRefScroll } from 'helpers/use-ref-scroll';
import { useSearch } from 'contexts/search/use-search';
import { getProducts } from 'helpers/get-products';
import { getCategories } from 'helpers/get-categories';
import Categories from 'containers/categories';
import ProductSortFilter from 'containers/product-sort-filter';
import { useCategory } from 'contexts/category/use-category';
import PersonalGreeting from 'components/personal-greeting';
import { useSession } from 'contexts/session/session';
import { useCart } from 'contexts/cart/cart.provider';
import { useWishlist } from 'contexts/wishlist/wishlist';
import Popup from 'containers/drawer/views/popup-dialog';
import CategoriesAlt from 'containers/categories-alt';

export default function Home({ products, categories }) {
  const { elRef, scroll } = useRefScroll({
    percentOfElement: 0,
    percentOfContainer: 0,
    offsetPX: -100,
  });
  const { searchTerm } = useSearch();
  const { category } = useCategory();
  const { sessionState, getSession } = useSession();
  const { getCart, clearCart } = useCart();
  const { wishlistState, getWishlist } = useWishlist();

  useEffect(() => {
    if (searchTerm || category) return scroll();
  }, [searchTerm, category]);

  // on app refresh fetch session from cookie
  useEffect(() => {
    getSession();
  }, []);

  // on login  either anonymously or regular way
  useEffect(() => {
    if (sessionState.isLoggedIn) getCart();
    if (!sessionState.isLoggedIn && sessionState.isLoggedInAnonymously)
      getCart();
    if (sessionState.isLoggedIn) getWishlist();
  }, [sessionState.isLoggedIn, sessionState.isLoggedInAnonymously]);

  return (
    <Layout>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="Description" content="Put your description here." />
        <title>Digital Order - Kimia Farma</title>
      </Head>

      {/* <HeroBlock /> */}
      <div>
        <div style={{width: '15%', float: 'left', padding: '30px 10px'}}>
          <div className='categories-sidebar-wrapper'>
            <CategoriesAlt data={categories} ref={elRef} />
          </div>
        </div>
        <div style={{width: '85%', float: 'left', padding: '0px 10px'}}>
          <PersonalGreeting />
          <HowItWorks />
          {/* <Categories data={categories} ref={elRef} /> */}
          <ProductSortFilter />
          <Products />
        </div>
      </div>
      {/* <CallToAction /> */}

      {/* popup */}
      <Popup />
    </Layout>
  );
}

export async function getServerSideProps() {
  // const products = await getProducts();
  const categories = await getCategories();

  return {
    props: {
      // products,
      categories,
    },
  };
}
