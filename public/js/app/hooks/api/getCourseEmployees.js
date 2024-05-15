import { STATUS } from './status'

export const getCourseEmployees = async ({ uri, courseCode, selectedSemester, applicationCode }) => {
  if (!uri || !courseCode || !selectedSemester || !applicationCode) {
    return {
      status: STATUS.OK,
      data: null,
    }
  }

  const data = {
    courseCode,
    semester: selectedSemester,
    applicationCodes: [applicationCode],
  }

  try {
    const result = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!result.ok) {
      return {
        status: STATUS.ERROR,
        data: null,
      }
    }

    const courseRoundEmployees = await result.json()

    return {
      status: STATUS.OK,
      data: courseRoundEmployees,
    }
  } catch (error) {
    return {
      status: STATUS.ERROR,
      data: null,
    }
  }
}
