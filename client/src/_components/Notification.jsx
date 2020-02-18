// @flow
import React from 'react';
import {connect} from 'react-redux';
import './Notification.css';
import {alertActions} from '../_actions';

type Alert = {
  type: string,
  message: any
}
type Props = {
  dispatch: Function,
  alert: Alert,
  user: any
};
type State = {};

class Notification extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    (this: any).cancel = this.cancel.bind(this);
  }

  render() {
    const {alert} = this.props;
    return (
      <div>
        <div className={'notification ' + ((alert.message) ? 'fadein' : 'fadeout invisible')}>
          {(alert.message) &&
          <div className={`d-flex justify-content-between align-items-between  alert ${alert.type || ''}`}>
            <div className={`m-1 align-items-center message-block`}>
              {alert.message instanceof Array ? (
                alert.message.map((item) =>
                  <div className={`m-1 border`}>
                    <span className={`w-100 message-text`}>{item}</span>
                  </div>)
              ) : (
                <div className={`m-1`}>
                  <span className={`w-100 message-text`}>{alert.message}</span>
                </div>
              )}

            </div>
            <div className={`m-1 d-flex align-items-center`}>
              <span aria-hidden="true" onClick={this.cancel} className="close-btn">&times;</span>
            </div>
          </div>}
        </div>
      </div>
    );
  }

  cancel() {
    this.props.dispatch(alertActions.clear());
  }
}

function mapStateToProps(state) {
  const {alert, authentication} = state;
  const {user} = authentication;
  return {
    alert,
    user
  };
}

const connected = connect(mapStateToProps)(Notification);
export {connected as Notification};
