import {useMemo} from "react";
import objectArraySorting from "../utils/objectSort.jsx";

export const useFilterAndSortData = (data, filter, sort) => {
  return useMemo(() => {
    let filteredData = data;
    const categoryList = [...new Set(filteredData.map(item => item.category))];

    if (filter.searchText) {
      filteredData = filteredData.filter(item => item.name.toLowerCase().includes(filter.searchText.toLowerCase()));
    }

    if (filter.category !== null) {
      filteredData = filteredData.filter((item) => item.category === filter.category)
    }

    if (filter.inStock !== null) {
      filteredData = filteredData.filter((item) => item.inStock === filter.inStock)
    }

    const {min, max} = filter.priceRange
    if (min >= 0 && max > 0) {
      filteredData = filteredData.filter((item) => item.price >= min && item.price <= max);
    }

    if (sort.column !== null && sort.order !== null) {
      filteredData = objectArraySorting(filteredData, sort);
    } else {
      filteredData = objectArraySorting(filteredData, {column: 'id', order: 'asc'});
    }

    return {filteredData, categoryList};
  }, [data, filter, sort]);
}