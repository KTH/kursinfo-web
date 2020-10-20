'use strict'
import React, { render, Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider, inject } from 'mobx-react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { configure } from 'mobx'

import { StaticRouter } from 'react-router'
import RouterStore from './stores/RouterStore.js'
import CoursePage from './pages/CoursePage.jsx'

import '../../css/kursinfo-web.scss'

function appFactory() {
  if (process.env['NODE_ENV'] !== 'production') {
    configure({
      isolateGlobalState: true
    })
  }

  const routerStore = new RouterStore()

  if (typeof window !== 'undefined') {
    routerStore.initializeStore('routerStore')
  }

  return (
    <Provider routerStore={routerStore}>
      <Switch>
        <Route path="/student/kurser/kurs/:courseCode" component={CoursePage} />
        <Route path="/" component={CoursePage} />
      </Switch>
    </Provider>
  )
}

function staticRender(context, location) {
  return (
    <StaticRouter location={location} context={context}>
      {appFactory()}
    </StaticRouter>
  )
}

if (typeof window !== 'undefined') {
  ReactDOM.render(<BrowserRouter>{appFactory()}</BrowserRouter>, document.getElementById('kth-kursinfo'))
}

export { appFactory, staticRender }
