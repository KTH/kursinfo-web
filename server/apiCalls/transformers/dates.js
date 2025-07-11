function formatTimeToLocaleDateSV(parsedTime) {
  if (!parsedTime || Number.isNaN(parsedTime)) return ''
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  const formattedTime = new Date(parsedTime).toLocaleDateString('sv-SE', options)
  return formattedTime
}

/**
 * Calculates and compiles document publish data.
 * @param {[]} offeringStartDate  Offering’s start date, in format accepted by Date.parse
 * @param {{}} docChangeDate     Document's change date, in format accepted by Date.parse
 * @returns {{}}                  Object with publish data for memo
 */
const publishData = (offeringStartDate, docChangeDate) => {
  const offeringStartTime = Date.parse(offeringStartDate)
  const publishedTime = Date.parse(docChangeDate)
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

/**
 * Calculates and compiles memo publish data.
 * @param {[]} offeringStartDate  Offering’s start date, in format accepted by Date.parse
 * @param {{}} memoChangeDate     Memo’s change date, in format accepted by Date.parse
 * @param {{}} memoFirstPublishDate     Memo’s first change date, in format accepted by Date.parse
 * @returns {{}}                  Object with publish data for memo
 */
const firstPublishData = (offeringStartDate, memoChangeDate, memoFirstPublishDate) => {
  const offeringStartTime = Date.parse(offeringStartDate)
  const publishedTime = Date.parse(memoChangeDate)
  const publishedFirstTime = Date.parse(memoFirstPublishDate)
  const formattedOfferingStartTime = formatTimeToLocaleDateSV(offeringStartTime)
  const formattedPublishedTime = formatTimeToLocaleDateSV(publishedTime)
  const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000
  return {
    offeringStartTime: formattedOfferingStartTime,
    publishedTime: formattedPublishedTime,
    publishedBeforeStart: offeringStartTime >= publishedFirstTime,
    publishedBeforeDeadline: offeringStartTime - ONE_WEEK_IN_MS >= publishedFirstTime,
  }
}
module.exports = {
  firstPublishData,
  formatTimeToLocaleDateSV,
  publishData,
}
