/**
 * Fetch course memos for each semester in list of semesters.
 * @param {[]} semesters Array of semesters
 */
const _fetchCourseMemos = async semesters => {
  let courseMemos = {}
  for await (const semester of semesters) {
    const courseMemosForSemester = await _kursPmDataApiData(semester)
    courseMemos = _.mergeWith({}, courseMemos, courseMemosForSemester, _customizer)
  }
  // log.debug('_fetchCourseMemos returns', courseMemos)
  return courseMemos
}
