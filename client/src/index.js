import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './static/bootstrap.min.css';
import '../node_modules/rc-switch/assets/index.css';
import '../node_modules/react-table/react-table.css';
import {App} from './App';
import {Provider} from 'react-redux';

import {store} from './_helpers';

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app'));
