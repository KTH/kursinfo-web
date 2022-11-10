import React from 'react'

const englishMemosSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    <>
      <p>Example for how data is fetched for Spring 2022, period P3, school ABE:</p>
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
        For course memos, offerings that didn’t start during the 20221 semester are filtered out. This is done by
        discarding offerings that doesn’t meet the criteria: <code>course.first_yearsemester == 20221</code>,
        <code>course.first_period===20221P3</code>, <code>SCHOOL_MAP[course.school_code]=== &apos;ABE&apos;</code>. Date
        used to determine if memo was published before the offering started is{' '}
        <code>course.offered_semesters[&#123;{20221}&#125;].start_date</code>.
      </p>
    </>
  ),
  courseDocumentsDataApiDescription: kursPmApiUrl => (
    <>
      <p>
        An earlier version of <i>Publish new course analysis and course data</i> had the option to upload course memos
        together with course analyses. This option does not exist anymore, and course memos uploaded on that page are
        filtered out.
      </p>
      <p>
        Course memo data is fetched from&nbsp;
        <a href="https://github.com/KTH/kurs-pm-data-api" target="_blank" rel="noreferrer">
          kurs-pm-data-api
        </a>
        , endpoint <code>/api/kurs-pm-data/v1/prioritizedWebOrPdfMemosBySemesters?semesters=&#123;semester&#125;</code>.
        Data for the current page was fetched from&nbsp;
        <a
          href={`${kursPmApiUrl}/v1/prioritizedWebOrPdfMemosBySemesters?semesters=20221`}
          target="_blank"
          rel="noreferrer"
        >
          {`${kursPmApiUrl}/v1/prioritizedWebOrPdfMemosBySemesters?semesters=20221`}
        </a>
        , using semester <code>20221</code>.
      </p>
    </>
  ),
  subPageDescription: () => (
    <>
      <p>
        Here is a summary of the number of published course memos for the selected school, year and study period. The
        data used is taken from Kopps and About course.
      </p>
      <p>
        The table shows the number of courses that started and number of course memos that were published during the
        selected study period. The three diagrams show how big part of the school`s courses have published course memos
        during the study period, at the latest at the start of the course (in accordance with KTH`s guideline for course
        memos{' '}
        <a href="https://intra.kth.se/utbildning/systemstod/om-kursen/kurs-pm/riktilinjer" className="external-link">
          KTH`s guideline for course memos
        </a>
        ) and one week before the start of the course. Below the diagrams, a comparison can be made with the result from
        the previous year.
      </p>

      <p>Information about the data used: </p>
      <ul>
        <li>A course memo is always counted as one course memo, even if there are several published versions.</li>
        <li>The publishing date used is the date when the first version of the course memo was published.</li>
        <li>
          The number of courses is calculated based on the number of unique course codes for the selected study period.
          Courses that have several course offerings with exactly the same start and end date are counted as one course.
        </li>
        <li>
          {' '}
          For course offerings that run over several semesters, the course memo is presented for the first semester of
          the course offering.
        </li>
      </ul>
    </>
  ),
}

const swedishMemosSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    // update course.offered_semesters
    <>
      <p>Exempel för hur data hämtas för en termin - VT 2022, period P3:</p>
      <p>
        Kursdata hämtas från <a href="https://www.kth.se/api/kopps/v2/apiInfo/courses">KOPPS API för kurser</a>,
        endpoint: <code>/api/kopps/v2/courses/offerings</code>. För att hämta data för VT 2022 så används:{' '}
        <a
          href={`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
          target="_blank"
          rel="noreferrer"
        >
          {`${koppsApiUrl}courses/offerings?from=20221&skip_coordinator_info=true`}
        </a>
        . Kurs-PM med kursomgångar som inte startar under VT 2022 filtreras bort. Detta görs genom att förkasta
        kursomgångar som inte uppfyller kriterierna: <code>course.first_yearsemester == 20221</code>,
        <code>course.first_period===20221P3</code>, <code>SCHOOL_MAP[course.school_code]=== &apos;ABE&apos;</code>.
        Datum som används för att avgöra om kurs-PM publicerades innan kursomgången startade är:
        <code>course.offered_semesters[&#123;{20221}&#125;].start_date.</code>
      </p>
    </>
  ),
  courseDocumentsDataApiDescription: kursPmApiUrl => (
    <>
      <p>
        En tidigare version av Publicera ny kursanalys och kursdata innehöll möjligheten att ladda upp kurs-PM
        tillsammans med kursanalyser. Det här alternativet finns inte längre och kurs-PM som laddas upp på den sidan
        filtreras bort.
      </p>
      <p>
        Kurs-PM-data hämtas från
        <a href="https://github.com/KTH/kurs-pm-data-api" target="_blank" rel="noreferrer">
          kurs-pm-data-api
        </a>
        , endpoint <code>/api/kurs-pm-data/v1/prioritizedWebOrPdfMemosBySemesters?semesters=&#123;semester&#125;</code>.
        För att hämta data för VT 2022 används:
        <a
          href={`${kursPmApiUrl}/v1/prioritizedWebOrPdfMemosBySemesters?semesters=20221`}
          target="_blank"
          rel="noreferrer"
        >
          {`${kursPmApiUrl}/v1/prioritizedWebOrPdfMemosBySemesters?semesters=20221`}
        </a>
        , då semester är <code>20221</code>.
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

const memosSummaryTexts = (language = 'sv') =>
  language === 'en' ? englishMemosSummarySection : swedishMemosSummarySection

export default { memosSummaryTexts }
