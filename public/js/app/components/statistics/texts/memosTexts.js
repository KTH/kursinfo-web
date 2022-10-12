import React from 'react'

const englishMemosSummarySection = {
  subPageDescription: () => <p>Some description of memo</p>,
}

const swedishMemosSummarySection = {
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
