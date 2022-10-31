'use strict'

import { countMemosDataPerSchool } from './memos'

const offering1WithDates = ({ dates = {}, courseCode = 'SF1625', memoValues = {}, offeringValues = {} } = {}) => ({
  connectedPrograms: 'TTGTM-2',
  courseCode,
  courseMemoInfo: {
    courseCode,
    isPdf: false,
    ladokRoundIds: ['1'],
    lastChangeDate: 'Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)',
    memoCommonLangAbbr: 'sv',
    memoEndPoint: `${courseCode}20212-1`,
    memoName: 'CMEDT1  (Startdatum 2021-08-30, Svenska)',
    publishedData: {
      offeringStartTime: '2021-08-30',
      publishedBeforeDeadline: true,
      publishedBeforeStart: true,
      publishedTime: '2021-08-02',
      ...dates,
    },
    semester: '20212',
    version: 1,
    ...memoValues,
  },
  departmentName: 'ABE/Geoinformatik',
  endDate: '2021-10-29',
  firstSemester: '20212',
  offeringId: '1',
  period: 'P1',
  schoolMainCode: 'ABE',
  startDate: '2021-08-30',
  ...offeringValues,
})

describe('Count memos and courses for one course offering for the same school ABE', () => {
  test('One course (one offering) and this offering has a memo published before course start', async () => {
    const offeringsWithMemos = [offering1WithDates()]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(1)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(1)

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
    const offeringsWithMemos = [
      offering1WithDates({
        dates: { publishedBeforeDeadline: false, publishedBeforeStart: false, publishedTime: '2021-08-31' },
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(0)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(0)

    expect(combinedMemosPerSchool).toMatchInlineSnapshot(`
      {
        "schools": {
          "ABE": {
            "numberOfCourses": 1,
            "numberOfMemosPublishedBeforeDeadline": 0,
            "numberOfMemosPublishedBeforeStart": 0,
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
        "totalNumberOfMemosPublishedBeforeDeadline": 0,
        "totalNumberOfMemosPublishedBeforeStart": 0,
        "totalNumberOfPdfMemos": 0,
        "totalNumberOfWebMemos": 1,
      }
    `)
  })

  test('One course (one offering) and this offering has a memo published after deadline but before course start', async () => {
    const offeringsWithMemos = [
      offering1WithDates({
        dates: { publishedBeforeDeadline: false, publishedBeforeStart: true, publishedTime: '2021-08-27' },
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool).toMatchInlineSnapshot(`
      {
        "schools": {
          "ABE": {
            "numberOfCourses": 1,
            "numberOfMemosPublishedBeforeDeadline": 0,
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
        "totalNumberOfMemosPublishedBeforeDeadline": 0,
        "totalNumberOfMemosPublishedBeforeStart": 1,
        "totalNumberOfPdfMemos": 0,
        "totalNumberOfWebMemos": 1,
      }
    `)
  })
})

describe('Count memos and courses as one for one course with two course offerings starting at the same time', () => {
  test('One course (two offerings) and offerings has the same memo published before course start', async () => {
    const offeringsWithMemos = [
      offering1WithDates({ memoValues: { ladokRoundIds: ['1', '2'] }, offeringValues: { offeringId: '1' } }),
      offering1WithDates({ memoValues: { ladokRoundIds: ['1', '2'] }, offeringValues: { offeringId: '2' } }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(1)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(1)

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
  test('One course (two offerings) and offerings has two different memos published before course start', async () => {
    const offeringsWithMemos = [
      offering1WithDates({ memoValues: { ladokRoundIds: ['1'] }, offeringValues: { offeringId: '1' } }),
      offering1WithDates({ memoValues: { ladokRoundIds: ['2'] }, offeringValues: { offeringId: '2' } }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(1)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(1)

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

  test('One course (two offerings) and offerings has the same memo published after course start', async () => {
    const publishedAfterCourseDates = {
      publishedBeforeDeadline: false,
      publishedBeforeStart: false,
      publishedTime: '2021-08-31',
    }
    const offeringsWithMemos = [
      offering1WithDates({
        dates: publishedAfterCourseDates,
        memoValues: { ladokRoundIds: ['1', '2'] },
        offeringValues: { offeringId: '2' },
      }),
      offering1WithDates({
        dates: publishedAfterCourseDates,
        memoValues: { ladokRoundIds: ['1', '2'] },
        offeringValues: { offeringId: '1' },
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(1)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(0)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(0)
  })

  test('One course (two offerings) and offerings has diff memos published after deadline but before course start', async () => {
    const datesAfterDeadlineBeforeStart = {
      publishedBeforeDeadline: false,
      publishedBeforeStart: true,
      publishedTime: '2021-08-27',
    }
    const offeringsWithMemos = [
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
        memoValues: { ladokRoundIds: ['2'] },
        offeringValues: { offeringId: '2' },
      }),
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
        memoValues: { ladokRoundIds: ['4'] },
        offeringValues: { offeringId: '4' },
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(1)
  })
  test('One course (two offerings) and offerings has the same memo published after deadline but before course start', async () => {
    const datesAfterDeadlineBeforeStart = {
      publishedBeforeDeadline: false,
      publishedBeforeStart: true,
      publishedTime: '2021-08-27',
    }
    const offeringsWithMemos = [
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
        memoValues: { ladokRoundIds: ['2', '3', '4'] },
        offeringValues: { offeringId: '2' },
      }),
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
        memoValues: { ladokRoundIds: ['2', '3', '4'] },
        offeringValues: { offeringId: '4' },
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(1)
  })

  test('One course (two offerings) and one offering has memo published after deadline but before course start', async () => {
    const datesAfterDeadlineBeforeStart = {
      publishedBeforeDeadline: false,
      publishedBeforeStart: true,
      publishedTime: '2021-08-27',
    }
    const offeringsWithMemos = [
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
        memoValues: { ladokRoundIds: ['2', '3', '4'] },
        offeringValues: { offeringId: '1' },
      }),
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
        memoValues: { ladokRoundIds: ['2', '3', '4'] },
        offeringValues: { offeringId: '4' },
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(1)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(1)
  })
})

describe('Count memos and courses for different courses for the same school ABE', () => {
  test('Two courses and each course has an offering which has a WEB-BASED memo published BEFORE course start', async () => {
    const offeringsWithMemos = [offering1WithDates(), offering1WithDates({ courseCode: 'BB12111' })]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(2)

    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(2)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(2)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(2)

    expect(combinedMemosPerSchool).toMatchInlineSnapshot(`
      {
        "schools": {
          "ABE": {
            "numberOfCourses": 2,
            "numberOfMemosPublishedBeforeDeadline": 2,
            "numberOfMemosPublishedBeforeStart": 2,
            "numberOfUniqPdfMemos": 0,
            "numberOfUniqWebAndPdfMemos": 2,
            "numberOfUniqWebMemos": 2,
            "uniqueCourseCodeDates": [
              "SF1625-2021-08-30-2021-10-29",
              "BB12111-2021-08-30-2021-10-29",
            ],
            "uniqueCourseCodeDatesWithoutMemo": [],
          },
        },
        "totalCourses": 2,
        "totalNumberOfMemosPublishedBeforeDeadline": 2,
        "totalNumberOfMemosPublishedBeforeStart": 2,
        "totalNumberOfPdfMemos": 0,
        "totalNumberOfWebMemos": 2,
      }
    `)
  })

  test('Two courses and each course has an offering which has a WEB-BASED memo published AFTER course start', async () => {
    const datesAfterCourseStart = {
      publishedBeforeDeadline: false,
      publishedBeforeStart: false,
      publishedTime: '2021-08-31',
    }
    const offeringsWithMemos = [
      offering1WithDates({
        dates: datesAfterCourseStart,
      }),
      offering1WithDates({
        courseCode: 'BB1215',
        dates: datesAfterCourseStart,
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqWebMemos).toBe(2)
    expect(combinedMemosPerSchool.schools.ABE.numberOfUniqPdfMemos).toBe(0)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(0)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(0)
  })

  test('Two courses and each course has an offering which has a WEB-BASED memo published after deadline but before course start', async () => {
    const datesAfterDeadlineBeforeStart = {
      publishedBeforeDeadline: false,
      publishedBeforeStart: true,
      publishedTime: '2021-08-27',
    }
    const offeringsWithMemos = [
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
      }),
      offering1WithDates({
        courseCode: 'BB1215',
        dates: datesAfterDeadlineBeforeStart,
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(2)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(2)
  })
})

describe('Count memos and courses for different courses for two different schools', () => {
  test('Two schools and two courses and each course has an offering which has a WEB-BASED memo published after deadline but before course start', async () => {
    const datesAfterDeadlineBeforeStart = {
      publishedBeforeDeadline: false,
      publishedBeforeStart: true,
      publishedTime: '2021-08-27',
    }
    const offeringsWithMemos = [
      offering1WithDates({
        dates: datesAfterDeadlineBeforeStart,
      }),
      offering1WithDates({
        courseCode: 'BB1215',
        dates: datesAfterDeadlineBeforeStart,
      }),
      offering1WithDates({
        courseCode: 'DD1112',
        dates: datesAfterDeadlineBeforeStart,
        offeringValues: { schoolMainCode: 'ITM' },
      }),
      offering1WithDates({
        courseCode: 'IT12112',
        dates: datesAfterDeadlineBeforeStart,
        offeringValues: { schoolMainCode: 'ITM' },
      }),
    ]
    const combinedMemosPerSchool = await countMemosDataPerSchool(offeringsWithMemos)
    expect(combinedMemosPerSchool.schools.ABE.numberOfCourses).toBe(2)

    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ABE.numberOfMemosPublishedBeforeStart).toBe(2)

    expect(combinedMemosPerSchool.schools.ITM.numberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.schools.ITM.numberOfMemosPublishedBeforeStart).toBe(2)

    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeDeadline).toBe(0)
    expect(combinedMemosPerSchool.totalNumberOfMemosPublishedBeforeStart).toBe(4)
  })
})
