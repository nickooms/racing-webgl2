import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import store from './store';
import App from './containers/App';
import Home from './containers/Home';
import Street from './components/Street';
import HouseNumberList from './components/HouseNumberList';

import './static/normalize.css';
import './static/index.css';

const history = syncHistoryWithStore(browserHistory, store);

/* eslint-disable no-undef */
const root = document.getElementById('root');
/* eslint-enable */

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        {/* Your routes here */}
        <Route path="street/:streetId" component={Street} />
        <Route path="housenumbers/:streetId" component={HouseNumberList} />
      </Route>
    </Router>
  </Provider>
), root);
