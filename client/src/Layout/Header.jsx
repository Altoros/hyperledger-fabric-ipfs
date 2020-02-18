import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import logo from '../static/logo-altoros.svg';

class Header extends React.Component {
  render() {
    const {user} = this.props;
    const date = new Date().toLocaleDateString();
    return (
      <nav className="row-custom header navbar navbar-light navbar-expand">
        <div className="navbar-brand">
          <NavLink exact to='/' className="nav-link">
            <img src={logo} alt="logo" className={`logo`}/>
          </NavLink>
        </div>
        {user && <div className="container-fluid">
          <div className='ml-5 text-white'>Hi, <b>{user.name}</b></div>
          <div className='nav navbar-nav text-white'>
            {date}
          </div>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <NavLink to='/login' className="nav-link text-white">
                Logout
              </NavLink>
            </li>
          </ul>
        </div>}
      </nav>
    );
  }
}

function mapStateToProps(state) {
  const {authentication} = state;
  const {user} = authentication;
  return {
    user
  };
}

const connected = connect(mapStateToProps)(Header);
export {connected as Header};
