import React from 'react'
import DataTable from 'react-data-table-component'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'

const fontStyles = {
  fontFamily: 'Open Sans, Arial, Helvetica Neue, helvetica, sans-serif',
  fontSize: '1rem',
}

const customStyles = {
  headRow: {
    style: {
      backgroundColor: '#65656c',
      ...fontStyles,
      color: '#fff',
      fontWeight: 500,
    },
  },
  headCells: {
    style: {
      borderRight: '1px solid #fff',
      padding: '0.75rem',
      margin: '.5rem',
      ':last-of-type': {
        borderRight: '1px solid transparent',
      },
    },
  },
  rows: {
    style: {
      backgroundColor: '#f6f6f6',
      '&:not(:last-of-type)': {
        borderBottom: '1px solid #fff',
      },
      ...fontStyles,
    },
  },
  cells: {
    style: {
      borderRight: '2px solid transparent',
    },
  },
  pagination: {
    style: {
      ...fontStyles,
      color: '#000',
    },
  },
}

function SortableDataTable({ columns, data, rowsPerPage = 10, onChangeRowsPerPage = count => {} }) {
  const [context] = useWebContext()
  const { languageIndex } = context
  const { statisticsLabels } = i18n.messages[languageIndex]
  const { sortableTable } = statisticsLabels
  const opts = {
    rowsPerPageText: sortableTable.rowsPerPageText,
    rangeSeparatorText: sortableTable.rangeSeparatorText,
  }
  return (
    <div className={'form-group'}>
      <DataTable
        columns={columns}
        data={data}
        defaultSortFieldId={1}
        pagination
        paginationComponentOptions={opts}
        customStyles={customStyles}
        paginationRowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
        paginationPerPage={rowsPerPage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </div>
  )
}

/**
 * Ett enkelt sätt att spara användarens val av sidstorlek [i localStorage].
 * Vänligen ange ett app-specifikt prefix för att undvika namnkrockar.
 */
export const useRowsPerPage = (appPrefix, keyPrefix, defaultValue = '') => {
  const rowsPerPageKey = 'RowsPerPage'
  const readValue = key => {
    const storageKey = `${appPrefix}.${keyPrefix}.${key}`
    const value = localStorage.getItem(storageKey)
    return value || defaultValue
  }
  const writeValue = (key, value) => {
    const storageKey = `${appPrefix}.${keyPrefix}.${key}`
    if (value) {
      localStorage.setItem(storageKey, value)
    }
  }
  return {
    readRowsPerPage: () => parseInt(readValue(rowsPerPageKey) || '10'),
    writeRowsPerPage: count => writeValue(rowsPerPageKey, `${count}`),
  }
}

export default SortableDataTable
