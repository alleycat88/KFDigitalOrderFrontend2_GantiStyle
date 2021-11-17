import React, { useState, useContext, useEffect } from 'react';
import { Scrollbar } from 'components/scrollbar';
import Button from 'components/button';
import { CURRENCY } from 'helpers/constants';
import { useCart } from 'contexts/cart/cart.provider';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import ArrowLeft from 'assets/icons/arrow-left';
import Counter from 'components/counter';
import WishListIcon from 'assets/icons/wishlist-icon';
import CompareIcon from 'assets/icons/compare-icon';
import CloseIcon from 'assets/icons/close';
import LoadingIcon from 'assets/icons/loading';
import EmptyListIcon from 'assets/icons/empty-list';
import { useSession } from 'contexts/session/session';
import { useWishlist } from 'contexts/wishlist/wishlist';

var numeral = require('numeral');

export default function ProductDetails() {
  const [visibility, setVisibility] = useState(false);
  const { cart, addItem, editQuantityItem } = useCart();
  const { state, dispatch } = useContext(DrawerContext);
  const { sessionState } = useSession();
  const { addWishlist, removeWishlist, checkItemInWishlist } = useWishlist();

  const [isItemInWishlist, setIsItemInWishlist] = useState(false);
  const [isComparedItemInWishlist, setIsComparedItemInWishlist] = useState(
    false
  );

  const [count, setCount] = useState(0);
  const [countComparedProduct, setCountComparedProduct] = useState(0);

  const [shouldEditQuantity, setShouldEditQuantity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  var [timer, setTimer] = useState(null);
  const postQuantity = (isPlus, isComparedProduct = false) => {
    if (!isComparedProduct) {
      if (isPlus) setCount(count + 1);
      else setCount(count - 1 < 0 ? 0 : count - 1);
    } else {
      if (isPlus) setCountComparedProduct(countComparedProduct + 1);
      else
        setCountComparedProduct(
          countComparedProduct - 1 < 0 ? 0 : countComparedProduct - 1
        );
    }

    setShouldEditQuantity(true);
  };
  // for product shown
  useEffect(() => {
    if (shouldEditQuantity) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          setIsLoading(true);
          editQuantityItem(state.item, count, () => {
            setIsLoading(false);
          });
          setShouldEditQuantity(false);
        }, 1000)
      );
    }
  }, [count]);
  // for product compared
  useEffect(() => {
    if (shouldEditQuantity) {
      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          setIsLoading(true);
          editQuantityItem(comparedProduct, countComparedProduct, () => {
            setIsLoading(false);
          });
          setShouldEditQuantity(false);
        }, 1000)
      );
    }
  }, [countComparedProduct]);

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const hideDetails = () => {
    setisProductCompareShown(false);
    setisCompareDetailShown(false);

    // dispatch({
    //   type: 'TOGGLE_PRODUCT_DETAIL',
    //   payload: {
    //     showDetails: false,
    //   },
    // });

    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    });
  };

  const addToCart = (itemtoadd) => {
    setIsLoading(true);
    addItem(
      itemtoadd,
      (data) => {
        setIsLoading(false);
        dispatch({
          type: 'TOGGLE_CART_VIEW',
          payload: {
            showCart: true,
          },
        });
      },
      (error) => {
        setIsLoading(false);
      }
    );
  };

  // KHUSUS BUAT KEPERLUAN COMPARE PRODUCT
  // buat toggle slider compare
  const [isProductCompareShown, setisProductCompareShown] = useState(false);
  // buat toggle detail comparison, e.g. data side by side dengan produk yang lagi dilihat
  const [isCompareDetailShown, setisCompareDetailShown] = useState(false);
  // buat nampung data similiar product
  const [similiarProducts, setsimiliarProducts] = useState([]);
  // buat nampung chosen similiar product
  const [comparedProduct, setComparedProduct] = useState({
    idProduct: 0,
    nameProduct: '',
    imgProduct: '',
    priceProduct: 0,
    descProduct: '',
  });
  const [
    isFetchSimiliarProductLoading,
    setisFetchSimiliarProductLoading,
  ] = useState(false);
  const [
    isFetchSimiliarProductEmpty,
    setisFetchSimiliarProductEmpty,
  ] = useState(false);

  // fetch kalo compare slider dibuka
  useEffect(() => {
    if (isProductCompareShown) {
      setisFetchSimiliarProductLoading(true);
      setisFetchSimiliarProductEmpty(false);
      fetch(
        `https://digitalorderbackend.sprintmanager.id/api/Product/SimiliarProduct/${state.item.idProduct}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            if (data.data.length > 0) {
              setsimiliarProducts(
                data.data.filter((a) => a.idProduct != state.item.idProduct)
              );
            } else {
              setisFetchSimiliarProductEmpty(true);
            }
          } else {
            console.log(
              'Gagal Mengambil Data Produk Sejenis : ' + data.message
            );
          }
          setisFetchSimiliarProductLoading(false);
        })
        .catch((error) => {
          console.log('Gagal Mengambil Data Produk Sejenis : ' + error);
          setisFetchSimiliarProductLoading(false);
        });
    } else {
      setsimiliarProducts([]);
    }
  }, [isProductCompareShown]);

  const toggleCompareDetail = (idProduct) => {
    var comparedProduct = similiarProducts.find(
      (a) => a.idProduct == idProduct
    );
    setisCompareDetailShown(true);
    setComparedProduct(comparedProduct);
    // setCountComparedProduct(cart.cart_Items.find(a => a.product.idProduct == comparedProduct.idProduct)?.quantityCart_Item);
  };
  useEffect(() => {
    if (state.open == false) hideDetails();
  }, [state.open]);

  // get is in wishlist dan count di cart tiap kali produk atau compared product berubah
  useEffect(() => {
    if (sessionState.isLoggedIn || sessionState.isLoggedInAnonymously) {
      setIsItemInWishlist(checkItemInWishlist(state.item.idProduct));
      setIsComparedItemInWishlist(
        checkItemInWishlist(comparedProduct.idProduct)
      );
      setCount(
        cart.cart_Items.find((a) => a.product.idProduct == state.item.idProduct)
          ?.quantityCart_Item
      );
      setCountComparedProduct(
        cart.cart_Items.find(
          (a) => a.product.idProduct == comparedProduct.idProduct
        )?.quantityCart_Item
      );
    }
  }, [state.item.idProduct, comparedProduct, removeWishlist, addWishlist]);

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ backgroundColor: '#F0EEEF' }}
    >
      <div className="w-full flex justify-center relative px-30px py-20px">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={hideDetails}
          aria-label="close"
        >
          <ArrowLeft />
        </button>

        <h2 className="font-bold text-24px m-0">Details</h2>
      </div>

      <Scrollbar className="details-scrollbar flex-grow">
        <div className="flex flex-col p-30px pt-0">
          <div
            className="flex items-center justify-center w-full h-360px overflow-hidden rounded mb-30px"
            style={{
              position: 'relative',
              // boxShadow:
              //   'rgb(0 0 0 / 20%) 6px 6px 8px 0px, rgb(255 255 255 / 90%) -6px -6px 8px 0px',
              margin: '20px 5px',
              borderRadius: '5px',
              // border: '1px solid #f7f7f7',
            }}
          >
            <img
              src={state.item.imgProduct}
              alt={`${state.item.nameProduct}-img`}
            />
          </div>

          <div className="product-actions">
            <div className="product-stock">
              <p className="product-stock__text">Stok Tersisa</p>
              <div className="product-stock__stock">200</div>
            </div>
            {sessionState.isLoggedIn ? (
              <button
                className={`product-wishlist-icon ${
                  isItemInWishlist ? 'active' : ''
                }`}
                onClick={() =>
                  isItemInWishlist
                    ? removeWishlist(state.item.idProduct)
                    : addWishlist(state.item.idProduct)
                }
              >
                <WishListIcon
                  width="25px"
                  height="25px"
                  color={isItemInWishlist ? 'red' : ''}
                  style={{ margin: '0 auto' }}
                />
                <span>Wishlist</span>
              </button>
            ) : null}
            <button
              className={`product-compare-icon ${
                isProductCompareShown ? 'active' : ''
              }`}
              onClick={() => {
                setisProductCompareShown(!isProductCompareShown);
                setisCompareDetailShown(false);
              }}
            >
              
              <span>
                <CompareIcon
                  width="15px"
                  height="15px"
                  style={{ display: 'inline-block', marginRight: '10px', color: 'red' }}
                  fill
                />
                Bandingkan
              </span>
            </button>
          </div>

          <div className="flex flex-col items-start mb-4">
            <span className="mb-3" style={{fontSize: '18px', fontWeight: 700}}>{state.item.nameProduct}</span>
            <span
              className="text-gray-900 font-semibold mb-2"
              style={{ fontSize: '18px', color: '#EB8A1B' }}
            >
              {CURRENCY}
              {numeral(state.item.priceProduct).format(0, 0)}
            </span>
            <p className="flex items-center mb-5">
              <span className=" text-gray-500 text-11px capitalize">
                {state.item.type}
              </span>
              <span className="flex bg-gray-500 w-3px h-3px rounded mx-3" />
              <span className=" text-gray-500 text-11px">
                {state.item.quantity}{' '}
                {state.item.quantity > 1 ? 'pieces' : 'piece'}
              </span>
            </p>

            {/* {visibility === true ? (
              <p className="my-5">{state.item.descProduct}</p>
            ) : (
              ''
            )} */}
            <p className="my-5">{state.item.descProduct}</p>

            {/* {state.item.descProduct && (
              <button
                className="font-semibold text-11px text-gray-800 mt-2 focus:outline-none"
                onClick={toggleVisibility}
                aria-label="details"
              >
                {visibility === true ? 'Less Details' : 'More Details'}
              </button>
            )} */}
          </div>

          <div className="flex w-full flex-col">
            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">Dosages Form</span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.type}
              </span>
            </div>

            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">Dosages</span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.dosage}
              </span>
            </div>

            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">
                Active Substance
              </span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.substance}
              </span>
            </div>

            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">Manufacturer</span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.manufacturer}
              </span>
            </div>
          </div>
        </div>
      </Scrollbar>

      <div className="flex flex-col p-30px">
        {(sessionState.isLoggedIn || sessionState.isLoggedInAnonymously) &&
        count > 0 ? (
          <Counter
            disabled={isLoading}
            value={count}
            className="ml-auto w-full big"
            size="big"
            onIncrement={() => {
              postQuantity(true);
            }}
            onDecrement={() => {
              postQuantity(false);
            }}
          />
        ) : (
          <Button
            disabled={isLoading}
            className="w-full big"
            onClick={() => addToCart(state.item)}
          >
            Add To Cart
          </Button>
        )}
      </div>

      {/* compare div */}
      <div
        className={`compare-product ${
          isProductCompareShown ? 'active' : ''
        } flex flex-col w-full h-full`}
        style={{ backgroundColor: '#F0EEEF' }}
      >
        <div className="w-full flex justify-center relative px-30px py-20px">
          <button
            className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
            onClick={() => {
              if (isCompareDetailShown) setisCompareDetailShown(false);
              else setisProductCompareShown(false);
            }}
            aria-label="close"
          >
            <CloseIcon />
          </button>

          <h2 className="font-bold text-24px m-0">Bandingkan</h2>
        </div>

        {
          isCompareDetailShown ? (
            // {/* detail product to compare */}
            <React.Fragment>
              <Scrollbar
                className={`details-scrollbar flex-grow ${
                  isCompareDetailShown ? '' : 'hide'
                }`}
              >
                <div className="flex flex-col p-30px pt-0">
                  <div
                    className="flex items-center justify-center w-full h-360px overflow-hidden rounded mb-30px"
                    style={{
                      position: 'relative',
                      boxShadow:
                        'rgb(0 0 0 / 20%) 6px 6px 8px 0px, rgb(255 255 255 / 90%) -6px -6px 8px 0px',
                      margin: '20px 5px',
                      borderRadius: '8px',
                      border: '1px solid #f7f7f7',
                    }}
                  >
                    <img
                      src={comparedProduct.imgProduct}
                      alt={`${comparedProduct.nameProduct}-img`}
                    />
                  </div>

                  <div className="product-actions">
                    <div className="product-stock">
                      <p className="product-stock__text">Stok Tersisa</p>
                      <div className="product-stock__stock">200</div>
                    </div>
                    {sessionState.isLoggedIn ? (
                      <button
                        className={`product-wishlist-icon ${
                          isComparedItemInWishlist ? 'active' : ''
                        }`}
                        onClick={() =>
                          isComparedItemInWishlist
                            ? removeWishlist(comparedProduct.idProduct)
                            : addWishlist(comparedProduct.idProduct)
                        }
                      >
                        <WishListIcon
                          width="25px"
                          height="25px"
                          color={isComparedItemInWishlist ? 'red' : ''}
                          style={{ margin: '0 auto' }}
                        />
                        <span>Wishlist</span>
                      </button>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-start mb-4">
                    <span
                      className="text-gray-900 font-semibold mb-2"
                      style={{ fontSize: '20px' }}
                    >
                      {CURRENCY}
                      {numeral(comparedProduct.priceProduct).format(0, 0)}
                    </span>
                    <span className="mb-3">{comparedProduct.nameProduct}</span>
                    <p className="flex items-center mb-5">
                      <span className=" text-gray-500 text-11px capitalize">
                        {state.item.type}
                      </span>
                      <span className="flex bg-gray-500 w-3px h-3px rounded mx-3" />
                      <span className=" text-gray-500 text-11px">
                        {state.item.quantity}{' '}
                        {state.item.quantity > 1 ? 'pieces' : 'piece'}
                      </span>
                    </p>

                    {/* {visibility === true ? (
                    <p className="my-5">{state.item.descProduct}</p>
                  ) : (
                    ''
                  )} */}
                    <p className="my-5">{comparedProduct.descProduct}</p>

                    {/* {chosenSimiliarProducts.descProduct && (
                    <button
                      className="font-semibold text-11px text-gray-800 mt-2 focus:outline-none"
                      onClick={toggleVisibility}
                      aria-label="details"
                    >
                      {visibility === true ? 'Less Details' : 'More Details'}
                    </button>
                  )} */}
                  </div>

                  <div className="flex w-full flex-col">
                    <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
                      <span className="text-gray-500 text-11px mb-2">
                        Dosages Form
                      </span>
                      <span className="font-normal text-13px text-gray-900 capitalize">
                        {state.item.type}
                      </span>
                    </div>

                    <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
                      <span className="text-gray-500 text-11px mb-2">
                        Dosages
                      </span>
                      <span className="font-normal text-13px text-gray-900 capitalize">
                        {state.item.dosage}
                      </span>
                    </div>

                    <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
                      <span className="text-gray-500 text-11px mb-2">
                        Active Substance
                      </span>
                      <span className="font-normal text-13px text-gray-900 capitalize">
                        {state.item.substance}
                      </span>
                    </div>

                    <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
                      <span className="text-gray-500 text-11px mb-2">
                        Manufacturer
                      </span>
                      <span className="font-normal text-13px text-gray-900 capitalize">
                        {state.item.manufacturer}
                      </span>
                    </div>
                  </div>
                </div>
              </Scrollbar>

              <div className="flex flex-col p-30px">
                {(sessionState.isLoggedIn ||
                  sessionState.isLoggedInAnonymously) &&
                countComparedProduct > 0 ? (
                  <Counter
                    disabled={isLoading}
                    value={countComparedProduct}
                    className="ml-auto w-full big"
                    size="big"
                    onIncrement={() => {
                      postQuantity(true, true);
                    }}
                    onDecrement={() => {
                      postQuantity(false, true);
                    }}
                  />
                ) : (
                  <Button
                    className="w-full big"
                    onClick={() => addToCart(comparedProduct)}
                  >
                    Add To Cart
                  </Button>
                )}
              </div>
            </React.Fragment>
          ) : (
            // {/* detail product to compare */}

            // {/* pick product to compare */}
            <Scrollbar
              className={`flex-grow ${isCompareDetailShown ? 'hide' : ''}`}
            >
              <div className="flex flex-col p-30px pt-0">
                <div>
                  {isFetchSimiliarProductLoading ||
                  isFetchSimiliarProductEmpty ? (
                    isFetchSimiliarProductLoading ? (
                      <LoadingIcon />
                    ) : isFetchSimiliarProductEmpty ? (
                      <EmptyListIcon />
                    ) : null
                  ) : (
                    similiarProducts.map((sp) => (
                      <div
                        key={sp.idProduct}
                        className="compare-product__item"
                        onClick={() => {
                          toggleCompareDetail(sp.idProduct);
                        }}
                      >
                        <img
                          className="compare-product__item__img"
                          src={sp.imgProduct}
                        />
                        <div className="compare-product__item__desc">
                          <p className="compare-product__item__desc__name">
                            {sp.nameProduct}
                          </p>
                          <p className="compare-product__item__desc__price">
                            {CURRENCY + numeral(sp.priceProduct).format(0, 0)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Scrollbar>
          )
          // {/* pick product to compare */}
        }
      </div>
      {/* compare div */}
    </div>
  );
}
