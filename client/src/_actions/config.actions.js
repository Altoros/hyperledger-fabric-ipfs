// @flow
import {configConstants} from '../_constants';
import {configService} from '../_services';
import type {Action, ThunkAction, Dispatch, ErrorAction} from '../_types/Redux';

export const configActions = {
  get
};

type SuccessAction = Action & {config: {}};

function get(): ThunkAction {
  return (dispatch: Dispatch) => {
    configService.load()
      .then(
         config => {
          dispatch(success(config));
        },
        error => {
          dispatch(failure(error.toString()));
        }
      );
  };

  function success(config): SuccessAction {
    return {type: configConstants.SUCCESS, config}
  }
  function failure(error): ErrorAction {
    return {type: configConstants.FAILURE, error}
  }
}