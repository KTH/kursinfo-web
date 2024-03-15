'use strict'

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { hydrateRoot } from 'react-dom/client'
import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import CoursePage from './pages/CoursePage'
import CourseStatisticsPage from './pages/CourseStatisticsPage'
import '../../css/kursinfo-web.scss'

function ErrorFallback({ error, resetErrorBoundary }) {
  // eslint-disable-next-line no-console
  console.error(error)
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function appFactory(applicationStore, context) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        location.reload()
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <WebContextProvider configIn={context}>
        <Routes>
          <Route exact path="/statistik" element={<CourseStatisticsPage />} />
          <Route exact path="/:courseCode" element={<CoursePage />} />
          <Route exact path="/" element={<CoursePage />} />
        </Routes>
      </WebContextProvider>
    </ErrorBoundary>
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
  hydrateRoot(domElement, app)
}

_renderOnClientSide()

export default appFactory
