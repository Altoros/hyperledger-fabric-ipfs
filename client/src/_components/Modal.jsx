// @flow
import React from 'react';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import {modalActions} from '../_actions/modal.actions';

const customStyles = {
  content: {
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    cursor: 'default',
    'background-color': 'rgba(255, 255, 255, 0.1)'
  },
  overlay: {
    'z-index': '20'
  }
};

type Props = {
  dispatch: Function,
  modalId: string,
  title: string,
  large: boolean,
  modals: {}, //TODO
  children: any[],
  footer: boolean,
  submitText: string
};
type State = {
};

class Modal extends React.Component<Props, State> {
  handleSubmit: (e: SyntheticEvent<HTMLButtonElement>) => {};
  constructor(props) {
    super(props);
    (this:any).handleCloseModal = this.handleCloseModal.bind(this);
    (this:any).setSubmitFn = this.setSubmitFn.bind(this);
  }

  componentDidMount() {
    const {modalId, dispatch} = this.props;
    dispatch(modalActions.register(modalId));
  }

  static open(dispatch: Function, modalId: string, data: any) {
    dispatch(modalActions.show(modalId, data));
  }

  setSubmitFn(fn: Function) {
    this.handleSubmit = fn;
  }

  handleCloseModal () {
    const {modalId, dispatch} = this.props;
    dispatch(modalActions.hide(modalId));
  }

  render() {
    const {modalId, modals, children, footer = true, submitText = 'Save'} = this.props;
    const modalProps = modals[modalId];
    if (!(modalProps && modalProps.show)) {
      return null;
    }
    modalProps.modalId = modalId;
    return (
      <ReactModal
        isOpen={modalProps.show}
        style={customStyles}
      >
        <div className="modal" tabIndex="-1" role="dialog" style={{display: 'block'}}>
          <div className={(this.props.large ? 'modal-lg' : '') + ' modal-dialog'} role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.title}</h5>
                <button type="button" className="close" aria-label="Close" onClick={this.handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col">
                  {React.Children.map(children,
                    child => {
                      return React.cloneElement(child,
                        {
                          setSubmitFn: this.setSubmitFn,
                          data: modalProps.data,
                          initData: modalProps.object,
                          modal: modalProps,
                          ...this.props
                        });
                    })}
                </div>
              </div>
              {footer && <div className="modal-footer">
                <button type="button" className="btn btn-primary"
                        onClick={(e)=>{this.handleSubmit(e)}}>{submitText}</button>
                <button type="button" className="btn btn-secondary"
                        onClick={this.handleCloseModal}>Close</button>
              </div>}
            </div>
          </div>
        </div>

      </ReactModal>
    );
  }
}

function mapStateToProps(state) {
  const {modals} = state;
  return {
    modals
  };
}

const connected = connect(mapStateToProps)(Modal);
export {connected as Modal};
