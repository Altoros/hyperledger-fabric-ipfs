import {ipfsConstants} from '../_constants';

export function files(state = {}, action) {
  switch (action.type) {
    case ipfsConstants.GET_REQUEST:
      return {...state, ...{
        loading: true,
        adding: undefined
      }};
    case ipfsConstants.GET_SUCCESS:{
      return {...state, ...{
        items: action.records.result,
        loading: false
      }};}
    case ipfsConstants.GET_FAILURE:
      return {...state, ...{
        error: action.error,
        loading: false
      }};
    case ipfsConstants.ADD_REQUEST:
      return {...state, ...{
        adding: true
      }};
    case ipfsConstants.ADD_SUCCESS:
      return {...state, ...{
        adding: false
      }};
    case ipfsConstants.ADD_FAILURE:
      return {...state, ...{
        error: action.error
      }};

    default:
      return state;
  }
}
