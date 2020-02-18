import {configConstants} from '../_constants';
import type {ConfigAction, State} from '../_types';

export function config(state: State = null, action: ConfigAction): State {
  switch (action.type) {
    case configConstants.SUCCESS:
      return action.config;
    default:
      return state;
  }
}