export default function objectArraySorting(data, sort) {
  return data.sort((a, b) => {
    const {column, order} = sort
    const valueA = a[column];
    const valueB = b[column];

    const result = typeof valueA === 'string' && typeof valueB === 'string'
      ? valueA.localeCompare(valueB, undefined, {numeric: true})
      : valueA - valueB;

    return order === 'asc' ? result : -result;
  });
}
