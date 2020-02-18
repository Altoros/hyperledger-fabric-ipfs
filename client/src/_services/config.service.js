// @flow
import {config, getChannels, getChaincodes} from './api.service';
import type {Config} from '../_types';

export const configService = {
  load,
  get,
  update,
  getPeers,
  getIpAddress,
  getChannels: loadChannels,
  getChaincodes: loadChaincodes
};

let localConfig: Config = {
  org: ''
};
let isFetching: boolean = false;
let reqPromise: Promise<Config>;

function get(): Config {
  return localConfig;
}

function load(): Promise<Config> {
  if (isFetching) {
    return reqPromise;
  }
  isFetching = true;

  reqPromise = config()
    .then(res => {
      localConfig = res;
      return localConfig;
    });

  return reqPromise;
}

// load secured information, like chaincodes, channels
function update(): Promise<any> {
  return Promise.all([
    loadChannels(),
    loadChaincodes()
  ]);
}

function _extend(asyncFn: Function, cfgKey: string, responseKey): Promise<Object> {
  if (!localConfig[cfgKey]) {
    if (asyncFn.promise) {
      return asyncFn.promise;
    }
    asyncFn.promise = asyncFn()
      .then(response => {
        localConfig[cfgKey] = {};
        response[responseKey].forEach(obj => {
          localConfig[cfgKey][obj.name] = obj.name;
        });

        delete asyncFn.promise;
        return localConfig[cfgKey];
      });

    return asyncFn.promise;
  }

  return Promise.resolve(localConfig[cfgKey]);
}

function loadChannels(): Promise<Object> {
  return _extend(getChannels, 'channels', 'channels');
}

function loadChaincodes(): Promise<Object> {
  return _extend(getChaincodes, 'chaincodes', 'chaincodes');
}

function getPeers(): string[] {
  if (localConfig.peers) {
    return localConfig.peers;
  }
  // $FlowFixMe
  const orgConfig = localConfig['network-config'][localConfig.org];
  localConfig.peers = Object.keys(orgConfig).filter(k => k.startsWith('peer'));
  return localConfig.peers;
}

function getIpAddress(): string {
  if (localConfig.ip_address) {
    return localConfig.ip_address;
  }
  // $FlowFixMe
  const orgConfig = localConfig['network-config'][localConfig.org];
  localConfig.ip_address = orgConfig.ip_address;
  return localConfig.ip_address;
}
