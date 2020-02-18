// @flow
import React from 'react';
import ReactTable from 'react-table';
import {connect} from 'react-redux';

import type {Document} from '../_types';
import {documentsActions} from '../_actions';
import {documentTypesToMime} from '../_constants';
import {formatter} from '../_helpers';
import {modalIds} from '../_constants';
import {Modal} from '../_components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye} from '@fortawesome/free-solid-svg-icons';

type Props = {
  dispatch: Function,
  documents: { items: Document[] },
  user: any,
  refreshData: Function
};
type State = {};

class DocumentsTable extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    (this: any).refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData() {
    this.props.dispatch(documentsActions.getAll());
  }

  render() {
    const {documents} = this.props;

    if (!documents || !documents.items) {
      return null;
    }

    const DEFAULT_COLUMNS = [{
      Header: 'Document ID',
      id: 'key.DocumentID',
      accessor: 'key.documentID',
    }, {
      Header: 'Document Hash',
      id: 'value.documentHash',
      accessor: (rec: Document) => rec.value.documentHash
    }, {
      Header: 'Document Description',
      id: 'value.documentDescription',
      accessor: (rec: Document) => rec.value.documentDescription
    }, {
      Header: 'Document Type',
      id: 'value.documentType',
      accessor: (rec: Document) => documentTypesToMime[rec.value.documentType]
    }, {
      Header: 'Timestamp',
      id: 'value.timestamp',
      accessor: (rec: Document) => formatter.datetime(new Date(rec.value.timestamp * 1000))
    }, {
      Header: 'Updated',
      id: 'value.updated',
      accessor: (rec: Document) => formatter.datetime(new Date(rec.value.updated * 1000))
    }, {
      Header: 'Actions',
      id: 'actions',
      accessor: 'key.documentID',
      filterable: false,
      Cell: row => {
        const record: Document = row.original;
        return (
          <div className="row justify-content-center">
            <button className="btn btn-sm btn-primary m-1" title="View details"
                    onClick={() => Modal.open(this.props.dispatch, modalIds.viewDocument, record)}>
              <FontAwesomeIcon fixedWidth icon={faEye}/>
            </button>
          </div>
        )
      }
    }];

    return (
      <ReactTable
        columns={DEFAULT_COLUMNS}
        data={documents.items || []}
        className="-striped -highlight w-100"
        defaultPageSize={10}
        filterable={true}
        defaultFilterMethod={(filter, row) => String(row[filter.id]).indexOf(filter.value) + 1}
        defaultSorted={[
          {
            id: "value.timestamp",
            desc: true
          }
        ]}
      />
    );
  }
}

function mapStateToProps(state) {
  const {documents, authentication} = state;
  const {user} = authentication;
  return {
    documents,
    user
  };
}

const connected = connect(mapStateToProps)(DocumentsTable);
export {connected as DocumentsTable};
