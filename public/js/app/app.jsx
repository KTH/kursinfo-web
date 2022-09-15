'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import CoursePage from './pages/CoursePage'
import CourseStatisticsPage from './pages/CourseStatisticsPage'

import '../../css/kursinfo-web.scss'

function appFactory(applicationStore, context) {
  return (
    <WebContextProvider configIn={context}>
      <Routes>
        <Route exact path="/statistik" element={<CourseStatisticsPage />} />
        <Route exact path="/:courseCode" element={<CoursePage />} />
        <Route exact path="/" element={<CoursePage />} />
      </Routes>
    </WebContextProvider>
  )
}

function _renderOnClientSide() {
  const isClientSide = typeof window !== 'undefined'

  if (!isClientSide) {
    return
  }

  const webContext = {}
  uncompressData(webContext)

  const basename = webContext.proxyPrefixPath.uri

  const app = <BrowserRouter basename={basename}>{appFactory({}, webContext)}</BrowserRouter>

  // Removed basename because it is causing empty string basename={basename}
  const domElement = document.getElementById('app')
  ReactDOM.hydrate(app, domElement)
}

_renderOnClientSide()

export default appFactory
