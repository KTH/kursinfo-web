'use strict'

import { memosPerSchool } from './memos'

// offering and mathing memo for offering id 1
const offering_SF1625_202121 = {
  endDate: '2021-10-29',
  firstSemester: '20212',
  startDate: '2021-08-30',
  schoolMainCode: 'ABE',
  departmentName: 'ABE/Geoinformatik',
  connectedPrograms: 'TTGTM-2',
  courseCode: 'SF1625',
  offeringId: '1',
  period: 'P1',
}
const memo_SF1625_202121_base = (courseCode = 'SF1625') => ({
  courseCode,
  ladokRoundIds: ['1'],
  applicationCodes: ['1'],
  semester: '20212',
  memoEndPoint: `${courseCode}20212-1`,
  memoCommonLangAbbr: 'sv',
  memoName: courseCode + 'CMEDT1  (Startdatum 2021-08-30, Svenska)',
  isPdf: false,
  version: 1,
  lastChangeDate: 'Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)',
})
// offering and mathing memo for offering id 2
const offering_SF1625_202122 = {
  endDate: '2021-10-29',
  firstSemester: '20212',
  startDate: '2021-08-30',
  schoolMainCode: 'ABE',
  departmentName: 'ABE/Geoinformatik',
  connectedPrograms: '',
  courseCode: 'SF1625',
  offeringId: '2',
  period: 'P1',
}
const memo_SF1625_202122_base = (courseCode = 'SF1625') => ({
  courseCode,
  ladokRoundIds: ['2'],
  applicationCodes: ['2'],
  semester: '20212',
  memoEndPoint: `${courseCode}20212-2`,
  memoCommonLangAbbr: 'sv',
  memoName: courseCode + 'CDEPR1 m.fl.  (Startdatum 2021-08-30, Svenska)',
  isPdf: false,
  version: 1,
  lastChangeDate: 'Wed Oct 27 2021 12:14:32 GMT+0000 (Coordinated Universal Time)',
})

describe('Memos functions to count memos for one school', () => {
  test('One course (one offering) and this offering does not have memos', async () => {
    const offerings = [offering_SF1625_202121]

    const memos = []
    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(1)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.totalCourses).toBe(1)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfPdfMemos).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfWebMemos).toBe(0)
  })

  test('Remove course offering duplicate and count as 1 course, this offering does not have memos', async () => {
    const offerings = [offering_SF1625_202121, offering_SF1625_202121]

    const memos = []
    const { combinedMemosPerSchool } = await memosPerSchool(offerings, memos)
    expect(combinedMemosPerSchool).toMatchInlineSnapshot(`
      {
        "schools": {
          "ABE": {
            "numberOfCourses": 1,
            "numberOfMemosPublishedBeforeDeadline": 0,
            "numberOfMemosPublishedBeforeStart": 0,
            "numberOfUniqPdfMemos": 0,
            "numberOfUniqWebAndPdfMemos": 0,
            "numberOfUniqWebMemos": 0,
            "uniqueCourseCodeDates": [],
            "uniqueCourseCodeDatesWithoutMemo": [
              "SF1625-2021-08-30-2021-10-29",
            ],
          },
        },
        "totalCourses": 1,
        "totalNumberOfMemosPublishedBeforeDeadline": 0,
        "totalNumberOfMemosPublishedBeforeStart": 0,
        "totalNumberOfPdfMemos": 0,
        "totalNumberOfWebMemos": 0,
      }
    `)

    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.totalCourses).toBe(1)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfPdfMemos).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfWebMemos).toBe(0)
  })

  test('Remove duplicates for course offering with memo', async () => {
    const offerings = [offering_SF1625_202121, offering_SF1625_202121]
    const memos = [memo_SF1625_202121_base()]
    const { combinedMemosPerSchool } = await memosPerSchool(offerings, memos)

    expect(combinedMemosPerSchool).toMatchInlineSnapshot(`
      {
        "schools": {
          "ABE": {
            "numberOfCourses": 1,
            "numberOfMemosPublishedBeforeDeadline": 1,
            "numberOfMemosPublishedBeforeStart": 1,
            "numberOfUniqPdfMemos": 0,
            "numberOfUniqWebAndPdfMemos": 1,
            "numberOfUniqWebMemos": 1,
            "uniqueCourseCodeDates": [
              "SF1625-2021-08-30-2021-10-29",
            ],
            "uniqueCourseCodeDatesWithoutMemo": [],
          },
        },
        "totalCourses": 1,
        "totalNumberOfMemosPublishedBeforeDeadline": 1,
        "totalNumberOfMemosPublishedBeforeStart": 1,
        "totalNumberOfPdfMemos": 0,
        "totalNumberOfWebMemos": 1,
      }
    `)

    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.totalCourses).toBe(1)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.totalNumberOfWebMemos).toBe(1)
  })

  test('One course (one offering) with one memo which was published twice, first time before course start, second time after course start', async () => {
    const offerings = [offering_SF1625_202121]
    const dateBeforeCourseStart = 'Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)'
    const memos = [
      {
        ...memo_SF1625_202121_base(),
        version: 1,
        lastChangeDate: dateBeforeCourseStart,
      },
      {
        ...memo_SF1625_202121_base(),
        version: 2,
        lastChangeDate: 'Tue Sep 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)',
      },
    ]
    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(1)
    expect(offeringsWithMemos[0].courseMemoInfo.version).toBe(1)
    expect(offeringsWithMemos[0].courseMemoInfo.lastChangeDate).toBe(dateBeforeCourseStart)
    expect(offeringsWithMemos[0].courseMemoInfo.publishedData.publishedBeforeStart).toBe(true)

    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.totalCourses).toBe(1)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.totalNumberOfWebMemos).toBe(1)
  })

  test('One course (one offering) and this offering has a memo published before course start', async () => {
    const offerings = [offering_SF1625_202121]
    const memoPublishedBeforeCourseStart = {
      ...memo_SF1625_202121_base(),
      lastChangeDate: 'Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)',
    }
    const memos = [memoPublishedBeforeCourseStart]
    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(1)
    expect(offeringsWithMemos).toMatchInlineSnapshot(`
      [
        {
          "connectedPrograms": "TTGTM-2",
          "courseCode": "SF1625",
          "courseMemoInfo": {
            "applicationCodes": [
              "1",
            ],
            "courseCode": "SF1625",
            "isPdf": false,
            "ladokRoundIds": [
              "1",
            ],
            "lastChangeDate": "Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)",
            "memoCommonLangAbbr": "sv",
            "memoEndPoint": "SF162520212-1",
            "memoName": "SF1625CMEDT1  (Startdatum 2021-08-30, Svenska)",
            "publishedData": {
              "offeringStartTime": "2021-08-30",
              "publishedBeforeDeadline": true,
              "publishedBeforeStart": true,
              "publishedTime": "2021-08-02",
            },
            "semester": "20212",
            "version": 1,
          },
          "departmentName": "ABE/Geoinformatik",
          "endDate": "2021-10-29",
          "firstSemester": "20212",
          "offeringId": "1",
          "period": "P1",
          "schoolMainCode": "ABE",
          "startDate": "2021-08-30",
        },
      ]
    `)

    expect(combinedMemosPerSchool).toMatchInlineSnapshot(`
      {
        "schools": {
          "ABE": {
            "numberOfCourses": 1,
            "numberOfMemosPublishedBeforeDeadline": 1,
            "numberOfMemosPublishedBeforeStart": 1,
            "numberOfUniqPdfMemos": 0,
            "numberOfUniqWebAndPdfMemos": 1,
            "numberOfUniqWebMemos": 1,
            "uniqueCourseCodeDates": [
              "SF1625-2021-08-30-2021-10-29",
            ],
            "uniqueCourseCodeDatesWithoutMemo": [],
          },
        },
        "totalCourses": 1,
        "totalNumberOfMemosPublishedBeforeDeadline": 1,
        "totalNumberOfMemosPublishedBeforeStart": 1,
        "totalNumberOfPdfMemos": 0,
        "totalNumberOfWebMemos": 1,
      }
    `)
  })

  test('One course (one offering) and this offering has a memo published after course start', async () => {
    const offerings = [offering_SF1625_202121]
    const memoPublishedAfterCourseStart = {
      ...memo_SF1625_202121_base(),
      lastChangeDate: 'Tue Aug 31 2021 10:19:17 GMT+0000 (Coordinated Universal Time)',
    }
    const memos = [memoPublishedAfterCourseStart]
    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(1)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
  })

  test('One course (one offering) and this offering has a memo published after deadline but before course start', async () => {
    const offerings = [offering_SF1625_202121]
    const memoPublishedAfterCourseStart = {
      ...memo_SF1625_202121_base(),
      lastChangeDate: 'Tue Aug 29 2021 10:19:17 GMT+0000 (Coordinated Universal Time)',
    }
    const memos = [memoPublishedAfterCourseStart]
    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(1)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)
  })

  test('Two offerings (count as the same course) with two memos, count the one which has published datum before course', async () => {
    const dateBeforeCourseStart = 'Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)'
    const offerings = [offering_SF1625_202121, offering_SF1625_202122]

    const memos = [
      { ...memo_SF1625_202121_base(), lastChangeDate: dateBeforeCourseStart },
      { ...memo_SF1625_202122_base(), lastChangeDate: dateBeforeCourseStart },
    ]

    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)
  })

  test('Two offerings (count as the same course) with PDF memos', async () => {
    const offerings = [offering_SF1625_202121, offering_SF1625_202122]

    const memos = [
      { ...memo_SF1625_202121_base(), isPdf: true },
      { ...memo_SF1625_202122_base(), isPdf: true },
    ]

    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(1)
  })

  test('Two courses (count as different courses) with 2 memos', async () => {
    const offerings = [
      { ...offering_SF1625_202121, courseCode: 'BB1211' },
      { ...offering_SF1625_202122, courseCode: 'ALO221' },
    ]

    const memos = [memo_SF1625_202121_base('BB1211'), memo_SF1625_202122_base('ALO221')]

    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)
  })

  test('Two courses with identical start dates and same rounds(count as different courses) with 2 memos', async () => {
    const offerings = [
      { ...offering_SF1625_202121, courseCode: 'BB1211' },
      { ...offering_SF1625_202121, courseCode: 'ALO221' },
    ]

    const memos = [memo_SF1625_202121_base('BB1211'), memo_SF1625_202121_base('ALO221')]

    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)
  })

  test('Two courses (count as different courses) with PDF memos', async () => {
    const offerings = [
      { ...offering_SF1625_202121, courseCode: 'BB1211' },
      { ...offering_SF1625_202122, courseCode: 'ALO221' },
    ]

    const memos = [
      { ...memo_SF1625_202121_base('BB1211'), isPdf: true },
      { ...memo_SF1625_202122_base('ALO221'), isPdf: true },
    ]

    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(2)
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

    const memos = [
      { ...memo_SF1625_202121_base('BB1211'), isPdf: true },
      { ...memo_SF1625_202122_base('BB1211'), isPdf: true },
      { ...memo_SF1625_202122_base('ALO221') },
      { ...memo_SF1625_202121_base('QQD221') },
      { ...memo_SF1625_202122_base('QQD221') },
      { ...memo_SF1625_202121_base('IT7821') },
      { ...memo_SF1625_202122_base('An1221'), isPdf: true },
    ]

    const { combinedMemosPerSchool, offeringsWithMemos } = await memosPerSchool(offerings, memos)
    expect(offeringsWithMemos.length).toBe(7)
    expect(Object.keys(combinedMemosPerSchool.schools).length).toBe(4)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(1)

    expect(combinedMemosPerSchool.schools.ITM.numberOfCourses).toBe(2)
    expect(combinedMemosPerSchool.schools.ITM.numberOfUniqWebMemos).toBe(2)
    expect(combinedMemosPerSchool.schools.ITM.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.EECS.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.EECS.numberOfUniqWebMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.EECS.numberOfUniqPdfMemos).toBe(1)

    expect(combinedMemosPerSchool.schools.SCI.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.SCI.numberOfUniqWebMemos).toBe(0)
    expect(combinedMemosPerSchool.schools.SCI.numberOfUniqPdfMemos).toBe(0)
  })
})
