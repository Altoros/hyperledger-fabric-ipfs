// @flow
import ipfsClient from 'ipfs-http-client';
import {documentTypes} from '../_constants';

export const ipfsService = {
  addDocument,
  getDocument
};

const host = window.location.hostname;
const ipfs = ipfsClient(host, '5001', {protocol: 'http'});

async function upload(file): Promise<any> {

  let promise = new Promise((resolve, reject) => {
    let reader = new FileReader();
    const fileType = documentTypes[file.type];
    if (fileType === undefined) {
      resolve(undefined);
    } else {
      reader.readAsArrayBuffer(file);
      reader.onload = (event) => {
        resolve({
          file: event.target.result,
          type: fileType
        });
      };
    }
  });
  return await promise;
}

async function addDocument(file: File): Promise<string | any> {

  let hash = new Promise((resolve, reject) => {
    upload(file).then((result) => {
      if (result === undefined) {
        resolve(undefined);
      } else {
        let testBuffer = Buffer.from(result.file);
        const fileType = result.type;
        ipfs.add(testBuffer, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve({
            hash: result[0].hash,
            type: fileType
          });
        });
      }
    });
  });

  return await hash;
}

async function getDocument(hash: string): ArrayBuffer | any {
  let promise = new Promise((resolve, reject) => {
    ipfs.get(hash, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files[0].content);
    });
  });

  return await promise;
}
