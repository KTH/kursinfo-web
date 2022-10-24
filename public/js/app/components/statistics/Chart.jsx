import React from 'react'
// import ReactDOM from 'react-dom'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory'

// const data = [
//   { school: 'ABE', documents: 7 },
//   //   { quarter: 2, earnings: 16500 },
//   //   { quarter: 3, earnings: 14250 },
//   //   { quarter: 4, earnings: 19000 },
// ]

function countPercentage(numberOfCourses, numberOfDocs) {
  return (Math.abs(numberOfDocs) * 100) / Math.abs(numberOfCourses)
}

function getChartData(numberName, schools) {
  const schoolCodes = Object.keys(schools)

  return schoolCodes.map(school => {
    const schoolNumbers = schools[school]
    return { school, documents: schoolNumbers[numberName] }
  })
}

function Charts({ chartNames, schools = {} }) {
  const { numberOfCourses } = schools

  return (
    <>
      {chartNames.map(numberName => (
        <Chart key={numberName} numberOfCourses={numberOfCourses} data={getChartData(numberName, schools)} />
      ))}
    </>
  )
}

function Chart({ numberOfCourses = 0, data = {} }) {
  // domain={[0, 100]}
  //    width={400}
  // height={400}
  return (
    <VictoryChart theme={VictoryTheme.material}>
      {/* tickFormat={schoolsNames}  || tickValues={schoolsNames}*/}
      <VictoryAxis />
      <VictoryAxis
        dependentAxis
        tickFormat={numberOfDocs => `${countPercentage(numberOfCourses, numberOfDocs)} %`}
        domain={[0, 100]}
      />
      <VictoryBar data={data} x="school" y="documents" />
    </VictoryChart>
  )
}

export { Charts }
