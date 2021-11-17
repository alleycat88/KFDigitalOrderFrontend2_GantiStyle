import React, { useState } from 'react';
import SearchIcon from 'assets/icons/search-icon';
import { useSearch } from 'contexts/search/use-search';
import {
  SearchBase,
  SearchIconWrapper,
  SearchInput,
} from 'components/utils/theme';
import { useProduct } from 'contexts/products/products';

type SearchProps = { className?: string; id?: string };

const Search: React.FC<SearchProps> = ({ className, ...props }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const {getProduct} = useProduct();

  const [onSearchTimeout, setonSearchTimeout] = useState(null);

  const onSearch = (e) => {
    // // e.preventDefault();
    // const { value } = e.currentTarget;
    // setSearchTerm(value);

    var asd = e.currentTarget.value;
    
    setSearchTerm(asd);

    if(onSearchTimeout) clearInterval(onSearchTimeout);
    setonSearchTimeout(setTimeout(() => {
      getProduct({searchKey: asd});
    }, 1000))
  };
  const onSubmit = (e) => e.preventDefault();

  const classNames = SearchBase + ' ' + className;
  return (
    <form noValidate role="search" className={classNames} onSubmit={onSubmit}>
      <span className={SearchIconWrapper}>
        <SearchIcon color="#EB8A1B" />
      </span>
      {/* <label htmlFor={props.id || 'search-normal'} className="sr-only">
        {props.id || 'search-normal'}
      </label> */}
      <input
        type="search"
        placeholder="Cari nama obat atau sebutkan nama penyakit anda"
        className={'typical-input '+SearchInput}
        style={{paddingLeft: '3rem !important'}}
        value={searchTerm}
        onChange={onSearch}
        // id={props.id || 'search-normal'}
        autoComplete="off"
        {...props}
      />
    </form>
  );
};

export default Search;
