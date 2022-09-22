import React from 'react'
// TODO: MOVED from previous version, need to update texts
// texts are for big texts with several <p>, or dynamic
// for show labels and headers use / move to messages.en/.se
const englishTexts = {
  pageHeader: `Course Information Statistics`,
  pageDescription: () => (
    <>
      <p> ??? Description in english</p>
    </>
  ),
  periodsInfoModal: () =>
    `${(
      <>
        <p>INFO IN ENGLISH</p>
      </>
    )}`,
}
const swedishTexts = {
  pageDescription: () => (
    <>
      <p>
        Statistiksidan för kursinformation är en del av verktyget Administrera Om kursen. De kurs-PM och kursanalyser
        som publiceras via verktyget utgör underlaget för statistiken. Läs mer om Om kursen på intranätet.{' '}
      </p>
      <p>
        Statistiken visas områdesvis för kurs-PM respektive kursanalys. Det går att se statistik för en eller alla
        skolor samt för en eller flera läsperioder/terminer. Det finns statistik att hämta från år 2019 och framåt.
        Statistiken för kurs-PM möjliggör uppföljning på skolnivå utifrån KTH:s riktlinje för kurs-PM.
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
    </>
  ),
  periodsInfoModal: () =>
    `${(
      <>
        <p>INFO IN SVENSKA</p>
      </>
    )}`,
}

export { englishTexts, swedishTexts }
