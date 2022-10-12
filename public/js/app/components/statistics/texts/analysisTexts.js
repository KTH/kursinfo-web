import React from 'react'

const englishAnalysisSummarySection = {
  subPageDescription: () => <p>Some description of analyses</p>,
}

const swedishAnalysisSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    <p>
      Course data is fetched from&nbsp;
      <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">KOPPS API for Courses</a>, endpoint&nbsp;
      <code>/api/kopps/v2/courses/offerings</code>. Data for the current page was fetched from&nbsp;
      <a href={koppsApiUrl} target="_blank" rel="noreferrer">
        <code>{koppsApiUrl}</code>
      </a>
      .
    </p>
  ),
  courseDocumentsFilterDescription: semester => (
    <>
      <p>
        For course memos, offerings that didn’t start during the {semester} semester are filtered out. This is done by
        discarding offerings that doesn’t meet the criteria: <code>course.first_yearsemester == {semester}</code>. Date
        used to determine if memo was published before the offering started is{' '}
        <code>course.offered_semesters[&#123;{semester}&#125;].start_date</code>.
      </p>
      <p>
        An earlier version of <i>Publish new course analysis and course data</i> had the option to upload course memos
        together with course analyses. This option does not exist anymore, and course memos uploaded on that page are
        filtered out.
      </p>
    </>
  ),
  subPageDescription: () => (
    <>
      <p>
        Här visas en sammanställning över antalet publicerade kurs-PM för vald skola, år och läsperiod. Den data som
        används hämtas från Kopps och Om kursen.
      </p>

      <p>
        Tabellen visar antalet kurser som startade och antalet kurs-PM som publicerades under den valda läsperioden. De
        tre diagrammen visar hur stor del av skolans kurser som publicerade kurs-PM under läsperioden, senast vid
        kursstart (i enlighet med{' '}
        <a href="https://intra.kth.se/utbildning/systemstod/om-kursen/kurs-pm/riktilinjer" className="external-link">
          KTH:s riktlinje för kurs-PM
        </a>
        ) och en vecka före kursstart. Under diagrammen går det att göra en jämförelse med resultatet från föregående
        år.
      </p>

      <p>Information om den data som används: </p>
      <ul>
        <li>Kurs-PM räknas alltid som ett kurs-PM, även om det finns flera publicerade versioner.</li>
        <li>Publiceringsdatumet som används är datumet för när första versionen av kurs-PM publicerades.</li>
        <li>
          Antalet kurser räknas utifrån antalet unika kurskoder för vald läsperiod. Kurser som har flera kurstillfällen
          med exakt samma start- och slutdatum, räknas som en kurs.
        </li>
        <li> För kursomgångar som löper över flera terminer presenteras kurs-PM för kursomgångens första termin.</li>
      </ul>
    </>
  ),
}

const analysisSummaryTexts = (language = 'sv') =>
  language === 'en' ? englishAnalysisSummarySection : swedishAnalysisSummarySection

export default { analysisSummaryTexts }
