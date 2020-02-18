// @flow
import * as apiService from './api.service';
import {configService} from './config.service';
import type {Document, ListResponse} from '../_types';

export const documentService = {
  get,
  getAll,
  add,
  update
};

const ACTIONS = {
  get: 'getDocument',
  getAll: 'getDocuments',
  add: 'createDocument',
  update: 'updateDocument'
};

const CHAINCODES = {
  reference: 'reference'
};

const CHANNELS = {
  common: 'common'
};

async function get(documentID: string): Promise<ListResponse<Document>> {
  const channels = await configService.getChannels();
  const chaincodes = await configService.getChaincodes();

  return await apiService.query(
    channels[CHANNELS.common],
    chaincodes[CHAINCODES.reference],
    ACTIONS.get,
    [
      documentID,
    ]);
}

async function getAll(): Promise<ListResponse<Document>> {
  const channels = await configService.getChannels();
  const chaincodes = await configService.getChaincodes();

  return await apiService.query(
    channels[CHANNELS.common],
    chaincodes[CHAINCODES.reference],
    ACTIONS.getAll,
    []);
}

async function add(document: Document): Promise<any> {
  const channels = await configService.getChannels();
  const chaincodes = await configService.getChaincodes();

  return await apiService.invoke(
    channels[CHANNELS.common],
    chaincodes[CHAINCODES.reference],
    ACTIONS.add,
    [
      document.key.documentID,
      document.value.documentType,
      document.value.documentDescription,
      document.value.documentHash,
    ]);
}

async function update(document: Document): Promise<any> {
  const channels = await configService.getChannels();
  const chaincodes = await configService.getChaincodes();

  return await apiService.invoke(
    channels[CHANNELS.common],
    chaincodes[CHAINCODES.reference],
    ACTIONS.update,
    [
      document.key.documentID,
      document.value.documentType,
      document.value.documentDescription,
      document.value.documentHash,
    ]);
}
