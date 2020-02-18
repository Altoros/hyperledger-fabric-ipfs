// @flow
export type Document = {
  key: {
    documentID: string
  };
  value: {
    documentHash: string,
    documentDescription: string,
    documentType: number,
    timestamp: number,
    updated: number,
  }
};
