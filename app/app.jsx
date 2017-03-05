import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import FileTransferer from './components/FileTransferer.jsx'
import Wrapper from './components/Wrapper.jsx'
import Auth from './containers/VisibleAuth.jsx'
import Share from './containers/VisibleShare.jsx'

import FileApp from './reducers/reducers.js'

import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'

// const store = createStore(FileApp, compose(applyMiddleware(thunkMiddleware),
//   applyMiddleware(routerMiddleware(browserHistory)),
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
const store = createStore(FileApp, compose(applyMiddleware(thunkMiddleware),
  applyMiddleware(routerMiddleware(browserHistory))));
const rootElement = document.getElementById('root');
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path='/' compontent={ Wrapper }>
        <IndexRoute component={ Auth }></IndexRoute>
        <Route path='netdisk' component={ FileTransferer }></Route>
        <Route path='car/:id' component={ Share }></Route>
      </Route>
    </Router>
  </Provider>,
  rootElement
);
