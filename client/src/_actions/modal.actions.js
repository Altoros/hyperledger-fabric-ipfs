// @flow
import {modalConstants} from '../_constants'
import type {Action} from '../_types';

export const modalActions = {
  register,
  show,
  hide
};

type ModalAction = Action & {modalId: string};

function register(modalId: string): ModalAction {
  return {type: modalConstants.HIDE, modalId};
}

function show(modalId: string, object: {}): ModalAction {
  return {type: modalConstants.SHOW, modalId, object};
}

function hide(modalId: string): ModalAction {
  return {type: modalConstants.HIDE, modalId};
}