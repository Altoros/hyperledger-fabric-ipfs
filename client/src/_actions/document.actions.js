// @flow
import {documentConstants} from '../_constants';
import {documentService} from '../_services';
import {alertActions} from './';
import type {Action, ThunkAction, Dispatch, ErrorAction, Document} from '../_types';
import type {ListResponse} from '../_types/Response';


export const documentsActions = {
  get,
  getAll,
  add,
  update
};

type DocumentsAction = Action & { documents: ListResponse<Document> };

function get(documentID: string): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(request(documentID));

    documentService.get(documentID)
      .then(
        documents => {
          dispatch(success(documents));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(documentID: string): Action {
    return {type: documentConstants.GET_REQUEST, documentID}
  }

  function success(documents: ListResponse<Document>): DocumentsAction {
    return {type: documentConstants.GET_SUCCESS, documents}
  }

  function failure(error: string): ErrorAction {
    return {type: documentConstants.GET_FAILURE, error}
  }
}

function getAll(shadowMode: boolean = false): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(request(shadowMode));

    documentService.getAll()
      .then(
        documents => {
          dispatch(success(documents));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(shadowMode: boolean): Action {
    return {type: documentConstants.GETALL_REQUEST, shadowMode}
  }

  function success(documents: ListResponse<Document>): DocumentsAction {
    return {type: documentConstants.GETALL_SUCCESS, documents}
  }

  function failure(error: string): ErrorAction {
    return {type: documentConstants.GETALL_FAILURE, error}
  }
}

function add(document: Document): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(request());
    documentService.add(document)
      .then(
        _ => {
          dispatch(success());
          dispatch(alertActions.success('Document was added'));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(): Action {
    return {type: documentConstants.ADD_REQUEST}
  }

  function success(): Action {
    return {type: documentConstants.ADD_SUCCESS}
  }

  function failure(error): ErrorAction {
    return {type: documentConstants.ADD_FAILURE, error}
  }
}

function update(document: Document): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(request());
    documentService.update(document)
      .then(
        _ => {
          dispatch(success());
          dispatch(alertActions.success('Document was updated'));
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request(): Action {
    return {type: documentConstants.UPDATE_REQUEST}
  }

  function success(): Action {
    return {type: documentConstants.UPDATE_SUCCESS}
  }

  function failure(error): ErrorAction {
    return {type: documentConstants.UPDATE_FAILURE, error}
  }
}
