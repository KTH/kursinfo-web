import React from 'react'

const englishAnalysisSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    // change texts
    <>
      <p>Exemple for how data is fetched for Spring 2022, period P3, school ABE:</p>
      <p>
        Course data is fetched from&nbsp;
        <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">KOPPS API for Courses</a>, endpoint&nbsp;
        <code>/api/kopps/v2/courses/offerings</code>. Data for the current page was fetched from&nbsp;
        <a
          href={`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
          target="_blank"
          rel="noreferrer"
        >
          {`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
        </a>
        .
      </p>
      <p>
        Offerings that didn’t finish under 20221 semester are filtered out. This is done by discarding offerings that
        doesn’t meet the criteria:{' '}
        <code>course.offered_semesters[&#123;{'lastSemester'}&#125;].semester === 20221</code> and
        <code>
          course.offered_semesters[&#123;{'lastSemester'}&#125;].end_week {'<='} (than last week of a spring semester)
        </code>{' '}
        and{' '}
        <code>
          course.offered_semesters[&#123;{'lastSemester'}&#125;].end_week {'>='} (than first week of a spring semester)
        </code>
      </p>
    </>
  ),
  courseDocumentsDataApiDescription: kursutvecklingApiUrl => (
    <p>
      Course analyses data is fetched from&nbsp;
      <a href="https://github.com/KTH/kursutveckling-api" target="_blank" rel="noreferrer">
        kursutveckling-api
      </a>
      , endpoint <code>getCourseAnalysesForSemestersList</code>. Data for the current page was fetched from&nbsp;
      <a href={kursutvecklingApiUrl} target="_blank" rel="noreferrer">
        {`${kursutvecklingApiUrl}/courseAnalysesForSemestersList?semesters=20221`}
      </a>
      , with <b>first</b> semester of a course (not the end or between semesters).
    </p>
  ),
  subPageDescription: () => <p>Some description of analyses</p>,
}

// https://api.kth.se/api/kopps/v2/courses/offerings?from=20221&skip_coordinator_info=true.
const swedishAnalysisSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    <>
      <p>Exempel för hur data hämtas för en termin (som exempel används VT 2022):</p>
      <p>
        Kursdata hämtas från <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">KOPPS API för kurser</a>,
        endpoint <code>/api/kopps/v2/courses/offerings</code>. För att hämta data för VT 2022 används länken:
        <a
          href={`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
          target="_blank"
          rel="noreferrer"
        >
          {`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
        </a>
      </p>
      <p>
        Kursomgångar som inte avslutades under terminen 20221 filtreras bort. Detta görs genom att förkasta kursomgångar
        som inte uppfyller kriterierna:{' '}
        <code>course.offered_semesters[&#123;{'lastSemester'}&#125;].semester === 20221</code> och{' '}
        <code>
          course.offered_semesters[&#123;{'lastSemester'}&#125;].end_week {'<='} (VTs sista veckan)
        </code>{' '}
        och{' '}
        <code>
          course.offered_semesters[&#123;{'lastSemester'}&#125;].end_week {'>='} (VTs första veckan)
        </code>
      </p>
    </>
  ),
  courseDocumentsDataApiDescription: kursutvecklingApiUrl => (
    <>
      <p>
        Kursanalysdata hämtas från
        <a href="https://github.com/KTH/kursutveckling-api" target="_blank" rel="noreferrer">
          kursutveckling-api
        </a>
        , endpoint <code>getCourseAnalysesForSemestersList</code>. Data för VT 2022 hämtas från
        <a href={kursutvecklingApiUrl} target="_blank" rel="noreferrer">
          {`${kursutvecklingApiUrl}/courseAnalysesForSemestersList?semesters=20221`}
        </a>
        , med <b>start</b> semester av kursen (inte sista semester).
      </p>
    </>
  ),
  subPageDescription: () => (
    <>
      <p>
        Här visas en sammanställning över antalet publicerade kursanalyser för vald skola, år och termin. Den data som
        används hämtas från Kopps och Om kursen.
      </p>

      <p>
        Tabellen visar antal kurser som slutar vald termin och antal publicerade kursanalyser för kursomgångar som
        slutar vald termin. Diagrammen visar hur stor del av skolans kurser (som slutar vald termin) som har publicerat
        kursanalys under terminen. Under diagrammen går det att jämföra resultatet med resultatet för vald läsperiod
        från föregående år.
      </p>

      <p>Information om den data som används: </p>
      <ul>
        <li> Terminerna definieras enligt läsårsindelningen: VT vecka 3-23, HT vecka 35-2, sommar vecka 24-34 .</li>
        <li>
          Antal kurser räknas utifrån antal unika kurskoder. Kurser som har flera kurstillfällen med exakt samma start-
          och slutdatum, räknas som en kurs.
        </li>
        <li>För kursomgångar som löper över flera terminer presenteras kursanalysen för kursomgångens sista termin.</li>
      </ul>
    </>
  ),
}

const analysisSummaryTexts = (language = 'sv') =>
  language === 'en' ? englishAnalysisSummarySection : swedishAnalysisSummarySection

export default { analysisSummaryTexts }