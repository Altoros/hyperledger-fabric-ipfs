import {combineReducers} from 'redux';

import {authentication} from './authentication.reducer';
import {alert} from './alert.reducer';
import {config} from './config.reducer';
import {loading} from './loading.reducer';
import {documents} from './document.reducer';
import {modals} from './modals.reducer';

const rootReducer = combineReducers({
  authentication,
  alert,
  loading,
  documents,
  config,
  modals
});

export default rootReducer;
