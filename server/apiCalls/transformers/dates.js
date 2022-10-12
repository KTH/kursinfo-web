function formatTimeToLocaleDateSV(parsedTime) {
  if (!parsedTime || Number.isNaN(parsedTime)) return ''
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  const formattedTime = new Date(parsedTime).toLocaleDateString('sv-SE', options)
  return formattedTime
}

/**
 * Calculates and compiles memo publish data.
 * @param {[]} offeringStartDate  Offering’s start date, in format accepted by Date.parse
 * @param {{}} memoChangeDate     Memo’s change date, in format accepted by Date.parse
 * @returns {{}}                  Object with publish data for memo
 */
const publishData = (offeringStartDate, memoChangeDate) => {
  const offeringStartTime = Date.parse(offeringStartDate)
  const publishedTime = Date.parse(memoChangeDate)
  const formattedOfferingStartTime = formatTimeToLocaleDateSV(offeringStartTime)
  const formattedPublishedTime = formatTimeToLocaleDateSV(publishedTime)
  const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000
  return {
    offeringStartTime: formattedOfferingStartTime,
    publishedTime: formattedPublishedTime,
    publishedBeforeStart: offeringStartTime >= publishedTime,
    publishedBeforeDeadline: offeringStartTime - ONE_WEEK_IN_MS >= publishedTime,
  }
}
module.exports = {
  formatTimeToLocaleDateSV,
  publishData,
}
