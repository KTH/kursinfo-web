'use strict'

import { analysesPerSchool } from './analyses'

// offering and mathing analysis for offering id 1
const offering_SF1625_202121 = {
  endDate: '2022-10-29', // end date of an offering
  firstSemester: '20212', // start semester of a course
  startDate: '2022-08-30', // start date of an offering
  schoolMainCode: 'ABE',
  departmentName: 'ABE/Geoinformatik',
  connectedPrograms: 'TTGTM-2',
  courseCode: 'SF1625',
  offeringId: '1',
  period: 'P1',
}
const analysis_SF1625_202121_base = (courseCode = 'SF1625') => ({
  courseCode,
  roundIdList: '1',
  semester: '20212',
  analysisFileName: `analysis-${courseCode}20212-1.pdf`,
  publishedDate: '2020-06-25T08:44:50.77Z',
})
// offering and mathing analysis for offering id 2
const offering_SF1625_202122 = {
  endDate: '2022-10-29',
  firstSemester: '20212',
  startDate: '2022-08-30',
  schoolMainCode: 'ABE',
  departmentName: 'ABE/Geoinformatik',
  connectedPrograms: '',
  courseCode: 'SF1625',
  offeringId: '2',
  period: 'P1',
}
const analysis_SF1625_202122_base = (courseCode = 'SF1625') => ({
  courseCode,
  roundIdList: '2',
  semester: '20212',
  analysisFileName: `analysis-${courseCode}20212-2.pdf`,
  publishedDate: '2020-06-25T08:44:50.77Z',
})

describe('Memos functions to count analyses for one school', () => {
  test('One course (one offering) and this offering does not have analyses', async () => {
    const offerings = [offering_SF1625_202121]

    const analyses = []
    const { combinedAnalysesPerSchool, offeringsWithAnalyses } = await analysesPerSchool(offerings, analyses)
    expect(offeringsWithAnalyses.length).toBe(1)
    expect(Object.keys(combinedAnalysesPerSchool.schools).length).toBe(1)
    expect(combinedAnalysesPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedAnalysesPerSchool.totalCourses).toBe(1)

    expect(combinedAnalysesPerSchool.schools.ABE.numberOfUniqAnalyses).toBe(0)
    expect(combinedAnalysesPerSchool.totalUniqPublishedAnalyses).toBe(0)
  })

  test('Two courses (count as different courses) with 2 analyses', async () => {
    const offerings = [
      { ...offering_SF1625_202121, courseCode: 'BB1211' },
      { ...offering_SF1625_202122, courseCode: 'ALO221' },
    ]

    const analyses = [analysis_SF1625_202121_base('BB1211'), analysis_SF1625_202122_base('ALO221')]

    const { combinedAnalysesPerSchool, offeringsWithAnalyses } = await analysesPerSchool(offerings, analyses)
    expect(offeringsWithAnalyses.length).toBe(2)
    expect(Object.keys(combinedAnalysesPerSchool.schools).length).toBe(1)
    expect(combinedAnalysesPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedAnalysesPerSchool.schools.ABE.numberOfUniqAnalyses).toBe(2)
  })

  test('Two courses with identical start dates and same rounds (count as different courses) with 2 analyses', async () => {
    const offerings = [
      { ...offering_SF1625_202121, courseCode: 'BB1211' },
      { ...offering_SF1625_202121, courseCode: 'ALO221' },
    ]

    const analyses = [analysis_SF1625_202121_base('BB1211'), analysis_SF1625_202121_base('ALO221')]

    const { combinedAnalysesPerSchool, offeringsWithAnalyses } = await analysesPerSchool(offerings, analyses)
    expect(offeringsWithAnalyses.length).toBe(2)
    expect(Object.keys(combinedAnalysesPerSchool.schools).length).toBe(1)
    expect(combinedAnalysesPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedAnalysesPerSchool.schools.ABE.numberOfUniqAnalyses).toBe(2)
  })

  test('Several schools', async () => {
    const offerings = [
      { ...offering_SF1625_202121, courseCode: 'BB1211', schoolMainCode: 'ABE' },
      { ...offering_SF1625_202122, courseCode: 'BB1211', schoolMainCode: 'ABE' },
      { ...offering_SF1625_202122, courseCode: 'ALO221', schoolMainCode: 'ABE' },
      { ...offering_SF1625_202121, courseCode: 'QQD221', schoolMainCode: 'ITM' },
      { ...offering_SF1625_202121, courseCode: 'IT7821', schoolMainCode: 'ITM' },
      { ...offering_SF1625_202122, courseCode: 'An1221', schoolMainCode: 'EECS' },
      { ...offering_SF1625_202122, courseCode: 'SCI221', schoolMainCode: 'SCI' },
    ]

    const analyses = [
      { ...analysis_SF1625_202121_base('BB1211') },
      { ...analysis_SF1625_202122_base('BB1211') },
      { ...analysis_SF1625_202122_base('ALO221') },
      { ...analysis_SF1625_202121_base('QQD221') },
      { ...analysis_SF1625_202122_base('QQD221') },
      { ...analysis_SF1625_202121_base('IT7821') },
      { ...analysis_SF1625_202122_base('An1221') },
    ]

    const { combinedAnalysesPerSchool, offeringsWithAnalyses } = await analysesPerSchool(offerings, analyses)
    expect(offeringsWithAnalyses.length).toBe(7)
    expect(Object.keys(combinedAnalysesPerSchool.schools).length).toBe(4)
    expect(combinedAnalysesPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedAnalysesPerSchool.schools.ABE.numberOfUniqAnalyses).toBe(2)
    expect(combinedAnalysesPerSchool.schools.ABE).toMatchInlineSnapshot(`
      {
        "numberOfCourses": 2,
        "numberOfUniqAnalyses": 2,
        "uniqueCourseCodeDates": [
          "BB1211-2022-08-30-2022-10-29",
          "ALO221-2022-08-30-2022-10-29",
        ],
        "uniqueCourseCodeDatesWithoutAnalysis": [],
      }
    `)

    expect(combinedAnalysesPerSchool.schools.ITM.numberOfCourses).toBe(2)
    expect(combinedAnalysesPerSchool.schools.ITM.numberOfUniqAnalyses).toBe(2)
    expect(combinedAnalysesPerSchool.schools.ITM).toMatchInlineSnapshot(`
      {
        "numberOfCourses": 2,
        "numberOfUniqAnalyses": 2,
        "uniqueCourseCodeDates": [
          "QQD221-2022-08-30-2022-10-29",
          "IT7821-2022-08-30-2022-10-29",
        ],
        "uniqueCourseCodeDatesWithoutAnalysis": [],
      }
    `)

    expect(combinedAnalysesPerSchool.schools.EECS.numberOfCourses).toBe(1)
    expect(combinedAnalysesPerSchool.schools.EECS.numberOfUniqAnalyses).toBe(1)
    expect(combinedAnalysesPerSchool.schools.EECS).toMatchInlineSnapshot(`
      {
        "numberOfCourses": 1,
        "numberOfUniqAnalyses": 1,
        "uniqueCourseCodeDates": [
          "An1221-2022-08-30-2022-10-29",
        ],
        "uniqueCourseCodeDatesWithoutAnalysis": [],
      }
    `)

    expect(combinedAnalysesPerSchool.schools.SCI.numberOfCourses).toBe(1)
    expect(combinedAnalysesPerSchool.schools.SCI.numberOfUniqAnalyses).toBe(0)
    expect(combinedAnalysesPerSchool.schools.SCI).toMatchInlineSnapshot(`
      {
        "numberOfCourses": 1,
        "numberOfUniqAnalyses": 0,
        "uniqueCourseCodeDates": [],
        "uniqueCourseCodeDatesWithoutAnalysis": [
          "SCI221-2022-08-30-2022-10-29",
        ],
      }
    `)
  })
})
