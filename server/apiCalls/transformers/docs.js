/**
 * Find all documents for this course
 * @param {[]} docs               Collection of course memos or analyses
 * @param {string} courseCode     Course code
 * @param {string} firstSemester  The start semester of this course offering
 * @returns {[]}                  Array, containing semester's memos or analyses.
 */
function _filterRelatedDocuments(docs, courseCode, firstSemester) {
  return docs.filter(doc => doc.courseCode === courseCode && doc.semester === firstSemester)
}

/**
 * Find memos for an offering id
 * @param {[]} memos                      Collection of course memos
 * @param {string|number} applicationCode Course application code, f.e., SF162 or 1234
 * @returns {[]}                          Array, containing offering's memos
 */
function _findMemosByApplicationCode(memos, applicationCode) {
  return memos.filter(memo => memo.applicationCodes.includes(String(applicationCode)))
}

/**
 * Find all memos for the course semester and course offering
 * @param {[]} memos              Collection of course memos
 * @param {string} courseCode     Course code
 * @param {string} firstSemester  The start semester of this course offering
 * @returns {[]}                  Array, containing semester's memos.
 */

function findMemosForApplicationCode(docs, courseCode, firstSemester, applicationCode) {
  const courseMemosForSemester = _filterRelatedDocuments(docs, courseCode, firstSemester)
  const memosForApplicationCode = _findMemosByApplicationCode(courseMemosForSemester, applicationCode)
  return memosForApplicationCode
}

/**
 * Find analyses for an offering id
 * @param {[]} analyses                     Collection of course analyses
 * @param {string|number} applicationCode   Course application code, f.e., SF162 or 1234
 * @returns {[]}                            Array, containing offering's analyses.
 */
function _findAnalysesByApplicationCode(analyses, applicationCode) {
  return analyses.filter(analysis => analysis.applicationCodes.split(',').includes(String(applicationCode)))
}

/**
 * Find all analyses for the course semester and course offering
 * @param {[]} analyses               Collection of course analyses
 * @param {string} courseCode         Course code
 * @param {string} firstSemester      The start semester of this course offering
 * @returns {[]}                      Array, containing semester's analyses.
 */

function findAnalysesForApplicationCode(docs, courseCode, firstSemester, applicationCode) {
  const courseMemosForSemester = _filterRelatedDocuments(docs, courseCode, firstSemester)
  const memosForApplicationCode = _findAnalysesByApplicationCode(courseMemosForSemester, applicationCode)
  return memosForApplicationCode
}

module.exports = {
  findMemosForApplicationCode,
  findAnalysesForApplicationCode,
}
