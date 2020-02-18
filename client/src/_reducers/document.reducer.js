import {documentConstants} from '../_constants';

export function documents(state = {}, action) {
  switch (action.type) {
    case documentConstants.GET_REQUEST:
      return {...state, ...{
        loading: true,
        adding: undefined
      }};
    case documentConstants.GET_SUCCESS:{
      return {...state, ...{
        items: action.documents.result,
        loading: false
      }};}
    case documentConstants.GET_FAILURE:
      return {...state, ...{
        items: {},
        error: action.error,
        loading: false
      }};
    case documentConstants.GETALL_REQUEST:
      return {...state, ...{
        loading: true,
        adding: undefined
      }};
    case documentConstants.GETALL_SUCCESS:{
      return {...state, ...{
        items: action.documents.result,
        loading: false
      }};}
    case documentConstants.GETALL_FAILURE:
      return {...state, ...{
        items: {},
        error: action.error,
        loading: false
      }};
    case documentConstants.ADD_REQUEST:
      return {...state, ...{
        adding: true
      }};
    case documentConstants.ADD_SUCCESS:
      return {...state, ...{
        adding: false
      }};
    case documentConstants.ADD_FAILURE:
      return {...state, ...{
        error: action.error
      }};
    case documentConstants.UPDATE_REQUEST:
      return {...state, ...{
        adding: true
      }};
    case documentConstants.UPDATE_SUCCESS:
      return {...state, ...{
        adding: false
      }};
    case documentConstants.UPDATE_FAILURE:
      return {...state, ...{
        error: action.error
      }};

    default:
      return state;
  }
}
