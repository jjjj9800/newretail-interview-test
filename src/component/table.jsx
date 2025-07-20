import {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import IconSort from "./icon_sort.jsx";
import IconSortUp from "./icon_sort_up.jsx";
import IconSortDown from "./icon_sort_down.jsx";

const Table = forwardRef(function ({className, columns, datasets, onSort}, ref) {
  const [sorting, setSorting] = useState({column: null, order: null});

  useImperativeHandle(ref, () => ({
    ChangeSort: (column) => handleSorting(column),
  }));

  function handleSorting(selectColumn) {
    if (!selectColumn.sorting) {
      return;
    }

    setSorting((prev) => {
      if (prev.column === selectColumn.field) {
        switch (prev.order) {
          case 'asc':
            return {column: selectColumn.field, order: 'desc'};
          case 'desc':
            return {column: null, order: null};
          default:
            return {column: selectColumn.field, order: 'asc'};
        }
      }
      return {column: selectColumn.field, order: 'asc'};
    });
  }

  useEffect(() => {
    if (onSort) {
      onSort(sorting);
    }
  }, [sorting])

  return (
    <table className={className}>
      <thead>
      <tr>
        {
          columns.map(column => (
            <th key={column.key} className='table-header'>
              <div className="d-flex justify-content-between" onClick={() => handleSorting(column)}>
                <span>{column.label}</span>
                <span className={column.sorting ? "icon-size" : "d-none"}>
                    {
                      sorting.column !== column.field ?
                        <IconSort/>
                        :
                        sorting.order === 'asc' ? <IconSortUp/> : <IconSortDown/>
                    }
                  </span>
              </div>
            </th>
          ))
        }
      </tr>
      </thead>
      <tbody>
      {
        datasets.map((data, idx) => (
          <tr key={idx}>
            {
              columns.map((col, colIdx) => {
                const value = data[col.field];
                return (
                  <td key={`${colIdx}-${data.id}`} className={`border px-3`}
                      style={col.width ? {width: col.width} : {}}>
                    {col.render ? col.render(value, data) : (value ?? '')}
                  </td>
                );
              })
            }
          </tr>
        ))
      }
      </tbody>
    </table>
  )
})

export default Table;