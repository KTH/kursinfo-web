import React from 'react'
import { Col, Row, Button } from 'reactstrap'
import * as xlsx from 'xlsx'
import { useWebContext } from '../../context/WebContext'
import i18n from '../../../../../i18n'
import SortableDataTable, { useRowsPerPage } from './SortableDataTable'

function _getThisHost(thisHostBaseUrl) {
  return thisHostBaseUrl.slice(-1) === '/' ? thisHostBaseUrl.slice(0, -1) : thisHostBaseUrl
}

function isSpringTerm(term) {
  if (typeof term === 'number') {
    return term % 2 === 1
  }
  return term.slice(-1) === '1'
}

const buildLink = (link, textToShow) => <a href={`${link}`}>{textToShow}</a>

function _getDataRowsForCourseMemo(offeringsWithMemos, year, browserConfig, semesterTranslationObject) {
  const dataRows = []
  offeringsWithMemos.forEach(offering => {
    const departmentNames = offering.departmentName.split('/')
    const semester = isSpringTerm(offering.firstSemester) ? semesterTranslationObject[1] : semesterTranslationObject[2]
    const period = offering.period + ', ' + semester
    const institution = departmentNames && departmentNames.length > 1 ? departmentNames[1] : offering.departmentName
    const offeringBase = {
      year,
      school: offering.schoolMainCode,
      institution,
      courseCode: offering.courseCode,
      linkedProgram: offering.connectedPrograms,
      courseRoundNumber: offering.offeringId,
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
      courseRoundNumber: offering.offeringId,
      term: offering.lastSemesterLabel,
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

const NoDataMessage = ({ labels }) => (
  <p>
    <i>{labels.noDataMessage}</i>
  </p>
)
function StatisticsExport({ columnNames, columns, dataRows, fileName, sheetName, exportLabels }) {
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
      dataRows.forEach((row, index) => {
        if (row[linkToCourseColumnName] && row[linkToCourseColumnName] !== '' && fileType === 'xlsx') {
          worksheet[
            xlsx.utils.encode_cell({
              c: 9,
              r: index + 1,
            })
          ] = {
            f: `HYPERLINK("${row[linkToCourseColumnName].props.href}","${row[linkToCourseColumnName].props.children}")`,
          }
        }
      })
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName)
      xlsx.writeFile(workbook, file)
    }
  }

  return (
    <>
      <div className="padding-bottom-1">
        <Row>
          <Col lg="8" md="8" xs="12">
            <Button color="secondary" onClick={() => exportDataTable('csv')} className="float-right">
              {exportLabels.csv}
            </Button>
          </Col>
          <Col>
            <Button color="secondary" onClick={() => exportDataTable('xlsx')} className="float-right">
              {exportLabels.excel}
            </Button>
          </Col>
        </Row>
      </div>
    </>
  )
}

function StatisticsDataTable({ statisticsResult }) {
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

  const { readRowsPerPage, writeRowsPerPage } = useRowsPerPage('statisticsDPage', 'dataTableForStatistics', '10')

  let tableData = []
  let columnNames = []
  if (isMemoPage) {
    columnNames = [
      'year',
      'period',
      'school',
      'institution',
      'courseCode',
      'linkedProgram',
      'courseRoundNumber',
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
      'courseRoundNumber',
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
  }))
  let dataRows = []
  if (isMemoPage) {
    dataRows = _getDataRowsForCourseMemo(offeringsWithMemos, year, browserConfig, semesterTranslationObject)
  } else if (isAnalysisPage) {
    dataRows = _getDataRowsForCourseAnalysis(offeringsWithAnalyses, year, browserConfig)
  }

  tableData = dataRows.map((d, index) => ({
    id: index,
    ...d,
  }))

  return tableData.length === 0 ? (
    <NoDataMessage labels={sortableTable} />
  ) : (
    <>
      <h3>{isMemoPage ? courseMemo.header : courseAnalysis.header}</h3>
      <article key="statistics-memo-analysis-description">
        {isMemoPage ? courseMemo.details : courseAnalysis.details}
        <details>
          <summary className="white">{isMemoPage ? courseMemo.sourceOfData : courseAnalysis.sourceOfData}</summary>
          <StatisticsExport
            columnNames={columnNames}
            columns={columns}
            dataRows={dataRows}
            exportLabels={exportLabels}
            sheetName={isMemoPage ? `statistics-memos` : `statistics-analyses`}
            fileName={
              isMemoPage
                ? `course-information-statistics-memos-${year}-periods-${periods.join('-')}`
                : `course-information-statistics-analyses-${year}-periods-${seasons.join('-')}`
            }
          ></StatisticsExport>
          <SortableDataTable
            columns={columns}
            data={tableData}
            rowsPerPage={readRowsPerPage()}
            onChangeRowsPerPage={writeRowsPerPage}
          ></SortableDataTable>
        </details>
      </article>
    </>
  )
}

export default StatisticsDataTable
