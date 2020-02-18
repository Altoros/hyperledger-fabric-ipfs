// @flow
import React from 'react';
import {connect} from 'react-redux';

import type {Document} from '../_types';
import {alertActions} from '../_actions';
import {documentTypesToMime} from '../_constants';
import {ipfsService} from '../_services';
import {uuidv4} from '../_helpers';

type Props = {
  initData: Document | any,
  dispatch: Function
};
type State = {
  document: Document,
  objUrl: string
};

class ViewDocument extends React.Component<Props, State> {
  documentDescriptionTextArea: ?HTMLTextAreaElement;
  documentID: string;

  constructor(props) {
    super(props);

    const document = this.props.initData || {
      key: {
        documentID: uuidv4()
      },
      value: {
        documentDescription: '',
        documentHash: '',
        documentType: 0,
        timestamp: 0,
        updated: 0
      }
    };

    this.state = {
      document: document,
      objUrl: ''
    };

    (this: any).getDocumentUrl = this.getDocumentUrl.bind(this);
  }

  getDocumentUrl() {
    const {document} = this.state;
    if (document && document.value.documentHash) {

      ipfsService.getDocument(document.value.documentHash).then(
        file => {
          let binary = new Blob([file], {type: documentTypesToMime[document.value.documentType]});
          let fileUrl = URL.createObjectURL(binary);
          this.setState({objUrl: fileUrl});
        },
        error => {
          this.props.dispatch(alertActions.error(`Error: ${error.toString()}`));
        }
      );
    }
  }

  render() {
    const {document} = this.state;

    if (!document) {
      return null;
    }

    return (
      <div>
        <div>
          <div className='form-group'>
            <label htmlFor="documentDescription">Description</label>

            <div className='input-group'>
            <textarea className={"form-control"}
                      name="documentDescription" value={document.value.documentDescription}
                      readOnly/>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor="documentHash">Document Hash</label>
            <div className='input-group'>
              <input type="text" className={"form-control"}
                     name="documentHash" value={document.value.documentHash}
                     readOnly
              />
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor="documentHash">Document Type</label>
            <div className='input-group'>
              <input type="text" className={"form-control"}
                     name="documentHash" value={documentTypesToMime[document.value.documentType]}
                     readOnly
              />
            </div>
          </div>
          {(document.value.documentHash) && (
            <div className='form-group'>
              <div className='input-group justify-content-center '>
                <button className="btn btn-sm btn-primary w-50 m-2" title="Get document from IPFS"
                        onClick={() => this.getDocumentUrl()}>
                  Get document from IPFS
                </button>
              </div>
            </div>
          )}
          {(this.state.objUrl) && (
            <div className='form-group'>
              <div className="input-group justify-content-center">
                <a className="btn btn-sm btn-primary w-50 m-2" title="Download document"
                   href={this.state.objUrl} target="_blank">
                  Download document
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {documents} = state;

  return {
    documents
  }
}

const connected = connect(mapStateToProps)(ViewDocument);
export {connected as ViewDocument};
