// @flow
import {authService} from './auth.service';
import {set, clear} from '../_helpers';

export const userService = {
  login,
  logout
};

function login(username: string, orgName: string): * {
  set({name: username, org: orgName});
  return authService.obtainToken();
}

function logout() {
  clear();
}
