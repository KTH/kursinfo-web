import React from 'react'

const englishAnalysisSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    // change texts
    <div className="paragraphs">
      <p>Example for how data is fetched for Spring 2022, period P3, school ABE:</p>
      <p>
        Course data is fetched from&nbsp;
        <a
          href="https://www.kth.se/api/kopps/v2/apiInfo/courses"
          target="_blank"
          className="external-link"
          rel="noreferrer"
        >
          KOPPS API for Courses
        </a>
        , endpoint&nbsp;
        <code>/api/kopps/v2/courses/offerings</code>. Data for the current page was fetched from&nbsp;
        <a
          href={`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
          target="_blank"
          className="external-link"
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
    </div>
  ),
  courseDocumentsDataApiDescription: kursutvecklingApiUrl => (
    <div className="paragraphs">
      <p>
        Course analyses data is fetched from&nbsp;
        <a href="https://github.com/KTH/kursutveckling-api" target="_blank" className="external-link" rel="noreferrer">
          kursutveckling-api
        </a>
        , endpoint <code>getCourseAnalysesForSemestersList</code>. Data for the current page was fetched from&nbsp;
        <a href={kursutvecklingApiUrl} target="_blank" className="external-link" rel="noreferrer">
          {`${kursutvecklingApiUrl}/courseAnalysesForSemestersList?semesters=20221`}
        </a>
        , with <b>first</b> semester of a course (not the end or between semesters).
      </p>
    </div>
  ),
  subPageDescription: () => (
    <div className="paragraphs">
      <p>
        Here is a summary of the number of published course analyses for the selected school, year and semester. The
        data used is taken from Kopps and About course.
      </p>

      <p>
        The table shows the number of courses ending the chosen semester and the number of published course analyses for
        course offerings ending the chosen semester. The diagrams shows what percentage of the school’s courses (ending
        the chosen semester) that have a published course analysis. Below the diagrams, a comparison can be made with
        the result from the previous year.
      </p>

      <p>Information about the used data: </p>
      <ul>
        <li>
          {' '}
          The terms are defined according to{' '}
          <a
            href="https://intra.kth.se/en/utbildning/tentamen-och-schema/lasarsindelning/lasarsindelning-1.1201135"
            target="_blank"
            className="external-link"
            rel="noreferrer"
          >
            the division of the academic year
          </a>
          : Spring week 3-23, Autumn week 35-2, Summer week 24-34.
        </li>
        <li>
          The number of courses is calculated based on the number of unique course codes. Courses that have several
          course offerings with exactly the same start and end date are counted as one course.
        </li>
        <li>
          For course offerings running that run over several semesters, the course analysis is presented for the last
          semester of the course offering.
        </li>
      </ul>
    </div>
  ),
}

// https://api.kth.se/api/kopps/v2/courses/offerings?from=20221&skip_coordinator_info=true.
const swedishAnalysisSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    <div className="paragraphs">
      <p>Exempel för hur data hämtas för en termin (som exempel används VT 2022):</p>
      <p>
        Kursdata hämtas från KOPPS API för kurser, endpoint /api/kopps/v2/courses/offerings. För att hämta data för VT
        2022 används länken:
        <a
          href={`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
          target="_blank"
          className="external-link"
          rel="noreferrer"
        >
          {`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
        </a>
      </p>
      <p>
        Kursanalyser med kursomgångar som inte avslutades under terminen 20221 filtreras bort. Detta görs genom att
        förkasta kursomgångar som inte uppfyller kriterierna: course.offered_semesters[&#123;{'sista - element'}
        &#125;].semester === 20221 och course.offered_semesters[&#123;{'sista - element'}&#125;].end_week {'<='} (VTs
        sista veckan) och course.offered_semesters[&#123;{'sista - element'}&#125;].start_week {'>='} (VTs första
        veckan)
      </p>
    </div>
  ),
  courseDocumentsDataApiDescription: kursutvecklingApiUrl => (
    <div className="paragraphs">
      <p>
        Kursanalysdata hämtas från kursutveckling-api, endpoint
        /api/kursutveckling/v1/getCourseAnalysesForSemestersList?semesters=&#123;{'semester'}&#125;. Data för VT 2022
        hämtas från
        <a href={kursutvecklingApiUrl} target="_blank" className="external-link" rel="noreferrer">
          {`${kursutvecklingApiUrl}/courseAnalysesForSemestersList?semesters=20221`}
        </a>
        , med <b>första</b> semesterar av kurser som aktuella för VT 2022 (inte sista semester) med semester 20192,
        20201, 20202, 20211, 20212, 20221.
      </p>
    </div>
  ),
  subPageDescription: () => (
    <div className="paragraphs">
      <p>
        Här visas en sammanställning över antalet publicerade kursanalyser för vald skola, år och termin. Den data som
        används hämtas från Kopps och Om kursen.
      </p>
      <p>
        Tabellen visar antal kurser som slutar vald termin och antal publicerade kursanalyser för kursomgångar som
        slutar vald termin. Diagrammen visar hur stor del av skolans kurser (som slutar vald termin) som har en
        publicerad kursanalys. Under diagrammen går det att jämföra resultatet med resultatet för vald termin från
        föregående år.
      </p>
      <p>Information om den data som används: </p>
      <ul>
        <li>
          Terminerna definieras enligt{' '}
          <a
            href="https://intra.kth.se/utbildning/tentamen-och-schema/lasarsindelning"
            target="_blank"
            className="external-link"
            rel="noreferrer"
          >
            läsårsindelningen
          </a>
          : VT vecka 3-23, HT vecka 35-2, sommar vecka 24-34 .
        </li>
        <li>
          Antal kurser räknas utifrån antal unika kurskoder. Kurser som har flera kurstillfällen med exakt samma start-
          och slutdatum, räknas som en kurs.
        </li>
        <li>För kursomgångar som löper över flera terminer presenteras kursanalysen för kursomgångens sista termin.</li>
      </ul>
    </div>
  ),
}

const analysisSummaryTexts = (language = 'sv') =>
  language === 'en' ? englishAnalysisSummarySection : swedishAnalysisSummarySection

export default { analysisSummaryTexts }
