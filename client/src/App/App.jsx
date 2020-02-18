import React from 'react';
import {Route, Switch, HashRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {ScaleLoader} from 'react-spinners';

import {history} from '../_helpers';
import {alertActions, configActions} from '../_actions';
import {Footer, Header, Main} from '../Layout';
import {publicRoutes, privateRoutes} from './routes';
import {configService} from '../_services';

class App extends React.Component {
  constructor(props) {
    super(props);

    const {dispatch} = this.props;
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
    dispatch(configActions.get());
  }

  render() {
    const {config, loading} = this.props;
    const {org} = configService.get();

    if (!config) {
      return null;
    }

    return (
      <HashRouter>
        <Switch>
          {publicRoutes.concat(privateRoutes).map((route, key) => {
            const {component, path} = route;
            return (
              <Route
                exact
                path={path}
                key={key}
                render={(route) =>
                  <div className={'main-section'}>
                    <Header route={route}/>
                    <div
                      className={'overlay d-flex justify-content-center align-items-center ' + (!!loading ? 'visible' : 'invisible')}>
                      <ScaleLoader loading={!!loading}/>
                    </div>
                    <Main component={component} route={route} config={config}/>
                    <Footer/>
                  </div>}
              />
            )
          })}
        </Switch>
      </HashRouter>
    );
  }
}

function mapStateToProps(state) {
  const {config, loading} = state;
  return {
    config,
    loading
  };
}

const connectedApp = connect(mapStateToProps)(App);
export {connectedApp as App};
