import React from 'react';
import {connect} from 'react-redux';
import {Notification} from '../_components';

class Main extends React.Component {
  render() {
    const {route} = this.props;
    const Component = this.props.component;
    return (
      <div className="row-custom content-section h-75 overflow-auto">
        <Notification/>
        <Component route={route}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {alert} = state;
  return {
    alert
  };
}

const connected = connect(mapStateToProps)(Main);
export {connected as Main};
