// @flow
import {authService} from '../_services/auth.service';
import {getToken} from './user-store';
import {TIMEOUT} from './timeout';

const forwardRequestByError = {
  '401': {
    retry: 3,
    timeout: TIMEOUT.AUTHORIZATION_SET_TIMEOUT,
    fnc: authService.obtainToken.bind(authService)
  },
  '500': {
    retry: 0,
    timeout: TIMEOUT.REFRESH_SET_TIMEOUT,
    fnc: Promise.resolve.bind(Promise)
  }
};

function _parseMessage(input: string = ''): string {
  const [, detailedMsg] = input.replace(')', '').split('message: ');
  return detailedMsg || input;
}

export async function sendRequest(url: string, options: Object = {}, retry: boolean = true): Promise<any> {
  options.headers = updateHeaders(options.headers);

  const response = await fetch(url, options);
  if (!response.ok) {
    const retryParams = forwardRequestByError[response.status];
    if (retryParams && retry) {
      await retryParams.fnc();
      return await retryPromise(url, options, retryParams.timeout, retryParams.retry);
    } else {
      const data = await response.json();
      const error = (data && data.message && _parseMessage(data.message)) || response.statusText;
      return Promise.reject(new Error(error));
    }
  }

  return await response.json();
}

function retry(asyncFn: Function, args: any[], timeout: number, attempt: number, resolveFn: Function, rejectFn: Function, e?: Error) {
  if (attempt < 0) {
    return rejectFn(e);
  }
  return asyncFn.apply(this, args)
    .then(resolveFn)
    .catch(e => {
      attempt--;
      setTimeout(() => {
        retry(asyncFn, args, timeout, attempt, resolveFn, rejectFn, e);
      }, timeout);
    });
}

const retryPromise = (url: string, options: Object, timeout: number, attempt: number) => {
  return new Promise((resolve, reject) => {
    retry(sendRequest, [url, options, false], timeout, attempt, resolve, reject)
  });
};

function authHeader() {
  let token = getToken();

  if (token) {
    return {'Authorization': 'Bearer ' + token};
  } else {
    return {};
  }
}

function updateHeaders(headerObj = {}) {
  return {...headerObj, ...authHeader(), ...{'Content-Type': 'application/json'}}
}
