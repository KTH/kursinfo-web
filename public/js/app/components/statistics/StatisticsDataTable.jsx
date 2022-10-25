import React from 'react'
import { Col, Row, Button } from 'reactstrap'
import * as xlsx from 'xlsx'
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
  const { sortableTable, exportLabels } = statisticsLabels
  const { statisticsDataColumns } = sortableTable

  // TODO: adapt for memos and for analyses switch
  if (!statisticsResult || !statisticsResult.offeringsWithMemos || statisticsResult.offeringsWithMemos.length === 0)
    return <NoDataMessage labels={sortableTable} />

  const { year, offeringsWithMemos, periods } = statisticsResult

  const { readRowsPerPage, writeRowsPerPage } = useRowsPerPage('statisticsDPage', 'dataTableForStatistics', '10')

  let tableData = []
  const columnNames = [
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
  const columns = columnNames.map(columnName => ({
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

  const exportDataTable = fileType => {
    if (dataRows.length > 0 && fileType) {
      const wscols = [
        { wch: 10 },
        { wch: 10 },
        { wch: 50 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 50 },
      ]
      const sheetName = `course-information-statistics-memos-${year}-periods-${periods.join('-')}`
      const fileName = `${sheetName}.${fileType}`
      const workSheetRows = []
      dataRows.forEach(dataRow => {
        const row = {}
        columns.forEach((column, index) => {
          if (
            fileType === 'csv' &&
            columnNames[index] === 'linkToCourse' &&
            dataRow.linkToCourse &&
            dataRow.linkToCourse !== ''
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
        if (row.linkToCourse && row.linkToCourse !== '' && fileType === 'xlsx') {
          worksheet[
            xlsx.utils.encode_cell({
              c: 9,
              r: index + 1,
            })
          ] = {
            f: `HYPERLINK("${row.linkToCourse.props.href}","${row.linkToCourse.props.children}")`,
          }
        }
      })
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, sheetName)
      xlsx.writeFile(workbook, fileName)
    }
  }

  return tableData.length === 0 ? (
    <NoDataMessage labels={sortableTable} />
  ) : (
    <>
      <h3>{sortableTable.pageHeader}</h3>
      <article key="statistics-memo-description">
        {sortableTable.pageDetails}
        <details>
          <summary className="white">{sortableTable.sourceOfData}</summary>
          <Row>
            <Col
              md={{
                offset: 5,
                size: 'auto',
              }}
              lg={{
                offset: 5,
                size: 'auto',
              }}
              sm="12"
              xs="12"
            >
              <Button color="secondary" onClick={() => exportDataTable('csv')}>
                {exportLabels.csv}
              </Button>
            </Col>
            <Col>
              <Button color="secondary" onClick={() => exportDataTable('xlsx')}>
                {exportLabels.excel}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <SortableDataTable
                columns={columns}
                data={tableData}
                rowsPerPage={readRowsPerPage()}
                onChangeRowsPerPage={writeRowsPerPage}
              ></SortableDataTable>
            </Col>
          </Row>
        </details>
      </article>
    </>
  )
}

export default StatisticsDataTable
