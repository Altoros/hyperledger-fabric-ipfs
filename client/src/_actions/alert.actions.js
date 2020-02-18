// @flow
import {alertConstants} from '../_constants';
import type {Action, ThunkAction, Dispatch} from '../_types/Redux';
import {TIMEOUT} from '../_helpers';

export const alertActions = {
  success,
  error,
  clear
};

function success(message: string | Array<string>): ThunkAction {
  return (dispatch: Dispatch) => {
    setTimeout(() => {dispatch(clear())}, TIMEOUT.ALERT_SET_TIMEOUT);
    return dispatch({type: alertConstants.SUCCESS, message});
  };
}

function error(message: string): ThunkAction {
  return (dispatch: Dispatch) => {
    setTimeout(() => {dispatch(clear())}, TIMEOUT.ALERT_SET_TIMEOUT);
    return dispatch({type: alertConstants.ERROR, message});
  };
}

function clear(): Action {
  return {type: alertConstants.CLEAR};
}
