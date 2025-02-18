import React from 'react'

import PropTypes from 'prop-types'

import { useLanguage } from '../../hooks/useLanguage'
import { summaryTexts } from './StatisticsTexts'

import { DOCS, documentTypes } from './domain/formConfigurations'
import { schools } from './domain/index'
import { MemosSummary } from './index'

function ResultNumbersSummary({ statisticsResult }) {
  const { documentType, koppsApiBasePath } = statisticsResult
  // labels are for headers and short texts
  const {
    translation: { statisticsLabels: labels },
    languageShortname,
  } = useLanguage()
  const { summaryLabels } = labels
  const header = labels[documentType]

  // texts are for big texts with several <p>, or dynamic
  const texts = summaryTexts(documentType, languageShortname)

  return (
    <>
      <h2 id="results-heading">{header}</h2>
      <h3>{summaryLabels.subHeaders[documentType]}</h3>
      <article key="documents-and-courses-description">
        {texts.subPageDescription()}
        <details>
          <summary className="white">{summaryLabels.sourceOfData}</summary>
          {texts.courseDataApiDescription(koppsApiBasePath)}
        </details>
      </article>
      <article key="documents-and-courses-compilation">
        {documentType === DOCS.courseMemo ? <MemosSummary statisticsResult={statisticsResult} /> : null}
      </article>
    </>
  )
}

ResultNumbersSummary.propTypes = {
  statisticsResult: PropTypes.shape({
    combinedMemosPerSchool: PropTypes.shape({}),
    documentType: PropTypes.oneOf(documentTypes()),
    koppsApiBasePath: PropTypes.string,
    documentsApiBasePath: PropTypes.string,
    school: PropTypes.oneOf(schools.orderedSchoolsFormOptions()),
  }),
}
export default ResultNumbersSummary
