
import {userConstants} from '../_constants';
import {userService} from '../_services';
import {alertActions} from './';
import {history} from '../_helpers';
import type {Action, ThunkAction, Dispatch, ErrorAction, UserAction} from '../_types';

export const userActions = {
  login,
  logout
};

function login(username: string, orgName: string): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(request({username}));

    userService.login(username, orgName)
      .then(
        user => {
          dispatch(success(user));
          history.push('./');
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(user): UserAction {
    return {type: userConstants.LOGIN_REQUEST, user}
  }

  function success(user): UserAction {
    return {type: userConstants.LOGIN_SUCCESS, user}
  }

  function failure(error): ErrorAction {
    return {type: userConstants.LOGIN_FAILURE, error}
  }
}

function logout(): ThunkAction {
  return (dispatch: Dispatch) => {
    userService.logout();
    dispatch(success());
  };

  function success(): Action {
    return {type: userConstants.LOGOUT};
  }
}
