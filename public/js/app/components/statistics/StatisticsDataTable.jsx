import React from 'react'
import { Link } from 'react-router-dom'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import SortableDataTable, { useRowsPerPage } from './SortableDataTable'

const orderColumn = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function StatisticsDataTable({ data = [] }) {
  const [context] = useWebContext()
  const { languageIndex } = context
  const { statisticsLabels } = i18n.messages[languageIndex]
  const { sortableTable } = statisticsLabels
  const { statisticsDataColumns } = sortableTable
  const { readRowsPerPage, writeRowsPerPage } = useRowsPerPage('statisticsPage', 'EditableDataTableForStatistics', '50')

  const columns = [
    {
      name: statisticsDataColumns.year,
      selector: group => group.year,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.school,
      selector: group => group.school,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.institution,
      selector: group => group.institution,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.courseCode,
      selector: group => group.courseCode,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.linkedProgram,
      selector: group => group.linkedProgram,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.courseRoundNumber,
      selector: group => group.courseRoundNumber,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.semester,
      selector: group => group.semester,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.courseStart,
      selector: group => group.courseStart,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.publishDate,
      selector: group => group.publishDate,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
    {
      name: statisticsDataColumns.linkToCourse,
      selector: group => group.linkToCourse,
      sortable: true,
      wrap: true,
      sortFunction: orderColumn,
    },
  ]

  const buildLink = (link, kursPmName) => <Link to={`/users/${link}`}>{kursPmName}</Link>

  const tableData = data.map((d, index) => ({
    id: index,
    ...d,
    linkToCourse: d.linkToCourse ? buildLink(d.linkToCourse, d.courseCode + d.year + d.courseRoundNumber) : '',
  }))

  return tableData.length === 0 ? (
    <p>
      <i>{sortableTable.noDataMessage}</i>
    </p>
  ) : (
    <SortableDataTable
      columns={columns}
      data={tableData}
      rowsPerPage={readRowsPerPage()}
      onChangeRowsPerPage={writeRowsPerPage}
    ></SortableDataTable>
  )
}

export default StatisticsDataTable
