// @flow
import {alertConstants} from '../_constants';
import type {Action, State} from '../_types';

export function alert(state: State = {}, action: Action): State {

  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      };
    case alertConstants.ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state;
  }
}