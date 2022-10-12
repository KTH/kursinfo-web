import React from 'react'

import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'

import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import { summaryTexts } from './StatisticsTexts'

import { periods, schools, seasons } from './domain/index'
import { DOCS, DOCUMENT_TYPES } from './domain/formConfigurations'

function MemosNumbersTable({ statisticsResult }) {}

function MemosSummary({ statisticsResult }) {
  const [{ language, languageIndex }] = useWebContext()
  const { documentType } = statisticsResult
  // labels are for headers and short texts
  const { statisticsLabels: labels } = i18n.messages[languageIndex]
  const { summaryLabels } = labels
  return (
    <>
      <table></table>
    </>
  )
}

MemosSummary.propTypes = {
  statisticsResult: PropTypes.shape({
    combinedMemosPerSchool: PropTypes.shape({}),
    documentType: PropTypes.oneOf(DOCUMENT_TYPES),
    koppsApiBasePath: PropTypes.string,
    kursPmDataApiBasePath: PropTypes.string,
    school: PropTypes.oneOf(schools.ORDERED_SCHOOL_OPTIONS),
    semestersInMemos: PropTypes.arrayOf(PropTypes.string),
    totalOfferings: PropTypes.number,
  }),
}

MemosSummary.defaultProps = {}
export default MemosSummary
