// @flow
import {ipfsConstants} from '../_constants';
import {ipfsService} from '../_services';
import {alertActions} from './';
import type {Action, ThunkAction, Dispatch, ErrorAction, Ipfs} from '../_types';
import type {ListResponse} from '../_types/Response';


export const ipfsActions = {
  add,
  get
};

type IpfsAction = Action & {files: ListResponse<Ipfs>};

function get(path: string): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(request(path));

    ipfsService.getDocument(path)
      .then(
        files => {
          dispatch(success(files));
        },
        error => dispatch(failure(error.toString()))
      );
  };

  function request(path: string): Action {
    return {type: ipfsConstants.GET_REQUEST, path}
  }

  function success(files: ListResponse<Ipfs>): IpfsAction {
    return {type: ipfsConstants.GET_SUCCESS, files}
  }

  function failure(error: string): ErrorAction {
    return {type: ipfsConstants.GET_FAILURE, error}
  }
}

function add(file: File): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(request());
    ipfsService.addDocument(file)
      .then(
        _ => {
          dispatch(success());
          dispatch(alertActions.success('File was uploaded'));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(): Action {
    return {type: ipfsConstants.ADD_REQUEST}
  }

  function success(): Action {
    return {type: ipfsConstants.ADD_SUCCESS}
  }

  function failure(error): ErrorAction {
    return {type: ipfsConstants.ADD_FAILURE, error}
  }
}
