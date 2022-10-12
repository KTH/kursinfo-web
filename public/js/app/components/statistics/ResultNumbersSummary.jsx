import React from 'react'

import PropTypes from 'prop-types'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { summaryTexts } from './StatisticsTexts'

import { DOCS, DOCUMENT_TYPES } from './domain/formConfigurations'

function ResultNumbersSummary({ statisticsResult }) {
  const [{ language, languageIndex }] = useWebContext()
  const { documentType } = statisticsResult
  // labels are for headers and short texts
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  const { summaryLabels } = labels

  // texts are for big texts with several <p>, or dynamic
  const texts = summaryTexts(documentType, language)

  return (
    <>
      <h2>{labels[documentType]}</h2>
      <h3>{summaryLabels.subHeaders[documentType]}</h3>
      <article key="memos-and-courses-compilation">
        {texts.subPageDescription()}
        {/* 
        <details>
          <summary className="white">{texts.sourceOfData}</summary>
          {texts.courseDataApiDescription(koppsApiUrl)}
          {texts.courseDocumentsFilterDescription(semester)}
          {texts.courseMemosDataApiDescription(kursutvecklingApiUrl, semestersInMemos)}
        </details> */}
      </article>
    </>
  )
}

ResultNumbersSummary.propTypes = {
  statisticsResult: PropTypes.oneOf([
    PropTypes.shape({
      combinedMemosPerSchool: PropTypes.shape({}),
      documentType: PropTypes.oneOf(DOCUMENT_TYPES),
      koppsApiBasePath: PropTypes.string,
      kursPmDataApiBasePath: PropTypes.string,
      school: PropTypes.oneOf(schools.ORDERED_SCHOOL_OPTIONS),
      semestersInMemos: PropTypes.arrayOf(PropTypes.string),
      totalOfferings: PropTypes.number,
    }),
  ]),
}

MemosSummary.defaultProps = {}
export default MemosSummary
