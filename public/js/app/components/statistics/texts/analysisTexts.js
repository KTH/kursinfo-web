import React from 'react'

const englishAnalysisSummarySection = {
  courseDataApiDescription: koppsApiUrl => (
    // change texts
    <p>Course data is fetched from ...</p>
  ),
  courseDocumentsDataApiDescription: kursutvecklingApiUrl => (
    // change texts

    <p>Addd text</p>
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
    </>
  ),
  courseDocumentsDataApiDescription: kursutvecklingApiUrl => (
    // change texts
    <p>
      <a href={kursutvecklingApiUrl} target="_blank" rel="noreferrer">
        {kursutvecklingApiUrl}&#123;semester&#125;
      </a>
    </p>
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
