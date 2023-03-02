'use strict'

import { memosPerCourseOffering } from './memos'

// offering and mathing memo for offering id 1
const offering_SF1625_202121 = {
  endDate: '2021-10-29',
  firstSemester: '20212',
  startDate: '2021-08-30',
  schoolMainCode: 'ABE',
  departmentName: 'ABE/Geoinformatik',
  connectedPrograms: 'TTGTM-2',
  courseCode: 'SF1625',
  period: 'P1',
  courseRoundApplications: [
    {
      course_round_application_code: '1',
    },
  ],
}
const memo_SF1625_202121_base = {
  courseCode: 'SF1625',
  applicationCodes: ['1'],
  semester: '20212',
  memoEndPoint: 'SF162520212-1',
  memoCommonLangAbbr: 'sv',
  memoName: 'CMEDT1  (Startdatum 2021-08-30, Svenska)',
  isPdf: false,
  version: 1,
  lastChangeDate: 'Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)',
}

// offering and mathing memo for offering id 2
const offering_SF1625_202122 = {
  endDate: '2021-10-29',
  firstSemester: '20212',
  startDate: '2021-08-30',
  schoolMainCode: 'ABE',
  departmentName: 'ABE/Geoinformatik',
  connectedPrograms: '',
  courseCode: 'SF1625',
  period: 'P1',
  courseRoundApplications: [
    {
      course_round_application_code: '2',
    },
  ],
}
const memo_SF1625_202122_base = {
  courseCode: 'SF1625',
  applicationCodes: ['2'],
  semester: '20212',
  memoEndPoint: 'SF162520212-2',
  memoCommonLangAbbr: 'sv',
  memoName: 'CDEPR1 m.fl.  (Startdatum 2021-08-30, Svenska)',
  isPdf: false,
  version: 1,
  lastChangeDate: 'Wed Oct 27 2021 12:14:32 GMT+0000 (Coordinated Universal Time)',
}

describe('Count memos and courses', () => {
  test('One course (one offering) and this offering has a published memo', async () => {
    const offerings = [offering_SF1625_202121]
    const memos = [memo_SF1625_202121_base]
    const offeringsWithMemos = await memosPerCourseOffering(offerings, memos)

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
            "lastChangeDate": "Tue Aug 02 2021 10:19:17 GMT+0000 (Coordinated Universal Time)",
            "memoCommonLangAbbr": "sv",
            "memoEndPoint": "SF162520212-1",
            "memoName": "CMEDT1  (Startdatum 2021-08-30, Svenska)",
            "publishedData": {
              "offeringStartTime": "2021-08-30",
              "publishedBeforeDeadline": true,
              "publishedBeforeStart": true,
              "publishedTime": "2021-08-02",
            },
            "semester": "20212",
            "version": 1,
          },
          "courseRoundApplications": [
            {
              "course_round_application_code": "1",
            },
          ],
          "departmentName": "ABE/Geoinformatik",
          "endDate": "2021-10-29",
          "firstSemester": "20212",
          "period": "P1",
          "schoolMainCode": "ABE",
          "startDate": "2021-08-30",
        },
      ]
    `)
  })

  test('One course (two offerings) and one offering has a published memo', async () => {
    const offerings = [offering_SF1625_202121, offering_SF1625_202122]
    const memos = [memo_SF1625_202121_base]
    const offeringsWithMemos = await memosPerCourseOffering(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    const [offeringWithMemo, offeringWithoutMemos] = offeringsWithMemos

    expect(offeringWithMemo.courseMemoInfo.courseCode).toBe('SF1625')
    expect(offeringWithMemo.courseMemoInfo.memoEndPoint).toBe('SF162520212-1')

    expect(offeringWithoutMemos.courseMemoInfo).toMatchInlineSnapshot(`{}`)
    expect(offeringWithoutMemos).toMatchInlineSnapshot(`
      {
        "connectedPrograms": "",
        "courseCode": "SF1625",
        "courseMemoInfo": {},
        "courseRoundApplications": [
          {
            "course_round_application_code": "2",
          },
        ],
        "departmentName": "ABE/Geoinformatik",
        "endDate": "2021-10-29",
        "firstSemester": "20212",
        "period": "P1",
        "schoolMainCode": "ABE",
        "startDate": "2021-08-30",
      }
    `)
  })
  test('One course (two offerings) and each offering has a published memo', async () => {
    const offerings = [offering_SF1625_202121, offering_SF1625_202122]
    const memos = [memo_SF1625_202121_base, memo_SF1625_202122_base]
    const offeringsWithMemos = await memosPerCourseOffering(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    const [offering1WithMemo1, offering2WithMemo2] = offeringsWithMemos

    expect(offering1WithMemo1.courseMemoInfo.courseCode).toBe('SF1625')
    expect(offering1WithMemo1.courseMemoInfo.memoEndPoint).toBe('SF162520212-1')

    expect(offering2WithMemo2.courseMemoInfo.courseCode).toBe('SF1625')
    expect(offering2WithMemo2.courseMemoInfo.memoEndPoint).toBe('SF162520212-2')
    expect(offering2WithMemo2.courseMemoInfo).toMatchInlineSnapshot(`
      {
        "applicationCodes": [
          "2",
        ],
        "courseCode": "SF1625",
        "isPdf": false,
        "lastChangeDate": "Wed Oct 27 2021 12:14:32 GMT+0000 (Coordinated Universal Time)",
        "memoCommonLangAbbr": "sv",
        "memoEndPoint": "SF162520212-2",
        "memoName": "CDEPR1 m.fl.  (Startdatum 2021-08-30, Svenska)",
        "publishedData": {
          "offeringStartTime": "2021-08-30",
          "publishedBeforeDeadline": false,
          "publishedBeforeStart": false,
          "publishedTime": "2021-10-27",
        },
        "semester": "20212",
        "version": 1,
      }
    `)
  })

  test('One course (two offerings) and one memo published for both rounds', async () => {
    const offerings = [offering_SF1625_202121, offering_SF1625_202122]
    const memos = [
      {
        courseCode: 'SF1625',
        applicationCodes: ['1', '2'],
        semester: '20212',
        memoEndPoint: 'SF162520212-1-2',
        memoCommonLangAbbr: 'sv',
        memoName: 'CMEDT1  (Startdatum 2021-08-30, Svenska), CDEPR1 m.fl.  (Startdatum 2021-08-30, Svenska)',
        isPdf: false,
        version: 1,
        lastChangeDate: 'Wed Oct 27 2021 12:14:32 GMT+0000 (Coordinated Universal Time)',
      },
    ]
    const offeringsWithMemos = await memosPerCourseOffering(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    const [offering1WithMemo1, offering2WithMemo1] = offeringsWithMemos

    expect(offering1WithMemo1.courseMemoInfo.courseCode).toBe('SF1625')
    expect(offering1WithMemo1.courseMemoInfo.memoEndPoint).toBe('SF162520212-1-2')

    expect(offering2WithMemo1.courseMemoInfo.courseCode).toBe('SF1625')
    expect(offering2WithMemo1.courseMemoInfo.memoEndPoint).toBe('SF162520212-1-2')
  })

  test('One course (two offerings) and one memo published for other course', async () => {
    const offerings = [offering_SF1625_202121, offering_SF1625_202122]
    const memos = [
      {
        courseCode: 'BB1211',
        applicationCodes: ['1', '2'],
        semester: '20212',
        memoEndPoint: 'BB121120212-1-2',
        memoCommonLangAbbr: 'sv',
        memoName: 'CMPDT1  (Startdatum 2021-08-30, Svenska), APDPR1 m.fl.  (Startdatum 2021-08-30, Svenska)',
        isPdf: false,
        version: 1,
        lastChangeDate: 'Wed Oct 27 2021 12:14:32 GMT+0000 (Coordinated Universal Time)',
      },
    ]
    const offeringsWithMemos = await memosPerCourseOffering(offerings, memos)
    expect(offeringsWithMemos.length).toBe(2)
    const [offering1WithOUTMemo, offering2WithOUTMemo] = offeringsWithMemos

    expect(offering1WithOUTMemo.courseCode).toBe('SF1625')
    expect(offering1WithOUTMemo.courseMemoInfo).toMatchInlineSnapshot(`{}`)

    expect(offering2WithOUTMemo.courseCode).toBe('SF1625')
    expect(offering2WithOUTMemo.courseMemoInfo).toMatchInlineSnapshot(`{}`)
  })
})
