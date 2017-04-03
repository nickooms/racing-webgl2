import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import store from './store';
import App from './containers/App';
import Home from './containers/Home';
import Street from './components/Street';
import City from './components/City';
import Building from './components/Building';
import HouseNumberList from './components/HouseNumberList';
import HouseNumber from './components/HouseNumber';
import RoadObjectList from './components/RoadObjectList';
// import RoadObject from './components/RoadObject';
import RoadSegmentList from './components/RoadSegmentList';
// import RoadSegment from './components/RoadSegment';

import './static/normalize.css';
import './static/index.css';

injectTapEventPlugin();

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
        <Route path="city/:cityId" component={City} />
        <Route path="street/:streetId" component={Street} />
        <Route path="housenumbers/:streetId" component={HouseNumberList} />
        <Route path="housenumber/:houseNumberId" component={HouseNumber} />
        <Route path="building/:buildingId" component={Building} />
        <Route path="roadobjects/:streetId" component={RoadObjectList} />
        {/* <Route path="roadobject/:roadObjectId" component={RoadObject} />*/}
        <Route path="roadsegments/:streetId" component={RoadSegmentList} />
        {/* <Route path="roadsegment/:roadSegmentId" component={RoadSegment} />*/}
      </Route>
    </Router>
  </Provider>
), root);
