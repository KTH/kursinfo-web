import React from 'react'

import { useWebContext } from '../../context/WebContext'

function TableRow({ cellNames, cellsContent, bold = false }) {
  const [key] = cellsContent
  return (
    <tr key={key}>
      {cellsContent.map((content, index) => (
        <td key={`${cellNames[index]}-${key}`}>{bold ? <b>{content}</b> : content}</td>
      ))}
    </tr>
  )
}

function TableHeaderRow({ cellNames = [], labels = {} }) {
  return (
    <thead>
      <tr>
        {cellNames.map(cellName => (
          <th key={cellName}>{labels[cellName]}</th>
        ))}
      </tr>
    </thead>
  )
}

function TableContentRows({ cellNames, schools, getNumbersFn = () => [] }) {
  const schoolCodes = Object.keys(schools).sort()

  return schoolCodes.map(school => {
    const schoolNumbers = schools[school]
    if (school !== 'allSchools') {
      return <TableRow key={school} cellNames={cellNames} cellsContent={[school, ...getNumbersFn(schoolNumbers)]} />
    }
    return null
  })
}

function TableFooterRow({ cellNames, cellsContent }) {
  return (
    <tfoot>
      <TableRow cellNames={cellNames} cellsContent={cellsContent} bold />
    </tfoot>
  )
}

function TableSummary({ cellNames = [], docsPerSchool = {}, getNumbersFn = () => [], labels = {}, totalNumbers = [] }) {
  const [{ languageIndex }] = useWebContext()

  const { schools = {} } = docsPerSchool

  const schoolCodes = Object.keys(schools)

  return (
    <table className="table">
      <TableHeaderRow cellNames={['school', ...cellNames]} languageIndex={languageIndex} labels={labels} />
      <tbody>
        <TableContentRows cellNames={['school', ...cellNames]} schools={schools} getNumbersFn={getNumbersFn} />
      </tbody>
      {schoolCodes.length > 1 && (
        <TableFooterRow cellNames={['school', ...cellNames]} cellsContent={['Total', ...totalNumbers]} />
      )}
    </table>
  )
}

export { TableSummary }
