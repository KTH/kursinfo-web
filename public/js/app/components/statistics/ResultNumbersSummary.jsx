import React from 'react'

import PropTypes from 'prop-types'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { summaryTexts } from './StatisticsTexts'

import { DOCS, documentTypes } from './domain/formConfigurations'
import { schools } from './domain/index'
import { AnalysesSummary, MemosSummary } from './index'

function ResultNumbersSummary({ statisticsResult }) {
  const [{ language, languageIndex }] = useWebContext()
  const { documentsApiBasePath, documentType, koppsApiBasePath } = statisticsResult
  // labels are for headers and short texts
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  const { summaryLabels } = labels
  const header = labels[documentType]

  // texts are for big texts with several <p>, or dynamic
  const texts = summaryTexts(documentType, language)

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
        {documentType === DOCS.courseMemo ? (
          <MemosSummary statisticsResult={statisticsResult} />
        ) : (
          <AnalysesSummary statisticsResult={statisticsResult} />
        )}
      </article>
    </>
  )
}

ResultNumbersSummary.propTypes = {
  statisticsResult: PropTypes.oneOf([
    PropTypes.shape({
      combinedMemosPerSchool: PropTypes.shape({}),
      documentType: PropTypes.oneOf(documentTypes()),
      koppsApiBasePath: PropTypes.string,
      documentsApiBasePath: PropTypes.string,
      school: PropTypes.oneOf(schools.orderedSchoolsFormOptions()),
    }),
  ]),
}

ResultNumbersSummary.defaultProps = {}
export default ResultNumbersSummary
