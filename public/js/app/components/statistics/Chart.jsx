import React from 'react'
import { Col, Row } from 'reactstrap'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTheme } from 'victory'
import i18n from '../../../../../i18n'
import { schools as schoolsLib } from './domain'

const colors = {
  blue: '#007FAE',
  green: '#62922E',
  grey: '#65656C',
  pink: '#D02F80',
  red: '#B52C17',
  yellow: '#fab919',
}
const schoolsColors = {
  ABE: colors.red,
  CBH: colors.grey,
  EECS: colors.green,
  ITM: colors.blue,
  SCI: colors.pink,
  allSchools: colors.yellow,
}

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

function Charts({ chartNames = [], languageIndex = 1, schools = {} }) {
  const { chartsLabels: labels } = i18n.messages[languageIndex].statisticsLabels
  return (
    <Row>
      {chartNames.map(numberName => (
        <Col key={numberName} xs="4" style={{ paddingRight: 0, paddingLeft: 0 }}>
          <Chart data={getChartData(numberName, schools)} label={labels[numberName]} languageIndex={languageIndex} />
        </Col>
      ))}
    </Row>
  )
}

function Chart({ data = [], label = '', languageIndex }) {
  const { allSchools } = i18n.messages[languageIndex].statisticsLabels
  const styles = {
    font: { fontFamily: 'Open Sans', fontSize: '16px' },
  }
  const tickLable = allSchools.split(' ').join('\n')
  schoolsLib.ORDERED_SCHOOLS[schoolsLib.ORDERED_SCHOOLS.indexOf('allSchools')] = tickLable
  // const formatLabel = t => (t === 'All schools' ? tickLable : t)

  return (
    <VictoryChart height={405} width={405} theme={VictoryTheme.material} domainPadding={20} style={styles.font}>
      <VictoryLabel x={4} y={24} text={label} style={styles.font} />
      {data.length > 1 ? (
        <VictoryAxis
          tickValues={schoolsLib.ORDERED_SCHOOLS}
          style={{
            tickLabels: styles.font,
          }}
          /*  tickFormat={t => formatLabel(t)} */
        />
      ) : (
        <VictoryAxis />
      )}
      <VictoryAxis
        dependentAxis
        tickValues={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        tickFormat={tickLabel => `${tickLabel} %`}
        style={{
          tickLabels: { fontFamily: styles.font.fontFamily },
        }}
        domain={[0, 100]}
      />
      <VictoryBar
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 },
        }}
        barRatio={data.length > 1 ? 0.6 : 2}
        data={data}
        domainPadding={50}
        labels={({ datum }) => {
          const { percentage = 0 } = datum
          return `${Math.round(percentage * 10) / 10} %`
        }}
        height={400}
        width={400}
        x="school"
        y="percentage"
        style={{
          data: {
            fill: ({ datum }) => datum.color,
            fontFamily: styles.font.fontFamily,
          },
          labels: { fontFamily: styles.font.fontFamily, fontWeight: 700, wordSpacing: '-2px' },
        }}
      />
    </VictoryChart>
  )
}

export { Chart, Charts }
