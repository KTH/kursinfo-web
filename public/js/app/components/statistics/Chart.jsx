import React from 'react'
import { Col, Row } from 'reactstrap'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory'
import { schools as schoolsLib } from './domain'

const colors = {
  blue: '#007FAE',
  green: '#62922E',
  grey: '#65656C',
  pink: '#D02F80',
  red: '#B52C17',
}
const schoolsColors = { ABE: colors.red, CBH: colors.grey, EECS: colors.green, ITM: colors.blue, SCI: colors.pink }

function countPercentage(numberOfCourses, numberOfDocs) {
  return (Math.abs(numberOfDocs) * 100) / Math.abs(numberOfCourses)
}

function getChartData(numberName, schools) {
  const schoolCodes = Object.keys(schools)

  return schoolCodes.map(school => {
    const schoolNumbers = schools[school]
    const { numberOfCourses } = schoolNumbers
    return {
      color: schoolsColors[school],
      school,
      percentage: countPercentage(numberOfCourses, schoolNumbers[numberName]),
    }
  })
}

function Charts({ chartNames, schools = {} }) {
  return (
    <Row>
      {chartNames.map(numberName => (
        <Col key={numberName}>
          <Chart data={getChartData(numberName, schools)} />
        </Col>
      ))}
    </Row>
  )
}

function Chart({ data = [] }) {
  return (
    <VictoryChart height={310} theme={VictoryTheme.material} domainPadding={20}>
      <VictoryAxis />
      <VictoryAxis dependentAxis tickFormat={label => `${label} %`} domain={[0, 100]} />
      <VictoryBar
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 },
        }}
        barRatio={data.length > 1 ? 0.3 : 2}
        data={data}
        domainPadding={20}
        labels={({ datum }) => {
          const { percentage = 0 } = datum
          return `${percentage.toFixed(1)}`
        }}
        height={300}
        width={300}
        x="school"
        y="percentage"
        style={{
          data: {
            fill: ({ datum }) => datum.color,
          },
        }}
      />
    </VictoryChart>
  )
}

export { Chart, Charts }
