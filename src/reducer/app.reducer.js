export const reducerAction = {
  NEXT_PAGE: 'nextPage',
  PREVIOUS_PAGE: 'prevPage',
  UPDATE_PAGE: 'changePage',
  UPDATE_LAST_PAGE: 'updateLastPage',
  UPDATE_PAGE_SIZE: 'changePageSize',
  UPDATE_FILTER: 'changeFilter',
  UPDATE_SORT: 'changeSort',
}

export const appReducer = (state, action) => {
  const {type, payload} = action
  switch (type) {
    case reducerAction.NEXT_PAGE: {
      let newPage = state.page + 1;
      if (newPage > state.lastPage) {
        newPage = state.lastPage;
      }
      return {...state, page: newPage}
    }
    case reducerAction.PREVIOUS_PAGE: {
      let newPage = state.page - 1;
      if (newPage <= 0) {
        newPage = 1;
      }
      return {...state, page: newPage}
    }
    case reducerAction.UPDATE_PAGE:
      return {...state, page: payload};
    case reducerAction.UPDATE_LAST_PAGE:
      return {...state, lastPage: payload};
    case reducerAction.UPDATE_PAGE_SIZE:
      return {...state, page: 1, pageSize: payload}
    case reducerAction.UPDATE_FILTER:
      return {...state, page: 1, filter: payload}
    case reducerAction.UPDATE_SORT:
      return {...state, sort: payload}
    default:
      return state;
  }
}

export const appInitialState = {
  page: 1,
  pageSize: 10,
  lastPage: 100,
  filter: {
    searchText: null,
    category: null,
    priceRange: {
      min: 0,
      max: 0
    },
    inStock: null
  },
  sort: {
    column: null,
    order: null,
  }
}