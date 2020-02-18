import {modalConstants} from '../_constants';

export function modals(state = {}, action) {
  const {modalId, type, ...rest} = action;
  switch (type) {
    case modalConstants.SHOW:
    case modalConstants.HIDE: {
      return {
        ...state,
        ...{
          [modalId]: {
            ...state[modalId],
            ...rest,
            show: type === modalConstants.SHOW
          }
        }
      }
    }
    case modalConstants.SET_DATA: {
      return {
        ...state,
        ...{
          [modalId]: {
            ...state[modalId],
            ...rest
          }
        }
      }
    }
    default: return state;
  }
}