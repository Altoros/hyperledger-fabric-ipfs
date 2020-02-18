// @flow
import React from 'react';
import {connect} from 'react-redux';

import type {Document} from '../_types';
import {alertActions, documentsActions} from '../_actions';
import Dropzone from 'react-dropzone'
import {ipfsService} from '../_services';
import {uuidv4} from '../_helpers';

type Props = {
  initData: Document | any,
  dispatch: Function,
  setSubmitFn: Function
};
type State = {
  submitted: boolean,
  document: Document
};

class AddDocument extends React.Component<Props, State> {
  documentDescriptionTextArea: ?HTMLTextAreaElement;

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
      submitted: false
    };

    (this: any).handleChange = this.handleChange.bind(this);
    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).changeDocumentHash = this.changeDocumentHash.bind(this);
    (this: any).changeDocumentType = this.changeDocumentType.bind(this);

    //Modal integration
    this.props.setSubmitFn && this.props.setSubmitFn(this.handleSubmit);
  }

  onDrop(files) {
    ipfsService.addDocument(files[0]).then(
      document => {
        if (!document) {
          this.props.dispatch(alertActions.error('Document type is not supported'));
        } else {
          this.changeDocumentHash(document.hash);
          this.changeDocumentType(document.type);
          this.props.dispatch(alertActions.success('Document file was uploaded'));
        }
      },
      error => {
        this.props.dispatch(alertActions.error(`Error: ${error.toString()}`));
      }
    );
  }

  changeDocumentHash(hash: any) {
    const {document} = this.state;

    this.setState({
      document: {
        ...document,
        value: {
          ...document.value,
          documentHash: hash
        }
      }
    });
  }

  changeDocumentType(type: any) {
    const {document} = this.state;

    this.setState({
      document: {
        ...document,
        value: {
          ...document.value,
          documentType: type
        }
      }
    });
  }

  handleChange(event: SyntheticInputEvent<>) {
    const {name, value} = event.target;
    const {document} = this.state;
    this.setState({
      document: {
        ...document,
        value: {
          ...document.value,
          [name]: value
        }
      },
      submitted: false
    });
  }

  handleSubmit(event: SyntheticEvent<>) {
    event.preventDefault();

    this.setState({submitted: true});
    const {document} = this.state;

    if (document.value.documentHash) {
      this.props.dispatch(documentsActions.add(document));
    }
  }


  render() {
    const {document, submitted} = this.state;
    return (
      <form name="form" onSubmit={this.handleSubmit}>
        <div className='form-group'>
          <label htmlFor="documentDescription">Description</label>

          <div className='input-group'>
            <textarea className={"form-control"}
                      name="documentDescription" value={document.value.documentDescription}
                      ref={(input) => {
                        this.documentDescriptionTextArea = input;
                      }}
                      onChange={this.handleChange}/>
          </div>
        </div>
        <Dropzone
          onDrop={this.onDrop.bind(this)}
        >
          {({getRootProps, getInputProps}) => (
            <div>
              <div {...getRootProps()}
                   className={'text-center drop-zone-section w-75' + (submitted && !document.value.documentHash ? ' border-danger' : '')}>
                <input {...getInputProps()} />
                <div className={`d-table w-100 h-100`}>
                  <p className={`d-table-cell align-middle bg-light`}>Drop file here, or click to select file</p>
                </div>
              </div>
              {submitted && !document.value.documentHash &&
              <div className="text-danger invalid-feedback">Document file is required</div>}
            </div>
          )}
        </Dropzone>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const {document} = state;

  return {
    document
  }
}

const connected = connect(mapStateToProps)(AddDocument);
export {connected as AddDocument};
