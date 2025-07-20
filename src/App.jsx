import React, {useEffect, useMemo, useReducer, useRef} from 'react';
import Table from "./component/table.jsx";
import Datalist from "./assets/items.json";
import Card from "./component/card.jsx";
import {appInitialState, appReducer, reducerAction} from "./reducer/app.reducer.js";
import {useFilterAndSortData} from "./hooks/useFilterAndSortData.js";
import IconArrowLeft from "./component/icon_arrow_left.jsx";
import IconArrowRight from "./component/icon_arrow_right.jsx";
import IconSort from "./component/icon_sort.jsx";
import IconSortUp from "./component/icon_sort_up.jsx";
import IconSortDown from "./component/icon_sort_down.jsx";

const columns = [
  {key: 'name', field: 'name', label: '商品名稱', width: 300, sorting: true},
  {key: 'category', field: 'category', label: '類別', sorting: true},
  {key: 'price', field: 'price', label: '價格', sorting: true},
  {
    key: 'inStock', field: 'inStock', label: '有庫存', width: 200, render: (value) => {
      return value ? "是" : "否"
    }
  }
]

function App() {
  const tableRef = useRef(null);
  const [state, dispatch] = useReducer(appReducer, appInitialState);
  const [errorPriceMsg, setErrorPriceMsg] = React.useState(null);
  const rawData = useMemo(() => {
    return Datalist.map((item, idx) => {
      return {id: idx, ...item};
    })
  }, [])

  const {filteredData, categoryList} = useFilterAndSortData(rawData, state.filter, state.sort);

  const datasets = useMemo(() => {
    return filteredData.slice((state.page - 1) * state.pageSize, state.page * state.pageSize);
  }, [state.filter, state.sort, state.page, state.pageSize])

  useEffect(() => {
    dispatch({
      type: reducerAction.UPDATE_LAST_PAGE,
      payload: Math.ceil(filteredData.length / state.pageSize)
    })
  }, [datasets]);

  function onChangeSelectPerPage(evt) {
    const value = evt.currentTarget.value;
    dispatch({
      type: reducerAction.UPDATE_PAGE_SIZE,
      payload: +value
    })
  }

  function handleOnSubmitSearch(evt) {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);

    const getValueOrNull = (value) => value === '-1' ? null : value;

    const minPrice = +formData.get('minPrice');
    const maxPrice = +formData.get('maxPrice');
    if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
      setErrorPriceMsg('最低價格不可高於最高價格');
      return;
    }

    setErrorPriceMsg(null);
    dispatch({
      type: reducerAction.UPDATE_FILTER,
      payload: {
        searchText: formData.get('searchText').length === 0 ? null : formData.get('searchText'),
        category: getValueOrNull(formData.get('category')),
        priceRange: {
          min: isNaN(minPrice) ? 0 : +formData.get('minPrice'),
          max: isNaN(maxPrice) ? 0 : +formData.get('maxPrice')
        },
        inStock: getValueOrNull(formData.get('inStock')) === null ? null : formData.get('inStock') === "true",
      }
    });
  }

  function handlePrevPage() {
    dispatch({
      type: reducerAction.PREVIOUS_PAGE
    });
  }

  function handleNextPage() {
    dispatch({
      type: reducerAction.NEXT_PAGE
    });
  }

  function handleChangePage(pageNumber) {
    dispatch({
      type: reducerAction.UPDATE_PAGE,
      payload: pageNumber
    })
  }

  function handleSorting(sort) {
    dispatch({
      type: reducerAction.UPDATE_SORT,
      payload: sort
    })
  }

  function CardViewHeader() {
    return columns.filter(item => !!item.sorting).map((item, idx) => {
      return (
        <div key={idx}
             className="col-4 d-flex justify-content-between border border-1"
             onClick={() => {tableRef.current.ChangeSort(item)}}
        >
              <span>
                {item.label}
              </span>
              <span className="icon-size">
                {
                  state.sort.column !== item.field ?
                    <IconSort/>
                    :
                    state.sort.order === 'asc' ? <IconSortUp/> : <IconSortDown/>
                }
              </span>
        </div>
      )
    });
  }

  function Pagination() {
    const totalPages = state.lastPage;
    const currentPage = state.page;
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    let start = Math.max(currentPage - halfWindow, 1);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    const pageNumbers = [];
    if (currentPage > 3) {
      pageNumbers.push(
        <li key="first" className="page-item">
          <a className="page-link" onClick={() => handleChangePage(1)}>1</a>
        </li>
      );
    }
    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <li key={i} className={currentPage === i ? "page-item active" : "page-item"}>
          <a className="page-link" onClick={() => handleChangePage(i)}>{i}</a>
        </li>
      );
    }

    if (end < totalPages) {
      pageNumbers.push(
        <li key="last" className="page-item">
          <a className="page-link" onClick={() => handleChangePage(totalPages)}>{totalPages}</a>
        </li>
      );
    }

    return pageNumbers;
  }

  return (
    <div className="container">
      <form className="my-2 border border-3 p-1 rounded-2" onSubmit={handleOnSubmitSearch}>
        <label htmlFor="exampleFormControlInput1" className="form-label">搜尋商品</label>
        <input type="text" className="form-control" name='searchText' id="exampleFormControlInput1"
               placeholder="關鍵字"/>
        <div className="row my-2 gy-1">
          <div className="col-12 col-md-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">類別：</label>
            <select className="form-select" name="category" defaultValue={null}>
              <option value='-1'>請選擇類別</option>
              {
                categoryList.map((item, idx) => (
                  <option key={idx} value={item}>{item}</option>
                ))
              }
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">價格範圍</label>
            <div className="d-flex align-items-center justify-content-between">
              <input id="min-price" type={"number"} name="minPrice" className="form-control d-inline"
                     style={{width: "46%"}}/>
              <span className="mx-2">~</span>
              <input id="max-price" type={"number"} name="maxPrice" className="form-control d-inline"
                     style={{width: "46%"}}/>
            </div>
            {
              errorPriceMsg && (
                <div className="text-danger mt-1 invalid-feedback d-inline">{errorPriceMsg}</div>
              )
            }
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">是否有庫存</label>
            <select className="form-select" name="inStock" defaultValue={null}>
              <option value='-1'>請選擇是否有庫存</option>
              <option value="true">是</option>
              <option value="false">否</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">查詢</button>
      </form>
      <div style={{maxHeight: '50vh', overflowY: 'auto', overflowX: "hidden"}}>
        <Table className="d-none d-md-table w-100"
               columns={columns}
               datasets={datasets}
               onSort={handleSorting}
               ref={tableRef}
        />

        <div className="d-md-none">
          <div className="row mx-0 mb-1 sticky-top bg-white">
            <CardViewHeader/>
          </div>
          <div className="row text-center g-2">
            {
              datasets.map((item, idx) => {
                return <div key={idx} className="col-6">
                  <Card name={item.name} category={item.category} price={item.price} inStock={item.inStock}/>
                </div>
              })
            }
          </div>
        </div>
      </div>
      <div className="mt-4 mb-2 d-flex">
        <div className='col-12 d-flex align-items-center gap-2'>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item">
                <a className="page-link" onClick={handlePrevPage}>
                  <span className='icon-size-md icon-color-primary'>
                    <IconArrowLeft/>
                  </span>
                </a>
              </li>
              <Pagination />
              <li className="page-item">
                <a className="page-link" onClick={handleNextPage}>
                  <span className='icon-size-md icon-color-primary'>
                    <IconArrowRight/>
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          <select id='page-size' className='form-select form-select-sm border-primary text-primary w-150px custom-select-icon'
                  name='pageSize'
                  onChange={onChangeSelectPerPage}
                  value={state.pageSize}>
            <option value="10">10 列</option>
            <option value="20">20 列</option>
            <option value="30">30 列</option>
            <option value="50">50 列</option>
            <option value="100">100 列</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default App
