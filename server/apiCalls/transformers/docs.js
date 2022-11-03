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
 * @param {[]} memos                     Collection of course memos
 * @param {string|number} offeringId     Course offering id, f.e., 1
 * @returns {[]}                         Array, containing offering's memos
 */
function _findMemosByOfferingId(memos, offeringId) {
  return memos.filter(memo => memo.ladokRoundIds.includes(String(offeringId)))
}

/**
 * Find all memos for the course semester and course offering
 * @param {[]} memos              Collection of course memos
 * @param {string} courseCode     Course code
 * @param {string} firstSemester  The start semester of this course offering
 * @returns {[]}                  Array, containing semester's memos.
 */

function findMemosForOfferingId(docs, courseCode, firstSemester, offeringId) {
  const courseMemosForSemester = _filterRelatedDocuments(docs, courseCode, firstSemester)
  const memosForOfferingId = _findMemosByOfferingId(courseMemosForSemester, offeringId)
  return memosForOfferingId
}

/**
 * Find analyses for an offering id
 * @param {[]} analyses                     Collection of course analyses
 * @param {string|number} offeringId        Course offering id, f.e., 1
 * @returns {[]}                            Array, containing offering's analyses.
 */
function _findAnalysesByOfferingId(analyses, offeringId) {
  return analyses.filter(analysis => analysis.roundIdList.split(',').includes(String(offeringId)))
}

/**
 * Find all analyses for the course semester and course offering
 * @param {[]} analyses               Collection of course analyses
 * @param {string} courseCode         Course code
 * @param {string} firstSemester      The start semester of this course offering
 * @returns {[]}                      Array, containing semester's analyses.
 */

function findAnalysesForOfferingId(docs, courseCode, firstSemester, offeringId) {
  const courseMemosForSemester = _filterRelatedDocuments(docs, courseCode, firstSemester)
  const memosForOfferingId = _findAnalysesByOfferingId(courseMemosForSemester, offeringId)
  return memosForOfferingId
}

module.exports = {
  findMemosForOfferingId,
  findAnalysesForOfferingId,
}
