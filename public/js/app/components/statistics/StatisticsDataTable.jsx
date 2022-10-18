import React from 'react'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import SortableDataTable, { useRowsPerPage } from './SortableDataTable'

function _getThisHost(thisHostBaseUrl) {
  return thisHostBaseUrl.slice(-1) === '/' ? thisHostBaseUrl.slice(0, -1) : thisHostBaseUrl
}

const buildLink = (link, textToShow) => <a href={`${link}`}>{textToShow}</a>
const NoDataMessage = ({ labels }) => (
  <p>
    <i>{labels.noDataMessage}</i>
  </p>
)
function StatisticsDataTable({ statisticsResult }) {
  const [context] = useWebContext()
  const { languageIndex, browserConfig } = context
  const { statisticsLabels } = i18n.messages[languageIndex]
  const { sortableTable } = statisticsLabels
  const { statisticsDataColumns } = sortableTable

  // TODO: adapt for memos and for analyses switch
  if (!statisticsResult || !statisticsResult.offeringsWithMemos || statisticsResult.offeringsWithMemos.length === 0)
    return <NoDataMessage labels={sortableTable} />

  const { year, offeringsWithMemos } = statisticsResult

  const { readRowsPerPage, writeRowsPerPage } = useRowsPerPage('statisticsPage', 'EditableDataTableForStatistics', '10')
  let tableData = []
  const columnsNames = [
    'year',
    'school',
    'institution',
    'courseCode',
    'linkedProgram',
    'courseRoundNumber',
    'semester',
    'courseStart',
    'publishDate',
    'linkToCourse',
  ]
  const columns = columnsNames.map(columnName => ({
    name: statisticsDataColumns[columnName],
    selector: group => group[columnName],
    sortable: true,
    wrap: true,
  }))

  const dataRows = []
  offeringsWithMemos.forEach(offering => {
    const offeringBase = {
      year,
      school: offering.schoolMainCode,
      institution: offering.departmentName,
      courseCode: offering.courseCode,
      linkedProgram: offering.connectedPrograms,
      courseRoundNumber: offering.offeringId,
      semester: offering.firstSemester,
      courseStart: offering.startDate,
      publishDate: '',
      linkToCourse: '',
    }
    const hasMemo = offering.courseMemoInfo && Object.keys(offering.courseMemoInfo).length > 0
    let memoBase = {}
    if (hasMemo) {
      const { courseMemoFileName, isPdf, memoEndPoint, publishedData } = offering.courseMemoInfo
      const memoId = courseMemoFileName || memoEndPoint
      memoBase = {
        publishDate: publishedData.publishedTime,
        linkToCourse: isPdf
          ? buildLink(`${browserConfig.memoStorageUri}${memoId}`, `${memoId}`)
          : buildLink(`${_getThisHost(browserConfig.hostUrl)}/kurs-pm/${offering.courseCode}/${memoId}`, `${memoId}`),
      }
    }

    dataRows.push({ ...offeringBase, ...memoBase })
  })
  tableData = dataRows.map((d, index) => ({
    id: index,
    ...d,
  }))

  return tableData.length === 0 ? (
    <NoDataMessage labels={sortableTable} />
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
