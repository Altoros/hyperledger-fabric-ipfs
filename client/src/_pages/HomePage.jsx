import React from 'react';
import {connect} from 'react-redux';

import {AddDocument, DocumentsTable, ViewDocument, Modal} from '../_components';
import {documentsActions, modalActions} from '../_actions';
import {modalIds} from '../_constants';

class HomePage extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidUpdate(prevProps) {
    const {documents, dispatch} = this.props;

    if (documents.adding === false) {
      this.refreshData();
      dispatch(modalActions.hide(modalIds.addDocument));
    }
  }

  refreshData(shadowMode) {
    this.props.dispatch(documentsActions.getAll(shadowMode));
  }

  render() {
    return (
      <div className={`container mt-3`}>
        <div className="row justify-content-between">
          <button className="btn btn-primary mb-2"
                  onClick={() => Modal.open(this.props.dispatch, modalIds.addDocument)}>
            Add Document
          </button>
          <button className="btn btn-primary mb-2"
                  onClick={() => this.refreshData()}>
            Refresh
          </button>
        </div>
        <Modal modalId={modalIds.addDocument} title="Add Document">
          <AddDocument/>
        </Modal>
        <Modal modalId={modalIds.viewDocument} title="View Document" footer={false}>
          <ViewDocument/>
        </Modal>
        <div className="row w-100">
          <DocumentsTable/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {authentication, modals, documents} = state;
  const {user} = authentication;
  return {
    user,
    documents,
    modals
  };
}

const connected = connect(mapStateToProps)(HomePage);
export {connected as HomePage};
