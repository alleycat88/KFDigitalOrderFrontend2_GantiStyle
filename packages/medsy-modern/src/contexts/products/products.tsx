import { useEffect } from 'react';
import { createContext, useState, useContext } from 'react';

export const ProductContext = createContext({} as any);

const INITIAL_STATE = [
  // {
  //     idProduct: 0,
  //     product: {
  //         idProduct: '',
  //         nameProduct: '',
  //         descProduct: '',
  //         imgProduct: '',
  //         priceProduct: 0
  //     }
  // }
];

function useProductAction() {
  const [productState, setProductState] = useState(INITIAL_STATE);
  const [searchKey, setsearchKey] = useState('');
  const [page, setpage] = useState(1);
  const [ascending, setascending] = useState(true);
  const [order, setorder] = useState('');
  const [minPrice, setminPrice] = useState(0);
  const [maxPrice, setmaxPrice] = useState(0);
  const [idProductCategory, setidProductCategory] = useState(0);

  const [maxPage, setmaxPage] = useState(1);

  // buat marker kalo data lama di productState harus di replace bukan di append dengan data baru
  const [shouldReplaceProductState, setshouldReplaceProductState] = useState(
    false
  );

  const size = 5;

  // kalo user search, filter atau sort sesuatu, bikin pagenya jadi page 1
  useEffect(() => {
    setpage(1);
    setProductState([]);
  }, [searchKey, ascending, order, minPrice, maxPrice, idProductCategory]);

  const getProduct = async (option) => {
    // if(option.page < 1 || option.page > maxPage) return await null;

    // console.log(option.page)
    // console.log(option.page < 1, option.page > maxPage, option.page == undefined , isNaN(option.page))
    // console.log('maxPage : ' + maxPage)

    // // applyin default value
    // option = {
    //     searchKey : option?.searchKey ? option.searchKey : searchKey,
    //     page : option?.page < 1 || option?.page == undefined  || isNaN(option.page) ? 1 : option.page,
    //     ascending : option?.ascending ? option.ascending : ascending,
    //     minPrice : option?.minPrice ? option.minPrice : minPrice,
    //     maxPrice : option?.maxPrice ? option.maxPrice : maxPrice,
    //     order : option?.order ? option.order : order,
    //     onSuccess : option?.onSuccess,
    //     onError : option?.onError,
    //     onComplete : option?.onComplete
    // }

    // // page taro di atas, jadi use effect di atas bisa jalan
    // setpage(option.page)
    // setsearchKey(option.searchKey)
    // setascending(option.ascending)
    // setminPrice(option.minPrice)
    // setmaxPrice(option.maxPrice)
    // setorder(option.order)
    console.log(option);

    // page taro di atas, jadi use effect di atas bisa jalan
    if (option?.page && option?.page > 0) setpage(option.page);
    if (option?.searchKey != null) setsearchKey(option.searchKey);
    if (option?.ascending != null) setascending(option.ascending);
    if (option?.minPrice != null) setminPrice(option.minPrice);
    if (option?.maxPrice != null) setmaxPrice(option.maxPrice);
    if (option?.order) setorder(option.order);
    if (option?.idProductCategory != null)
      setidProductCategory(option.idProductCategory);

    const req = await fetch(
      'https://digitalorderbackend.sprintmanager.id/api/Product' +
        '?' +
        (option?.searchKey != null || searchKey
          ? 'key=' +
            (option?.searchKey != null ? option.searchKey : searchKey) +
            '&'
          : '') +
        (option?.page ? 'page=' + option.page + '&' : '') +
        ('size=' + size + '&') +
        (option?.ascending != null || ascending
          ? 'ascending=' +
            (option?.ascending != null ? option.ascending : ascending) +
            '&'
          : '') +
        (option?.minPrice != null || minPrice
          ? 'minPrice=' +
            (option.minPrice != null ? option.minPrice : minPrice) +
            '&'
          : '') +
        (option?.maxPrice != null || maxPrice
          ? 'maxPrice=' +
            (option.maxPrice != null ? option.maxPrice : maxPrice) +
            '&'
          : '') +
        (option?.order || order
          ? 'order=' + (option.order ? option.order : order) + '&'
          : '') +
        (option?.idProductCategory != null || idProductCategory
          ? 'idProductCategory=' +
            (option?.idProductCategory != null
              ? option.idProductCategory
              : idProductCategory)
          : '')
    )
      .then((response) => response.json())
      .then((data) => {
        //   console.log(JSON.stringify(data));
        if (data.success) {
          console.log('Success:', data);
          // setSuccess(true)

          var duniq = data.data.filter(
            (a) => productState.indexOf((b) => b.idCart === a.idCart) == -1
          );
          setProductState((prevData) => [...prevData, ...duniq]);
          setmaxPage(Math.ceil(data.totalData / size));
          if (option?.onSuccess)
            option.onSuccess(data.data, Math.ceil(data.totalData / size));
        } else {
          console.error('Error:', data.message);
          console.error('Error Data :', data);
          // setError(true);
          // setErrorMessage(data.message);
          if (option?.onError) option.onError();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        //   setError(true);
        //   setErrorMessage(error);
        if (option?.onError) option.onError();
      });
  };

  return {
    productState,
    searchKey,
    page,
    maxPage,
    ascending,
    order,
    maxPrice,
    minPrice,
    idProductCategory,
    getProduct,
  };
}

export const ProductProvider = ({ children }) => {
  const {
    productState,
    searchKey,
    page,
    maxPage,
    ascending,
    order,
    maxPrice,
    minPrice,
    idProductCategory,
    getProduct,
  } = useProductAction();

  return (
    <ProductContext.Provider
      value={{
        productState,
        searchKey,
        page,
        maxPage,
        ascending,
        order,
        maxPrice,
        minPrice,
        idProductCategory,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
