import React, { useState } from 'react'
import { Col, Row, Button } from 'reactstrap'
import * as xlsx from 'xlsx'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import SortableDataTable from './SortableDataTable'

function _getThisHost(thisHostBaseUrl) {
  return thisHostBaseUrl.slice(-1) === '/' ? thisHostBaseUrl.slice(0, -1) : thisHostBaseUrl
}

function _getCompletePeriod(period, semesterTranslationObject) {
  if (period === 'P0' || period === 'P5') {
    return semesterTranslationObject[0]
  } else if (period === 'P3' || period === 'P4') {
    return period + ', ' + semesterTranslationObject[1]
  } else {
    return period + ', ' + semesterTranslationObject[2]
  }
}

const buildLink = (link, textToShow) => (
  <a href={`${link}`} target="_blank" rel="noopener noreferrer">
    {textToShow}
  </a>
)

function _getDataRowsForCourseMemo(offeringsWithMemos, year, browserConfig, semesterTranslationObject) {
  const dataRows = []
  offeringsWithMemos.forEach(offering => {
    const departmentNames = offering.departmentName.split('/')
    const period = _getCompletePeriod(offering.period, semesterTranslationObject)
    const institution = departmentNames && departmentNames.length > 1 ? departmentNames[1] : offering.departmentName
    const offeringBase = {
      year,
      school: offering.schoolMainCode,
      institution,
      courseCode: offering.courseCode,
      linkedProgram: offering.connectedPrograms,
      applicationCode:
        offering.courseRoundApplications && offering.courseRoundApplications.length > 0
          ? offering.courseRoundApplications[0].course_round_application_code
          : '',
      period,
      courseStart: offering.startDate,
      publishDate: '',
      linkToCoursePM: '',
    }
    const hasMemo = offering.courseMemoInfo && Object.keys(offering.courseMemoInfo).length > 0
    let memoBase = {}
    if (hasMemo) {
      const { courseMemoFileName, isPdf, memoEndPoint, publishedData } = offering.courseMemoInfo
      const memoId = courseMemoFileName || memoEndPoint
      memoBase = {
        publishDate: publishedData.publishedTime,
        linkToCoursePM: isPdf
          ? buildLink(`${browserConfig.memoStorageUri}${memoId}`, `${memoId}`)
          : buildLink(`${_getThisHost(browserConfig.hostUrl)}/kurs-pm/${offering.courseCode}/${memoId}`, `${memoId}`),
      }
    }
    dataRows.push({ ...offeringBase, ...memoBase })
  })
  return dataRows
}

function _getDataRowsForCourseAnalysis(offeringsWithAnalysis, year, browserConfig) {
  const dataRows = []
  offeringsWithAnalysis.forEach(offering => {
    const departmentNames = offering.departmentName.split('/')
    const institution = departmentNames && departmentNames.length > 1 ? departmentNames[1] : offering.departmentName
    const offeringBase = {
      year,
      school: offering.schoolMainCode,
      institution,
      courseCode: offering.courseCode,
      linkedProgram: offering.connectedPrograms,
      applicationCode:
        offering.courseRoundApplications && offering.courseRoundApplications.length > 0
          ? offering.courseRoundApplications[0].course_round_application_code
          : '',
      term: offering.lastSemesterLabel,
      courseStartDate: offering.startDate,
      courseEndDate: offering.endDate,
      publishDate: '',
      linkToCourseAnalysis: '',
    }
    const hasAnalysis = offering.courseAnalysisInfo && Object.keys(offering.courseAnalysisInfo).length > 0
    let analysisBase = {}
    if (hasAnalysis) {
      const { analysisFileName, publishedDate } = offering.courseAnalysisInfo
      const analysisId = analysisFileName
      let publishDate = ''
      if (publishedDate && publishedDate !== '') {
        const date = new Date(publishedDate)
        publishDate =
          date.getFullYear() +
          '-' +
          (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) +
          '-' +
          (date.getDay() > 9 ? date.getDay() : '0' + date.getDay())
      }
      analysisBase = {
        publishDate,
        linkToCourseAnalysis: buildLink(`${browserConfig.analysisStorageUri}${analysisId}`, `${analysisId}`),
      }
    }
    dataRows.push({ ...offeringBase, ...analysisBase })
  })
  return dataRows
}

function _searchInDataByText(text, data) {
  if (text && text !== '') {
    const dataAfterSearch = []
    data.forEach(d => {
      Object.keys(d).forEach(key => {
        if (d[key]) {
          const value = d[key].toString()
          if (value.toLowerCase().includes(text.toLowerCase())) {
            dataAfterSearch.push(d)
          }
        }
      })
    })
    return dataAfterSearch
  } else {
    return data
  }
}

const NoDataMessage = ({ labels }) => (
  <p>
    <i>{labels.noDataMessage}</i>
  </p>
)
function StatisticsExport({ columnNames, columns, dataRows, fileName, sheetName, exportLabels, languageIndex }) {
  const wscols = [
    { wch: 10 },
    { wch: 20 },
    { wch: 10 },
    { wch: 50 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 50 },
  ]
  const exportDataTable = fileType => {
    if (dataRows.length > 0 && fileType) {
      const file = `${fileName}.${fileType}`
      const workSheetRows = []
      const linkToCourseColumnName =
        dataRows[0].linkToCoursePM !== undefined ? 'linkToCoursePM' : 'linkToCourseAnalysis'
      dataRows.forEach(dataRow => {
        const row = {}
        columns.forEach((column, index) => {
          if (
            fileType === 'csv' &&
            columnNames[index] === linkToCourseColumnName &&
            dataRow[linkToCourseColumnName] &&
            dataRow[linkToCourseColumnName] !== ''
          ) {
            row[column.name] = dataRow[columnNames[index]].props.href
          } else {
            row[column.name] = dataRow[columnNames[index]]
          }
        })
        workSheetRows.push(row)
      })
      const worksheet = xlsx.utils.json_to_sheet(workSheetRows)
      worksheet['!cols'] = wscols
      if (fileType === 'xlsx') {
        dataRows.forEach((row, index) => {
          if (row[linkToCourseColumnName] && row[linkToCourseColumnName] !== '') {
            worksheet[
              xlsx.utils.encode_cell({
                c: 9,
                r: index + 1,
              })
            ] = {
              f: `HYPERLINK("${row[linkToCourseColumnName].props.href}")`,
            }
          }
        })
      }
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName)
      xlsx.writeFile(workbook, file)
    }
  }

  return (
    <>
      <Col lg="4" md="4" xs="12" className={languageIndex === 0 ? 'margin-left-5' : 'margin-left-4'}>
        <Button color="btn btn-secondary margin-top-1-5" onClick={() => exportDataTable('csv')} className="float-right">
          {exportLabels.csv}
        </Button>
      </Col>
      <Col>
        <Button color="btn btn-secondary margin-top-1-5" onClick={() => exportDataTable('xlsx')}>
          {exportLabels.excel}
        </Button>
      </Col>
    </>
  )
}

function FilterTable({ onFilter, placeholder, searchLabel }) {
  return (
    <Col lg="4" md="4" sm="12">
      <label htmlFor="search">{searchLabel}</label>
      <input id="search" type="text" placeholder={placeholder} aria-label="Search Input" onChange={onFilter} />
    </Col>
  )
}

function StatisticsDataTable({ statisticsResult }) {
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [context] = useWebContext()
  const { languageIndex, browserConfig } = context
  const { statisticsLabels } = i18n.messages[languageIndex]
  const { sortableTable, exportLabels } = statisticsLabels
  const { statisticsDataColumns, courseMemo, courseAnalysis, semester: semesterTranslationObject } = sortableTable

  if (
    !statisticsResult ||
    (statisticsResult.offeringsWithMemos && statisticsResult.offeringsWithMemos.length === 0) ||
    (statisticsResult.offeringsWithAnalyses && statisticsResult.offeringsWithAnalyses.length === 0)
  )
    return <NoDataMessage labels={sortableTable} />

  const { year, offeringsWithMemos, periods = [], seasons = [], offeringsWithAnalyses } = statisticsResult
  const isMemoPage = offeringsWithMemos && offeringsWithMemos.length > 0 ? true : false
  const isAnalysisPage = offeringsWithAnalyses && offeringsWithAnalyses.length > 0 ? true : false

  let columnNames = []
  if (isMemoPage) {
    columnNames = [
      'year',
      'period',
      'school',
      'institution',
      'courseCode',
      'linkedProgram',
      'applicationCode',
      'courseStart',
      'publishDate',
      'linkToCoursePM',
    ]
  } else if (isAnalysisPage) {
    // prepare columns for analysis table
    columnNames = [
      'year',
      'term',
      'school',
      'institution',
      'courseCode',
      'linkedProgram',
      'applicationCode',
      'courseStartDate',
      'courseEndDate',
      'publishDate',
      'linkToCourseAnalysis',
    ]
  }
  const columns = columnNames.map(columnName => ({
    name: statisticsDataColumns[columnName],
    selector: group => group[columnName],
    sortable: true,
    wrap: true,
    minWidth: '137px',
  }))
  let dataRows = []
  if (isMemoPage) {
    dataRows = _getDataRowsForCourseMemo(offeringsWithMemos, year, browserConfig, semesterTranslationObject)
  } else if (isAnalysisPage) {
    dataRows = _getDataRowsForCourseAnalysis(offeringsWithAnalyses, year, browserConfig)
  }

  const [tableData, setTableData] = useState(
    dataRows.map((d, index) => ({
      id: index,
      ...d,
    }))
  )

  return (
    <>
      <h3>{isMemoPage ? courseMemo.header : courseAnalysis.header}</h3>
      <article key="statistics-memo-analysis-description">
        {isMemoPage ? courseMemo.details : courseAnalysis.details}
        <details>
          <summary className="white" style={{ paddingTop: '20px' }}>
            {isMemoPage ? courseMemo.sourceOfData : courseAnalysis.sourceOfData}
          </summary>
          <div className="padding-bottom-1">
            <Row>
              <FilterTable
                placeholder={sortableTable.search_placeholder}
                searchLabel={sortableTable.search_label}
                onFilter={e => {
                  if (e.target.value === '') {
                    setResetPaginationToggle(!resetPaginationToggle)
                  }
                  setTableData(
                    _searchInDataByText(e.target.value, dataRows).map((d, index) => ({
                      id: index,
                      ...d,
                    }))
                  )
                }}
              ></FilterTable>
              <StatisticsExport
                columnNames={columnNames}
                columns={columns}
                dataRows={dataRows}
                exportLabels={exportLabels}
                sheetName={isMemoPage ? `statistics-memos` : `statistics-analyses`}
                languageIndex={languageIndex}
                fileName={
                  isMemoPage
                    ? `course-information-statistics-memos-${year}-periods-${periods.join('-')}`
                    : `course-information-statistics-analyses-${year}-periods-${seasons.join('-')}`
                }
              ></StatisticsExport>
            </Row>
          </div>
          <SortableDataTable
            columns={columns}
            data={tableData}
            resetPaginationToggle={resetPaginationToggle}
            emptyTableMessage={sortableTable.noDataMessage}
          ></SortableDataTable>
        </details>
      </article>
    </>
  )
}

export default StatisticsDataTable
