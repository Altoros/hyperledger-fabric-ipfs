import React from 'react';
import {connect} from 'react-redux';

import {userActions} from '../_actions/index';
import {configService} from '../_services/index';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(userActions.logout());

    this.state = {
      username: '',
      orgName: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const {name, value} = e.target;
    this.setState({[name]: value, submitted: false});
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({submitted: true, orgName: configService.get().org}, () => {
      const {username, orgName} = this.state;
      const {dispatch} = this.props;
      if (username) {
        dispatch(userActions.login(username, orgName));
      }
    });
  }

  render() {
    const {username, submitted} = this.state;
    return (
      <div className="col-md-6 offset-md-3">
        <h2>Login</h2>
        <form name="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" className={'form-control ' + (submitted && !username && 'is-invalid')} name="username" value={username} onChange={this.handleChange}/>
            {submitted && !username &&
            <div className="text-danger">Username is required</div>
            }
          </div>
          <div className="form-group">
            <button className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps() {
}

const connected = connect(mapStateToProps)(LoginPage);
export {connected as LoginPage};
