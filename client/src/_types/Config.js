// @flow
export type Config = {
  'network-config'?: {
    orderer: {
      url: string,
      'server-hostname': string,
      tls_cacerts: string
    },
    ipfs_port: string,
    [key: any]: {
      name: string,
      mspid: string,
      ip_address: string,
      ca: string,
      [key: {}]: {
        requests: string,
        events: string,
        'server-hostname': string,
        tls_cacerts: string,
      },
      admin: {
        key: string,
        cert: string
      }
    }
  },
  org: string,
  ip_address?: string,
  medicali_ip_address?: string,
  peers?: string[],
  channels?: {
    [key: string]: string
  },
  chaincodes?: {
    [key: string]: string
  }
};
