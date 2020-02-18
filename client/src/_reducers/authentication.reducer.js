// @flow
import {userConstants} from '../_constants';
import {history} from '../_helpers';
import * as userStore from '../_helpers/user-store';
import type {UserAction, State} from '../_types';

let user = userStore.get();
const initialState = user ? {loggedIn: true, user} : {};
if (!user) {
  history.push('./login');
}

export function authentication(state: State = initialState, action: UserAction) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
