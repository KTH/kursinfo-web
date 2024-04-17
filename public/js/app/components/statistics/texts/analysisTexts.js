import React from 'react'

const englishAnalysisSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    // change texts
    <div>
      <p>Example of how data is retrieved for a semester (Spring 2022, school ABE is used as an example):</p>
      <p>
        Course data is retrieved from the KOPPS API for courses, endpoint /api/kopps/v2/courses/offerings. To retrieve
        data for VT 2022, use the link:&nbsp;
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
        Course analyzes with course rounds that were not completed during semester 20221 are filtered out. This is done
        by discarding courses that do not meet the criteria: course.offered_semesters[&#123;{'last-element'}
        &#125;].semester === 20221 and course.offered_semesters[&#123;{'last-element'}&#125;].end_week {'<='} (than last
        week of a spring semester) and course.offered_semesters[&#123;{'last-element'}&#125;].end_week {'>='} (than
        first week of a spring semester){' '}
      </p>
    </div>
  ),
  subPageDescription: () => (
    <div>
      <p>
        Here is a summary of the number of published course analyses for the selected school, year and semester. The
        data used is taken from Kopps and About course.
      </p>

      <p>
        The table shows the number of courses ending the chosen semester and the number of published course analyses for
        course offerings ending the chosen semester. The diagrams show what percentage of the school’s courses (ending
        the chosen semester) that have a published course analysis. Below the diagrams, a comparison can be made with
        the result from the previous year.
      </p>

      <p>Information about the used data: </p>
      <ul>
        <li>
          The semesters are defined according to{' '}
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
    <div>
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
        sista veckan) och course.offered_semesters[&#123;{'sista - element'}&#125;].end_week {'>='} (VTs första veckan)
      </p>
    </div>
  ),
  subPageDescription: () => (
    <div>
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
