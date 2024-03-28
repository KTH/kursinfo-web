import React from 'react'
import DataTable from 'react-data-table-component'
import { Col, Row } from 'reactstrap'
import { useLanguage } from '../../hooks/useLanguage'

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
      padding: '0.75rem',
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

const NoDataMessage = ({ message }) => (
  <p>
    <i>{message}</i>
  </p>
)

function SortableDataTable({ columns, data, resetPaginationToggle, emptyTableMessage }) {
  const {
    translation: { statisticsLabels },
  } = useLanguage()
  const { sortableTable } = statisticsLabels
  const opts = {
    rowsPerPageText: sortableTable.rowsPerPageText,
    rangeSeparatorText: sortableTable.rangeSeparatorText,
  }
  return (
    <Row>
      <Col>
        <div className={'form-group'}>
          <DataTable
            noDataComponent={<NoDataMessage message={emptyTableMessage}></NoDataMessage>}
            columns={columns}
            data={data}
            defaultSortFieldId={1}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            paginationComponentOptions={opts}
            customStyles={customStyles}
            paginationRowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
          />
        </div>
      </Col>
    </Row>
  )
}

export default SortableDataTable
