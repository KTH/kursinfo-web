import React, { useState } from 'react'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import SortableDataTable, { useRowsPerPage } from './SortableDataTable'

function _getThisHost(thisHostBaseUrl) {
  return thisHostBaseUrl.slice(-1) === '/' ? thisHostBaseUrl.slice(0, -1) : thisHostBaseUrl
}

function StatisticsDataTable({ statisticsResult }) {
  const [context] = useWebContext()
  const { languageIndex, browserConfig } = context
  const { statisticsLabels } = i18n.messages[languageIndex]
  const { sortableTable } = statisticsLabels
  const { statisticsDataColumns } = sortableTable
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

  const buildLink = (link, textToShow) => <a href={`${link}`}>{textToShow}</a>

  if (statisticsResult && statisticsResult.offeringsWithMemos && statisticsResult.offeringsWithMemos.length > 0) {
    const dataRows = []
    statisticsResult.offeringsWithMemos.forEach(offeringWithMemos => {
      if (offeringWithMemos.courseMemoInfo && Object.keys(offeringWithMemos.courseMemoInfo).length > 0) {
        const { courseMemoFileName, memoEndPoint } = offeringWithMemos.courseMemoInfo
        const memoId = courseMemoFileName || memoEndPoint
        offeringWithMemos.courseMemoInfo.ladokRoundIds.forEach(roundId => {
          dataRows.push({
            year: statisticsResult.year,
            school: offeringWithMemos.schoolMainCode,
            institution: offeringWithMemos.departmentName,
            courseCode: offeringWithMemos.courseCode,
            linkedProgram: offeringWithMemos.connectedPrograms,
            courseRoundNumber: roundId,
            semester: offeringWithMemos.courseMemoInfo.semester,
            courseStart: offeringWithMemos.startDate,
            publishDate: offeringWithMemos.courseMemoInfo.offeringStartTime,
            linkToCourse: offeringWithMemos.courseMemoInfo.isPdf
              ? buildLink(browserConfig.memoStorageUri, `${offeringWithMemos.courseMemoInfo && memoId}`)
              : buildLink(
                  `${_getThisHost(browserConfig.hostUrl)}/kurs-pm/${offeringWithMemos.courseCode}/${
                    offeringWithMemos.courseMemoInfo && memoId
                  }`,
                  `${offeringWithMemos.courseMemoInfo && memoId}`
                ),
          })
        })
      } else {
        dataRows.push({
          year: statisticsResult.year,
          school: offeringWithMemos.schoolMainCode,
          institution: offeringWithMemos.departmentName,
          courseCode: offeringWithMemos.courseCode,
          linkedProgram: offeringWithMemos.connectedPrograms,
          courseRoundNumber: '',
          semester: offeringWithMemos.firstSemester,
          courseStart: offeringWithMemos.startDate,
          publishDate: '',
          linkToCourse: '',
        })
      }
    })
    tableData = dataRows.map((d, index) => ({
      id: index,
      ...d,
    }))
  }

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
