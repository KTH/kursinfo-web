import React from 'react'
import { memosTexts, analysisTexts } from './texts/index'
import { DOCS } from './domain/formConfigurations'

const englishIntroTexts = {
  pageHeader: `Course Information Statistics`,
  pageDescription: () => (
    <div>
      <p>
        The Statistics page for course information is part of the Administer About course tool. All course memos and
        course analyses published via the tool form the basis for the statistics. Read more about{' '}
        <a
          href="https://intra.kth.se/en/utbildning/systemstod/om-kursen/om-kursen-1.1020344"
          target="_blank"
          className="external-link"
          rel="noreferrer"
        >
          About the course on the intranet.
        </a>
      </p>
      <p>
        It is possible to see statistics for course memos and course analyses respectively, either for one or all
        schools and one or more study periods/semesters. You can download statistics from the year 2019 and onwards. The
        statistics for course memos enable follow-up at school level based on{' '}
        <a
          href="https://intra.kth.se/en/utbildning/systemstod/om-kursen/kurs-pm/riktilinjer"
          target="_blank"
          className="external-link"
          rel="noreferrer"
        >
          KTH&apos;s guideline for course memos
        </a>
      </p>
      <p>On the statistics page you will find:</p>
      <ul>
        <li>
          a compilation of the number of published course memos/course analyzes for the selected school and study
          period/semester
        </li>
        <li>a possibility to compare data for the selected year with statistics from the previous year </li>
        <li>
          a table with all the courses of the selected school for the selected study period/semester, which can be
          downloaded to e.g. do filtering and sorting at the program level
        </li>
      </ul>
    </div>
  ),
  periodsInfoModal: () =>
    `${(
      <>
        <p>INFO IN ENGLISH</p>
      </>
    )}`,
}
const swedishIntroTexts = {
  pageDescription: () => (
    <div>
      <p>
        Statistiksidan för kursinformation är en del av verktyget Administrera Om kursen. De kurs-PM och kursanalyser
        som publiceras via verktyget utgör underlaget för statistiken. Läs mer om{' '}
        <a
          href="https://intra.kth.se/utbildning/systemstod/om-kursen/om-kursen-1.1020344"
          target="_blank"
          className="external-link"
          rel="noreferrer"
        >
          Om kursen på intranätet.
        </a>{' '}
      </p>
      <p>
        Statistiken visas områdesvis för kurs-PM respektive kursanalys. Det går att se statistik för en eller alla
        skolor samt för en eller flera läsperioder/terminer. Det finns statistik att hämta från år 2019 och framåt.
        Statistiken för kurs-PM möjliggör uppföljning på skolnivå utifrån{' '}
        <a
          href="https://intra.kth.se/utbildning/systemstod/om-kursen/kurs-pm/riktilinjer"
          target="_blank"
          className="external-link"
          rel="noreferrer"
        >
          KTH:s riktlinje för kurs-PM.
        </a>
      </p>
      <p>På statistiksidan finns:</p>
      <ul>
        <li>en sammanställning av antalet publicerade kurs-PM/kursanalyser för vald skola och läsperiod/termin</li>
        <li>möjligheten att jämföra data för det valda året med statistik från föregående år</li>
        <li>
          en tabell med den valda skolans samtliga kurser för vald läsperiod/termin, vilken går att ladda ner för att
          t.ex. göra filtreringar och sorteringar på programnivå
        </li>
      </ul>
    </div>
  ),
  periodsInfoModal: () =>
    `${(
      <>
        <p>INFO IN SVENSKA</p>
      </>
    )}`,
}
const introductionTexts = isEnglish => (isEnglish ? englishIntroTexts : swedishIntroTexts)

const summaryTexts = (documentType, language = 'sv') =>
  documentType === DOCS.courseMemo
    ? memosTexts.memosSummaryTexts(language)
    : analysisTexts.analysisSummaryTexts(language)

export { introductionTexts, summaryTexts }
